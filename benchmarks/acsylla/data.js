window.BENCHMARK_DATA = {
  "lastUpdate": 1772045983983,
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
      }
    ]
  }
}