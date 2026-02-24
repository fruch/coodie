# Parametrize Patterns

Concrete before/after examples for collapsing repetitive tests in the coodie test suite.

---

## Pattern 1: Type Mapping Functions

**Applies to:** `tests/test_types.py` — `python_type_to_cql_type_str()` tests

### Before (13+ individual functions)

```python
def test_str_to_text():
    assert python_type_to_cql_type_str(str) == "text"

def test_int_to_int():
    assert python_type_to_cql_type_str(int) == "int"

def test_float_to_float():
    assert python_type_to_cql_type_str(float) == "float"
# … repeated 13 times
```

### After (1 parametrized test)

```python
@pytest.mark.parametrize("python_type, expected_cql", [
    pytest.param(str,         "text",      id="str-to-text"),
    pytest.param(int,         "int",       id="int-to-int"),
    pytest.param(float,       "float",     id="float-to-float"),
    pytest.param(bool,        "boolean",   id="bool-to-boolean"),
    pytest.param(bytes,       "blob",      id="bytes-to-blob"),
    pytest.param(UUID,        "uuid",      id="uuid-to-uuid"),
    pytest.param(datetime,    "timestamp", id="datetime-to-timestamp"),
    pytest.param(date,        "date",      id="date-to-date"),
    pytest.param(Decimal,     "decimal",   id="decimal-to-decimal"),
    pytest.param(IPv4Address, "inet",      id="ipv4-to-inet"),
    pytest.param(list[str],   "list<text>", id="list-str"),
    pytest.param(set[int],    "set<int>",   id="set-int"),
    pytest.param(dict[str, int], "map<text, int>", id="dict-str-int"),
    pytest.param(Optional[str],  "text",   id="optional-str"),
    pytest.param(Annotated[UUID, PrimaryKey()], "uuid", id="annotated-unwraps"),
])
def test_python_type_to_cql_type_str(python_type, expected_cql):
    assert python_type_to_cql_type_str(python_type) == expected_cql
```

**Why this works:** The function-under-test is always `python_type_to_cql_type_str`, the assertion is always `==`, and only the input/output pair varies. The `id=` makes failure output readable: `FAILED test_types.py::test_python_type_to_cql_type_str[ipv4-to-inet]`.

---

## Pattern 2: Collection Coercion

**Applies to:** `tests/test_types.py` — `coerce_row_none_collections()` tests

### Before (5+ individual functions)

```python
def test_coerce_none_list_to_empty_list():
    row = {"tags": None, "name": "x"}
    result = coerce_row_none_collections(_FakeDoc, row)
    assert result["tags"] == []
    assert result["name"] == "x"

def test_coerce_none_set_to_empty_set():
    row = {"labels": None}
    result = coerce_row_none_collections(_FakeDoc, row)
    assert result["labels"] == set()

# … repeated for dict, non-None, scalar None
```

### After (1 parametrized test + edge cases)

```python
@pytest.mark.parametrize("field, input_val, expected", [
    pytest.param("tags",        None,       [],     id="none-list-to-empty"),
    pytest.param("labels",      None,       set(),  id="none-set-to-empty"),
    pytest.param("meta",        None,       {},     id="none-dict-to-empty"),
    pytest.param("tags",        ["a", "b"], ["a", "b"], id="non-none-list-unchanged"),
    pytest.param("description", None,       None,   id="scalar-none-unchanged"),
])
def test_coerce_row_none_collections(field, input_val, expected):
    row = {field: input_val}
    result = coerce_row_none_collections(_FakeDoc, row)
    assert result[field] == expected
```

**Note:** Tests that need a different doc class (e.g., `_AnnotatedDoc`, `_OptionalListDoc`) stay as separate functions since they test different annotation behaviors, not the same function with different inputs.

---

## Pattern 3: Filter Operator Parsing

**Applies to:** `tests/test_cql_builder.py` — `parse_filter_kwargs()` tests

### Before

```python
def test_parse_filter_kwargs_eq():
    result = parse_filter_kwargs({"name": "Alice"})
    assert ("name", "=", "Alice") in result

def test_parse_filter_kwargs_gte():
    result = parse_filter_kwargs({"rating__gte": 4})
    assert ("rating", ">=", 4) in result

def test_parse_filter_kwargs_in():
    result = parse_filter_kwargs({"id__in": [1, 2, 3]})
    assert ("id", "IN", [1, 2, 3]) in result
```

### After

```python
@pytest.mark.parametrize("kwargs, expected_triple", [
    pytest.param({"name": "Alice"},      ("name", "=", "Alice"),    id="eq"),
    pytest.param({"rating__gte": 4},     ("rating", ">=", 4),      id="gte"),
    pytest.param({"price__lt": 100},     ("price", "<", 100),      id="lt"),
    pytest.param({"id__in": [1, 2, 3]},  ("id", "IN", [1, 2, 3]), id="in"),
    pytest.param({"name__like": "Al%"},  ("name", "LIKE", "Al%"),  id="like"),
])
def test_parse_filter_kwargs(kwargs, expected_triple):
    result = parse_filter_kwargs(kwargs)
    assert expected_triple in result
```

