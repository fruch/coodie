import os
import shutil
import tempfile

import pytest
from cassandra.cluster import Cluster  # pylint: disable=no-name-in-module
from cassandra.cqlengine import connection
from ccmlib.scylla_cluster import ScyllaCluster
from ccmlib.scylla_node import ScyllaNode


def pytest_addoption(parser):
    parser.addoption(
        "--scylla-version", help="run all combinations", default="release:4.6.3"
    )
    parser.addoption("--scylla-directory", help="run all combinations")
    parser.addoption(
        "--keep-cluster",
        action="store_true",
        help="decide if to remove cluster directory",
    )


@pytest.fixture(scope="session")
def test_path(request):
    dtest_root = os.path.join(os.path.expanduser("~"), ".cql-test")
    if not os.path.exists(dtest_root):
        os.makedirs(dtest_root)
    temp_dir = tempfile.mkdtemp(dir=dtest_root, prefix="cql-test-")

    yield temp_dir

    keep_cluster = request.config.getoption("--keep-cluster", False)
    if not keep_cluster:
        shutil.rmtree(temp_dir, ignore_errors=True)


@pytest.fixture(scope="session")
def scylla_1_node_cluster(request, test_path):  # pylint: disable=redefined-outer-name
    name = "cqlengine-test"

    scylla_version = request.config.getoption("--scylla-version", None)
    scylla_directory = request.config.getoption("--scylla-directory", None)

    if scylla_version and scylla_directory:
        raise ValueError(
            "can't use both --scylla-version and --scylla-directory, choose one"
        )
    if not scylla_version and not scylla_directory:
        raise ValueError(
            "need to use --scylla-version or --scylla-directory, choose one"
        )

    if scylla_version:
        cluster = ScyllaCluster(test_path, name, cassandra_version=scylla_version)

    if scylla_directory:
        cluster = ScyllaCluster(
            test_path,
            name,
            cassandra_dir=scylla_directory,
            install_dir=scylla_directory,
        )

    _id = 2
    cluster.set_id(_id)
    cluster.set_ipprefix("127.0.%d." % _id)
    cluster.set_configuration_options({"skip_wait_for_gossip_to_settle": 0})
    cluster.populate(1)
    cluster.start()
    yield cluster

    cluster.stop()
    keep_cluster = request.config.getoption("--keep-cluster", False)
    if not keep_cluster:
        cluster.remove()


@pytest.fixture(scope="session", autouse=True)
def register_cqlengine(scylla_1_node_cluster):

    node1: ScyllaNode = scylla_1_node_cluster.nodelist()[0]
    node_ip, node_port = node1.network_interfaces["binary"]
    node1.wait_for_binary_interface()

    session = Cluster([node_ip]).connect()
    ddl = "CREATE KEYSPACE ks WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1'}"
    session.execute(ddl)
    connection.register_connection("cluster1", session=session, default=True)
