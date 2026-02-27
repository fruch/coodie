window.BENCHMARK_DATA = {
  "lastUpdate": 1772151495108,
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
          "id": "5213d4350e84197a8a0c2aa7d742f2be3b464a81",
          "message": "docs(plans): add Phase 3 benchmark results from CI run #22404800091\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T21:42:06+02:00",
          "tree_id": "a8cb4316df0bd3b4d25c2a417c4c2aee19f952bc",
          "url": "https://github.com/fruch/coodie/commit/5213d4350e84197a8a0c2aa7d742f2be3b464a81"
        },
        "date": 1772048596872,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1306.8841480299513,
            "unit": "iter/sec",
            "range": "stddev: 0.00027143849714268746",
            "extra": "mean: 765.1787662337472 usec\nrounds: 385"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2016.2507828186797,
            "unit": "iter/sec",
            "range": "stddev: 0.0000838783355171049",
            "extra": "mean: 495.9700492227555 usec\nrounds: 772"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 893.5958170230542,
            "unit": "iter/sec",
            "range": "stddev: 0.0010472842847384272",
            "extra": "mean: 1.1190741730768425 msec\nrounds: 884"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1769.4406424266772,
            "unit": "iter/sec",
            "range": "stddev: 0.00012246252429796116",
            "extra": "mean: 565.1503509202561 usec\nrounds: 815"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1050.8383306842077,
            "unit": "iter/sec",
            "range": "stddev: 0.00011601107561803229",
            "extra": "mean: 951.621168356976 usec\nrounds: 986"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1926.4586742480453,
            "unit": "iter/sec",
            "range": "stddev: 0.00008875740049697374",
            "extra": "mean: 519.0871796875321 usec\nrounds: 896"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1311.021997877035,
            "unit": "iter/sec",
            "range": "stddev: 0.00009815009824785873",
            "extra": "mean: 762.7637077175827 usec\nrounds: 609"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 978.1105189397256,
            "unit": "iter/sec",
            "range": "stddev: 0.00012836229979620766",
            "extra": "mean: 1.0223793534947385 msec\nrounds: 744"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 316.65412262730246,
            "unit": "iter/sec",
            "range": "stddev: 0.0002184051838178625",
            "extra": "mean: 3.158019834710904 msec\nrounds: 242"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 856.5575232355109,
            "unit": "iter/sec",
            "range": "stddev: 0.00013854097635798",
            "extra": "mean: 1.1674639155846276 msec\nrounds: 462"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 690.7207614804172,
            "unit": "iter/sec",
            "range": "stddev: 0.00018904174212359932",
            "extra": "mean: 1.4477630552999545 msec\nrounds: 651"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1583.6154480338907,
            "unit": "iter/sec",
            "range": "stddev: 0.00010213736045497698",
            "extra": "mean: 631.4664341280152 usec\nrounds: 797"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1142.6573434377626,
            "unit": "iter/sec",
            "range": "stddev: 0.0001082517850333469",
            "extra": "mean: 875.1529981782918 usec\nrounds: 549"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1032.6342556360223,
            "unit": "iter/sec",
            "range": "stddev: 0.00012063472857466281",
            "extra": "mean: 968.3970820666585 usec\nrounds: 658"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1265.2923322481392,
            "unit": "iter/sec",
            "range": "stddev: 0.00008971200119273909",
            "extra": "mean: 790.3311942333717 usec\nrounds: 659"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1879.4014322919932,
            "unit": "iter/sec",
            "range": "stddev: 0.00007902688650022132",
            "extra": "mean: 532.0843023836937 usec\nrounds: 797"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 695.7908964668226,
            "unit": "iter/sec",
            "range": "stddev: 0.00014088543821701532",
            "extra": "mean: 1.437213399999813 msec\nrounds: 605"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 993.1575282154346,
            "unit": "iter/sec",
            "range": "stddev: 0.00012204817532786194",
            "extra": "mean: 1.0068896137724095 msec\nrounds: 668"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27253.86300978309,
            "unit": "iter/sec",
            "range": "stddev: 0.00002667659133874341",
            "extra": "mean: 36.692046174923476 usec\nrounds: 11673"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46702.799752475854,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025979862426889904",
            "extra": "mean: 21.411992542202718 usec\nrounds: 16895"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 580.415827852491,
            "unit": "iter/sec",
            "range": "stddev: 0.0001379645193470112",
            "extra": "mean: 1.72290270528967 msec\nrounds: 397"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1603.1462797266884,
            "unit": "iter/sec",
            "range": "stddev: 0.0001794971079439268",
            "extra": "mean: 623.7733965053299 usec\nrounds: 744"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.592366637712253,
            "unit": "iter/sec",
            "range": "stddev: 0.00037637363246523887",
            "extra": "mean: 53.78551421052697 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 448.7872452867153,
            "unit": "iter/sec",
            "range": "stddev: 0.00024899078919248376",
            "extra": "mean: 2.228227318183103 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1483.4045437379418,
            "unit": "iter/sec",
            "range": "stddev: 0.00008588627624262916",
            "extra": "mean: 674.1249406450922 usec\nrounds: 775"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2062.1546913812244,
            "unit": "iter/sec",
            "range": "stddev: 0.00007902328985537837",
            "extra": "mean: 484.9296729190589 usec\nrounds: 853"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1449.0054035175212,
            "unit": "iter/sec",
            "range": "stddev: 0.00011486136216461275",
            "extra": "mean: 690.1285513307666 usec\nrounds: 1052"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 1905.1067630672965,
            "unit": "iter/sec",
            "range": "stddev: 0.00010403622168054289",
            "extra": "mean: 524.9049656356061 usec\nrounds: 873"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 722.7490755932936,
            "unit": "iter/sec",
            "range": "stddev: 0.00014259219066551021",
            "extra": "mean: 1.3836060588235486 msec\nrounds: 544"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 979.1977413168863,
            "unit": "iter/sec",
            "range": "stddev: 0.0001331400424726528",
            "extra": "mean: 1.021244185730185 msec\nrounds: 883"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 866.6535641486447,
            "unit": "iter/sec",
            "range": "stddev: 0.00013209489831431914",
            "extra": "mean: 1.1538635982906826 msec\nrounds: 585"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1089.0019730211138,
            "unit": "iter/sec",
            "range": "stddev: 0.00011425071008864229",
            "extra": "mean: 918.2719818457224 usec\nrounds: 661"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 839.3187304866078,
            "unit": "iter/sec",
            "range": "stddev: 0.00011548565390578004",
            "extra": "mean: 1.1914424921986844 msec\nrounds: 705"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1043.8263893326962,
            "unit": "iter/sec",
            "range": "stddev: 0.0002006125816995042",
            "extra": "mean: 958.0137178168932 usec\nrounds: 971"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1580.0000285903395,
            "unit": "iter/sec",
            "range": "stddev: 0.00008408556635265406",
            "extra": "mean: 632.9113809524359 usec\nrounds: 1008"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2096.8714273138175,
            "unit": "iter/sec",
            "range": "stddev: 0.00008020627837227004",
            "extra": "mean: 476.90096158210474 usec\nrounds: 1744"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 721.1064843989037,
            "unit": "iter/sec",
            "range": "stddev: 0.00030121867007273527",
            "extra": "mean: 1.3867577419354022 msec\nrounds: 465"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 830.6033620751826,
            "unit": "iter/sec",
            "range": "stddev: 0.000546989391083495",
            "extra": "mean: 1.203944079279424 msec\nrounds: 555"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1529.239560922165,
            "unit": "iter/sec",
            "range": "stddev: 0.0000882239417059325",
            "extra": "mean: 653.9197818012098 usec\nrounds: 1077"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2056.846764531435,
            "unit": "iter/sec",
            "range": "stddev: 0.00008105538181612273",
            "extra": "mean: 486.1810890554151 usec\nrounds: 932"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1415.6361230913767,
            "unit": "iter/sec",
            "range": "stddev: 0.00010592248448085014",
            "extra": "mean: 706.3962155869993 usec\nrounds: 988"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 1949.207218972526,
            "unit": "iter/sec",
            "range": "stddev: 0.00009506301224201303",
            "extra": "mean: 513.0290870393574 usec\nrounds: 1574"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 174.34939591205003,
            "unit": "iter/sec",
            "range": "stddev: 0.0027978908704228513",
            "extra": "mean: 5.735609204544916 msec\nrounds: 176"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 600.7434334566772,
            "unit": "iter/sec",
            "range": "stddev: 0.00038850438878500855",
            "extra": "mean: 1.6646041293302216 msec\nrounds: 433"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 838.6580643779876,
            "unit": "iter/sec",
            "range": "stddev: 0.00015507912201042658",
            "extra": "mean: 1.1923810698006894 msec\nrounds: 702"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1538.0653968566141,
            "unit": "iter/sec",
            "range": "stddev: 0.00011327882364098927",
            "extra": "mean: 650.1674129355793 usec\nrounds: 402"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 916.6574463961039,
            "unit": "iter/sec",
            "range": "stddev: 0.00008757529069487459",
            "extra": "mean: 1.090920063903438 msec\nrounds: 579"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1065.3191137065016,
            "unit": "iter/sec",
            "range": "stddev: 0.00008359436725857063",
            "extra": "mean: 938.685870866204 usec\nrounds: 635"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5326.526785357923,
            "unit": "iter/sec",
            "range": "stddev: 0.00009702864174063472",
            "extra": "mean: 187.7395984844942 usec\nrounds: 132"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 220124.97181346847,
            "unit": "iter/sec",
            "range": "stddev: 0.000002718287667975959",
            "extra": "mean: 4.5428739491100965 usec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4483.093342633633,
            "unit": "iter/sec",
            "range": "stddev: 0.00008341943518281274",
            "extra": "mean: 223.06026744750778 usec\nrounds: 2135"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 211772.71163188884,
            "unit": "iter/sec",
            "range": "stddev: 9.773390599443334e-7",
            "extra": "mean: 4.722043705698197 usec\nrounds: 29058"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 80926.46822305354,
            "unit": "iter/sec",
            "range": "stddev: 0.000019609738263334463",
            "extra": "mean: 12.356896599561844 usec\nrounds: 21615"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 482278.59221041785,
            "unit": "iter/sec",
            "range": "stddev: 6.543175113768494e-7",
            "extra": "mean: 2.0734903355687426 usec\nrounds: 35853"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 220939.75150163283,
            "unit": "iter/sec",
            "range": "stddev: 9.552979177115788e-7",
            "extra": "mean: 4.526120778191469 usec\nrounds: 44205"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 482926.18033792,
            "unit": "iter/sec",
            "range": "stddev: 7.623634903997802e-7",
            "extra": "mean: 2.070709853212484 usec\nrounds: 35420"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1785.1301305914894,
            "unit": "iter/sec",
            "range": "stddev: 0.00009675839925259078",
            "extra": "mean: 560.1832509928324 usec\nrounds: 1259"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1040.8793926738954,
            "unit": "iter/sec",
            "range": "stddev: 0.00013448035069993873",
            "extra": "mean: 960.7261004861658 usec\nrounds: 617"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 751.4743478760973,
            "unit": "iter/sec",
            "range": "stddev: 0.0002681748607070313",
            "extra": "mean: 1.3307174128116472 msec\nrounds: 562"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 588.0133196998257,
            "unit": "iter/sec",
            "range": "stddev: 0.00029040967186684877",
            "extra": "mean: 1.7006417482353782 msec\nrounds: 425"
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
          "id": "ec4122a5e76ba7a394c0b3af6d6f2148c5313eaf",
          "message": "fix(ci): strip copilot agent steps from squash commit messages\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T21:51:41+02:00",
          "tree_id": "2e64837a833487e83ff79abc69b7ce6a3fe7bda1",
          "url": "https://github.com/fruch/coodie/commit/ec4122a5e76ba7a394c0b3af6d6f2148c5313eaf"
        },
        "date": 1772049170576,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1425.9855225501522,
            "unit": "iter/sec",
            "range": "stddev: 0.00008020377818034359",
            "extra": "mean: 701.2693917198096 usec\nrounds: 628"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1999.271028682591,
            "unit": "iter/sec",
            "range": "stddev: 0.00007012180257060243",
            "extra": "mean: 500.18230927846975 usec\nrounds: 873"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 961.8201921215253,
            "unit": "iter/sec",
            "range": "stddev: 0.00013795191956370357",
            "extra": "mean: 1.0396953694580482 msec\nrounds: 609"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1755.3538417842399,
            "unit": "iter/sec",
            "range": "stddev: 0.0007354489251815782",
            "extra": "mean: 569.6857101947855 usec\nrounds: 873"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1054.2293144522357,
            "unit": "iter/sec",
            "range": "stddev: 0.00010410884888593672",
            "extra": "mean: 948.5602290613474 usec\nrounds: 991"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1919.3009558041774,
            "unit": "iter/sec",
            "range": "stddev: 0.00008092902337463157",
            "extra": "mean: 521.023030273543 usec\nrounds: 1024"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1295.0329965224992,
            "unit": "iter/sec",
            "range": "stddev: 0.00008999764291691532",
            "extra": "mean: 772.1810970726309 usec\nrounds: 649"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1024.5547591837144,
            "unit": "iter/sec",
            "range": "stddev: 0.00010575846007507454",
            "extra": "mean: 976.0337268812477 usec\nrounds: 930"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 332.1840721504339,
            "unit": "iter/sec",
            "range": "stddev: 0.0001305007339309604",
            "extra": "mean: 3.010379135659271 msec\nrounds: 258"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 904.5859208140703,
            "unit": "iter/sec",
            "range": "stddev: 0.00010271787552124022",
            "extra": "mean: 1.105478182879591 msec\nrounds: 514"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 734.651474689856,
            "unit": "iter/sec",
            "range": "stddev: 0.00012044119980377489",
            "extra": "mean: 1.3611896721804921 msec\nrounds: 665"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1685.6481855007305,
            "unit": "iter/sec",
            "range": "stddev: 0.00007986062593286077",
            "extra": "mean: 593.2436012458584 usec\nrounds: 642"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1201.8758531830053,
            "unit": "iter/sec",
            "range": "stddev: 0.0000705788730361821",
            "extra": "mean: 832.0326906906696 usec\nrounds: 666"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1040.8322946532146,
            "unit": "iter/sec",
            "range": "stddev: 0.00009941663059053745",
            "extra": "mean: 960.7695736739038 usec\nrounds: 509"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1309.997405396122,
            "unit": "iter/sec",
            "range": "stddev: 0.00006402332027384365",
            "extra": "mean: 763.3602905477634 usec\nrounds: 857"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2001.4354494655252,
            "unit": "iter/sec",
            "range": "stddev: 0.00006170476445367425",
            "extra": "mean: 499.64139501328697 usec\nrounds: 762"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 732.2111162885844,
            "unit": "iter/sec",
            "range": "stddev: 0.00010768558741734504",
            "extra": "mean: 1.3657263291341137 msec\nrounds: 635"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1051.353802673859,
            "unit": "iter/sec",
            "range": "stddev: 0.00010093093386117163",
            "extra": "mean: 951.1545946347904 usec\nrounds: 671"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27371.05845339138,
            "unit": "iter/sec",
            "range": "stddev: 0.000024798731971341797",
            "extra": "mean: 36.534940791670266 usec\nrounds: 11620"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 47418.01379474562,
            "unit": "iter/sec",
            "range": "stddev: 0.0000017498088845490461",
            "extra": "mean: 21.089031782913057 usec\nrounds: 18060"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 591.032156565116,
            "unit": "iter/sec",
            "range": "stddev: 0.0001492665942761425",
            "extra": "mean: 1.691955317307387 msec\nrounds: 416"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1681.0989168786782,
            "unit": "iter/sec",
            "range": "stddev: 0.00016410140540134126",
            "extra": "mean: 594.8489942856635 usec\nrounds: 350"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.726014827027953,
            "unit": "iter/sec",
            "range": "stddev: 0.0006014211859604346",
            "extra": "mean: 53.401645210526205 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 492.91795837101733,
            "unit": "iter/sec",
            "range": "stddev: 0.00016079877012579603",
            "extra": "mean: 2.028735173911647 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1523.7531024428329,
            "unit": "iter/sec",
            "range": "stddev: 0.00007248208556259911",
            "extra": "mean: 656.2742995547189 usec\nrounds: 898"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2173.0909552690605,
            "unit": "iter/sec",
            "range": "stddev: 0.00005919862595112393",
            "extra": "mean: 460.17401967244643 usec\nrounds: 915"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1523.294171277045,
            "unit": "iter/sec",
            "range": "stddev: 0.00007156868596681746",
            "extra": "mean: 656.4720189020717 usec\nrounds: 1111"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2002.810466821782,
            "unit": "iter/sec",
            "range": "stddev: 0.00006540774465519744",
            "extra": "mean: 499.2983692495271 usec\nrounds: 826"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 749.303125936078,
            "unit": "iter/sec",
            "range": "stddev: 0.00009881034259261443",
            "extra": "mean: 1.3345733727598363 msec\nrounds: 558"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1026.778925828092,
            "unit": "iter/sec",
            "range": "stddev: 0.00009409307663211098",
            "extra": "mean: 973.9194824178 usec\nrounds: 910"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 929.2771776621953,
            "unit": "iter/sec",
            "range": "stddev: 0.00009021962100119795",
            "extra": "mean: 1.0761051966386648 msec\nrounds: 595"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1143.7190774695034,
            "unit": "iter/sec",
            "range": "stddev: 0.00007887304948772151",
            "extra": "mean: 874.3405786432414 usec\nrounds: 693"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 881.6311839682787,
            "unit": "iter/sec",
            "range": "stddev: 0.00008939938292158055",
            "extra": "mean: 1.1342611493152224 msec\nrounds: 730"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1082.7768673539365,
            "unit": "iter/sec",
            "range": "stddev: 0.0001622456242230083",
            "extra": "mean: 923.5513152804746 usec\nrounds: 1034"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1621.0926231306346,
            "unit": "iter/sec",
            "range": "stddev: 0.000058341911953509625",
            "extra": "mean: 616.867898682317 usec\nrounds: 1214"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2215.4261204045497,
            "unit": "iter/sec",
            "range": "stddev: 0.00006050123320249849",
            "extra": "mean: 451.3804323194466 usec\nrounds: 1677"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 651.6244394555185,
            "unit": "iter/sec",
            "range": "stddev: 0.0005472052946851386",
            "extra": "mean: 1.5346262961462522 msec\nrounds: 493"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 797.0345840948323,
            "unit": "iter/sec",
            "range": "stddev: 0.00038320806015679806",
            "extra": "mean: 1.2546507014318198 msec\nrounds: 489"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1656.9873589836393,
            "unit": "iter/sec",
            "range": "stddev: 0.00006213211390176447",
            "extra": "mean: 603.5049058028895 usec\nrounds: 1189"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2094.003205815857,
            "unit": "iter/sec",
            "range": "stddev: 0.00006796552925439838",
            "extra": "mean: 477.55418770258467 usec\nrounds: 927"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1473.7659254653177,
            "unit": "iter/sec",
            "range": "stddev: 0.00007027087119106214",
            "extra": "mean: 678.533804263568 usec\nrounds: 1032"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2023.399215572423,
            "unit": "iter/sec",
            "range": "stddev: 0.00006921035547616301",
            "extra": "mean: 494.2178450519456 usec\nrounds: 1536"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 193.73431060944202,
            "unit": "iter/sec",
            "range": "stddev: 0.0022784880668627557",
            "extra": "mean: 5.161708304813113 msec\nrounds: 187"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 656.9276427841513,
            "unit": "iter/sec",
            "range": "stddev: 0.00014996377303833124",
            "extra": "mean: 1.5222376634386399 msec\nrounds: 413"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 878.2193727056257,
            "unit": "iter/sec",
            "range": "stddev: 0.0001104902568999425",
            "extra": "mean: 1.1386676621801126 msec\nrounds: 743"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1630.732045317697,
            "unit": "iter/sec",
            "range": "stddev: 0.00007882657036988879",
            "extra": "mean: 613.2215300921381 usec\nrounds: 864"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 961.2019604249185,
            "unit": "iter/sec",
            "range": "stddev: 0.00007489193184073475",
            "extra": "mean: 1.0403640870207236 msec\nrounds: 678"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1102.307032307119,
            "unit": "iter/sec",
            "range": "stddev: 0.00005472966822729079",
            "extra": "mean: 907.1882612478745 usec\nrounds: 689"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5830.37019554847,
            "unit": "iter/sec",
            "range": "stddev: 0.00003659617061351622",
            "extra": "mean: 171.51569565231162 usec\nrounds: 138"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 221520.73989158362,
            "unit": "iter/sec",
            "range": "stddev: 0.000002333863520765026",
            "extra": "mean: 4.514249999749092 usec\nrounds: 132"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4826.095319609531,
            "unit": "iter/sec",
            "range": "stddev: 0.000056018828594173544",
            "extra": "mean: 207.20684814010428 usec\nrounds: 2285"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 203264.4959165701,
            "unit": "iter/sec",
            "range": "stddev: 0.0000069223391269918184",
            "extra": "mean: 4.919698324543849 usec\nrounds: 33483"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81255.10198903883,
            "unit": "iter/sec",
            "range": "stddev: 0.000017088036685620975",
            "extra": "mean: 12.306919510542222 usec\nrounds: 23208"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 500630.6256078116,
            "unit": "iter/sec",
            "range": "stddev: 4.47107755236995e-7",
            "extra": "mean: 1.9974806750703835 usec\nrounds: 37568"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 220183.21233571784,
            "unit": "iter/sec",
            "range": "stddev: 6.76274081190067e-7",
            "extra": "mean: 4.541672316394765 usec\nrounds: 44781"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 521507.5984734876,
            "unit": "iter/sec",
            "range": "stddev: 5.677905869141707e-7",
            "extra": "mean: 1.9175176026717813 usec\nrounds: 35222"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1839.806860778768,
            "unit": "iter/sec",
            "range": "stddev: 0.00006808360877239201",
            "extra": "mean: 543.5353141235228 usec\nrounds: 1232"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1076.7212464196937,
            "unit": "iter/sec",
            "range": "stddev: 0.00009968682862292556",
            "extra": "mean: 928.7454885145003 usec\nrounds: 653"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 699.429417283511,
            "unit": "iter/sec",
            "range": "stddev: 0.0003075053351019324",
            "extra": "mean: 1.4297368330372267 msec\nrounds: 563"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 590.3653526174239,
            "unit": "iter/sec",
            "range": "stddev: 0.00030709350235191645",
            "extra": "mean: 1.6938663415229802 msec\nrounds: 407"
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
          "id": "442096c4a3e798d7492ad0d50ab083a1b9b65b3c",
          "message": "docs: add full Phase A UDT support implementation plan\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T22:45:05+02:00",
          "tree_id": "735d055c749fcc93f1e099eccb6e3799f3d77e09",
          "url": "https://github.com/fruch/coodie/commit/442096c4a3e798d7492ad0d50ab083a1b9b65b3c"
        },
        "date": 1772052374562,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1471.5512917356027,
            "unit": "iter/sec",
            "range": "stddev: 0.00008712559503268171",
            "extra": "mean: 679.5549741392722 usec\nrounds: 580"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2059.99699769619,
            "unit": "iter/sec",
            "range": "stddev: 0.0000678881971217985",
            "extra": "mean: 485.43760069473683 usec\nrounds: 864"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 932.9335656617108,
            "unit": "iter/sec",
            "range": "stddev: 0.0008688382262670675",
            "extra": "mean: 1.0718876850472416 msec\nrounds: 943"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1931.1708835882237,
            "unit": "iter/sec",
            "range": "stddev: 0.00009620316022563544",
            "extra": "mean: 517.820566009127 usec\nrounds: 659"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1090.0441494193888,
            "unit": "iter/sec",
            "range": "stddev: 0.00009053357796366916",
            "extra": "mean: 917.3940344825935 usec\nrounds: 957"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1989.2289509869508,
            "unit": "iter/sec",
            "range": "stddev: 0.00007311460827482617",
            "extra": "mean: 502.70734271379496 usec\nrounds: 995"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1353.347136607446,
            "unit": "iter/sec",
            "range": "stddev: 0.00008086436340961107",
            "extra": "mean: 738.9087196850231 usec\nrounds: 635"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1024.8606202799,
            "unit": "iter/sec",
            "range": "stddev: 0.00010483036495965539",
            "extra": "mean: 975.7424377637709 usec\nrounds: 948"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 359.87711983792036,
            "unit": "iter/sec",
            "range": "stddev: 0.00015970623451473865",
            "extra": "mean: 2.778726250922468 msec\nrounds: 271"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 873.5882860679305,
            "unit": "iter/sec",
            "range": "stddev: 0.00010146937859215762",
            "extra": "mean: 1.1447039938013084 msec\nrounds: 484"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 782.6384374794563,
            "unit": "iter/sec",
            "range": "stddev: 0.00012088733607334817",
            "extra": "mean: 1.2777292196644114 msec\nrounds: 478"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1690.6544015237375,
            "unit": "iter/sec",
            "range": "stddev: 0.00008350425703049077",
            "extra": "mean: 591.4869408548128 usec\nrounds: 913"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1194.3198227126393,
            "unit": "iter/sec",
            "range": "stddev: 0.00008300195536490744",
            "extra": "mean: 837.2966612315922 usec\nrounds: 552"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1053.2320327433206,
            "unit": "iter/sec",
            "range": "stddev: 0.00009653818701750671",
            "extra": "mean: 949.4583993949855 usec\nrounds: 661"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1290.8345596156416,
            "unit": "iter/sec",
            "range": "stddev: 0.00007714554770654381",
            "extra": "mean: 774.6926145963737 usec\nrounds: 781"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1979.588548330786,
            "unit": "iter/sec",
            "range": "stddev: 0.00006293018561104115",
            "extra": "mean: 505.1554783155382 usec\nrounds: 807"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 742.0852945664473,
            "unit": "iter/sec",
            "range": "stddev: 0.00010845521109830072",
            "extra": "mean: 1.3475539905210434 msec\nrounds: 633"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1060.7030088516492,
            "unit": "iter/sec",
            "range": "stddev: 0.000102734602743016",
            "extra": "mean: 942.7709657226595 usec\nrounds: 671"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 24201.3438895237,
            "unit": "iter/sec",
            "range": "stddev: 0.000025975172060777387",
            "extra": "mean: 41.32001944044442 usec\nrounds: 10648"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 39677.884615936506,
            "unit": "iter/sec",
            "range": "stddev: 0.000002405469340635813",
            "extra": "mean: 25.202956500315867 usec\nrounds: 16276"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 642.2614826426453,
            "unit": "iter/sec",
            "range": "stddev: 0.0001446142121361316",
            "extra": "mean: 1.5569982429670324 msec\nrounds: 391"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1692.8799513489455,
            "unit": "iter/sec",
            "range": "stddev: 0.00016533572304067948",
            "extra": "mean: 590.7093407321443 usec\nrounds: 766"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 19.568168249806487,
            "unit": "iter/sec",
            "range": "stddev: 0.00034550457453662455",
            "extra": "mean: 51.10340361111159 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 487.5331726561252,
            "unit": "iter/sec",
            "range": "stddev: 0.00014206186110936374",
            "extra": "mean: 2.051142478268522 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1553.4045334114267,
            "unit": "iter/sec",
            "range": "stddev: 0.00006652211191584612",
            "extra": "mean: 643.747316614239 usec\nrounds: 957"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2187.3236439844577,
            "unit": "iter/sec",
            "range": "stddev: 0.00005917222301133394",
            "extra": "mean: 457.1797149224733 usec\nrounds: 898"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1526.471365168675,
            "unit": "iter/sec",
            "range": "stddev: 0.00007344921236714108",
            "extra": "mean: 655.1056395935078 usec\nrounds: 985"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2098.009556716424,
            "unit": "iter/sec",
            "range": "stddev: 0.00006435484253942546",
            "extra": "mean: 476.6422520806297 usec\nrounds: 841"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 727.6695286610067,
            "unit": "iter/sec",
            "range": "stddev: 0.0001173162799101562",
            "extra": "mean: 1.3742502064640687 msec\nrounds: 557"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1023.8677769975691,
            "unit": "iter/sec",
            "range": "stddev: 0.00010506902677690472",
            "extra": "mean: 976.6886139657995 usec\nrounds: 759"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 904.9891926866168,
            "unit": "iter/sec",
            "range": "stddev: 0.00009524704492046061",
            "extra": "mean: 1.104985571188234 msec\nrounds: 597"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1102.2669551903807,
            "unit": "iter/sec",
            "range": "stddev: 0.00021576509772385782",
            "extra": "mean: 907.2212455351006 usec\nrounds: 672"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 861.5821449435224,
            "unit": "iter/sec",
            "range": "stddev: 0.00009217464533816279",
            "extra": "mean: 1.160655435896424 msec\nrounds: 663"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1123.9025369958197,
            "unit": "iter/sec",
            "range": "stddev: 0.00009278869750288223",
            "extra": "mean: 889.7568668836623 usec\nrounds: 924"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1646.0024040743162,
            "unit": "iter/sec",
            "range": "stddev: 0.00006011131973267759",
            "extra": "mean: 607.5325270028284 usec\nrounds: 1148"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2202.360481266902,
            "unit": "iter/sec",
            "range": "stddev: 0.00006258169214093355",
            "extra": "mean: 454.05827452223116 usec\nrounds: 1621"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 741.2721778603648,
            "unit": "iter/sec",
            "range": "stddev: 0.00045880496170892457",
            "extra": "mean: 1.3490321502237366 msec\nrounds: 446"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 915.8143445286474,
            "unit": "iter/sec",
            "range": "stddev: 0.00011204143637215032",
            "extra": "mean: 1.0919243687045341 msec\nrounds: 556"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1655.0658782391895,
            "unit": "iter/sec",
            "range": "stddev: 0.00006539020095132053",
            "extra": "mean: 604.2055564965736 usec\nrounds: 1062"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2174.1901233200842,
            "unit": "iter/sec",
            "range": "stddev: 0.00007268324276827851",
            "extra": "mean: 459.9413773773178 usec\nrounds: 946"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1505.4180590566584,
            "unit": "iter/sec",
            "range": "stddev: 0.00007386499787003886",
            "extra": "mean: 664.2673070008414 usec\nrounds: 1000"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2092.160462072169,
            "unit": "iter/sec",
            "range": "stddev: 0.00006518072537433067",
            "extra": "mean: 477.97481031142104 usec\nrounds: 1571"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 216.1424427705089,
            "unit": "iter/sec",
            "range": "stddev: 0.0021968476439846994",
            "extra": "mean: 4.626578598733422 msec\nrounds: 157"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 636.8515800655334,
            "unit": "iter/sec",
            "range": "stddev: 0.0001858346424432518",
            "extra": "mean: 1.5702245724146555 msec\nrounds: 435"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 893.9834621081026,
            "unit": "iter/sec",
            "range": "stddev: 0.00012030565854258675",
            "extra": "mean: 1.11858892517083 msec\nrounds: 735"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1628.7724926261935,
            "unit": "iter/sec",
            "range": "stddev: 0.00007766270745538196",
            "extra": "mean: 613.9592880695229 usec\nrounds: 788"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 931.1911856230123,
            "unit": "iter/sec",
            "range": "stddev: 0.00007452258827876715",
            "extra": "mean: 1.0738933265685404 msec\nrounds: 542"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1080.4840988783199,
            "unit": "iter/sec",
            "range": "stddev: 0.000059222440606038244",
            "extra": "mean: 925.5110751172806 usec\nrounds: 639"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 7477.845688858195,
            "unit": "iter/sec",
            "range": "stddev: 0.00006061987207395128",
            "extra": "mean: 133.72835461020213 usec\nrounds: 141"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 218108.57416450043,
            "unit": "iter/sec",
            "range": "stddev: 0.0000014169372301960673",
            "extra": "mean: 4.584872483031256 usec\nrounds: 149"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 6170.084718625174,
            "unit": "iter/sec",
            "range": "stddev: 0.00006286013081598755",
            "extra": "mean: 162.0723289230332 usec\nrounds: 2721"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 201950.31791284104,
            "unit": "iter/sec",
            "range": "stddev: 0.000005265546990424055",
            "extra": "mean: 4.951712927887472 usec\nrounds: 29665"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 77321.42285054998,
            "unit": "iter/sec",
            "range": "stddev: 0.0000192626227043941",
            "extra": "mean: 12.933026361049269 usec\nrounds: 22116"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 471343.78080602194,
            "unit": "iter/sec",
            "range": "stddev: 5.225943042210685e-7",
            "extra": "mean: 2.121593708715004 usec\nrounds: 33284"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 220576.64843867364,
            "unit": "iter/sec",
            "range": "stddev: 7.466858515827801e-7",
            "extra": "mean: 4.53357146859554 usec\nrounds: 39360"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 511928.90277939953,
            "unit": "iter/sec",
            "range": "stddev: 5.667235140925349e-7",
            "extra": "mean: 1.9533962520395531 usec\nrounds: 32232"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1792.9888240965931,
            "unit": "iter/sec",
            "range": "stddev: 0.00007790911389357619",
            "extra": "mean: 557.7279604650382 usec\nrounds: 1290"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 981.6014285815212,
            "unit": "iter/sec",
            "range": "stddev: 0.00010357863901844259",
            "extra": "mean: 1.0187434236368889 msec\nrounds: 550"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 824.3396462392247,
            "unit": "iter/sec",
            "range": "stddev: 0.00012669099684856777",
            "extra": "mean: 1.2130922060611389 msec\nrounds: 495"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 653.4528866694868,
            "unit": "iter/sec",
            "range": "stddev: 0.00015426785293998083",
            "extra": "mean: 1.5303322097126106 msec\nrounds: 453"
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
          "id": "b7f8827b040c6de33ace6f9a4f82397efec7f5ab",
          "message": "docs: add §14 Cython/Rust/native extension evaluation to performance plan\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T22:47:58+02:00",
          "tree_id": "852e20449f722a3a8066049d1047a0a92aaaeb69",
          "url": "https://github.com/fruch/coodie/commit/b7f8827b040c6de33ace6f9a4f82397efec7f5ab"
        },
        "date": 1772052546146,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1427.1406294005496,
            "unit": "iter/sec",
            "range": "stddev: 0.00018485550164206918",
            "extra": "mean: 700.7017944826054 usec\nrounds: 725"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2029.854799373359,
            "unit": "iter/sec",
            "range": "stddev: 0.00006304472085411905",
            "extra": "mean: 492.64607513242436 usec\nrounds: 945"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 976.4195829697061,
            "unit": "iter/sec",
            "range": "stddev: 0.0006759556922267616",
            "extra": "mean: 1.0241498813026422 msec\nrounds: 952"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1983.1118863996346,
            "unit": "iter/sec",
            "range": "stddev: 0.00007147526137038871",
            "extra": "mean: 504.25798305082674 usec\nrounds: 1003"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1072.057948083253,
            "unit": "iter/sec",
            "range": "stddev: 0.00007770931024949798",
            "extra": "mean: 932.7853982034402 usec\nrounds: 1002"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1991.7530888804542,
            "unit": "iter/sec",
            "range": "stddev: 0.00006418274893861507",
            "extra": "mean: 502.07026442323263 usec\nrounds: 1040"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1349.389966955354,
            "unit": "iter/sec",
            "range": "stddev: 0.0000710904292467529",
            "extra": "mean: 741.0756152695525 usec\nrounds: 668"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1021.9949151940549,
            "unit": "iter/sec",
            "range": "stddev: 0.00009421013580101508",
            "extra": "mean: 978.4784494843808 usec\nrounds: 970"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 333.48481435534757,
            "unit": "iter/sec",
            "range": "stddev: 0.00013309495721403603",
            "extra": "mean: 2.9986372900759477 msec\nrounds: 262"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 911.9607576040727,
            "unit": "iter/sec",
            "range": "stddev: 0.00008262509537303923",
            "extra": "mean: 1.0965384109588512 msec\nrounds: 511"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 730.4476724831056,
            "unit": "iter/sec",
            "range": "stddev: 0.00012334171358753564",
            "extra": "mean: 1.369023460093411 msec\nrounds: 639"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1677.0018391161027,
            "unit": "iter/sec",
            "range": "stddev: 0.00008189308740877952",
            "extra": "mean: 596.3022679373267 usec\nrounds: 892"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1171.1814908690492,
            "unit": "iter/sec",
            "range": "stddev: 0.00007258500213468485",
            "extra": "mean: 853.8386303031242 usec\nrounds: 660"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1069.228837517855,
            "unit": "iter/sec",
            "range": "stddev: 0.00009324859718851179",
            "extra": "mean: 935.2534882256215 usec\nrounds: 637"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1355.44533645844,
            "unit": "iter/sec",
            "range": "stddev: 0.0000574133700147269",
            "extra": "mean: 737.764905084877 usec\nrounds: 885"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1932.186112109535,
            "unit": "iter/sec",
            "range": "stddev: 0.000055348775669785746",
            "extra": "mean: 517.5484875565187 usec\nrounds: 884"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 738.6818267848499,
            "unit": "iter/sec",
            "range": "stddev: 0.00010440046624094551",
            "extra": "mean: 1.3537628295968114 msec\nrounds: 669"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1031.0044666590177,
            "unit": "iter/sec",
            "range": "stddev: 0.00009010571886500502",
            "extra": "mean: 969.9279026797158 usec\nrounds: 709"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26948.212500939127,
            "unit": "iter/sec",
            "range": "stddev: 0.000024931079223704256",
            "extra": "mean: 37.10821264917481 usec\nrounds: 11653"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46356.68108320584,
            "unit": "iter/sec",
            "range": "stddev: 0.000001922147341852981",
            "extra": "mean: 21.571863572482574 usec\nrounds: 18508"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 595.9777906966577,
            "unit": "iter/sec",
            "range": "stddev: 0.0001181429465589753",
            "extra": "mean: 1.677914874698716 msec\nrounds: 415"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1745.9774952267637,
            "unit": "iter/sec",
            "range": "stddev: 0.00006320794827296446",
            "extra": "mean: 572.7450684409436 usec\nrounds: 789"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.930422538160858,
            "unit": "iter/sec",
            "range": "stddev: 0.0004941435293706443",
            "extra": "mean: 52.82502268420854 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 403.7388393199199,
            "unit": "iter/sec",
            "range": "stddev: 0.0005604443898013889",
            "extra": "mean: 2.476848652174399 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1572.9432811500576,
            "unit": "iter/sec",
            "range": "stddev: 0.00011089440818734119",
            "extra": "mean: 635.7508322034663 usec\nrounds: 590"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2199.0388034544526,
            "unit": "iter/sec",
            "range": "stddev: 0.0000508843529798788",
            "extra": "mean: 454.7441356783282 usec\nrounds: 995"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1466.6804879786898,
            "unit": "iter/sec",
            "range": "stddev: 0.00007449796981629612",
            "extra": "mean: 681.8117566820249 usec\nrounds: 1085"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2053.5299786454216,
            "unit": "iter/sec",
            "range": "stddev: 0.00006150407136488924",
            "extra": "mean: 486.96635081978894 usec\nrounds: 915"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 751.7855862065381,
            "unit": "iter/sec",
            "range": "stddev: 0.00009292639908857958",
            "extra": "mean: 1.3301664973997915 msec\nrounds: 577"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1040.3095691355406,
            "unit": "iter/sec",
            "range": "stddev: 0.00007937022170127651",
            "extra": "mean: 961.2523326407193 usec\nrounds: 962"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 888.940788924757,
            "unit": "iter/sec",
            "range": "stddev: 0.00018510464402217902",
            "extra": "mean: 1.1249343178521232 msec\nrounds: 689"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1135.0774557398775,
            "unit": "iter/sec",
            "range": "stddev: 0.0000733238199861459",
            "extra": "mean: 880.9971468847208 usec\nrounds: 674"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 871.7432688793939,
            "unit": "iter/sec",
            "range": "stddev: 0.00008428465431913054",
            "extra": "mean: 1.1471267237721001 msec\nrounds: 753"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1159.4275887877952,
            "unit": "iter/sec",
            "range": "stddev: 0.0000710240638710897",
            "extra": "mean: 862.4945703125109 usec\nrounds: 1024"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1659.1150958986684,
            "unit": "iter/sec",
            "range": "stddev: 0.00005565578244687996",
            "extra": "mean: 602.7309392048807 usec\nrounds: 1283"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2081.361222474697,
            "unit": "iter/sec",
            "range": "stddev: 0.00008527192342417914",
            "extra": "mean: 480.454804866125 usec\nrounds: 1932"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 583.0210135515557,
            "unit": "iter/sec",
            "range": "stddev: 0.00028925968564684544",
            "extra": "mean: 1.7152040436902216 msec\nrounds: 412"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 691.9097809375066,
            "unit": "iter/sec",
            "range": "stddev: 0.00031822450441970407",
            "extra": "mean: 1.4452751320338977 msec\nrounds: 462"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1647.4668948611827,
            "unit": "iter/sec",
            "range": "stddev: 0.00006081968901165844",
            "extra": "mean: 606.9924701487013 usec\nrounds: 1072"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2245.1118265515975,
            "unit": "iter/sec",
            "range": "stddev: 0.00004932069957145648",
            "extra": "mean: 445.41211184832616 usec\nrounds: 903"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1528.10068174984,
            "unit": "iter/sec",
            "range": "stddev: 0.0000642375956628596",
            "extra": "mean: 654.4071421098328 usec\nrounds: 1147"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2003.4993570063953,
            "unit": "iter/sec",
            "range": "stddev: 0.00006735796267967827",
            "extra": "mean: 499.1266887623004 usec\nrounds: 1584"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 210.27943491804342,
            "unit": "iter/sec",
            "range": "stddev: 0.0016359560809544797",
            "extra": "mean: 4.75557678947421 msec\nrounds: 190"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 669.1212344894177,
            "unit": "iter/sec",
            "range": "stddev: 0.0001257751923525607",
            "extra": "mean: 1.494497481854785 msec\nrounds: 496"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 881.2388813582143,
            "unit": "iter/sec",
            "range": "stddev: 0.00011225260813512899",
            "extra": "mean: 1.1347660902782053 msec\nrounds: 720"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1644.5449486601935,
            "unit": "iter/sec",
            "range": "stddev: 0.00007603633972702977",
            "extra": "mean: 608.0709443756447 usec\nrounds: 809"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 975.0895033396523,
            "unit": "iter/sec",
            "range": "stddev: 0.00005555056865618697",
            "extra": "mean: 1.0255468821836662 msec\nrounds: 696"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1100.7869127776723,
            "unit": "iter/sec",
            "range": "stddev: 0.000054779023007364634",
            "extra": "mean: 908.4410328577113 usec\nrounds: 700"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5721.919269673862,
            "unit": "iter/sec",
            "range": "stddev: 0.000050443989682444224",
            "extra": "mean: 174.76653424664588 usec\nrounds: 146"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 213153.89999561914,
            "unit": "iter/sec",
            "range": "stddev: 0.000002071479860144744",
            "extra": "mean: 4.69144594595995 usec\nrounds: 148"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4621.269565578065,
            "unit": "iter/sec",
            "range": "stddev: 0.00005855899394834369",
            "extra": "mean: 216.3907527594989 usec\nrounds: 3171"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 202684.83539857724,
            "unit": "iter/sec",
            "range": "stddev: 0.000004311910162592887",
            "extra": "mean: 4.93376822214406 usec\nrounds: 33709"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81820.51552140756,
            "unit": "iter/sec",
            "range": "stddev: 0.00001894968478413669",
            "extra": "mean: 12.221873617239181 usec\nrounds: 24315"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 504203.5435319666,
            "unit": "iter/sec",
            "range": "stddev: 4.67301930098627e-7",
            "extra": "mean: 1.9833260055948012 usec\nrounds: 37938"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 219715.76040110568,
            "unit": "iter/sec",
            "range": "stddev: 6.834074357734324e-7",
            "extra": "mean: 4.551334861797959 usec\nrounds: 47106"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 519697.8140490664,
            "unit": "iter/sec",
            "range": "stddev: 4.2718143153908633e-7",
            "extra": "mean: 1.924195124487452 usec\nrounds: 38478"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1843.9478122915875,
            "unit": "iter/sec",
            "range": "stddev: 0.00005550690426934854",
            "extra": "mean: 542.3146974844361 usec\nrounds: 1352"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1071.0375641716769,
            "unit": "iter/sec",
            "range": "stddev: 0.00008790452647190395",
            "extra": "mean: 933.674068447248 usec\nrounds: 599"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 639.9582620078372,
            "unit": "iter/sec",
            "range": "stddev: 0.0003436007190070064",
            "extra": "mean: 1.5626019060407936 msec\nrounds: 596"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 540.4408881845126,
            "unit": "iter/sec",
            "range": "stddev: 0.0004142291326379505",
            "extra": "mean: 1.8503411230768845 msec\nrounds: 455"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "340979+fruch@users.noreply.github.com",
            "name": "fruch",
            "username": "fruch"
          },
          "committer": {
            "email": "israel.fruchter@gmail.com",
            "name": "Israel Fruchter",
            "username": "fruch"
          },
          "distinct": true,
          "id": "a88b4e34b923dcd59c75d6c4efc8aba84149f594",
          "message": "perf: Phase 4 — optimize `_clone()` and add `LazyDocument`\n\n✗ Show commit stats\n  2>/dev/null | head -40\n  Permission denied and could not request permission from user\n\nImplement two Phase 4 performance optimizations:\n\n- Task 3.10: optimise `_clone()` by using `object.__new__()` and direct slot/dict copy, bypassing Pydantic model construction overhead on internal document copies.\n- Task 7.4: add `LazyDocument` (`src/coodie/lazy.py`) — a thin wrapper that defers `model_validate` until a field is first accessed. Exposed via `QuerySet.all(lazy=True)` on both the sync and async query paths.\n\nUpdate `src/coodie/__init__.py` to export `LazyDocument`. Add unit tests for lazy loading behaviour (`tests/test_lazy.py`) and for the updated `_clone()` and `lazy=True` query option (`tests/test_query.py`). Document results and design rationale in `docs/plans/performance-improvement.md`.\n\nCo-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>",
          "timestamp": "2026-02-25T23:04:44+02:00",
          "tree_id": "a9340c6a008a360a78bb74473d38da6051a7a18c",
          "url": "https://github.com/fruch/coodie/commit/a88b4e34b923dcd59c75d6c4efc8aba84149f594"
        },
        "date": 1772053554135,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1482.8778271267315,
            "unit": "iter/sec",
            "range": "stddev: 0.00007576663084342415",
            "extra": "mean: 674.3643890998288 usec\nrounds: 789"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2108.5068799980113,
            "unit": "iter/sec",
            "range": "stddev: 0.00005987295962689344",
            "extra": "mean: 474.26926109956213 usec\nrounds: 946"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 970.4054736770777,
            "unit": "iter/sec",
            "range": "stddev: 0.0006777646321413745",
            "extra": "mean: 1.0304970727450475 msec\nrounds: 976"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1973.9141563446697,
            "unit": "iter/sec",
            "range": "stddev: 0.00006745430242971477",
            "extra": "mean: 506.6076438966415 usec\nrounds: 893"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1061.9116520392415,
            "unit": "iter/sec",
            "range": "stddev: 0.00007602904708959363",
            "extra": "mean: 941.6979256981035 usec\nrounds: 646"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1987.4181086569188,
            "unit": "iter/sec",
            "range": "stddev: 0.00006353616385682119",
            "extra": "mean: 503.1653861078039 usec\nrounds: 979"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1338.5191500844,
            "unit": "iter/sec",
            "range": "stddev: 0.0000693130369539471",
            "extra": "mean: 747.0942794781421 usec\nrounds: 687"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1031.4224217415644,
            "unit": "iter/sec",
            "range": "stddev: 0.00009737863456304488",
            "extra": "mean: 969.5348665307204 usec\nrounds: 974"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 334.51682034635087,
            "unit": "iter/sec",
            "range": "stddev: 0.0001766171890989625",
            "extra": "mean: 2.9893863004097176 msec\nrounds: 243"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 915.7259775601359,
            "unit": "iter/sec",
            "range": "stddev: 0.00009353052454103605",
            "extra": "mean: 1.0920297387045894 msec\nrounds: 509"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 763.4486721612984,
            "unit": "iter/sec",
            "range": "stddev: 0.00011262320912710243",
            "extra": "mean: 1.3098457518683377 msec\nrounds: 669"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1697.2156722120765,
            "unit": "iter/sec",
            "range": "stddev: 0.00007904671868493897",
            "extra": "mean: 589.2003098796772 usec\nrounds: 668"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1151.956572736912,
            "unit": "iter/sec",
            "range": "stddev: 0.0000826974972570112",
            "extra": "mean: 868.0882801198997 usec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1064.882649931963,
            "unit": "iter/sec",
            "range": "stddev: 0.0000953089696725305",
            "extra": "mean: 939.0706103286512 usec\nrounds: 639"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1329.089876548458,
            "unit": "iter/sec",
            "range": "stddev: 0.00006375250959334247",
            "extra": "mean: 752.3945653674839 usec\nrounds: 872"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2053.7299869232274,
            "unit": "iter/sec",
            "range": "stddev: 0.00005421459643691407",
            "extra": "mean: 486.9189262304821 usec\nrounds: 854"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 757.2822226200514,
            "unit": "iter/sec",
            "range": "stddev: 0.00010374153069574192",
            "extra": "mean: 1.3205116535552512 msec\nrounds: 661"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1082.2895480406828,
            "unit": "iter/sec",
            "range": "stddev: 0.00009307976258183539",
            "extra": "mean: 923.9671599992301 usec\nrounds: 700"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26907.727818695104,
            "unit": "iter/sec",
            "range": "stddev: 0.000025326298717247123",
            "extra": "mean: 37.16404472120512 usec\nrounds: 11963"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46758.45147636565,
            "unit": "iter/sec",
            "range": "stddev: 0.000001960411559178518",
            "extra": "mean: 21.386508073421897 usec\nrounds: 16907"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 594.3081373964717,
            "unit": "iter/sec",
            "range": "stddev: 0.00009936535803896512",
            "extra": "mean: 1.6826288200945252 msec\nrounds: 428"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1697.01263091489,
            "unit": "iter/sec",
            "range": "stddev: 0.00016335143231873485",
            "extra": "mean: 589.270805521867 usec\nrounds: 797"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.897327042706756,
            "unit": "iter/sec",
            "range": "stddev: 0.00044212961937462427",
            "extra": "mean: 52.91753684211866 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 520.3483700660472,
            "unit": "iter/sec",
            "range": "stddev: 0.00010513382570131801",
            "extra": "mean: 1.9217894347839912 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1533.6654904013146,
            "unit": "iter/sec",
            "range": "stddev: 0.00005485042559965244",
            "extra": "mean: 652.0326670050649 usec\nrounds: 985"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2240.853620315448,
            "unit": "iter/sec",
            "range": "stddev: 0.00005458065965751183",
            "extra": "mean: 446.2585110129722 usec\nrounds: 908"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1517.5349120275557,
            "unit": "iter/sec",
            "range": "stddev: 0.00006513288811676565",
            "extra": "mean: 658.963422900047 usec\nrounds: 1083"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2126.244966477969,
            "unit": "iter/sec",
            "range": "stddev: 0.00006113171521089467",
            "extra": "mean: 470.31269480508445 usec\nrounds: 924"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 745.9936282542702,
            "unit": "iter/sec",
            "range": "stddev: 0.00009455396369899058",
            "extra": "mean: 1.3404940231730134 msec\nrounds: 561"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1048.8006302593656,
            "unit": "iter/sec",
            "range": "stddev: 0.00008783705530803962",
            "extra": "mean: 953.4700601321175 usec\nrounds: 898"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 871.335608421638,
            "unit": "iter/sec",
            "range": "stddev: 0.00027426686989715746",
            "extra": "mean: 1.1476634150318135 msec\nrounds: 612"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1159.555825356501,
            "unit": "iter/sec",
            "range": "stddev: 0.00007310097201864254",
            "extra": "mean: 862.3991860784744 usec\nrounds: 704"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 874.3301423076396,
            "unit": "iter/sec",
            "range": "stddev: 0.00008649171195643232",
            "extra": "mean: 1.1437327293334267 msec\nrounds: 750"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1131.2268367332356,
            "unit": "iter/sec",
            "range": "stddev: 0.0000801551667544337",
            "extra": "mean: 883.9960010918825 usec\nrounds: 916"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1659.2699460925264,
            "unit": "iter/sec",
            "range": "stddev: 0.00005421636071370637",
            "extra": "mean: 602.6746897663852 usec\nrounds: 1241"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2187.1841912491827,
            "unit": "iter/sec",
            "range": "stddev: 0.00009340459194506614",
            "extra": "mean: 457.20886425612946 usec\nrounds: 1687"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 728.965620293398,
            "unit": "iter/sec",
            "range": "stddev: 0.00031236860255603175",
            "extra": "mean: 1.3718068070172016 msec\nrounds: 513"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 861.2472285160084,
            "unit": "iter/sec",
            "range": "stddev: 0.00020141316665410225",
            "extra": "mean: 1.16110678431218 msec\nrounds: 561"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1698.8628622182027,
            "unit": "iter/sec",
            "range": "stddev: 0.00005660264277829264",
            "extra": "mean: 588.6290307707953 usec\nrounds: 1170"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2197.8660525720375,
            "unit": "iter/sec",
            "range": "stddev: 0.0000701123069966916",
            "extra": "mean: 454.9867808503421 usec\nrounds: 940"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1484.7807980882415,
            "unit": "iter/sec",
            "range": "stddev: 0.00006861938979966755",
            "extra": "mean: 673.5000892303898 usec\nrounds: 975"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2080.731640321128,
            "unit": "iter/sec",
            "range": "stddev: 0.00006217683737967966",
            "extra": "mean: 480.60017958186376 usec\nrounds: 1626"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 208.91499225134302,
            "unit": "iter/sec",
            "range": "stddev: 0.000732355572014776",
            "extra": "mean: 4.786635890625372 msec\nrounds: 192"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 643.1794085561722,
            "unit": "iter/sec",
            "range": "stddev: 0.0010987900623486305",
            "extra": "mean: 1.5547761428569813 msec\nrounds: 420"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 817.3915790457331,
            "unit": "iter/sec",
            "range": "stddev: 0.00012970335872443707",
            "extra": "mean: 1.2234038441739927 msec\nrounds: 738"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1608.097535869288,
            "unit": "iter/sec",
            "range": "stddev: 0.0000783856987472622",
            "extra": "mean: 621.8528277636037 usec\nrounds: 778"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 985.3956411909231,
            "unit": "iter/sec",
            "range": "stddev: 0.000053546193899358326",
            "extra": "mean: 1.0148208071951956 msec\nrounds: 695"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1107.739464948049,
            "unit": "iter/sec",
            "range": "stddev: 0.00004971022361515284",
            "extra": "mean: 902.7393458866234 usec\nrounds: 717"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5887.405361992626,
            "unit": "iter/sec",
            "range": "stddev: 0.00004658893900653957",
            "extra": "mean: 169.85411034472142 usec\nrounds: 145"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 222536.86055122802,
            "unit": "iter/sec",
            "range": "stddev: 0.0000017886780087394134",
            "extra": "mean: 4.4936375822098915 usec\nrounds: 149"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4818.405831207036,
            "unit": "iter/sec",
            "range": "stddev: 0.00005435843856712363",
            "extra": "mean: 207.53752071346278 usec\nrounds: 2969"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 205038.1754035373,
            "unit": "iter/sec",
            "range": "stddev: 8.118284507859761e-7",
            "extra": "mean: 4.877140552152749 usec\nrounds: 33283"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81387.41090694894,
            "unit": "iter/sec",
            "range": "stddev: 0.00001754001923399815",
            "extra": "mean: 12.286912544045789 usec\nrounds: 26905"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 510015.86035128165,
            "unit": "iter/sec",
            "range": "stddev: 5.359606430943056e-7",
            "extra": "mean: 1.9607233377237205 usec\nrounds: 38838"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 218526.775167623,
            "unit": "iter/sec",
            "range": "stddev: 7.776686779318734e-7",
            "extra": "mean: 4.576098280098356 usec\nrounds: 46754"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 496560.6771948301,
            "unit": "iter/sec",
            "range": "stddev: 5.069231668283649e-7",
            "extra": "mean: 2.0138525781968855 usec\nrounds: 35585"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1856.8747700768167,
            "unit": "iter/sec",
            "range": "stddev: 0.00006651891678079038",
            "extra": "mean: 538.5392790697625 usec\nrounds: 1290"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1111.6205753107083,
            "unit": "iter/sec",
            "range": "stddev: 0.00007941683191122365",
            "extra": "mean: 899.5875231263066 usec\nrounds: 627"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 734.7396514917003,
            "unit": "iter/sec",
            "range": "stddev: 0.00031002527406247444",
            "extra": "mean: 1.3610263145180155 msec\nrounds: 620"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 611.3978052151759,
            "unit": "iter/sec",
            "range": "stddev: 0.00036677364550803513",
            "extra": "mean: 1.6355963195649013 msec\nrounds: 460"
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
          "id": "0762c5fd136143acc7194e97691c5ab1a7cd5ca4",
          "message": "fix(demos): use coodie[scylla] dependency to include cassandra driver\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T23:11:32+02:00",
          "tree_id": "99157c511bd69da72a30d075349064661799f2de",
          "url": "https://github.com/fruch/coodie/commit/0762c5fd136143acc7194e97691c5ab1a7cd5ca4"
        },
        "date": 1772053962635,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1407.39013666221,
            "unit": "iter/sec",
            "range": "stddev: 0.00011216137870998562",
            "extra": "mean: 710.5350349915175 usec\nrounds: 543"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1959.2439546810986,
            "unit": "iter/sec",
            "range": "stddev: 0.00009742441531501497",
            "extra": "mean: 510.4009623767182 usec\nrounds: 505"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 957.0070318328909,
            "unit": "iter/sec",
            "range": "stddev: 0.0008967581751014662",
            "extra": "mean: 1.0449244015321053 msec\nrounds: 914"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1852.6865138117348,
            "unit": "iter/sec",
            "range": "stddev: 0.00011779786058966272",
            "extra": "mean: 539.7567222220398 usec\nrounds: 792"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1084.305478342649,
            "unit": "iter/sec",
            "range": "stddev: 0.00009527865927073065",
            "extra": "mean: 922.2493291544472 usec\nrounds: 957"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2007.9925482605697,
            "unit": "iter/sec",
            "range": "stddev: 0.00007667374416679747",
            "extra": "mean: 498.0098162546735 usec\nrounds: 849"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1329.3838034242183,
            "unit": "iter/sec",
            "range": "stddev: 0.00008685613136691058",
            "extra": "mean: 752.2282108629624 usec\nrounds: 626"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 985.6410089871005,
            "unit": "iter/sec",
            "range": "stddev: 0.00015080260473112258",
            "extra": "mean: 1.0145681753112685 msec\nrounds: 964"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 356.43480176654646,
            "unit": "iter/sec",
            "range": "stddev: 0.00016156027201211543",
            "extra": "mean: 2.805562181481281 msec\nrounds: 270"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 831.8385651445293,
            "unit": "iter/sec",
            "range": "stddev: 0.00011783231025175276",
            "extra": "mean: 1.2021563340553383 msec\nrounds: 461"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 749.6921015679806,
            "unit": "iter/sec",
            "range": "stddev: 0.0001444944682703203",
            "extra": "mean: 1.3338809331304153 msec\nrounds: 658"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1671.493845324254,
            "unit": "iter/sec",
            "range": "stddev: 0.00008598538600165829",
            "extra": "mean: 598.2672343050174 usec\nrounds: 892"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1168.0365533396728,
            "unit": "iter/sec",
            "range": "stddev: 0.00014911872458698666",
            "extra": "mean: 856.1375901642637 usec\nrounds: 610"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1041.8707803573234,
            "unit": "iter/sec",
            "range": "stddev: 0.00012746133330708093",
            "extra": "mean: 959.8119256756934 usec\nrounds: 592"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1296.3639264366966,
            "unit": "iter/sec",
            "range": "stddev: 0.00008999635870601438",
            "extra": "mean: 771.3883266936397 usec\nrounds: 753"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1951.0537494110076,
            "unit": "iter/sec",
            "range": "stddev: 0.00006726194567456698",
            "extra": "mean: 512.5435423303352 usec\nrounds: 815"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 724.1738987119762,
            "unit": "iter/sec",
            "range": "stddev: 0.00011998059971827827",
            "extra": "mean: 1.380883792937872 msec\nrounds: 623"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1058.6509751775222,
            "unit": "iter/sec",
            "range": "stddev: 0.00010646651414921183",
            "extra": "mean: 944.5983836479371 usec\nrounds: 636"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 24135.196417286727,
            "unit": "iter/sec",
            "range": "stddev: 0.000026367411260704762",
            "extra": "mean: 41.433265456408485 usec\nrounds: 9915"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 39916.83411230282,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018344935598474753",
            "extra": "mean: 25.052086976301272 usec\nrounds: 15395"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 656.861575461896,
            "unit": "iter/sec",
            "range": "stddev: 0.00011199202108864383",
            "extra": "mean: 1.5223907705315443 msec\nrounds: 414"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1660.9872425520014,
            "unit": "iter/sec",
            "range": "stddev: 0.00017706864516827504",
            "extra": "mean: 602.0515837698811 usec\nrounds: 764"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 19.438450608999354,
            "unit": "iter/sec",
            "range": "stddev: 0.0007230435653487517",
            "extra": "mean: 51.444429399997205 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 484.87104316996675,
            "unit": "iter/sec",
            "range": "stddev: 0.0001003772642704109",
            "extra": "mean: 2.0624040434797837 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1553.0754303757594,
            "unit": "iter/sec",
            "range": "stddev: 0.00006671680242360619",
            "extra": "mean: 643.8837293035114 usec\nrounds: 761"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2123.243554584098,
            "unit": "iter/sec",
            "range": "stddev: 0.00006587843256568102",
            "extra": "mean: 470.97752767975805 usec\nrounds: 849"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1457.9238053073177,
            "unit": "iter/sec",
            "range": "stddev: 0.00008077091295126163",
            "extra": "mean: 685.9069015538906 usec\nrounds: 965"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2073.6798899688943,
            "unit": "iter/sec",
            "range": "stddev: 0.00007120626777070158",
            "extra": "mean: 482.2345072821246 usec\nrounds: 824"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 727.2402233439035,
            "unit": "iter/sec",
            "range": "stddev: 0.00012490183506777149",
            "extra": "mean: 1.3750614554870564 msec\nrounds: 483"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1018.2911917281632,
            "unit": "iter/sec",
            "range": "stddev: 0.00011114762513375697",
            "extra": "mean: 982.0373662497062 usec\nrounds: 800"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 903.1394939584872,
            "unit": "iter/sec",
            "range": "stddev: 0.00009415392454141606",
            "extra": "mean: 1.1072486661135483 msec\nrounds: 602"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1142.2930361592091,
            "unit": "iter/sec",
            "range": "stddev: 0.0000904380468254178",
            "extra": "mean: 875.4321074759868 usec\nrounds: 642"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 833.1993548766875,
            "unit": "iter/sec",
            "range": "stddev: 0.00023492851143166438",
            "extra": "mean: 1.2001929600005496 msec\nrounds: 500"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1126.999601529144,
            "unit": "iter/sec",
            "range": "stddev: 0.00010607317561881377",
            "extra": "mean: 887.3117600424813 usec\nrounds: 946"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1601.2121339791204,
            "unit": "iter/sec",
            "range": "stddev: 0.0000759877639216211",
            "extra": "mean: 624.5268686010594 usec\nrounds: 586"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2233.883999559394,
            "unit": "iter/sec",
            "range": "stddev: 0.00007987478481754628",
            "extra": "mean: 447.6508181253985 usec\nrounds: 1622"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 764.878499026865,
            "unit": "iter/sec",
            "range": "stddev: 0.0001141919784833365",
            "extra": "mean: 1.307397189582756 msec\nrounds: 480"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 869.0032851855183,
            "unit": "iter/sec",
            "range": "stddev: 0.0004136728325883768",
            "extra": "mean: 1.1507436358960552 msec\nrounds: 585"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1601.3721357162035,
            "unit": "iter/sec",
            "range": "stddev: 0.00007577906537362442",
            "extra": "mean: 624.4644687493306 usec\nrounds: 960"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2189.813765677036,
            "unit": "iter/sec",
            "range": "stddev: 0.00006395491102510242",
            "extra": "mean: 456.6598382355245 usec\nrounds: 884"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1494.6796117310603,
            "unit": "iter/sec",
            "range": "stddev: 0.00007683195619094151",
            "extra": "mean: 669.0397006498616 usec\nrounds: 922"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2046.8685068888235,
            "unit": "iter/sec",
            "range": "stddev: 0.00008448731586534678",
            "extra": "mean: 488.55116810603965 usec\nrounds: 1505"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 210.85049039109444,
            "unit": "iter/sec",
            "range": "stddev: 0.0023607315127867384",
            "extra": "mean: 4.742697055838749 msec\nrounds: 197"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 618.8583388776706,
            "unit": "iter/sec",
            "range": "stddev: 0.0001661295539229911",
            "extra": "mean: 1.6158786868955313 msec\nrounds: 412"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 877.2361643145317,
            "unit": "iter/sec",
            "range": "stddev: 0.00013503281636112366",
            "extra": "mean: 1.1399438836192934 msec\nrounds: 696"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1545.9874029846274,
            "unit": "iter/sec",
            "range": "stddev: 0.0001167396540215481",
            "extra": "mean: 646.835800905904 usec\nrounds: 663"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 916.467613104058,
            "unit": "iter/sec",
            "range": "stddev: 0.00006875029316006304",
            "extra": "mean: 1.0911460325510243 msec\nrounds: 553"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1040.3202556546735,
            "unit": "iter/sec",
            "range": "stddev: 0.00007710729436419236",
            "extra": "mean: 961.2424583338524 usec\nrounds: 432"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 7146.958632644403,
            "unit": "iter/sec",
            "range": "stddev: 0.00006114425079298146",
            "extra": "mean: 139.91965693384685 usec\nrounds: 137"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 217512.3681472543,
            "unit": "iter/sec",
            "range": "stddev: 0.0000033025127050063523",
            "extra": "mean: 4.597439715809664 usec\nrounds: 141"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 6061.31268550979,
            "unit": "iter/sec",
            "range": "stddev: 0.00006139615374567688",
            "extra": "mean: 164.98076437973674 usec\nrounds: 2712"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 208265.51780165258,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011897641315793613",
            "extra": "mean: 4.8015629786222105 usec\nrounds: 25596"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 73345.49853228776,
            "unit": "iter/sec",
            "range": "stddev: 0.00002193116106369325",
            "extra": "mean: 13.6341018877905 usec\nrounds: 13505"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 483583.01738255296,
            "unit": "iter/sec",
            "range": "stddev: 6.966890877288953e-7",
            "extra": "mean: 2.067897266973128 usec\nrounds: 30331"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 209238.68121333537,
            "unit": "iter/sec",
            "range": "stddev: 0.000007000309385263809",
            "extra": "mean: 4.779231039887987 usec\nrounds: 36656"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 511136.12195012596,
            "unit": "iter/sec",
            "range": "stddev: 6.410610454848127e-7",
            "extra": "mean: 1.956426002890821 usec\nrounds: 19521"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1880.174702225143,
            "unit": "iter/sec",
            "range": "stddev: 0.00007727878761617561",
            "extra": "mean: 531.8654691058886 usec\nrounds: 1230"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 994.9785939595226,
            "unit": "iter/sec",
            "range": "stddev: 0.0001430847763048048",
            "extra": "mean: 1.0050467478104175 msec\nrounds: 571"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 768.5027116225738,
            "unit": "iter/sec",
            "range": "stddev: 0.00018065420074863322",
            "extra": "mean: 1.3012315830202545 msec\nrounds: 530"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 643.9036823107857,
            "unit": "iter/sec",
            "range": "stddev: 0.0001273744063415796",
            "extra": "mean: 1.5530273043497542 msec\nrounds: 414"
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
          "id": "83d82bbacb45d37d6a6d9aad92c17b9bc9a94ad0",
          "message": "feat(test): add pytest-bats plugin to run .bats files as pytest items\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T23:29:00+02:00",
          "tree_id": "386203bbc9e60efdda7adf7a48760cec2aa982d8",
          "url": "https://github.com/fruch/coodie/commit/83d82bbacb45d37d6a6d9aad92c17b9bc9a94ad0"
        },
        "date": 1772055016201,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1342.9728180896302,
            "unit": "iter/sec",
            "range": "stddev: 0.00020851790110356836",
            "extra": "mean: 744.6167089386763 usec\nrounds: 828"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1967.078102413092,
            "unit": "iter/sec",
            "range": "stddev: 0.0000726990511004481",
            "extra": "mean: 508.3682232918259 usec\nrounds: 936"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 939.3620110651311,
            "unit": "iter/sec",
            "range": "stddev: 0.0007408696304598859",
            "extra": "mean: 1.0645523112714683 msec\nrounds: 967"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1991.357780914829,
            "unit": "iter/sec",
            "range": "stddev: 0.000069087463334033",
            "extra": "mean: 502.1699312820624 usec\nrounds: 975"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1051.6796300338187,
            "unit": "iter/sec",
            "range": "stddev: 0.00008191006135937428",
            "extra": "mean: 950.8599115567572 usec\nrounds: 995"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1959.8988300216827,
            "unit": "iter/sec",
            "range": "stddev: 0.0000651693838140901",
            "extra": "mean: 510.2304183675322 usec\nrounds: 980"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1330.8635218102409,
            "unit": "iter/sec",
            "range": "stddev: 0.00006532697500021272",
            "extra": "mean: 751.3918471818957 usec\nrounds: 674"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1019.1292514262742,
            "unit": "iter/sec",
            "range": "stddev: 0.00010177128752912251",
            "extra": "mean: 981.2298082902608 usec\nrounds: 965"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 335.0043871648665,
            "unit": "iter/sec",
            "range": "stddev: 0.0001293480281128462",
            "extra": "mean: 2.9850355347969444 msec\nrounds: 273"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 908.154456431334,
            "unit": "iter/sec",
            "range": "stddev: 0.00008214482429197695",
            "extra": "mean: 1.101134276133578 msec\nrounds: 507"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 721.1554612367081,
            "unit": "iter/sec",
            "range": "stddev: 0.0001466025215356848",
            "extra": "mean: 1.3866635611205134 msec\nrounds: 499"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1631.4811446437639,
            "unit": "iter/sec",
            "range": "stddev: 0.00007859832253254467",
            "extra": "mean: 612.939967638027 usec\nrounds: 927"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1157.98557091972,
            "unit": "iter/sec",
            "range": "stddev: 0.00006891786261377367",
            "extra": "mean: 863.5686187400062 usec\nrounds: 619"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1038.5081831768032,
            "unit": "iter/sec",
            "range": "stddev: 0.00008647437104169738",
            "extra": "mean: 962.9197113700093 usec\nrounds: 686"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1309.526329998878,
            "unit": "iter/sec",
            "range": "stddev: 0.00006193195456150405",
            "extra": "mean: 763.6348938481112 usec\nrounds: 829"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1937.0541905727973,
            "unit": "iter/sec",
            "range": "stddev: 0.00005826703303178719",
            "extra": "mean: 516.2478183970137 usec\nrounds: 848"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 727.5659028623462,
            "unit": "iter/sec",
            "range": "stddev: 0.00010627826444366071",
            "extra": "mean: 1.3744459382522736 msec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1050.0543617323017,
            "unit": "iter/sec",
            "range": "stddev: 0.00009081649465962608",
            "extra": "mean: 952.3316472399335 usec\nrounds: 652"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27161.15600472809,
            "unit": "iter/sec",
            "range": "stddev: 0.000025788640925004297",
            "extra": "mean: 36.817284206383725 usec\nrounds: 14025"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46819.11224939247,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021065068218816467",
            "extra": "mean: 21.35879883141048 usec\nrounds: 14033"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 577.2644582272407,
            "unit": "iter/sec",
            "range": "stddev: 0.00012570815680089937",
            "extra": "mean: 1.7323082787236992 msec\nrounds: 470"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1711.8363138288641,
            "unit": "iter/sec",
            "range": "stddev: 0.00007440046177047505",
            "extra": "mean: 584.1680024670701 usec\nrounds: 811"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.755684311154198,
            "unit": "iter/sec",
            "range": "stddev: 0.0015502001141519616",
            "extra": "mean: 53.317169526322736 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 476.9606244112274,
            "unit": "iter/sec",
            "range": "stddev: 0.0003671669382636382",
            "extra": "mean: 2.0966091304380234 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1518.7346726429048,
            "unit": "iter/sec",
            "range": "stddev: 0.000057827633609996895",
            "extra": "mean: 658.442859054372 usec\nrounds: 1121"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2188.6711112706175,
            "unit": "iter/sec",
            "range": "stddev: 0.00005091488105276699",
            "extra": "mean: 456.89824974180664 usec\nrounds: 965"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1457.7386091685985,
            "unit": "iter/sec",
            "range": "stddev: 0.00006910030806174216",
            "extra": "mean: 685.9940415314488 usec\nrounds: 1228"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2069.9713046210877,
            "unit": "iter/sec",
            "range": "stddev: 0.00006233941479821315",
            "extra": "mean: 483.0984843932665 usec\nrounds: 929"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 712.4532675193146,
            "unit": "iter/sec",
            "range": "stddev: 0.00010304943607090442",
            "extra": "mean: 1.4036008333316963 msec\nrounds: 642"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 995.7303617798549,
            "unit": "iter/sec",
            "range": "stddev: 0.00019940062640035457",
            "extra": "mean: 1.0042879461991228 msec\nrounds: 855"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 882.734252853248,
            "unit": "iter/sec",
            "range": "stddev: 0.00007800647542731057",
            "extra": "mean: 1.1328437712343389 msec\nrounds: 730"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1091.8850609499352,
            "unit": "iter/sec",
            "range": "stddev: 0.00009664752931829671",
            "extra": "mean: 915.8473137548053 usec\nrounds: 647"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 856.8746118099649,
            "unit": "iter/sec",
            "range": "stddev: 0.0000847212795174804",
            "extra": "mean: 1.167031892668302 msec\nrounds: 764"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1110.8208481561667,
            "unit": "iter/sec",
            "range": "stddev: 0.0000852204022131746",
            "extra": "mean: 900.2351744296875 usec\nrounds: 1009"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1639.1559084194012,
            "unit": "iter/sec",
            "range": "stddev: 0.00007082053287032358",
            "extra": "mean: 610.0700945307125 usec\nrounds: 1280"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2136.2642003419787,
            "unit": "iter/sec",
            "range": "stddev: 0.00009684140499628663",
            "extra": "mean: 468.1068941940408 usec\nrounds: 1843"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 770.4082233629114,
            "unit": "iter/sec",
            "range": "stddev: 0.00010813298894071774",
            "extra": "mean: 1.2980131437783684 msec\nrounds: 466"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 857.1753594699177,
            "unit": "iter/sec",
            "range": "stddev: 0.00044176528424041457",
            "extra": "mean: 1.16662242906563 msec\nrounds: 578"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1653.6253555529586,
            "unit": "iter/sec",
            "range": "stddev: 0.000054775766852746",
            "extra": "mean: 604.7318980940568 usec\nrounds: 1207"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2096.18250236796,
            "unit": "iter/sec",
            "range": "stddev: 0.00006177740699026772",
            "extra": "mean: 477.0576983971322 usec\nrounds: 998"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1511.274383112949,
            "unit": "iter/sec",
            "range": "stddev: 0.0000684138820163891",
            "extra": "mean: 661.6932114869722 usec\nrounds: 1149"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2006.2569996106172,
            "unit": "iter/sec",
            "range": "stddev: 0.00006994287570237993",
            "extra": "mean: 498.4406285904968 usec\nrounds: 1602"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 212.3844836879777,
            "unit": "iter/sec",
            "range": "stddev: 0.0017905522595472578",
            "extra": "mean: 4.708441891024105 msec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 664.4708408544449,
            "unit": "iter/sec",
            "range": "stddev: 0.00013061831594127882",
            "extra": "mean: 1.5049569349259888 msec\nrounds: 461"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 837.8095864265382,
            "unit": "iter/sec",
            "range": "stddev: 0.0001252173990079465",
            "extra": "mean: 1.1935886342208655 msec\nrounds: 678"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1479.1005566089461,
            "unit": "iter/sec",
            "range": "stddev: 0.00007651712651152723",
            "extra": "mean: 676.0865551241802 usec\nrounds: 771"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 919.7798069565529,
            "unit": "iter/sec",
            "range": "stddev: 0.00007972222787951466",
            "extra": "mean: 1.087216736480535 msec\nrounds: 721"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1058.865652372874,
            "unit": "iter/sec",
            "range": "stddev: 0.000057490976996068445",
            "extra": "mean: 944.4068732978934 usec\nrounds: 663"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5764.430924711205,
            "unit": "iter/sec",
            "range": "stddev: 0.000059103370804036374",
            "extra": "mean: 173.4776620729651 usec\nrounds: 145"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 216432.4146744598,
            "unit": "iter/sec",
            "range": "stddev: 0.0000014161932810590754",
            "extra": "mean: 4.620379999475214 usec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4476.904443890285,
            "unit": "iter/sec",
            "range": "stddev: 0.00005853724145910413",
            "extra": "mean: 223.36862725866726 usec\nrounds: 3155"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 205422.44170159756,
            "unit": "iter/sec",
            "range": "stddev: 8.533535668914637e-7",
            "extra": "mean: 4.868017299943442 usec\nrounds: 38554"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 80724.53874516678,
            "unit": "iter/sec",
            "range": "stddev: 0.000018267940487428177",
            "extra": "mean: 12.387806923949418 usec\nrounds: 18977"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 502112.53529691993,
            "unit": "iter/sec",
            "range": "stddev: 5.707576797371473e-7",
            "extra": "mean: 1.991585411044675 usec\nrounds: 44719"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 215792.5425830861,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018083057588141283",
            "extra": "mean: 4.634080436838879 usec\nrounds: 52563"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 505903.7954065366,
            "unit": "iter/sec",
            "range": "stddev: 4.889296791561974e-7",
            "extra": "mean: 1.9766604027874808 usec\nrounds: 39005"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1858.0734574998612,
            "unit": "iter/sec",
            "range": "stddev: 0.00006328515384709888",
            "extra": "mean: 538.1918545596977 usec\nrounds: 1437"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1068.8419917581539,
            "unit": "iter/sec",
            "range": "stddev: 0.00008322295007782831",
            "extra": "mean: 935.5919843260324 usec\nrounds: 638"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 801.4691672679397,
            "unit": "iter/sec",
            "range": "stddev: 0.00008565637518466389",
            "extra": "mean: 1.2477086341434882 msec\nrounds: 615"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 637.3863599745818,
            "unit": "iter/sec",
            "range": "stddev: 0.00010639685639275599",
            "extra": "mean: 1.5689071225808455 msec\nrounds: 465"
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
          "id": "e64b66ec71c30985bc914d253e991ccdcf1515f0",
          "message": "docs: complete Phase 4 — API reference, recipes, and integration examples\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T23:29:46+02:00",
          "tree_id": "0c36a480362c43fcda32c9f9cc7c717daf69de8e",
          "url": "https://github.com/fruch/coodie/commit/e64b66ec71c30985bc914d253e991ccdcf1515f0"
        },
        "date": 1772055057423,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1304.018029654449,
            "unit": "iter/sec",
            "range": "stddev: 0.000511439238668207",
            "extra": "mean: 766.860562706322 usec\nrounds: 606"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2228.8555061539614,
            "unit": "iter/sec",
            "range": "stddev: 0.00010421047346430828",
            "extra": "mean: 448.66075761257696 usec\nrounds: 821"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 918.8859503361024,
            "unit": "iter/sec",
            "range": "stddev: 0.0011096065560615",
            "extra": "mean: 1.0882743387623113 msec\nrounds: 921"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1926.0064486838862,
            "unit": "iter/sec",
            "range": "stddev: 0.00033088702421997615",
            "extra": "mean: 519.2090611551888 usec\nrounds: 883"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1122.6083700602994,
            "unit": "iter/sec",
            "range": "stddev: 0.00011299280844793887",
            "extra": "mean: 890.7825976268877 usec\nrounds: 927"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2133.3600127548016,
            "unit": "iter/sec",
            "range": "stddev: 0.00009043179916743095",
            "extra": "mean: 468.7441378957426 usec\nrounds: 979"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1390.1201117787289,
            "unit": "iter/sec",
            "range": "stddev: 0.0000894043087839507",
            "extra": "mean: 719.362299363074 usec\nrounds: 628"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1098.1682415150071,
            "unit": "iter/sec",
            "range": "stddev: 0.00013005616053130318",
            "extra": "mean: 910.6072841993895 usec\nrounds: 943"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 347.4956337172904,
            "unit": "iter/sec",
            "range": "stddev: 0.00016862156957714894",
            "extra": "mean: 2.8777340000005958 msec\nrounds: 222"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 885.370401182663,
            "unit": "iter/sec",
            "range": "stddev: 0.0001360535586398922",
            "extra": "mean: 1.1294707826963908 msec\nrounds: 497"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 787.3784357463569,
            "unit": "iter/sec",
            "range": "stddev: 0.00013558250071718988",
            "extra": "mean: 1.27003732208147 msec\nrounds: 711"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1855.3566385476825,
            "unit": "iter/sec",
            "range": "stddev: 0.00008555383290160282",
            "extra": "mean: 538.979934759481 usec\nrounds: 935"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1230.1830057299426,
            "unit": "iter/sec",
            "range": "stddev: 0.00008472958052625471",
            "extra": "mean: 812.8871845426276 usec\nrounds: 634"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1158.59709511347,
            "unit": "iter/sec",
            "range": "stddev: 0.00011796315865482612",
            "extra": "mean: 863.1128148151128 usec\nrounds: 675"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1369.9527166019702,
            "unit": "iter/sec",
            "range": "stddev: 0.00008338166575239547",
            "extra": "mean: 729.9522004528734 usec\nrounds: 883"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2192.5698240349625,
            "unit": "iter/sec",
            "range": "stddev: 0.0000714183192527773",
            "extra": "mean: 456.08581721685414 usec\nrounds: 848"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 778.5370855941742,
            "unit": "iter/sec",
            "range": "stddev: 0.00011851016990562705",
            "extra": "mean: 1.2844603275858166 msec\nrounds: 290"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1178.9321103486209,
            "unit": "iter/sec",
            "range": "stddev: 0.00012304705741433743",
            "extra": "mean: 848.2252635432002 usec\nrounds: 683"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 35268.91897801883,
            "unit": "iter/sec",
            "range": "stddev: 0.00002212847517038802",
            "extra": "mean: 28.353576717881392 usec\nrounds: 12748"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 65705.10589483847,
            "unit": "iter/sec",
            "range": "stddev: 0.000002039519789080403",
            "extra": "mean: 15.21951736293535 usec\nrounds: 18430"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 620.2707740308317,
            "unit": "iter/sec",
            "range": "stddev: 0.00042457008792615327",
            "extra": "mean: 1.6121991263613737 msec\nrounds: 459"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1785.0623902019565,
            "unit": "iter/sec",
            "range": "stddev: 0.00033611285877156076",
            "extra": "mean: 560.2045090910592 usec\nrounds: 770"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 19.058379112321457,
            "unit": "iter/sec",
            "range": "stddev: 0.0004871141504557299",
            "extra": "mean: 52.47035931578718 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 485.7962023105593,
            "unit": "iter/sec",
            "range": "stddev: 0.0006708474644736212",
            "extra": "mean: 2.058476363635138 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1660.1673165814607,
            "unit": "iter/sec",
            "range": "stddev: 0.00010030259862309528",
            "extra": "mean: 602.3489259258239 usec\nrounds: 891"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2458.3136582881507,
            "unit": "iter/sec",
            "range": "stddev: 0.0000656606967013606",
            "extra": "mean: 406.78291666668406 usec\nrounds: 924"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1560.6645008269754,
            "unit": "iter/sec",
            "range": "stddev: 0.00007910846246284984",
            "extra": "mean: 640.752704678112 usec\nrounds: 1026"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2245.5741252834246,
            "unit": "iter/sec",
            "range": "stddev: 0.00008099488425594808",
            "extra": "mean: 445.3204143834643 usec\nrounds: 876"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 762.8229131844807,
            "unit": "iter/sec",
            "range": "stddev: 0.00011823241970535978",
            "extra": "mean: 1.3109202446809045 msec\nrounds: 564"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1133.4374614776264,
            "unit": "iter/sec",
            "range": "stddev: 0.0001170685811096408",
            "extra": "mean: 882.2718799997416 usec\nrounds: 825"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 983.6027206181384,
            "unit": "iter/sec",
            "range": "stddev: 0.00011395771244652943",
            "extra": "mean: 1.0166706323987766 msec\nrounds: 642"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1215.436044624411,
            "unit": "iter/sec",
            "range": "stddev: 0.0002610304599483798",
            "extra": "mean: 822.7499952982026 usec\nrounds: 638"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 924.2944543329473,
            "unit": "iter/sec",
            "range": "stddev: 0.00011056054532262332",
            "extra": "mean: 1.0819063073592585 msec\nrounds: 693"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1274.675321018249,
            "unit": "iter/sec",
            "range": "stddev: 0.00009511459538978798",
            "extra": "mean: 784.5135019960769 usec\nrounds: 1002"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1771.461194511123,
            "unit": "iter/sec",
            "range": "stddev: 0.00006850428151027826",
            "extra": "mean: 564.505732950009 usec\nrounds: 1217"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2512.1893824045083,
            "unit": "iter/sec",
            "range": "stddev: 0.00006350821976873707",
            "extra": "mean: 398.0591618625756 usec\nrounds: 1804"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 793.6597487414624,
            "unit": "iter/sec",
            "range": "stddev: 0.00044795923406853403",
            "extra": "mean: 1.25998578305847 msec\nrounds: 484"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 981.9076344268261,
            "unit": "iter/sec",
            "range": "stddev: 0.00013330991344607723",
            "extra": "mean: 1.018425730627642 msec\nrounds: 542"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1718.4629233736134,
            "unit": "iter/sec",
            "range": "stddev: 0.00007881959215870386",
            "extra": "mean: 581.9153770491844 usec\nrounds: 1159"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2404.1328679144262,
            "unit": "iter/sec",
            "range": "stddev: 0.0000686752377630759",
            "extra": "mean: 415.9503883275367 usec\nrounds: 891"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1592.154050152023,
            "unit": "iter/sec",
            "range": "stddev: 0.00008018358171747676",
            "extra": "mean: 628.0799272561079 usec\nrounds: 1086"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2306.5405999193154,
            "unit": "iter/sec",
            "range": "stddev: 0.00007913344794554104",
            "extra": "mean: 433.5497064456532 usec\nrounds: 1567"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 244.44629713881827,
            "unit": "iter/sec",
            "range": "stddev: 0.00032828853002939097",
            "extra": "mean: 4.090878085308494 msec\nrounds: 211"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 637.11307785541,
            "unit": "iter/sec",
            "range": "stddev: 0.0014488579820834619",
            "extra": "mean: 1.5695800867345335 msec\nrounds: 392"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 918.0869782682289,
            "unit": "iter/sec",
            "range": "stddev: 0.00012694166673025354",
            "extra": "mean: 1.0892214176550923 msec\nrounds: 759"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1679.3368189575124,
            "unit": "iter/sec",
            "range": "stddev: 0.000214989892543742",
            "extra": "mean: 595.4731586369751 usec\nrounds: 851"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 933.5526307062237,
            "unit": "iter/sec",
            "range": "stddev: 0.00033730467883363147",
            "extra": "mean: 1.0711768861317539 msec\nrounds: 685"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1105.9736472479776,
            "unit": "iter/sec",
            "range": "stddev: 0.0002075879120255346",
            "extra": "mean: 904.1806759937955 usec\nrounds: 679"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 6470.338619803007,
            "unit": "iter/sec",
            "range": "stddev: 0.00007727465545176019",
            "extra": "mean: 154.55141666611036 usec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 228760.49929586408,
            "unit": "iter/sec",
            "range": "stddev: 0.000002662088130481343",
            "extra": "mean: 4.37138405921498 usec\nrounds: 138"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 5202.296833577477,
            "unit": "iter/sec",
            "range": "stddev: 0.00007138289006081894",
            "extra": "mean: 192.22278773976214 usec\nrounds: 2398"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 220292.7618802315,
            "unit": "iter/sec",
            "range": "stddev: 7.686897876929173e-7",
            "extra": "mean: 4.53941378493261 usec\nrounds: 29525"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 93934.0127130328,
            "unit": "iter/sec",
            "range": "stddev: 0.00001725528668017956",
            "extra": "mean: 10.645771122915692 usec\nrounds: 22523"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 497531.5409382496,
            "unit": "iter/sec",
            "range": "stddev: 3.3564009616402177e-7",
            "extra": "mean: 2.0099228244187106 usec\nrounds: 36553"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 223359.00334918106,
            "unit": "iter/sec",
            "range": "stddev: 0.000005164439223310208",
            "extra": "mean: 4.477097341075982 usec\nrounds: 33059"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 567450.9911455502,
            "unit": "iter/sec",
            "range": "stddev: 3.8346811361133175e-7",
            "extra": "mean: 1.762266725415767 usec\nrounds: 37458"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 2019.60994377212,
            "unit": "iter/sec",
            "range": "stddev: 0.00008542552798580821",
            "extra": "mean: 495.14511605753586 usec\nrounds: 1258"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1135.80154971506,
            "unit": "iter/sec",
            "range": "stddev: 0.00020616149998400085",
            "extra": "mean: 880.435495312426 usec\nrounds: 640"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 875.9335989685434,
            "unit": "iter/sec",
            "range": "stddev: 0.00014013286106113058",
            "extra": "mean: 1.141639047957004 msec\nrounds: 563"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 718.271590390671,
            "unit": "iter/sec",
            "range": "stddev: 0.00013553502530746543",
            "extra": "mean: 1.392231035416695 msec\nrounds: 480"
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
          "id": "fbc6ef4bc37aef7692b6f02a99f12215ae0f0947",
          "message": "docs(perf): add Phase 5 benchmark results analysis to performance plan\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-25T23:59:52+02:00",
          "tree_id": "a5da7b3523a1b4fffbb00e9e10f044792d111ca0",
          "url": "https://github.com/fruch/coodie/commit/fbc6ef4bc37aef7692b6f02a99f12215ae0f0947"
        },
        "date": 1772056868055,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1327.4681220015223,
            "unit": "iter/sec",
            "range": "stddev: 0.00027289096023728186",
            "extra": "mean: 753.3137582936648 usec\nrounds: 422"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1957.5986242050649,
            "unit": "iter/sec",
            "range": "stddev: 0.0000596498255338478",
            "extra": "mean: 510.829946259324 usec\nrounds: 949"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 969.9521158224267,
            "unit": "iter/sec",
            "range": "stddev: 0.0006927444756128881",
            "extra": "mean: 1.030978729452119 msec\nrounds: 876"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1867.5531758838595,
            "unit": "iter/sec",
            "range": "stddev: 0.00007902113266922732",
            "extra": "mean: 535.4599873852206 usec\nrounds: 872"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1056.1385562733956,
            "unit": "iter/sec",
            "range": "stddev: 0.0000926053749030496",
            "extra": "mean: 946.8454627094748 usec\nrounds: 657"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1916.0106912854458,
            "unit": "iter/sec",
            "range": "stddev: 0.00006075120061676",
            "extra": "mean: 521.9177557558946 usec\nrounds: 999"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1320.819245884322,
            "unit": "iter/sec",
            "range": "stddev: 0.0000637938923631227",
            "extra": "mean: 757.1058667686771 usec\nrounds: 653"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1007.7704607061781,
            "unit": "iter/sec",
            "range": "stddev: 0.0000925505243294042",
            "extra": "mean: 992.2894537901685 usec\nrounds: 963"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 330.47460917398985,
            "unit": "iter/sec",
            "range": "stddev: 0.00013597926215907873",
            "extra": "mean: 3.0259510783580814 msec\nrounds: 268"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 923.9424722705065,
            "unit": "iter/sec",
            "range": "stddev: 0.00008498495134041768",
            "extra": "mean: 1.0823184668008483 msec\nrounds: 497"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 727.2426307874205,
            "unit": "iter/sec",
            "range": "stddev: 0.0001166048770371965",
            "extra": "mean: 1.3750569035223528 msec\nrounds: 653"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1666.5050650923915,
            "unit": "iter/sec",
            "range": "stddev: 0.00007246402884791695",
            "extra": "mean: 600.0581822081408 usec\nrounds: 933"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1159.934156698821,
            "unit": "iter/sec",
            "range": "stddev: 0.00006770445452602271",
            "extra": "mean: 862.1179005936041 usec\nrounds: 674"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1021.754401255333,
            "unit": "iter/sec",
            "range": "stddev: 0.00009344264120286007",
            "extra": "mean: 978.7087765625423 usec\nrounds: 640"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1290.8779834442369,
            "unit": "iter/sec",
            "range": "stddev: 0.000059319251655668295",
            "extra": "mean: 774.6665547210472 usec\nrounds: 932"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1990.9850884444104,
            "unit": "iter/sec",
            "range": "stddev: 0.00005130399237274128",
            "extra": "mean: 502.2639324643645 usec\nrounds: 844"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 738.4789175604266,
            "unit": "iter/sec",
            "range": "stddev: 0.00009551816360505362",
            "extra": "mean: 1.354134798192359 msec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1051.9572613156568,
            "unit": "iter/sec",
            "range": "stddev: 0.00009266613524400254",
            "extra": "mean: 950.6089617645921 usec\nrounds: 680"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26747.420726802142,
            "unit": "iter/sec",
            "range": "stddev: 0.000024499160451638304",
            "extra": "mean: 37.386782457044696 usec\nrounds: 11754"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 45560.80406081552,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020138028395903556",
            "extra": "mean: 21.948690779582797 usec\nrounds: 21192"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 569.6048218243494,
            "unit": "iter/sec",
            "range": "stddev: 0.00022285399406456373",
            "extra": "mean: 1.7556031158534902 msec\nrounds: 492"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1724.938692023949,
            "unit": "iter/sec",
            "range": "stddev: 0.00007038997220692561",
            "extra": "mean: 579.7307490544226 usec\nrounds: 793"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.865932682988127,
            "unit": "iter/sec",
            "range": "stddev: 0.00016156607037309464",
            "extra": "mean: 53.00559568421043 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 517.8684893235184,
            "unit": "iter/sec",
            "range": "stddev: 0.0001287509888107726",
            "extra": "mean: 1.9309921739132665 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1582.616368942107,
            "unit": "iter/sec",
            "range": "stddev: 0.00005299026188905232",
            "extra": "mean: 631.8650682656881 usec\nrounds: 1084"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2104.312880797603,
            "unit": "iter/sec",
            "range": "stddev: 0.00004920046195432014",
            "extra": "mean: 475.21450309279453 usec\nrounds: 970"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1463.7289612672007,
            "unit": "iter/sec",
            "range": "stddev: 0.0000608709958361803",
            "extra": "mean: 683.186591549207 usec\nrounds: 1207"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2014.4910497900873,
            "unit": "iter/sec",
            "range": "stddev: 0.000055941286133201095",
            "extra": "mean: 496.4032975496224 usec\nrounds: 857"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 743.6843393851736,
            "unit": "iter/sec",
            "range": "stddev: 0.00009405045283337493",
            "extra": "mean: 1.3446565256796053 msec\nrounds: 662"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 996.3569015088087,
            "unit": "iter/sec",
            "range": "stddev: 0.00021423323853582115",
            "extra": "mean: 1.0036564191864126 msec\nrounds: 959"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 908.9811300777303,
            "unit": "iter/sec",
            "range": "stddev: 0.00008610405019426362",
            "extra": "mean: 1.1001328486483393 msec\nrounds: 740"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1139.6846965642383,
            "unit": "iter/sec",
            "range": "stddev: 0.00007990405162025297",
            "extra": "mean: 877.4356653332802 usec\nrounds: 750"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 859.8239710185861,
            "unit": "iter/sec",
            "range": "stddev: 0.00007961668230044916",
            "extra": "mean: 1.1630287520541618 msec\nrounds: 730"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1119.9493253180906,
            "unit": "iter/sec",
            "range": "stddev: 0.00008144269165695611",
            "extra": "mean: 892.8975422311877 usec\nrounds: 959"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1602.0072402900032,
            "unit": "iter/sec",
            "range": "stddev: 0.00005725200117993547",
            "extra": "mean: 624.216904175149 usec\nrounds: 1461"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2138.9913117305323,
            "unit": "iter/sec",
            "range": "stddev: 0.00008665581398093817",
            "extra": "mean: 467.5100803429439 usec\nrounds: 1867"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 781.5584765914692,
            "unit": "iter/sec",
            "range": "stddev: 0.00007647052866154479",
            "extra": "mean: 1.2794947914341577 msec\nrounds: 537"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 897.9711583677944,
            "unit": "iter/sec",
            "range": "stddev: 0.00011332611447354114",
            "extra": "mean: 1.1136215129867415 msec\nrounds: 616"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1650.5981877995569,
            "unit": "iter/sec",
            "range": "stddev: 0.00005418765890476579",
            "extra": "mean: 605.8409656520456 usec\nrounds: 1281"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2144.5193018733316,
            "unit": "iter/sec",
            "range": "stddev: 0.0000516969414945548",
            "extra": "mean: 466.30496593173876 usec\nrounds: 998"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1478.2063776414584,
            "unit": "iter/sec",
            "range": "stddev: 0.0000632315507948315",
            "extra": "mean: 676.4955253376345 usec\nrounds: 1184"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2014.5129697989405,
            "unit": "iter/sec",
            "range": "stddev: 0.00006170886559256717",
            "extra": "mean: 496.397896162369 usec\nrounds: 1772"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 209.1691702450382,
            "unit": "iter/sec",
            "range": "stddev: 0.0005550728258880704",
            "extra": "mean: 4.780819270968646 msec\nrounds: 155"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 641.512991683018,
            "unit": "iter/sec",
            "range": "stddev: 0.0009936594928600534",
            "extra": "mean: 1.5588148844444858 msec\nrounds: 450"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 831.4544557386924,
            "unit": "iter/sec",
            "range": "stddev: 0.00014484257259064968",
            "extra": "mean: 1.2027116976738863 msec\nrounds: 645"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1617.2618997588202,
            "unit": "iter/sec",
            "range": "stddev: 0.00007178511210855943",
            "extra": "mean: 618.3290412945043 usec\nrounds: 896"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 953.6650774344121,
            "unit": "iter/sec",
            "range": "stddev: 0.0001504118845480828",
            "extra": "mean: 1.0485861584553773 msec\nrounds: 751"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1065.9988878851943,
            "unit": "iter/sec",
            "range": "stddev: 0.00005111143502218474",
            "extra": "mean: 938.0872826085892 usec\nrounds: 736"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5912.70674041315,
            "unit": "iter/sec",
            "range": "stddev: 0.000046850106159190305",
            "extra": "mean: 169.12727857193283 usec\nrounds: 140"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 219835.348915714,
            "unit": "iter/sec",
            "range": "stddev: 0.00000267022979925755",
            "extra": "mean: 4.548858975284293 usec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4490.215174054797,
            "unit": "iter/sec",
            "range": "stddev: 0.000055433692515161734",
            "extra": "mean: 222.70647646869233 usec\nrounds: 3251"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 212245.87474470714,
            "unit": "iter/sec",
            "range": "stddev: 7.75453754738698e-7",
            "extra": "mean: 4.711516778372332 usec\nrounds: 42674"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 78223.83724398362,
            "unit": "iter/sec",
            "range": "stddev: 0.000018054062714330867",
            "extra": "mean: 12.783826966720587 usec\nrounds: 29948"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 508904.42334135284,
            "unit": "iter/sec",
            "range": "stddev: 5.918184691592317e-7",
            "extra": "mean: 1.9650055179992802 usec\nrounds: 45125"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 221042.44707411603,
            "unit": "iter/sec",
            "range": "stddev: 0.000004968293692716387",
            "extra": "mean: 4.524017957802909 usec\nrounds: 57134"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 501499.0038781415,
            "unit": "iter/sec",
            "range": "stddev: 4.124026397630641e-7",
            "extra": "mean: 1.9940219068570444 usec\nrounds: 39531"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1851.363511009589,
            "unit": "iter/sec",
            "range": "stddev: 0.00006215238261291673",
            "extra": "mean: 540.1424377510164 usec\nrounds: 1494"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1053.6252108089086,
            "unit": "iter/sec",
            "range": "stddev: 0.0000833210040134883",
            "extra": "mean: 949.1040929366728 usec\nrounds: 538"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 799.438870904271,
            "unit": "iter/sec",
            "range": "stddev: 0.0001061832782789493",
            "extra": "mean: 1.2508773796161148 msec\nrounds: 677"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 635.3550724992792,
            "unit": "iter/sec",
            "range": "stddev: 0.00012467939436836505",
            "extra": "mean: 1.5739230601659113 msec\nrounds: 482"
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
          "id": "7576aab81c8036c62cf04177c763326968e892a2",
          "message": "style(demo): apply ruff format to flask-blog app.py\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-26T00:01:23+02:00",
          "tree_id": "b3df59395bac31ce77b78aaff951249c11c085a9",
          "url": "https://github.com/fruch/coodie/commit/7576aab81c8036c62cf04177c763326968e892a2"
        },
        "date": 1772056957893,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1321.4225959852854,
            "unit": "iter/sec",
            "range": "stddev: 0.00025140804600898715",
            "extra": "mean: 756.7601787938062 usec\nrounds: 481"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2020.0051566398786,
            "unit": "iter/sec",
            "range": "stddev: 0.00006313440512808514",
            "extra": "mean: 495.0482411952958 usec\nrounds: 937"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 951.1230097253788,
            "unit": "iter/sec",
            "range": "stddev: 0.0007295646935647377",
            "extra": "mean: 1.0513887160491824 msec\nrounds: 972"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1955.9042676641857,
            "unit": "iter/sec",
            "range": "stddev: 0.00006966861399616889",
            "extra": "mean: 511.2724669261229 usec\nrounds: 771"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1051.891537660664,
            "unit": "iter/sec",
            "range": "stddev: 0.00008654696179116312",
            "extra": "mean: 950.6683571425365 usec\nrounds: 980"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1984.124304884912,
            "unit": "iter/sec",
            "range": "stddev: 0.00007546764706065488",
            "extra": "mean: 504.00068057127316 usec\nrounds: 911"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1355.6075804540264,
            "unit": "iter/sec",
            "range": "stddev: 0.00007137909640407287",
            "extra": "mean: 737.6766067249899 usec\nrounds: 684"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1042.942472483084,
            "unit": "iter/sec",
            "range": "stddev: 0.00009566422537108918",
            "extra": "mean: 958.825655665509 usec\nrounds: 909"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 331.7983012093982,
            "unit": "iter/sec",
            "range": "stddev: 0.00013395426714875945",
            "extra": "mean: 3.0138792041882674 msec\nrounds: 191"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 895.9525850896678,
            "unit": "iter/sec",
            "range": "stddev: 0.00008848161585598057",
            "extra": "mean: 1.1161304924410917 msec\nrounds: 463"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 723.3999868236647,
            "unit": "iter/sec",
            "range": "stddev: 0.00012045945316649923",
            "extra": "mean: 1.3823610978911436 msec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1681.6727083806327,
            "unit": "iter/sec",
            "range": "stddev: 0.00007579131875509891",
            "extra": "mean: 594.6460301201834 usec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1162.315290102454,
            "unit": "iter/sec",
            "range": "stddev: 0.00007475781094811861",
            "extra": "mean: 860.3517552555413 usec\nrounds: 666"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1070.3943748961449,
            "unit": "iter/sec",
            "range": "stddev: 0.00008444812040868677",
            "extra": "mean: 934.2351038578888 usec\nrounds: 674"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1296.3517939376338,
            "unit": "iter/sec",
            "range": "stddev: 0.00006228482544576257",
            "extra": "mean: 771.3955460828474 usec\nrounds: 868"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1957.3039176359189,
            "unit": "iter/sec",
            "range": "stddev: 0.00005749768103329081",
            "extra": "mean: 510.9068607024632 usec\nrounds: 883"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 729.4886878388962,
            "unit": "iter/sec",
            "range": "stddev: 0.00010735830166036639",
            "extra": "mean: 1.3708231761105043 msec\nrounds: 653"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1048.7408626946767,
            "unit": "iter/sec",
            "range": "stddev: 0.00009331272608097512",
            "extra": "mean: 953.5243982298545 usec\nrounds: 678"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26830.221113581723,
            "unit": "iter/sec",
            "range": "stddev: 0.000025885398025711566",
            "extra": "mean: 37.271403607396664 usec\nrounds: 11920"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46870.13506370639,
            "unit": "iter/sec",
            "range": "stddev: 0.0000017938198510777987",
            "extra": "mean: 21.335547649708907 usec\nrounds: 18594"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 588.561562010909,
            "unit": "iter/sec",
            "range": "stddev: 0.00009011126793945165",
            "extra": "mean: 1.6990576084910298 msec\nrounds: 424"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1671.9267164260436,
            "unit": "iter/sec",
            "range": "stddev: 0.0001487971208527727",
            "extra": "mean: 598.1123395992064 usec\nrounds: 798"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.796993652761017,
            "unit": "iter/sec",
            "range": "stddev: 0.000456153661809377",
            "extra": "mean: 53.199996684209864 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 486.1881783832487,
            "unit": "iter/sec",
            "range": "stddev: 0.00013954971571462026",
            "extra": "mean: 2.0568167727264806 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1592.9194952687287,
            "unit": "iter/sec",
            "range": "stddev: 0.000059907135886967844",
            "extra": "mean: 627.7781162012195 usec\nrounds: 895"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2223.492318941465,
            "unit": "iter/sec",
            "range": "stddev: 0.000047034269271048185",
            "extra": "mean: 449.7429523282854 usec\nrounds: 902"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1481.5981110377625,
            "unit": "iter/sec",
            "range": "stddev: 0.00006485924732638676",
            "extra": "mean: 674.9468648414822 usec\nrounds: 1169"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2055.3708871363297,
            "unit": "iter/sec",
            "range": "stddev: 0.0000617062630072854",
            "extra": "mean: 486.5301957221269 usec\nrounds: 935"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 752.6311285744018,
            "unit": "iter/sec",
            "range": "stddev: 0.00009294538661669107",
            "extra": "mean: 1.3286721237456025 msec\nrounds: 598"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1027.2679050520924,
            "unit": "iter/sec",
            "range": "stddev: 0.00008822403253939697",
            "extra": "mean: 973.455897027456 usec\nrounds: 942"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 950.2504603659096,
            "unit": "iter/sec",
            "range": "stddev: 0.00008120679979674543",
            "extra": "mean: 1.0523541336827489 msec\nrounds: 763"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1173.950392492751,
            "unit": "iter/sec",
            "range": "stddev: 0.00007451076452634569",
            "extra": "mean: 851.824750342826 usec\nrounds: 729"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 828.8495301448104,
            "unit": "iter/sec",
            "range": "stddev: 0.0002384896984839569",
            "extra": "mean: 1.2064916050869783 msec\nrounds: 747"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1123.8180569184228,
            "unit": "iter/sec",
            "range": "stddev: 0.00007920567606178424",
            "extra": "mean: 889.8237520244696 usec\nrounds: 988"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1640.247492846606,
            "unit": "iter/sec",
            "range": "stddev: 0.0000780082377803902",
            "extra": "mean: 609.6640929866788 usec\nrounds: 1269"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2242.153735678559,
            "unit": "iter/sec",
            "range": "stddev: 0.000052774000416173796",
            "extra": "mean: 445.99974751390675 usec\nrounds: 1810"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 741.613403776042,
            "unit": "iter/sec",
            "range": "stddev: 0.00019180227435925458",
            "extra": "mean: 1.3484114430892722 msec\nrounds: 492"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 859.0058667126949,
            "unit": "iter/sec",
            "range": "stddev: 0.00046814110207828825",
            "extra": "mean: 1.1641364031969554 msec\nrounds: 563"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1672.399533712077,
            "unit": "iter/sec",
            "range": "stddev: 0.000057171287494557124",
            "extra": "mean: 597.9432425339108 usec\nrounds: 1105"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2228.509991253518,
            "unit": "iter/sec",
            "range": "stddev: 0.00004879558939109328",
            "extra": "mean: 448.7303193276277 usec\nrounds: 952"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1529.0272965521413,
            "unit": "iter/sec",
            "range": "stddev: 0.00006511954900813335",
            "extra": "mean: 654.010560998444 usec\nrounds: 1082"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2071.293039820096,
            "unit": "iter/sec",
            "range": "stddev: 0.00006360246572010589",
            "extra": "mean: 482.7902091955351 usec\nrounds: 1740"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 201.7515146599527,
            "unit": "iter/sec",
            "range": "stddev: 0.0018970126953635792",
            "extra": "mean: 4.956592279792673 msec\nrounds: 193"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 636.5072276741902,
            "unit": "iter/sec",
            "range": "stddev: 0.0004650560027769058",
            "extra": "mean: 1.5710740687957612 msec\nrounds: 407"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 843.0447514489615,
            "unit": "iter/sec",
            "range": "stddev: 0.00012398949099697953",
            "extra": "mean: 1.186176651098623 msec\nrounds: 728"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1609.6072598667804,
            "unit": "iter/sec",
            "range": "stddev: 0.00008842708296932339",
            "extra": "mean: 621.2695636591284 usec\nrounds: 809"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 949.369365416913,
            "unit": "iter/sec",
            "range": "stddev: 0.00006509793067251475",
            "extra": "mean: 1.0533308071941554 msec\nrounds: 695"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1067.8500645187762,
            "unit": "iter/sec",
            "range": "stddev: 0.00007316454328034039",
            "extra": "mean: 936.461056871919 usec\nrounds: 633"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5689.811279665657,
            "unit": "iter/sec",
            "range": "stddev: 0.000051912639793870044",
            "extra": "mean: 175.7527536236249 usec\nrounds: 138"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 202139.7556733457,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023124135760635984",
            "extra": "mean: 4.947072369158209 usec\nrounds: 152"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4428.675000029663,
            "unit": "iter/sec",
            "range": "stddev: 0.000056100718517532515",
            "extra": "mean: 225.80117077755807 usec\nrounds: 3203"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 206577.81288097004,
            "unit": "iter/sec",
            "range": "stddev: 7.441652821186852e-7",
            "extra": "mean: 4.840790915799845 usec\nrounds: 33905"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 80153.43504112495,
            "unit": "iter/sec",
            "range": "stddev: 0.000018627693890534837",
            "extra": "mean: 12.476071667882008 usec\nrounds: 26567"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 504304.7349125448,
            "unit": "iter/sec",
            "range": "stddev: 0.000003050073953257704",
            "extra": "mean: 1.982928040866833 usec\nrounds: 37966"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 214801.5280819872,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010293541354098968",
            "extra": "mean: 4.655460363477078 usec\nrounds: 48314"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 497757.48838029423,
            "unit": "iter/sec",
            "range": "stddev: 4.7225100293000453e-7",
            "extra": "mean: 2.0090104585950197 usec\nrounds: 36047"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1755.9095145213728,
            "unit": "iter/sec",
            "range": "stddev: 0.00006629169895483355",
            "extra": "mean: 569.5054282296436 usec\nrounds: 1254"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1075.9775177446452,
            "unit": "iter/sec",
            "range": "stddev: 0.00008894404283074445",
            "extra": "mean: 929.3874486300592 usec\nrounds: 584"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 773.0919940089703,
            "unit": "iter/sec",
            "range": "stddev: 0.00021152338083194432",
            "extra": "mean: 1.2935071217260554 msec\nrounds: 649"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 638.6882728992297,
            "unit": "iter/sec",
            "range": "stddev: 0.00026584785449431113",
            "extra": "mean: 1.5657090358973553 msec\nrounds: 390"
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
          "id": "4afa28af15b56650e56967bd98ada06fd5117b3f",
          "message": "docs(demos): add CI testing section to demos-extension-plan\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-26T12:35:00+02:00",
          "tree_id": "bcfd0a34cee0b3cf9cb9df815424e32c70726be5",
          "url": "https://github.com/fruch/coodie/commit/4afa28af15b56650e56967bd98ada06fd5117b3f"
        },
        "date": 1772102171050,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1405.897561715677,
            "unit": "iter/sec",
            "range": "stddev: 0.00013576098610322847",
            "extra": "mean: 711.2893764319906 usec\nrounds: 611"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2287.056962701938,
            "unit": "iter/sec",
            "range": "stddev: 0.00007732856318993263",
            "extra": "mean: 437.2431541095487 usec\nrounds: 876"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 1015.3005756336746,
            "unit": "iter/sec",
            "range": "stddev: 0.0007929587588843044",
            "extra": "mean: 984.9300039802251 usec\nrounds: 1005"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2184.7795902512253,
            "unit": "iter/sec",
            "range": "stddev: 0.00008757435909920203",
            "extra": "mean: 457.712075150341 usec\nrounds: 998"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1167.1644995879576,
            "unit": "iter/sec",
            "range": "stddev: 0.00008962345205544393",
            "extra": "mean: 856.7772583496402 usec\nrounds: 1018"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2207.3537365174457,
            "unit": "iter/sec",
            "range": "stddev: 0.0000780425007023876",
            "extra": "mean: 453.03114922472986 usec\nrounds: 1032"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1354.5841993283323,
            "unit": "iter/sec",
            "range": "stddev: 0.00008841995465758612",
            "extra": "mean: 738.2339174603158 usec\nrounds: 630"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1101.3353597902153,
            "unit": "iter/sec",
            "range": "stddev: 0.00011938982543796178",
            "extra": "mean: 907.9886440679451 usec\nrounds: 885"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 352.6746123445464,
            "unit": "iter/sec",
            "range": "stddev: 0.0001703645298188648",
            "extra": "mean: 2.8354748683272026 msec\nrounds: 281"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 895.0087008052357,
            "unit": "iter/sec",
            "range": "stddev: 0.0003169415323998954",
            "extra": "mean: 1.117307573770293 msec\nrounds: 305"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 806.5295240410622,
            "unit": "iter/sec",
            "range": "stddev: 0.00011761085806590218",
            "extra": "mean: 1.2398802154068296 msec\nrounds: 701"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1905.0973287989907,
            "unit": "iter/sec",
            "range": "stddev: 0.0000855023314757677",
            "extra": "mean: 524.9075650273569 usec\nrounds: 915"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1147.0136475839743,
            "unit": "iter/sec",
            "range": "stddev: 0.00010721475185190028",
            "extra": "mean: 871.8292080537681 usec\nrounds: 149"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1136.370487752219,
            "unit": "iter/sec",
            "range": "stddev: 0.00010241759078210216",
            "extra": "mean: 879.9946943166706 usec\nrounds: 651"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1323.4306379957745,
            "unit": "iter/sec",
            "range": "stddev: 0.00008689589514557594",
            "extra": "mean: 755.611946172273 usec\nrounds: 836"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2108.353741916626,
            "unit": "iter/sec",
            "range": "stddev: 0.0000711860536579851",
            "extra": "mean: 474.3037091541086 usec\nrounds: 863"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 756.5051835632302,
            "unit": "iter/sec",
            "range": "stddev: 0.0001293904496715658",
            "extra": "mean: 1.3218680079492384 msec\nrounds: 629"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1153.616178504185,
            "unit": "iter/sec",
            "range": "stddev: 0.000109823875408747",
            "extra": "mean: 866.8394381367219 usec\nrounds: 687"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 35290.74121449676,
            "unit": "iter/sec",
            "range": "stddev: 0.000021666436597780213",
            "extra": "mean: 28.336044117691102 usec\nrounds: 12376"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 66190.92031617665,
            "unit": "iter/sec",
            "range": "stddev: 9.37831049770515e-7",
            "extra": "mean: 15.107812298473304 usec\nrounds: 18913"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 646.1579965102221,
            "unit": "iter/sec",
            "range": "stddev: 0.00012615080555456628",
            "extra": "mean: 1.5476091070617588 msec\nrounds: 439"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1813.7776279947204,
            "unit": "iter/sec",
            "range": "stddev: 0.00015385261869171201",
            "extra": "mean: 551.3355025255117 usec\nrounds: 792"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 19.098688154735285,
            "unit": "iter/sec",
            "range": "stddev: 0.0005824473515728068",
            "extra": "mean: 52.3596171578969 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 566.2255177915895,
            "unit": "iter/sec",
            "range": "stddev: 0.00012884254543006144",
            "extra": "mean: 1.7660807727285612 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1577.3265705810968,
            "unit": "iter/sec",
            "range": "stddev: 0.0000807495622828002",
            "extra": "mean: 633.9841213931962 usec\nrounds: 1005"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2476.0981629082085,
            "unit": "iter/sec",
            "range": "stddev: 0.00006551120564603905",
            "extra": "mean: 403.8612099390629 usec\nrounds: 986"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1600.2069158117292,
            "unit": "iter/sec",
            "range": "stddev: 0.00007997035830603138",
            "extra": "mean: 624.9191839623658 usec\nrounds: 1060"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2334.944446714824,
            "unit": "iter/sec",
            "range": "stddev: 0.00006928735375068443",
            "extra": "mean: 428.2757139712515 usec\nrounds: 909"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 745.7228048982645,
            "unit": "iter/sec",
            "range": "stddev: 0.0002425226693489168",
            "extra": "mean: 1.340980848958247 msec\nrounds: 576"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1110.0151383133443,
            "unit": "iter/sec",
            "range": "stddev: 0.00010314805149156323",
            "extra": "mean: 900.8886144737529 usec\nrounds: 760"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 942.7501313582254,
            "unit": "iter/sec",
            "range": "stddev: 0.00011204945636804372",
            "extra": "mean: 1.0607264499229445 msec\nrounds: 649"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1264.3816558869034,
            "unit": "iter/sec",
            "range": "stddev: 0.00013864255270471827",
            "extra": "mean: 790.9004336974089 usec\nrounds: 641"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 899.5637047420299,
            "unit": "iter/sec",
            "range": "stddev: 0.00011516189780198703",
            "extra": "mean: 1.1116500084746888 msec\nrounds: 708"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1271.7223730925082,
            "unit": "iter/sec",
            "range": "stddev: 0.00009050101055848421",
            "extra": "mean: 786.3351476378073 usec\nrounds: 1016"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1726.783911561854,
            "unit": "iter/sec",
            "range": "stddev: 0.00011363592326280364",
            "extra": "mean: 579.111256078077 usec\nrounds: 1234"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2546.6364107054756,
            "unit": "iter/sec",
            "range": "stddev: 0.000058957149433161644",
            "extra": "mean: 392.6748222856743 usec\nrounds: 1750"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 706.0575784791502,
            "unit": "iter/sec",
            "range": "stddev: 0.00028176589063021916",
            "extra": "mean: 1.4163150860217415 msec\nrounds: 465"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 825.7293249624408,
            "unit": "iter/sec",
            "range": "stddev: 0.00038079133295737826",
            "extra": "mean: 1.2110506067414841 msec\nrounds: 534"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1638.8446858046036,
            "unit": "iter/sec",
            "range": "stddev: 0.00007559820060693666",
            "extra": "mean: 610.1859490785378 usec\nrounds: 1139"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2406.9106289252622,
            "unit": "iter/sec",
            "range": "stddev: 0.00006487336671046034",
            "extra": "mean: 415.4703494107389 usec\nrounds: 933"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1559.432593886193,
            "unit": "iter/sec",
            "range": "stddev: 0.0000769092725982952",
            "extra": "mean: 641.2588809035627 usec\nrounds: 974"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2259.280198096023,
            "unit": "iter/sec",
            "range": "stddev: 0.00007997670775610792",
            "extra": "mean: 442.618848623883 usec\nrounds: 1526"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 244.20384727693494,
            "unit": "iter/sec",
            "range": "stddev: 0.00036295522410956384",
            "extra": "mean: 4.094939580808357 msec\nrounds: 198"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 626.3799078569851,
            "unit": "iter/sec",
            "range": "stddev: 0.0013731685242455033",
            "extra": "mean: 1.5964752180849322 msec\nrounds: 376"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 908.1092457622369,
            "unit": "iter/sec",
            "range": "stddev: 0.0001269030179337662",
            "extra": "mean: 1.101189096649526 msec\nrounds: 776"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1695.4530652944127,
            "unit": "iter/sec",
            "range": "stddev: 0.00009175441324275028",
            "extra": "mean: 589.8128473561441 usec\nrounds: 832"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 1029.6203214767845,
            "unit": "iter/sec",
            "range": "stddev: 0.0000683417756126288",
            "extra": "mean: 971.2318018021439 usec\nrounds: 666"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1178.189039973422,
            "unit": "iter/sec",
            "range": "stddev: 0.00007717194819083445",
            "extra": "mean: 848.7602295320607 usec\nrounds: 684"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 6425.643342389023,
            "unit": "iter/sec",
            "range": "stddev: 0.00006889922625267914",
            "extra": "mean: 155.62644029791494 usec\nrounds: 134"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 229515.72179625672,
            "unit": "iter/sec",
            "range": "stddev: 0.000002266321153249416",
            "extra": "mean: 4.357000000582572 usec\nrounds: 130"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4992.366742665526,
            "unit": "iter/sec",
            "range": "stddev: 0.00006333455424906404",
            "extra": "mean: 200.30579713902983 usec\nrounds: 2307"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 212972.3581794072,
            "unit": "iter/sec",
            "range": "stddev: 0.0000063038218469534274",
            "extra": "mean: 4.695445026521251 usec\nrounds: 28441"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 93233.32113216078,
            "unit": "iter/sec",
            "range": "stddev: 0.000017786270177891543",
            "extra": "mean: 10.725779022528574 usec\nrounds: 22405"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 513759.9493276184,
            "unit": "iter/sec",
            "range": "stddev: 3.551867238317085e-7",
            "extra": "mean: 1.94643432464665 usec\nrounds: 33894"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 227872.9506716135,
            "unit": "iter/sec",
            "range": "stddev: 6.62364238456358e-7",
            "extra": "mean: 4.388410283241975 usec\nrounds: 43916"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 568498.766575424,
            "unit": "iter/sec",
            "range": "stddev: 3.7295482187581177e-7",
            "extra": "mean: 1.7590187680157927 usec\nrounds: 34740"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1804.7249390633883,
            "unit": "iter/sec",
            "range": "stddev: 0.00011329807841955061",
            "extra": "mean: 554.1010590339476 usec\nrounds: 1118"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1182.3156140717529,
            "unit": "iter/sec",
            "range": "stddev: 0.000111138250438188",
            "extra": "mean: 845.7978462756829 usec\nrounds: 631"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 761.0212788707017,
            "unit": "iter/sec",
            "range": "stddev: 0.00013633049888512683",
            "extra": "mean: 1.314023704414579 msec\nrounds: 521"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 638.4704789329571,
            "unit": "iter/sec",
            "range": "stddev: 0.00015384820555724077",
            "extra": "mean: 1.5662431279066318 msec\nrounds: 344"
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
          "id": "c927dc8334fb08358e7b40dc65e53b61f8f70885",
          "message": "docs: improve landing page by embedding README sections via include markers\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-26T16:39:26+02:00",
          "tree_id": "83bf98c3767e1a061f0a6e9697adbae48aff4818",
          "url": "https://github.com/fruch/coodie/commit/c927dc8334fb08358e7b40dc65e53b61f8f70885"
        },
        "date": 1772116971457,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1263.1795396253342,
            "unit": "iter/sec",
            "range": "stddev: 0.0002934167044665854",
            "extra": "mean: 791.6531012658781 usec\nrounds: 395"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1920.4045863779581,
            "unit": "iter/sec",
            "range": "stddev: 0.0000912625984939902",
            "extra": "mean: 520.7236053763456 usec\nrounds: 930"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 923.6109342282657,
            "unit": "iter/sec",
            "range": "stddev: 0.0009468148140888205",
            "extra": "mean: 1.082706974268946 msec\nrounds: 855"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1857.666410886276,
            "unit": "iter/sec",
            "range": "stddev: 0.00010181080772646175",
            "extra": "mean: 538.309781637764 usec\nrounds: 806"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1027.2951230502051,
            "unit": "iter/sec",
            "range": "stddev: 0.00010319438293465377",
            "extra": "mean: 973.4301054898796 usec\nrounds: 929"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1902.1577977563577,
            "unit": "iter/sec",
            "range": "stddev: 0.00008855255115211215",
            "extra": "mean: 525.7187396227195 usec\nrounds: 530"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1288.3666385812783,
            "unit": "iter/sec",
            "range": "stddev: 0.00009882003693541059",
            "extra": "mean: 776.1765712135939 usec\nrounds: 667"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 990.3593066519331,
            "unit": "iter/sec",
            "range": "stddev: 0.0001256682187877139",
            "extra": "mean: 1.00973454107344 msec\nrounds: 913"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 305.37302035622037,
            "unit": "iter/sec",
            "range": "stddev: 0.00035643305842424983",
            "extra": "mean: 3.274683529126086 msec\nrounds: 206"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 842.1274332080259,
            "unit": "iter/sec",
            "range": "stddev: 0.00013453065020976567",
            "extra": "mean: 1.1874687375882884 msec\nrounds: 423"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 709.8821041396159,
            "unit": "iter/sec",
            "range": "stddev: 0.00014495599196166613",
            "extra": "mean: 1.4086846170210332 msec\nrounds: 611"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1600.6599695216667,
            "unit": "iter/sec",
            "range": "stddev: 0.00010677169738133963",
            "extra": "mean: 624.7423056995891 usec\nrounds: 772"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1152.498673283314,
            "unit": "iter/sec",
            "range": "stddev: 0.00010879052144453999",
            "extra": "mean: 867.6799576273128 usec\nrounds: 590"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 991.3368254114027,
            "unit": "iter/sec",
            "range": "stddev: 0.0001275249977670725",
            "extra": "mean: 1.0087388810407625 msec\nrounds: 538"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1295.6627168259859,
            "unit": "iter/sec",
            "range": "stddev: 0.00008195396224658418",
            "extra": "mean: 771.8058002392185 usec\nrounds: 836"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1855.3647083790208,
            "unit": "iter/sec",
            "range": "stddev: 0.00008281206221855265",
            "extra": "mean: 538.977590488757 usec\nrounds: 757"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 685.4804770535409,
            "unit": "iter/sec",
            "range": "stddev: 0.00016468796951785142",
            "extra": "mean: 1.4588307522606407 msec\nrounds: 553"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1028.3764365187685,
            "unit": "iter/sec",
            "range": "stddev: 0.00011668736953266288",
            "extra": "mean: 972.4065667871313 usec\nrounds: 554"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26407.454555524248,
            "unit": "iter/sec",
            "range": "stddev: 0.00002655847998964003",
            "extra": "mean: 37.86809508267457 usec\nrounds: 11937"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 47312.380754593185,
            "unit": "iter/sec",
            "range": "stddev: 0.000001962198599600773",
            "extra": "mean: 21.136116679203845 usec\nrounds: 13370"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 568.8448693250875,
            "unit": "iter/sec",
            "range": "stddev: 0.00012203121524670698",
            "extra": "mean: 1.7579485267863302 msec\nrounds: 336"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1581.603105139868,
            "unit": "iter/sec",
            "range": "stddev: 0.00017749532937348173",
            "extra": "mean: 632.269876526049 usec\nrounds: 737"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.487532944808713,
            "unit": "iter/sec",
            "range": "stddev: 0.00038365070135556225",
            "extra": "mean: 54.090505368419066 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 489.0775641447388,
            "unit": "iter/sec",
            "range": "stddev: 0.0002833761853233051",
            "extra": "mean: 2.044665454545483 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1351.6063878464763,
            "unit": "iter/sec",
            "range": "stddev: 0.00018076163597402186",
            "extra": "mean: 739.8603683675295 usec\nrounds: 980"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 1967.7575247707057,
            "unit": "iter/sec",
            "range": "stddev: 0.00015456055005563918",
            "extra": "mean: 508.19269519323814 usec\nrounds: 853"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1465.6520522618196,
            "unit": "iter/sec",
            "range": "stddev: 0.00009721767835162669",
            "extra": "mean: 682.2901782566897 usec\nrounds: 1021"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 1954.9293627822572,
            "unit": "iter/sec",
            "range": "stddev: 0.00007975967028838124",
            "extra": "mean: 511.5274336955066 usec\nrounds: 920"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 714.2838037983001,
            "unit": "iter/sec",
            "range": "stddev: 0.000131426651304481",
            "extra": "mean: 1.4000037445653473 msec\nrounds: 552"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 996.4677661374598,
            "unit": "iter/sec",
            "range": "stddev: 0.00010637586791883317",
            "extra": "mean: 1.0035447547653569 msec\nrounds: 787"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 859.203869488227,
            "unit": "iter/sec",
            "range": "stddev: 0.00010623598892552097",
            "extra": "mean: 1.1638681289874033 msec\nrounds: 721"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1116.3439490244052,
            "unit": "iter/sec",
            "range": "stddev: 0.00008534329151068694",
            "extra": "mean: 895.7812696292387 usec\nrounds: 675"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 836.2538861067337,
            "unit": "iter/sec",
            "range": "stddev: 0.00010835675119130175",
            "extra": "mean: 1.1958090917288329 msec\nrounds: 665"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1102.8351356715918,
            "unit": "iter/sec",
            "range": "stddev: 0.00009253795970172216",
            "extra": "mean: 906.7538452980386 usec\nrounds: 989"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1521.7587983156677,
            "unit": "iter/sec",
            "range": "stddev: 0.00014634722841992386",
            "extra": "mean: 657.1343639391687 usec\nrounds: 1198"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2165.6990650125863,
            "unit": "iter/sec",
            "range": "stddev: 0.00006131424460138071",
            "extra": "mean: 461.744669956806 usec\nrounds: 1621"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 723.4769936105395,
            "unit": "iter/sec",
            "range": "stddev: 0.00023306941849504588",
            "extra": "mean: 1.3822139595752203 msec\nrounds: 470"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 870.3621219270962,
            "unit": "iter/sec",
            "range": "stddev: 0.00020868671705293577",
            "extra": "mean: 1.1489470587091595 msec\nrounds: 511"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1487.2893164307357,
            "unit": "iter/sec",
            "range": "stddev: 0.00015226244855013615",
            "extra": "mean: 672.364138538859 usec\nrounds: 1191"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2126.0843413707626,
            "unit": "iter/sec",
            "range": "stddev: 0.00007562088765458261",
            "extra": "mean: 470.3482268042407 usec\nrounds: 582"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1448.3270759220604,
            "unit": "iter/sec",
            "range": "stddev: 0.000099845354784717",
            "extra": "mean: 690.4517747576884 usec\nrounds: 1030"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 1954.3222148025704,
            "unit": "iter/sec",
            "range": "stddev: 0.00009016196563368469",
            "extra": "mean: 511.68634958233946 usec\nrounds: 1436"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 193.7857713107327,
            "unit": "iter/sec",
            "range": "stddev: 0.0023698314980463682",
            "extra": "mean: 5.1603375894740715 msec\nrounds: 190"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 624.0775304626754,
            "unit": "iter/sec",
            "range": "stddev: 0.0001968053478770187",
            "extra": "mean: 1.6023650126589641 msec\nrounds: 316"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 825.3468586463395,
            "unit": "iter/sec",
            "range": "stddev: 0.00014675638395567796",
            "extra": "mean: 1.2116118084463436 msec\nrounds: 663"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1525.6379382695427,
            "unit": "iter/sec",
            "range": "stddev: 0.00012743166157194217",
            "extra": "mean: 655.4635113061305 usec\nrounds: 796"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 919.9663476008791,
            "unit": "iter/sec",
            "range": "stddev: 0.00007674742686057555",
            "extra": "mean: 1.0869962826442898 msec\nrounds: 605"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1038.2612009221682,
            "unit": "iter/sec",
            "range": "stddev: 0.00007381129723191005",
            "extra": "mean: 963.1487713417538 usec\nrounds: 656"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5685.316261777976,
            "unit": "iter/sec",
            "range": "stddev: 0.00006236438039204745",
            "extra": "mean: 175.89171014512195 usec\nrounds: 138"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 201863.77034373657,
            "unit": "iter/sec",
            "range": "stddev: 0.0000032582524923335246",
            "extra": "mean: 4.953835937460127 usec\nrounds: 128"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4444.064394633044,
            "unit": "iter/sec",
            "range": "stddev: 0.00007368786422849408",
            "extra": "mean: 225.01924166708034 usec\nrounds: 2640"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 205199.90322179277,
            "unit": "iter/sec",
            "range": "stddev: 0.0000064144362233828154",
            "extra": "mean: 4.8732966453650715 usec\nrounds: 29601"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 78161.90422917822,
            "unit": "iter/sec",
            "range": "stddev: 0.000020291968124212344",
            "extra": "mean: 12.793956465900624 usec\nrounds: 21018"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 509678.26158261584,
            "unit": "iter/sec",
            "range": "stddev: 4.6603147852274237e-7",
            "extra": "mean: 1.9620220742687215 usec\nrounds: 35879"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 222224.73682671154,
            "unit": "iter/sec",
            "range": "stddev: 7.74664008335368e-7",
            "extra": "mean: 4.4999490798352895 usec\nrounds: 42223"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 520410.33587642026,
            "unit": "iter/sec",
            "range": "stddev: 4.435250761716861e-7",
            "extra": "mean: 1.9215606052787277 usec\nrounds: 33974"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1755.524584061136,
            "unit": "iter/sec",
            "range": "stddev: 0.00008166159155425594",
            "extra": "mean: 569.630302576939 usec\nrounds: 1203"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1018.6306029490285,
            "unit": "iter/sec",
            "range": "stddev: 0.0001364485620670283",
            "extra": "mean: 981.7101480211853 usec\nrounds: 581"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 730.404861242645,
            "unit": "iter/sec",
            "range": "stddev: 0.00022527294040175898",
            "extra": "mean: 1.3691037027035802 msec\nrounds: 407"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 566.3504464961443,
            "unit": "iter/sec",
            "range": "stddev: 0.0013378332103567714",
            "extra": "mean: 1.7656912008928873 msec\nrounds: 448"
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
          "id": "c97c6aaef77ce5abd00c238193f371825cc74764",
          "message": "fix(ci): resolve scylla-driver/cassandra-driver namespace conflict in integration tests\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-26T16:42:13+02:00",
          "tree_id": "6c6fc14b19bb5357f977bc4353e82d83e7c67661",
          "url": "https://github.com/fruch/coodie/commit/c97c6aaef77ce5abd00c238193f371825cc74764"
        },
        "date": 1772117003101,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1350.393100392725,
            "unit": "iter/sec",
            "range": "stddev: 0.0003112105012375724",
            "extra": "mean: 740.5251105838569 usec\nrounds: 425"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2185.598079756008,
            "unit": "iter/sec",
            "range": "stddev: 0.00009148172540819803",
            "extra": "mean: 457.5406655333612 usec\nrounds: 879"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 966.0678007582708,
            "unit": "iter/sec",
            "range": "stddev: 0.0010768687206949533",
            "extra": "mean: 1.0351240349953654 msec\nrounds: 943"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2021.4506833688579,
            "unit": "iter/sec",
            "range": "stddev: 0.00010704285958306255",
            "extra": "mean: 494.69423529712117 usec\nrounds: 850"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1124.3489633480901,
            "unit": "iter/sec",
            "range": "stddev: 0.00011290870363755241",
            "extra": "mean: 889.4035860736658 usec\nrounds: 976"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2165.9304074391434,
            "unit": "iter/sec",
            "range": "stddev: 0.00009267839276166423",
            "extra": "mean: 461.69535113657486 usec\nrounds: 1011"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1364.3913609719402,
            "unit": "iter/sec",
            "range": "stddev: 0.00009506757582563071",
            "extra": "mean: 732.9275372189678 usec\nrounds: 618"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1097.062520647627,
            "unit": "iter/sec",
            "range": "stddev: 0.00013137334557138388",
            "extra": "mean: 911.5250782696247 usec\nrounds: 856"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 337.7168319452707,
            "unit": "iter/sec",
            "range": "stddev: 0.00020414979297538245",
            "extra": "mean: 2.9610605851059764 msec\nrounds: 282"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 876.8302317843204,
            "unit": "iter/sec",
            "range": "stddev: 0.00012289476540072294",
            "extra": "mean: 1.1404716258072367 msec\nrounds: 465"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 782.683701687763,
            "unit": "iter/sec",
            "range": "stddev: 0.00013454984432612182",
            "extra": "mean: 1.2776553259555814 msec\nrounds: 678"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1753.769163544293,
            "unit": "iter/sec",
            "range": "stddev: 0.00010164698985157832",
            "extra": "mean: 570.2004692447908 usec\nrounds: 569"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1248.2662915600733,
            "unit": "iter/sec",
            "range": "stddev: 0.00008330906127052819",
            "extra": "mean: 801.1111144803949 usec\nrounds: 594"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1113.7696351113084,
            "unit": "iter/sec",
            "range": "stddev: 0.00011865449738453284",
            "extra": "mean: 897.8517356509378 usec\nrounds: 662"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1349.093297733053,
            "unit": "iter/sec",
            "range": "stddev: 0.00008608157135765745",
            "extra": "mean: 741.238579778247 usec\nrounds: 821"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2107.0767397407158,
            "unit": "iter/sec",
            "range": "stddev: 0.00007513208158721901",
            "extra": "mean: 474.59116278937904 usec\nrounds: 559"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 750.653673116668,
            "unit": "iter/sec",
            "range": "stddev: 0.00013051852174064872",
            "extra": "mean: 1.332172259742714 msec\nrounds: 616"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1141.1611737059018,
            "unit": "iter/sec",
            "range": "stddev: 0.00011107967547384516",
            "extra": "mean: 876.3004061490427 usec\nrounds: 682"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 35142.52485468228,
            "unit": "iter/sec",
            "range": "stddev: 0.000022457555307750956",
            "extra": "mean: 28.45555361019438 usec\nrounds: 11714"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 66459.71000828253,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010702081486098121",
            "extra": "mean: 15.046710253104852 usec\nrounds: 19203"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 640.8215954379887,
            "unit": "iter/sec",
            "range": "stddev: 0.00012296542895929799",
            "extra": "mean: 1.5604967234547085 msec\nrounds: 452"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1834.058829590861,
            "unit": "iter/sec",
            "range": "stddev: 0.00015825284677900559",
            "extra": "mean: 545.2387807118915 usec\nrounds: 757"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.779066999693654,
            "unit": "iter/sec",
            "range": "stddev: 0.00046797333455524397",
            "extra": "mean: 53.25078184216038 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 531.6493902765375,
            "unit": "iter/sec",
            "range": "stddev: 0.00015097924990156256",
            "extra": "mean: 1.880938863636898 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1568.3144957944066,
            "unit": "iter/sec",
            "range": "stddev: 0.00008377212258526038",
            "extra": "mean: 637.627212323549 usec\nrounds: 909"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2281.41482303892,
            "unit": "iter/sec",
            "range": "stddev: 0.0000725817215756007",
            "extra": "mean: 438.3244949149435 usec\nrounds: 885"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1537.4995467004949,
            "unit": "iter/sec",
            "range": "stddev: 0.00009052553957370926",
            "extra": "mean: 650.4066958237615 usec\nrounds: 1029"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2221.8140437254624,
            "unit": "iter/sec",
            "range": "stddev: 0.00008672646540087552",
            "extra": "mean: 450.0826713306907 usec\nrounds: 858"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 735.4336717755889,
            "unit": "iter/sec",
            "range": "stddev: 0.00013675541637219002",
            "extra": "mean: 1.3597419296639728 msec\nrounds: 526"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1092.5110674088385,
            "unit": "iter/sec",
            "range": "stddev: 0.0001228576434328419",
            "extra": "mean: 915.3225352414494 usec\nrounds: 837"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 976.1183164297296,
            "unit": "iter/sec",
            "range": "stddev: 0.00011541794001085176",
            "extra": "mean: 1.024465972176017 msec\nrounds: 683"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1171.6829693493821,
            "unit": "iter/sec",
            "range": "stddev: 0.00025741585006728256",
            "extra": "mean: 853.4731887033272 usec\nrounds: 673"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 894.8976726856326,
            "unit": "iter/sec",
            "range": "stddev: 0.00011136448923433098",
            "extra": "mean: 1.117446195830357 msec\nrounds: 623"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1196.5953994925007,
            "unit": "iter/sec",
            "range": "stddev: 0.00010822708606835453",
            "extra": "mean: 835.7043662579008 usec\nrounds: 830"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1703.758623769879,
            "unit": "iter/sec",
            "range": "stddev: 0.00007507988133356631",
            "extra": "mean: 586.937601399966 usec\nrounds: 1139"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2347.9049141623386,
            "unit": "iter/sec",
            "range": "stddev: 0.00007038720818910597",
            "extra": "mean: 425.9116261344722 usec\nrounds: 1653"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 723.0629617316438,
            "unit": "iter/sec",
            "range": "stddev: 0.0005573573772042247",
            "extra": "mean: 1.3830054268097585 msec\nrounds: 485"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 910.008946153785,
            "unit": "iter/sec",
            "range": "stddev: 0.00013929082859905873",
            "extra": "mean: 1.0988902957784847 msec\nrounds: 497"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1672.3051670249379,
            "unit": "iter/sec",
            "range": "stddev: 0.00008856626632250889",
            "extra": "mean: 597.9769839370996 usec\nrounds: 934"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2374.6413312816194,
            "unit": "iter/sec",
            "range": "stddev: 0.00007901658071047102",
            "extra": "mean: 421.1162278811551 usec\nrounds: 904"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1511.9683768903508,
            "unit": "iter/sec",
            "range": "stddev: 0.00010279649137179838",
            "extra": "mean: 661.3894941749306 usec\nrounds: 1030"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2156.0067430402337,
            "unit": "iter/sec",
            "range": "stddev: 0.0000951280337207939",
            "extra": "mean: 463.8204417625696 usec\nrounds: 1408"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 215.80233585600533,
            "unit": "iter/sec",
            "range": "stddev: 0.0024174105123045747",
            "extra": "mean: 4.633870138770197 msec\nrounds: 209"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 628.3379644173162,
            "unit": "iter/sec",
            "range": "stddev: 0.0001730539110337488",
            "extra": "mean: 1.591500206305919 msec\nrounds: 349"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 901.1822814178977,
            "unit": "iter/sec",
            "range": "stddev: 0.00014288784370028738",
            "extra": "mean: 1.109653419313377 msec\nrounds: 694"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1623.8594708089345,
            "unit": "iter/sec",
            "range": "stddev: 0.00011129387747910897",
            "extra": "mean: 615.81683512419 usec\nrounds: 746"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 982.7587690090995,
            "unit": "iter/sec",
            "range": "stddev: 0.00008027661390078584",
            "extra": "mean: 1.0175437060798598 msec\nrounds: 609"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1134.9297428507055,
            "unit": "iter/sec",
            "range": "stddev: 0.00007562526173293449",
            "extra": "mean: 881.1118100475627 usec\nrounds: 637"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 6418.823551226618,
            "unit": "iter/sec",
            "range": "stddev: 0.00007866574455764861",
            "extra": "mean: 155.7917883268349 usec\nrounds: 137"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 222139.56492142958,
            "unit": "iter/sec",
            "range": "stddev: 0.00000329666266671641",
            "extra": "mean: 4.501674433159615 usec\nrounds: 129"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 5108.406744185132,
            "unit": "iter/sec",
            "range": "stddev: 0.00007704950290317013",
            "extra": "mean: 195.75575126986388 usec\nrounds: 2171"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 215706.36213103612,
            "unit": "iter/sec",
            "range": "stddev: 7.63396488649821e-7",
            "extra": "mean: 4.63593187572523 usec\nrounds: 29534"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 93302.54692826474,
            "unit": "iter/sec",
            "range": "stddev: 0.000017288331068301437",
            "extra": "mean: 10.717821034069368 usec\nrounds: 22440"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 506501.52060869004,
            "unit": "iter/sec",
            "range": "stddev: 2.97523123833089e-7",
            "extra": "mean: 1.9743277350840847 usec\nrounds: 35965"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 226032.12538903902,
            "unit": "iter/sec",
            "range": "stddev: 5.073768408261668e-7",
            "extra": "mean: 4.424149878159279 usec\nrounds: 40166"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 556254.9497963646,
            "unit": "iter/sec",
            "range": "stddev: 4.7253852935733173e-7",
            "extra": "mean: 1.7977368118091943 usec\nrounds: 34424"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1976.1753656917094,
            "unit": "iter/sec",
            "range": "stddev: 0.00009609739701404948",
            "extra": "mean: 506.0279656152762 usec\nrounds: 1047"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1184.7629827151666,
            "unit": "iter/sec",
            "range": "stddev: 0.00011663820643936992",
            "extra": "mean: 844.0506789875068 usec\nrounds: 595"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 803.1118612265495,
            "unit": "iter/sec",
            "range": "stddev: 0.0002248913604467172",
            "extra": "mean: 1.2451565569866616 msec\nrounds: 544"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 666.9047443181031,
            "unit": "iter/sec",
            "range": "stddev: 0.0001494038806393022",
            "extra": "mean: 1.499464516514244 msec\nrounds: 424"
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
          "id": "3d78f392ee8ff4ada101b85cd10f04c5d3a5b79a",
          "message": "style(test): apply ruff format to test_pagination.py\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-26T16:49:25+02:00",
          "tree_id": "7788a7a72bd70afaf605df57bcca7af9187a0a7b",
          "url": "https://github.com/fruch/coodie/commit/3d78f392ee8ff4ada101b85cd10f04c5d3a5b79a"
        },
        "date": 1772117436205,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1098.8731539305859,
            "unit": "iter/sec",
            "range": "stddev: 0.00041081665476306846",
            "extra": "mean: 910.0231418185765 usec\nrounds: 550"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1624.0788799384459,
            "unit": "iter/sec",
            "range": "stddev: 0.0002473504310628976",
            "extra": "mean: 615.7336397588649 usec\nrounds: 830"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 723.9791223229067,
            "unit": "iter/sec",
            "range": "stddev: 0.0014777508981777955",
            "extra": "mean: 1.3812553002792023 msec\nrounds: 716"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1528.7807558601558,
            "unit": "iter/sec",
            "range": "stddev: 0.0002928994876895583",
            "extra": "mean: 654.1160308087201 usec\nrounds: 779"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 859.0995005156143,
            "unit": "iter/sec",
            "range": "stddev: 0.0003208921211893992",
            "extra": "mean: 1.1640095232273096 msec\nrounds: 818"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1623.9655138939313,
            "unit": "iter/sec",
            "range": "stddev: 0.00019446430548031695",
            "extra": "mean: 615.7766229913393 usec\nrounds: 809"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1067.7074257135287,
            "unit": "iter/sec",
            "range": "stddev: 0.00027518318506281037",
            "extra": "mean: 936.586162011301 usec\nrounds: 537"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 770.3297730402157,
            "unit": "iter/sec",
            "range": "stddev: 0.00043529426399710187",
            "extra": "mean: 1.2981453333334867 msec\nrounds: 378"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 272.0042535530356,
            "unit": "iter/sec",
            "range": "stddev: 0.000459580451288998",
            "extra": "mean: 3.676413096257038 msec\nrounds: 187"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 746.7813668180057,
            "unit": "iter/sec",
            "range": "stddev: 0.000334557819529271",
            "extra": "mean: 1.3390800098038667 msec\nrounds: 306"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 611.420509542179,
            "unit": "iter/sec",
            "range": "stddev: 0.00042809085900765765",
            "extra": "mean: 1.6355355837650627 msec\nrounds: 579"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1395.1159485063436,
            "unit": "iter/sec",
            "range": "stddev: 0.0002218030580784069",
            "extra": "mean: 716.7863008595325 usec\nrounds: 698"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 956.6751231218146,
            "unit": "iter/sec",
            "range": "stddev: 0.00032911878998198796",
            "extra": "mean: 1.04528692743343 msec\nrounds: 565"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 910.9937181498786,
            "unit": "iter/sec",
            "range": "stddev: 0.00020868296127426732",
            "extra": "mean: 1.0977024101010078 msec\nrounds: 495"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1220.1080424661668,
            "unit": "iter/sec",
            "range": "stddev: 0.00009654361391989123",
            "extra": "mean: 819.5995479045698 usec\nrounds: 334"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1851.9812848543395,
            "unit": "iter/sec",
            "range": "stddev: 0.0000856216861347063",
            "extra": "mean: 539.9622599742692 usec\nrounds: 777"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 704.4369263683532,
            "unit": "iter/sec",
            "range": "stddev: 0.0001563830066719847",
            "extra": "mean: 1.419573509803624 msec\nrounds: 612"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 989.2838533692626,
            "unit": "iter/sec",
            "range": "stddev: 0.00019771866392810818",
            "extra": "mean: 1.0108322263567133 msec\nrounds: 645"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26285.856464067132,
            "unit": "iter/sec",
            "range": "stddev: 0.00002583888588592285",
            "extra": "mean: 38.04327248636558 usec\nrounds: 10940"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46495.06460995196,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020595492801694222",
            "extra": "mean: 21.507659111542704 usec\nrounds: 16501"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 487.5764448112621,
            "unit": "iter/sec",
            "range": "stddev: 0.0003079238373545283",
            "extra": "mean: 2.0509604404435366 msec\nrounds: 361"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1376.0022888938647,
            "unit": "iter/sec",
            "range": "stddev: 0.0002493684970191838",
            "extra": "mean: 726.7429771529494 usec\nrounds: 569"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.29552176825681,
            "unit": "iter/sec",
            "range": "stddev: 0.0007018208279415911",
            "extra": "mean: 54.658184263158056 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 456.2104057321258,
            "unit": "iter/sec",
            "range": "stddev: 0.00019144810278794264",
            "extra": "mean: 2.1919710454547863 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1342.0896581993813,
            "unit": "iter/sec",
            "range": "stddev: 0.0002838044146027968",
            "extra": "mean: 745.1067027382157 usec\nrounds: 767"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 1766.3551672266212,
            "unit": "iter/sec",
            "range": "stddev: 0.000182528534903697",
            "extra": "mean: 566.1375574710231 usec\nrounds: 348"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1222.6418077755768,
            "unit": "iter/sec",
            "range": "stddev: 0.00023458981075498694",
            "extra": "mean: 817.9010349886187 usec\nrounds: 886"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 1675.9050374812339,
            "unit": "iter/sec",
            "range": "stddev: 0.00018695150051676872",
            "extra": "mean: 596.6925199430924 usec\nrounds: 702"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 646.8373368129012,
            "unit": "iter/sec",
            "range": "stddev: 0.0003258635285659874",
            "extra": "mean: 1.545983732057279 msec\nrounds: 418"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 865.6987571992746,
            "unit": "iter/sec",
            "range": "stddev: 0.000384809982659867",
            "extra": "mean: 1.155136231493758 msec\nrounds: 743"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 746.9244417504593,
            "unit": "iter/sec",
            "range": "stddev: 0.00033384671430719017",
            "extra": "mean: 1.3388235062390565 msec\nrounds: 561"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 909.880870635299,
            "unit": "iter/sec",
            "range": "stddev: 0.0002107350166992855",
            "extra": "mean: 1.0990449764063925 msec\nrounds: 551"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 718.0108393579087,
            "unit": "iter/sec",
            "range": "stddev: 0.0002998105469817606",
            "extra": "mean: 1.392736634580982 msec\nrounds: 561"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 911.5930178390093,
            "unit": "iter/sec",
            "range": "stddev: 0.0002266525733496461",
            "extra": "mean: 1.0969807583328854 msec\nrounds: 600"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1378.034644496266,
            "unit": "iter/sec",
            "range": "stddev: 0.00016694073291394673",
            "extra": "mean: 725.6711607316267 usec\nrounds: 1039"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 1814.9411092432047,
            "unit": "iter/sec",
            "range": "stddev: 0.0001564571755598774",
            "extra": "mean: 550.9820648764636 usec\nrounds: 894"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 643.5320386574383,
            "unit": "iter/sec",
            "range": "stddev: 0.00023165643872208815",
            "extra": "mean: 1.5539241870323026 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 781.2217765224111,
            "unit": "iter/sec",
            "range": "stddev: 0.00034066246426124147",
            "extra": "mean: 1.2800462430162591 msec\nrounds: 358"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1317.9190871323842,
            "unit": "iter/sec",
            "range": "stddev: 0.00023662609274949912",
            "extra": "mean: 758.7719229227239 usec\nrounds: 999"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 1769.83220188031,
            "unit": "iter/sec",
            "range": "stddev: 0.00017581500632280915",
            "extra": "mean: 565.025316489087 usec\nrounds: 752"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1290.0614679711457,
            "unit": "iter/sec",
            "range": "stddev: 0.00019266769992840358",
            "extra": "mean: 775.1568625428991 usec\nrounds: 873"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 1708.7703666560358,
            "unit": "iter/sec",
            "range": "stddev: 0.00017297193000427257",
            "extra": "mean: 585.2161410997206 usec\nrounds: 1382"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 177.32225152626378,
            "unit": "iter/sec",
            "range": "stddev: 0.0008712629035035176",
            "extra": "mean: 5.639450161458652 msec\nrounds: 192"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 506.5825372246828,
            "unit": "iter/sec",
            "range": "stddev: 0.001540046685665428",
            "extra": "mean: 1.9740119852502407 msec\nrounds: 339"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 726.465040771714,
            "unit": "iter/sec",
            "range": "stddev: 0.00031723233867542454",
            "extra": "mean: 1.376528730051089 msec\nrounds: 589"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1346.491055450364,
            "unit": "iter/sec",
            "range": "stddev: 0.00025154605589686586",
            "extra": "mean: 742.6711049822218 usec\nrounds: 562"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 805.3982666684299,
            "unit": "iter/sec",
            "range": "stddev: 0.00028419373426062357",
            "extra": "mean: 1.2416217434096921 msec\nrounds: 569"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 951.0143026025819,
            "unit": "iter/sec",
            "range": "stddev: 0.00031245460892572943",
            "extra": "mean: 1.0515088966205473 msec\nrounds: 503"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5394.480898158149,
            "unit": "iter/sec",
            "range": "stddev: 0.00008519551651992063",
            "extra": "mean: 185.37464843770834 usec\nrounds: 128"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 210771.14508880593,
            "unit": "iter/sec",
            "range": "stddev: 0.0000030191055680344915",
            "extra": "mean: 4.744482455502445 usec\nrounds: 114"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4317.511750998424,
            "unit": "iter/sec",
            "range": "stddev: 0.00009361498569121217",
            "extra": "mean: 231.61488785033418 usec\nrounds: 2033"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 199718.21506084094,
            "unit": "iter/sec",
            "range": "stddev: 0.000010776635842006859",
            "extra": "mean: 5.007054562826761 usec\nrounds: 23111"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 76412.52742004652,
            "unit": "iter/sec",
            "range": "stddev: 0.000021984421083329312",
            "extra": "mean: 13.086859364079274 usec\nrounds: 14342"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 493880.6533029023,
            "unit": "iter/sec",
            "range": "stddev: 5.145040198894794e-7",
            "extra": "mean: 2.024780669808277 usec\nrounds: 32157"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 221120.262082151,
            "unit": "iter/sec",
            "range": "stddev: 7.547130929269779e-7",
            "extra": "mean: 4.522425898846295 usec\nrounds: 45809"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 501529.2527191666,
            "unit": "iter/sec",
            "range": "stddev: 5.093638173176119e-7",
            "extra": "mean: 1.9939016409875385 usec\nrounds: 30836"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1459.6981077282044,
            "unit": "iter/sec",
            "range": "stddev: 0.0002977958306963706",
            "extra": "mean: 685.0731632147871 usec\nrounds: 1207"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 895.6821919516517,
            "unit": "iter/sec",
            "range": "stddev: 0.00023895905065919975",
            "extra": "mean: 1.1164674356437123 msec\nrounds: 505"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 605.56521286082,
            "unit": "iter/sec",
            "range": "stddev: 0.0006804344947589192",
            "extra": "mean: 1.6513498113205438 msec\nrounds: 530"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 511.64468118816666,
            "unit": "iter/sec",
            "range": "stddev: 0.0005005885579945088",
            "extra": "mean: 1.9544813749998347 msec\nrounds: 376"
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
          "id": "4ae94a9aa2170fedf9a6a8009013c5d868547277",
          "message": "docs(plans): add cqlengine test coverage gap analysis plan\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-27T01:32:35+02:00",
          "tree_id": "5f69c8cbf9875786e9b2c7710da5ec113ca9d2b1",
          "url": "https://github.com/fruch/coodie/commit/4ae94a9aa2170fedf9a6a8009013c5d868547277"
        },
        "date": 1772148824768,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1326.115077447463,
            "unit": "iter/sec",
            "range": "stddev: 0.00027771880463040884",
            "extra": "mean: 754.0823696272447 usec\nrounds: 349"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1975.9179099055016,
            "unit": "iter/sec",
            "range": "stddev: 0.00009031507085791939",
            "extra": "mean: 506.09389944131084 usec\nrounds: 895"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 882.3437023484419,
            "unit": "iter/sec",
            "range": "stddev: 0.0008784533887391879",
            "extra": "mean: 1.1333452002189224 msec\nrounds: 914"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1864.5605324290525,
            "unit": "iter/sec",
            "range": "stddev: 0.00008030842846754304",
            "extra": "mean: 536.3194074998745 usec\nrounds: 800"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1036.6818167071415,
            "unit": "iter/sec",
            "range": "stddev: 0.00011264178584075768",
            "extra": "mean: 964.6161279999533 usec\nrounds: 1000"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1920.4309125194911,
            "unit": "iter/sec",
            "range": "stddev: 0.00006701614801685878",
            "extra": "mean: 520.7164670600201 usec\nrounds: 1017"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1284.290956866272,
            "unit": "iter/sec",
            "range": "stddev: 0.00007849822932465405",
            "extra": "mean: 778.6397581121689 usec\nrounds: 678"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1001.8097813481551,
            "unit": "iter/sec",
            "range": "stddev: 0.00011450896325838618",
            "extra": "mean: 998.1934880434892 usec\nrounds: 920"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 323.4289011912572,
            "unit": "iter/sec",
            "range": "stddev: 0.00018853136661306304",
            "extra": "mean: 3.091869639097768 msec\nrounds: 266"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 876.6169778294005,
            "unit": "iter/sec",
            "range": "stddev: 0.0001069316317509544",
            "extra": "mean: 1.140749067484535 msec\nrounds: 489"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 715.8162683401637,
            "unit": "iter/sec",
            "range": "stddev: 0.0001418975753184515",
            "extra": "mean: 1.3970065283914295 msec\nrounds: 634"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1641.9694265288483,
            "unit": "iter/sec",
            "range": "stddev: 0.00009437424020981717",
            "extra": "mean: 609.0247381243981 usec\nrounds: 821"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1157.7470958109743,
            "unit": "iter/sec",
            "range": "stddev: 0.00008176699834424429",
            "extra": "mean: 863.7464983658834 usec\nrounds: 612"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1027.3756544829396,
            "unit": "iter/sec",
            "range": "stddev: 0.00009283857099309652",
            "extra": "mean: 973.3538026100907 usec\nrounds: 613"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1268.6875352098757,
            "unit": "iter/sec",
            "range": "stddev: 0.00007692702198056121",
            "extra": "mean: 788.2161464087945 usec\nrounds: 724"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1891.7337959280228,
            "unit": "iter/sec",
            "range": "stddev: 0.00007636284120866155",
            "extra": "mean: 528.6156023392459 usec\nrounds: 855"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 714.7571611436068,
            "unit": "iter/sec",
            "range": "stddev: 0.00012275218306404153",
            "extra": "mean: 1.3990765736435666 msec\nrounds: 645"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1024.5588206094785,
            "unit": "iter/sec",
            "range": "stddev: 0.00009276076818732485",
            "extra": "mean: 976.0298578124881 usec\nrounds: 640"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27202.101218179894,
            "unit": "iter/sec",
            "range": "stddev: 0.00002552631716945374",
            "extra": "mean: 36.76186600363332 usec\nrounds: 11463"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46470.45384386292,
            "unit": "iter/sec",
            "range": "stddev: 0.0000017006899482752362",
            "extra": "mean: 21.5190495741643 usec\nrounds: 17025"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 572.8444365961691,
            "unit": "iter/sec",
            "range": "stddev: 0.00014331258350719643",
            "extra": "mean: 1.7456746301700707 msec\nrounds: 411"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1624.7260334059229,
            "unit": "iter/sec",
            "range": "stddev: 0.00016665853410339316",
            "extra": "mean: 615.4883835422359 usec\nrounds: 717"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.571885719094002,
            "unit": "iter/sec",
            "range": "stddev: 0.0011429997805344747",
            "extra": "mean: 53.844828421051865 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 511.5293261208032,
            "unit": "iter/sec",
            "range": "stddev: 0.00014583479864310912",
            "extra": "mean: 1.9549221304348816 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1571.1511305185088,
            "unit": "iter/sec",
            "range": "stddev: 0.00005892627422112149",
            "extra": "mean: 636.4760083073495 usec\nrounds: 963"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2147.6918095301276,
            "unit": "iter/sec",
            "range": "stddev: 0.000054365417321875996",
            "extra": "mean: 465.61615384601214 usec\nrounds: 949"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1490.5035698263036,
            "unit": "iter/sec",
            "range": "stddev: 0.00006510035861808645",
            "extra": "mean: 670.9141931921272 usec\nrounds: 1087"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2034.4067768480452,
            "unit": "iter/sec",
            "range": "stddev: 0.0000671982799975676",
            "extra": "mean: 491.54378140114335 usec\nrounds: 828"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 716.9243141133716,
            "unit": "iter/sec",
            "range": "stddev: 0.00010426040215343622",
            "extra": "mean: 1.394847378327113 msec\nrounds: 526"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 996.124472287674,
            "unit": "iter/sec",
            "range": "stddev: 0.00009687161295654326",
            "extra": "mean: 1.0038906058631665 msec\nrounds: 921"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 907.1997617366136,
            "unit": "iter/sec",
            "range": "stddev: 0.00009440501294375155",
            "extra": "mean: 1.102293058461284 msec\nrounds: 650"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1042.4748805346783,
            "unit": "iter/sec",
            "range": "stddev: 0.00023450540308457812",
            "extra": "mean: 959.2557275692885 usec\nrounds: 613"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 847.1245778204442,
            "unit": "iter/sec",
            "range": "stddev: 0.00009907005850312506",
            "extra": "mean: 1.1804639201625893 msec\nrounds: 739"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1094.7249621504698,
            "unit": "iter/sec",
            "range": "stddev: 0.00009033292034340824",
            "extra": "mean: 913.47145134574 usec\nrounds: 966"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1593.4999332770283,
            "unit": "iter/sec",
            "range": "stddev: 0.0000612265031550905",
            "extra": "mean: 627.5494457935135 usec\nrounds: 1153"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2138.811450321198,
            "unit": "iter/sec",
            "range": "stddev: 0.00006353990668483052",
            "extra": "mean: 467.5493951791889 usec\nrounds: 1784"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 712.7585206643353,
            "unit": "iter/sec",
            "range": "stddev: 0.0005333243723054742",
            "extra": "mean: 1.402999713097695 msec\nrounds: 481"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 847.7406940802978,
            "unit": "iter/sec",
            "range": "stddev: 0.0002789990397942672",
            "extra": "mean: 1.1796059891697028 msec\nrounds: 554"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1607.332991283685,
            "unit": "iter/sec",
            "range": "stddev: 0.00006180181677931584",
            "extra": "mean: 622.1486185021046 usec\nrounds: 1135"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2035.160859306319,
            "unit": "iter/sec",
            "range": "stddev: 0.0000654686109226033",
            "extra": "mean: 491.36165105929183 usec\nrounds: 897"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1469.40418889265,
            "unit": "iter/sec",
            "range": "stddev: 0.00006270742277471012",
            "extra": "mean: 680.5479442341898 usec\nrounds: 1058"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2030.8690956175074,
            "unit": "iter/sec",
            "range": "stddev: 0.00007399569495484325",
            "extra": "mean: 492.4000282233549 usec\nrounds: 1559"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 205.19564488260224,
            "unit": "iter/sec",
            "range": "stddev: 0.0019458702267572752",
            "extra": "mean: 4.873397778847236 msec\nrounds: 208"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 661.6246391788384,
            "unit": "iter/sec",
            "range": "stddev: 0.00015266305097284477",
            "extra": "mean: 1.51143101508603 msec\nrounds: 464"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 841.1305705879925,
            "unit": "iter/sec",
            "range": "stddev: 0.00014241725228621163",
            "extra": "mean: 1.1888760615381628 msec\nrounds: 650"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1589.627597384526,
            "unit": "iter/sec",
            "range": "stddev: 0.00007220337022156863",
            "extra": "mean: 629.078157453568 usec\nrounds: 597"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 942.0143423561323,
            "unit": "iter/sec",
            "range": "stddev: 0.00007334184816140496",
            "extra": "mean: 1.0615549626334098 msec\nrounds: 562"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1080.6194160538373,
            "unit": "iter/sec",
            "range": "stddev: 0.00006243945591907748",
            "extra": "mean: 925.3951808970451 usec\nrounds: 691"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5648.71747516977,
            "unit": "iter/sec",
            "range": "stddev: 0.00006630947349526586",
            "extra": "mean: 177.0313357670531 usec\nrounds: 137"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 218568.6184091425,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025618158805899946",
            "extra": "mean: 4.575222222103642 usec\nrounds: 126"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4608.444121291546,
            "unit": "iter/sec",
            "range": "stddev: 0.00006387108790835845",
            "extra": "mean: 216.992974999932 usec\nrounds: 2200"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 210785.3520515083,
            "unit": "iter/sec",
            "range": "stddev: 0.000004717526924538496",
            "extra": "mean: 4.744162676710269 usec\nrounds: 33250"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 82900.09862836034,
            "unit": "iter/sec",
            "range": "stddev: 0.00001721489635768118",
            "extra": "mean: 12.062711824783008 usec\nrounds: 23569"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 509715.1802816614,
            "unit": "iter/sec",
            "range": "stddev: 5.163335022755202e-7",
            "extra": "mean: 1.9618799649000334 usec\nrounds: 36456"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 215384.95792219724,
            "unit": "iter/sec",
            "range": "stddev: 0.0000032573275440728894",
            "extra": "mean: 4.642849759086828 usec\nrounds: 45041"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 511952.2981910331,
            "unit": "iter/sec",
            "range": "stddev: 5.798854309207524e-7",
            "extra": "mean: 1.9533069849153286 usec\nrounds: 18268"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1682.6337879100086,
            "unit": "iter/sec",
            "range": "stddev: 0.00007198357207741532",
            "extra": "mean: 594.306382758482 usec\nrounds: 1160"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1047.9249574879573,
            "unit": "iter/sec",
            "range": "stddev: 0.00009693845282780482",
            "extra": "mean: 954.2668039867654 usec\nrounds: 602"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 762.6869528612693,
            "unit": "iter/sec",
            "range": "stddev: 0.00023320652947206728",
            "extra": "mean: 1.3111539357641238 msec\nrounds: 576"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 612.8482309409292,
            "unit": "iter/sec",
            "range": "stddev: 0.0003581032366081967",
            "extra": "mean: 1.631725359579911 msec\nrounds: 381"
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
          "id": "0ab6bc4df5a39543a0887dc776f9b45668bd3e0f",
          "message": "feat(drivers): add client encryption (SSL/TLS) plan, docs, and integration tests\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-27T01:34:16+02:00",
          "tree_id": "7da89616909137e1aa13696c129ef8d14d346aa2",
          "url": "https://github.com/fruch/coodie/commit/0ab6bc4df5a39543a0887dc776f9b45668bd3e0f"
        },
        "date": 1772148924567,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1359.9564632195195,
            "unit": "iter/sec",
            "range": "stddev: 0.00024022273864697627",
            "extra": "mean: 735.3176568848612 usec\nrounds: 443"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2041.4706782896353,
            "unit": "iter/sec",
            "range": "stddev: 0.00007107608040922105",
            "extra": "mean: 489.8429405010167 usec\nrounds: 958"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 1003.1530300542947,
            "unit": "iter/sec",
            "range": "stddev: 0.000841831915296395",
            "extra": "mean: 996.8568802965945 usec\nrounds: 944"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1909.625293769646,
            "unit": "iter/sec",
            "range": "stddev: 0.00011059556922491064",
            "extra": "mean: 523.6629422864295 usec\nrounds: 901"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1056.9396991343128,
            "unit": "iter/sec",
            "range": "stddev: 0.00011024903606628197",
            "extra": "mean: 946.127769464096 usec\nrounds: 989"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1901.577099294488,
            "unit": "iter/sec",
            "range": "stddev: 0.00009693245338490498",
            "extra": "mean: 525.8792821868827 usec\nrounds: 567"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1302.7289336516646,
            "unit": "iter/sec",
            "range": "stddev: 0.00011921301883909178",
            "extra": "mean: 767.6193981482481 usec\nrounds: 540"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 999.0586549212534,
            "unit": "iter/sec",
            "range": "stddev: 0.00013262996031068792",
            "extra": "mean: 1.0009422320442445 msec\nrounds: 905"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 326.83037775258026,
            "unit": "iter/sec",
            "range": "stddev: 0.00021152101162355522",
            "extra": "mean: 3.0596911060606122 msec\nrounds: 264"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 869.2800899378561,
            "unit": "iter/sec",
            "range": "stddev: 0.00012075404456802729",
            "extra": "mean: 1.1503772047413268 msec\nrounds: 464"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 739.1861011128015,
            "unit": "iter/sec",
            "range": "stddev: 0.00013938628616071518",
            "extra": "mean: 1.3528392897195423 msec\nrounds: 642"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1682.9062278058068,
            "unit": "iter/sec",
            "range": "stddev: 0.00009698280773726426",
            "extra": "mean: 594.2101725440829 usec\nrounds: 794"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1158.4581212310525,
            "unit": "iter/sec",
            "range": "stddev: 0.00008794039885117655",
            "extra": "mean: 863.2163577370715 usec\nrounds: 601"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1059.385922567639,
            "unit": "iter/sec",
            "range": "stddev: 0.00010312190797627453",
            "extra": "mean: 943.9430699402678 usec\nrounds: 672"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1329.673210981112,
            "unit": "iter/sec",
            "range": "stddev: 0.00007899967215652931",
            "extra": "mean: 752.0644860267136 usec\nrounds: 823"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1987.9422217179351,
            "unit": "iter/sec",
            "range": "stddev: 0.000067289293021817",
            "extra": "mean: 503.0327285547678 usec\nrounds: 851"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 739.2548208046782,
            "unit": "iter/sec",
            "range": "stddev: 0.00011559785530047709",
            "extra": "mean: 1.3527135324075412 msec\nrounds: 648"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1052.886464682198,
            "unit": "iter/sec",
            "range": "stddev: 0.00009342216484483144",
            "extra": "mean: 949.7700213116889 usec\nrounds: 610"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27383.28229880788,
            "unit": "iter/sec",
            "range": "stddev: 0.000025136437917824766",
            "extra": "mean: 36.51863166321498 usec\nrounds: 11875"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 47072.91146253419,
            "unit": "iter/sec",
            "range": "stddev: 0.000001907230460676309",
            "extra": "mean: 21.243640321587293 usec\nrounds: 16170"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 588.3648066819484,
            "unit": "iter/sec",
            "range": "stddev: 0.0000915175477377489",
            "extra": "mean: 1.6996257910792558 msec\nrounds: 426"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1671.8073573580305,
            "unit": "iter/sec",
            "range": "stddev: 0.00014296985799741168",
            "extra": "mean: 598.155041966263 usec\nrounds: 834"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.82051206790726,
            "unit": "iter/sec",
            "range": "stddev: 0.0005767465762835831",
            "extra": "mean: 53.13351711110985 msec\nrounds: 18"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 506.62973366631513,
            "unit": "iter/sec",
            "range": "stddev: 0.00012644355085111796",
            "extra": "mean: 1.9738280909083723 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1544.4089679624915,
            "unit": "iter/sec",
            "range": "stddev: 0.00006391181783717154",
            "extra": "mean: 647.496887640636 usec\nrounds: 979"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2116.8584012096258,
            "unit": "iter/sec",
            "range": "stddev: 0.0000581920031894997",
            "extra": "mean: 472.39815352249116 usec\nrounds: 951"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1477.4226029498702,
            "unit": "iter/sec",
            "range": "stddev: 0.00007111226418212297",
            "extra": "mean: 676.8544071299352 usec\nrounds: 1066"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2055.901524327245,
            "unit": "iter/sec",
            "range": "stddev: 0.000059775961029379654",
            "extra": "mean: 486.40462014698437 usec\nrounds: 953"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 725.1315410381006,
            "unit": "iter/sec",
            "range": "stddev: 0.00012103007726596779",
            "extra": "mean: 1.3790601337908936 msec\nrounds: 583"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1030.793951713288,
            "unit": "iter/sec",
            "range": "stddev: 0.00010817129731068081",
            "extra": "mean: 970.125987194526 usec\nrounds: 859"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 895.0407335659726,
            "unit": "iter/sec",
            "range": "stddev: 0.00011748380072802409",
            "extra": "mean: 1.1172675862648782 msec\nrounds: 597"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1050.9948117662602,
            "unit": "iter/sec",
            "range": "stddev: 0.00025876393594152796",
            "extra": "mean: 951.4794828715088 usec\nrounds: 613"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 844.7638232833964,
            "unit": "iter/sec",
            "range": "stddev: 0.0001299434950424175",
            "extra": "mean: 1.1837628132715692 msec\nrounds: 648"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1099.2385710228014,
            "unit": "iter/sec",
            "range": "stddev: 0.00011193743447089943",
            "extra": "mean: 909.7206251319371 usec\nrounds: 947"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1613.8215485344235,
            "unit": "iter/sec",
            "range": "stddev: 0.00008403674511627718",
            "extra": "mean: 619.6471976149656 usec\nrounds: 1174"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2173.3003877120345,
            "unit": "iter/sec",
            "range": "stddev: 0.0000662239906287076",
            "extra": "mean: 460.1296745052168 usec\nrounds: 1616"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 700.8183886928975,
            "unit": "iter/sec",
            "range": "stddev: 0.0005086712817578647",
            "extra": "mean: 1.426903197938497 msec\nrounds: 485"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 860.6585714526616,
            "unit": "iter/sec",
            "range": "stddev: 0.00014036460998185441",
            "extra": "mean: 1.1619009362936468 msec\nrounds: 518"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1643.3367570489913,
            "unit": "iter/sec",
            "range": "stddev: 0.00007077515271664006",
            "extra": "mean: 608.5180019923256 usec\nrounds: 1004"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2171.7555505610208,
            "unit": "iter/sec",
            "range": "stddev: 0.0000624450106214307",
            "extra": "mean: 460.4569790286361 usec\nrounds: 906"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1514.4680995557674,
            "unit": "iter/sec",
            "range": "stddev: 0.00007400853634120094",
            "extra": "mean: 660.297830171085 usec\nrounds: 1054"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2089.632361241905,
            "unit": "iter/sec",
            "range": "stddev: 0.00006236817562676169",
            "extra": "mean: 478.5530787844818 usec\nrounds: 1777"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 212.2101866647015,
            "unit": "iter/sec",
            "range": "stddev: 0.001961963948252094",
            "extra": "mean: 4.712309129533118 msec\nrounds: 193"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 667.9957301491501,
            "unit": "iter/sec",
            "range": "stddev: 0.00012892029248105221",
            "extra": "mean: 1.4970155569358508 msec\nrounds: 483"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 866.6566687711295,
            "unit": "iter/sec",
            "range": "stddev: 0.00011073703921952777",
            "extra": "mean: 1.1538594648073774 msec\nrounds: 753"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1608.9835107708884,
            "unit": "iter/sec",
            "range": "stddev: 0.00007059130055361497",
            "extra": "mean: 621.5104090910695 usec\nrounds: 814"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 972.579474561441,
            "unit": "iter/sec",
            "range": "stddev: 0.00005547206990262056",
            "extra": "mean: 1.0281936090116683 msec\nrounds: 688"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1080.768425968184,
            "unit": "iter/sec",
            "range": "stddev: 0.00005852826497583965",
            "extra": "mean: 925.2675929204453 usec\nrounds: 678"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5753.186459837282,
            "unit": "iter/sec",
            "range": "stddev: 0.00005642346338823852",
            "extra": "mean: 173.81672000046441 usec\nrounds: 150"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 215033.75727064328,
            "unit": "iter/sec",
            "range": "stddev: 0.000003508023347414188",
            "extra": "mean: 4.650432623661929 usec\nrounds: 141"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4602.64562193803,
            "unit": "iter/sec",
            "range": "stddev: 0.00005673665093453082",
            "extra": "mean: 217.26634682314108 usec\nrounds: 2644"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 208502.54715432142,
            "unit": "iter/sec",
            "range": "stddev: 0.000006113393863077847",
            "extra": "mean: 4.7961044776103305 usec\nrounds: 32964"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81752.94555292065,
            "unit": "iter/sec",
            "range": "stddev: 0.000018147128205480053",
            "extra": "mean: 12.231975169049733 usec\nrounds: 21586"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 499144.0752299904,
            "unit": "iter/sec",
            "range": "stddev: 5.160709985397866e-7",
            "extra": "mean: 2.003429569987844 usec\nrounds: 31329"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 220512.4661809444,
            "unit": "iter/sec",
            "range": "stddev: 8.223697361946645e-7",
            "extra": "mean: 4.534891007837339 usec\nrounds: 44205"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 515155.8781408573,
            "unit": "iter/sec",
            "range": "stddev: 4.893872598766209e-7",
            "extra": "mean: 1.941160030258984 usec\nrounds: 35712"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1861.2330404858792,
            "unit": "iter/sec",
            "range": "stddev: 0.00006634466229009341",
            "extra": "mean: 537.2782334333307 usec\nrounds: 1328"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1020.2738348512808,
            "unit": "iter/sec",
            "range": "stddev: 0.00010300624340541392",
            "extra": "mean: 980.1290259940499 usec\nrounds: 654"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 740.7857142994947,
            "unit": "iter/sec",
            "range": "stddev: 0.00027917888070219644",
            "extra": "mean: 1.349918040665275 msec\nrounds: 541"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 637.4968542050719,
            "unit": "iter/sec",
            "range": "stddev: 0.00017135211802215089",
            "extra": "mean: 1.5686351915366739 msec\nrounds: 449"
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
          "id": "49a73fe8c5adc4a03b6a47bf9c69c487e28ec35b",
          "message": "test(sync): add DML chaining tests and fix ttl/timestamp chain support in update/create\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-27T01:35:57+02:00",
          "tree_id": "5cecfbf8aa1fa637d3bd0d2569fa81486ab43d43",
          "url": "https://github.com/fruch/coodie/commit/49a73fe8c5adc4a03b6a47bf9c69c487e28ec35b"
        },
        "date": 1772149024259,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1305.350255340111,
            "unit": "iter/sec",
            "range": "stddev: 0.00025953711066292024",
            "extra": "mean: 766.0779135018045 usec\nrounds: 474"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2000.4370901205073,
            "unit": "iter/sec",
            "range": "stddev: 0.0000776432578259919",
            "extra": "mean: 499.8907513456269 usec\nrounds: 929"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 945.049979752288,
            "unit": "iter/sec",
            "range": "stddev: 0.0007042740269451646",
            "extra": "mean: 1.058145094360105 msec\nrounds: 922"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1994.5680360126769,
            "unit": "iter/sec",
            "range": "stddev: 0.00006806330851650274",
            "extra": "mean: 501.36168932050623 usec\nrounds: 927"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1030.4304710186132,
            "unit": "iter/sec",
            "range": "stddev: 0.00008600496037793833",
            "extra": "mean: 970.4681956963756 usec\nrounds: 976"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1870.1050294893428,
            "unit": "iter/sec",
            "range": "stddev: 0.00008757459294078902",
            "extra": "mean: 534.7293249476279 usec\nrounds: 954"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1338.7838660084713,
            "unit": "iter/sec",
            "range": "stddev: 0.00008826626568060706",
            "extra": "mean: 746.9465575361755 usec\nrounds: 617"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 993.7880510732317,
            "unit": "iter/sec",
            "range": "stddev: 0.00011187652135079142",
            "extra": "mean: 1.00625077844321 msec\nrounds: 835"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 325.2783905022004,
            "unit": "iter/sec",
            "range": "stddev: 0.00019772292782814738",
            "extra": "mean: 3.0742896829269553 msec\nrounds: 246"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 882.4529387937159,
            "unit": "iter/sec",
            "range": "stddev: 0.00010614129179075048",
            "extra": "mean: 1.1332049065040986 msec\nrounds: 492"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 720.2176167746859,
            "unit": "iter/sec",
            "range": "stddev: 0.00013535069394573663",
            "extra": "mean: 1.3884692302838266 msec\nrounds: 634"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1657.4177220731808,
            "unit": "iter/sec",
            "range": "stddev: 0.00007747155771796532",
            "extra": "mean: 603.3482004459022 usec\nrounds: 898"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1136.786651071947,
            "unit": "iter/sec",
            "range": "stddev: 0.00007348428936085506",
            "extra": "mean: 879.6725393080906 usec\nrounds: 636"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1022.5999706513539,
            "unit": "iter/sec",
            "range": "stddev: 0.0000826875549284405",
            "extra": "mean: 977.8995000000257 usec\nrounds: 490"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1282.5258082493435,
            "unit": "iter/sec",
            "range": "stddev: 0.0000651135950777502",
            "extra": "mean: 779.7114050788629 usec\nrounds: 827"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1954.5652648246019,
            "unit": "iter/sec",
            "range": "stddev: 0.0000572031981873462",
            "extra": "mean: 511.62272142891976 usec\nrounds: 840"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 708.3990618224465,
            "unit": "iter/sec",
            "range": "stddev: 0.000103866549247908",
            "extra": "mean: 1.4116337159275354 msec\nrounds: 609"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1017.0232281356812,
            "unit": "iter/sec",
            "range": "stddev: 0.00009413598116938285",
            "extra": "mean: 983.2617115669161 usec\nrounds: 683"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 24981.01138149092,
            "unit": "iter/sec",
            "range": "stddev: 0.00003647980691851668",
            "extra": "mean: 40.03040488348386 usec\nrounds: 11754"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46703.95673215597,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019507991007990152",
            "extra": "mean: 21.411462110907056 usec\nrounds: 13170"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 575.2425128659457,
            "unit": "iter/sec",
            "range": "stddev: 0.000156516152452308",
            "extra": "mean: 1.738397245742231 msec\nrounds: 411"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1660.5156221215082,
            "unit": "iter/sec",
            "range": "stddev: 0.0001499756952011346",
            "extra": "mean: 602.2225787447755 usec\nrounds: 781"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.826160737840183,
            "unit": "iter/sec",
            "range": "stddev: 0.000538630171090103",
            "extra": "mean: 53.117574736840595 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 511.23523076279525,
            "unit": "iter/sec",
            "range": "stddev: 0.00012654537302058343",
            "extra": "mean: 1.9560467272725646 msec\nrounds: 22"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1520.357633900526,
            "unit": "iter/sec",
            "range": "stddev: 0.00006447080302744776",
            "extra": "mean: 657.7399801877327 usec\nrounds: 959"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2102.0852208398046,
            "unit": "iter/sec",
            "range": "stddev: 0.00007409385236554156",
            "extra": "mean: 475.71810604352646 usec\nrounds: 877"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1457.8332641159932,
            "unit": "iter/sec",
            "range": "stddev: 0.00006884743274788512",
            "extra": "mean: 685.9495009577684 usec\nrounds: 1044"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2003.348494213818,
            "unit": "iter/sec",
            "range": "stddev: 0.00006392538783851081",
            "extra": "mean: 499.1642756556113 usec\nrounds: 838"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 728.8263803830002,
            "unit": "iter/sec",
            "range": "stddev: 0.0001010101087401813",
            "extra": "mean: 1.3720688862476373 msec\nrounds: 589"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1032.7302217180656,
            "unit": "iter/sec",
            "range": "stddev: 0.00008388121493375415",
            "extra": "mean: 968.3070941183313 usec\nrounds: 765"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 884.9518004770048,
            "unit": "iter/sec",
            "range": "stddev: 0.0000882724873699714",
            "extra": "mean: 1.1300050459934452 msec\nrounds: 674"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1050.549821226061,
            "unit": "iter/sec",
            "range": "stddev: 0.0002302229346455891",
            "extra": "mean: 951.8825093253873 usec\nrounds: 697"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 850.0200954369915,
            "unit": "iter/sec",
            "range": "stddev: 0.00009507905041728183",
            "extra": "mean: 1.1764427751392215 msec\nrounds: 716"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1105.844378334464,
            "unit": "iter/sec",
            "range": "stddev: 0.00008034278745852326",
            "extra": "mean: 904.2863712036241 usec\nrounds: 889"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1576.8008836705915,
            "unit": "iter/sec",
            "range": "stddev: 0.00006024998002163329",
            "extra": "mean: 634.1954842593235 usec\nrounds: 1080"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2133.0253267586804,
            "unit": "iter/sec",
            "range": "stddev: 0.00005320069573586608",
            "extra": "mean: 468.81768699839483 usec\nrounds: 1869"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 677.0723870087035,
            "unit": "iter/sec",
            "range": "stddev: 0.0004989669066629125",
            "extra": "mean: 1.4769469545464502 msec\nrounds: 440"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 864.4418431225405,
            "unit": "iter/sec",
            "range": "stddev: 0.00026429450768812173",
            "extra": "mean: 1.1568158204695365 msec\nrounds: 596"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1602.6953073879033,
            "unit": "iter/sec",
            "range": "stddev: 0.000060038949958709396",
            "extra": "mean: 623.9489161728532 usec\nrounds: 1181"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2175.466613023444,
            "unit": "iter/sec",
            "range": "stddev: 0.00005383526713093947",
            "extra": "mean: 459.6714994445301 usec\nrounds: 901"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1483.7091584533493,
            "unit": "iter/sec",
            "range": "stddev: 0.0000657117235393342",
            "extra": "mean: 673.986538603308 usec\nrounds: 1088"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2034.7506879899488,
            "unit": "iter/sec",
            "range": "stddev: 0.00006384191111877688",
            "extra": "mean: 491.4607012556714 usec\nrounds: 1513"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 206.89629532641197,
            "unit": "iter/sec",
            "range": "stddev: 0.0016816880852966146",
            "extra": "mean: 4.833339323076521 msec\nrounds: 195"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 643.2624804895755,
            "unit": "iter/sec",
            "range": "stddev: 0.00012307626425494506",
            "extra": "mean: 1.5545753566085776 msec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 829.285280333852,
            "unit": "iter/sec",
            "range": "stddev: 0.00013462809834872795",
            "extra": "mean: 1.2058576508164016 msec\nrounds: 736"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1594.3052319918315,
            "unit": "iter/sec",
            "range": "stddev: 0.00007571324825473191",
            "extra": "mean: 627.2324646082096 usec\nrounds: 777"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 948.1387623951832,
            "unit": "iter/sec",
            "range": "stddev: 0.000055282933645114986",
            "extra": "mean: 1.0546979404932302 msec\nrounds: 689"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1074.5506852106364,
            "unit": "iter/sec",
            "range": "stddev: 0.000048179179713540714",
            "extra": "mean: 930.6215274563593 usec\nrounds: 692"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5600.622758391778,
            "unit": "iter/sec",
            "range": "stddev: 0.00005994493682937417",
            "extra": "mean: 178.5515724124848 usec\nrounds: 145"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 211249.29585362642,
            "unit": "iter/sec",
            "range": "stddev: 0.0000023978540857858375",
            "extra": "mean: 4.7337435893414535 usec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4623.827640709156,
            "unit": "iter/sec",
            "range": "stddev: 0.00006097320734302163",
            "extra": "mean: 216.27103726700113 usec\nrounds: 2898"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 203921.91640804653,
            "unit": "iter/sec",
            "range": "stddev: 6.997144965416601e-7",
            "extra": "mean: 4.90383779053452 usec\nrounds: 32045"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 82569.28775215868,
            "unit": "iter/sec",
            "range": "stddev: 0.000018204454721724725",
            "extra": "mean: 12.111040645059413 usec\nrounds: 25489"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 498033.8252111582,
            "unit": "iter/sec",
            "range": "stddev: 5.805538301195748e-7",
            "extra": "mean: 2.0078957479966673 usec\nrounds: 41486"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 226428.51189607885,
            "unit": "iter/sec",
            "range": "stddev: 7.155303341807816e-7",
            "extra": "mean: 4.416404946648052 usec\nrounds: 49488"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 505703.1732848414,
            "unit": "iter/sec",
            "range": "stddev: 4.2584976922919915e-7",
            "extra": "mean: 1.9774445817778996 usec\nrounds: 37217"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1797.5340647725543,
            "unit": "iter/sec",
            "range": "stddev: 0.00007292502762713278",
            "extra": "mean: 556.3176907729602 usec\nrounds: 1203"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1011.3004774387931,
            "unit": "iter/sec",
            "range": "stddev: 0.00009333047021449607",
            "extra": "mean: 988.82579639692 usec\nrounds: 555"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 728.9197059482104,
            "unit": "iter/sec",
            "range": "stddev: 0.00023686534874835428",
            "extra": "mean: 1.3718932165500404 msec\nrounds: 568"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 612.9767132967971,
            "unit": "iter/sec",
            "range": "stddev: 0.0003233386346806364",
            "extra": "mean: 1.6313833434579597 msec\nrounds: 428"
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
          "id": "13cbdf6e9a881c192eeaa092453adbb6a621bc9b",
          "message": "docs(plans): address review feedback on python-rs-driver plan\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-27T01:37:30+02:00",
          "tree_id": "2dca39a526b13fd858bbb641414526efdad8fb93",
          "url": "https://github.com/fruch/coodie/commit/13cbdf6e9a881c192eeaa092453adbb6a621bc9b"
        },
        "date": 1772149119962,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1471.5433137025582,
            "unit": "iter/sec",
            "range": "stddev: 0.00008220062199578924",
            "extra": "mean: 679.5586583747199 usec\nrounds: 603"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1974.763894414846,
            "unit": "iter/sec",
            "range": "stddev: 0.00007091423051711213",
            "extra": "mean: 506.3896513544045 usec\nrounds: 849"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 897.9917275632434,
            "unit": "iter/sec",
            "range": "stddev: 0.0008995001826733127",
            "extra": "mean: 1.113596004624188 msec\nrounds: 865"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1815.8532898642961,
            "unit": "iter/sec",
            "range": "stddev: 0.00011202600556290702",
            "extra": "mean: 550.7052830654247 usec\nrounds: 809"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1025.0666038064844,
            "unit": "iter/sec",
            "range": "stddev: 0.00009639779014407405",
            "extra": "mean: 975.5463657547696 usec\nrounds: 987"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2016.262245843161,
            "unit": "iter/sec",
            "range": "stddev: 0.00006819006085095464",
            "extra": "mean: 495.9672294919254 usec\nrounds: 1024"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1315.7220542646821,
            "unit": "iter/sec",
            "range": "stddev: 0.00007165267047806476",
            "extra": "mean: 760.0389434521338 usec\nrounds: 672"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 979.4346358502515,
            "unit": "iter/sec",
            "range": "stddev: 0.00010148355400449132",
            "extra": "mean: 1.0209971787774235 msec\nrounds: 867"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 316.93442940835655,
            "unit": "iter/sec",
            "range": "stddev: 0.00019293598137103596",
            "extra": "mean: 3.155226782608533 msec\nrounds: 207"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 848.2171378915403,
            "unit": "iter/sec",
            "range": "stddev: 0.00012683006929183784",
            "extra": "mean: 1.178943404145022 msec\nrounds: 386"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 732.2542748567971,
            "unit": "iter/sec",
            "range": "stddev: 0.00012679818551256816",
            "extra": "mean: 1.3656458341544875 msec\nrounds: 609"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1665.0135456279138,
            "unit": "iter/sec",
            "range": "stddev: 0.00008472133377479568",
            "extra": "mean: 600.595714446802 usec\nrounds: 886"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1129.0885677762658,
            "unit": "iter/sec",
            "range": "stddev: 0.00007613364339694798",
            "extra": "mean: 885.6701135230649 usec\nrounds: 599"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1035.7812166174517,
            "unit": "iter/sec",
            "range": "stddev: 0.00009373656201556948",
            "extra": "mean: 965.4548508474575 usec\nrounds: 590"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1251.1518271877144,
            "unit": "iter/sec",
            "range": "stddev: 0.00007129609120452974",
            "extra": "mean: 799.2635092479202 usec\nrounds: 811"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1944.9534474153286,
            "unit": "iter/sec",
            "range": "stddev: 0.00006224521691123962",
            "extra": "mean: 514.1511234260706 usec\nrounds: 794"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 715.2080705538615,
            "unit": "iter/sec",
            "range": "stddev: 0.00012051618758749003",
            "extra": "mean: 1.3981945131374063 msec\nrounds: 647"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1042.4789413213887,
            "unit": "iter/sec",
            "range": "stddev: 0.00009479157058881481",
            "extra": "mean: 959.2519909634389 usec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27040.46829516658,
            "unit": "iter/sec",
            "range": "stddev: 0.000024962974303917827",
            "extra": "mean: 36.981608050728454 usec\nrounds: 11999"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46552.31867817189,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021119214726468782",
            "extra": "mean: 21.48120713198533 usec\nrounds: 17723"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 587.9748629347664,
            "unit": "iter/sec",
            "range": "stddev: 0.00009467259004818629",
            "extra": "mean: 1.7007529794874006 msec\nrounds: 390"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1621.1502757207656,
            "unit": "iter/sec",
            "range": "stddev: 0.00015859062263913",
            "extra": "mean: 616.8459611527368 usec\nrounds: 798"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.84956854890236,
            "unit": "iter/sec",
            "range": "stddev: 0.0002217484739068833",
            "extra": "mean: 53.051612157893736 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 508.16269469380705,
            "unit": "iter/sec",
            "range": "stddev: 0.00012444349903471713",
            "extra": "mean: 1.9678736956528247 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1506.0584138347745,
            "unit": "iter/sec",
            "range": "stddev: 0.0000645784762504163",
            "extra": "mean: 663.9848699186691 usec\nrounds: 984"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2189.1385292647815,
            "unit": "iter/sec",
            "range": "stddev: 0.00004746583219191885",
            "extra": "mean: 456.80069426024323 usec\nrounds: 906"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1480.7989080282982,
            "unit": "iter/sec",
            "range": "stddev: 0.00006708675629522464",
            "extra": "mean: 675.3111408837492 usec\nrounds: 1086"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 1930.1374388674574,
            "unit": "iter/sec",
            "range": "stddev: 0.00006434293282887857",
            "extra": "mean: 518.0978203224573 usec\nrounds: 807"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 732.3226734063181,
            "unit": "iter/sec",
            "range": "stddev: 0.0000988386030245082",
            "extra": "mean: 1.3655182835574518 msec\nrounds: 596"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1000.5581931670827,
            "unit": "iter/sec",
            "range": "stddev: 0.00010694773288053732",
            "extra": "mean: 999.4421182387046 usec\nrounds: 795"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 886.1994969146386,
            "unit": "iter/sec",
            "range": "stddev: 0.00009784879848411063",
            "extra": "mean: 1.1284140912757965 msec\nrounds: 745"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1058.800693127036,
            "unit": "iter/sec",
            "range": "stddev: 0.00008601980761678916",
            "extra": "mean: 944.4648142858922 usec\nrounds: 630"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 871.0030599561474,
            "unit": "iter/sec",
            "range": "stddev: 0.0000866261611619921",
            "extra": "mean: 1.1481015922611653 msec\nrounds: 672"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1090.4069121815887,
            "unit": "iter/sec",
            "range": "stddev: 0.00008983848012473319",
            "extra": "mean: 917.0888306268063 usec\nrounds: 862"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1587.1550442250407,
            "unit": "iter/sec",
            "range": "stddev: 0.00010944029727641266",
            "extra": "mean: 630.0581683173049 usec\nrounds: 1212"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2188.026493482672,
            "unit": "iter/sec",
            "range": "stddev: 0.00005165588495400367",
            "extra": "mean: 457.0328572248248 usec\nrounds: 1737"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 726.1150249459616,
            "unit": "iter/sec",
            "range": "stddev: 0.000248436209134193",
            "extra": "mean: 1.377192270707277 msec\nrounds: 495"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 808.3705207187211,
            "unit": "iter/sec",
            "range": "stddev: 0.00047017294697275735",
            "extra": "mean: 1.2370564912620778 msec\nrounds: 515"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1606.6299287480497,
            "unit": "iter/sec",
            "range": "stddev: 0.00006790396263051354",
            "extra": "mean: 622.4208712327674 usec\nrounds: 1095"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2046.1157645322849,
            "unit": "iter/sec",
            "range": "stddev: 0.00006347112565262278",
            "extra": "mean: 488.7309004378776 usec\nrounds: 914"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1479.5051959486293,
            "unit": "iter/sec",
            "range": "stddev: 0.00006929229028587836",
            "extra": "mean: 675.9016478876371 usec\nrounds: 1065"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2032.7529182528199,
            "unit": "iter/sec",
            "range": "stddev: 0.00006241708325981722",
            "extra": "mean: 491.9437040383217 usec\nrounds: 1659"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 205.59515249665492,
            "unit": "iter/sec",
            "range": "stddev: 0.001965137319574204",
            "extra": "mean: 4.863927908107026 msec\nrounds: 185"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 645.9874514093561,
            "unit": "iter/sec",
            "range": "stddev: 0.00014286570105102503",
            "extra": "mean: 1.5480176864400257 msec\nrounds: 472"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 835.1183518937875,
            "unit": "iter/sec",
            "range": "stddev: 0.00014002870057150098",
            "extra": "mean: 1.1974350674156693 msec\nrounds: 623"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1589.0109820080804,
            "unit": "iter/sec",
            "range": "stddev: 0.0000815121979644377",
            "extra": "mean: 629.3222710998953 usec\nrounds: 782"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 946.4859270048107,
            "unit": "iter/sec",
            "range": "stddev: 0.00006660924911834913",
            "extra": "mean: 1.0565397450382983 msec\nrounds: 655"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1019.1755156517563,
            "unit": "iter/sec",
            "range": "stddev: 0.0000892261589112374",
            "extra": "mean: 981.1852665637344 usec\nrounds: 649"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5567.84123788208,
            "unit": "iter/sec",
            "range": "stddev: 0.000059370256569221403",
            "extra": "mean: 179.60282222062503 usec\nrounds: 135"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 206643.2470947593,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027249019739465168",
            "extra": "mean: 4.839258064607527 usec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4508.50777787643,
            "unit": "iter/sec",
            "range": "stddev: 0.00006378542257759766",
            "extra": "mean: 221.80287786284225 usec\nrounds: 2620"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 203429.8027151379,
            "unit": "iter/sec",
            "range": "stddev: 0.000007679875384532591",
            "extra": "mean: 4.915700583951787 usec\nrounds: 21572"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81710.12435860715,
            "unit": "iter/sec",
            "range": "stddev: 0.00001817208359932565",
            "extra": "mean: 12.23838548588211 usec\nrounds: 21827"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 478621.5120741889,
            "unit": "iter/sec",
            "range": "stddev: 4.409117090100649e-7",
            "extra": "mean: 2.089333585668407 usec\nrounds: 36995"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 223711.7585297113,
            "unit": "iter/sec",
            "range": "stddev: 6.982416794587828e-7",
            "extra": "mean: 4.470037724312061 usec\nrounds: 44030"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 508590.41830188833,
            "unit": "iter/sec",
            "range": "stddev: 4.3718688421044744e-7",
            "extra": "mean: 1.966218717487559 usec\nrounds: 35635"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1781.0021037235172,
            "unit": "iter/sec",
            "range": "stddev: 0.00006836281729727405",
            "extra": "mean: 561.4816500830142 usec\nrounds: 1206"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1049.4654266286536,
            "unit": "iter/sec",
            "range": "stddev: 0.00009902937597264872",
            "extra": "mean: 952.8660731706442 usec\nrounds: 615"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 750.8528352376601,
            "unit": "iter/sec",
            "range": "stddev: 0.00030493104840223007",
            "extra": "mean: 1.3318189038781212 msec\nrounds: 593"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 612.697738061512,
            "unit": "iter/sec",
            "range": "stddev: 0.0002660567963808883",
            "extra": "mean: 1.6321261494515336 msec\nrounds: 455"
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
          "id": "b218eea3681f97325e28d5e2604dad46cb821caf",
          "message": "style: fix pre-commit lint failures and add pre-commit workflow to modern-python skill\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-27T01:52:58+02:00",
          "tree_id": "337a77a8ba3f57f4da41fa0d47d85df734adb557",
          "url": "https://github.com/fruch/coodie/commit/b218eea3681f97325e28d5e2604dad46cb821caf"
        },
        "date": 1772150052320,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1253.5561199610927,
            "unit": "iter/sec",
            "range": "stddev: 0.0002524898541292499",
            "extra": "mean: 797.7305396036339 usec\nrounds: 404"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1923.7254405190727,
            "unit": "iter/sec",
            "range": "stddev: 0.000060272462442584255",
            "extra": "mean: 519.8246999998987 usec\nrounds: 840"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 921.6729680598828,
            "unit": "iter/sec",
            "range": "stddev: 0.0007089878814219722",
            "extra": "mean: 1.084983540425402 msec\nrounds: 940"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1875.1460319087805,
            "unit": "iter/sec",
            "range": "stddev: 0.00008581711723781391",
            "extra": "mean: 533.2917986030469 usec\nrounds: 859"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1022.4829259636164,
            "unit": "iter/sec",
            "range": "stddev: 0.00008630676068357094",
            "extra": "mean: 978.0114411764599 usec\nrounds: 952"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1955.6683323267455,
            "unit": "iter/sec",
            "range": "stddev: 0.00006168303073915738",
            "extra": "mean: 511.33414775411103 usec\nrounds: 846"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1324.0255821125827,
            "unit": "iter/sec",
            "range": "stddev: 0.0000659010072141265",
            "extra": "mean: 755.27241581271 usec\nrounds: 683"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 976.2801336663521,
            "unit": "iter/sec",
            "range": "stddev: 0.00009302466023081545",
            "extra": "mean: 1.024296168195669 msec\nrounds: 981"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 335.0178807883469,
            "unit": "iter/sec",
            "range": "stddev: 0.00012594017518423363",
            "extra": "mean: 2.984915305555785 msec\nrounds: 252"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 909.0382070975257,
            "unit": "iter/sec",
            "range": "stddev: 0.0000805543967382533",
            "extra": "mean: 1.1000637731090608 msec\nrounds: 476"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 731.3251596709126,
            "unit": "iter/sec",
            "range": "stddev: 0.0001152519204803469",
            "extra": "mean: 1.367380824761981 msec\nrounds: 525"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1662.806849732779,
            "unit": "iter/sec",
            "range": "stddev: 0.00008037453072917041",
            "extra": "mean: 601.3927595743936 usec\nrounds: 940"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1125.7615573206417,
            "unit": "iter/sec",
            "range": "stddev: 0.00006474820364538023",
            "extra": "mean: 888.287571641761 usec\nrounds: 670"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1052.5051041592974,
            "unit": "iter/sec",
            "range": "stddev: 0.00008577612958910132",
            "extra": "mean: 950.1141572123428 usec\nrounds: 617"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1315.4576473358234,
            "unit": "iter/sec",
            "range": "stddev: 0.0000595873306190781",
            "extra": "mean: 760.1917112461089 usec\nrounds: 987"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1944.5923549103702,
            "unit": "iter/sec",
            "range": "stddev: 0.00005853889200735669",
            "extra": "mean: 514.246596452392 usec\nrounds: 902"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 715.9308626615145,
            "unit": "iter/sec",
            "range": "stddev: 0.00009780082928565769",
            "extra": "mean: 1.3967829187897305 msec\nrounds: 628"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 986.4979106588788,
            "unit": "iter/sec",
            "range": "stddev: 0.00009171935309674063",
            "extra": "mean: 1.0136868909657428 msec\nrounds: 642"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27023.052801651327,
            "unit": "iter/sec",
            "range": "stddev: 0.000025007358565929992",
            "extra": "mean: 37.00544151469415 usec\nrounds: 13653"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 47181.05826543657,
            "unit": "iter/sec",
            "range": "stddev: 0.0000017956605220624456",
            "extra": "mean: 21.194946378143662 usec\nrounds: 21260"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 582.9289145453738,
            "unit": "iter/sec",
            "range": "stddev: 0.00008757541893887913",
            "extra": "mean: 1.715475034858924 msec\nrounds: 459"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1625.7732190773509,
            "unit": "iter/sec",
            "range": "stddev: 0.00016005026837390856",
            "extra": "mean: 615.0919379564599 usec\nrounds: 822"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.950138830562796,
            "unit": "iter/sec",
            "range": "stddev: 0.0003882184149929911",
            "extra": "mean: 52.77006194736681 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 518.1471346820086,
            "unit": "iter/sec",
            "range": "stddev: 0.0001063018710770427",
            "extra": "mean: 1.9299537391318557 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1503.632502548001,
            "unit": "iter/sec",
            "range": "stddev: 0.00006490222358885938",
            "extra": "mean: 665.056121296551 usec\nrounds: 1080"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2139.8114762728283,
            "unit": "iter/sec",
            "range": "stddev: 0.0000505370512611086",
            "extra": "mean: 467.33088923414067 usec\nrounds: 966"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1455.5633033461356,
            "unit": "iter/sec",
            "range": "stddev: 0.00006747678425935311",
            "extra": "mean: 687.0192438220588 usec\nrounds: 1214"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 1998.3898136622097,
            "unit": "iter/sec",
            "range": "stddev: 0.00005925361207389382",
            "extra": "mean: 500.40287093308376 usec\nrounds: 922"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 736.3907481658301,
            "unit": "iter/sec",
            "range": "stddev: 0.00009528227044681625",
            "extra": "mean: 1.3579746927711356 msec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 964.1877954603024,
            "unit": "iter/sec",
            "range": "stddev: 0.00020836283861073944",
            "extra": "mean: 1.037142354122623 msec\nrounds: 946"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 892.3014847977072,
            "unit": "iter/sec",
            "range": "stddev: 0.00008112206865436447",
            "extra": "mean: 1.120697451519661 msec\nrounds: 691"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1112.7271677155998,
            "unit": "iter/sec",
            "range": "stddev: 0.00007947680339888368",
            "extra": "mean: 898.6928952700725 usec\nrounds: 592"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 861.297878877346,
            "unit": "iter/sec",
            "range": "stddev: 0.0001018311034092638",
            "extra": "mean: 1.1610385030826322 msec\nrounds: 811"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1095.8142454357273,
            "unit": "iter/sec",
            "range": "stddev: 0.00007976015682047376",
            "extra": "mean: 912.5634241069491 usec\nrounds: 896"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1633.89015231204,
            "unit": "iter/sec",
            "range": "stddev: 0.000054359679882196676",
            "extra": "mean: 612.0362489393474 usec\nrounds: 1414"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2144.389296446157,
            "unit": "iter/sec",
            "range": "stddev: 0.00008995631952058567",
            "extra": "mean: 466.33323606738537 usec\nrounds: 1902"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 775.6640108874207,
            "unit": "iter/sec",
            "range": "stddev: 0.00008429474475105015",
            "extra": "mean: 1.2892179938268906 msec\nrounds: 486"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 907.1365007734087,
            "unit": "iter/sec",
            "range": "stddev: 0.00012251682845748345",
            "extra": "mean: 1.1023699290541362 msec\nrounds: 592"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1603.518186577934,
            "unit": "iter/sec",
            "range": "stddev: 0.00010660880875306097",
            "extra": "mean: 623.6287236218373 usec\nrounds: 1270"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2223.839895823535,
            "unit": "iter/sec",
            "range": "stddev: 0.000049601704485217885",
            "extra": "mean: 449.67265938435685 usec\nrounds: 1007"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1439.7308978300634,
            "unit": "iter/sec",
            "range": "stddev: 0.00006301604153480239",
            "extra": "mean: 694.5742440529561 usec\nrounds: 1135"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2023.8809485535746,
            "unit": "iter/sec",
            "range": "stddev: 0.00006122544068437937",
            "extra": "mean: 494.1002091623418 usec\nrounds: 1659"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 201.1591595409432,
            "unit": "iter/sec",
            "range": "stddev: 0.0017044302142002182",
            "extra": "mean: 4.971187999999889 msec\nrounds: 199"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 663.3250022749859,
            "unit": "iter/sec",
            "range": "stddev: 0.00013463458474630543",
            "extra": "mean: 1.5075566224254024 msec\nrounds: 437"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 825.0551430476386,
            "unit": "iter/sec",
            "range": "stddev: 0.0001426728092527974",
            "extra": "mean: 1.2120401992843042 msec\nrounds: 838"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1488.009599093558,
            "unit": "iter/sec",
            "range": "stddev: 0.0000867334385249532",
            "extra": "mean: 672.0386754286827 usec\nrounds: 875"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 910.5212861890526,
            "unit": "iter/sec",
            "range": "stddev: 0.00007443767426619432",
            "extra": "mean: 1.0982719626308317 msec\nrounds: 669"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1057.7748925685064,
            "unit": "iter/sec",
            "range": "stddev: 0.0000524512990804691",
            "extra": "mean: 945.3807298940359 usec\nrounds: 659"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5719.009467559858,
            "unit": "iter/sec",
            "range": "stddev: 0.000048935685694886455",
            "extra": "mean: 174.85545454546556 usec\nrounds: 143"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 225626.51393337574,
            "unit": "iter/sec",
            "range": "stddev: 0.0000012295609142058112",
            "extra": "mean: 4.43210322478007 usec\nrounds: 155"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4499.0121125116175,
            "unit": "iter/sec",
            "range": "stddev: 0.00006147123422829873",
            "extra": "mean: 222.2710175016044 usec\nrounds: 2914"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 210424.32944807402,
            "unit": "iter/sec",
            "range": "stddev: 8.082195018679665e-7",
            "extra": "mean: 4.752302182085689 usec\nrounds: 37120"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81810.1222168615,
            "unit": "iter/sec",
            "range": "stddev: 0.000017649628205973186",
            "extra": "mean: 12.223426305967486 usec\nrounds: 28503"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 507198.98812064633,
            "unit": "iter/sec",
            "range": "stddev: 4.694981508224421e-7",
            "extra": "mean: 1.9716127662347231 usec\nrounds: 43098"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 218548.17921513517,
            "unit": "iter/sec",
            "range": "stddev: 7.605621069194969e-7",
            "extra": "mean: 4.575650108782726 usec\nrounds: 53348"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 474751.0407050116,
            "unit": "iter/sec",
            "range": "stddev: 5.31999810075281e-7",
            "extra": "mean: 2.10636715722621 usec\nrounds: 39814"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1875.0259971085043,
            "unit": "iter/sec",
            "range": "stddev: 0.000056681292303036",
            "extra": "mean: 533.3259387027751 usec\nrounds: 1403"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1061.417828917214,
            "unit": "iter/sec",
            "range": "stddev: 0.0000816423461727242",
            "extra": "mean: 942.1360493069274 usec\nrounds: 649"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 800.8796086667172,
            "unit": "iter/sec",
            "range": "stddev: 0.00007092915537649156",
            "extra": "mean: 1.2486271209536388 msec\nrounds: 587"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 645.2940808686928,
            "unit": "iter/sec",
            "range": "stddev: 0.0001625734210184414",
            "extra": "mean: 1.549681036363766 msec\nrounds: 440"
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
          "id": "c99952e0fd4764a5232a7694d6761a712dbd8a86",
          "message": "chore: add comprehensive renovate configuration for security and bulk updates\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-27T01:53:54+02:00",
          "tree_id": "f5674d4eb613af1710132a78b66ba69f1b4444a3",
          "url": "https://github.com/fruch/coodie/commit/c99952e0fd4764a5232a7694d6761a712dbd8a86"
        },
        "date": 1772150104657,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1296.611896714513,
            "unit": "iter/sec",
            "range": "stddev: 0.0002871351333422325",
            "extra": "mean: 771.2408026903821 usec\nrounds: 446"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1956.4565576120622,
            "unit": "iter/sec",
            "range": "stddev: 0.00008971809327295484",
            "extra": "mean: 511.12813934419387 usec\nrounds: 854"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 911.8634090147094,
            "unit": "iter/sec",
            "range": "stddev: 0.0011745669469230007",
            "extra": "mean: 1.0966554750568664 msec\nrounds: 882"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1794.0531641821754,
            "unit": "iter/sec",
            "range": "stddev: 0.00011527335525458961",
            "extra": "mean: 557.3970827424465 usec\nrounds: 423"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1033.2857487551175,
            "unit": "iter/sec",
            "range": "stddev: 0.0001159015538257212",
            "extra": "mean: 967.7865016572429 usec\nrounds: 905"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 1986.2551469118885,
            "unit": "iter/sec",
            "range": "stddev: 0.00007690574996494247",
            "extra": "mean: 503.4599918115961 usec\nrounds: 977"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1304.362514342974,
            "unit": "iter/sec",
            "range": "stddev: 0.0001007440131002796",
            "extra": "mean: 766.6580333334053 usec\nrounds: 660"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 924.1863540098099,
            "unit": "iter/sec",
            "range": "stddev: 0.000325219288122194",
            "extra": "mean: 1.082032855885887 msec\nrounds: 909"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 330.0761782811721,
            "unit": "iter/sec",
            "range": "stddev: 0.00024846640239371197",
            "extra": "mean: 3.02960366666679 msec\nrounds: 237"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 905.0592650328643,
            "unit": "iter/sec",
            "range": "stddev: 0.00009155894172472453",
            "extra": "mean: 1.1049000199602268 msec\nrounds: 501"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 733.4064961174057,
            "unit": "iter/sec",
            "range": "stddev: 0.00014083090228973023",
            "extra": "mean: 1.3635003307087115 msec\nrounds: 635"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1727.4038868726093,
            "unit": "iter/sec",
            "range": "stddev: 0.00008049967544037842",
            "extra": "mean: 578.9034096770832 usec\nrounds: 930"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1160.6631812524163,
            "unit": "iter/sec",
            "range": "stddev: 0.0000951458211281734",
            "extra": "mean: 861.5763954198562 usec\nrounds: 655"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1037.8762352820183,
            "unit": "iter/sec",
            "range": "stddev: 0.00009620600201216991",
            "extra": "mean: 963.5060193167191 usec\nrounds: 673"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1298.8855455574926,
            "unit": "iter/sec",
            "range": "stddev: 0.00007966190592958327",
            "extra": "mean: 769.8907755346462 usec\nrounds: 842"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1964.935597593425,
            "unit": "iter/sec",
            "range": "stddev: 0.00006809918180244873",
            "extra": "mean: 508.9225322319775 usec\nrounds: 605"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 738.673546489917,
            "unit": "iter/sec",
            "range": "stddev: 0.00010549914274320223",
            "extra": "mean: 1.353778004846489 msec\nrounds: 619"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1072.5265243952986,
            "unit": "iter/sec",
            "range": "stddev: 0.00009055889098179482",
            "extra": "mean: 932.3778734179187 usec\nrounds: 711"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26645.515634268875,
            "unit": "iter/sec",
            "range": "stddev: 0.000026398997571431253",
            "extra": "mean: 37.52976724961167 usec\nrounds: 11609"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46776.07661548872,
            "unit": "iter/sec",
            "range": "stddev: 0.000002002672075485715",
            "extra": "mean: 21.3784496767494 usec\nrounds: 11446"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 579.6147603050417,
            "unit": "iter/sec",
            "range": "stddev: 0.00015498462813911046",
            "extra": "mean: 1.725283875575764 msec\nrounds: 434"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1678.2307194130733,
            "unit": "iter/sec",
            "range": "stddev: 0.00016003084639378776",
            "extra": "mean: 595.8656270752388 usec\nrounds: 783"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.81603916017801,
            "unit": "iter/sec",
            "range": "stddev: 0.00041441371768989615",
            "extra": "mean: 53.14614789473787 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 514.3374585504446,
            "unit": "iter/sec",
            "range": "stddev: 0.00010390635924175711",
            "extra": "mean: 1.9442488260884139 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1557.803441526817,
            "unit": "iter/sec",
            "range": "stddev: 0.00006031651359107045",
            "extra": "mean: 641.9295100670025 usec\nrounds: 1043"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2185.738333707207,
            "unit": "iter/sec",
            "range": "stddev: 0.00005298939269309144",
            "extra": "mean: 457.5113061698977 usec\nrounds: 859"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1497.8871372796377,
            "unit": "iter/sec",
            "range": "stddev: 0.00007824731743542861",
            "extra": "mean: 667.6070413530174 usec\nrounds: 1064"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2081.163979033611,
            "unit": "iter/sec",
            "range": "stddev: 0.00007699235625391586",
            "extra": "mean: 480.50034022996596 usec\nrounds: 870"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 740.8462273700158,
            "unit": "iter/sec",
            "range": "stddev: 0.00010757422121379436",
            "extra": "mean: 1.3498077779918962 msec\nrounds: 518"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1010.9782057356742,
            "unit": "iter/sec",
            "range": "stddev: 0.0001099156603658283",
            "extra": "mean: 989.1410065287357 usec\nrounds: 919"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 902.6386960295426,
            "unit": "iter/sec",
            "range": "stddev: 0.00009548058241348605",
            "extra": "mean: 1.107862984822967 msec\nrounds: 593"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1055.9398105031612,
            "unit": "iter/sec",
            "range": "stddev: 0.00023640428587326276",
            "extra": "mean: 947.0236750743344 usec\nrounds: 674"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 859.224442732725,
            "unit": "iter/sec",
            "range": "stddev: 0.0001101168923491797",
            "extra": "mean: 1.163840261363544 msec\nrounds: 616"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1104.314670441662,
            "unit": "iter/sec",
            "range": "stddev: 0.00010213662499724134",
            "extra": "mean: 905.5389978655792 usec\nrounds: 937"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1538.4485116464853,
            "unit": "iter/sec",
            "range": "stddev: 0.00013767203986284236",
            "extra": "mean: 650.0055038759637 usec\nrounds: 1161"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2193.04011774013,
            "unit": "iter/sec",
            "range": "stddev: 0.00006541873722208216",
            "extra": "mean: 455.9880103928393 usec\nrounds: 1732"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 653.2090310955504,
            "unit": "iter/sec",
            "range": "stddev: 0.0005070244023307405",
            "extra": "mean: 1.5309035123455321 msec\nrounds: 486"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 769.635175192217,
            "unit": "iter/sec",
            "range": "stddev: 0.0002470358913415517",
            "extra": "mean: 1.299316913042922 msec\nrounds: 529"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1561.1920286367865,
            "unit": "iter/sec",
            "range": "stddev: 0.00013102640133954064",
            "extra": "mean: 640.5361939191988 usec\nrounds: 1217"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2144.0228466369954,
            "unit": "iter/sec",
            "range": "stddev: 0.00006193421123379469",
            "extra": "mean: 466.4129403138352 usec\nrounds: 955"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1512.2683243084805,
            "unit": "iter/sec",
            "range": "stddev: 0.00006774530215693261",
            "extra": "mean: 661.2583123813514 usec\nrounds: 1050"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2082.1762780266713,
            "unit": "iter/sec",
            "range": "stddev: 0.00006597790393451733",
            "extra": "mean: 480.26673368295417 usec\nrounds: 1716"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 210.52190693229352,
            "unit": "iter/sec",
            "range": "stddev: 0.001786608618174671",
            "extra": "mean: 4.7500994769233795 msec\nrounds: 195"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 660.2033626523651,
            "unit": "iter/sec",
            "range": "stddev: 0.00016706359518718354",
            "extra": "mean: 1.514684802547056 msec\nrounds: 471"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 845.4974308232968,
            "unit": "iter/sec",
            "range": "stddev: 0.00012183737952324369",
            "extra": "mean: 1.1827357050940503 msec\nrounds: 746"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1644.7512637167124,
            "unit": "iter/sec",
            "range": "stddev: 0.00008739052174569667",
            "extra": "mean: 607.9946688961702 usec\nrounds: 598"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 963.8160818099193,
            "unit": "iter/sec",
            "range": "stddev: 0.0000758299614483693",
            "extra": "mean: 1.0375423474177066 msec\nrounds: 639"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1073.7553870575366,
            "unit": "iter/sec",
            "range": "stddev: 0.00006900873404946157",
            "extra": "mean: 931.3108106869182 usec\nrounds: 655"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5672.729152841693,
            "unit": "iter/sec",
            "range": "stddev: 0.00005718218955580109",
            "extra": "mean: 176.2819928568352 usec\nrounds: 140"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 209171.94264035625,
            "unit": "iter/sec",
            "range": "stddev: 0.0000026503180098593995",
            "extra": "mean: 4.78075590529543 usec\nrounds: 127"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4532.162764527703,
            "unit": "iter/sec",
            "range": "stddev: 0.00007279668910047213",
            "extra": "mean: 220.6452089114699 usec\nrounds: 2379"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 206282.44483107235,
            "unit": "iter/sec",
            "range": "stddev: 0.0000064527395928126965",
            "extra": "mean: 4.847722261673379 usec\nrounds: 22532"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 82191.66896020235,
            "unit": "iter/sec",
            "range": "stddev: 0.000017785156507173967",
            "extra": "mean: 12.16668322533036 usec\nrounds: 20674"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 516937.67938453855,
            "unit": "iter/sec",
            "range": "stddev: 5.269192593467792e-7",
            "extra": "mean: 1.9344691630731798 usec\nrounds: 34877"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 212522.46524495835,
            "unit": "iter/sec",
            "range": "stddev: 9.859903725973956e-7",
            "extra": "mean: 4.7053849052963725 usec\nrounds: 43247"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 494597.8944152417,
            "unit": "iter/sec",
            "range": "stddev: 4.621412458198409e-7",
            "extra": "mean: 2.0218444342192163 usec\nrounds: 34802"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1723.9172727791135,
            "unit": "iter/sec",
            "range": "stddev: 0.00007605898705621038",
            "extra": "mean: 580.0742389383382 usec\nrounds: 1243"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1058.3948238544574,
            "unit": "iter/sec",
            "range": "stddev: 0.00011556340006104814",
            "extra": "mean: 944.8269941062304 usec\nrounds: 509"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 700.3800160299687,
            "unit": "iter/sec",
            "range": "stddev: 0.00020800631268339746",
            "extra": "mean: 1.4277963064514547 msec\nrounds: 496"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 578.6729048775364,
            "unit": "iter/sec",
            "range": "stddev: 0.0002551944370511361",
            "extra": "mean: 1.7280919696968156 msec\nrounds: 198"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "29139614+renovate[bot]@users.noreply.github.com",
            "name": "renovate[bot]",
            "username": "renovate[bot]"
          },
          "committer": {
            "email": "israel.fruchter@gmail.com",
            "name": "Israel Fruchter",
            "username": "fruch"
          },
          "distinct": true,
          "id": "d4502e688b03274c0cc49bad203a54fffb538002",
          "message": "chore(deps): lock file maintenance",
          "timestamp": "2026-02-27T02:16:30+02:00",
          "tree_id": "5b76b55e9b1c36cf250ade57f2f9f4383beb4e55",
          "url": "https://github.com/fruch/coodie/commit/d4502e688b03274c0cc49bad203a54fffb538002"
        },
        "date": 1772151493910,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1441.28450272114,
            "unit": "iter/sec",
            "range": "stddev: 0.0001842285742270433",
            "extra": "mean: 693.8255411141961 usec\nrounds: 377"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2057.903081200053,
            "unit": "iter/sec",
            "range": "stddev: 0.0000633052762567036",
            "extra": "mean: 485.9315334796313 usec\nrounds: 911"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 948.7656361540905,
            "unit": "iter/sec",
            "range": "stddev: 0.0007212899828738736",
            "extra": "mean: 1.0540010745473378 msec\nrounds: 939"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1831.8307457468202,
            "unit": "iter/sec",
            "range": "stddev: 0.00009574661253846482",
            "extra": "mean: 545.9019630071278 usec\nrounds: 838"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1079.7004347671561,
            "unit": "iter/sec",
            "range": "stddev: 0.00008730536755540715",
            "extra": "mean: 926.1828260869931 usec\nrounds: 966"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2000.0852606702074,
            "unit": "iter/sec",
            "range": "stddev: 0.00006422170592003438",
            "extra": "mean: 499.9786857410822 usec\nrounds: 1066"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1401.9855273136388,
            "unit": "iter/sec",
            "range": "stddev: 0.00006817997955334288",
            "extra": "mean: 713.2741248164749 usec\nrounds: 681"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1044.6219675014509,
            "unit": "iter/sec",
            "range": "stddev: 0.00009779335929952258",
            "extra": "mean: 957.2841000001382 usec\nrounds: 990"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 332.1845486809012,
            "unit": "iter/sec",
            "range": "stddev: 0.00012635070341506996",
            "extra": "mean: 3.010374817164079 msec\nrounds: 268"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 908.965963220775,
            "unit": "iter/sec",
            "range": "stddev: 0.00009484693521377511",
            "extra": "mean: 1.1001512052845854 msec\nrounds: 492"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 731.4962840354518,
            "unit": "iter/sec",
            "range": "stddev: 0.00012017932267429572",
            "extra": "mean: 1.3670609431989065 msec\nrounds: 669"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1652.8683807539842,
            "unit": "iter/sec",
            "range": "stddev: 0.00008062725099501711",
            "extra": "mean: 605.0088510640109 usec\nrounds: 893"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1187.7835128750971,
            "unit": "iter/sec",
            "range": "stddev: 0.00007640145171951241",
            "extra": "mean: 841.9042604653127 usec\nrounds: 645"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1072.4446163758553,
            "unit": "iter/sec",
            "range": "stddev: 0.00008663919778388547",
            "extra": "mean: 932.4490838317884 usec\nrounds: 668"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1328.3851058774678,
            "unit": "iter/sec",
            "range": "stddev: 0.00006449362725296023",
            "extra": "mean: 752.7937460119651 usec\nrounds: 815"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2032.3519541208111,
            "unit": "iter/sec",
            "range": "stddev: 0.00005468306089457287",
            "extra": "mean: 492.04075995419635 usec\nrounds: 879"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 735.2830339228611,
            "unit": "iter/sec",
            "range": "stddev: 0.00010651441422471039",
            "extra": "mean: 1.360020500765302 msec\nrounds: 653"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1067.9715831216963,
            "unit": "iter/sec",
            "range": "stddev: 0.00009327842583094605",
            "extra": "mean: 936.3545021272811 usec\nrounds: 705"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26928.239572648854,
            "unit": "iter/sec",
            "range": "stddev: 0.000025525946091616474",
            "extra": "mean: 37.13573615913997 usec\nrounds: 11560"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46557.771402450075,
            "unit": "iter/sec",
            "range": "stddev: 0.000001681837403665831",
            "extra": "mean: 21.478691309253165 usec\nrounds: 17720"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 588.1271887243956,
            "unit": "iter/sec",
            "range": "stddev: 0.00009636717607165681",
            "extra": "mean: 1.7003124820141813 msec\nrounds: 417"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1625.4784324023537,
            "unit": "iter/sec",
            "range": "stddev: 0.00015862711572965473",
            "extra": "mean: 615.2034872108784 usec\nrounds: 821"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.81984151524136,
            "unit": "iter/sec",
            "range": "stddev: 0.000385704909369352",
            "extra": "mean: 53.135410263159976 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 523.2829992723787,
            "unit": "iter/sec",
            "range": "stddev: 0.00012925892494362708",
            "extra": "mean: 1.9110118260874 msec\nrounds: 23"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1582.9267059023832,
            "unit": "iter/sec",
            "range": "stddev: 0.00005749646088707649",
            "extra": "mean: 631.7411894506685 usec\nrounds: 929"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2148.5442644169034,
            "unit": "iter/sec",
            "range": "stddev: 0.00004941000384834412",
            "extra": "mean: 465.43141631359015 usec\nrounds: 944"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1462.0979279283576,
            "unit": "iter/sec",
            "range": "stddev: 0.00006413174281543518",
            "extra": "mean: 683.9487156765874 usec\nrounds: 1027"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2013.526318738867,
            "unit": "iter/sec",
            "range": "stddev: 0.00006180067274179144",
            "extra": "mean: 496.64113684212015 usec\nrounds: 665"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 744.1020035518987,
            "unit": "iter/sec",
            "range": "stddev: 0.00009408919697748571",
            "extra": "mean: 1.3439017704919447 msec\nrounds: 610"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1036.702079243309,
            "unit": "iter/sec",
            "range": "stddev: 0.0000872133289731848",
            "extra": "mean: 964.5972743971943 usec\nrounds: 871"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 883.107778381844,
            "unit": "iter/sec",
            "range": "stddev: 0.0002667597431944219",
            "extra": "mean: 1.1323646155991771 msec\nrounds: 718"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1145.3189010366264,
            "unit": "iter/sec",
            "range": "stddev: 0.00007715458098376102",
            "extra": "mean: 873.119267563734 usec\nrounds: 669"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 874.018219970977,
            "unit": "iter/sec",
            "range": "stddev: 0.00008636467772121807",
            "extra": "mean: 1.1441409082218061 msec\nrounds: 523"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1136.1913915784282,
            "unit": "iter/sec",
            "range": "stddev: 0.00007942229580170323",
            "extra": "mean: 880.1334065828228 usec\nrounds: 1033"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1662.9871254246773,
            "unit": "iter/sec",
            "range": "stddev: 0.000055012919323151934",
            "extra": "mean: 601.3275657468664 usec\nrounds: 1232"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2193.4650010969362,
            "unit": "iter/sec",
            "range": "stddev: 0.0000913600442428976",
            "extra": "mean: 455.8996836055771 usec\nrounds: 1653"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 696.8581629923322,
            "unit": "iter/sec",
            "range": "stddev: 0.0005286628100509515",
            "extra": "mean: 1.435012249416677 msec\nrounds: 429"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 829.6077505138923,
            "unit": "iter/sec",
            "range": "stddev: 0.00023875219398101585",
            "extra": "mean: 1.2053889315529658 msec\nrounds: 599"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1652.836363615335,
            "unit": "iter/sec",
            "range": "stddev: 0.00005683002390706595",
            "extra": "mean: 605.0205707071013 usec\nrounds: 1188"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2202.097227857745,
            "unit": "iter/sec",
            "range": "stddev: 0.00007391464599763802",
            "extra": "mean: 454.11255568076115 usec\nrounds: 889"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1497.3325689825363,
            "unit": "iter/sec",
            "range": "stddev: 0.00006758043988486829",
            "extra": "mean: 667.8543035229092 usec\nrounds: 1107"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2001.5800104398488,
            "unit": "iter/sec",
            "range": "stddev: 0.00006418636181024271",
            "extra": "mean: 499.6053091978317 usec\nrounds: 1533"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 208.28558017244842,
            "unit": "iter/sec",
            "range": "stddev: 0.0023874000033941548",
            "extra": "mean: 4.801100485074665 msec\nrounds: 134"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 648.6462405569246,
            "unit": "iter/sec",
            "range": "stddev: 0.00014380155644442693",
            "extra": "mean: 1.5416723900864742 msec\nrounds: 464"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 872.4198004429657,
            "unit": "iter/sec",
            "range": "stddev: 0.00011821243170567177",
            "extra": "mean: 1.1462371664332427 msec\nrounds: 715"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1613.001855602926,
            "unit": "iter/sec",
            "range": "stddev: 0.00008095250931246368",
            "extra": "mean: 619.9620890245094 usec\nrounds: 820"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 957.0044652580264,
            "unit": "iter/sec",
            "range": "stddev: 0.00005911930844687738",
            "extra": "mean: 1.0449272038980313 msec\nrounds: 667"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1096.160320159666,
            "unit": "iter/sec",
            "range": "stddev: 0.000055447822015533285",
            "extra": "mean: 912.2753137555102 usec\nrounds: 647"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5522.2290046299695,
            "unit": "iter/sec",
            "range": "stddev: 0.00007289606816926915",
            "extra": "mean: 181.08629670402584 usec\nrounds: 91"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 213247.36536878182,
            "unit": "iter/sec",
            "range": "stddev: 0.0000031466650824701232",
            "extra": "mean: 4.68938970603758 usec\nrounds: 136"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4850.38723644914,
            "unit": "iter/sec",
            "range": "stddev: 0.000055759433223278106",
            "extra": "mean: 206.1691059396894 usec\nrounds: 2879"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 210523.47793919814,
            "unit": "iter/sec",
            "range": "stddev: 8.368214154791098e-7",
            "extra": "mean: 4.750064029859951 usec\nrounds: 34031"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 82403.27319369171,
            "unit": "iter/sec",
            "range": "stddev: 0.000017542673403773034",
            "extra": "mean: 12.135440271279828 usec\nrounds: 23004"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 501981.16294505534,
            "unit": "iter/sec",
            "range": "stddev: 4.4639926141866567e-7",
            "extra": "mean: 1.9921066243464909 usec\nrounds: 36230"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 218939.93722687484,
            "unit": "iter/sec",
            "range": "stddev: 0.0000012672875003945963",
            "extra": "mean: 4.56746271450584 usec\nrounds: 49121"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 509812.46365734586,
            "unit": "iter/sec",
            "range": "stddev: 6.610810447702748e-7",
            "extra": "mean: 1.9615055952655522 usec\nrounds: 38068"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1907.840519947332,
            "unit": "iter/sec",
            "range": "stddev: 0.00007741011360299033",
            "extra": "mean: 524.1528259540299 usec\nrounds: 1310"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1110.517388064074,
            "unit": "iter/sec",
            "range": "stddev: 0.00008433504598430782",
            "extra": "mean: 900.4811727831338 usec\nrounds: 654"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 709.0280770769036,
            "unit": "iter/sec",
            "range": "stddev: 0.00032781406888453756",
            "extra": "mean: 1.4103813830937144 msec\nrounds: 556"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 575.8643075767155,
            "unit": "iter/sec",
            "range": "stddev: 0.0005193332072820132",
            "extra": "mean: 1.7365201955441247 msec\nrounds: 404"
          }
        ]
      }
    ]
  }
}