---

## Pattern 4: Collection Update Operations

**Applies to:** `tests/test_cql_builder.py` — `build_update()` collection op tests

### Before

```python
def test_update_set_add():
    cql, params = build_update("t", "ks", [...], collection_ops={"tags__add": {"new"}})
    assert '"tags" = "tags" + ?' in cql

def test_update_set_remove():
    cql, params = build_update("t", "ks", [...], collection_ops={"tags__remove": {"old"}})
    assert '"tags" = "tags" - ?' in cql

def test_update_list_append():
    cql, params = build_update("t", "ks", [...], collection_ops={"items__append": ["z"]})
    assert '"items" = "items" + ?' in cql
```

### After

```python
@pytest.mark.parametrize("op_key, value, expected_fragment", [
    pytest.param("tags__add",      {"new"}, '"tags" = "tags" + ?',    id="set-add"),
    pytest.param("tags__remove",   {"old"}, '"tags" = "tags" - ?',    id="set-remove"),
    pytest.param("items__append",  ["z"],   '"items" = "items" + ?',  id="list-append"),
    pytest.param("items__prepend", ["a"],   '? + "items"',            id="list-prepend"),
])
def test_update_collection_op(op_key, value, expected_fragment):
    cols = [make_col(name="id", cql_type="uuid", primary_key=True)]
    cql, params = build_update("t", "ks", cols, collection_ops={op_key: value})
    assert expected_fragment in cql
```

---

## Pattern 5: Extended-Type Markers

**Applies to:** `tests/test_types.py` — `BigInt`, `SmallInt`, `TinyInt`, etc.

### Before (8 individual functions)

```python
def test_bigint_marker():
    assert python_type_to_cql_type_str(Annotated[int, BigInt()]) == "bigint"

def test_smallint_marker():
    assert python_type_to_cql_type_str(Annotated[int, SmallInt()]) == "smallint"

# … repeated for TinyInt, VarInt, Double, Ascii, TimeUUID, Time
```

### After

```python
@pytest.mark.parametrize("annotated_type, expected_cql", [
    pytest.param(Annotated[int, BigInt()],       "bigint",   id="bigint"),
    pytest.param(Annotated[int, SmallInt()],      "smallint", id="smallint"),
    pytest.param(Annotated[int, TinyInt()],       "tinyint",  id="tinyint"),
    pytest.param(Annotated[int, VarInt()],        "varint",   id="varint"),
    pytest.param(Annotated[float, Double()],      "double",   id="double"),
    pytest.param(Annotated[str, Ascii()],         "ascii",    id="ascii"),
    pytest.param(Annotated[UUID, TimeUUID()],     "timeuuid", id="timeuuid"),
    pytest.param(Annotated[dt_time, Time()],      "time",     id="time-marker"),
])
def test_extended_type_marker(annotated_type, expected_cql):
    assert python_type_to_cql_type_str(annotated_type) == expected_cql
```

---

## Pattern 6: Frozen Type Wrapping

**Applies to:** `tests/test_types.py` — `Frozen()` annotation tests

### Before (4 individual functions)

```python
def test_frozen_list():
    assert python_type_to_cql_type_str(Annotated[list[str], Frozen()]) == "frozen<list<text>>"

def test_frozen_set():
    assert python_type_to_cql_type_str(Annotated[set[int], Frozen()]) == "frozen<set<int>>"

def test_frozen_map():
    assert python_type_to_cql_type_str(Annotated[dict[str, int], Frozen()]) == "frozen<map<text, int>>"

def test_frozen_tuple():
    assert python_type_to_cql_type_str(Annotated[tuple[str, int], Frozen()]) == "frozen<tuple<text, int>>"
```

### After

```python
@pytest.mark.parametrize("annotated_type, expected_cql", [
    pytest.param(Annotated[list[str], Frozen()],       "frozen<list<text>>",       id="frozen-list"),
    pytest.param(Annotated[set[int], Frozen()],        "frozen<set<int>>",         id="frozen-set"),
    pytest.param(Annotated[dict[str, int], Frozen()],  "frozen<map<text, int>>",   id="frozen-map"),
    pytest.param(Annotated[tuple[str, int], Frozen()], "frozen<tuple<text, int>>", id="frozen-tuple"),
])
def test_frozen_type(annotated_type, expected_cql):
    assert python_type_to_cql_type_str(annotated_type) == expected_cql
```

---

## When NOT to Parametrize

Keep tests as separate functions when:

- **Different assertions:** Tests check different properties of the result, not just equality
- **Different setup:** Each test needs its own fixture or model class
- **Complex control flow:** The test has `if/else` or `try/except` that varies per case
- **Readability:** A parametrize table with 5+ columns becomes harder to read than separate functions

**Rule of thumb:** If the parametrize table needs a lambda or callable column to express the assertion, the tests may be too different to parametrize.
