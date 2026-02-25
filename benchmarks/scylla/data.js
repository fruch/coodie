window.BENCHMARK_DATA = {
  "lastUpdate": 1772044771216,
  "repoUrl": "https://github.com/fruch/coodie",
  "entries": {
    "coodie benchmarks (scylla)": [
      {
        "commit": {
          "author": {
            "email": "198982749+Copilot@users.noreply.github.com",
            "name": "copilot-swe-agent[bot]",
            "username": "Copilot"
          },
          "committer": {
            "email": "israel.fruchter@gmail.com",
            "name": "Israel Fruchter",
            "username": "fruch"
          },
          "distinct": true,
          "id": "0a37e77b127ca97899603815e0c1d0c3758b1d5e",
          "message": "ci: add workflow_dispatch trigger for manual testing of rebase/squash workflow\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T20:38:03+02:00",
          "tree_id": "3539edd5716ab6c7f7ce25f92e943b12f5457d79",
          "url": "https://github.com/fruch/coodie/commit/0a37e77b127ca97899603815e0c1d0c3758b1d5e"
        },
        "date": 1772044770494,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1280.4980842823782,
            "unit": "iter/sec",
            "range": "stddev: 0.00027877074100304724",
            "extra": "mean: 780.946111731533 usec\nrounds: 358"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1902.2945126827358,
            "unit": "iter/sec",
            "range": "stddev: 0.00008275812812927521",
            "extra": "mean: 525.6809570405252 usec\nrounds: 838"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 917.4568021429428,
            "unit": "iter/sec",
            "range": "stddev: 0.0008286638561752669",
            "extra": "mean: 1.089969574223285 msec\nrounds: 869"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1825.83197244896,
            "unit": "iter/sec",
            "range": "stddev: 0.00008208761268677802",
            "extra": "mean: 547.695524609921 usec\nrounds: 833"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1042.352405341081,
            "unit": "iter/sec",
            "range": "stddev: 0.000093732240192122",
            "extra": "mean: 959.3684390000305 usec\nrounds: 1000"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1968.6900960271714,
            "unit": "iter/sec",
            "range": "stddev: 0.00006460402318091753",
            "extra": "mean: 507.9519636015877 usec\nrounds: 1044"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1316.093332714053,
            "unit": "iter/sec",
            "range": "stddev: 0.00006914584815920243",
            "extra": "mean: 759.8245315457954 usec\nrounds: 634"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 991.5050480480692,
            "unit": "iter/sec",
            "range": "stddev: 0.00009538839288300403",
            "extra": "mean: 1.0085677344443726 msec\nrounds: 900"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 332.12922639982037,
            "unit": "iter/sec",
            "range": "stddev: 0.0001260049024507217",
            "extra": "mean: 3.010876250909007 msec\nrounds: 275"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 845.0317011571947,
            "unit": "iter/sec",
            "range": "stddev: 0.0000841156741512949",
            "extra": "mean: 1.1833875565030167 msec\nrounds: 469"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 718.6398655729673,
            "unit": "iter/sec",
            "range": "stddev: 0.00012213451663974656",
            "extra": "mean: 1.3915175707692002 msec\nrounds: 650"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1660.5605470021892,
            "unit": "iter/sec",
            "range": "stddev: 0.00007581195623658222",
            "extra": "mean: 602.2062861876975 usec\nrounds: 905"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1172.7672529223237,
            "unit": "iter/sec",
            "range": "stddev: 0.00006723761347820409",
            "extra": "mean: 852.6841088955895 usec\nrounds: 652"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1025.4706121620245,
            "unit": "iter/sec",
            "range": "stddev: 0.00008573025703911774",
            "extra": "mean: 975.1620262346433 usec\nrounds: 648"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1307.6407310312102,
            "unit": "iter/sec",
            "range": "stddev: 0.00006806941693383478",
            "extra": "mean: 764.7360442890124 usec\nrounds: 858"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1869.969221623665,
            "unit": "iter/sec",
            "range": "stddev: 0.00006059253775630661",
            "extra": "mean: 534.7681600511669 usec\nrounds: 781"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 700.8305915690751,
            "unit": "iter/sec",
            "range": "stddev: 0.00016097219217028595",
            "extra": "mean: 1.4268783526716788 msec\nrounds: 655"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1065.8274798914333,
            "unit": "iter/sec",
            "range": "stddev: 0.0000868617215644599",
            "extra": "mean: 938.2381472298514 usec\nrounds: 686"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27038.3909804145,
            "unit": "iter/sec",
            "range": "stddev: 0.000025554093076655564",
            "extra": "mean: 36.98444928636319 usec\nrounds: 11910"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46838.056086979566,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019494778423362242",
            "extra": "mean: 21.350160180494516 usec\nrounds: 17293"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 587.5629893310731,
            "unit": "iter/sec",
            "range": "stddev: 0.00009799649381249177",
            "extra": "mean: 1.7019451840192945 msec\nrounds: 413"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1561.6406426504197,
            "unit": "iter/sec",
            "range": "stddev: 0.00017870518823188917",
            "extra": "mean: 640.3521864689676 usec\nrounds: 606"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.798983242941077,
            "unit": "iter/sec",
            "range": "stddev: 0.0007395684120147007",
            "extra": "mean: 53.1943662631592 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 451.9714592206742,
            "unit": "iter/sec",
            "range": "stddev: 0.00013148374658985082",
            "extra": "mean: 2.2125290869566876 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1517.7642417650404,
            "unit": "iter/sec",
            "range": "stddev: 0.00005718264550137953",
            "extra": "mean: 658.8638554543086 usec\nrounds: 1100"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2090.2202014699446,
            "unit": "iter/sec",
            "range": "stddev: 0.00005076735793311326",
            "extra": "mean: 478.41849356194695 usec\nrounds: 932"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1457.1048308623938,
            "unit": "iter/sec",
            "range": "stddev: 0.00006341545640527652",
            "extra": "mean: 686.2924196113918 usec\nrounds: 1132"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2008.0329803155223,
            "unit": "iter/sec",
            "range": "stddev: 0.00006746815113646547",
            "extra": "mean: 497.9997887499188 usec\nrounds: 800"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 736.9765466659527,
            "unit": "iter/sec",
            "range": "stddev: 0.00010288592981416532",
            "extra": "mean: 1.3568952831999241 msec\nrounds: 625"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 968.5510201155015,
            "unit": "iter/sec",
            "range": "stddev: 0.00009890081703054177",
            "extra": "mean: 1.032470132426011 msec\nrounds: 808"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 879.3334141107815,
            "unit": "iter/sec",
            "range": "stddev: 0.00010348377691341716",
            "extra": "mean: 1.1372250661158392 msec\nrounds: 726"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1094.6408171769453,
            "unit": "iter/sec",
            "range": "stddev: 0.00008587537622911949",
            "extra": "mean: 913.5416698410517 usec\nrounds: 630"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 829.4720801314689,
            "unit": "iter/sec",
            "range": "stddev: 0.0002447381252267963",
            "extra": "mean: 1.2055860877698295 msec\nrounds: 695"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1090.600623601731,
            "unit": "iter/sec",
            "range": "stddev: 0.00008323919684124943",
            "extra": "mean: 916.9259382022719 usec\nrounds: 890"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1616.2834223372654,
            "unit": "iter/sec",
            "range": "stddev: 0.00005694930894714689",
            "extra": "mean: 618.7033698297332 usec\nrounds: 1233"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2109.917372940456,
            "unit": "iter/sec",
            "range": "stddev: 0.00005456470142997054",
            "extra": "mean: 473.9522091362111 usec\nrounds: 1817"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 727.4489177961923,
            "unit": "iter/sec",
            "range": "stddev: 0.0004481083592512286",
            "extra": "mean: 1.3746669704719634 msec\nrounds: 508"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 890.28193737695,
            "unit": "iter/sec",
            "range": "stddev: 0.0001664169040173528",
            "extra": "mean: 1.1232396817420713 msec\nrounds: 597"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1611.8587085643444,
            "unit": "iter/sec",
            "range": "stddev: 0.00005799248359812254",
            "extra": "mean: 620.4017726160895 usec\nrounds: 1227"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2163.173724688779,
            "unit": "iter/sec",
            "range": "stddev: 0.00005206328603373355",
            "extra": "mean: 462.283721638618 usec\nrounds: 952"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1494.6500641429225,
            "unit": "iter/sec",
            "range": "stddev: 0.00006437899850111317",
            "extra": "mean: 669.0529268290168 usec\nrounds: 1148"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 1956.6889707840664,
            "unit": "iter/sec",
            "range": "stddev: 0.00006425425860291191",
            "extra": "mean: 511.0674281560903 usec\nrounds: 1719"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 208.01925491724626,
            "unit": "iter/sec",
            "range": "stddev: 0.0018788147326910386",
            "extra": "mean: 4.8072472925538445 msec\nrounds: 188"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 635.0330821338702,
            "unit": "iter/sec",
            "range": "stddev: 0.00014798919178933193",
            "extra": "mean: 1.5747211100242993 msec\nrounds: 409"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 843.5855772304941,
            "unit": "iter/sec",
            "range": "stddev: 0.0001332499893573731",
            "extra": "mean: 1.185416188933691 msec\nrounds: 741"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1587.7330786618488,
            "unit": "iter/sec",
            "range": "stddev: 0.00007692991363477564",
            "extra": "mean: 629.8287876214093 usec\nrounds: 824"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 957.1616800490547,
            "unit": "iter/sec",
            "range": "stddev: 0.00005677446881457177",
            "extra": "mean: 1.0447555735293852 msec\nrounds: 680"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1057.4022125843783,
            "unit": "iter/sec",
            "range": "stddev: 0.00007310288240792642",
            "extra": "mean: 945.7139280576287 usec\nrounds: 695"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5735.581329827987,
            "unit": "iter/sec",
            "range": "stddev: 0.000054196865161922335",
            "extra": "mean: 174.35024324378128 usec\nrounds: 148"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 214852.28536708257,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021137488279514454",
            "extra": "mean: 4.654360544927253 usec\nrounds: 147"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4709.2373369861425,
            "unit": "iter/sec",
            "range": "stddev: 0.0000571318110590367",
            "extra": "mean: 212.34860943321846 usec\nrounds: 2947"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 206914.05793977738,
            "unit": "iter/sec",
            "range": "stddev: 0.0000012631964683045623",
            "extra": "mean: 4.832924403285597 usec\nrounds: 36073"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 79411.01898598598,
            "unit": "iter/sec",
            "range": "stddev: 0.000019500190821433392",
            "extra": "mean: 12.592710845033665 usec\nrounds: 28732"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 500406.5352883694,
            "unit": "iter/sec",
            "range": "stddev: 4.550914643278338e-7",
            "extra": "mean: 1.9983751799399054 usec\nrounds: 37510"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 219513.49996821463,
            "unit": "iter/sec",
            "range": "stddev: 7.695353596784876e-7",
            "extra": "mean: 4.555528476129255 usec\nrounds: 47531"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 509483.70357884717,
            "unit": "iter/sec",
            "range": "stddev: 5.116572927834078e-7",
            "extra": "mean: 1.9627713172679353 usec\nrounds: 49291"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1844.402594075447,
            "unit": "iter/sec",
            "range": "stddev: 0.00008703946677290645",
            "extra": "mean: 542.18097676298 usec\nrounds: 1248"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1062.4629413062473,
            "unit": "iter/sec",
            "range": "stddev: 0.000098724741195859",
            "extra": "mean: 941.2092988114464 usec\nrounds: 589"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 791.1364445492445,
            "unit": "iter/sec",
            "range": "stddev: 0.0001762933524708803",
            "extra": "mean: 1.2640044671052373 msec\nrounds: 608"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 620.4019081097783,
            "unit": "iter/sec",
            "range": "stddev: 0.00021496191547863667",
            "extra": "mean: 1.611858356539827 msec\nrounds: 474"
          }
        ]
      }
    ]
  }
}