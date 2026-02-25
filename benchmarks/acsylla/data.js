window.BENCHMARK_DATA = {
  "lastUpdate": 1772048603303,
  "repoUrl": "https://github.com/fruch/coodie",
  "entries": {
    "coodie benchmarks (acsylla)": [
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
        "date": 1772045983652,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1343.4212448663377,
            "unit": "iter/sec",
            "range": "stddev: 0.0002829601302075249",
            "extra": "mean: 744.3681598912738 usec\nrounds: 369"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2072.224984230636,
            "unit": "iter/sec",
            "range": "stddev: 0.000023190982736560474",
            "extra": "mean: 482.57308333306986 usec\nrounds: 876"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 996.8525500339047,
            "unit": "iter/sec",
            "range": "stddev: 0.00015815199931585677",
            "extra": "mean: 1.0031573876858602 msec\nrounds: 877"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1912.0463162986102,
            "unit": "iter/sec",
            "range": "stddev: 0.00008184887377586664",
            "extra": "mean: 522.9998831491836 usec\nrounds: 813"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1068.136178482814,
            "unit": "iter/sec",
            "range": "stddev: 0.0008215891073225723",
            "extra": "mean: 936.2102137766785 usec\nrounds: 842"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2073.9504195842137,
            "unit": "iter/sec",
            "range": "stddev: 0.00003275369296460503",
            "extra": "mean: 482.17160379392305 usec\nrounds: 949"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1343.94010104519,
            "unit": "iter/sec",
            "range": "stddev: 0.00008549940009143176",
            "extra": "mean: 744.0807809978244 usec\nrounds: 621"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1034.3894156534661,
            "unit": "iter/sec",
            "range": "stddev: 0.00003104574343592757",
            "extra": "mean: 966.7538983548658 usec\nrounds: 1033"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 361.879085472308,
            "unit": "iter/sec",
            "range": "stddev: 0.00013610760378766164",
            "extra": "mean: 2.7633539492752 msec\nrounds: 276"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 837.1698353713024,
            "unit": "iter/sec",
            "range": "stddev: 0.00006148109033319511",
            "extra": "mean: 1.1945007545051822 msec\nrounds: 444"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 756.7629046023363,
            "unit": "iter/sec",
            "range": "stddev: 0.00012735023228588265",
            "extra": "mean: 1.321417836310938 msec\nrounds: 672"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1511.3036516857524,
            "unit": "iter/sec",
            "range": "stddev: 0.00009364631108165629",
            "extra": "mean: 661.6803968445195 usec\nrounds: 824"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1200.6629453596356,
            "unit": "iter/sec",
            "range": "stddev: 0.00007273895247366218",
            "extra": "mean: 832.8732088092125 usec\nrounds: 613"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1030.1340325200429,
            "unit": "iter/sec",
            "range": "stddev: 0.000026252895458873652",
            "extra": "mean: 970.747464340805 usec\nrounds: 659"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1292.5119259843418,
            "unit": "iter/sec",
            "range": "stddev: 0.00007297536326342523",
            "extra": "mean: 773.6872518514111 usec\nrounds: 675"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2034.9963235705884,
            "unit": "iter/sec",
            "range": "stddev: 0.00003825424884915503",
            "extra": "mean: 491.4013791658394 usec\nrounds: 720"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 734.9736653563251,
            "unit": "iter/sec",
            "range": "stddev: 0.00011634332295195219",
            "extra": "mean: 1.3605929669809143 msec\nrounds: 636"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 914.5509992532257,
            "unit": "iter/sec",
            "range": "stddev: 0.00028006947821929617",
            "extra": "mean: 1.0934327345512143 msec\nrounds: 712"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 24161.197158128834,
            "unit": "iter/sec",
            "range": "stddev: 0.00002532397004544",
            "extra": "mean: 41.38867761623137 usec\nrounds: 9650"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 40151.52493845865,
            "unit": "iter/sec",
            "range": "stddev: 0.000002032845210558377",
            "extra": "mean: 24.90565430659801 usec\nrounds: 14860"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 658.7462578504986,
            "unit": "iter/sec",
            "range": "stddev: 0.00010684013693431544",
            "extra": "mean: 1.5180351889406078 msec\nrounds: 434"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1467.208252206028,
            "unit": "iter/sec",
            "range": "stddev: 0.00017255434879290445",
            "extra": "mean: 681.5665046161275 usec\nrounds: 650"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 19.5690344612291,
            "unit": "iter/sec",
            "range": "stddev: 0.0004963508497141046",
            "extra": "mean: 51.10114154999508 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 405.56061744833687,
            "unit": "iter/sec",
            "range": "stddev: 0.0004094475732766722",
            "extra": "mean: 2.465722649037507 msec\nrounds: 208"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1551.4333504240126,
            "unit": "iter/sec",
            "range": "stddev: 0.00006817286156058652",
            "extra": "mean: 644.5652336445496 usec\nrounds: 749"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2052.1377114601346,
            "unit": "iter/sec",
            "range": "stddev: 0.00002268880921529607",
            "extra": "mean: 487.29673180094784 usec\nrounds: 783"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1520.9806478290784,
            "unit": "iter/sec",
            "range": "stddev: 0.00007143201899835774",
            "extra": "mean: 657.4705611325937 usec\nrounds: 777"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2104.612404394131,
            "unit": "iter/sec",
            "range": "stddev: 0.000020169029472875034",
            "extra": "mean: 475.14687165776587 usec\nrounds: 748"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 732.638621790874,
            "unit": "iter/sec",
            "range": "stddev: 0.000135453201020632",
            "extra": "mean: 1.3649294075646508 msec\nrounds: 476"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1038.601771056622,
            "unit": "iter/sec",
            "range": "stddev: 0.00003590599803306302",
            "extra": "mean: 962.8329431622763 usec\nrounds: 651"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 894.8008783789776,
            "unit": "iter/sec",
            "range": "stddev: 0.0001233272245568591",
            "extra": "mean: 1.117567074600554 msec\nrounds: 563"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1043.1878963988643,
            "unit": "iter/sec",
            "range": "stddev: 0.00003460535480213812",
            "extra": "mean: 958.6000790960564 usec\nrounds: 531"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 861.3983343350098,
            "unit": "iter/sec",
            "range": "stddev: 0.0001058969312704635",
            "extra": "mean: 1.1609031038723672 msec\nrounds: 568"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1036.3883751410935,
            "unit": "iter/sec",
            "range": "stddev: 0.000038453918004403925",
            "extra": "mean: 964.8892480715642 usec\nrounds: 778"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1608.6010936411335,
            "unit": "iter/sec",
            "range": "stddev: 0.00006844803108188539",
            "extra": "mean: 621.6581624574552 usec\nrounds: 911"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2080.0613729839606,
            "unit": "iter/sec",
            "range": "stddev: 0.000021463582177113556",
            "extra": "mean: 480.7550454943769 usec\nrounds: 1165"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 797.1328846451839,
            "unit": "iter/sec",
            "range": "stddev: 0.00012109183463695297",
            "extra": "mean: 1.254495980861604 msec\nrounds: 418"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 996.4386667690178,
            "unit": "iter/sec",
            "range": "stddev: 0.00009257391145228678",
            "extra": "mean: 1.0035740616555258 msec\nrounds: 519"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1564.2726298165085,
            "unit": "iter/sec",
            "range": "stddev: 0.00015646273626951308",
            "extra": "mean: 639.2747536069218 usec\nrounds: 901"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2026.2681375313196,
            "unit": "iter/sec",
            "range": "stddev: 0.00002792685396418161",
            "extra": "mean: 493.51809934609076 usec\nrounds: 765"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1491.8343546356923,
            "unit": "iter/sec",
            "range": "stddev: 0.00007976642172999674",
            "extra": "mean: 670.3157068964276 usec\nrounds: 754"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2055.4408952516546,
            "unit": "iter/sec",
            "range": "stddev: 0.000022868311742502406",
            "extra": "mean: 486.51362455137223 usec\nrounds: 1116"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 211.99703992720615,
            "unit": "iter/sec",
            "range": "stddev: 0.0021166917633847907",
            "extra": "mean: 4.717046994351299 msec\nrounds: 177"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 513.0613613016843,
            "unit": "iter/sec",
            "range": "stddev: 0.00010674671376084884",
            "extra": "mean: 1.9490846035704326 msec\nrounds: 280"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 879.8767915451973,
            "unit": "iter/sec",
            "range": "stddev: 0.00014267733275748312",
            "extra": "mean: 1.1365227604695063 msec\nrounds: 597"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1475.2283092818102,
            "unit": "iter/sec",
            "range": "stddev: 0.00007667413382782701",
            "extra": "mean: 677.8611783059077 usec\nrounds: 673"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 921.4142087359185,
            "unit": "iter/sec",
            "range": "stddev: 0.00008628425937510747",
            "extra": "mean: 1.0852882346712376 msec\nrounds: 473"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1064.6914576049016,
            "unit": "iter/sec",
            "range": "stddev: 0.00005961943774588197",
            "extra": "mean: 939.239244249757 usec\nrounds: 565"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 7244.1759508268815,
            "unit": "iter/sec",
            "range": "stddev: 0.00006404741874275518",
            "extra": "mean: 138.04192592614424 usec\nrounds: 135"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 38120.4508945491,
            "unit": "iter/sec",
            "range": "stddev: 0.000006177082690711601",
            "extra": "mean: 26.232638296075127 usec\nrounds: 141"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 5986.492506653926,
            "unit": "iter/sec",
            "range": "stddev: 0.00006579059665443444",
            "extra": "mean: 167.0427214079881 usec\nrounds: 2046"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 56997.27612621538,
            "unit": "iter/sec",
            "range": "stddev: 0.0000025143822400273947",
            "extra": "mean: 17.544698062159835 usec\nrounds: 8929"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 72300.33881084192,
            "unit": "iter/sec",
            "range": "stddev: 0.000019824548383442743",
            "extra": "mean: 13.831193829067415 usec\nrounds: 15070"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 473999.7946787681,
            "unit": "iter/sec",
            "range": "stddev: 4.840121834594114e-7",
            "extra": "mean: 2.1097055552053665 usec\nrounds: 33986"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 214015.4415991567,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010525296782458964",
            "extra": "mean: 4.672560038321741 usec\nrounds: 41815"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 507398.15901900775,
            "unit": "iter/sec",
            "range": "stddev: 6.946296540124928e-7",
            "extra": "mean: 1.9708388416965834 usec\nrounds: 50894"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1870.3666973597271,
            "unit": "iter/sec",
            "range": "stddev: 0.00008022330102520365",
            "extra": "mean: 534.6545152945857 usec\nrounds: 850"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1043.6588855653538,
            "unit": "iter/sec",
            "range": "stddev: 0.00006322744806778669",
            "extra": "mean: 958.1674758207002 usec\nrounds: 517"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 836.167228431765,
            "unit": "iter/sec",
            "range": "stddev: 0.00013137200167164575",
            "extra": "mean: 1.1959330215266915 msec\nrounds: 511"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 686.0541074767027,
            "unit": "iter/sec",
            "range": "stddev: 0.00010206579563670663",
            "extra": "mean: 1.4576109800989105 msec\nrounds: 402"
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
        "date": 1772048338732,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1372.1596904453438,
            "unit": "iter/sec",
            "range": "stddev: 0.00010668742168492552",
            "extra": "mean: 728.7781494845132 usec\nrounds: 582"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2053.0134419433416,
            "unit": "iter/sec",
            "range": "stddev: 0.000040477254568267906",
            "extra": "mean: 487.0888712026259 usec\nrounds: 823"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 836.7073523552829,
            "unit": "iter/sec",
            "range": "stddev: 0.0007588858442562368",
            "extra": "mean: 1.1951610048424433 msec\nrounds: 826"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2013.7570673588239,
            "unit": "iter/sec",
            "range": "stddev: 0.00005696434142157429",
            "extra": "mean: 496.5842286585077 usec\nrounds: 984"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1038.2904291412224,
            "unit": "iter/sec",
            "range": "stddev: 0.00008894314054893313",
            "extra": "mean: 963.121658385224 usec\nrounds: 644"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2002.9492090428748,
            "unit": "iter/sec",
            "range": "stddev: 0.00003782789061920313",
            "extra": "mean: 499.2637833676561 usec\nrounds: 974"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1302.6487619128457,
            "unit": "iter/sec",
            "range": "stddev: 0.00009833282649456823",
            "extra": "mean: 767.6666414142 usec\nrounds: 594"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1018.1769017299478,
            "unit": "iter/sec",
            "range": "stddev: 0.00003172765957680164",
            "extra": "mean: 982.1475995978066 usec\nrounds: 994"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 318.49965146583935,
            "unit": "iter/sec",
            "range": "stddev: 0.00015812251691609003",
            "extra": "mean: 3.1397208612244114 msec\nrounds: 245"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 811.0179676116924,
            "unit": "iter/sec",
            "range": "stddev: 0.00009486822176206135",
            "extra": "mean: 1.2330183053093473 msec\nrounds: 452"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 705.6897087021597,
            "unit": "iter/sec",
            "range": "stddev: 0.0001400486892531428",
            "extra": "mean: 1.4170533984959324 msec\nrounds: 665"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1399.0367835777363,
            "unit": "iter/sec",
            "range": "stddev: 0.00003360542043801729",
            "extra": "mean: 714.777489583022 usec\nrounds: 768"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1114.6014607959262,
            "unit": "iter/sec",
            "range": "stddev: 0.00009355120897243227",
            "extra": "mean: 897.1816700167517 usec\nrounds: 597"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1030.3581412127614,
            "unit": "iter/sec",
            "range": "stddev: 0.00004598767635917869",
            "extra": "mean: 970.5363213056879 usec\nrounds: 582"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1270.3447356646625,
            "unit": "iter/sec",
            "range": "stddev: 0.00007830820406739788",
            "extra": "mean: 787.1878962656431 usec\nrounds: 723"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2018.8464914373326,
            "unit": "iter/sec",
            "range": "stddev: 0.00003902956753560999",
            "extra": "mean: 495.33236144569 usec\nrounds: 747"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 680.0228292137359,
            "unit": "iter/sec",
            "range": "stddev: 0.00015232940559881602",
            "extra": "mean: 1.4705388658145961 msec\nrounds: 626"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1022.6983526351534,
            "unit": "iter/sec",
            "range": "stddev: 0.000029984849087852426",
            "extra": "mean: 977.8054275958624 usec\nrounds: 732"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27194.932474153546,
            "unit": "iter/sec",
            "range": "stddev: 0.00002548594637317992",
            "extra": "mean: 36.77155664756346 usec\nrounds: 11192"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46734.760705889064,
            "unit": "iter/sec",
            "range": "stddev: 0.000001915048237709547",
            "extra": "mean: 21.39734931549547 usec\nrounds: 17311"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 558.8409374186361,
            "unit": "iter/sec",
            "range": "stddev: 0.00011716982993314294",
            "extra": "mean: 1.78941794174768 msec\nrounds: 412"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1328.5570828304067,
            "unit": "iter/sec",
            "range": "stddev: 0.00013190866017277796",
            "extra": "mean: 752.6962995594915 usec\nrounds: 681"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.45390063861386,
            "unit": "iter/sec",
            "range": "stddev: 0.0004017430247259929",
            "extra": "mean: 54.18908552631688 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 416.1908865943804,
            "unit": "iter/sec",
            "range": "stddev: 0.00024819860535864796",
            "extra": "mean: 2.4027436260866515 msec\nrounds: 230"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1525.6569127911023,
            "unit": "iter/sec",
            "range": "stddev: 0.00006727109441098325",
            "extra": "mean: 655.4553593380028 usec\nrounds: 846"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2033.5969757846526,
            "unit": "iter/sec",
            "range": "stddev: 0.00004651644339260158",
            "extra": "mean: 491.7395196332624 usec\nrounds: 764"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1426.0225467961563,
            "unit": "iter/sec",
            "range": "stddev: 0.00008958420967295353",
            "extra": "mean: 701.2511844547614 usec\nrounds: 862"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2034.4284698319884,
            "unit": "iter/sec",
            "range": "stddev: 0.000024459989258337337",
            "extra": "mean: 491.538540100446 usec\nrounds: 798"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 641.5202902224399,
            "unit": "iter/sec",
            "range": "stddev: 0.0004235879398897685",
            "extra": "mean: 1.5587971498972564 msec\nrounds: 487"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1019.4124350396104,
            "unit": "iter/sec",
            "range": "stddev: 0.00003204682415374569",
            "extra": "mean: 980.9572314675012 usec\nrounds: 661"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 887.1198260307323,
            "unit": "iter/sec",
            "range": "stddev: 0.00010490028702291817",
            "extra": "mean: 1.1272434350546883 msec\nrounds: 639"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1023.3888697862723,
            "unit": "iter/sec",
            "range": "stddev: 0.00003104029207264547",
            "extra": "mean: 977.1456672270074 usec\nrounds: 595"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 809.3843361569916,
            "unit": "iter/sec",
            "range": "stddev: 0.00011281310639463802",
            "extra": "mean: 1.2355069839231925 msec\nrounds: 622"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1020.7951956869149,
            "unit": "iter/sec",
            "range": "stddev: 0.00002995325347457437",
            "extra": "mean: 979.6284349938369 usec\nrounds: 823"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1591.3035966067205,
            "unit": "iter/sec",
            "range": "stddev: 0.00007111382083857079",
            "extra": "mean: 628.4155972074655 usec\nrounds: 931"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2042.939741604227,
            "unit": "iter/sec",
            "range": "stddev: 0.000019342770230031172",
            "extra": "mean: 489.4906979560473 usec\nrounds: 1321"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 690.1901405424125,
            "unit": "iter/sec",
            "range": "stddev: 0.00036116341417042475",
            "extra": "mean: 1.448876101322038 msec\nrounds: 454"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 813.6290150128992,
            "unit": "iter/sec",
            "range": "stddev: 0.0003339561290482866",
            "extra": "mean: 1.2290613800002523 msec\nrounds: 450"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1581.1965856370675,
            "unit": "iter/sec",
            "range": "stddev: 0.00006688804917602468",
            "extra": "mean: 632.4324306563676 usec\nrounds: 959"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2063.334474361722,
            "unit": "iter/sec",
            "range": "stddev: 0.000020931996183511495",
            "extra": "mean: 484.6523975756974 usec\nrounds: 825"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1495.677039311886,
            "unit": "iter/sec",
            "range": "stddev: 0.00007335474538664581",
            "extra": "mean: 668.5935357141464 usec\nrounds: 812"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2008.4522532652138,
            "unit": "iter/sec",
            "range": "stddev: 0.00009310761379312788",
            "extra": "mean: 497.89582917605514 usec\nrounds: 1323"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 205.65220950765485,
            "unit": "iter/sec",
            "range": "stddev: 0.0008078163432107983",
            "extra": "mean: 4.86257843956098 msec\nrounds: 182"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 537.286011509744,
            "unit": "iter/sec",
            "range": "stddev: 0.000041524223131248156",
            "extra": "mean: 1.861206096153621 msec\nrounds: 364"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 831.2772670679144,
            "unit": "iter/sec",
            "range": "stddev: 0.00016386201871311916",
            "extra": "mean: 1.2029680584520317 msec\nrounds: 633"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1390.9930833941523,
            "unit": "iter/sec",
            "range": "stddev: 0.000028190022697300205",
            "extra": "mean: 718.910835674256 usec\nrounds: 712"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 947.9549591683784,
            "unit": "iter/sec",
            "range": "stddev: 0.0000669227296269677",
            "extra": "mean: 1.054902440594097 msec\nrounds: 606"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1046.9513666817,
            "unit": "iter/sec",
            "range": "stddev: 0.00006016853127222843",
            "extra": "mean: 955.1542046976722 usec\nrounds: 596"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 3662.5591861715584,
            "unit": "iter/sec",
            "range": "stddev: 0.000069920649986849",
            "extra": "mean: 273.0331304339388 usec\nrounds: 92"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 31569.44510090989,
            "unit": "iter/sec",
            "range": "stddev: 0.000010905017302509983",
            "extra": "mean: 31.676198197451946 usec\nrounds: 111"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4562.733143091229,
            "unit": "iter/sec",
            "range": "stddev: 0.000063951142648326",
            "extra": "mean: 219.16688279571505 usec\nrounds: 1860"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 48791.3692281844,
            "unit": "iter/sec",
            "range": "stddev: 0.000007908612412769647",
            "extra": "mean: 20.495428101705098 usec\nrounds: 9124"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 83161.61519527003,
            "unit": "iter/sec",
            "range": "stddev: 0.00001728223718185932",
            "extra": "mean: 12.024778470835628 usec\nrounds: 22286"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 481995.2215633491,
            "unit": "iter/sec",
            "range": "stddev: 4.54956309224901e-7",
            "extra": "mean: 2.074709364869853 usec\nrounds: 37566"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 215596.23170722253,
            "unit": "iter/sec",
            "range": "stddev: 6.838536795522361e-7",
            "extra": "mean: 4.638299992914485 usec\nrounds: 42081"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 511082.40438546625,
            "unit": "iter/sec",
            "range": "stddev: 4.4097837842395377e-7",
            "extra": "mean: 1.9566316339972927 usec\nrounds: 54511"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1795.8522918888136,
            "unit": "iter/sec",
            "range": "stddev: 0.00007121061737795619",
            "extra": "mean: 556.8386690356564 usec\nrounds: 985"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1031.8882353809315,
            "unit": "iter/sec",
            "range": "stddev: 0.000032126934830147175",
            "extra": "mean: 969.0972003676738 usec\nrounds: 544"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 703.1529040360834,
            "unit": "iter/sec",
            "range": "stddev: 0.00039133385884789",
            "extra": "mean: 1.422165782520445 msec\nrounds: 492"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 579.1757649300472,
            "unit": "iter/sec",
            "range": "stddev: 0.0005601086712425317",
            "extra": "mean: 1.726591581608702 msec\nrounds: 435"
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
        "date": 1772048446201,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1517.513729142307,
            "unit": "iter/sec",
            "range": "stddev: 0.0001837605782101156",
            "extra": "mean: 658.9726213318652 usec\nrounds: 375"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2175.5971162548412,
            "unit": "iter/sec",
            "range": "stddev: 0.00005375506241554137",
            "extra": "mean: 459.64392604152715 usec\nrounds: 960"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 1067.1111264190124,
            "unit": "iter/sec",
            "range": "stddev: 0.0001508581461883116",
            "extra": "mean: 937.1095242496228 usec\nrounds: 866"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2177.3020614635816,
            "unit": "iter/sec",
            "range": "stddev: 0.000034640335374187196",
            "extra": "mean: 459.2840000012678 usec\nrounds: 1027"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 993.4874271454638,
            "unit": "iter/sec",
            "range": "stddev: 0.0011694705596961054",
            "extra": "mean: 1.0065552644921218 msec\nrounds: 828"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2089.8942798634807,
            "unit": "iter/sec",
            "range": "stddev: 0.0001032819150418423",
            "extra": "mean: 478.4931035197261 usec\nrounds: 966"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1380.856472234345,
            "unit": "iter/sec",
            "range": "stddev: 0.00008871176131728174",
            "extra": "mean: 724.1882267328723 usec\nrounds: 591"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1064.3501858976654,
            "unit": "iter/sec",
            "range": "stddev: 0.00007743538686458269",
            "extra": "mean: 939.5404005652586 usec\nrounds: 1061"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 355.3901323167226,
            "unit": "iter/sec",
            "range": "stddev: 0.00017032543502627732",
            "extra": "mean: 2.813809132744302 msec\nrounds: 226"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 864.3369834944561,
            "unit": "iter/sec",
            "range": "stddev: 0.00010682279008155185",
            "extra": "mean: 1.1569561630431078 msec\nrounds: 460"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 796.0351837700151,
            "unit": "iter/sec",
            "range": "stddev: 0.00011892512299321828",
            "extra": "mean: 1.2562258809516553 msec\nrounds: 714"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1934.5098939833254,
            "unit": "iter/sec",
            "range": "stddev: 0.00009193296882875131",
            "extra": "mean: 516.9267953139864 usec\nrounds: 811"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1257.6524101989526,
            "unit": "iter/sec",
            "range": "stddev: 0.00008659519084581892",
            "extra": "mean: 795.1322574429022 usec\nrounds: 571"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1103.7376984764865,
            "unit": "iter/sec",
            "range": "stddev: 0.000032945506354170545",
            "extra": "mean: 906.0123627020461 usec\nrounds: 681"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1355.384285503374,
            "unit": "iter/sec",
            "range": "stddev: 0.00008832320048136502",
            "extra": "mean: 737.7981364367166 usec\nrounds: 623"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2140.8473939795135,
            "unit": "iter/sec",
            "range": "stddev: 0.00003811890468745008",
            "extra": "mean: 467.1047561877591 usec\nrounds: 808"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 762.4729311401786,
            "unit": "iter/sec",
            "range": "stddev: 0.00011309523828923779",
            "extra": "mean: 1.311521969054863 msec\nrounds: 614"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1088.367615538935,
            "unit": "iter/sec",
            "range": "stddev: 0.0002507336107058853",
            "extra": "mean: 918.8071987099896 usec\nrounds: 775"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 34987.44706400241,
            "unit": "iter/sec",
            "range": "stddev: 0.00002208319384683751",
            "extra": "mean: 28.5816795426858 usec\nrounds: 12504"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 66128.20992754954,
            "unit": "iter/sec",
            "range": "stddev: 0.000001033454228932858",
            "extra": "mean: 15.122139266972537 usec\nrounds: 18224"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 655.0538124449929,
            "unit": "iter/sec",
            "range": "stddev: 0.00011654657178821457",
            "extra": "mean: 1.5265921379306122 msec\nrounds: 464"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1881.7465224605726,
            "unit": "iter/sec",
            "range": "stddev: 0.0001699306825607245",
            "extra": "mean: 531.4212026242511 usec\nrounds: 686"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 19.024166684303722,
            "unit": "iter/sec",
            "range": "stddev: 0.0008398296936732512",
            "extra": "mean: 52.56472026315195 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 450.6867177023662,
            "unit": "iter/sec",
            "range": "stddev: 0.0004002129542382007",
            "extra": "mean: 2.218836190909004 msec\nrounds: 220"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1539.8511223602213,
            "unit": "iter/sec",
            "range": "stddev: 0.00007633662544934262",
            "extra": "mean: 649.4134306096037 usec\nrounds: 771"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2124.1283363662055,
            "unit": "iter/sec",
            "range": "stddev: 0.000022816163168652743",
            "extra": "mean: 470.78134728465733 usec\nrounds: 884"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1520.7890139304916,
            "unit": "iter/sec",
            "range": "stddev: 0.0000797410375785849",
            "extra": "mean: 657.5534086845432 usec\nrounds: 783"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2234.8479497533467,
            "unit": "iter/sec",
            "range": "stddev: 0.00001686008595276476",
            "extra": "mean: 447.45773425452364 usec\nrounds: 651"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 719.4728988952259,
            "unit": "iter/sec",
            "range": "stddev: 0.00013898040341743588",
            "extra": "mean: 1.389906418345337 msec\nrounds: 447"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1065.5121660531186,
            "unit": "iter/sec",
            "range": "stddev: 0.00007127188072475523",
            "extra": "mean: 938.5157972472624 usec\nrounds: 799"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 944.2799586107361,
            "unit": "iter/sec",
            "range": "stddev: 0.00010293343067135291",
            "extra": "mean: 1.0590079677972213 msec\nrounds: 590"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1069.9676104543119,
            "unit": "iter/sec",
            "range": "stddev: 0.00003114374945750204",
            "extra": "mean: 934.6077303923215 usec\nrounds: 612"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 900.3895453651068,
            "unit": "iter/sec",
            "range": "stddev: 0.00010371056321139093",
            "extra": "mean: 1.110630398973037 msec\nrounds: 584"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1067.0085948207484,
            "unit": "iter/sec",
            "range": "stddev: 0.000022137020335954842",
            "extra": "mean: 937.1995735123338 usec\nrounds: 823"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1684.6065734146405,
            "unit": "iter/sec",
            "range": "stddev: 0.00006721780542667916",
            "extra": "mean: 593.6104107518908 usec\nrounds: 930"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2119.9239536674627,
            "unit": "iter/sec",
            "range": "stddev: 0.000023574758978250336",
            "extra": "mean: 471.71503405582195 usec\nrounds: 1292"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 809.1452851455975,
            "unit": "iter/sec",
            "range": "stddev: 0.00011889038651740758",
            "extra": "mean: 1.2358719977217194 msec\nrounds: 439"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 1044.5586686403492,
            "unit": "iter/sec",
            "range": "stddev: 0.0003786129793945504",
            "extra": "mean: 957.3421101388694 usec\nrounds: 572"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1666.396907375214,
            "unit": "iter/sec",
            "range": "stddev: 0.00007282967940398933",
            "extra": "mean: 600.0971290658038 usec\nrounds: 953"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2159.2740979379623,
            "unit": "iter/sec",
            "range": "stddev: 0.000024441121242497052",
            "extra": "mean: 463.1186012720516 usec\nrounds: 785"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1592.4800660245792,
            "unit": "iter/sec",
            "range": "stddev: 0.00007436731515096622",
            "extra": "mean: 627.9513454107912 usec\nrounds: 828"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2204.2600244978703,
            "unit": "iter/sec",
            "range": "stddev: 0.00002163358504685498",
            "extra": "mean: 453.66698524045484 usec\nrounds: 1355"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 242.49218762548318,
            "unit": "iter/sec",
            "range": "stddev: 0.0005993276633934469",
            "extra": "mean: 4.123844193877491 msec\nrounds: 196"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 559.4300493259113,
            "unit": "iter/sec",
            "range": "stddev: 0.000048057874936357804",
            "extra": "mean: 1.7875335820894072 msec\nrounds: 335"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 879.71694420968,
            "unit": "iter/sec",
            "range": "stddev: 0.00014251516789381863",
            "extra": "mean: 1.1367292702295053 msec\nrounds: 655"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1933.809625098458,
            "unit": "iter/sec",
            "range": "stddev: 0.00009783966040627216",
            "extra": "mean: 517.1139842419008 usec\nrounds: 698"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 1022.2232798825471,
            "unit": "iter/sec",
            "range": "stddev: 0.00006688685883306549",
            "extra": "mean: 978.2598573913317 usec\nrounds: 575"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1103.855174542951,
            "unit": "iter/sec",
            "range": "stddev: 0.00006816185734713637",
            "extra": "mean: 905.9159417484707 usec\nrounds: 618"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 6677.499363687949,
            "unit": "iter/sec",
            "range": "stddev: 0.00005828135088178254",
            "extra": "mean: 149.75665972174724 usec\nrounds: 144"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 59234.80479747743,
            "unit": "iter/sec",
            "range": "stddev: 0.0000052492188374799705",
            "extra": "mean: 16.881966665020325 usec\nrounds: 180"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 5188.91412073215,
            "unit": "iter/sec",
            "range": "stddev: 0.00006036286102620081",
            "extra": "mean: 192.71854895507522 usec\nrounds: 2727"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 63922.92831298926,
            "unit": "iter/sec",
            "range": "stddev: 0.0000016153889453705596",
            "extra": "mean: 15.643839016630253 usec\nrounds: 10206"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 93102.55254558605,
            "unit": "iter/sec",
            "range": "stddev: 0.000016373124962306874",
            "extra": "mean: 10.740844076325054 usec\nrounds: 21626"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 503023.9877768347,
            "unit": "iter/sec",
            "range": "stddev: 5.757467456391153e-7",
            "extra": "mean: 1.9879767651232714 usec\nrounds: 37616"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 229567.15006181248,
            "unit": "iter/sec",
            "range": "stddev: 7.695158286194083e-7",
            "extra": "mean: 4.356023933436223 usec\nrounds: 44791"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 567105.6112041901,
            "unit": "iter/sec",
            "range": "stddev: 5.418112330705055e-7",
            "extra": "mean: 1.7633399850807392 usec\nrounds: 53620"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1970.6148937577218,
            "unit": "iter/sec",
            "range": "stddev: 0.00010097221150580745",
            "extra": "mean: 507.4558216157203 usec\nrounds: 953"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1116.8568558369,
            "unit": "iter/sec",
            "range": "stddev: 0.000021710940172767937",
            "extra": "mean: 895.3698898599365 usec\nrounds: 572"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 892.1625519093559,
            "unit": "iter/sec",
            "range": "stddev: 0.00009981445753875127",
            "extra": "mean: 1.1208719732293813 msec\nrounds: 523"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 743.4127604918929,
            "unit": "iter/sec",
            "range": "stddev: 0.00006582209822623537",
            "extra": "mean: 1.3451477471792808 msec\nrounds: 443"
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
        "date": 1772048602506,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1465.5389438204063,
            "unit": "iter/sec",
            "range": "stddev: 0.00007525691785053222",
            "extra": "mean: 682.342836549381 usec\nrounds: 881"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2071.262123314942,
            "unit": "iter/sec",
            "range": "stddev: 0.000020333706452355534",
            "extra": "mean: 482.79741551955505 usec\nrounds: 799"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 974.4279434947813,
            "unit": "iter/sec",
            "range": "stddev: 0.0006046233941220308",
            "extra": "mean: 1.0262431477626808 msec\nrounds: 961"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2059.0700723620153,
            "unit": "iter/sec",
            "range": "stddev: 0.000032598868153791106",
            "extra": "mean: 485.65612866825495 usec\nrounds: 886"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1075.0630394180032,
            "unit": "iter/sec",
            "range": "stddev: 0.00007613245241632495",
            "extra": "mean: 930.1780112739814 usec\nrounds: 887"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2077.3571292516926,
            "unit": "iter/sec",
            "range": "stddev: 0.000018998830549756147",
            "extra": "mean: 481.3808785782639 usec\nrounds: 1013"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1360.0451688659864,
            "unit": "iter/sec",
            "range": "stddev: 0.00008157524075989384",
            "extra": "mean: 735.2696975746811 usec\nrounds: 701"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1041.4025446912162,
            "unit": "iter/sec",
            "range": "stddev: 0.00002291513729717879",
            "extra": "mean: 960.2434765477816 usec\nrounds: 1066"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 341.37737316566046,
            "unit": "iter/sec",
            "range": "stddev: 0.00014208517738508974",
            "extra": "mean: 2.929309551851081 msec\nrounds: 270"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 854.0521913320563,
            "unit": "iter/sec",
            "range": "stddev: 0.00005497845816357732",
            "extra": "mean: 1.1708886296987429 msec\nrounds: 532"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 728.5871370120642,
            "unit": "iter/sec",
            "range": "stddev: 0.00010788736434190424",
            "extra": "mean: 1.3725194272588999 msec\nrounds: 653"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1443.003564315599,
            "unit": "iter/sec",
            "range": "stddev: 0.00006461743884516814",
            "extra": "mean: 692.9989812424955 usec\nrounds: 853"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1158.714365848069,
            "unit": "iter/sec",
            "range": "stddev: 0.00006469100169553006",
            "extra": "mean: 863.0254612128631 usec\nrounds: 709"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1033.6350781994877,
            "unit": "iter/sec",
            "range": "stddev: 0.000024097289326898604",
            "extra": "mean: 967.4594265337074 usec\nrounds: 701"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1335.7950501690038,
            "unit": "iter/sec",
            "range": "stddev: 0.00006103932699753407",
            "extra": "mean: 748.6178361519462 usec\nrounds: 946"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2066.910273277988,
            "unit": "iter/sec",
            "range": "stddev: 0.000021565836717017362",
            "extra": "mean: 483.8139385770548 usec\nrounds: 928"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 756.2617103466092,
            "unit": "iter/sec",
            "range": "stddev: 0.00010535008702227006",
            "extra": "mean: 1.3222935741936226 msec\nrounds: 620"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1032.631375901861,
            "unit": "iter/sec",
            "range": "stddev: 0.000027151135296069258",
            "extra": "mean: 968.3997826684648 usec\nrounds: 727"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27175.3272269376,
            "unit": "iter/sec",
            "range": "stddev: 0.000024672656248762475",
            "extra": "mean: 36.798084955854655 usec\nrounds: 14278"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46406.28592446627,
            "unit": "iter/sec",
            "range": "stddev: 0.000001870800699610433",
            "extra": "mean: 21.548804867247114 usec\nrounds: 20709"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 567.2697344198249,
            "unit": "iter/sec",
            "range": "stddev: 0.00023848409684357807",
            "extra": "mean: 1.7628298132681977 msec\nrounds: 407"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1872.8436623870002,
            "unit": "iter/sec",
            "range": "stddev: 0.00009483702786571885",
            "extra": "mean: 533.9473977905169 usec\nrounds: 724"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.985650834957077,
            "unit": "iter/sec",
            "range": "stddev: 0.00043357960618019926",
            "extra": "mean: 52.67135736841654 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 476.81369143979236,
            "unit": "iter/sec",
            "range": "stddev: 0.00042033696160794393",
            "extra": "mean: 2.0972552129960613 msec\nrounds: 277"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1595.125565068104,
            "unit": "iter/sec",
            "range": "stddev: 0.000059666215706061785",
            "extra": "mean: 626.9098946811156 usec\nrounds: 940"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2072.011193486987,
            "unit": "iter/sec",
            "range": "stddev: 0.000019606753317499124",
            "extra": "mean: 482.62287537023406 usec\nrounds: 1011"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1483.81414774095,
            "unit": "iter/sec",
            "range": "stddev: 0.00006348288430498113",
            "extra": "mean: 673.9388497693337 usec\nrounds: 1085"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2061.4277544466026,
            "unit": "iter/sec",
            "range": "stddev: 0.000017637445990508278",
            "extra": "mean: 485.10067735478486 usec\nrounds: 998"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 738.6228414446708,
            "unit": "iter/sec",
            "range": "stddev: 0.00013395859890452503",
            "extra": "mean: 1.3538709391170496 msec\nrounds: 657"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1047.0202319811506,
            "unit": "iter/sec",
            "range": "stddev: 0.000027902567246763695",
            "extra": "mean: 955.0913816706486 usec\nrounds: 993"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 895.9160562490882,
            "unit": "iter/sec",
            "range": "stddev: 0.00008652211952383249",
            "extra": "mean: 1.1161760000001313 msec\nrounds: 730"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1038.1529165173174,
            "unit": "iter/sec",
            "range": "stddev: 0.000019234068299037137",
            "extra": "mean: 963.2492324490031 usec\nrounds: 641"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 864.2622490115622,
            "unit": "iter/sec",
            "range": "stddev: 0.00008437258569851066",
            "extra": "mean: 1.1570562073533561 msec\nrounds: 680"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1034.3434151254228,
            "unit": "iter/sec",
            "range": "stddev: 0.00011479039057699904",
            "extra": "mean: 966.7968929630026 usec\nrounds: 1009"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1668.2662378417963,
            "unit": "iter/sec",
            "range": "stddev: 0.00005233950112058729",
            "extra": "mean: 599.424706510683 usec\nrounds: 1029"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2060.1647619610917,
            "unit": "iter/sec",
            "range": "stddev: 0.000018247523238444102",
            "extra": "mean: 485.3980703213708 usec\nrounds: 1806"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 692.052857761276,
            "unit": "iter/sec",
            "range": "stddev: 0.0007183516457763385",
            "extra": "mean: 1.4449763320606799 msec\nrounds: 524"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 920.3567797902373,
            "unit": "iter/sec",
            "range": "stddev: 0.0000895518379852185",
            "extra": "mean: 1.0865351589281653 msec\nrounds: 560"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1632.9059701896472,
            "unit": "iter/sec",
            "range": "stddev: 0.00009872881817190053",
            "extra": "mean: 612.4051343163741 usec\nrounds: 1221"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2103.5022238197616,
            "unit": "iter/sec",
            "range": "stddev: 0.00001562299471872187",
            "extra": "mean: 475.39764335694133 usec\nrounds: 858"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1477.1715505779573,
            "unit": "iter/sec",
            "range": "stddev: 0.00007646397820312648",
            "extra": "mean: 676.9694417745458 usec\nrounds: 1082"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2048.8440987187823,
            "unit": "iter/sec",
            "range": "stddev: 0.000017640560506614982",
            "extra": "mean: 488.0800840948986 usec\nrounds: 1641"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 212.9475160089025,
            "unit": "iter/sec",
            "range": "stddev: 0.0018049180564960582",
            "extra": "mean: 4.69599279081609 msec\nrounds: 196"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 547.8929428664984,
            "unit": "iter/sec",
            "range": "stddev: 0.00005751566915012567",
            "extra": "mean: 1.8251740837692514 msec\nrounds: 382"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 848.4139082747423,
            "unit": "iter/sec",
            "range": "stddev: 0.0001481950728055678",
            "extra": "mean: 1.1786699749341798 msec\nrounds: 758"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1497.3474516346546,
            "unit": "iter/sec",
            "range": "stddev: 0.00008716474182750792",
            "extra": "mean: 667.8476654889283 usec\nrounds: 849"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 958.997607601079,
            "unit": "iter/sec",
            "range": "stddev: 0.000057188286064177516",
            "extra": "mean: 1.0427554689124698 msec\nrounds: 772"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1075.3877586427677,
            "unit": "iter/sec",
            "range": "stddev: 0.00003661098688277733",
            "extra": "mean: 929.897138927903 usec\nrounds: 727"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5829.419129777134,
            "unit": "iter/sec",
            "range": "stddev: 0.00005158139297635766",
            "extra": "mean: 171.54367832155364 usec\nrounds: 143"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 46380.343776184964,
            "unit": "iter/sec",
            "range": "stddev: 0.0000034776685324127066",
            "extra": "mean: 21.56085786741134 usec\nrounds: 197"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4828.66801070741,
            "unit": "iter/sec",
            "range": "stddev: 0.0000559246570724959",
            "extra": "mean: 207.09644932775115 usec\nrounds: 2753"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 51381.72667621222,
            "unit": "iter/sec",
            "range": "stddev: 0.000002388212888934256",
            "extra": "mean: 19.462171956610437 usec\nrounds: 15312"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81420.66115349192,
            "unit": "iter/sec",
            "range": "stddev: 0.000017163510061765012",
            "extra": "mean: 12.28189486345276 usec\nrounds: 22000"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 519949.69963519496,
            "unit": "iter/sec",
            "range": "stddev: 5.172779968017978e-7",
            "extra": "mean: 1.9232629631320413 usec\nrounds: 47577"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 219698.26099740574,
            "unit": "iter/sec",
            "range": "stddev: 0.000004890285948694013",
            "extra": "mean: 4.551697384677106 usec\nrounds: 63817"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 524525.4820295237,
            "unit": "iter/sec",
            "range": "stddev: 4.012885376486914e-7",
            "extra": "mean: 1.9064850693826034 usec\nrounds: 41693"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1906.6004228170411,
            "unit": "iter/sec",
            "range": "stddev: 0.00006536512424673589",
            "extra": "mean: 524.4937471074718 usec\nrounds: 1210"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1028.6144064287034,
            "unit": "iter/sec",
            "range": "stddev: 0.00002609321371985372",
            "extra": "mean: 972.1816005590947 usec\nrounds: 716"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 804.548890702998,
            "unit": "iter/sec",
            "range": "stddev: 0.00009317561680550098",
            "extra": "mean: 1.2429325446291037 msec\nrounds: 661"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 655.3756141555536,
            "unit": "iter/sec",
            "range": "stddev: 0.00009801707832286819",
            "extra": "mean: 1.5258425525772608 msec\nrounds: 485"
          }
        ]
      }
    ]
  }
}