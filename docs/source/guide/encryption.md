# Client Encryption (SSL/TLS)

coodie supports SSL/TLS encryption for connections to Cassandra and ScyllaDB
through the underlying driver.  No special coodie configuration is needed —
pass SSL options as keyword arguments to `init_coodie()` and they flow directly
to the driver.

---

## CassandraDriver (scylla-driver / cassandra-driver)

SSL is configured via Python's standard `ssl.SSLContext`, which is passed to the
underlying `cassandra.cluster.Cluster` constructor.

### Disable server certificate verification (development only)

```python
import ssl
from coodie.sync import init_coodie

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE  # ⚠️ do not use in production

init_coodie(
    hosts=["127.0.0.1"],
    keyspace="my_ks",
    ssl_context=ssl_context,
)
```

### Verify the server's certificate against a CA (recommended)

```python
import ssl
from coodie.sync import init_coodie

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_REQUIRED
ssl_context.load_verify_locations("/path/to/ca.crt")

init_coodie(
    hosts=["node1", "node2", "node3"],
    keyspace="my_ks",
    ssl_context=ssl_context,
)
```

### Mutual TLS — client certificate authentication

Some deployments require the client to present its own certificate:

```python
import ssl
from coodie.sync import init_coodie

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_REQUIRED
ssl_context.load_verify_locations("/path/to/ca.crt")
ssl_context.load_cert_chain(
    certfile="/path/to/client.crt",
    keyfile="/path/to/client.key",
)

init_coodie(
    hosts=["node1"],
    keyspace="my_ks",
    ssl_context=ssl_context,
)
```

### Async applications

The same `ssl_context` keyword works with the async API:

```python
import ssl
from coodie.aio import init_coodie

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_REQUIRED
ssl_context.load_verify_locations("/path/to/ca.crt")

await init_coodie(
    hosts=["node1"],
    keyspace="my_ks",
    ssl_context=ssl_context,
)
```

### Bring your own session (BYOS)

If you already have a fully configured `cassandra.cluster.Cluster`, pass its
session directly and coodie will use it as-is:

```python
import ssl
from cassandra.cluster import Cluster
from coodie.sync import init_coodie

ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_REQUIRED
ssl_context.load_verify_locations("/path/to/ca.crt")

cluster = Cluster(
    ["node1"],
    ssl_context=ssl_context,
    connect_timeout=30,
)
session = cluster.connect("my_ks")

init_coodie(session=session, keyspace="my_ks")
```

---

## AcsyllaDriver

`acsylla` takes SSL configuration as keyword arguments to
`acsylla.create_cluster()`.  Pass them through `init_coodie_async()`:

### Disable certificate verification (development only)

```python
import acsylla
from coodie.aio import init_coodie

await init_coodie(
    hosts=["127.0.0.1"],
    keyspace="my_ks",
    driver_type="acsylla",
    ssl_enabled=True,
    ssl_verify_flags=acsylla.CassSSLVerifyFlags.CASS_SSL_VERIFY_NONE,
)
```

### Verify the server's certificate against a CA (recommended)

```python
from coodie.aio import init_coodie

ca_pem = open("/path/to/ca.crt").read()

await init_coodie(
    hosts=["node1", "node2"],
    keyspace="my_ks",
    driver_type="acsylla",
    ssl_enabled=True,
    ssl_trusted_cert=ca_pem,
)
```

### Mutual TLS — client certificate authentication

```python
from coodie.aio import init_coodie

ca_pem = open("/path/to/ca.crt").read()
client_cert_pem = open("/path/to/client.crt").read()
client_key_pem = open("/path/to/client.key").read()

await init_coodie(
    hosts=["node1"],
    keyspace="my_ks",
    driver_type="acsylla",
    ssl_enabled=True,
    ssl_trusted_cert=ca_pem,
    ssl_cert=client_cert_pem,
    ssl_private_key=client_key_pem,
)
```

### Bring your own session (BYOS)

Create the `acsylla` session yourself and pass it via `session=`:

```python
import acsylla
from coodie.aio import init_coodie

ca_pem = open("/path/to/ca.crt").read()
cluster = acsylla.create_cluster(
    ["node1"],
    ssl_enabled=True,
    ssl_trusted_cert=ca_pem,
)
session = await cluster.create_session(keyspace="my_ks")

await init_coodie(
    session=session,
    keyspace="my_ks",
    driver_type="acsylla",
)
```

---

## ScyllaDB Server Configuration

To enable client-to-server encryption on the ScyllaDB side, add the following to
`/etc/scylla/scylla.yaml`:

```yaml
client_encryption_options:
  enabled: true
  certificate: /path/to/server.crt
  keyfile: /path/to/server.key
  # Uncomment to require clients to present a certificate:
  # require_client_auth: true
  # truststore: /path/to/ca.crt
```

After editing, restart ScyllaDB:

```bash
sudo systemctl restart scylla-server
```

For Cassandra, edit `cassandra.yaml` in the same way:

```yaml
client_encryption_options:
  enabled: true
  keystore: /path/to/server.keystore
  keystore_password: changeit
```

---

## Generating Self-Signed Certificates for Development

```bash
# 1 — Create a CA key and self-signed certificate
openssl genrsa -out ca.key 4096
openssl req -new -x509 -days 365 -key ca.key -out ca.crt \
    -subj "/CN=Test CA"

# 2 — Create a server key and certificate signing request
openssl genrsa -out server.key 4096
openssl req -new -key server.key -out server.csr \
    -subj "/CN=localhost"

# 3 — Sign the server certificate with the CA
openssl x509 -req -days 365 -in server.csr \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -out server.crt

# 4 — (Optional) Create a client key + certificate for mutual TLS
openssl genrsa -out client.key 4096
openssl req -new -key client.key -out client.csr \
    -subj "/CN=coodie-client"
openssl x509 -req -days 365 -in client.csr \
    -CA ca.crt -CAkey ca.key -CAcreateserial \
    -out client.crt
```

---

## What's Next?

- {doc}`drivers` — driver initialization and connection options
- {doc}`sync-vs-async` — choosing between sync and async APIs
