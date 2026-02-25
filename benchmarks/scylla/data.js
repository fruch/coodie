window.BENCHMARK_DATA = {
  "lastUpdate": 1772048447855,
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
      },
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
          "id": "12180cbd6ba1fe58767b71f29249f25bfda100e9",
          "message": "fix(ci): restore Copilot CLI for commit body generation with proper error handling\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T20:58:37+02:00",
          "tree_id": "88189deb7187a7bdcc34f0212767601afc9f02a3",
          "url": "https://github.com/fruch/coodie/commit/12180cbd6ba1fe58767b71f29249f25bfda100e9"
        },
        "date": 1772045995520,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1273.802005029001,
            "unit": "iter/sec",
            "range": "stddev: 0.00023873515058140776",
            "extra": "mean: 785.0513628114699 usec\nrounds: 441"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1954.519158009677,
            "unit": "iter/sec",
            "range": "stddev: 0.00010296114803620449",
            "extra": "mean: 511.6347905324798 usec\nrounds: 845"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 927.2870991045899,
            "unit": "iter/sec",
            "range": "stddev: 0.000980417804226965",
            "extra": "mean: 1.0784146581631766 msec\nrounds: 980"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1879.1681650381836,
            "unit": "iter/sec",
            "range": "stddev: 0.00007585377423151482",
            "extra": "mean: 532.1503517380418 usec\nrounds: 978"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1025.7263425614722,
            "unit": "iter/sec",
            "range": "stddev: 0.00011130817911797578",
            "extra": "mean: 974.9189023485274 usec\nrounds: 809"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1921.743899237131,
            "unit": "iter/sec",
            "range": "stddev: 0.0000845409699385764",
            "extra": "mean: 520.3606996733369 usec\nrounds: 919"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1306.034022975561,
            "unit": "iter/sec",
            "range": "stddev: 0.00010136659670427756",
            "extra": "mean: 765.676837209556 usec\nrounds: 602"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 963.5085515879579,
            "unit": "iter/sec",
            "range": "stddev: 0.00011891264267576242",
            "extra": "mean: 1.0378735075593264 msec\nrounds: 926"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 318.7786382286602,
            "unit": "iter/sec",
            "range": "stddev: 0.0002014810359351535",
            "extra": "mean: 3.1369730592885556 msec\nrounds: 253"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 818.3675495245175,
            "unit": "iter/sec",
            "range": "stddev: 0.00012086256339549418",
            "extra": "mean: 1.221944834666298 msec\nrounds: 375"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 714.8476477543684,
            "unit": "iter/sec",
            "range": "stddev: 0.00014475744612614343",
            "extra": "mean: 1.3988994761910638 msec\nrounds: 588"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1589.9221393066134,
            "unit": "iter/sec",
            "range": "stddev: 0.00009467337351012938",
            "extra": "mean: 628.9616172249249 usec\nrounds: 836"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1135.5284619127965,
            "unit": "iter/sec",
            "range": "stddev: 0.00009189145335214031",
            "extra": "mean: 880.6472347822098 usec\nrounds: 575"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 990.6699852367501,
            "unit": "iter/sec",
            "range": "stddev: 0.00011006806909463959",
            "extra": "mean: 1.0094178837577483 msec\nrounds: 628"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1266.8188592251922,
            "unit": "iter/sec",
            "range": "stddev: 0.00008596243673244731",
            "extra": "mean: 789.3788387485935 usec\nrounds: 831"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1777.8986529922292,
            "unit": "iter/sec",
            "range": "stddev: 0.00011000480938929101",
            "extra": "mean: 562.4617569269122 usec\nrounds: 794"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 677.8550440189402,
            "unit": "iter/sec",
            "range": "stddev: 0.0002448979484372214",
            "extra": "mean: 1.475241659442544 msec\nrounds: 323"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 982.1437806150287,
            "unit": "iter/sec",
            "range": "stddev: 0.0001330223285892075",
            "extra": "mean: 1.0181808608244605 msec\nrounds: 582"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26621.072310845102,
            "unit": "iter/sec",
            "range": "stddev: 0.000027105713181459522",
            "extra": "mean: 37.56422687724011 usec\nrounds: 11147"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46836.20210842785,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019386574274510938",
            "extra": "mean: 21.351005311766233 usec\nrounds: 16567"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 578.5404430765028,
            "unit": "iter/sec",
            "range": "stddev: 0.00011035867260390647",
            "extra": "mean: 1.728487631188414 msec\nrounds: 404"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1558.1491492659304,
            "unit": "iter/sec",
            "range": "stddev: 0.00016062509980325284",
            "extra": "mean: 641.7870846774306 usec\nrounds: 744"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.592392672616892,
            "unit": "iter/sec",
            "range": "stddev: 0.00040121376693638184",
            "extra": "mean: 53.78543889473743 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 442.97746416589666,
            "unit": "iter/sec",
            "range": "stddev: 0.00016212291713146786",
            "extra": "mean: 2.2574511818179004 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1508.3740600878373,
            "unit": "iter/sec",
            "range": "stddev: 0.0000787596075184945",
            "extra": "mean: 662.9655245740349 usec\nrounds: 997"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2106.7187790035705,
            "unit": "iter/sec",
            "range": "stddev: 0.00006648883875469617",
            "extra": "mean: 474.671802409706 usec\nrounds: 830"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1405.5725921219107,
            "unit": "iter/sec",
            "range": "stddev: 0.00009496988189299363",
            "extra": "mean: 711.4538271483783 usec\nrounds: 1024"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 1918.9472616807025,
            "unit": "iter/sec",
            "range": "stddev: 0.00008941700200785402",
            "extra": "mean: 521.1190635453702 usec\nrounds: 897"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 723.8167169390449,
            "unit": "iter/sec",
            "range": "stddev: 0.00012150905275841228",
            "extra": "mean: 1.3815652175441722 msec\nrounds: 570"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 959.5818817174189,
            "unit": "iter/sec",
            "range": "stddev: 0.00011782705285700229",
            "extra": "mean: 1.0421205517243015 msec\nrounds: 783"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 881.7747646021785,
            "unit": "iter/sec",
            "range": "stddev: 0.00010216377890235618",
            "extra": "mean: 1.1340764559656684 msec\nrounds: 704"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1095.9103344571142,
            "unit": "iter/sec",
            "range": "stddev: 0.0000965710576116584",
            "extra": "mean: 912.483410876287 usec\nrounds: 662"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 844.7068116066797,
            "unit": "iter/sec",
            "range": "stddev: 0.00011264524144199501",
            "extra": "mean: 1.1838427088067918 msec\nrounds: 704"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1055.2743616058353,
            "unit": "iter/sec",
            "range": "stddev: 0.00010833699728432911",
            "extra": "mean: 947.6208618186051 usec\nrounds: 825"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1479.8494356425501,
            "unit": "iter/sec",
            "range": "stddev: 0.00020301238263686187",
            "extra": "mean: 675.7444209625288 usec\nrounds: 582"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2036.7463369242635,
            "unit": "iter/sec",
            "range": "stddev: 0.00007403128305767118",
            "extra": "mean: 490.97915723276697 usec\nrounds: 1749"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 699.8345021735647,
            "unit": "iter/sec",
            "range": "stddev: 0.0004315124605931125",
            "extra": "mean: 1.4289092591093655 msec\nrounds: 494"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 824.5329317681878,
            "unit": "iter/sec",
            "range": "stddev: 0.0004014832164252784",
            "extra": "mean: 1.2128078351649678 msec\nrounds: 546"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1526.156725983692,
            "unit": "iter/sec",
            "range": "stddev: 0.00015035259581726683",
            "extra": "mean: 655.2406990543155 usec\nrounds: 1163"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 1976.389776413889,
            "unit": "iter/sec",
            "range": "stddev: 0.00008357779724740547",
            "extra": "mean: 505.97306863956544 usec\nrounds: 845"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1441.9925035516078,
            "unit": "iter/sec",
            "range": "stddev: 0.00009853096593618337",
            "extra": "mean: 693.4848811883652 usec\nrounds: 1010"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 1932.1834402133074,
            "unit": "iter/sec",
            "range": "stddev: 0.00008311209860849883",
            "extra": "mean: 517.549203242112 usec\nrounds: 802"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 195.18543818556628,
            "unit": "iter/sec",
            "range": "stddev: 0.00255666231043628",
            "extra": "mean: 5.123333017544486 msec\nrounds: 171"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 616.3241863463477,
            "unit": "iter/sec",
            "range": "stddev: 0.00018685886362542395",
            "extra": "mean: 1.6225227277354373 msec\nrounds: 393"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 815.3557316050947,
            "unit": "iter/sec",
            "range": "stddev: 0.0001518053082810703",
            "extra": "mean: 1.2264585397976142 msec\nrounds: 691"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1525.6786599579916,
            "unit": "iter/sec",
            "range": "stddev: 0.00010159639643514404",
            "extra": "mean: 655.4460164157597 usec\nrounds: 731"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 944.571641918833,
            "unit": "iter/sec",
            "range": "stddev: 0.00008651527551439818",
            "extra": "mean: 1.0586809466019624 msec\nrounds: 618"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1062.1482025725384,
            "unit": "iter/sec",
            "range": "stddev: 0.00007428742853922048",
            "extra": "mean: 941.4882005900735 usec\nrounds: 678"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5164.148928909432,
            "unit": "iter/sec",
            "range": "stddev: 0.00009780536527490631",
            "extra": "mean: 193.64274999930737 usec\nrounds: 132"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 200258.03742169766,
            "unit": "iter/sec",
            "range": "stddev: 0.000003169887417774149",
            "extra": "mean: 4.993557376647153 usec\nrounds: 122"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4488.883412872816,
            "unit": "iter/sec",
            "range": "stddev: 0.00006812819235547883",
            "extra": "mean: 222.7725489889735 usec\nrounds: 2572"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 202018.40222159456,
            "unit": "iter/sec",
            "range": "stddev: 0.0000045731891124725665",
            "extra": "mean: 4.950044099958266 usec\nrounds: 32449"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 79589.03268583525,
            "unit": "iter/sec",
            "range": "stddev: 0.000021330342340546984",
            "extra": "mean: 12.564545217521829 usec\nrounds: 21098"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 471412.6594757475,
            "unit": "iter/sec",
            "range": "stddev: 4.603881428297603e-7",
            "extra": "mean: 2.121283720110717 usec\nrounds: 37967"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 215792.68405103375,
            "unit": "iter/sec",
            "range": "stddev: 6.916022187409679e-7",
            "extra": "mean: 4.634077398858923 usec\nrounds: 44303"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 515314.7594927976,
            "unit": "iter/sec",
            "range": "stddev: 4.855330289145508e-7",
            "extra": "mean: 1.9405615336619844 usec\nrounds: 52841"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1800.4063154130622,
            "unit": "iter/sec",
            "range": "stddev: 0.00007906606247667389",
            "extra": "mean: 555.4301778654741 usec\nrounds: 1265"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 977.453107365052,
            "unit": "iter/sec",
            "range": "stddev: 0.00012022881483825346",
            "extra": "mean: 1.023066981387709 msec\nrounds: 591"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 695.0609634189508,
            "unit": "iter/sec",
            "range": "stddev: 0.00042213491220621747",
            "extra": "mean: 1.438722720207272 msec\nrounds: 579"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 598.5119326071584,
            "unit": "iter/sec",
            "range": "stddev: 0.0003532218498164997",
            "extra": "mean: 1.6708104642858703 msec\nrounds: 336"
          }
        ]
      },
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
          "id": "aee9586bc2c4db392df5a9d9bb7b4ecb2365e4b4",
          "message": "fix(ci): replace deprecated `gh copilot suggest` with new Copilot CLI (`copilot -p`)\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T21:37:43+02:00",
          "tree_id": "c28b85e8dba671af8bdb421838cb4bc198d76077",
          "url": "https://github.com/fruch/coodie/commit/aee9586bc2c4db392df5a9d9bb7b4ecb2365e4b4"
        },
        "date": 1772048337484,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1229.4657209478323,
            "unit": "iter/sec",
            "range": "stddev: 0.0003155403409364632",
            "extra": "mean: 813.3614325001836 usec\nrounds: 400"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1913.3865395424957,
            "unit": "iter/sec",
            "range": "stddev: 0.00008097381134959086",
            "extra": "mean: 522.6335501655128 usec\nrounds: 907"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 875.3431703622493,
            "unit": "iter/sec",
            "range": "stddev: 0.0010524854439395025",
            "extra": "mean: 1.1424090960647617 msec\nrounds: 864"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1811.3129472724029,
            "unit": "iter/sec",
            "range": "stddev: 0.00010171875021112937",
            "extra": "mean: 552.0857130215225 usec\nrounds: 791"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 989.6027551639735,
            "unit": "iter/sec",
            "range": "stddev: 0.00018113141032201281",
            "extra": "mean: 1.0105064833154227 msec\nrounds: 929"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1798.0598594145192,
            "unit": "iter/sec",
            "range": "stddev: 0.00014040969608362412",
            "extra": "mean: 556.1550105042764 usec\nrounds: 952"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1299.1074208112905,
            "unit": "iter/sec",
            "range": "stddev: 0.00008147814367597667",
            "extra": "mean: 769.7592854757935 usec\nrounds: 599"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 927.4112975089555,
            "unit": "iter/sec",
            "range": "stddev: 0.0002314574342318736",
            "extra": "mean: 1.0782702374728657 msec\nrounds: 918"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 328.29695319374474,
            "unit": "iter/sec",
            "range": "stddev: 0.0001813529453369672",
            "extra": "mean: 3.0460227859923177 msec\nrounds: 257"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 822.4038256295786,
            "unit": "iter/sec",
            "range": "stddev: 0.00009306079211865038",
            "extra": "mean: 1.2159476510635945 msec\nrounds: 470"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 703.4728312911346,
            "unit": "iter/sec",
            "range": "stddev: 0.00014839659480390347",
            "extra": "mean: 1.421519006163504 msec\nrounds: 649"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1612.0190339716153,
            "unit": "iter/sec",
            "range": "stddev: 0.00008203078826733544",
            "extra": "mean: 620.3400697671962 usec\nrounds: 774"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1117.1379195073243,
            "unit": "iter/sec",
            "range": "stddev: 0.0001314697810512479",
            "extra": "mean: 895.1446213919729 usec\nrounds: 589"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1004.1980612688728,
            "unit": "iter/sec",
            "range": "stddev: 0.00008163494615680702",
            "extra": "mean: 995.8194887733915 usec\nrounds: 579"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1286.9641857626648,
            "unit": "iter/sec",
            "range": "stddev: 0.00005977612667790224",
            "extra": "mean: 777.0223997394244 usec\nrounds: 768"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1812.2662247538817,
            "unit": "iter/sec",
            "range": "stddev: 0.00005816642536526739",
            "extra": "mean: 551.7953081842636 usec\nrounds: 782"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 696.5966760527069,
            "unit": "iter/sec",
            "range": "stddev: 0.0001232080419788145",
            "extra": "mean: 1.435550921182312 msec\nrounds: 609"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 980.699137166591,
            "unit": "iter/sec",
            "range": "stddev: 0.00011536422424163577",
            "extra": "mean: 1.0196807176655347 msec\nrounds: 634"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27040.178289463693,
            "unit": "iter/sec",
            "range": "stddev: 0.000026565046583212816",
            "extra": "mean: 36.982004678188595 usec\nrounds: 11757"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 47268.858962725295,
            "unit": "iter/sec",
            "range": "stddev: 0.000001910613837285066",
            "extra": "mean: 21.15557730700815 usec\nrounds: 16428"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 564.4552584323242,
            "unit": "iter/sec",
            "range": "stddev: 0.0001229543345741095",
            "extra": "mean: 1.7716196014850234 msec\nrounds: 404"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1401.049681988379,
            "unit": "iter/sec",
            "range": "stddev: 0.00019979361964197993",
            "extra": "mean: 713.750563492362 usec\nrounds: 504"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.554616434369375,
            "unit": "iter/sec",
            "range": "stddev: 0.0004145462674306999",
            "extra": "mean: 53.89494326315819 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 436.9484689189861,
            "unit": "iter/sec",
            "range": "stddev: 0.0001434476283073021",
            "extra": "mean: 2.288599391305816 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1481.5923969092366,
            "unit": "iter/sec",
            "range": "stddev: 0.00008482703860068425",
            "extra": "mean: 674.9494679414589 usec\nrounds: 889"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 1952.9729530548902,
            "unit": "iter/sec",
            "range": "stddev: 0.00007100254292711503",
            "extra": "mean: 512.0398612975025 usec\nrounds: 894"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1455.627841696575,
            "unit": "iter/sec",
            "range": "stddev: 0.00007030551867866886",
            "extra": "mean: 686.9887833654459 usec\nrounds: 1034"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 1926.7264737092755,
            "unit": "iter/sec",
            "range": "stddev: 0.00006705007452989169",
            "extra": "mean: 519.0150307504886 usec\nrounds: 813"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 726.5153491562221,
            "unit": "iter/sec",
            "range": "stddev: 0.00012126723275416698",
            "extra": "mean: 1.3764334107481748 msec\nrounds: 521"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 979.4560193398047,
            "unit": "iter/sec",
            "range": "stddev: 0.00009914578138649098",
            "extra": "mean: 1.0209748883610341 msec\nrounds: 842"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 861.5578428885437,
            "unit": "iter/sec",
            "range": "stddev: 0.0001042255523461601",
            "extra": "mean: 1.1606881746294613 msec\nrounds: 607"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1041.3281465492016,
            "unit": "iter/sec",
            "range": "stddev: 0.0001009197647740582",
            "extra": "mean: 960.3120815603068 usec\nrounds: 564"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 824.8658822967923,
            "unit": "iter/sec",
            "range": "stddev: 0.00011392102743902513",
            "extra": "mean: 1.2123182949639726 msec\nrounds: 695"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1057.2072225010547,
            "unit": "iter/sec",
            "range": "stddev: 0.0000818682798292537",
            "extra": "mean: 945.8883544460484 usec\nrounds: 821"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1486.3760623445232,
            "unit": "iter/sec",
            "range": "stddev: 0.0001515820342525757",
            "extra": "mean: 672.7772502085766 usec\nrounds: 1199"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2033.5175764176643,
            "unit": "iter/sec",
            "range": "stddev: 0.00007585860968735752",
            "extra": "mean: 491.7587197656018 usec\nrounds: 1538"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 730.3362694311065,
            "unit": "iter/sec",
            "range": "stddev: 0.000195239177555765",
            "extra": "mean: 1.3692322863534454 msec\nrounds: 447"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 807.3515556393477,
            "unit": "iter/sec",
            "range": "stddev: 0.0005260320955240228",
            "extra": "mean: 1.238617790496598 msec\nrounds: 463"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1558.5022617562524,
            "unit": "iter/sec",
            "range": "stddev: 0.00007439597755897091",
            "extra": "mean: 641.6416738934438 usec\nrounds: 1107"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2068.8009339244313,
            "unit": "iter/sec",
            "range": "stddev: 0.00006391646760465313",
            "extra": "mean: 483.371784883643 usec\nrounds: 860"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1494.6820264007426,
            "unit": "iter/sec",
            "range": "stddev: 0.0000697121405189873",
            "extra": "mean: 669.0386198113603 usec\nrounds: 1060"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 1948.0239437075095,
            "unit": "iter/sec",
            "range": "stddev: 0.00006672810546332769",
            "extra": "mean: 513.3407128953377 usec\nrounds: 1644"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 217.07270413282666,
            "unit": "iter/sec",
            "range": "stddev: 0.0005161033560859174",
            "extra": "mean: 4.60675147524813 msec\nrounds: 202"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 612.4806377715007,
            "unit": "iter/sec",
            "range": "stddev: 0.0011612128945167276",
            "extra": "mean: 1.6327046739607658 msec\nrounds: 457"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 843.806678273938,
            "unit": "iter/sec",
            "range": "stddev: 0.0001319188414156132",
            "extra": "mean: 1.185105576606203 msec\nrounds: 607"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1554.4380328482941,
            "unit": "iter/sec",
            "range": "stddev: 0.00007055234822485592",
            "extra": "mean: 643.3193082439172 usec\nrounds: 837"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 954.4374158277582,
            "unit": "iter/sec",
            "range": "stddev: 0.000058403961784763366",
            "extra": "mean: 1.0477376341462123 msec\nrounds: 656"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1075.683432915626,
            "unit": "iter/sec",
            "range": "stddev: 0.00005313599567290594",
            "extra": "mean: 929.6415370919239 usec\nrounds: 674"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5596.027359748462,
            "unit": "iter/sec",
            "range": "stddev: 0.00005427261355334549",
            "extra": "mean: 178.69819708046413 usec\nrounds: 137"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 215143.15071464278,
            "unit": "iter/sec",
            "range": "stddev: 0.0000026530107088697636",
            "extra": "mean: 4.648068026698929 usec\nrounds: 147"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4603.993788469313,
            "unit": "iter/sec",
            "range": "stddev: 0.000058636018946918815",
            "extra": "mean: 217.20272570838316 usec\nrounds: 2789"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 202611.8944757607,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011864501573797987",
            "extra": "mean: 4.935544394308174 usec\nrounds: 34126"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 78707.00327199456,
            "unit": "iter/sec",
            "range": "stddev: 0.00002163211685564374",
            "extra": "mean: 12.705349694794172 usec\nrounds: 16217"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 471185.73202173295,
            "unit": "iter/sec",
            "range": "stddev: 4.373023090584361e-7",
            "extra": "mean: 2.1223053501838125 usec\nrounds: 39083"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 217459.7422471825,
            "unit": "iter/sec",
            "range": "stddev: 6.844473089993107e-7",
            "extra": "mean: 4.598552309803248 usec\nrounds: 47104"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 508482.912060165,
            "unit": "iter/sec",
            "range": "stddev: 3.955947755228322e-7",
            "extra": "mean: 1.966634426215836 usec\nrounds: 49317"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1850.7399692863826,
            "unit": "iter/sec",
            "range": "stddev: 0.00007178401415261059",
            "extra": "mean: 540.3244197430853 usec\nrounds: 1246"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1030.2694830501966,
            "unit": "iter/sec",
            "range": "stddev: 0.00009282292524161133",
            "extra": "mean: 970.6198392282945 usec\nrounds: 622"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 764.4894614078141,
            "unit": "iter/sec",
            "range": "stddev: 0.00023413636749419916",
            "extra": "mean: 1.3080625050847543 msec\nrounds: 590"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 609.0041585190219,
            "unit": "iter/sec",
            "range": "stddev: 0.00022745180990827067",
            "extra": "mean: 1.6420249123286825 msec\nrounds: 365"
          }
        ]
      },
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
          "id": "971b44370e2558b462b3f086bb5c6f1ef4fd207c",
          "message": "fix(ci): use saved SHA to restore detached HEAD after gh-pages bootstrap\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T21:39:38+02:00",
          "tree_id": "05af536a7968e84abc501041233e490440471a7f",
          "url": "https://github.com/fruch/coodie/commit/971b44370e2558b462b3f086bb5c6f1ef4fd207c"
        },
        "date": 1772048447469,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1337.6481193678073,
            "unit": "iter/sec",
            "range": "stddev: 0.00022614741129641563",
            "extra": "mean: 747.5807617272434 usec\nrounds: 533"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1952.4243159750674,
            "unit": "iter/sec",
            "range": "stddev: 0.00013165754236099328",
            "extra": "mean: 512.1837460319615 usec\nrounds: 882"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 978.1795140350868,
            "unit": "iter/sec",
            "range": "stddev: 0.0011597263052308285",
            "extra": "mean: 1.0223072407996991 msec\nrounds: 951"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1891.7148591394027,
            "unit": "iter/sec",
            "range": "stddev: 0.00010454692333232398",
            "extra": "mean: 528.6208939834249 usec\nrounds: 698"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1095.4975844283329,
            "unit": "iter/sec",
            "range": "stddev: 0.00010370673897582599",
            "extra": "mean: 912.8272067544843 usec\nrounds: 977"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1984.8072600505348,
            "unit": "iter/sec",
            "range": "stddev: 0.00007931545944383062",
            "extra": "mean: 503.82725825707587 usec\nrounds: 999"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1341.9673748102991,
            "unit": "iter/sec",
            "range": "stddev: 0.00008973809931498396",
            "extra": "mean: 745.1745987053972 usec\nrounds: 618"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1008.1064440350098,
            "unit": "iter/sec",
            "range": "stddev: 0.00011796477743481039",
            "extra": "mean: 991.958741973156 usec\nrounds: 872"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 365.6907233682014,
            "unit": "iter/sec",
            "range": "stddev: 0.0001517100853173323",
            "extra": "mean: 2.7345511824568063 msec\nrounds: 285"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 825.233601883331,
            "unit": "iter/sec",
            "range": "stddev: 0.00011229761764382631",
            "extra": "mean: 1.2117780925520008 msec\nrounds: 443"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 755.06319272282,
            "unit": "iter/sec",
            "range": "stddev: 0.0001309035876450736",
            "extra": "mean: 1.3243924609725948 msec\nrounds: 679"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1657.6795993508067,
            "unit": "iter/sec",
            "range": "stddev: 0.00009518089141655032",
            "extra": "mean: 603.2528845692665 usec\nrounds: 849"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1200.1112648388837,
            "unit": "iter/sec",
            "range": "stddev: 0.00009084697758227497",
            "extra": "mean: 833.2560732477177 usec\nrounds: 628"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 977.977386993946,
            "unit": "iter/sec",
            "range": "stddev: 0.0002758794552842206",
            "extra": "mean: 1.0225185298749553 msec\nrounds: 636"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1324.0963754955585,
            "unit": "iter/sec",
            "range": "stddev: 0.00007372281175156624",
            "extra": "mean: 755.2320348477189 usec\nrounds: 660"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1860.7013174589936,
            "unit": "iter/sec",
            "range": "stddev: 0.00007461472816821266",
            "extra": "mean: 537.4317686653856 usec\nrounds: 817"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 749.1933480486383,
            "unit": "iter/sec",
            "range": "stddev: 0.00010720472514481229",
            "extra": "mean: 1.3347689252775896 msec\nrounds: 629"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1037.0817138936984,
            "unit": "iter/sec",
            "range": "stddev: 0.00015094667018111937",
            "extra": "mean: 964.2441734369455 usec\nrounds: 640"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 24209.813370745327,
            "unit": "iter/sec",
            "range": "stddev: 0.000025739490654031604",
            "extra": "mean: 41.30556418119194 usec\nrounds: 10447"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 40110.498332409996,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018339326871236958",
            "extra": "mean: 24.931128796073377 usec\nrounds: 14752"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 659.8280537009578,
            "unit": "iter/sec",
            "range": "stddev: 0.00010555591392558178",
            "extra": "mean: 1.5155463524035193 msec\nrounds: 437"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1595.8884400705351,
            "unit": "iter/sec",
            "range": "stddev: 0.00018260190684215924",
            "extra": "mean: 626.6102159094542 usec\nrounds: 704"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 19.36430461892474,
            "unit": "iter/sec",
            "range": "stddev: 0.0006172678394553969",
            "extra": "mean: 51.64141029999598 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 422.22583758346155,
            "unit": "iter/sec",
            "range": "stddev: 0.0002975789557911948",
            "extra": "mean: 2.3684007727317953 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1550.6814153118855,
            "unit": "iter/sec",
            "range": "stddev: 0.00007386411097876407",
            "extra": "mean: 644.8777873557425 usec\nrounds: 870"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2142.6321647399445,
            "unit": "iter/sec",
            "range": "stddev: 0.00007215650514303003",
            "extra": "mean: 466.7156670456181 usec\nrounds: 880"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1518.4246947718843,
            "unit": "iter/sec",
            "range": "stddev: 0.00009087604122929277",
            "extra": "mean: 658.5772764649562 usec\nrounds: 973"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2100.6905697757675,
            "unit": "iter/sec",
            "range": "stddev: 0.00007245092779404543",
            "extra": "mean: 476.0339358817335 usec\nrounds: 811"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 733.3344912805225,
            "unit": "iter/sec",
            "range": "stddev: 0.00012421967647453742",
            "extra": "mean: 1.3636342104321804 msec\nrounds: 556"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1006.5644045877142,
            "unit": "iter/sec",
            "range": "stddev: 0.00012060689657862481",
            "extra": "mean: 993.4784057952029 usec\nrounds: 759"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 913.5584391782752,
            "unit": "iter/sec",
            "range": "stddev: 0.00010702071153244324",
            "extra": "mean: 1.0946207238799928 msec\nrounds: 670"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1152.1877624318404,
            "unit": "iter/sec",
            "range": "stddev: 0.00008731894743703945",
            "extra": "mean: 867.914095780163 usec\nrounds: 616"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 835.5338984001366,
            "unit": "iter/sec",
            "range": "stddev: 0.00030319548416307587",
            "extra": "mean: 1.1968395320821568 msec\nrounds: 639"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1135.8596199508988,
            "unit": "iter/sec",
            "range": "stddev: 0.00008791772125770911",
            "extra": "mean: 880.390483502907 usec\nrounds: 879"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1669.9871827189531,
            "unit": "iter/sec",
            "range": "stddev: 0.00006183592166830936",
            "extra": "mean: 598.8069910643696 usec\nrounds: 1119"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2177.2883583567013,
            "unit": "iter/sec",
            "range": "stddev: 0.00006202274631118497",
            "extra": "mean: 459.2868905773903 usec\nrounds: 1645"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 803.7227898440693,
            "unit": "iter/sec",
            "range": "stddev: 0.00010615739081711503",
            "extra": "mean: 1.2442100841684611 msec\nrounds: 499"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 909.20333544176,
            "unit": "iter/sec",
            "range": "stddev: 0.0004440426334618987",
            "extra": "mean: 1.09986398093681 msec\nrounds: 577"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1641.7386735591977,
            "unit": "iter/sec",
            "range": "stddev: 0.00006753269249818799",
            "extra": "mean: 609.1103389993585 usec\nrounds: 1059"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2139.6846220865864,
            "unit": "iter/sec",
            "range": "stddev: 0.00006915629234471553",
            "extra": "mean: 467.35859559752123 usec\nrounds: 863"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1497.922022829178,
            "unit": "iter/sec",
            "range": "stddev: 0.00009390298274098886",
            "extra": "mean: 667.5914932549457 usec\nrounds: 667"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2048.6969546236073,
            "unit": "iter/sec",
            "range": "stddev: 0.00008865689737098759",
            "extra": "mean: 488.1151395979514 usec\nrounds: 1447"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 213.49466216683282,
            "unit": "iter/sec",
            "range": "stddev: 0.0025439509642568134",
            "extra": "mean: 4.683957855670236 msec\nrounds: 194"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 610.2101431363394,
            "unit": "iter/sec",
            "range": "stddev: 0.00017829943224190043",
            "extra": "mean: 1.638779707692551 msec\nrounds: 390"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 880.6310207317589,
            "unit": "iter/sec",
            "range": "stddev: 0.00014035407448013208",
            "extra": "mean: 1.135549369097913 msec\nrounds: 699"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1604.6272446607268,
            "unit": "iter/sec",
            "range": "stddev: 0.00009130808696989504",
            "extra": "mean: 623.197694871144 usec\nrounds: 780"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 939.788009617002,
            "unit": "iter/sec",
            "range": "stddev: 0.00007208971951128219",
            "extra": "mean: 1.0640697580378118 msec\nrounds: 591"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1007.1779672816284,
            "unit": "iter/sec",
            "range": "stddev: 0.00011405118224911833",
            "extra": "mean: 992.8731887364438 usec\nrounds: 657"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 7266.471334950324,
            "unit": "iter/sec",
            "range": "stddev: 0.00007004414587343095",
            "extra": "mean: 137.61837815146856 usec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 203610.3228342005,
            "unit": "iter/sec",
            "range": "stddev: 0.0000031217011845849717",
            "extra": "mean: 4.911342342963122 usec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 5621.556341584895,
            "unit": "iter/sec",
            "range": "stddev: 0.00006765588404378413",
            "extra": "mean: 177.8866810606524 usec\nrounds: 2038"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 199593.87790098795,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010622572552420323",
            "extra": "mean: 5.010173711320282 usec\nrounds: 27845"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 70872.76389244317,
            "unit": "iter/sec",
            "range": "stddev: 0.000022137367645352687",
            "extra": "mean: 14.109792606897688 usec\nrounds: 19099"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 486871.24484495854,
            "unit": "iter/sec",
            "range": "stddev: 6.178023387184277e-7",
            "extra": "mean: 2.0539311174937938 usec\nrounds: 32824"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 221183.9581790335,
            "unit": "iter/sec",
            "range": "stddev: 8.522682635778573e-7",
            "extra": "mean: 4.521123540028918 usec\nrounds: 42982"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 509072.6574750158,
            "unit": "iter/sec",
            "range": "stddev: 4.3379046817578864e-7",
            "extra": "mean: 1.9643561391805409 usec\nrounds: 47751"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1919.4641947105001,
            "unit": "iter/sec",
            "range": "stddev: 0.00007060908199999883",
            "extra": "mean: 520.978720392762 usec\nrounds: 1123"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1085.6911609660785,
            "unit": "iter/sec",
            "range": "stddev: 0.00010127827718415825",
            "extra": "mean: 921.0722495982852 usec\nrounds: 621"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 855.5358019268918,
            "unit": "iter/sec",
            "range": "stddev: 0.0000990187722596025",
            "extra": "mean: 1.1688581561960782 msec\nrounds: 589"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 666.1845138179542,
            "unit": "iter/sec",
            "range": "stddev: 0.00014393983815418496",
            "extra": "mean: 1.5010856290683248 msec\nrounds: 461"
          }
        ]
      }
    ]
  }
}