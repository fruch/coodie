# User-Defined Types (UDT)

Cassandra and ScyllaDB support **User-Defined Types (UDTs)** — named struct-like
types that bundle multiple fields into a single column value.  coodie provides
full UDT support through the `UserType` base class.

## Defining a UserType

A UDT is declared the same way as a Document — inherit from `UserType` and
add standard Pydantic type annotations:

```python
from coodie.usertype import UserType

class Address(UserType):
    street: str
    city: str
    state: str
    zipcode: int
```

### Type Name Resolution

By default, the CQL type name is the **snake_case** of the class name:

| Class Name | CQL Type Name |
|---|---|
| `Address` | `address` |
| `ShippingAddress` | `shipping_address` |
| `PhoneNumber` | `phone_number` |

Override the name with `Settings.__type_name__`:

```python
class Address(UserType):
    street: str
    city: str

    class Settings:
        __type_name__ = "my_address"   # CQL type name override
        keyspace = "my_ks"             # keyspace for sync_type()
```

Check the resolved name:

```python
Address.type_name()  # → "address" or "my_address" if overridden
```

## Using UDTs in Documents

Simply use the `UserType` subclass as a field type annotation in your Document.
coodie automatically detects `UserType` subclasses and maps them to
`frozen<type_name>` in CQL:

```python
from typing import Annotated
from uuid import UUID, uuid4
from pydantic import Field
from coodie.sync import Document
from coodie.fields import PrimaryKey

class User(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    home_address: Address                       # → frozen<address>
    work_address: Address                       # → frozen<address>
    alt_addresses: list[Address] = []           # → list<frozen<address>>
    contacts: dict[str, Address] = {}           # → map<text, frozen<address>>

    class Settings:
        keyspace = "my_ks"
```

### UDTs in Collections

UDTs can be used inside any collection type.  They are always `frozen` in CQL:

| Python Type | CQL Type |
|---|---|
| `Address` | `frozen<address>` |
| `list[Address]` | `list<frozen<address>>` |
| `set[Address]` | `set<frozen<address>>` |
| `dict[str, Address]` | `map<text, frozen<address>>` |
| `tuple[Address, int]` | `tuple<frozen<address>, int>` |
| `Optional[Address]` | `frozen<address>` (nullable) |

### Frozen Semantics

UDTs are **always frozen** in coodie.  There are several reasons for this
design choice:

1. **CQL requires frozen in most contexts.** UDTs *must* be frozen when used
   inside collections (`list<frozen<udt>>`), as part of a primary key, or
   nested inside another UDT.  Only top-level column UDTs in Cassandra 3.6+
   and ScyllaDB may be non-frozen.

2. **Non-frozen UDTs are limited.** A non-frozen UDT allows partial field
   updates (e.g. `UPDATE ... SET address.city = 'NYC'`), but cannot be used
   inside collections, in primary keys, or nested inside other UDTs.  In
   practice, most applications use UDTs inside collections or as nested
   structures, making frozen the only option.

3. **Consistent behavior everywhere.** By always using frozen, a UDT field
   produces the same CQL whether it appears as a top-level column, inside a
   `list`, `set`, or `map`, or nested inside another UDT.  This avoids
   subtle schema errors when refactoring.

4. **Simpler mental model.** With always-frozen UDTs, the entire value is
   read and written atomically.  To update a single field, update the Python
   object and call `save()` — Pydantic re-serializes the whole value.  This
   is natural for an ORM that works with full model instances.

#### Comparison with cqlengine

cqlengine defaults to frozen UDTs as well, but since Cassandra 3.6+ it
supports non-frozen UDTs for top-level columns via `frozen=False`:

```python
# cqlengine — frozen (default)
address = columns.UserDefinedType(Address)                # frozen<address>
# cqlengine — non-frozen (Cassandra 3.6+ only, top-level columns only)
address = columns.UserDefinedType(Address, frozen=False)  # address (non-frozen)
```

Non-frozen UDTs enable partial field updates in CQL:

```sql
-- Only possible with non-frozen UDTs
UPDATE users SET address.city = 'New York' WHERE id = ?;
```

However, non-frozen UDTs come with significant restrictions:
- **Cannot be used inside collections** — `list<address>` is invalid; must be
  `list<frozen<address>>`
- **Cannot be used in primary keys** — partition or clustering keys require frozen
- **Cannot be nested inside other UDTs** — inner UDTs must be frozen
- **ScyllaDB compatibility** — ScyllaDB support for non-frozen UDTs mirrors
  Cassandra but is limited to top-level columns only

coodie always emits `frozen<type_name>` so that UDT fields work uniformly in
all positions.  The `Frozen()` marker is accepted but redundant on UDT fields:

