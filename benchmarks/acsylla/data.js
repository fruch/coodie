window.BENCHMARK_DATA = {
  "lastUpdate": 1772312277171,
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
        "date": 1772049175983,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1366.378553207217,
            "unit": "iter/sec",
            "range": "stddev: 0.0002145732664516196",
            "extra": "mean: 731.8616042770585 usec\nrounds: 561"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2063.455400666109,
            "unit": "iter/sec",
            "range": "stddev: 0.0000184536025713664",
            "extra": "mean: 484.62399510897467 usec\nrounds: 818"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 920.4227925477323,
            "unit": "iter/sec",
            "range": "stddev: 0.0006783693242211733",
            "extra": "mean: 1.0864572325854704 msec\nrounds: 890"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2080.819287018901,
            "unit": "iter/sec",
            "range": "stddev: 0.00002538758089634712",
            "extra": "mean: 480.57993610423347 usec\nrounds: 986"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1071.1697180584804,
            "unit": "iter/sec",
            "range": "stddev: 0.00007807206875584689",
            "extra": "mean: 933.5588778709342 usec\nrounds: 958"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2096.016940225524,
            "unit": "iter/sec",
            "range": "stddev: 0.000020288655721084672",
            "extra": "mean: 477.095380675885 usec\nrounds: 1035"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1348.838116632142,
            "unit": "iter/sec",
            "range": "stddev: 0.00007414370360932457",
            "extra": "mean: 741.3788116374251 usec\nrounds: 653"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1039.698350861754,
            "unit": "iter/sec",
            "range": "stddev: 0.00002971357100404663",
            "extra": "mean: 961.8174340385841 usec\nrounds: 993"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 329.6553733654116,
            "unit": "iter/sec",
            "range": "stddev: 0.00018131364818716142",
            "extra": "mean: 3.0334709542002054 msec\nrounds: 262"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 869.2753943988514,
            "unit": "iter/sec",
            "range": "stddev: 0.000048029841348253826",
            "extra": "mean: 1.1503834186996071 msec\nrounds: 492"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 734.9293065586835,
            "unit": "iter/sec",
            "range": "stddev: 0.00011888472870247307",
            "extra": "mean: 1.360675089530058 msec\nrounds: 659"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1483.0258157958735,
            "unit": "iter/sec",
            "range": "stddev: 0.00007190254740529937",
            "extra": "mean: 674.2970954037943 usec\nrounds: 870"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1192.9651113312675,
            "unit": "iter/sec",
            "range": "stddev: 0.00007305254705808406",
            "extra": "mean: 838.2474814238853 usec\nrounds: 646"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1045.575751703445,
            "unit": "iter/sec",
            "range": "stddev: 0.000018020294288903996",
            "extra": "mean: 956.4108562873677 usec\nrounds: 668"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1325.677002928398,
            "unit": "iter/sec",
            "range": "stddev: 0.00006463086251784166",
            "extra": "mean: 754.3315587364168 usec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2022.3632878494361,
            "unit": "iter/sec",
            "range": "stddev: 0.000022210347838956402",
            "extra": "mean: 494.47100133200667 usec\nrounds: 750"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 736.9426034406953,
            "unit": "iter/sec",
            "range": "stddev: 0.0001049627225556626",
            "extra": "mean: 1.3569577811502846 msec\nrounds: 626"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1041.531711282909,
            "unit": "iter/sec",
            "range": "stddev: 0.000022895448610423515",
            "extra": "mean: 960.1243909974162 usec\nrounds: 711"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26894.52619365739,
            "unit": "iter/sec",
            "range": "stddev: 0.000025448512691274615",
            "extra": "mean: 37.182287310041275 usec\nrounds: 10386"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46480.645602157434,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019470411447578187",
            "extra": "mean: 21.51433111663974 usec\nrounds: 18498"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 596.6583905704443,
            "unit": "iter/sec",
            "range": "stddev: 0.00009451052019431654",
            "extra": "mean: 1.6760009006894794 msec\nrounds: 433"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1754.5621160517273,
            "unit": "iter/sec",
            "range": "stddev: 0.00016870460035038395",
            "extra": "mean: 569.942774240612 usec\nrounds: 691"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.743410340997972,
            "unit": "iter/sec",
            "range": "stddev: 0.0006937762567577873",
            "extra": "mean: 53.35208384211025 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 503.82465123451976,
            "unit": "iter/sec",
            "range": "stddev: 0.00027830525341537393",
            "extra": "mean: 1.9848175303643907 msec\nrounds: 247"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1392.058323499551,
            "unit": "iter/sec",
            "range": "stddev: 0.00023403171964346355",
            "extra": "mean: 718.3607059552361 usec\nrounds: 806"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2042.8914951266145,
            "unit": "iter/sec",
            "range": "stddev: 0.000017191836668000803",
            "extra": "mean: 489.5022581402552 usec\nrounds: 860"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1526.041742575589,
            "unit": "iter/sec",
            "range": "stddev: 0.00006096411752414444",
            "extra": "mean: 655.2900697934003 usec\nrounds: 874"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2097.602751101088,
            "unit": "iter/sec",
            "range": "stddev: 0.00001745126075060178",
            "extra": "mean: 476.7346912922731 usec\nrounds: 758"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 761.5735060085475,
            "unit": "iter/sec",
            "range": "stddev: 0.00008986238602395515",
            "extra": "mean: 1.3130708882469666 msec\nrounds: 519"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1037.8721388885783,
            "unit": "iter/sec",
            "range": "stddev: 0.000022435732342853496",
            "extra": "mean: 963.5098221933829 usec\nrounds: 793"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 960.648857561155,
            "unit": "iter/sec",
            "range": "stddev: 0.00007236447441441221",
            "extra": "mean: 1.0409630866982424 msec\nrounds: 669"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1040.0706730248517,
            "unit": "iter/sec",
            "range": "stddev: 0.000022084433495270154",
            "extra": "mean: 961.4731247941896 usec\nrounds: 609"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 882.5018350548645,
            "unit": "iter/sec",
            "range": "stddev: 0.0000822236328578166",
            "extra": "mean: 1.1331421196850324 msec\nrounds: 635"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1035.4263910372374,
            "unit": "iter/sec",
            "range": "stddev: 0.000023384297135537534",
            "extra": "mean: 965.7856981974845 usec\nrounds: 888"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1655.808851302593,
            "unit": "iter/sec",
            "range": "stddev: 0.00005886321199238992",
            "extra": "mean: 603.9344452189147 usec\nrounds: 1004"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2068.6682749068286,
            "unit": "iter/sec",
            "range": "stddev: 0.000018774315703236685",
            "extra": "mean: 483.4027824229282 usec\nrounds: 1411"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 622.5854226771656,
            "unit": "iter/sec",
            "range": "stddev: 0.0004381977571796574",
            "extra": "mean: 1.6062052909943225 msec\nrounds: 433"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 725.4421520215194,
            "unit": "iter/sec",
            "range": "stddev: 0.0003226061431671621",
            "extra": "mean: 1.378469664622323 msec\nrounds: 489"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1657.9831695604005,
            "unit": "iter/sec",
            "range": "stddev: 0.00006531878376407532",
            "extra": "mean: 603.1424313342947 usec\nrounds: 1034"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 1962.5927081742598,
            "unit": "iter/sec",
            "range": "stddev: 0.00011798618786305347",
            "extra": "mean: 509.5300700114541 usec\nrounds: 857"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1516.4422541783008,
            "unit": "iter/sec",
            "range": "stddev: 0.00006790323397305778",
            "extra": "mean: 659.4382326426665 usec\nrounds: 821"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2102.242999043518,
            "unit": "iter/sec",
            "range": "stddev: 0.00001770110066617919",
            "extra": "mean: 475.6824022983934 usec\nrounds: 1392"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 217.80362049382066,
            "unit": "iter/sec",
            "range": "stddev: 0.0005926164317296756",
            "extra": "mean: 4.5912919065933115 msec\nrounds: 182"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 555.7813256287491,
            "unit": "iter/sec",
            "range": "stddev: 0.00005495162021535879",
            "extra": "mean: 1.7992688021115344 msec\nrounds: 379"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 887.3764700876034,
            "unit": "iter/sec",
            "range": "stddev: 0.0001501626830815462",
            "extra": "mean: 1.1269174174758974 msec\nrounds: 618"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1424.3935789971881,
            "unit": "iter/sec",
            "range": "stddev: 0.000026019831118277447",
            "extra": "mean: 702.0531507197802 usec\nrounds: 763"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 982.2105222392684,
            "unit": "iter/sec",
            "range": "stddev: 0.000047849574502201144",
            "extra": "mean: 1.01811167500036 msec\nrounds: 600"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1048.8249712557756,
            "unit": "iter/sec",
            "range": "stddev: 0.00003544506004833907",
            "extra": "mean: 953.4479321203454 usec\nrounds: 604"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5768.769620580974,
            "unit": "iter/sec",
            "range": "stddev: 0.00004594644368499354",
            "extra": "mean: 173.3471893958715 usec\nrounds: 132"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 43863.27524632899,
            "unit": "iter/sec",
            "range": "stddev: 0.000005354268044401152",
            "extra": "mean: 22.798115151779324 usec\nrounds: 165"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4404.902791427427,
            "unit": "iter/sec",
            "range": "stddev: 0.0005557682501668238",
            "extra": "mean: 227.0197657814705 usec\nrounds: 2788"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 47530.67382932602,
            "unit": "iter/sec",
            "range": "stddev: 0.000013415495477981412",
            "extra": "mean: 21.039045303477447 usec\nrounds: 7218"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 82454.54533191455,
            "unit": "iter/sec",
            "range": "stddev: 0.000017686601066512073",
            "extra": "mean: 12.127894174597355 usec\nrounds: 25098"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 485469.49937551026,
            "unit": "iter/sec",
            "range": "stddev: 4.2587762060914093e-7",
            "extra": "mean: 2.0598616417434306 usec\nrounds: 38899"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 221127.22538732813,
            "unit": "iter/sec",
            "range": "stddev: 6.237869348795964e-7",
            "extra": "mean: 4.522283487473748 usec\nrounds: 46316"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 512042.1427968825,
            "unit": "iter/sec",
            "range": "stddev: 4.189943809549841e-7",
            "extra": "mean: 1.952964251219223 usec\nrounds: 37148"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1917.9037128077862,
            "unit": "iter/sec",
            "range": "stddev: 0.000067652693601016",
            "extra": "mean: 521.4026091727061 usec\nrounds: 1003"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1022.8469137293849,
            "unit": "iter/sec",
            "range": "stddev: 0.00002691351641376058",
            "extra": "mean: 977.6634084507493 usec\nrounds: 568"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 602.0410764763267,
            "unit": "iter/sec",
            "range": "stddev: 0.0009820203147879606",
            "extra": "mean: 1.6610162314054693 msec\nrounds: 484"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 533.4789987630502,
            "unit": "iter/sec",
            "range": "stddev: 0.00028719445574243755",
            "extra": "mean: 1.8744880348029587 msec\nrounds: 431"
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
        "date": 1772052377455,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1413.1923502472227,
            "unit": "iter/sec",
            "range": "stddev: 0.0001229187698479311",
            "extra": "mean: 707.6177562276365 usec\nrounds: 562"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2076.359434817097,
            "unit": "iter/sec",
            "range": "stddev: 0.00002254391097245365",
            "extra": "mean: 481.6121829542911 usec\nrounds: 880"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 863.7590181603583,
            "unit": "iter/sec",
            "range": "stddev: 0.0009302710588529338",
            "extra": "mean: 1.1577303147929026 msec\nrounds: 845"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2050.8244791261845,
            "unit": "iter/sec",
            "range": "stddev: 0.00003582695087041851",
            "extra": "mean: 487.60876914541217 usec\nrounds: 901"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1042.332630820897,
            "unit": "iter/sec",
            "range": "stddev: 0.00010844148495900224",
            "extra": "mean: 959.3866395724772 usec\nrounds: 935"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2062.8911093318397,
            "unit": "iter/sec",
            "range": "stddev: 0.000024343158051925636",
            "extra": "mean: 484.75656105953897 usec\nrounds: 868"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1302.9570973641364,
            "unit": "iter/sec",
            "range": "stddev: 0.00009051392132316108",
            "extra": "mean: 767.4849786097989 usec\nrounds: 561"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1030.144621163517,
            "unit": "iter/sec",
            "range": "stddev: 0.000027083258943437",
            "extra": "mean: 970.7374862284194 usec\nrounds: 944"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 320.4627130754362,
            "unit": "iter/sec",
            "range": "stddev: 0.0002569723266322797",
            "extra": "mean: 3.120487842105369 msec\nrounds: 247"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 853.597794225434,
            "unit": "iter/sec",
            "range": "stddev: 0.00007408844797248287",
            "extra": "mean: 1.1715119307535389 msec\nrounds: 491"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 717.0288658376345,
            "unit": "iter/sec",
            "range": "stddev: 0.00015679672395800233",
            "extra": "mean: 1.3946439922356515 msec\nrounds: 644"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1427.6125186154263,
            "unit": "iter/sec",
            "range": "stddev: 0.000031109096264180766",
            "extra": "mean: 700.4701814816337 usec\nrounds: 810"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1119.4637657289227,
            "unit": "iter/sec",
            "range": "stddev: 0.00010052308816446823",
            "extra": "mean: 893.2848303034306 usec\nrounds: 495"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1031.7646493655825,
            "unit": "iter/sec",
            "range": "stddev: 0.000031917917573080586",
            "extra": "mean: 969.2132800003235 usec\nrounds: 575"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1258.3235544653185,
            "unit": "iter/sec",
            "range": "stddev: 0.00009362144351753767",
            "extra": "mean: 794.7081626592582 usec\nrounds: 707"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2012.049733153231,
            "unit": "iter/sec",
            "range": "stddev: 0.00003231216898208067",
            "extra": "mean: 497.00560752682117 usec\nrounds: 744"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 700.3786916485274,
            "unit": "iter/sec",
            "range": "stddev: 0.00013209827681811016",
            "extra": "mean: 1.427799006343603 msec\nrounds: 473"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1024.9411080894859,
            "unit": "iter/sec",
            "range": "stddev: 0.000025272654747449923",
            "extra": "mean: 975.6658134866143 usec\nrounds: 697"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27101.91607143915,
            "unit": "iter/sec",
            "range": "stddev: 0.000026202512551326825",
            "extra": "mean: 36.897760193930765 usec\nrounds: 11968"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46780.91647747179,
            "unit": "iter/sec",
            "range": "stddev: 0.000002696348303279986",
            "extra": "mean: 21.376237904222513 usec\nrounds: 18188"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 573.6006772122719,
            "unit": "iter/sec",
            "range": "stddev: 0.0001247545143723744",
            "extra": "mean: 1.7433731160500896 msec\nrounds: 405"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1607.6145508812506,
            "unit": "iter/sec",
            "range": "stddev: 0.000171801855156754",
            "extra": "mean: 622.0396546248148 usec\nrounds: 692"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.445295835720277,
            "unit": "iter/sec",
            "range": "stddev: 0.0008227588981597571",
            "extra": "mean: 54.21436494737308 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 486.6058659679398,
            "unit": "iter/sec",
            "range": "stddev: 0.0002092162147318298",
            "extra": "mean: 2.0550512641495478 msec\nrounds: 212"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1499.1841612285518,
            "unit": "iter/sec",
            "range": "stddev: 0.00008653526422899674",
            "extra": "mean: 667.0294589962314 usec\nrounds: 756"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2055.51220215627,
            "unit": "iter/sec",
            "range": "stddev: 0.00002072311298445747",
            "extra": "mean: 486.4967471129491 usec\nrounds: 866"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1471.9173991498722,
            "unit": "iter/sec",
            "range": "stddev: 0.00008389938800448778",
            "extra": "mean: 679.3859496311171 usec\nrounds: 814"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2046.0246288294486,
            "unit": "iter/sec",
            "range": "stddev: 0.000018987360788779443",
            "extra": "mean: 488.75266988946765 usec\nrounds: 724"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 722.2564983957951,
            "unit": "iter/sec",
            "range": "stddev: 0.00016504525290785875",
            "extra": "mean: 1.3845496748331116 msec\nrounds: 449"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1013.3950574507822,
            "unit": "iter/sec",
            "range": "stddev: 0.000056576269949415464",
            "extra": "mean: 986.7819984395051 usec\nrounds: 641"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 871.6802246492933,
            "unit": "iter/sec",
            "range": "stddev: 0.00011457657466159067",
            "extra": "mean: 1.1472096896569313 msec\nrounds: 406"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1039.9165894107764,
            "unit": "iter/sec",
            "range": "stddev: 0.0000510599412528035",
            "extra": "mean: 961.6155855024936 usec\nrounds: 538"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 824.2754570660298,
            "unit": "iter/sec",
            "range": "stddev: 0.00011867628358124353",
            "extra": "mean: 1.2131866737358084 msec\nrounds: 613"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1034.3174265333976,
            "unit": "iter/sec",
            "range": "stddev: 0.00002374255522189207",
            "extra": "mean: 966.8211850124044 usec\nrounds: 854"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1553.5523533109324,
            "unit": "iter/sec",
            "range": "stddev: 0.00008213675116492982",
            "extra": "mean: 643.68606430855 usec\nrounds: 933"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2077.0738032815334,
            "unit": "iter/sec",
            "range": "stddev: 0.00001944586146537558",
            "extra": "mean: 481.44654196693307 usec\nrounds: 1251"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 725.442041306858,
            "unit": "iter/sec",
            "range": "stddev: 0.0003126701218426249",
            "extra": "mean: 1.378469874999987 msec\nrounds: 424"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 826.5283111583238,
            "unit": "iter/sec",
            "range": "stddev: 0.00046934425159640534",
            "extra": "mean: 1.2098799115526573 msec\nrounds: 554"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1587.7211609053923,
            "unit": "iter/sec",
            "range": "stddev: 0.00007965089126184959",
            "extra": "mean: 629.8335152437936 usec\nrounds: 984"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2067.4359750787526,
            "unit": "iter/sec",
            "range": "stddev: 0.00002291472620947657",
            "extra": "mean: 483.69091573048985 usec\nrounds: 890"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1412.0975523019742,
            "unit": "iter/sec",
            "range": "stddev: 0.0001014088304880508",
            "extra": "mean: 708.1663716290841 usec\nrounds: 853"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2056.686552260253,
            "unit": "iter/sec",
            "range": "stddev: 0.000018598439028110548",
            "extra": "mean: 486.21896170859 usec\nrounds: 1358"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 205.72527953143887,
            "unit": "iter/sec",
            "range": "stddev: 0.0005906222855938386",
            "extra": "mean: 4.860851336683591 msec\nrounds: 199"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 538.1418584892899,
            "unit": "iter/sec",
            "range": "stddev: 0.00005384701367694893",
            "extra": "mean: 1.858246081818038 msec\nrounds: 330"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 858.2450483968893,
            "unit": "iter/sec",
            "range": "stddev: 0.00013859752022814934",
            "extra": "mean: 1.1651683885248088 msec\nrounds: 610"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1405.612957100098,
            "unit": "iter/sec",
            "range": "stddev: 0.00005186871756223176",
            "extra": "mean: 711.433396333431 usec\nrounds: 709"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 937.0597576123811,
            "unit": "iter/sec",
            "range": "stddev: 0.00008806989910609005",
            "extra": "mean: 1.0671678000002798 msec\nrounds: 565"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1056.184753255331,
            "unit": "iter/sec",
            "range": "stddev: 0.000050101165108164594",
            "extra": "mean: 946.8040481722912 usec\nrounds: 602"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5564.386191209431,
            "unit": "iter/sec",
            "range": "stddev: 0.00007855500606894048",
            "extra": "mean: 179.71434146317728 usec\nrounds: 123"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 40561.43847708143,
            "unit": "iter/sec",
            "range": "stddev: 0.000007991745299996036",
            "extra": "mean: 24.653957984380497 usec\nrounds: 119"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4226.003753556559,
            "unit": "iter/sec",
            "range": "stddev: 0.0005975370718390449",
            "extra": "mean: 236.63017316499324 usec\nrounds: 3078"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 48258.294570677586,
            "unit": "iter/sec",
            "range": "stddev: 0.000012971108257078535",
            "extra": "mean: 20.72182634915603 usec\nrounds: 7302"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81038.56590338913,
            "unit": "iter/sec",
            "range": "stddev: 0.000018281878824669683",
            "extra": "mean: 12.339803757042779 usec\nrounds: 20974"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 479059.17012938595,
            "unit": "iter/sec",
            "range": "stddev: 5.071760821083286e-7",
            "extra": "mean: 2.0874248158738236 usec\nrounds: 37468"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 222501.3015728617,
            "unit": "iter/sec",
            "range": "stddev: 7.637480322296098e-7",
            "extra": "mean: 4.49435573154404 usec\nrounds: 46209"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 507123.25973625085,
            "unit": "iter/sec",
            "range": "stddev: 6.005561009541723e-7",
            "extra": "mean: 1.971907185878417 usec\nrounds: 33928"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1835.2383184806308,
            "unit": "iter/sec",
            "range": "stddev: 0.00008052510956623768",
            "extra": "mean: 544.8883613262209 usec\nrounds: 905"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1035.3844919456612,
            "unit": "iter/sec",
            "range": "stddev: 0.000027735403909380864",
            "extra": "mean: 965.8247808220809 usec\nrounds: 511"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 752.1099061908989,
            "unit": "iter/sec",
            "range": "stddev: 0.0003139480417832305",
            "extra": "mean: 1.3295929115793115 msec\nrounds: 475"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 633.2364786412845,
            "unit": "iter/sec",
            "range": "stddev: 0.0003768531479632409",
            "extra": "mean: 1.5791888713449806 msec\nrounds: 342"
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
        "date": 1772052548924,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1407.8342275110895,
            "unit": "iter/sec",
            "range": "stddev: 0.00009421904183979313",
            "extra": "mean: 710.3109019929856 usec\nrounds: 602"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2089.1130117152106,
            "unit": "iter/sec",
            "range": "stddev: 0.000018649308686959878",
            "extra": "mean: 478.67204617091375 usec\nrounds: 888"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 896.2593843727096,
            "unit": "iter/sec",
            "range": "stddev: 0.0007438203753368779",
            "extra": "mean: 1.1157484288991832 msec\nrounds: 872"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2049.1672848366607,
            "unit": "iter/sec",
            "range": "stddev: 0.000025890465515550926",
            "extra": "mean: 488.0031061396288 usec\nrounds: 961"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1093.6992349664865,
            "unit": "iter/sec",
            "range": "stddev: 0.00008080748973761762",
            "extra": "mean: 914.3281516793256 usec\nrounds: 923"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2090.0793335093654,
            "unit": "iter/sec",
            "range": "stddev: 0.000019990493864823053",
            "extra": "mean: 478.4507381932444 usec\nrounds: 974"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1325.560236207198,
            "unit": "iter/sec",
            "range": "stddev: 0.00007682522951634737",
            "extra": "mean: 754.3980067335773 usec\nrounds: 594"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1043.5077860122476,
            "unit": "iter/sec",
            "range": "stddev: 0.00002563311768550833",
            "extra": "mean: 958.3062181275023 usec\nrounds: 1004"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 334.6995739790375,
            "unit": "iter/sec",
            "range": "stddev: 0.00012021151192273041",
            "extra": "mean: 2.9877540270267295 msec\nrounds: 259"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 849.6773406093052,
            "unit": "iter/sec",
            "range": "stddev: 0.0001279464721103755",
            "extra": "mean: 1.1769173452158888 msec\nrounds: 533"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 738.8487457950006,
            "unit": "iter/sec",
            "range": "stddev: 0.00011744044352143188",
            "extra": "mean: 1.3534569906104408 msec\nrounds: 639"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1432.747233502476,
            "unit": "iter/sec",
            "range": "stddev: 0.00003677606858406887",
            "extra": "mean: 697.9598191618298 usec\nrounds: 835"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1178.0709798467556,
            "unit": "iter/sec",
            "range": "stddev: 0.00007603880136610164",
            "extra": "mean: 848.8452878536069 usec\nrounds: 601"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1034.0020778739345,
            "unit": "iter/sec",
            "range": "stddev: 0.00002539387490806531",
            "extra": "mean: 967.116044927252 usec\nrounds: 690"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1322.2757706311625,
            "unit": "iter/sec",
            "range": "stddev: 0.00006563950970649203",
            "extra": "mean: 756.2718929067796 usec\nrounds: 719"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2045.834213213231,
            "unit": "iter/sec",
            "range": "stddev: 0.000022320022132707518",
            "extra": "mean: 488.79816044789794 usec\nrounds: 804"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 721.9773383111896,
            "unit": "iter/sec",
            "range": "stddev: 0.00010599880631095503",
            "extra": "mean: 1.3850850254374272 msec\nrounds: 629"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1046.320618964634,
            "unit": "iter/sec",
            "range": "stddev: 0.000021629386685266654",
            "extra": "mean: 955.7299950654995 usec\nrounds: 608"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26920.382443108934,
            "unit": "iter/sec",
            "range": "stddev: 0.000024149868437650174",
            "extra": "mean: 37.14657479749064 usec\nrounds: 11110"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46959.179610608975,
            "unit": "iter/sec",
            "range": "stddev: 0.0000017104641892171201",
            "extra": "mean: 21.295090934128687 usec\nrounds: 18178"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 590.2129550720277,
            "unit": "iter/sec",
            "range": "stddev: 0.00012201482995515105",
            "extra": "mean: 1.6943037109003531 msec\nrounds: 422"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1806.9561585715505,
            "unit": "iter/sec",
            "range": "stddev: 0.0000965791149768305",
            "extra": "mean: 553.4168580993842 usec\nrounds: 747"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.77745194912559,
            "unit": "iter/sec",
            "range": "stddev: 0.00045040574746711524",
            "extra": "mean: 53.255361947368314 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 494.85893409849746,
            "unit": "iter/sec",
            "range": "stddev: 0.00036128716678281413",
            "extra": "mean: 2.0207779047613568 msec\nrounds: 252"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1330.9397237727724,
            "unit": "iter/sec",
            "range": "stddev: 0.00028830146328322735",
            "extra": "mean: 751.3488268013609 usec\nrounds: 791"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2068.929297516645,
            "unit": "iter/sec",
            "range": "stddev: 0.000021731293148541766",
            "extra": "mean: 483.34179481160106 usec\nrounds: 848"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1472.9629545749763,
            "unit": "iter/sec",
            "range": "stddev: 0.00007120132059045239",
            "extra": "mean: 678.9037001195663 usec\nrounds: 837"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2092.787043849033,
            "unit": "iter/sec",
            "range": "stddev: 0.00001699125562348904",
            "extra": "mean: 477.83170434809745 usec\nrounds: 805"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 725.9215611685617,
            "unit": "iter/sec",
            "range": "stddev: 0.00013095675358459734",
            "extra": "mean: 1.3775593032258706 msec\nrounds: 465"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1029.837586752865,
            "unit": "iter/sec",
            "range": "stddev: 0.00002626115107895575",
            "extra": "mean: 971.0269006135767 usec\nrounds: 815"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 898.9643050220692,
            "unit": "iter/sec",
            "range": "stddev: 0.00009261656591082709",
            "extra": "mean: 1.1123912200000536 msec\nrounds: 600"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1035.545866710358,
            "unit": "iter/sec",
            "range": "stddev: 0.0000262479863656394",
            "extra": "mean: 965.6742710747546 usec\nrounds: 605"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 875.9336891727676,
            "unit": "iter/sec",
            "range": "stddev: 0.00009044238095328107",
            "extra": "mean: 1.141638930390268 msec\nrounds: 589"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1027.4649647158224,
            "unit": "iter/sec",
            "range": "stddev: 0.000025337519865816663",
            "extra": "mean: 973.2691958762616 usec\nrounds: 873"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1665.870512938106,
            "unit": "iter/sec",
            "range": "stddev: 0.00005551069244460414",
            "extra": "mean: 600.2867523216399 usec\nrounds: 969"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2062.4303886237535,
            "unit": "iter/sec",
            "range": "stddev: 0.000018147798735553254",
            "extra": "mean: 484.86484950762076 usec\nrounds: 1422"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 634.2545638475561,
            "unit": "iter/sec",
            "range": "stddev: 0.0006030628741338271",
            "extra": "mean: 1.5766540077121955 msec\nrounds: 389"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 819.7354257343737,
            "unit": "iter/sec",
            "range": "stddev: 0.0003257091192206078",
            "extra": "mean: 1.2199057996110552 msec\nrounds: 514"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1648.6230205100212,
            "unit": "iter/sec",
            "range": "stddev: 0.00006408705781645654",
            "extra": "mean: 606.566806091691 usec\nrounds: 985"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2076.5328387583886,
            "unit": "iter/sec",
            "range": "stddev: 0.000020257363188741566",
            "extra": "mean: 481.5719652177161 usec\nrounds: 805"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1499.9339392563454,
            "unit": "iter/sec",
            "range": "stddev: 0.00007703485277620556",
            "extra": "mean: 666.6960282902802 usec\nrounds: 813"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2077.088536031619,
            "unit": "iter/sec",
            "range": "stddev: 0.00001859537944318009",
            "extra": "mean: 481.4431270756277 usec\nrounds: 1385"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 216.34282269021145,
            "unit": "iter/sec",
            "range": "stddev: 0.0005747717649088208",
            "extra": "mean: 4.62229339325915 msec\nrounds: 178"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 545.1533617936511,
            "unit": "iter/sec",
            "range": "stddev: 0.0000722570708480782",
            "extra": "mean: 1.8343462043594907 msec\nrounds: 367"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 882.8645064129466,
            "unit": "iter/sec",
            "range": "stddev: 0.00010927957513002223",
            "extra": "mean: 1.132676636942821 msec\nrounds: 628"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1446.485196597224,
            "unit": "iter/sec",
            "range": "stddev: 0.00006042651020856651",
            "extra": "mean: 691.3309602838966 usec\nrounds: 705"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 962.407504329961,
            "unit": "iter/sec",
            "range": "stddev: 0.00006203186858130848",
            "extra": "mean: 1.0390608920866753 msec\nrounds: 556"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1075.1012107327122,
            "unit": "iter/sec",
            "range": "stddev: 0.0000511926305259447",
            "extra": "mean: 930.1449854367398 usec\nrounds: 618"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5691.486060296954,
            "unit": "iter/sec",
            "range": "stddev: 0.00006968809170068177",
            "extra": "mean: 175.70103649657798 usec\nrounds: 137"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 43825.722043197,
            "unit": "iter/sec",
            "range": "stddev: 0.0000060361745537561855",
            "extra": "mean: 22.817650306236732 usec\nrounds: 163"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4755.050947714756,
            "unit": "iter/sec",
            "range": "stddev: 0.00005596765281146965",
            "extra": "mean: 210.30268886616093 usec\nrounds: 2928"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 50593.91519864071,
            "unit": "iter/sec",
            "range": "stddev: 0.0000027553708541686894",
            "extra": "mean: 19.765222676952796 usec\nrounds: 9772"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 70305.9749443463,
            "unit": "iter/sec",
            "range": "stddev: 0.00018741572783390482",
            "extra": "mean: 14.22354217819457 usec\nrounds: 21587"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 509330.6777011856,
            "unit": "iter/sec",
            "range": "stddev: 3.9111472506230023e-7",
            "extra": "mean: 1.9633610221819007 usec\nrounds: 35610"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 219224.78284560257,
            "unit": "iter/sec",
            "range": "stddev: 9.253411731938769e-7",
            "extra": "mean: 4.561528067309289 usec\nrounds: 43360"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 507155.4354865108,
            "unit": "iter/sec",
            "range": "stddev: 4.130901358904534e-7",
            "extra": "mean: 1.9717820810511608 usec\nrounds: 34031"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1790.9387189719573,
            "unit": "iter/sec",
            "range": "stddev: 0.0003016995300243855",
            "extra": "mean: 558.3663971339145 usec\nrounds: 977"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1048.3741212283262,
            "unit": "iter/sec",
            "range": "stddev: 0.000023926996968018047",
            "extra": "mean: 953.8579594356557 usec\nrounds: 567"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 675.13852860033,
            "unit": "iter/sec",
            "range": "stddev: 0.0003587449107104839",
            "extra": "mean: 1.481177503042464 msec\nrounds: 493"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 580.1922362696001,
            "unit": "iter/sec",
            "range": "stddev: 0.0003069909612793882",
            "extra": "mean: 1.723566668919241 msec\nrounds: 444"
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
        "date": 1772053551726,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1357.6869263361746,
            "unit": "iter/sec",
            "range": "stddev: 0.00022343866242860672",
            "extra": "mean: 736.5468287291967 usec\nrounds: 543"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2048.9126931973965,
            "unit": "iter/sec",
            "range": "stddev: 0.00009760457659041153",
            "extra": "mean: 488.06374391651934 usec\nrounds: 863"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 1020.720453561398,
            "unit": "iter/sec",
            "range": "stddev: 0.00012121436540311049",
            "extra": "mean: 979.7001681615155 usec\nrounds: 892"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1928.7155360902395,
            "unit": "iter/sec",
            "range": "stddev: 0.00012057395859399722",
            "extra": "mean: 518.4797764563725 usec\nrounds: 841"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1014.2190305282799,
            "unit": "iter/sec",
            "range": "stddev: 0.0014682124974036476",
            "extra": "mean: 985.9803157895059 usec\nrounds: 608"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2043.2268707300357,
            "unit": "iter/sec",
            "range": "stddev: 0.000025207311353699897",
            "extra": "mean: 489.421911156985 usec\nrounds: 968"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1359.6552383877165,
            "unit": "iter/sec",
            "range": "stddev: 0.00008834461671783864",
            "extra": "mean: 735.4805628416533 usec\nrounds: 549"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1011.8513250611259,
            "unit": "iter/sec",
            "range": "stddev: 0.00012266302393605378",
            "extra": "mean: 988.2874837759293 usec\nrounds: 1017"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 356.0174362189625,
            "unit": "iter/sec",
            "range": "stddev: 0.00019702692604399628",
            "extra": "mean: 2.80885119172918 msec\nrounds: 266"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 849.69435338829,
            "unit": "iter/sec",
            "range": "stddev: 0.000052528129177082214",
            "extra": "mean: 1.1768937807016637 msec\nrounds: 456"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 775.0312628083104,
            "unit": "iter/sec",
            "range": "stddev: 0.000126000064406181",
            "extra": "mean: 1.290270532283459 msec\nrounds: 635"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1635.3732136521135,
            "unit": "iter/sec",
            "range": "stddev: 0.00011148993992564968",
            "extra": "mean: 611.4812152064062 usec\nrounds: 776"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1164.2679657620204,
            "unit": "iter/sec",
            "range": "stddev: 0.00009558970396868568",
            "extra": "mean: 858.90879883953 usec\nrounds: 517"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1031.2665000956094,
            "unit": "iter/sec",
            "range": "stddev: 0.00003217979060013405",
            "extra": "mean: 969.6814547037932 usec\nrounds: 574"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1273.3508863547586,
            "unit": "iter/sec",
            "range": "stddev: 0.00008685563858451848",
            "extra": "mean: 785.3294882942404 usec\nrounds: 598"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2063.596300249296,
            "unit": "iter/sec",
            "range": "stddev: 0.000028547088983019994",
            "extra": "mean: 484.590905633623 usec\nrounds: 710"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 730.1448957249091,
            "unit": "iter/sec",
            "range": "stddev: 0.00013379195103815328",
            "extra": "mean: 1.3695911672534133 msec\nrounds: 568"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1043.1600134860769,
            "unit": "iter/sec",
            "range": "stddev: 0.000038520189723020243",
            "extra": "mean: 958.6257017829481 usec\nrounds: 617"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 24283.71128334932,
            "unit": "iter/sec",
            "range": "stddev: 0.000026375853343172475",
            "extra": "mean: 41.17986696233178 usec\nrounds: 10373"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 40075.1886014114,
            "unit": "iter/sec",
            "range": "stddev: 0.0000016787597272715605",
            "extra": "mean: 24.95309529160347 usec\nrounds: 15143"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 649.4608452289893,
            "unit": "iter/sec",
            "range": "stddev: 0.00012200474355697621",
            "extra": "mean: 1.5397387037973262 msec\nrounds: 395"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1743.694465017479,
            "unit": "iter/sec",
            "range": "stddev: 0.00017586553822571423",
            "extra": "mean: 573.4949671873712 usec\nrounds: 640"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 19.272344105938355,
            "unit": "iter/sec",
            "range": "stddev: 0.00030528281031457605",
            "extra": "mean: 51.88782405000083 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 472.3486960848544,
            "unit": "iter/sec",
            "range": "stddev: 0.00021852475967956591",
            "extra": "mean: 2.1170800476187965 msec\nrounds: 231"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1511.3826137669967,
            "unit": "iter/sec",
            "range": "stddev: 0.00007528643884594912",
            "extra": "mean: 661.6458273974599 usec\nrounds: 730"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2051.1965587509217,
            "unit": "iter/sec",
            "range": "stddev: 0.000026157992733913507",
            "extra": "mean: 487.52031868118536 usec\nrounds: 728"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1523.4203175481468,
            "unit": "iter/sec",
            "range": "stddev: 0.00008135185840831279",
            "extra": "mean: 656.4176599728169 usec\nrounds: 747"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2082.4590556663957,
            "unit": "iter/sec",
            "range": "stddev: 0.0000227109946056871",
            "extra": "mean: 480.20151814221185 usec\nrounds: 689"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 723.4075311522071,
            "unit": "iter/sec",
            "range": "stddev: 0.0001250910705749784",
            "extra": "mean: 1.3823466814165597 msec\nrounds: 452"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 938.0557433078276,
            "unit": "iter/sec",
            "range": "stddev: 0.00035229162554581054",
            "extra": "mean: 1.0660347288890755 msec\nrounds: 675"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 914.9762766051686,
            "unit": "iter/sec",
            "range": "stddev: 0.00010227706966430411",
            "extra": "mean: 1.0929245113439385 msec\nrounds: 573"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1002.5505709230561,
            "unit": "iter/sec",
            "range": "stddev: 0.00002536151617713178",
            "extra": "mean: 997.4559179386754 usec\nrounds: 524"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 867.8485674300047,
            "unit": "iter/sec",
            "range": "stddev: 0.00009738479510351217",
            "extra": "mean: 1.1522747602860495 msec\nrounds: 559"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1036.6588061465015,
            "unit": "iter/sec",
            "range": "stddev: 0.000034114175611156915",
            "extra": "mean: 964.6375394400297 usec\nrounds: 786"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1631.457480908006,
            "unit": "iter/sec",
            "range": "stddev: 0.00006973387377836622",
            "extra": "mean: 612.9488581237428 usec\nrounds: 874"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2080.9646690782756,
            "unit": "iter/sec",
            "range": "stddev: 0.000020043943630474426",
            "extra": "mean: 480.54636143482975 usec\nrounds: 1115"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 771.836989458034,
            "unit": "iter/sec",
            "range": "stddev: 0.00048109309698958074",
            "extra": "mean: 1.295610360294052 msec\nrounds: 408"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 980.1707417203914,
            "unit": "iter/sec",
            "range": "stddev: 0.00011373458490438478",
            "extra": "mean: 1.020230412351224 msec\nrounds: 502"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1635.8019949680452,
            "unit": "iter/sec",
            "range": "stddev: 0.00006755504075677247",
            "extra": "mean: 611.3209319197185 usec\nrounds: 896"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2129.398251252165,
            "unit": "iter/sec",
            "range": "stddev: 0.00001722320395741032",
            "extra": "mean: 469.6162398987427 usec\nrounds: 792"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1514.7410175373232,
            "unit": "iter/sec",
            "range": "stddev: 0.00007080644512592912",
            "extra": "mean: 660.1788612193305 usec\nrounds: 771"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2089.708382467883,
            "unit": "iter/sec",
            "range": "stddev: 0.000022260815538921782",
            "extra": "mean: 478.5356695650663 usec\nrounds: 1150"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 226.50199746173857,
            "unit": "iter/sec",
            "range": "stddev: 0.0006037663891972824",
            "extra": "mean: 4.414972102702641 msec\nrounds: 185"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 535.9475045850394,
            "unit": "iter/sec",
            "range": "stddev: 0.000039876438169445194",
            "extra": "mean: 1.865854382089634 msec\nrounds: 335"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 907.4717161607974,
            "unit": "iter/sec",
            "range": "stddev: 0.00013212907240492543",
            "extra": "mean: 1.1019627192687151 msec\nrounds: 602"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1751.1231028300354,
            "unit": "iter/sec",
            "range": "stddev: 0.00008978812176202465",
            "extra": "mean: 571.0620791787134 usec\nrounds: 682"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 941.1510062506435,
            "unit": "iter/sec",
            "range": "stddev: 0.00007782515431127338",
            "extra": "mean: 1.0625287476276513 msec\nrounds: 527"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1079.615581627903,
            "unit": "iter/sec",
            "range": "stddev: 0.00004488584329388903",
            "extra": "mean: 926.2556200718644 usec\nrounds: 558"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 7276.616514030792,
            "unit": "iter/sec",
            "range": "stddev: 0.000045434394496144945",
            "extra": "mean: 137.42650833279413 usec\nrounds: 120"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 45416.1524198799,
            "unit": "iter/sec",
            "range": "stddev: 0.000013529404909814193",
            "extra": "mean: 22.018597937465803 usec\nrounds: 194"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 5347.546509598344,
            "unit": "iter/sec",
            "range": "stddev: 0.0005345589505988135",
            "extra": "mean: 187.00164612034584 usec\nrounds: 2758"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 55928.5846477058,
            "unit": "iter/sec",
            "range": "stddev: 0.0000028592564085527095",
            "extra": "mean: 17.87994468837359 usec\nrounds: 7973"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 75011.51522534371,
            "unit": "iter/sec",
            "range": "stddev: 0.00001932568526379283",
            "extra": "mean: 13.33128649642496 usec\nrounds: 18447"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 479893.7345208995,
            "unit": "iter/sec",
            "range": "stddev: 5.11982353493206e-7",
            "extra": "mean: 2.0837946571616466 usec\nrounds: 30695"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 214534.30075155286,
            "unit": "iter/sec",
            "range": "stddev: 0.000006957787082158277",
            "extra": "mean: 4.661259278804449 usec\nrounds: 43621"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 509835.83251901687,
            "unit": "iter/sec",
            "range": "stddev: 4.713292746330481e-7",
            "extra": "mean: 1.9614156875933197 usec\nrounds: 32599"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1874.5743127685091,
            "unit": "iter/sec",
            "range": "stddev: 0.00006716970411021835",
            "extra": "mean: 533.4544451978148 usec\nrounds: 885"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1060.6816329363576,
            "unit": "iter/sec",
            "range": "stddev: 0.000018612385999335574",
            "extra": "mean: 942.7899653844589 usec\nrounds: 520"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 780.1657449381697,
            "unit": "iter/sec",
            "range": "stddev: 0.00014509831712859435",
            "extra": "mean: 1.281778912350545 msec\nrounds: 502"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 655.1255156714147,
            "unit": "iter/sec",
            "range": "stddev: 0.00011300756323528262",
            "extra": "mean: 1.5264250530299308 msec\nrounds: 396"
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
        "date": 1772053964703,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1227.6133482740242,
            "unit": "iter/sec",
            "range": "stddev: 0.00030012617808525017",
            "extra": "mean: 814.5887313835095 usec\nrounds: 376"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 1987.4455616544167,
            "unit": "iter/sec",
            "range": "stddev: 0.00010194496866579819",
            "extra": "mean: 503.1584357800303 usec\nrounds: 872"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 876.5925413989413,
            "unit": "iter/sec",
            "range": "stddev: 0.00014808244751851816",
            "extra": "mean: 1.1407808677040696 msec\nrounds: 771"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1987.0449056367845,
            "unit": "iter/sec",
            "range": "stddev: 0.00004971933324980277",
            "extra": "mean: 503.259889680013 usec\nrounds: 843"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 985.3834569877042,
            "unit": "iter/sec",
            "range": "stddev: 0.0008957645521805023",
            "extra": "mean: 1.0148333553893611 msec\nrounds: 937"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2065.3018826494877,
            "unit": "iter/sec",
            "range": "stddev: 0.000023517497867649666",
            "extra": "mean: 484.1907172994694 usec\nrounds: 948"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1286.293006069849,
            "unit": "iter/sec",
            "range": "stddev: 0.00010409515799564521",
            "extra": "mean: 777.4278451963357 usec\nrounds: 562"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1017.5999622746167,
            "unit": "iter/sec",
            "range": "stddev: 0.00005075741097953519",
            "extra": "mean: 982.7044389474269 usec\nrounds: 950"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 308.3854448922114,
            "unit": "iter/sec",
            "range": "stddev: 0.00020652069685366775",
            "extra": "mean: 3.242695193832918 msec\nrounds: 227"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 836.880322302297,
            "unit": "iter/sec",
            "range": "stddev: 0.00008933189484506842",
            "extra": "mean: 1.1949139839361418 msec\nrounds: 498"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 689.2105314243444,
            "unit": "iter/sec",
            "range": "stddev: 0.00015345195760141527",
            "extra": "mean: 1.4509354607994283 msec\nrounds: 625"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1403.3412805059156,
            "unit": "iter/sec",
            "range": "stddev: 0.00003104461840276592",
            "extra": "mean: 712.5850382164288 usec\nrounds: 785"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1103.5776485610422,
            "unit": "iter/sec",
            "range": "stddev: 0.00010478304002378663",
            "extra": "mean: 906.1437600733419 usec\nrounds: 546"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1011.5987181322542,
            "unit": "iter/sec",
            "range": "stddev: 0.000028846601664772242",
            "extra": "mean: 988.5342696423446 usec\nrounds: 560"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1242.945968671134,
            "unit": "iter/sec",
            "range": "stddev: 0.00008786667779452962",
            "extra": "mean: 804.5402014289696 usec\nrounds: 700"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2004.2590252003354,
            "unit": "iter/sec",
            "range": "stddev: 0.000033770262710298804",
            "extra": "mean: 498.9375062936514 usec\nrounds: 715"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 689.56352571929,
            "unit": "iter/sec",
            "range": "stddev: 0.00014997328214982214",
            "extra": "mean: 1.4501927127843528 msec\nrounds: 571"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1031.9805743125746,
            "unit": "iter/sec",
            "range": "stddev: 0.000029754411064767843",
            "extra": "mean: 969.0104880764081 usec\nrounds: 629"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26900.52168065196,
            "unit": "iter/sec",
            "range": "stddev: 0.000026498822665995885",
            "extra": "mean: 37.17400026183299 usec\nrounds: 11460"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46970.280661604935,
            "unit": "iter/sec",
            "range": "stddev: 0.000002183075303395178",
            "extra": "mean: 21.29005800932829 usec\nrounds: 18135"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 569.6954282873767,
            "unit": "iter/sec",
            "range": "stddev: 0.00011195739239916846",
            "extra": "mean: 1.7553238982559656 msec\nrounds: 344"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1634.0924661618697,
            "unit": "iter/sec",
            "range": "stddev: 0.0001555884223621702",
            "extra": "mean: 611.960473906831 usec\nrounds: 709"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.654665925021558,
            "unit": "iter/sec",
            "range": "stddev: 0.0004076626296295137",
            "extra": "mean: 53.605891631578196 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 471.8017546342825,
            "unit": "iter/sec",
            "range": "stddev: 0.0003394476292116363",
            "extra": "mean: 2.119534296296017 msec\nrounds: 243"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1476.3503410830065,
            "unit": "iter/sec",
            "range": "stddev: 0.00005649863729019912",
            "extra": "mean: 677.3460012658173 usec\nrounds: 790"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2025.9089771014317,
            "unit": "iter/sec",
            "range": "stddev: 0.00004006453194436497",
            "extra": "mean: 493.6055920097405 usec\nrounds: 826"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1425.4919902935071,
            "unit": "iter/sec",
            "range": "stddev: 0.00007479520111902678",
            "extra": "mean: 701.5121844312162 usec\nrounds: 835"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2097.032647794827,
            "unit": "iter/sec",
            "range": "stddev: 0.000020196824385892075",
            "extra": "mean: 476.8642972972158 usec\nrounds: 814"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 720.5822201399636,
            "unit": "iter/sec",
            "range": "stddev: 0.00012203219273597722",
            "extra": "mean: 1.387766686507701 msec\nrounds: 504"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1029.2004095105149,
            "unit": "iter/sec",
            "range": "stddev: 0.000037509624876545774",
            "extra": "mean: 971.6280626778971 usec\nrounds: 702"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 882.4826541682534,
            "unit": "iter/sec",
            "range": "stddev: 0.00011692394877271002",
            "extra": "mean: 1.1331667486909505 msec\nrounds: 573"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1027.7654243603517,
            "unit": "iter/sec",
            "range": "stddev: 0.000028027752153489788",
            "extra": "mean: 972.9846678023519 usec\nrounds: 587"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 825.0318542972149,
            "unit": "iter/sec",
            "range": "stddev: 0.00011998952667228729",
            "extra": "mean: 1.2120744123896015 msec\nrounds: 565"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1026.886187771441,
            "unit": "iter/sec",
            "range": "stddev: 0.00002889075211802282",
            "extra": "mean: 973.8177530366928 usec\nrounds: 741"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1575.2567366674557,
            "unit": "iter/sec",
            "range": "stddev: 0.0000784850525850522",
            "extra": "mean: 634.817155021699 usec\nrounds: 916"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2076.496727682801,
            "unit": "iter/sec",
            "range": "stddev: 0.000019838097713652262",
            "extra": "mean: 481.5803399391423 usec\nrounds: 1312"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 696.1315607713663,
            "unit": "iter/sec",
            "range": "stddev: 0.000671652652562178",
            "extra": "mean: 1.4365100741761005 msec\nrounds: 364"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 806.0056516460608,
            "unit": "iter/sec",
            "range": "stddev: 0.00046935368025887884",
            "extra": "mean: 1.2406860894309553 msec\nrounds: 492"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1572.2342377658113,
            "unit": "iter/sec",
            "range": "stddev: 0.00008505367132435112",
            "extra": "mean: 636.0375419765872 usec\nrounds: 941"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2053.357562053779,
            "unit": "iter/sec",
            "range": "stddev: 0.000021032096798570906",
            "extra": "mean: 487.00724047291345 usec\nrounds: 761"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1441.8592121559448,
            "unit": "iter/sec",
            "range": "stddev: 0.0000993014751235393",
            "extra": "mean: 693.548989782953 usec\nrounds: 783"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2066.794636804169,
            "unit": "iter/sec",
            "range": "stddev: 0.000021447146773140394",
            "extra": "mean: 483.8410078063073 usec\nrounds: 1281"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 185.58927022528053,
            "unit": "iter/sec",
            "range": "stddev: 0.0029579132032556787",
            "extra": "mean: 5.388242535714127 msec\nrounds: 168"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 531.6183068572215,
            "unit": "iter/sec",
            "range": "stddev: 0.00007390503152217943",
            "extra": "mean: 1.881048841059895 msec\nrounds: 302"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 830.7681118825377,
            "unit": "iter/sec",
            "range": "stddev: 0.00020789922470786123",
            "extra": "mean: 1.2037053248637326 msec\nrounds: 551"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1461.5585029913702,
            "unit": "iter/sec",
            "range": "stddev: 0.00009276325828631233",
            "extra": "mean: 684.2011441576243 usec\nrounds: 659"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 934.3486318026978,
            "unit": "iter/sec",
            "range": "stddev: 0.00008310073498929401",
            "extra": "mean: 1.0702643167257995 msec\nrounds: 562"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1064.0487684218526,
            "unit": "iter/sec",
            "range": "stddev: 0.00004765102274173249",
            "extra": "mean: 939.80654804305 usec\nrounds: 562"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5239.586870392958,
            "unit": "iter/sec",
            "range": "stddev: 0.00009831768902191941",
            "extra": "mean: 190.85474193598054 usec\nrounds: 124"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 40705.85616052948,
            "unit": "iter/sec",
            "range": "stddev: 0.000006189052581930142",
            "extra": "mean: 24.566489795874926 usec\nrounds: 147"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4481.862457770538,
            "unit": "iter/sec",
            "range": "stddev: 0.00006776856754596941",
            "extra": "mean: 223.12152803043423 usec\nrounds: 2087"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 48759.41354787901,
            "unit": "iter/sec",
            "range": "stddev: 0.0000029013782410776446",
            "extra": "mean: 20.508860284343985 usec\nrounds: 9777"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81164.15568101524,
            "unit": "iter/sec",
            "range": "stddev: 0.000020821938642666274",
            "extra": "mean: 12.320709697641883 usec\nrounds: 19180"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 487782.6901184812,
            "unit": "iter/sec",
            "range": "stddev: 8.997233618672645e-7",
            "extra": "mean: 2.0500932490185386 usec\nrounds: 35121"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 220162.7350125381,
            "unit": "iter/sec",
            "range": "stddev: 0.0000011818909950581197",
            "extra": "mean: 4.542094737072788 usec\nrounds: 43341"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 503200.9992266186,
            "unit": "iter/sec",
            "range": "stddev: 5.337680831271944e-7",
            "extra": "mean: 1.9872774528208876 usec\nrounds: 34359"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1760.0344400173656,
            "unit": "iter/sec",
            "range": "stddev: 0.00009413552893458579",
            "extra": "mean: 568.1707001086487 usec\nrounds: 917"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1022.2763671958219,
            "unit": "iter/sec",
            "range": "stddev: 0.00002523763954379477",
            "extra": "mean: 978.2090558770055 usec\nrounds: 519"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 734.379984646995,
            "unit": "iter/sec",
            "range": "stddev: 0.00027891969281712667",
            "extra": "mean: 1.361692885026931 msec\nrounds: 374"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 604.5368971367241,
            "unit": "iter/sec",
            "range": "stddev: 0.0001250094794514495",
            "extra": "mean: 1.6541587531485884 msec\nrounds: 397"
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
        "date": 1772055012677,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1323.3501829850632,
            "unit": "iter/sec",
            "range": "stddev: 0.00022375752127106038",
            "extra": "mean: 755.657884706158 usec\nrounds: 425"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2076.4296256728167,
            "unit": "iter/sec",
            "range": "stddev: 0.00002089876764147733",
            "extra": "mean: 481.5959027149664 usec\nrounds: 884"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 889.1936611925026,
            "unit": "iter/sec",
            "range": "stddev: 0.00016750915534252957",
            "extra": "mean: 1.1246144047618314 msec\nrounds: 840"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2032.501942895123,
            "unit": "iter/sec",
            "range": "stddev: 0.00004468968973960166",
            "extra": "mean: 492.00444973527885 usec\nrounds: 945"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 999.224650492989,
            "unit": "iter/sec",
            "range": "stddev: 0.0010475547463736847",
            "extra": "mean: 1.0007759511403451 msec\nrounds: 921"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2067.080236939478,
            "unit": "iter/sec",
            "range": "stddev: 0.000022000661151417545",
            "extra": "mean: 483.7741574466415 usec\nrounds: 940"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1269.1814846386596,
            "unit": "iter/sec",
            "range": "stddev: 0.00009676341133590176",
            "extra": "mean: 787.9093826244269 usec\nrounds: 541"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1025.5384392662131,
            "unit": "iter/sec",
            "range": "stddev: 0.00002994062048844516",
            "extra": "mean: 975.0975309277669 usec\nrounds: 970"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 323.46800132122866,
            "unit": "iter/sec",
            "range": "stddev: 0.00017001428254340858",
            "extra": "mean: 3.0914959004149623 msec\nrounds: 241"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 831.7947833858744,
            "unit": "iter/sec",
            "range": "stddev: 0.00006212419912878336",
            "extra": "mean: 1.2022196099011768 msec\nrounds: 505"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 698.5078492700518,
            "unit": "iter/sec",
            "range": "stddev: 0.0001716084972826835",
            "extra": "mean: 1.4316231393033172 msec\nrounds: 603"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1429.2739498973299,
            "unit": "iter/sec",
            "range": "stddev: 0.00002673957687522406",
            "extra": "mean: 699.655933750023 usec\nrounds: 800"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1129.2378289427636,
            "unit": "iter/sec",
            "range": "stddev: 0.00011052097341603645",
            "extra": "mean: 885.5530468158677 usec\nrounds: 534"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1022.7641918586698,
            "unit": "iter/sec",
            "range": "stddev: 0.00001916175707243574",
            "extra": "mean: 977.7424825391076 usec\nrounds: 630"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1261.2901432961246,
            "unit": "iter/sec",
            "range": "stddev: 0.00008351143474631637",
            "extra": "mean: 792.8389873774038 usec\nrounds: 713"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2000.2796073913264,
            "unit": "iter/sec",
            "range": "stddev: 0.000025940162233488226",
            "extra": "mean: 499.930107923339 usec\nrounds: 732"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 683.7483476912906,
            "unit": "iter/sec",
            "range": "stddev: 0.00013672361841292197",
            "extra": "mean: 1.4625263861719713 msec\nrounds: 593"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1037.201381743769,
            "unit": "iter/sec",
            "range": "stddev: 0.000022794442580599657",
            "extra": "mean: 964.1329230768812 usec\nrounds: 741"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26808.637299814927,
            "unit": "iter/sec",
            "range": "stddev: 0.000026235431814990597",
            "extra": "mean: 37.30141106451925 usec\nrounds: 10249"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46558.97963734197,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021936354541755723",
            "extra": "mean: 21.478133923664515 usec\nrounds: 18182"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 572.8368807204635,
            "unit": "iter/sec",
            "range": "stddev: 0.00012510439325859768",
            "extra": "mean: 1.745697656097646 msec\nrounds: 410"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1675.442900919506,
            "unit": "iter/sec",
            "range": "stddev: 0.00018775187913101636",
            "extra": "mean: 596.8571053368553 usec\nrounds: 712"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.412250474177824,
            "unit": "iter/sec",
            "range": "stddev: 0.0006818871241250253",
            "extra": "mean: 54.31166610526211 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 478.1832689101221,
            "unit": "iter/sec",
            "range": "stddev: 0.00029689578673150214",
            "extra": "mean: 2.0912484083334943 msec\nrounds: 240"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1276.8857209554412,
            "unit": "iter/sec",
            "range": "stddev: 0.0002903937850474397",
            "extra": "mean: 783.1554410771708 usec\nrounds: 594"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2023.2878312537016,
            "unit": "iter/sec",
            "range": "stddev: 0.00002229584513760675",
            "extra": "mean: 494.2450523118918 usec\nrounds: 822"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1430.1417875232346,
            "unit": "iter/sec",
            "range": "stddev: 0.00010279206291868503",
            "extra": "mean: 699.2313690321797 usec\nrounds: 775"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2057.7259299825237,
            "unit": "iter/sec",
            "range": "stddev: 0.00001804713848906404",
            "extra": "mean: 485.97336770135036 usec\nrounds: 805"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 726.7590592559031,
            "unit": "iter/sec",
            "range": "stddev: 0.00010326944470520673",
            "extra": "mean: 1.3759718399986047 msec\nrounds: 350"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1026.055206763809,
            "unit": "iter/sec",
            "range": "stddev: 0.00002171521016378951",
            "extra": "mean: 974.6064280049925 usec\nrounds: 757"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 886.0471554222379,
            "unit": "iter/sec",
            "range": "stddev: 0.00011627343941399072",
            "extra": "mean: 1.1286081038468647 msec\nrounds: 520"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1043.1975288250214,
            "unit": "iter/sec",
            "range": "stddev: 0.00002209994304557448",
            "extra": "mean: 958.5912278054609 usec\nrounds: 597"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 823.492003733332,
            "unit": "iter/sec",
            "range": "stddev: 0.00010285414450412428",
            "extra": "mean: 1.2143408745518625 msec\nrounds: 558"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1038.1320563776637,
            "unit": "iter/sec",
            "range": "stddev: 0.000022214194681604416",
            "extra": "mean: 963.2685878993881 usec\nrounds: 876"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1629.6703775477717,
            "unit": "iter/sec",
            "range": "stddev: 0.0000628374670258811",
            "extra": "mean: 613.6210204082736 usec\nrounds: 980"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2093.744470030625,
            "unit": "iter/sec",
            "range": "stddev: 0.000020210756381289746",
            "extra": "mean: 477.6132017606585 usec\nrounds: 1363"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 723.0062925726343,
            "unit": "iter/sec",
            "range": "stddev: 0.000253777152937916",
            "extra": "mean: 1.3831138266331735 msec\nrounds: 398"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 889.7700460201806,
            "unit": "iter/sec",
            "range": "stddev: 0.00022338710848267897",
            "extra": "mean: 1.1238858899250013 msec\nrounds: 536"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1584.3298619835273,
            "unit": "iter/sec",
            "range": "stddev: 0.0000973360125222928",
            "extra": "mean: 631.1816901235668 usec\nrounds: 810"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2085.6954659678436,
            "unit": "iter/sec",
            "range": "stddev: 0.00002086933169030323",
            "extra": "mean: 479.4563810090853 usec\nrounds: 832"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1434.664206863578,
            "unit": "iter/sec",
            "range": "stddev: 0.00008098913018430242",
            "extra": "mean: 697.0272173905917 usec\nrounds: 828"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2076.3599893091955,
            "unit": "iter/sec",
            "range": "stddev: 0.000019894667137301023",
            "extra": "mean: 481.61205433971963 usec\nrounds: 1325"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 178.0388306362241,
            "unit": "iter/sec",
            "range": "stddev: 0.0025809053490746803",
            "extra": "mean: 5.616752235602126 msec\nrounds: 191"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 517.2097607234006,
            "unit": "iter/sec",
            "range": "stddev: 0.000237825072375041",
            "extra": "mean: 1.9334515238098755 msec\nrounds: 231"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 800.1810740362286,
            "unit": "iter/sec",
            "range": "stddev: 0.00017901993531406547",
            "extra": "mean: 1.249717135842586 msec\nrounds: 611"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1474.7060132379368,
            "unit": "iter/sec",
            "range": "stddev: 0.00008187848500077345",
            "extra": "mean: 678.101256130604 usec\nrounds: 734"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 940.0218190294975,
            "unit": "iter/sec",
            "range": "stddev: 0.00008076585716555376",
            "extra": "mean: 1.0638050944736852 msec\nrounds: 561"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1071.725098240099,
            "unit": "iter/sec",
            "range": "stddev: 0.00004250516685494087",
            "extra": "mean: 933.0750970021322 usec\nrounds: 567"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5504.320952205927,
            "unit": "iter/sec",
            "range": "stddev: 0.00007629864964580528",
            "extra": "mean: 181.67545255500357 usec\nrounds: 137"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 44252.935303964696,
            "unit": "iter/sec",
            "range": "stddev: 0.000006848301024024597",
            "extra": "mean: 22.59737106999111 usec\nrounds: 159"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4372.105529509446,
            "unit": "iter/sec",
            "range": "stddev: 0.00007355464642765959",
            "extra": "mean: 228.72275000009 usec\nrounds: 2184"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 47409.58661207348,
            "unit": "iter/sec",
            "range": "stddev: 0.00000364203124622012",
            "extra": "mean: 21.092780415540194 usec\nrounds: 9773"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 81172.85629293168,
            "unit": "iter/sec",
            "range": "stddev: 0.00001788337005440032",
            "extra": "mean: 12.3193890872986 usec\nrounds: 21278"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 498321.0349235319,
            "unit": "iter/sec",
            "range": "stddev: 6.561834648976426e-7",
            "extra": "mean: 2.0067384876768277 usec\nrounds: 37134"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 217190.89042338528,
            "unit": "iter/sec",
            "range": "stddev: 0.0000012323393446772414",
            "extra": "mean: 4.604244671821321 usec\nrounds: 45044"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 496586.4549152858,
            "unit": "iter/sec",
            "range": "stddev: 0.000006037701031208958",
            "extra": "mean: 2.0137480394437923 usec\nrounds: 22825"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1787.402658787739,
            "unit": "iter/sec",
            "range": "stddev: 0.00009645603403019058",
            "extra": "mean: 559.4710263428973 usec\nrounds: 949"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1033.6458599456064,
            "unit": "iter/sec",
            "range": "stddev: 0.000042348810120247776",
            "extra": "mean: 967.4493351645825 usec\nrounds: 546"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 733.319383835063,
            "unit": "iter/sec",
            "range": "stddev: 0.0003105527730066217",
            "extra": "mean: 1.3636623032794648 msec\nrounds: 488"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 601.9050122886198,
            "unit": "iter/sec",
            "range": "stddev: 0.0003496150439575123",
            "extra": "mean: 1.6613917139478636 msec\nrounds: 423"
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
        "date": 1772055054229,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1343.8798111830888,
            "unit": "iter/sec",
            "range": "stddev: 0.0002864230121989948",
            "extra": "mean: 744.1141623518006 usec\nrounds: 425"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2074.0513979849065,
            "unit": "iter/sec",
            "range": "stddev: 0.00002250640541771477",
            "extra": "mean: 482.14812852351366 usec\nrounds: 887"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 895.5721724709862,
            "unit": "iter/sec",
            "range": "stddev: 0.0007948289499697518",
            "extra": "mean: 1.1166045917225023 msec\nrounds: 894"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2107.3395385465624,
            "unit": "iter/sec",
            "range": "stddev: 0.000020953507126267812",
            "extra": "mean: 474.5319782163356 usec\nrounds: 964"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1071.532365857252,
            "unit": "iter/sec",
            "range": "stddev: 0.00008498157790296716",
            "extra": "mean: 933.2429256114682 usec\nrounds: 941"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2063.082533423545,
            "unit": "iter/sec",
            "range": "stddev: 0.000032235526669297874",
            "extra": "mean: 484.71158269202544 usec\nrounds: 1040"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1317.9232059986193,
            "unit": "iter/sec",
            "range": "stddev: 0.0000977362826879377",
            "extra": "mean: 758.7695515553792 usec\nrounds: 611"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1037.4682141584929,
            "unit": "iter/sec",
            "range": "stddev: 0.000025146110044486953",
            "extra": "mean: 963.8849521872978 usec\nrounds: 983"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 331.09526977436735,
            "unit": "iter/sec",
            "range": "stddev: 0.0001302004985088377",
            "extra": "mean: 3.020278727272285 msec\nrounds: 253"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 853.1481032917425,
            "unit": "iter/sec",
            "range": "stddev: 0.00006259635260027532",
            "extra": "mean: 1.1721294299801543 msec\nrounds: 507"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 735.6827417327058,
            "unit": "iter/sec",
            "range": "stddev: 0.00012248414408172554",
            "extra": "mean: 1.3592815805965013 msec\nrounds: 670"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1431.9407085040157,
            "unit": "iter/sec",
            "range": "stddev: 0.00004799561777623466",
            "extra": "mean: 698.352937423453 usec\nrounds: 815"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1141.5486775471234,
            "unit": "iter/sec",
            "range": "stddev: 0.0000903400892770135",
            "extra": "mean: 876.0029420284794 usec\nrounds: 621"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1031.9870257949694,
            "unit": "iter/sec",
            "range": "stddev: 0.00003151208121638974",
            "extra": "mean: 969.0044302927851 usec\nrounds: 581"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1297.539805050683,
            "unit": "iter/sec",
            "range": "stddev: 0.00006800654959139439",
            "extra": "mean: 770.689266030601 usec\nrounds: 733"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2013.57418658865,
            "unit": "iter/sec",
            "range": "stddev: 0.000029207122127098287",
            "extra": "mean: 496.6293304018645 usec\nrounds: 796"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 732.9308115209764,
            "unit": "iter/sec",
            "range": "stddev: 0.00012592852178386072",
            "extra": "mean: 1.3643852656771276 msec\nrounds: 606"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1026.8727768361148,
            "unit": "iter/sec",
            "range": "stddev: 0.000028839138944767614",
            "extra": "mean: 973.8304710746037 usec\nrounds: 726"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 26749.023832450614,
            "unit": "iter/sec",
            "range": "stddev: 0.000025858895261088565",
            "extra": "mean: 37.38454181594652 usec\nrounds: 11168"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46412.12819552581,
            "unit": "iter/sec",
            "range": "stddev: 0.000002040111921621631",
            "extra": "mean: 21.54609234437996 usec\nrounds: 17543"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 584.5298770760418,
            "unit": "iter/sec",
            "range": "stddev: 0.00010949028864983557",
            "extra": "mean: 1.7107765389208829 msec\nrounds: 334"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1638.2153275687206,
            "unit": "iter/sec",
            "range": "stddev: 0.00017316353676435502",
            "extra": "mean: 610.4203660968686 usec\nrounds: 702"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.69365396945684,
            "unit": "iter/sec",
            "range": "stddev: 0.0007569037088753795",
            "extra": "mean: 53.49408957894902 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 498.36565187579134,
            "unit": "iter/sec",
            "range": "stddev: 0.0002998065011210316",
            "extra": "mean: 2.006558831324178 msec\nrounds: 249"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1387.8408290767595,
            "unit": "iter/sec",
            "range": "stddev: 0.00023727068712696553",
            "extra": "mean: 720.543724502784 usec\nrounds: 755"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2100.2785151971707,
            "unit": "iter/sec",
            "range": "stddev: 0.0000208251278334254",
            "extra": "mean: 476.12732919191984 usec\nrounds: 805"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1477.055287907963,
            "unit": "iter/sec",
            "range": "stddev: 0.00007648686081887813",
            "extra": "mean: 677.0227277114025 usec\nrounds: 830"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2084.5673041181294,
            "unit": "iter/sec",
            "range": "stddev: 0.000022926569654297045",
            "extra": "mean: 479.71586142815727 usec\nrounds: 700"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 757.9151560045023,
            "unit": "iter/sec",
            "range": "stddev: 0.0001008244791017175",
            "extra": "mean: 1.319408896995404 msec\nrounds: 466"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1048.794115622361,
            "unit": "iter/sec",
            "range": "stddev: 0.000021561679809506213",
            "extra": "mean: 953.4759826589927 usec\nrounds: 692"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 898.3370375190862,
            "unit": "iter/sec",
            "range": "stddev: 0.0001026970039670461",
            "extra": "mean: 1.1131679517096098 msec\nrounds: 497"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1036.8425134112035,
            "unit": "iter/sec",
            "range": "stddev: 0.000025947920534000406",
            "extra": "mean: 964.4666254183658 usec\nrounds: 598"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 857.3551798004281,
            "unit": "iter/sec",
            "range": "stddev: 0.00010066482839436043",
            "extra": "mean: 1.1663777435073948 msec\nrounds: 616"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1029.126654581198,
            "unit": "iter/sec",
            "range": "stddev: 0.000027316624868666227",
            "extra": "mean: 971.6976968271696 usec\nrounds: 851"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1656.475963641939,
            "unit": "iter/sec",
            "range": "stddev: 0.000057096171918290635",
            "extra": "mean: 603.6912227820037 usec\nrounds: 992"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2071.6081808652034,
            "unit": "iter/sec",
            "range": "stddev: 0.000020306979536460487",
            "extra": "mean: 482.7167652824927 usec\nrounds: 1325"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 470.9035305560739,
            "unit": "iter/sec",
            "range": "stddev: 0.0011647386142032076",
            "extra": "mean: 2.1235771981134524 msec\nrounds: 424"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 610.8208009056927,
            "unit": "iter/sec",
            "range": "stddev: 0.0009655784136704076",
            "extra": "mean: 1.6371413653845006 msec\nrounds: 416"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1651.5608528148723,
            "unit": "iter/sec",
            "range": "stddev: 0.00005729130788182616",
            "extra": "mean: 605.4878318868051 usec\nrounds: 922"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2073.273264796371,
            "unit": "iter/sec",
            "range": "stddev: 0.000025056242768996483",
            "extra": "mean: 482.32908656072215 usec\nrounds: 878"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1465.7573365303106,
            "unit": "iter/sec",
            "range": "stddev: 0.00007660213953918508",
            "extra": "mean: 682.2411698563726 usec\nrounds: 836"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2095.8724128786357,
            "unit": "iter/sec",
            "range": "stddev: 0.000020165961471051193",
            "extra": "mean: 477.1282802594465 usec\nrounds: 1388"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 209.99200845585537,
            "unit": "iter/sec",
            "range": "stddev: 0.0021754422029016504",
            "extra": "mean: 4.762085982954064 msec\nrounds: 176"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 542.7428901567743,
            "unit": "iter/sec",
            "range": "stddev: 0.00007279960815008768",
            "extra": "mean: 1.8424930443789775 msec\nrounds: 338"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 860.7847566397994,
            "unit": "iter/sec",
            "range": "stddev: 0.0001370480614585263",
            "extra": "mean: 1.161730609523858 msec\nrounds: 630"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1558.9609355904815,
            "unit": "iter/sec",
            "range": "stddev: 0.00009874166100551068",
            "extra": "mean: 641.4528915833506 usec\nrounds: 701"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 949.4087464544663,
            "unit": "iter/sec",
            "range": "stddev: 0.00007588868736553351",
            "extra": "mean: 1.0532871155173837 msec\nrounds: 580"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1035.2935340073786,
            "unit": "iter/sec",
            "range": "stddev: 0.00003542522890733522",
            "extra": "mean: 965.9096354337637 usec\nrounds: 587"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5572.207788940837,
            "unit": "iter/sec",
            "range": "stddev: 0.0000664012961754622",
            "extra": "mean: 179.46208000080333 usec\nrounds: 125"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 42953.539033143265,
            "unit": "iter/sec",
            "range": "stddev: 0.000006076701997174425",
            "extra": "mean: 23.28096875157115 usec\nrounds: 160"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4414.0338270345865,
            "unit": "iter/sec",
            "range": "stddev: 0.00006049455352827054",
            "extra": "mean: 226.55014419583975 usec\nrounds: 2455"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 50284.38210251891,
            "unit": "iter/sec",
            "range": "stddev: 0.00001321177932974031",
            "extra": "mean: 19.886890485423837 usec\nrounds: 7378"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 80984.13270489126,
            "unit": "iter/sec",
            "range": "stddev: 0.000018327588098607735",
            "extra": "mean: 12.348097912513696 usec\nrounds: 21846"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 496060.0989727748,
            "unit": "iter/sec",
            "range": "stddev: 3.9446432593405533e-7",
            "extra": "mean: 2.0158847729756286 usec\nrounds: 34419"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 216139.2865813229,
            "unit": "iter/sec",
            "range": "stddev: 6.863173429064107e-7",
            "extra": "mean: 4.626646158673924 usec\nrounds: 45023"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 506864.11939631443,
            "unit": "iter/sec",
            "range": "stddev: 4.25635903507005e-7",
            "extra": "mean: 1.9729153469987588 usec\nrounds: 36750"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1892.7421015807447,
            "unit": "iter/sec",
            "range": "stddev: 0.00005887564110636256",
            "extra": "mean: 528.3339970959798 usec\nrounds: 1033"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1040.20565377356,
            "unit": "iter/sec",
            "range": "stddev: 0.000026078176394363393",
            "extra": "mean: 961.3483606556975 usec\nrounds: 549"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 663.5061482774701,
            "unit": "iter/sec",
            "range": "stddev: 0.0004690138111490678",
            "extra": "mean: 1.5071450394184023 msec\nrounds: 482"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 558.8782979909907,
            "unit": "iter/sec",
            "range": "stddev: 0.0006904546085063323",
            "extra": "mean: 1.789298320573042 msec\nrounds: 418"
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
        "date": 1772056881317,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1300.7652434286088,
            "unit": "iter/sec",
            "range": "stddev: 0.00025245802047167904",
            "extra": "mean: 768.7782288556236 usec\nrounds: 402"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2073.3616705894788,
            "unit": "iter/sec",
            "range": "stddev: 0.00001986764675032541",
            "extra": "mean: 482.3085205948123 usec\nrounds: 874"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 924.4209219296547,
            "unit": "iter/sec",
            "range": "stddev: 0.0001230766830876616",
            "extra": "mean: 1.0817582946008837 msec\nrounds: 852"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2044.6405904610688,
            "unit": "iter/sec",
            "range": "stddev: 0.00003463632941905853",
            "extra": "mean: 489.08351162807486 usec\nrounds: 946"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1012.6655604366235,
            "unit": "iter/sec",
            "range": "stddev: 0.0008372617662268668",
            "extra": "mean: 987.4928496322491 usec\nrounds: 951"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2073.2396217500573,
            "unit": "iter/sec",
            "range": "stddev: 0.000035374629400195506",
            "extra": "mean: 482.33691345136594 usec\nrounds: 959"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1312.2895532179086,
            "unit": "iter/sec",
            "range": "stddev: 0.00007199334977106372",
            "extra": "mean: 762.0269456141497 usec\nrounds: 570"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1014.2790075994332,
            "unit": "iter/sec",
            "range": "stddev: 0.000027786339084837274",
            "extra": "mean: 985.9220120968212 usec\nrounds: 992"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 317.801905471236,
            "unit": "iter/sec",
            "range": "stddev: 0.00021292917837326223",
            "extra": "mean: 3.146614236051235 msec\nrounds: 233"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 822.9495864550221,
            "unit": "iter/sec",
            "range": "stddev: 0.00010153474030460946",
            "extra": "mean: 1.2151412631576242 msec\nrounds: 494"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 691.8992499574587,
            "unit": "iter/sec",
            "range": "stddev: 0.00017489746845629231",
            "extra": "mean: 1.4452971296926322 msec\nrounds: 586"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1438.9411905787758,
            "unit": "iter/sec",
            "range": "stddev: 0.000050354446699185324",
            "extra": "mean: 694.955434278573 usec\nrounds: 776"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1137.1821816817312,
            "unit": "iter/sec",
            "range": "stddev: 0.00007833749863814956",
            "extra": "mean: 879.3665747744498 usec\nrounds: 555"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1032.0647185133355,
            "unit": "iter/sec",
            "range": "stddev: 0.00002568637325001698",
            "extra": "mean: 968.9314846848714 usec\nrounds: 555"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1304.3157551222698,
            "unit": "iter/sec",
            "range": "stddev: 0.00006768730014432501",
            "extra": "mean: 766.6855177305264 usec\nrounds: 705"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2033.010150244343,
            "unit": "iter/sec",
            "range": "stddev: 0.00003119745721435355",
            "extra": "mean: 491.88145955877894 usec\nrounds: 816"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 707.8499652965022,
            "unit": "iter/sec",
            "range": "stddev: 0.00011277148922543352",
            "extra": "mean: 1.4127287547172835 msec\nrounds: 583"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1047.2739779083793,
            "unit": "iter/sec",
            "range": "stddev: 0.00001598557699305837",
            "extra": "mean: 954.8599708332341 usec\nrounds: 720"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27133.466865985836,
            "unit": "iter/sec",
            "range": "stddev: 0.000026322488259021382",
            "extra": "mean: 36.85485547936327 usec\nrounds: 9189"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 47227.36576104264,
            "unit": "iter/sec",
            "range": "stddev: 0.0000020470444306367795",
            "extra": "mean: 21.17416425594691 usec\nrounds: 17698"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 578.049658417295,
            "unit": "iter/sec",
            "range": "stddev: 0.00009408287957340636",
            "extra": "mean: 1.7299551784841614 msec\nrounds: 409"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1701.6432644917961,
            "unit": "iter/sec",
            "range": "stddev: 0.00017590200077050857",
            "extra": "mean: 587.6672395836472 usec\nrounds: 672"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.580705241385274,
            "unit": "iter/sec",
            "range": "stddev: 0.0006109167394020142",
            "extra": "mean: 53.81927042105348 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 481.6802503527149,
            "unit": "iter/sec",
            "range": "stddev: 0.0003738685720566896",
            "extra": "mean: 2.076066019455314 msec\nrounds: 257"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1388.5838600179966,
            "unit": "iter/sec",
            "range": "stddev: 0.0002462176958242079",
            "extra": "mean: 720.1581617022681 usec\nrounds: 705"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2096.281202114069,
            "unit": "iter/sec",
            "range": "stddev: 0.000015470512084004103",
            "extra": "mean: 477.0352369670227 usec\nrounds: 844"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1484.9509044435063,
            "unit": "iter/sec",
            "range": "stddev: 0.00007191736015447881",
            "extra": "mean: 673.4229374234804 usec\nrounds: 815"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2084.059270548718,
            "unit": "iter/sec",
            "range": "stddev: 0.000021182349036063874",
            "extra": "mean: 479.83280232558224 usec\nrounds: 774"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 709.2337505122067,
            "unit": "iter/sec",
            "range": "stddev: 0.00011180563386370861",
            "extra": "mean: 1.409972381147686 msec\nrounds: 488"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1026.5330470745837,
            "unit": "iter/sec",
            "range": "stddev: 0.000023237688088271797",
            "extra": "mean: 974.1527589879375 usec\nrounds: 751"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 890.9594109862852,
            "unit": "iter/sec",
            "range": "stddev: 0.0000900142430810723",
            "extra": "mean: 1.1223855853242601 msec\nrounds: 586"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1039.6328901689992,
            "unit": "iter/sec",
            "range": "stddev: 0.00002148736610982771",
            "extra": "mean: 961.8779950655883 usec\nrounds: 608"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 842.0270066905059,
            "unit": "iter/sec",
            "range": "stddev: 0.00009371380714784513",
            "extra": "mean: 1.1876103641026783 msec\nrounds: 585"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1034.6214061916396,
            "unit": "iter/sec",
            "range": "stddev: 0.0000238130965222995",
            "extra": "mean: 966.5371255761293 usec\nrounds: 868"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1616.6005951755947,
            "unit": "iter/sec",
            "range": "stddev: 0.000056779217012414596",
            "extra": "mean: 618.5819818353959 usec\nrounds: 1046"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2083.855326191081,
            "unit": "iter/sec",
            "range": "stddev: 0.000018487316750363264",
            "extra": "mean: 479.8797629717525 usec\nrounds: 1696"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 720.162140687478,
            "unit": "iter/sec",
            "range": "stddev: 0.0001790946228624531",
            "extra": "mean: 1.3885761879198266 msec\nrounds: 447"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 850.0854667014195,
            "unit": "iter/sec",
            "range": "stddev: 0.0001780927325794782",
            "extra": "mean: 1.1763523071160042 msec\nrounds: 534"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1587.538805114273,
            "unit": "iter/sec",
            "range": "stddev: 0.00006484695922842952",
            "extra": "mean: 629.9058623187601 usec\nrounds: 966"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2063.908864465144,
            "unit": "iter/sec",
            "range": "stddev: 0.000028148059076458436",
            "extra": "mean: 484.5175178115954 usec\nrounds: 786"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1459.2626340442473,
            "unit": "iter/sec",
            "range": "stddev: 0.00007028048002521796",
            "extra": "mean: 685.2776029963626 usec\nrounds: 801"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2038.3094303716543,
            "unit": "iter/sec",
            "range": "stddev: 0.00008900376160403868",
            "extra": "mean: 490.6026460455837 usec\nrounds: 1277"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 215.11204256287422,
            "unit": "iter/sec",
            "range": "stddev: 0.0006644743875959784",
            "extra": "mean: 4.648740201087134 msec\nrounds: 184"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 543.651852902538,
            "unit": "iter/sec",
            "range": "stddev: 0.00003222642739993335",
            "extra": "mean: 1.839412474474308 msec\nrounds: 333"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 862.3666812205965,
            "unit": "iter/sec",
            "range": "stddev: 0.00011939924430016557",
            "extra": "mean: 1.1595995320512578 msec\nrounds: 780"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1510.7353784424818,
            "unit": "iter/sec",
            "range": "stddev: 0.00008553589474361339",
            "extra": "mean: 661.9292923628802 usec\nrounds: 838"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 943.3973428473221,
            "unit": "iter/sec",
            "range": "stddev: 0.00007994160178839041",
            "extra": "mean: 1.0599987455782334 msec\nrounds: 735"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1089.1656499262351,
            "unit": "iter/sec",
            "range": "stddev: 0.00003275629865702429",
            "extra": "mean: 918.1339863846478 usec\nrounds: 661"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5721.877780589413,
            "unit": "iter/sec",
            "range": "stddev: 0.00005725127994827052",
            "extra": "mean: 174.76780147110895 usec\nrounds: 136"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 43453.60822326657,
            "unit": "iter/sec",
            "range": "stddev: 0.000006373650361478136",
            "extra": "mean: 23.01304864861752 usec\nrounds: 185"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4739.848561127511,
            "unit": "iter/sec",
            "range": "stddev: 0.00005656807460911208",
            "extra": "mean: 210.97720467299507 usec\nrounds: 3210"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 50272.38091426097,
            "unit": "iter/sec",
            "range": "stddev: 0.00001315917790222376",
            "extra": "mean: 19.891637949383973 usec\nrounds: 10377"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 82644.41499652599,
            "unit": "iter/sec",
            "range": "stddev: 0.00001761317093630765",
            "extra": "mean: 12.10003120043908 usec\nrounds: 22083"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 502170.9802321392,
            "unit": "iter/sec",
            "range": "stddev: 4.247212704975221e-7",
            "extra": "mean: 1.9913536213058922 usec\nrounds: 35982"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 221837.31104702974,
            "unit": "iter/sec",
            "range": "stddev: 7.192304685553908e-7",
            "extra": "mean: 4.507807975494252 usec\nrounds: 40198"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 508795.3660733279,
            "unit": "iter/sec",
            "range": "stddev: 4.185741015230952e-7",
            "extra": "mean: 1.9654267052736467 usec\nrounds: 34218"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1712.648460988349,
            "unit": "iter/sec",
            "range": "stddev: 0.0001583305028960138",
            "extra": "mean: 583.890986842047 usec\nrounds: 988"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1047.5250672885702,
            "unit": "iter/sec",
            "range": "stddev: 0.000012937633881821163",
            "extra": "mean: 954.6310930662645 usec\nrounds: 548"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 744.8493007162571,
            "unit": "iter/sec",
            "range": "stddev: 0.00019727358818082865",
            "extra": "mean: 1.3425534521390927 msec\nrounds: 491"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 600.8831823631511,
            "unit": "iter/sec",
            "range": "stddev: 0.00015413615211016447",
            "extra": "mean: 1.664216988179306 msec\nrounds: 423"
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
        "date": 1772056955610,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1331.4684054147413,
            "unit": "iter/sec",
            "range": "stddev: 0.0002686799313469651",
            "extra": "mean: 751.0504912720843 usec\nrounds: 401"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2032.7655673905642,
            "unit": "iter/sec",
            "range": "stddev: 0.00004892388617651468",
            "extra": "mean: 491.9406428571532 usec\nrounds: 784"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 879.0690396545183,
            "unit": "iter/sec",
            "range": "stddev: 0.00026657958862277555",
            "extra": "mean: 1.137567079365016 msec\nrounds: 819"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1998.8886743367764,
            "unit": "iter/sec",
            "range": "stddev: 0.00006237857521531175",
            "extra": "mean: 500.27798588222834 usec\nrounds: 850"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 987.192466028268,
            "unit": "iter/sec",
            "range": "stddev: 0.0009693329961371599",
            "extra": "mean: 1.0129736950113286 msec\nrounds: 882"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2045.2619709122991,
            "unit": "iter/sec",
            "range": "stddev: 0.00002696857153271457",
            "extra": "mean: 488.93492091575195 usec\nrounds: 961"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1355.0232609316126,
            "unit": "iter/sec",
            "range": "stddev: 0.00007732929409555744",
            "extra": "mean: 737.9947111110661 usec\nrounds: 630"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1036.1138287209217,
            "unit": "iter/sec",
            "range": "stddev: 0.00003763680622211121",
            "extra": "mean: 965.1449216101053 usec\nrounds: 944"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 328.641044888683,
            "unit": "iter/sec",
            "range": "stddev: 0.00016725234935725626",
            "extra": "mean: 3.0428335582328714 msec\nrounds: 249"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 848.9531083806072,
            "unit": "iter/sec",
            "range": "stddev: 0.000050625465722151176",
            "extra": "mean: 1.1779213600001033 msec\nrounds: 450"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 729.2770792756743,
            "unit": "iter/sec",
            "range": "stddev: 0.00012282005761364413",
            "extra": "mean: 1.3712209370315198 msec\nrounds: 667"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1422.6157543988008,
            "unit": "iter/sec",
            "range": "stddev: 0.00003102999693141566",
            "extra": "mean: 702.9304975064059 usec\nrounds: 802"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1150.9383572475742,
            "unit": "iter/sec",
            "range": "stddev: 0.00008378470544549273",
            "extra": "mean: 868.8562629813315 usec\nrounds: 597"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1022.2249779679055,
            "unit": "iter/sec",
            "range": "stddev: 0.000023604171763859737",
            "extra": "mean: 978.258232339336 usec\nrounds: 637"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1259.817215829934,
            "unit": "iter/sec",
            "range": "stddev: 0.0000841944853321879",
            "extra": "mean: 793.7659427373571 usec\nrounds: 716"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 1985.1261608438554,
            "unit": "iter/sec",
            "range": "stddev: 0.00005096079879289401",
            "extra": "mean: 503.7463208761054 usec\nrounds: 776"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 722.3429474385282,
            "unit": "iter/sec",
            "range": "stddev: 0.00012486494726596855",
            "extra": "mean: 1.3843839737704375 msec\nrounds: 610"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1031.3791849781915,
            "unit": "iter/sec",
            "range": "stddev: 0.000024482438781926368",
            "extra": "mean: 969.5755106994378 usec\nrounds: 701"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27197.630554909338,
            "unit": "iter/sec",
            "range": "stddev: 0.000025211699528803616",
            "extra": "mean: 36.767908806654994 usec\nrounds: 11832"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 47099.62340694963,
            "unit": "iter/sec",
            "range": "stddev: 0.0000019453545642147393",
            "extra": "mean: 21.23159226475786 usec\nrounds: 18073"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 582.5662737513428,
            "unit": "iter/sec",
            "range": "stddev: 0.0001236920734572167",
            "extra": "mean: 1.7165428983052162 msec\nrounds: 413"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1667.448358950663,
            "unit": "iter/sec",
            "range": "stddev: 0.000169814461674852",
            "extra": "mean: 599.7187227011378 usec\nrounds: 696"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.59709712664575,
            "unit": "iter/sec",
            "range": "stddev: 0.000445728920473004",
            "extra": "mean: 53.77183294736947 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 483.60627910520446,
            "unit": "iter/sec",
            "range": "stddev: 0.00021648413382346804",
            "extra": "mean: 2.0677978000001493 msec\nrounds: 245"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1346.4144596982292,
            "unit": "iter/sec",
            "range": "stddev: 0.0002482904601129783",
            "extra": "mean: 742.71335456701 usec\nrounds: 832"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2025.7974267863415,
            "unit": "iter/sec",
            "range": "stddev: 0.000021256831934886206",
            "extra": "mean: 493.63277234800677 usec\nrounds: 839"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1445.7688182921518,
            "unit": "iter/sec",
            "range": "stddev: 0.00008578166097064334",
            "extra": "mean: 691.6735147056729 usec\nrounds: 816"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2096.367428540712,
            "unit": "iter/sec",
            "range": "stddev: 0.000017897493823223295",
            "extra": "mean: 477.0156158627704 usec\nrounds: 643"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 726.3868796248764,
            "unit": "iter/sec",
            "range": "stddev: 0.00011957249847537244",
            "extra": "mean: 1.376676848178238 msec\nrounds: 494"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1030.9672238857875,
            "unit": "iter/sec",
            "range": "stddev: 0.00002467507814625015",
            "extra": "mean: 969.9629404618026 usec\nrounds: 823"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 884.4090881756591,
            "unit": "iter/sec",
            "range": "stddev: 0.00011564526041482236",
            "extra": "mean: 1.1306984667726327 msec\nrounds: 632"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1034.175376188868,
            "unit": "iter/sec",
            "range": "stddev: 0.000026112563989704426",
            "extra": "mean: 966.9539838447799 usec\nrounds: 619"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 847.889781755189,
            "unit": "iter/sec",
            "range": "stddev: 0.00012331045563285963",
            "extra": "mean: 1.1793985745764415 msec\nrounds: 590"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1030.7405254308107,
            "unit": "iter/sec",
            "range": "stddev: 0.000025554943434993203",
            "extra": "mean: 970.1762716490047 usec\nrounds: 843"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1634.4519392557502,
            "unit": "iter/sec",
            "range": "stddev: 0.00006785313707875128",
            "extra": "mean: 611.825882414965 usec\nrounds: 944"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2076.887059542531,
            "unit": "iter/sec",
            "range": "stddev: 0.000021773993260761508",
            "extra": "mean: 481.4898313345294 usec\nrounds: 1334"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 732.1629941127558,
            "unit": "iter/sec",
            "range": "stddev: 0.0003219773213470955",
            "extra": "mean: 1.365816092920419 msec\nrounds: 452"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 862.8285167186355,
            "unit": "iter/sec",
            "range": "stddev: 0.00030131469907923066",
            "extra": "mean: 1.1589788476197243 msec\nrounds: 210"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1616.2164287544638,
            "unit": "iter/sec",
            "range": "stddev: 0.00006913192482288731",
            "extra": "mean: 618.7290156248748 usec\nrounds: 896"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2034.0832132106004,
            "unit": "iter/sec",
            "range": "stddev: 0.000019860209987965726",
            "extra": "mean: 491.6219717587651 usec\nrounds: 779"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1453.7745442151527,
            "unit": "iter/sec",
            "range": "stddev: 0.0000893387653063429",
            "extra": "mean: 687.8645688075854 usec\nrounds: 763"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2080.79803105922,
            "unit": "iter/sec",
            "range": "stddev: 0.00002109257993323002",
            "extra": "mean: 480.5848453686564 usec\nrounds: 1371"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 200.04933921543648,
            "unit": "iter/sec",
            "range": "stddev: 0.002375073201858575",
            "extra": "mean: 4.998766823833811 msec\nrounds: 193"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 541.0572710887527,
            "unit": "iter/sec",
            "range": "stddev: 0.00006357593326167574",
            "extra": "mean: 1.8482331786942465 msec\nrounds: 291"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 827.2163780865138,
            "unit": "iter/sec",
            "range": "stddev: 0.00018063279791581406",
            "extra": "mean: 1.2088735504888852 msec\nrounds: 614"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1445.0089722144057,
            "unit": "iter/sec",
            "range": "stddev: 0.00007935330182881616",
            "extra": "mean: 692.0372255319278 usec\nrounds: 705"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 936.8910584767407,
            "unit": "iter/sec",
            "range": "stddev: 0.00011828452020979635",
            "extra": "mean: 1.0673599571180303 msec\nrounds: 583"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1067.2294148644103,
            "unit": "iter/sec",
            "range": "stddev: 0.000042853789490512046",
            "extra": "mean: 937.0056578950725 usec\nrounds: 570"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5595.473087388084,
            "unit": "iter/sec",
            "range": "stddev: 0.0000587431834277503",
            "extra": "mean: 178.7158984383197 usec\nrounds: 128"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 44523.96602316897,
            "unit": "iter/sec",
            "range": "stddev: 0.0000058877006470396995",
            "extra": "mean: 22.459814102805424 usec\nrounds: 156"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4558.256376464785,
            "unit": "iter/sec",
            "range": "stddev: 0.00007045328812520967",
            "extra": "mean: 219.38213154556328 usec\nrounds: 2349"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 49467.741138610625,
            "unit": "iter/sec",
            "range": "stddev: 0.000013668712904643339",
            "extra": "mean: 20.215194326297603 usec\nrounds: 7755"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 82301.90799364878,
            "unit": "iter/sec",
            "range": "stddev: 0.00001798998118747622",
            "extra": "mean: 12.150386599508359 usec\nrounds: 22059"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 508130.27816251817,
            "unit": "iter/sec",
            "range": "stddev: 4.649476485376127e-7",
            "extra": "mean: 1.9679992375501867 usec\nrounds: 36723"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 221706.4883596607,
            "unit": "iter/sec",
            "range": "stddev: 7.305821925511023e-7",
            "extra": "mean: 4.510467904654924 usec\nrounds: 43511"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 525363.2150853697,
            "unit": "iter/sec",
            "range": "stddev: 4.2479160929948263e-7",
            "extra": "mean: 1.9034450286693625 usec\nrounds: 33472"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1803.5429874365377,
            "unit": "iter/sec",
            "range": "stddev: 0.0000756312614846938",
            "extra": "mean: 554.4641890800441 usec\nrounds: 989"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1043.9679474765014,
            "unit": "iter/sec",
            "range": "stddev: 0.000021088195403930584",
            "extra": "mean: 957.8838147447137 usec\nrounds: 529"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 755.6055533311213,
            "unit": "iter/sec",
            "range": "stddev: 0.0003577902999595917",
            "extra": "mean: 1.3234418349513903 msec\nrounds: 515"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 609.6208759851011,
            "unit": "iter/sec",
            "range": "stddev: 0.0003786320590883257",
            "extra": "mean: 1.64036377262192 msec\nrounds: 431"
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
        "date": 1772102166507,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1319.288448543844,
            "unit": "iter/sec",
            "range": "stddev: 0.00027850116285470434",
            "extra": "mean: 757.9843521738885 usec\nrounds: 460"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2094.3064831887564,
            "unit": "iter/sec",
            "range": "stddev: 0.0000190822101925332",
            "extra": "mean: 477.48503288659856 usec\nrounds: 821"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 961.7746881983634,
            "unit": "iter/sec",
            "range": "stddev: 0.0001312444593338691",
            "extra": "mean: 1.0397445600000577 msec\nrounds: 800"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 1999.777870117904,
            "unit": "iter/sec",
            "range": "stddev: 0.00004305011867072331",
            "extra": "mean: 500.0555386389196 usec\nrounds: 867"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 999.2248408384982,
            "unit": "iter/sec",
            "range": "stddev: 0.0012182840437272293",
            "extra": "mean: 1.0007757604993601 msec\nrounds: 881"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2091.211017131846,
            "unit": "iter/sec",
            "range": "stddev: 0.00003197656359834058",
            "extra": "mean: 478.1918189066965 usec\nrounds: 878"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1201.0017082625975,
            "unit": "iter/sec",
            "range": "stddev: 0.0002886437456933044",
            "extra": "mean: 832.6382827936422 usec\nrounds: 587"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1013.3887533486121,
            "unit": "iter/sec",
            "range": "stddev: 0.00011641061669520324",
            "extra": "mean: 986.7881370260222 usec\nrounds: 1029"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 362.91623947701265,
            "unit": "iter/sec",
            "range": "stddev: 0.0001626518652320209",
            "extra": "mean: 2.755456745173677 msec\nrounds: 259"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 857.9762443537784,
            "unit": "iter/sec",
            "range": "stddev: 0.00005296837606774114",
            "extra": "mean: 1.1655334358973926 msec\nrounds: 468"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 761.3763170120811,
            "unit": "iter/sec",
            "range": "stddev: 0.0001286322441707123",
            "extra": "mean: 1.3134109607248692 msec\nrounds: 662"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1571.5038081065165,
            "unit": "iter/sec",
            "range": "stddev: 0.00011010384904626834",
            "extra": "mean: 636.3331700766836 usec\nrounds: 782"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1193.7334872624283,
            "unit": "iter/sec",
            "range": "stddev: 0.00008772260126993567",
            "extra": "mean: 837.7079228071968 usec\nrounds: 570"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1010.6548509596287,
            "unit": "iter/sec",
            "range": "stddev: 0.000028718820672746596",
            "extra": "mean: 989.4574780405876 usec\nrounds: 592"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1272.8018396544994,
            "unit": "iter/sec",
            "range": "stddev: 0.0000775260522866184",
            "extra": "mean: 785.6682547469046 usec\nrounds: 632"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2029.3782306259077,
            "unit": "iter/sec",
            "range": "stddev: 0.00003649934203994657",
            "extra": "mean: 492.7617656032393 usec\nrounds: 721"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 733.4941028888692,
            "unit": "iter/sec",
            "range": "stddev: 0.00011906753913211467",
            "extra": "mean: 1.363337477508676 msec\nrounds: 578"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1048.5983055539273,
            "unit": "iter/sec",
            "range": "stddev: 0.00002309552774328644",
            "extra": "mean: 953.654030054669 usec\nrounds: 732"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 23981.255302933856,
            "unit": "iter/sec",
            "range": "stddev: 0.000027224842140277288",
            "extra": "mean: 41.6992349803165 usec\nrounds: 10120"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 40413.52197994708,
            "unit": "iter/sec",
            "range": "stddev: 0.000002038194230483579",
            "extra": "mean: 24.74419330481004 usec\nrounds: 14966"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 644.3170125550163,
            "unit": "iter/sec",
            "range": "stddev: 0.00014382562800638855",
            "extra": "mean: 1.5520310352112783 msec\nrounds: 426"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1674.484145527433,
            "unit": "iter/sec",
            "range": "stddev: 0.0001832333777905916",
            "extra": "mean: 597.1988463856238 usec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 19.37655064721856,
            "unit": "iter/sec",
            "range": "stddev: 0.0007147631655053401",
            "extra": "mean: 51.608772800000224 msec\nrounds: 20"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 468.4081930359685,
            "unit": "iter/sec",
            "range": "stddev: 0.0002786732163727776",
            "extra": "mean: 2.134890069959155 msec\nrounds: 243"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1516.9603563285475,
            "unit": "iter/sec",
            "range": "stddev: 0.00008484965830479943",
            "extra": "mean: 659.2130083216342 usec\nrounds: 721"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2056.2213652100395,
            "unit": "iter/sec",
            "range": "stddev: 0.00001984156059298382",
            "extra": "mean: 486.3289609374581 usec\nrounds: 768"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1491.6539086462103,
            "unit": "iter/sec",
            "range": "stddev: 0.0000735735519139473",
            "extra": "mean: 670.3967952643762 usec\nrounds: 718"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2092.389048114826,
            "unit": "iter/sec",
            "range": "stddev: 0.000022430156149196516",
            "extra": "mean: 477.92259326771335 usec\nrounds: 713"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 723.5842669686238,
            "unit": "iter/sec",
            "range": "stddev: 0.00011831726376321816",
            "extra": "mean: 1.382009042553384 msec\nrounds: 470"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1039.7490693062746,
            "unit": "iter/sec",
            "range": "stddev: 0.000052957488104023184",
            "extra": "mean: 961.7705170606256 usec\nrounds: 762"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 878.9579492378829,
            "unit": "iter/sec",
            "range": "stddev: 0.00022527699642742766",
            "extra": "mean: 1.1377108550722694 msec\nrounds: 552"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1054.8603905088105,
            "unit": "iter/sec",
            "range": "stddev: 0.00002699175287575497",
            "extra": "mean: 947.9927476636518 usec\nrounds: 535"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 869.4116915235526,
            "unit": "iter/sec",
            "range": "stddev: 0.00009382909244491488",
            "extra": "mean: 1.1502030738137476 msec\nrounds: 569"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1032.8078833126763,
            "unit": "iter/sec",
            "range": "stddev: 0.00003892583575683934",
            "extra": "mean: 968.2342826359471 usec\nrounds: 789"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1626.8117441289041,
            "unit": "iter/sec",
            "range": "stddev: 0.00007212348776063147",
            "extra": "mean: 614.6992751982265 usec\nrounds: 883"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2047.7358522751772,
            "unit": "iter/sec",
            "range": "stddev: 0.000037712668227047644",
            "extra": "mean: 488.34423584903806 usec\nrounds: 1166"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 761.2971814509033,
            "unit": "iter/sec",
            "range": "stddev: 0.00014994677559663981",
            "extra": "mean: 1.3135474875845063 msec\nrounds: 443"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 840.7085758648581,
            "unit": "iter/sec",
            "range": "stddev: 0.0007662320618046949",
            "extra": "mean: 1.189472819367014 msec\nrounds: 537"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1623.6255854063118,
            "unit": "iter/sec",
            "range": "stddev: 0.00007495554790180805",
            "extra": "mean: 615.9055443498387 usec\nrounds: 823"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2112.7413740093616,
            "unit": "iter/sec",
            "range": "stddev: 0.000036810853963524516",
            "extra": "mean: 473.31869972437477 usec\nrounds: 726"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1434.8983367484516,
            "unit": "iter/sec",
            "range": "stddev: 0.00016811366616856032",
            "extra": "mean: 696.9134846626472 usec\nrounds: 489"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2075.40954639835,
            "unit": "iter/sec",
            "range": "stddev: 0.000026034774271510935",
            "extra": "mean: 481.8326106938231 usec\nrounds: 1066"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 222.73973695821874,
            "unit": "iter/sec",
            "range": "stddev: 0.000659321833869914",
            "extra": "mean: 4.489544675127181 msec\nrounds: 197"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 528.9439060924799,
            "unit": "iter/sec",
            "range": "stddev: 0.000026107655110486105",
            "extra": "mean: 1.890559638709896 msec\nrounds: 310"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 885.3246733666812,
            "unit": "iter/sec",
            "range": "stddev: 0.00012078035602620818",
            "extra": "mean: 1.1295291208785987 msec\nrounds: 546"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1485.8635067754758,
            "unit": "iter/sec",
            "range": "stddev: 0.00009711833386984482",
            "extra": "mean: 673.0093278689743 usec\nrounds: 610"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 910.0101942088629,
            "unit": "iter/sec",
            "range": "stddev: 0.00017649865728141783",
            "extra": "mean: 1.0988887886793088 msec\nrounds: 530"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1072.6635745386247,
            "unit": "iter/sec",
            "range": "stddev: 0.00008100038263552563",
            "extra": "mean: 932.2587470448235 usec\nrounds: 423"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 7275.888687371101,
            "unit": "iter/sec",
            "range": "stddev: 0.00005868032513020622",
            "extra": "mean: 137.44025547500735 usec\nrounds: 137"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 55353.77449017587,
            "unit": "iter/sec",
            "range": "stddev: 0.00000531063359378073",
            "extra": "mean: 18.065615384141125 usec\nrounds: 169"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 5743.876397569397,
            "unit": "iter/sec",
            "range": "stddev: 0.00006131009257346094",
            "extra": "mean: 174.0984538635205 usec\nrounds: 2666"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 56624.369901083024,
            "unit": "iter/sec",
            "range": "stddev: 0.000010628644454741607",
            "extra": "mean: 17.660240665757474 usec\nrounds: 6669"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 75946.85130037805,
            "unit": "iter/sec",
            "range": "stddev: 0.000017468602710820193",
            "extra": "mean: 13.167102820956872 usec\nrounds: 19461"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 474193.39099469985,
            "unit": "iter/sec",
            "range": "stddev: 4.814417270453993e-7",
            "extra": "mean: 2.1088442373739813 usec\nrounds: 31548"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 201536.02935140554,
            "unit": "iter/sec",
            "range": "stddev: 8.905846195508317e-7",
            "extra": "mean: 4.961891941695268 usec\nrounds: 37452"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 505375.4273822795,
            "unit": "iter/sec",
            "range": "stddev: 4.74402421174245e-7",
            "extra": "mean: 1.978726993474444 usec\nrounds: 31578"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1944.8983920428684,
            "unit": "iter/sec",
            "range": "stddev: 0.00007148231195333413",
            "extra": "mean: 514.1656778016188 usec\nrounds: 928"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1039.7704220962246,
            "unit": "iter/sec",
            "range": "stddev: 0.000027165241626470688",
            "extra": "mean: 961.7507660815687 usec\nrounds: 513"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 817.3586045866228,
            "unit": "iter/sec",
            "range": "stddev: 0.00011931178873504673",
            "extra": "mean: 1.223453199597437 msec\nrounds: 496"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 662.9838142751913,
            "unit": "iter/sec",
            "range": "stddev: 0.00012786835621982095",
            "extra": "mean: 1.508332448648467 msec\nrounds: 370"
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
        "date": 1772116841094,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_get_or_create_user",
            "value": 1327.6735499888011,
            "unit": "iter/sec",
            "range": "stddev: 0.00019559926749327362",
            "extra": "mean: 753.1971997246122 usec\nrounds: 726"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_get_or_create_user",
            "value": 2067.141045910057,
            "unit": "iter/sec",
            "range": "stddev: 0.000020477401636923105",
            "extra": "mean: 483.7599262897665 usec\nrounds: 814"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_filter_runs_by_status",
            "value": 872.8357558139392,
            "unit": "iter/sec",
            "range": "stddev: 0.0007311381909361103",
            "extra": "mean: 1.1456909198999041 msec\nrounds: 799"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_filter_runs_by_status",
            "value": 2057.68835534531,
            "unit": "iter/sec",
            "range": "stddev: 0.000032542965259657185",
            "extra": "mean: 485.98224186975364 usec\nrounds: 984"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_latest_runs",
            "value": 1007.7503646476986,
            "unit": "iter/sec",
            "range": "stddev: 0.00008049833393485911",
            "extra": "mean: 992.3092415348241 usec\nrounds: 886"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_latest_runs",
            "value": 2076.8473250561356,
            "unit": "iter/sec",
            "range": "stddev: 0.000023988588356422895",
            "extra": "mean: 481.49904325440525 usec\nrounds: 971"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_list_mutation",
            "value": 1303.1064563862346,
            "unit": "iter/sec",
            "range": "stddev: 0.00007456222397469905",
            "extra": "mean: 767.3970112719667 usec\nrounds: 621"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_list_mutation",
            "value": 1018.2355979307576,
            "unit": "iter/sec",
            "range": "stddev: 0.000023631712681538107",
            "extra": "mean: 982.0909836900067 usec\nrounds: 981"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_batch_events",
            "value": 332.5166879954294,
            "unit": "iter/sec",
            "range": "stddev: 0.00012345220402794997",
            "extra": "mean: 3.007367858823812 msec\nrounds: 255"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_batch_events",
            "value": 857.2137557657827,
            "unit": "iter/sec",
            "range": "stddev: 0.00005678607373177858",
            "extra": "mean: 1.166570173744658 msec\nrounds: 518"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_notification_feed",
            "value": 729.2256885276511,
            "unit": "iter/sec",
            "range": "stddev: 0.00011571258669555659",
            "extra": "mean: 1.3713175711336472 msec\nrounds: 485"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_notification_feed",
            "value": 1464.032300491418,
            "unit": "iter/sec",
            "range": "stddev: 0.000057940248500652155",
            "extra": "mean: 683.0450391458845 usec\nrounds: 843"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_status_update",
            "value": 1145.3474152208096,
            "unit": "iter/sec",
            "range": "stddev: 0.00007268510004597758",
            "extra": "mean: 873.0975306799917 usec\nrounds: 603"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_status_update",
            "value": 1030.4622458667122,
            "unit": "iter/sec",
            "range": "stddev: 0.00002536454209077458",
            "extra": "mean: 970.4382707965291 usec\nrounds: 565"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_comment_with_collections",
            "value": 1280.0816625130244,
            "unit": "iter/sec",
            "range": "stddev: 0.00006336975539041024",
            "extra": "mean: 781.2001603372905 usec\nrounds: 711"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_comment_with_collections",
            "value": 2036.4271529561024,
            "unit": "iter/sec",
            "range": "stddev: 0.000022024232961317075",
            "extra": "mean: 491.0561119499845 usec\nrounds: 795"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_multi_model_lookup",
            "value": 723.036681375738,
            "unit": "iter/sec",
            "range": "stddev: 0.00010696512658734226",
            "extra": "mean: 1.383055695178947 msec\nrounds: 643"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_multi_model_lookup",
            "value": 1029.7892527094584,
            "unit": "iter/sec",
            "range": "stddev: 0.00002394959810827335",
            "extra": "mean: 971.0724765954972 usec\nrounds: 705"
          },
          {
            "name": "benchmarks/bench_argus.py::test_cqlengine_argus_model_instantiation",
            "value": 27349.02726227067,
            "unit": "iter/sec",
            "range": "stddev: 0.000024469618860396924",
            "extra": "mean: 36.56437175663463 usec\nrounds: 11408"
          },
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 46862.09197144267,
            "unit": "iter/sec",
            "range": "stddev: 0.0000021032109245813855",
            "extra": "mean: 21.33920953869048 usec\nrounds: 18011"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_10",
            "value": 585.9488554257478,
            "unit": "iter/sec",
            "range": "stddev: 0.00009518270989665517",
            "extra": "mean: 1.7066335922329 msec\nrounds: 412"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_10",
            "value": 1714.5221630574445,
            "unit": "iter/sec",
            "range": "stddev: 0.00017670094812276775",
            "extra": "mean: 583.2528861666838 usec\nrounds: 694"
          },
          {
            "name": "benchmarks/bench_batch.py::test_cqlengine_batch_insert_100",
            "value": 18.875478074755446,
            "unit": "iter/sec",
            "range": "stddev: 0.0004192433258731758",
            "extra": "mean: 52.978790578948356 msec\nrounds: 19"
          },
          {
            "name": "benchmarks/bench_batch.py::test_coodie_batch_insert_100",
            "value": 487.01140963256404,
            "unit": "iter/sec",
            "range": "stddev: 0.0003048487548325606",
            "extra": "mean: 2.0533399838711603 msec\nrounds: 248"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_write",
            "value": 1394.3099571354744,
            "unit": "iter/sec",
            "range": "stddev: 0.0002166997692424508",
            "extra": "mean: 717.2006445786558 usec\nrounds: 664"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_write",
            "value": 2034.5759994472521,
            "unit": "iter/sec",
            "range": "stddev: 0.0000171628885346366",
            "extra": "mean: 491.5028980346162 usec\nrounds: 814"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_read",
            "value": 1441.3511356286072,
            "unit": "iter/sec",
            "range": "stddev: 0.00006984124056867183",
            "extra": "mean: 693.7934659231227 usec\nrounds: 807"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_read",
            "value": 2091.7163847739107,
            "unit": "iter/sec",
            "range": "stddev: 0.00001577512916192129",
            "extra": "mean: 478.0762857140826 usec\nrounds: 770"
          },
          {
            "name": "benchmarks/bench_collections.py::test_cqlengine_collection_roundtrip",
            "value": 715.4629630505837,
            "unit": "iter/sec",
            "range": "stddev: 0.00010108144723807525",
            "extra": "mean: 1.397696389113156 msec\nrounds: 496"
          },
          {
            "name": "benchmarks/bench_collections.py::test_coodie_collection_roundtrip",
            "value": 1032.5457466016542,
            "unit": "iter/sec",
            "range": "stddev: 0.00002520120429748372",
            "extra": "mean: 968.4800923263983 usec\nrounds: 834"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_single_delete",
            "value": 898.2085826604506,
            "unit": "iter/sec",
            "range": "stddev: 0.00007781139284381621",
            "extra": "mean: 1.113327148398035 msec\nrounds: 593"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_single_delete",
            "value": 1032.0665830388027,
            "unit": "iter/sec",
            "range": "stddev: 0.000025090295850421447",
            "extra": "mean: 968.9297342189044 usec\nrounds: 602"
          },
          {
            "name": "benchmarks/bench_delete.py::test_cqlengine_bulk_delete",
            "value": 836.1304886023211,
            "unit": "iter/sec",
            "range": "stddev: 0.00009157345234882912",
            "extra": "mean: 1.1959855711894969 msec\nrounds: 597"
          },
          {
            "name": "benchmarks/bench_delete.py::test_coodie_bulk_delete",
            "value": 1041.5788198707983,
            "unit": "iter/sec",
            "range": "stddev: 0.000023850952496636143",
            "extra": "mean: 960.0809664352087 usec\nrounds: 864"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_single_insert",
            "value": 1610.145905275068,
            "unit": "iter/sec",
            "range": "stddev: 0.00006244525313889816",
            "extra": "mean: 621.0617290792451 usec\nrounds: 956"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_single_insert",
            "value": 2091.579159452642,
            "unit": "iter/sec",
            "range": "stddev: 0.000016696720720729134",
            "extra": "mean: 478.1076515706419 usec\nrounds: 1369"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_if_not_exists",
            "value": 717.9932856214404,
            "unit": "iter/sec",
            "range": "stddev: 0.0003415476383686109",
            "extra": "mean: 1.392770684665214 msec\nrounds: 463"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_if_not_exists",
            "value": 835.2266459363657,
            "unit": "iter/sec",
            "range": "stddev: 0.00033220937964893553",
            "extra": "mean: 1.1972798100555189 msec\nrounds: 537"
          },
          {
            "name": "benchmarks/bench_insert.py::test_cqlengine_insert_with_ttl",
            "value": 1557.8533926828495,
            "unit": "iter/sec",
            "range": "stddev: 0.00014125339147084693",
            "extra": "mean: 641.908927179505 usec\nrounds: 975"
          },
          {
            "name": "benchmarks/bench_insert.py::test_coodie_insert_with_ttl",
            "value": 2030.7578297546218,
            "unit": "iter/sec",
            "range": "stddev: 0.000018683704375010583",
            "extra": "mean: 492.42700697642067 usec\nrounds: 860"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_get_by_pk",
            "value": 1493.6666115621722,
            "unit": "iter/sec",
            "range": "stddev: 0.00006410306177826187",
            "extra": "mean: 669.4934413470861 usec\nrounds: 861"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_get_by_pk",
            "value": 2071.3714328248493,
            "unit": "iter/sec",
            "range": "stddev: 0.0000180863683816498",
            "extra": "mean: 482.7719375448961 usec\nrounds: 1393"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_secondary_index",
            "value": 194.71195858622548,
            "unit": "iter/sec",
            "range": "stddev: 0.0019470861538128652",
            "extra": "mean: 5.135791387754769 msec\nrounds: 196"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_secondary_index",
            "value": 543.0619188040266,
            "unit": "iter/sec",
            "range": "stddev: 0.00007147680003287628",
            "extra": "mean: 1.8414106483516244 msec\nrounds: 364"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_filter_limit",
            "value": 759.4548257072221,
            "unit": "iter/sec",
            "range": "stddev: 0.00017982611025194815",
            "extra": "mean: 1.3167340125448235 msec\nrounds: 558"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_filter_limit",
            "value": 1545.8303325605425,
            "unit": "iter/sec",
            "range": "stddev: 0.00010920846099713462",
            "extra": "mean: 646.9015253074903 usec\nrounds: 731"
          },
          {
            "name": "benchmarks/bench_read.py::test_cqlengine_count",
            "value": 949.3548184658267,
            "unit": "iter/sec",
            "range": "stddev: 0.00006699202209921113",
            "extra": "mean: 1.0533469473679153 msec\nrounds: 570"
          },
          {
            "name": "benchmarks/bench_read.py::test_coodie_count",
            "value": 1055.3458556795933,
            "unit": "iter/sec",
            "range": "stddev: 0.00004643006474300292",
            "extra": "mean: 947.5566655407451 usec\nrounds: 592"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_create",
            "value": 5613.248897324321,
            "unit": "iter/sec",
            "range": "stddev: 0.00005819740526406795",
            "extra": "mean: 178.14994814797402 usec\nrounds: 135"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_create",
            "value": 45120.65496560607,
            "unit": "iter/sec",
            "range": "stddev: 0.00000567398186913328",
            "extra": "mean: 22.16279885037719 usec\nrounds: 174"
          },
          {
            "name": "benchmarks/bench_schema.py::test_cqlengine_sync_table_noop",
            "value": 4530.521010059001,
            "unit": "iter/sec",
            "range": "stddev: 0.00005952612680536822",
            "extra": "mean: 220.72516555595377 usec\nrounds: 2851"
          },
          {
            "name": "benchmarks/bench_schema.py::test_coodie_sync_table_noop",
            "value": 44714.645843391154,
            "unit": "iter/sec",
            "range": "stddev: 0.00001178437151025893",
            "extra": "mean: 22.364037132316916 usec\nrounds: 7002"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_instantiation",
            "value": 83477.11932347814,
            "unit": "iter/sec",
            "range": "stddev: 0.000017932336193721432",
            "extra": "mean: 11.979330481265754 usec\nrounds: 22440"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 502063.32769881224,
            "unit": "iter/sec",
            "range": "stddev: 4.2951129816010864e-7",
            "extra": "mean: 1.9917806078039222 usec\nrounds: 37809"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_cqlengine_model_serialization",
            "value": 225229.60011902204,
            "unit": "iter/sec",
            "range": "stddev: 6.995231447445255e-7",
            "extra": "mean: 4.439913756768881 usec\nrounds: 43644"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 507140.8731559777,
            "unit": "iter/sec",
            "range": "stddev: 4.3553788792699297e-7",
            "extra": "mean: 1.9718386999196518 usec\nrounds: 36336"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_partial_update",
            "value": 1839.6027445464906,
            "unit": "iter/sec",
            "range": "stddev: 0.00006182010125464703",
            "extra": "mean: 543.5956230031205 usec\nrounds: 939"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_partial_update",
            "value": 1046.7253457328748,
            "unit": "iter/sec",
            "range": "stddev: 0.000012932026928274014",
            "extra": "mean: 955.3604525548585 usec\nrounds: 548"
          },
          {
            "name": "benchmarks/bench_update.py::test_cqlengine_update_if_condition",
            "value": 762.2703980361472,
            "unit": "iter/sec",
            "range": "stddev: 0.0003247251390305574",
            "extra": "mean: 1.31187043675882 msec\nrounds: 506"
          },
          {
            "name": "benchmarks/bench_update.py::test_coodie_update_if_condition",
            "value": 592.7793478794295,
            "unit": "iter/sec",
            "range": "stddev: 0.000432367323990398",
            "extra": "mean: 1.6869683526886274 msec\nrounds: 465"
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
          "id": "d56cc561a3ac772f4dc31a2e1364e379789f4103",
          "message": "feat(usertype): add full UDT support with frozen UDTs, nested types, and driver integration\n\nEnables modeling Cassandra user-defined types (UDTs) as Pydantic models via the UserType base class,\nbringing coodie's type-safe ORM to complex composite data structures.\nFrozen semantics match cqlengine's behavior while leveraging Pydantic's validation.\nIncludes CQL DDL generation with dependency ordering, serialization round-trips,\nbenchmarks comparing performance against cqlengine, and comprehensive documentation\ncovering migration patterns and frozen collection semantics.\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-27T16:06:20+02:00",
          "tree_id": "dbfee4f230e1cd64b62a7234d9ed5dad3d8abb81",
          "url": "https://github.com/fruch/coodie/commit/d56cc561a3ac772f4dc31a2e1364e379789f4103"
        },
        "date": 1772201213053,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 79975.43210203783,
            "unit": "iter/sec",
            "range": "stddev: 8.827191033216893e-7",
            "extra": "mean: 12.503839913289063 usec\nrounds: 8764"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 529648.5484145145,
            "unit": "iter/sec",
            "range": "stddev: 5.64246717585607e-7",
            "extra": "mean: 1.8880444456866108 usec\nrounds: 35594"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 666619.3343712304,
            "unit": "iter/sec",
            "range": "stddev: 3.024924852996252e-7",
            "extra": "mean: 1.5001065052264366 usec\nrounds: 40552"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_serialization",
            "value": 937194.000405971,
            "unit": "iter/sec",
            "range": "stddev: 2.374159916393722e-7",
            "extra": "mean: 1.067014939880988 usec\nrounds: 111112"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_instantiation",
            "value": 984367.4146917526,
            "unit": "iter/sec",
            "range": "stddev: 2.1983695338126337e-7",
            "extra": "mean: 1.0158808439561589 usec\nrounds: 87398"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_nested_udt_serialization",
            "value": 829416.1876878095,
            "unit": "iter/sec",
            "range": "stddev: 2.4419085786397753e-7",
            "extra": "mean: 1.2056673294353375 usec\nrounds: 88520"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_ddl_generation",
            "value": 189556.84605644984,
            "unit": "iter/sec",
            "range": "stddev: 5.566941490636374e-7",
            "extra": "mean: 5.275462325967383 usec\nrounds: 7326"
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
          "id": "8501cdd890e955c82b5c4c32b76d8a5848bd4b53",
          "message": "feat(ci): extract resolve-conflicts script, add Bats tests, document act commands\n\n- Extract conflict-resolution loop into .github/scripts/resolve-conflicts.sh\n  (Phase 2 of github-actions-testing-plan.md: shell scripts in .github/scripts/)\n- Update pr-rebase-squash.yml to call bash .github/scripts/resolve-conflicts.sh\n  (npm install stays in the workflow; resolution logic lives in the script)\n- Add 9 Bats tests in tests/workflows/test_resolve_conflicts.bats:\n  no conflicts, Copilot resolves, empty response, markers still present,\n  fenced-block stripping, multi-round rebase, MAX_ROUNDS exceeded\n- Add testing docs to CONTRIBUTING.md:\n  bats/pytest commands, workflow_dispatch gh-workflow-run (preferred),\n  and act command with event payload template\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-28T21:49:16+02:00",
          "tree_id": "31aad9dd9842af1b1684028fafbc5b15f282cd88",
          "url": "https://github.com/fruch/coodie/commit/8501cdd890e955c82b5c4c32b76d8a5848bd4b53"
        },
        "date": 1772308196726,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 52952.85080363864,
            "unit": "iter/sec",
            "range": "stddev: 0.000001903274642150638",
            "extra": "mean: 18.88472452046501 usec\nrounds: 8919"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 552497.605151093,
            "unit": "iter/sec",
            "range": "stddev: 4.0314716926527934e-7",
            "extra": "mean: 1.809962596537459 usec\nrounds: 50824"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 586122.8590104614,
            "unit": "iter/sec",
            "range": "stddev: 5.222644560408868e-7",
            "extra": "mean: 1.7061269401576975 usec\nrounds: 57531"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_serialization",
            "value": 814728.4960397246,
            "unit": "iter/sec",
            "range": "stddev: 3.430682721484332e-7",
            "extra": "mean: 1.227402754243718 usec\nrounds: 158958"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_instantiation",
            "value": 927346.0470888306,
            "unit": "iter/sec",
            "range": "stddev: 3.3987188694459854e-7",
            "extra": "mean: 1.0783461073018517 usec\nrounds: 95612"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_nested_udt_serialization",
            "value": 732444.8690393802,
            "unit": "iter/sec",
            "range": "stddev: 3.988477732317359e-7",
            "extra": "mean: 1.3652904706828313 usec\nrounds: 127796"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_ddl_generation",
            "value": 184076.0816737709,
            "unit": "iter/sec",
            "range": "stddev: 0.0000010932552939594178",
            "extra": "mean: 5.432536323606949 usec\nrounds: 6800"
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
          "id": "e84ff7e9f023b723105006c470d9d209d767175c",
          "message": "docs(perf): add Phase 6 dict_factory analysis to performance plan (§13C)\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-28T21:53:24+02:00",
          "tree_id": "95b5afcbb57477d74295120b716b4dc57b779c35",
          "url": "https://github.com/fruch/coodie/commit/e84ff7e9f023b723105006c470d9d209d767175c"
        },
        "date": 1772308442843,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 52665.533008989485,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018215912539998978",
            "extra": "mean: 18.987750486248945 usec\nrounds: 8224"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 580461.1344999097,
            "unit": "iter/sec",
            "range": "stddev: 4.1529710839428993e-7",
            "extra": "mean: 1.7227682278186287 usec\nrounds: 42490"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 623579.6414169982,
            "unit": "iter/sec",
            "range": "stddev: 4.142689001378457e-7",
            "extra": "mean: 1.6036444001405157 usec\nrounds: 47126"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_serialization",
            "value": 842829.6866396889,
            "unit": "iter/sec",
            "range": "stddev: 3.4576879313150125e-7",
            "extra": "mean: 1.1864793277357606 usec\nrounds: 153563"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_instantiation",
            "value": 932409.7452662613,
            "unit": "iter/sec",
            "range": "stddev: 3.1061414595952236e-7",
            "extra": "mean: 1.0724898630423876 usec\nrounds: 91744"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_nested_udt_serialization",
            "value": 736671.0751821117,
            "unit": "iter/sec",
            "range": "stddev: 3.644106513223114e-7",
            "extra": "mean: 1.3574579397634028 usec\nrounds: 102365"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_ddl_generation",
            "value": 189489.4926117755,
            "unit": "iter/sec",
            "range": "stddev: 6.980307183958852e-7",
            "extra": "mean: 5.277337472472903 usec\nrounds: 7731"
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
          "id": "9f03612c1782c7b7ca2a6cd03fe64edbbbbabbe8",
          "message": "feat(drivers): add explicit SSL parameters to init_coodie/init_coodie_async (Phase 2+3)\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-28T22:04:07+02:00",
          "tree_id": "c0a34334639a4d855fd3769cb3ec864db88c1c38",
          "url": "https://github.com/fruch/coodie/commit/9f03612c1782c7b7ca2a6cd03fe64edbbbbabbe8"
        },
        "date": 1772309086220,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 53374.06261791804,
            "unit": "iter/sec",
            "range": "stddev: 0.0000015641529795804126",
            "extra": "mean: 18.735692037508365 usec\nrounds: 12810"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 576941.4090326291,
            "unit": "iter/sec",
            "range": "stddev: 4.6317244771623345e-7",
            "extra": "mean: 1.733278257278712 usec\nrounds: 55729"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 604839.6289506222,
            "unit": "iter/sec",
            "range": "stddev: 3.96179171936383e-7",
            "extra": "mean: 1.6533308204936383 usec\nrounds: 60489"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_serialization",
            "value": 824621.0187891856,
            "unit": "iter/sec",
            "range": "stddev: 3.433096794360781e-7",
            "extra": "mean: 1.212678281555724 usec\nrounds: 155232"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_instantiation",
            "value": 953415.4242127949,
            "unit": "iter/sec",
            "range": "stddev: 3.0341887392703737e-7",
            "extra": "mean: 1.048860732272785 usec\nrounds: 129786"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_nested_udt_serialization",
            "value": 702281.9135939034,
            "unit": "iter/sec",
            "range": "stddev: 3.4713495087323556e-7",
            "extra": "mean: 1.4239295938614376 usec\nrounds: 131338"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_ddl_generation",
            "value": 191200.72140517368,
            "unit": "iter/sec",
            "range": "stddev: 9.185922032501682e-7",
            "extra": "mean: 5.230105789616237 usec\nrounds: 7997"
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
          "id": "46f681e8059c325df8ce7a1d2c26e0a9ae2a9f20",
          "message": "feat(ci): use Copilot to summarize CI failures before commenting on PR\n\n  2c16588 --stat && git --no-pager show 46cc2a7 --stat\n\nAdd a Copilot-powered failure summarization step to the self-healing CI workflow. When a PR build fails, the workflow now calls the GitHub Copilot API to generate a human-readable summary of the failure before posting the comment, making it easier to diagnose issues at a glance.\n\nThe summarization logic is extracted into `.github/scripts/summarize-failure.py` so it can be unit-tested in isolation. Tests live in `tests/workflows/test_summarize_failure.py` and cover both successful summarization and fallback behaviour when the API is unavailable.",
          "timestamp": "2026-02-28T22:06:01+02:00",
          "tree_id": "a2a8ae87e3a4fb43b865b0a8391385a71083af53",
          "url": "https://github.com/fruch/coodie/commit/46f681e8059c325df8ce7a1d2c26e0a9ae2a9f20"
        },
        "date": 1772309195050,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 52845.79882470708,
            "unit": "iter/sec",
            "range": "stddev: 0.0000018772676323635863",
            "extra": "mean: 18.922980108921514 usec\nrounds: 8446"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 573204.0429413859,
            "unit": "iter/sec",
            "range": "stddev: 5.095924737924179e-7",
            "extra": "mean: 1.7445794605155236 usec\nrounds: 44821"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 594085.4311413614,
            "unit": "iter/sec",
            "range": "stddev: 3.940784690893697e-7",
            "extra": "mean: 1.6832595912658428 usec\nrounds: 53434"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_serialization",
            "value": 833191.6938912056,
            "unit": "iter/sec",
            "range": "stddev: 3.235303024946946e-7",
            "extra": "mean: 1.2002039954692294 usec\nrounds: 158680"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_instantiation",
            "value": 953452.4503687714,
            "unit": "iter/sec",
            "range": "stddev: 3.31369121344661e-7",
            "extra": "mean: 1.0488200010532513 usec\nrounds: 95795"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_nested_udt_serialization",
            "value": 709703.0481143991,
            "unit": "iter/sec",
            "range": "stddev: 3.7395685640031854e-7",
            "extra": "mean: 1.4090400240732899 usec\nrounds: 96442"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_ddl_generation",
            "value": 192761.2602266143,
            "unit": "iter/sec",
            "range": "stddev: 6.489976138514164e-7",
            "extra": "mean: 5.187764381828477 usec\nrounds: 7805"
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
          "id": "1785810bf316ca4d271d4fe33e86c82a0f513716",
          "message": "fix(ci): remove ruff/linting from demo workflow, rely on repo-level pre-commit\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-28T22:24:48+02:00",
          "tree_id": "19c1eb78a68d3fc4f773bfe3512047b03363f46a",
          "url": "https://github.com/fruch/coodie/commit/1785810bf316ca4d271d4fe33e86c82a0f513716"
        },
        "date": 1772310328345,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 51858.6718361742,
            "unit": "iter/sec",
            "range": "stddev: 0.000001576161042394402",
            "extra": "mean: 19.283178002689347 usec\nrounds: 8101"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 574513.0209201435,
            "unit": "iter/sec",
            "range": "stddev: 4.511702863197201e-7",
            "extra": "mean: 1.7406045878618976 usec\nrounds: 41109"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 599383.290896031,
            "unit": "iter/sec",
            "range": "stddev: 3.7881859116183604e-7",
            "extra": "mean: 1.6683815101102977 usec\nrounds: 47215"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_serialization",
            "value": 828428.053449127,
            "unit": "iter/sec",
            "range": "stddev: 3.3925229696610385e-7",
            "extra": "mean: 1.2071054279687174 usec\nrounds: 147864"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_instantiation",
            "value": 950810.788037146,
            "unit": "iter/sec",
            "range": "stddev: 4.5017515693747185e-7",
            "extra": "mean: 1.0517339649294475 usec\nrounds: 92251"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_nested_udt_serialization",
            "value": 721624.6060000886,
            "unit": "iter/sec",
            "range": "stddev: 3.793712014666381e-7",
            "extra": "mean: 1.3857620592276163 usec\nrounds: 88480"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_ddl_generation",
            "value": 188953.72748633043,
            "unit": "iter/sec",
            "range": "stddev: 7.280644300934445e-7",
            "extra": "mean: 5.2923009950800965 usec\nrounds: 7638"
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
          "id": "fe2320cc007d5c307ea4f412e6042799294263a7",
          "message": "feat(ci): implement plan-phase-continuation GitHub Actions workflow\n\n✗ View commit subjects\n  ac5a788 c67bdee 2>/dev/null | head -10\n  Permission denied and could not request permission from user\n\nImplement a GitHub Actions workflow that automatically detects the next incomplete phase in a plan file after a PR is merged and opens a new PR to continue it.\n\nAdd `parse-plan.py` to parse `docs/plans/*.md` files and extract phase status, along with a comprehensive test suite (`test_parse_plan.py`). The workflow (`plan-continuation.yml`) triggers on PR merge to master (when the PR body references a plan file and phase) or via `workflow_dispatch`, resolves merge conflicts with retries, and opens a follow-up PR targeting the next pending phase.\n\nAdd `.github/PULL_REQUEST_TEMPLATE.md` to standardise PR bodies with `Plan:` and `Phase:` fields. Document the workflow in `CONTRIBUTING.md` and add a `writing-plans` skill covering plan file conventions. Fix several shellcheck violations (SC2070, SC2086, SC2129) and a ruff-format issue surfaced during CI runs.",
          "timestamp": "2026-02-28T22:26:31+02:00",
          "tree_id": "6a68ad3ba09d5a60199f38f96f464a645d63bca0",
          "url": "https://github.com/fruch/coodie/commit/fe2320cc007d5c307ea4f412e6042799294263a7"
        },
        "date": 1772310429029,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 52736.53733766329,
            "unit": "iter/sec",
            "range": "stddev: 0.0000016266780211030138",
            "extra": "mean: 18.96218543127255 usec\nrounds: 8580"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 573191.0255753782,
            "unit": "iter/sec",
            "range": "stddev: 4.370491758215008e-7",
            "extra": "mean: 1.7446190805171526 usec\nrounds: 43437"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 612994.14572181,
            "unit": "iter/sec",
            "range": "stddev: 3.589126487278891e-7",
            "extra": "mean: 1.6313369499189663 usec\nrounds: 42858"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_serialization",
            "value": 835000.3098325076,
            "unit": "iter/sec",
            "range": "stddev: 3.590678342265933e-7",
            "extra": "mean: 1.1976043460398111 usec\nrounds: 146800"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_instantiation",
            "value": 937156.585193087,
            "unit": "iter/sec",
            "range": "stddev: 4.0790581067861707e-7",
            "extra": "mean: 1.0670575395828488 usec\nrounds: 90164"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_nested_udt_serialization",
            "value": 748797.6073834979,
            "unit": "iter/sec",
            "range": "stddev: 3.3765577771945046e-7",
            "extra": "mean: 1.3354743526682349 usec\nrounds: 97476"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_ddl_generation",
            "value": 184727.7737442232,
            "unit": "iter/sec",
            "range": "stddev: 7.002099945654007e-7",
            "extra": "mean: 5.413371144636944 usec\nrounds: 7749"
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
          "id": "75a9fb15aa67b4dd5cfea93c2702212febe82621",
          "message": "docs(plans): add plan for PR conflict detection and /solve command workflows\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-28T22:56:00+02:00",
          "tree_id": "b27036a8ae54aee292d07dbbc7e12ad2d37e69f1",
          "url": "https://github.com/fruch/coodie/commit/75a9fb15aa67b4dd5cfea93c2702212febe82621"
        },
        "date": 1772312197807,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 79080.15831840862,
            "unit": "iter/sec",
            "range": "stddev: 9.898490297025557e-7",
            "extra": "mean: 12.645397040982097 usec\nrounds: 8717"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 566372.7810977976,
            "unit": "iter/sec",
            "range": "stddev: 3.4711486178662017e-7",
            "extra": "mean: 1.7656215718236055 usec\nrounds: 36752"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 689492.5725869529,
            "unit": "iter/sec",
            "range": "stddev: 2.954369803150606e-7",
            "extra": "mean: 1.4503419467566323 usec\nrounds: 45393"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_serialization",
            "value": 923753.6774141251,
            "unit": "iter/sec",
            "range": "stddev: 3.0172430965059155e-7",
            "extra": "mean: 1.0825396687992757 usec\nrounds: 104844"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_instantiation",
            "value": 895523.8200983224,
            "unit": "iter/sec",
            "range": "stddev: 4.24915101921338e-7",
            "extra": "mean: 1.1166648809969195 usec\nrounds: 83809"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_nested_udt_serialization",
            "value": 828203.4836419988,
            "unit": "iter/sec",
            "range": "stddev: 2.642405727767717e-7",
            "extra": "mean: 1.2074327381509329 usec\nrounds: 82796"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_ddl_generation",
            "value": 192822.52684163206,
            "unit": "iter/sec",
            "range": "stddev: 6.303075188030962e-7",
            "extra": "mean: 5.186116043491715 usec\nrounds: 7592"
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
          "id": "95af4604754c6dad3bb79cad28d3a8048efa37fe",
          "message": "fix(ci): add workflows write permission to pr-rebase-squash for force-pushing branches with workflow changes\n\nCo-authored-by: fruch <340979+fruch@users.noreply.github.com>",
          "timestamp": "2026-02-28T22:57:20+02:00",
          "tree_id": "9e8732608879b7b2f4b78f22733501e091333b9b",
          "url": "https://github.com/fruch/coodie/commit/95af4604754c6dad3bb79cad28d3a8048efa37fe"
        },
        "date": 1772312276617,
        "tool": "pytest",
        "benches": [
          {
            "name": "benchmarks/bench_argus.py::test_coodie_argus_model_instantiation",
            "value": 52876.848376284346,
            "unit": "iter/sec",
            "range": "stddev: 0.0000015516924738722663",
            "extra": "mean: 18.911868439733016 usec\nrounds: 8460"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_instantiation",
            "value": 550997.0182920061,
            "unit": "iter/sec",
            "range": "stddev: 7.268230019919866e-7",
            "extra": "mean: 1.8148918538612502 usec\nrounds: 39798"
          },
          {
            "name": "benchmarks/bench_serialization.py::test_coodie_model_serialization",
            "value": 620912.6736281362,
            "unit": "iter/sec",
            "range": "stddev: 4.2172078339773314e-7",
            "extra": "mean: 1.6105324347090053 usec\nrounds: 47850"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_serialization",
            "value": 841297.3640996347,
            "unit": "iter/sec",
            "range": "stddev: 3.5341730059704266e-7",
            "extra": "mean: 1.1886403579431282 usec\nrounds: 157679"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_instantiation",
            "value": 954700.0354902198,
            "unit": "iter/sec",
            "range": "stddev: 3.312820027434174e-7",
            "extra": "mean: 1.0474494216254213 usec\nrounds: 96909"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_nested_udt_serialization",
            "value": 736301.8282681435,
            "unit": "iter/sec",
            "range": "stddev: 3.89575136307366e-7",
            "extra": "mean: 1.358138689336276 usec\nrounds: 104406"
          },
          {
            "name": "benchmarks/bench_udt.py::test_coodie_udt_ddl_generation",
            "value": 188823.82235341507,
            "unit": "iter/sec",
            "range": "stddev: 8.692448410069282e-7",
            "extra": "mean: 5.295941939615725 usec\nrounds: 7785"
          }
        ]
      }
    ]
  }
}