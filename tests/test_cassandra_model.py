import json
from datetime import datetime
from functools import partial
from uuid import UUID, uuid4

from cassandra.cqlengine import columns, management
from pydantic.json import custom_pydantic_encoder
from pydantic.main import Field

from coodie import ColumnFamily, Indexed, PrimaryKey

# TODO: find out how to make mypy happy with function calls in annotations


class ProductReview(ColumnFamily):
    uuid: PrimaryKey(UUID) = Field(  # type: ignore
        default_factory=uuid4
    )  # default factory isn't used in cassandra model
    name: Indexed(str)  # type: ignore
    product: columns.Text(index=True, required=False) = Field(default=None)  # type: ignore
    rating: int = columns.Integer(required=True)
    review: str | None
    blob: bytes | None
    # counter: columns.Counter(required=False)
    date: datetime = datetime.now()

    __keyspace__ = "ks"


def test_01(scylla_1_node_cluster):
    management.sync_table(model=ProductReview, keyspaces=("ks",))

    # TODO: check why typing is breaking here:
    """
    tests/test_cassandra_model.py:31: error: Argument "name" to "ProductReview" has incompatible type "str"; expected "Dict[Any, Any]"  [arg-type]
    tests/test_cassandra_model.py:31: error: Argument "rating" to "ProductReview" has incompatible type "int"; expected "Dict[Any, Any]"  [arg-type]
    tests/test_cassandra_model.py:31: error: Argument "review" to "ProductReview" has incompatible type "str"; expected "Dict[Any, Any]"  [arg-type]
    """
    review = ProductReview(name="test", rating=20, review="Excellent course!")  # type: ignore
    assert review.uuid == review["uuid"]
    assert review.rating == 20
    assert review.name == review["name"]
    assert review.product == review["product"]

    # TODO: put this encoder in the library
    encoder = partial(custom_pydantic_encoder, {columns.Column: lambda x: x.value})
    print(json.dumps(review, indent=4, default=encoder))

    review.save()

    all_products = ProductReview.all()
    product = list(all_products)[0]
    print(product.dict())
    assert product
    assert product.dict()

    assert management._get_create_table(ProductReview) == (
        'CREATE TABLE ks.product_review ("uuid" uuid , "name" text , "product" text ,'
        ' "rating" int , PRIMARY KEY (("uuid")))'
    )