```python
# Both produce the same CQL: frozen<address>
home: Address
home: Annotated[Address, Frozen()]   # Frozen() is redundant but accepted
```

```{note}
Non-frozen UDT support (for partial field updates on top-level columns) may
be added in a future coodie release.  See the
[UDT support plan](https://github.com/fruch/coodie/blob/main/docs/plans/udt-support.md)
for the roadmap.
```

## Nested UDTs

UserTypes can reference other UserTypes as fields:

```python
class PhoneNumber(UserType):
    country_code: str
    number: str

class Contact(UserType):
    name: str
    phone: PhoneNumber      # nested UDT → frozen<phone_number>
    address: Address         # another nested UDT → frozen<address>
```

## Syncing UDTs

### Explicit sync_type()

Create or update a UDT in the database with `sync_type()`:

```python
# Sync — creates the type if it doesn't exist
Address.sync_type()

# Async
await Address.sync_type_async()

# Specify keyspace explicitly
Address.sync_type(keyspace="my_ks")
```

### Automatic Dependency Resolution

When syncing a UDT that references other UDTs, coodie automatically resolves
dependencies in the correct order:

```python
# Syncs PhoneNumber and Address first, then Contact
Contact.sync_type()
```

coodie performs depth-first topological sorting and raises `InvalidQueryError`
if a circular dependency is detected (CQL does not support circular UDT
references).

### sync_type() Before sync_table()

UDTs must exist in the database before any table that references them can be
created.  Sync your UDTs before calling `sync_table()`:

```python
Address.sync_type()
Contact.sync_type()    # auto-syncs PhoneNumber and Address dependencies
User.sync_table()      # table references Contact and Address
```

## Serialization

UDT instances are serialized and deserialized via Pydantic's built-in
`model_dump()` and `model_validate()`:

```python
# Create
addr = Address(street="123 Main St", city="Springfield", state="IL", zipcode=62704)

# Serialize to dict (for INSERT)
data = addr.model_dump()
# → {"street": "123 Main St", "city": "Springfield", "state": "IL", "zipcode": 62704}

# Deserialize from dict (from SELECT result)
addr = Address.model_validate(data)

# Nested UDTs serialize recursively
contact = Contact(name="Alice", phone=PhoneNumber(country_code="+1", number="555-1234"), address=addr)
contact.model_dump()
# → {"name": "Alice", "phone": {"country_code": "+1", "number": "555-1234"}, "address": {...}}
```

## Extracting UDT Dependencies

For advanced use cases, you can extract all UDT classes referenced by a
Document in topological order:

```python
from coodie.usertype import extract_udt_classes

udts = extract_udt_classes(User)
# → [PhoneNumber, Address, Contact]  (dependencies before dependents)

# Sync all UDTs in order
for udt_cls in udts:
    udt_cls.sync_type(keyspace="my_ks")
```

## Complete Example

```python
from typing import Annotated, Optional
from uuid import UUID, uuid4
from pydantic import Field
from coodie.sync import Document, init_coodie
from coodie.fields import PrimaryKey
from coodie.usertype import UserType

# Connect
init_coodie(hosts=["127.0.0.1"], keyspace="my_ks")

# Define UDTs
class Address(UserType):
    street: str
    city: str
    state: str
    zipcode: int

class PhoneNumber(UserType):
    country_code: str
    number: str

class Contact(UserType):
    name: str
    phone: PhoneNumber
    address: Address

# Define Document with UDT fields
class Employee(Document):
    id: Annotated[UUID, PrimaryKey()] = Field(default_factory=uuid4)
    name: str
    office: Address
    emergency_contact: Optional[Contact] = None
    past_addresses: list[Address] = []

    class Settings:
        keyspace = "my_ks"

# Sync types and table
Contact.sync_type()     # auto-syncs PhoneNumber and Address first
Employee.sync_table()

# Create and save
emp = Employee(
    name="Alice",
    office=Address(street="456 Corp Ave", city="Tech City", state="CA", zipcode=94000),
    emergency_contact=Contact(
        name="Bob",
        phone=PhoneNumber(country_code="+1", number="555-9876"),
        address=Address(street="789 Home St", city="Hometown", state="TX", zipcode=75000),
    ),
    past_addresses=[
        Address(street="111 Old Rd", city="Oldtown", state="NY", zipcode=10001),
    ],
)
emp.save()

# Query
found = Employee.get(id=emp.id)
print(found.office.city)                          # → "Tech City"
print(found.emergency_contact.phone.number)       # → "555-9876"
print(len(found.past_addresses))                  # → 1
```

## What's Next?

- {doc}`field-types` — all type annotations and markers
- {doc}`collections` — list, set, map, and tuple fields
- {doc}`crud` — save, insert, update, delete operations
