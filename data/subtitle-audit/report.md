# Subtitle Alignment Audit

Generated at: 2026-05-27T01:41:48.567Z

This report checks structural alignment between English and Traditional Chinese WebVTT files. It catches deterministic issues such as mismatched cue counts, mismatched ids/timecodes, empty cues, punctuation-only cues, suspiciously short cues, likely merged cues, and near-duplicates. It does not prove semantic correctness; flagged windows should be reviewed against audio and source English cues.

## Summary

| Video | Kaltura | EN cues | ZH cues | High | Medium | Low |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| introduction-to-unix-standards | 1_a3edezg7 | 61 | 61 | 0 | 1 | 0 |
| unix-implementation-on-zos | 1_kt2xnn6y | 62 | 62 | 0 | 2 | 0 |
| zos-unit-component | 1_hipb0mvo | 128 | 128 | 0 | 6 | 1 |
| components-of-a-unix-system | 1_gb9hrqdy | 50 | 50 | 0 | 0 | 0 |
| fundamental-functions | 1_aomv0tq1 | 44 | 44 | 0 | 0 | 0 |
| more-fundamental-functions | 1_8tq0t0g0 | 54 | 54 | 0 | 1 | 0 |
| hierarchical-system-introduction | 1_lk9agppe | 45 | 45 | 0 | 0 | 0 |
| types | 1_jwoqqa5m | 84 | 84 | 0 | 1 | 0 |
| hfs-and-zfs-data-set-fundamentals | 1_34nut98r | 78 | 78 | 0 | 1 | 0 |
| hfs-and-zfs-file-systems | 1_griczpau | 80 | 80 | 0 | 0 | 0 |
| ishell-and-directory-list-utility | 1_f3el88sl | 55 | 55 | 0 | 0 | 0 |
| directory-list-utility-panels | 1_iugkoedg | 82 | 82 | 0 | 2 | 0 |
| ispf-and-zos-unix | 1_te3t0o79 | 76 | 76 | 0 | 5 | 0 |
| system-structure | 1_w37ha2pb | 93 | 93 | 0 | 0 | 0 |
| backup-and-recovery | 1_iov0qts1 | 30 | 30 | 0 | 1 | 0 |
| network-file-system-and-file-security | 1_pnx8ipij | 72 | 72 | 0 | 1 | 0 |
| lab-familiarization | 1_599iixml | 51 | 51 | 0 | 1 | 0 |
| the-zos-shell | 1_iv4h5dcz | 35 | 35 | 0 | 0 | 0 |
| tso-and-the-zos-unix-shell | 1_ccnbuqha | 68 | 68 | 0 | 1 | 0 |
| commands-and-jobs | 1_q81uk4xi | 76 | 76 | 0 | 1 | 0 |
| getting-help-and-working-with-code-pages | 1_bf9i3fo8 | 113 | 113 | 0 | 0 | 0 |
| system-shell-commands | 1_bvrm90tq | 53 | 53 | 0 | 1 | 0 |
| more-shell-commands | 1_wp4d7ohx | 94 | 94 | 0 | 2 | 0 |
| working-with-the-shell | 1_udrgkkbw | 91 | 91 | 0 | 4 | 1 |
| shell-scripts-and-rexx | 1_ohj8iew1 | 57 | 57 | 0 | 2 | 0 |
| bpxbatch | 1_3ggir589 | 23 | 23 | 0 | 3 | 0 |
| ascii-and-ebcdic-considerations | 1_xhceuc8r | 41 | 41 | 0 | 1 | 0 |
| translation-considerations | 1_cg8lhe0n | 48 | 48 | 0 | 0 | 0 |
| functions-and-processes | 1_156jj3h4 | 88 | 88 | 0 | 0 | 0 |
| daemons-and-superusers | 1_yttr8bkz | 43 | 43 | 0 | 2 | 0 |
| child-processes | 1_9qo8xsow | 73 | 73 | 0 | 2 | 0 |
| communications-and-threads | 1_ktj4ke4p | 76 | 76 | 0 | 0 | 0 |
| application-programming-in-zos-unix | 1_8ihdkrd8 | 71 | 71 | 0 | 3 | 0 |
| printing-and-access-control-lists | 1_fxdv609j | 62 | 62 | 0 | 1 | 0 |
| additional-considerations | 1_jxyrdq28 | 50 | 50 | 0 | 7 | 0 |

## Priority Review Queue

- MEDIUM additional-considerations cue 14 00:01:15.280 --> 00:01:22.480: semantic_neighbor_drift - ZH contains USS, but EN cue 15 contains that term
- MEDIUM additional-considerations cue 15 00:01:22.480 --> 00:01:28.560: semantic_neighbor_drift - ZH contains z/OS, but EN cue 16 contains that term
- MEDIUM additional-considerations cue 17 00:01:35.360 --> 00:01:40.560: semantic_neighbor_drift - ZH contains Sysplex, but EN cue 18 contains that term
- MEDIUM additional-considerations cue 26 00:02:21.680 --> 00:02:26.480: semantic_neighbor_drift - ZH contains Sysplex, but EN cue 27 contains that term
- MEDIUM additional-considerations cue 44 00:04:11.280 --> 00:04:19.680: long_zh_cue - ZH length 49; 5.8 chars/sec
- MEDIUM additional-considerations cue 47 00:04:34.880 --> 00:04:42.400: long_zh_cue - ZH length 48; 6.4 chars/sec
- MEDIUM additional-considerations cue 48 00:04:42.400 --> 00:04:49.280: long_zh_cue - ZH length 45; 6.5 chars/sec
- MEDIUM application-programming-in-zos-unix cue 41 00:03:22.960 --> 00:03:29.760: long_zh_cue - ZH length 43; 6.3 chars/sec
- MEDIUM application-programming-in-zos-unix cue 66 00:05:37.200 --> 00:05:42.400: semantic_neighbor_drift - ZH contains z/OS, but EN cue 67 contains that term
- MEDIUM application-programming-in-zos-unix cue 70 00:06:02.400 --> 00:06:08.480: starts_with_punctuation - Chinese cue starts with punctuation
- MEDIUM ascii-and-ebcdic-considerations cue 27 00:02:46.980 --> 00:02:53.460: long_zh_cue - ZH length 45; 6.9 chars/sec
- MEDIUM backup-and-recovery cue 15 00:02:15.660 --> 00:02:34.380: long_zh_cue - ZH length 69; 3.7 chars/sec
- MEDIUM bpxbatch cue 1 00:00:03.760 --> 00:00:13.760: long_zh_cue - ZH length 61; 6.1 chars/sec
- MEDIUM bpxbatch cue 3 00:00:19.760 --> 00:00:27.760: long_zh_cue - ZH length 60; 7.5 chars/sec
- MEDIUM bpxbatch cue 20 00:02:41.760 --> 00:02:55.760: long_zh_cue - ZH length 68; 4.9 chars/sec
- MEDIUM child-processes cue 5 00:00:18.930 --> 00:00:23.590: long_zh_cue - ZH length 47; 10.1 chars/sec
- MEDIUM child-processes cue 27 00:01:52.170 --> 00:01:54.070: starts_with_punctuation - Chinese cue starts with punctuation
- MEDIUM commands-and-jobs cue 15 00:01:21.370 --> 00:01:29.010: long_zh_cue - ZH length 45; 5.9 chars/sec
- MEDIUM daemons-and-superusers cue 20 00:02:03.800 --> 00:02:08.000: long_zh_cue - ZH length 43; 10.2 chars/sec
- MEDIUM daemons-and-superusers cue 39 00:04:00.160 --> 00:04:06.040: long_zh_cue - ZH length 52; 8.8 chars/sec
- MEDIUM directory-list-utility-panels cue 19 00:01:09.600 --> 00:01:11.240: starts_with_punctuation - Chinese cue starts with punctuation
- MEDIUM directory-list-utility-panels cue 68 00:04:47.890 --> 00:04:50.770: semantic_neighbor_drift - ZH contains z/OS, but EN cue 69 contains that term
- MEDIUM hfs-and-zfs-data-set-fundamentals cue 24 00:02:04.700 --> 00:02:12.700: long_zh_cue - ZH length 52; 6.5 chars/sec
- MEDIUM introduction-to-unix-standards cue 60 00:04:46.150 --> 00:04:47.150: semantic_neighbor_drift - ZH contains z/OS, but EN cue 61 contains that term
- MEDIUM ispf-and-zos-unix cue 4 00:00:20.850 --> 00:00:26.010: long_zh_cue - ZH length 48; 9.3 chars/sec
- MEDIUM ispf-and-zos-unix cue 31 00:02:26.230 --> 00:02:31.130: long_zh_cue - ZH length 44; 9.0 chars/sec
- MEDIUM ispf-and-zos-unix cue 35 00:02:48.770 --> 00:02:53.390: semantic_neighbor_drift - ZH contains z/OS, but EN cue 36 contains that term
- MEDIUM ispf-and-zos-unix cue 56 00:04:22.710 --> 00:04:27.110: starts_with_punctuation - Chinese cue starts with punctuation
- MEDIUM ispf-and-zos-unix cue 61 00:04:44.310 --> 00:04:49.390: long_zh_cue - ZH length 46; 9.1 chars/sec
- MEDIUM lab-familiarization cue 32 00:02:38.250 --> 00:02:41.930: possibly_merged_zh_cue - Chinese cue has multiple sentence endings in a short time window
- MEDIUM more-fundamental-functions cue 4 00:00:15.980 --> 00:00:21.100: long_zh_cue - ZH length 48; 9.4 chars/sec
- MEDIUM more-shell-commands cue 1 00:00:03.890 --> 00:00:09.890: long_zh_cue - ZH length 43; 7.2 chars/sec
- MEDIUM more-shell-commands cue 56 00:06:12.890 --> 00:06:24.890: long_zh_cue - ZH length 68; 5.7 chars/sec
- MEDIUM network-file-system-and-file-security cue 6 00:00:36.670 --> 00:00:44.110: long_zh_cue - ZH length 47; 6.3 chars/sec
- MEDIUM printing-and-access-control-lists cue 3 00:00:12.860 --> 00:00:19.340: long_zh_cue - ZH length 48; 7.4 chars/sec
- MEDIUM shell-scripts-and-rexx cue 10 00:00:40.560 --> 00:00:47.420: long_zh_cue - ZH length 44; 6.4 chars/sec
- MEDIUM shell-scripts-and-rexx cue 34 00:02:36.600 --> 00:02:43.340: long_zh_cue - ZH length 49; 7.3 chars/sec
- MEDIUM system-shell-commands cue 42 00:04:29.790 --> 00:04:38.790: long_zh_cue - ZH length 50; 5.6 chars/sec
- MEDIUM tso-and-the-zos-unix-shell cue 3 00:00:24.700 --> 00:00:32.700: long_zh_cue - ZH length 49; 6.1 chars/sec
- MEDIUM types cue 44 00:03:01.820 --> 00:03:05.820: starts_with_punctuation - Chinese cue starts with punctuation
- MEDIUM unix-implementation-on-zos cue 48 00:04:02.190 --> 00:04:03.970: long_zh_cue - ZH length 45; 25.3 chars/sec
- MEDIUM unix-implementation-on-zos cue 52 00:04:24.690 --> 00:04:31.570: long_zh_cue - ZH length 43; 6.3 chars/sec
- MEDIUM working-with-the-shell cue 21 00:01:01.540 --> 00:01:06.540: starts_with_punctuation - Chinese cue starts with punctuation
- MEDIUM working-with-the-shell cue 78 00:03:50.560 --> 00:03:52.600: long_zh_cue - ZH length 32; 15.7 chars/sec
- MEDIUM working-with-the-shell cue 80 00:03:58.800 --> 00:04:02.920: near_duplicate_previous_zh_cue - Similar to previous cue 79
- MEDIUM working-with-the-shell cue 87 00:04:21.200 --> 00:04:23.120: long_zh_cue - ZH length 28; 14.6 chars/sec
- MEDIUM zos-unit-component cue 50 00:02:34.670 --> 00:02:36.310: long_zh_cue - ZH length 21; 12.8 chars/sec
- MEDIUM zos-unit-component cue 67 00:03:23.310 --> 00:03:25.430: long_zh_cue - ZH length 25; 11.8 chars/sec
- MEDIUM zos-unit-component cue 76 00:03:52.790 --> 00:03:55.110: long_zh_cue - ZH length 32; 13.8 chars/sec
- MEDIUM zos-unit-component cue 127 00:06:31.670 --> 00:06:33.070: long_zh_cue - ZH length 17; 12.1 chars/sec
- MEDIUM zos-unit-component cue 127 00:06:31.670 --> 00:06:33.070: semantic_neighbor_drift - ZH contains z/OS, but EN cue 128 contains that term
- MEDIUM zos-unit-component cue 128 00:06:33.070 --> 00:06:37.030: near_duplicate_previous_zh_cue - Similar to previous cue 127

## All Issues

| Severity | Type | Video | Kaltura | Cue | Time | Details |
| --- | --- | --- | --- | --- | --- | --- |
| medium | semantic_neighbor_drift | additional-considerations | 1_jxyrdq28 | 14 | 00:01:15.280-00:01:22.480 | ZH contains USS, but EN cue 15 contains that term |
| | | | | | EN | only supported file system data sharing for zos. ZOS provides support for simultaneous read-write |
| | | | | | ZH | z/OS 支援在多個 Unix system services 實例間同時讀寫 |
| medium | semantic_neighbor_drift | additional-considerations | 1_jxyrdq28 | 15 | 00:01:22.480-00:01:28.560 | ZH contains z/OS, but EN cue 16 contains that term |
| | | | | | EN | access to the same ZFS or HFS file system across instances of Unix system services running |
| | | | | | ZH | 存取相同 ZFS 或 HFS 檔案系統，這些實例運行於多個 z/OS 映像中 |
| medium | semantic_neighbor_drift | additional-considerations | 1_jxyrdq28 | 17 | 00:01:35.360-00:01:40.560 | ZH contains Sysplex, but EN cue 18 contains that term |
| | | | | | EN | Across system coupling facility or XCF services are used during the processing of shared |
| | | | | | ZH | 跨系統耦合設施或 XCF 服務用於 Sysplex 中共享 |
| medium | semantic_neighbor_drift | additional-considerations | 1_jxyrdq28 | 26 | 00:02:21.680-00:02:26.480 | ZH contains Sysplex, but EN cue 27 contains that term |
| | | | | | EN | mounted on every system when the PFS is capable of handling a local mount on every system, |
| | | | | | ZH | 當 PFS 能在每個系統本地掛載時，也就是 PFS 正在以 Sysplex
aware 運作， |
| medium | long_zh_cue | additional-considerations | 1_jxyrdq28 | 44 | 00:04:11.280-00:04:19.680 | ZH length 49; 5.8 chars/sec |
| | | | | | EN | In this case, the Sysplex aware file system FS2 is ZFS owned by SY2 and is being directly |
| | | | | | ZH | 在此案例中，Sysplex 感知的檔案系統 FS2 是由 SY2 擁有的 ZFS，
正被 SY1 和 SY3 直接訪問。 |
| medium | long_zh_cue | additional-considerations | 1_jxyrdq28 | 47 | 00:04:34.880-00:04:42.400 | ZH length 48; 6.4 chars/sec |
| | | | | | EN | This ZFS HFS data set must be mounted read-write. Only one Sysplex route is allowed for all systems |
| | | | | | ZH | 此 ZFS HFS 資料集必須以讀寫方式掛載。所有參與共享 HFS
的系統只允許有一個 Sysplex 路由。 |
| medium | long_zh_cue | additional-considerations | 1_jxyrdq28 | 48 | 00:04:42.400-00:04:49.280 | ZH length 45; 6.5 chars/sec |
| | | | | | EN | participating in shared HFS. Directories in the system specified HFS data set are used as mount |
| | | | | | ZH | 系統指定 HFS 資料集中的目錄被用作掛載點，特別是 /etc、/var、
/temp 和 /dev。 |
| medium | long_zh_cue | application-programming-in-zos-unix | 1_8ihdkrd8 | 41 | 00:03:22.960-00:03:29.760 | ZH length 43; 6.3 chars/sec |
| | | | | | EN | either UTF-8 or UTF-16, to any of the EBSIDIC CCSIDs currently supported by your applications. |
| | | | | | ZH | 無論是 UTF-8 還是 UTF-16，轉換成您應用程式所支援的任何 EBCDIC
CCSID。 |
| medium | semantic_neighbor_drift | application-programming-in-zos-unix | 1_8ihdkrd8 | 66 | 00:05:37.200-00:05:42.400 | ZH contains z/OS, but EN cue 67 contains that term |
| | | | | | EN | An assembler interface is also provided for those applications that do not use the C or C++ |
| | | | | | ZH | z/OS Unix 支援兩種 socket 類別。Unix 域 socket， |
| medium | starts_with_punctuation | application-programming-in-zos-unix | 1_8ihdkrd8 | 70 | 00:06:02.400-00:06:08.480 | Chinese cue starts with punctuation |
| | | | | | EN | protocol sockets are part of the internet address family AF underscore INET for IPv4 and AF underscore |
| | | | | | ZH | （內容截斷，無法提供後續翻譯） |
| medium | long_zh_cue | ascii-and-ebcdic-considerations | 1_xhceuc8r | 27 | 00:02:46.980-00:02:53.460 | ZH length 45; 6.9 chars/sec |
| | | | | | EN | ASCII and LF commands to edit ASCII data stored in ZOS datasets. For Unix files, you have |
| | | | | | ZH | ASCII 和 LF 指令用於編輯儲存在 z/OS 資料集中的 ASCII 資料。
對於 Unix 檔案，你有 |
| medium | long_zh_cue | backup-and-recovery | 1_iov0qts1 | 15 | 00:02:15.660-00:02:34.380 | ZH length 69; 3.7 chars/sec |
| | | | | | EN | Now, we'll run through this fairly briefly, but the point here is in ZOS v2 release 4, storage admins are able to manage the backup and recovery of Unix files within ZFS file systems with DFS-MS-DSS and DFS-MS-HSM utilities which are normally used for standard ZOS data sets. |
| | | | | | ZH | 這裡簡要介紹，在 ZOS v2 發行版 4 中，儲存管理員能使用 DFSMS
DSS 和 DFSMS HSM 工具管理 ZFS 檔案系統中 Unix
檔案的備份與還原。 |
| medium | long_zh_cue | bpxbatch | 1_3ggir589 | 1 | 00:00:03.760-00:00:13.760 | ZH length 61; 6.1 chars/sec |
| | | | | | EN | BPX batch is provided to make it easier to run shell scripts in ZOS UNIX application programs that reside in HFS through the ZOS batch environment. |
| | | | | | ZH | BPX batch 提供了方便在 ZOS UNIX 應用程式中透過 ZOS
批次環境執行 shell 腳本的方法，這些應用程式位於 HFS 中。 |
| medium | long_zh_cue | bpxbatch | 1_3ggir589 | 3 | 00:00:19.760-00:00:27.760 | ZH length 60; 7.5 chars/sec |
| | | | | | EN | BPX batch can be invoked by JCL as a batch job, as a command in TSOE, from within a rex exec or with oshell. |
| | | | | | ZH | BPX batch 可由 JCL 以批次作業呼叫，或在 TSOE 中當成命令，或在
rex exec 內部使用，亦可透過 oshell 執行。 |
| medium | long_zh_cue | bpxbatch | 1_3ggir589 | 20 | 00:02:41.760-00:02:55.760 | ZH length 68; 4.9 chars/sec |
| | | | | | EN | BPX batsl provides you with an alternative entry point into BPX batch and forces a program to run using a local spawn instead of fork or exec, as BPX batch does. |
| | | | | | ZH | BPX batsl 提供了另一種進入 BPX batch 的入口，
並強制程式使用本地 spawn 執行，而非 BPX batch 通常的 fork
或 exec。 |
| medium | long_zh_cue | child-processes | 1_9qo8xsow | 5 | 00:00:18.930-00:00:23.590 | ZH length 47; 10.1 chars/sec |
| | | | | | EN | With ZOS Unix, a program that issues a fork creates a new address base which is a copy |
| | | | | | ZH | 在 z/OS Unix 中，發出 fork 的程式會建立一個新的地址基底，
該基底是當前程式執行位置的副本 |
| medium | starts_with_punctuation | child-processes | 1_9qo8xsow | 27 | 00:01:52.170-00:01:54.070 | Chinese cue starts with punctuation |
| | | | | | EN | by the parent. |
| | | | | | ZH | （此行與前行合併處理） |
| medium | long_zh_cue | commands-and-jobs | 1_q81uk4xi | 15 | 00:01:21.370-00:01:29.010 | ZH length 45; 5.9 chars/sec |
| | | | | | EN | Enter greater than a file name at the end of a command. For example sort minus you file one greater than out file |
| | | | | | ZH | 要把輸出導向檔案，在指令尾使用大於符號和檔名。例如 sort 減 u file1
> outfile。 |
| medium | long_zh_cue | daemons-and-superusers | 1_yttr8bkz | 20 | 00:02:03.800-00:02:08.000 | ZH length 43; 10.2 chars/sec |
| | | | | | EN | Superusers should have their own standard UID, and then they can switch into superuser |
| | | | | | ZH | Superuser 應擁有標準 UID，必要時可切換至 superuser
身份進行授權操作。 |
| medium | long_zh_cue | daemons-and-superusers | 1_yttr8bkz | 39 | 00:04:00.160-00:04:06.040 | ZH length 52; 8.8 chars/sec |
| | | | | | EN | profiles in the UNIX PRIV class, you may specifically grant certain superuser privileges with a high |
| | | | | | ZH | UNIX PRIV 類別的配置檔，您可以針對沒有超級使用者權限的使用者，
精確授予某些超級使用者權限，且具高度 |
| medium | starts_with_punctuation | directory-list-utility-panels | 1_iugkoedg | 19 | 00:01:09.600-00:01:11.240 | Chinese cue starts with punctuation |
| | | | | | EN | refers to. |
| | | | | | ZH | （這行與上一行合併為一句） |
| medium | semantic_neighbor_drift | directory-list-utility-panels | 1_iugkoedg | 68 | 00:04:47.890-00:04:50.770 | ZH contains z/OS, but EN cue 69 contains that term |
| | | | | | EN | unix file information panel. |
| | | | | | ZH | z/OS Unix 檔案資訊面板。 |
| medium | long_zh_cue | hfs-and-zfs-data-set-fundamentals | 1_34nut98r | 24 | 00:02:04.700-00:02:12.700 | ZH length 52; 6.5 chars/sec |
| | | | | | EN | A ZFS aggregate is a VSAM linear data set or an LDS that contains one or more ZFS file systems. |
| | | | | | ZH | ZFS aggregate 是一個 VSAM linear data set 或
LDS，包含一個或多個 ZFS 檔案系統。 |
| medium | semantic_neighbor_drift | introduction-to-unix-standards | 1_a3edezg7 | 60 | 00:04:46.150-00:04:47.150 | ZH contains z/OS, but EN cue 61 contains that term |
| | | | | | EN | Unix. |
| | | | | | ZH | z/OS Unix。 |
| medium | long_zh_cue | ispf-and-zos-unix | 1_te3t0o79 | 4 | 00:00:20.850-00:00:26.010 | ZH length 48; 9.3 chars/sec |
| | | | | | EN | ISPF assumes the ZOS UNIX path name is entered in this field when the first character is |
| | | | | | ZH | 當第一個字元是斜線、波浪號、點或兩個點時，ISPF 假設在此欄位輸入的是 z/OS
UNIX 路徑名稱。 |
| medium | long_zh_cue | ispf-and-zos-unix | 1_te3t0o79 | 31 | 00:02:26.230-00:02:31.130 | ZH length 44; 9.0 chars/sec |
| | | | | | EN | On screen we see the difference between browsing a ZOS UNIX file without specifying a record |
| | | | | | ZH | 畫面上我們可以看到瀏覽 ZOS UNIX 檔案時沒有指定紀錄長度，與指定紀錄長度為
40 的差異。 |
| medium | semantic_neighbor_drift | ispf-and-zos-unix | 1_te3t0o79 | 35 | 00:02:48.770-00:02:53.390 | ZH contains z/OS, but EN cue 36 contains that term |
| | | | | | EN | Also the new record length field is added to allow a record length to be specified |
| | | | | | ZH | 此外，新增了記錄長度欄位，以允許在編輯 z/OS UNIX 檔案時指定記錄長度。 |
| medium | starts_with_punctuation | ispf-and-zos-unix | 1_te3t0o79 | 56 | 00:04:22.710-00:04:27.110 | Chinese cue starts with punctuation |
| | | | | | EN | name on the edit move panel displayed when no data source is specified with the move |
| | | | | | ZH | （當未指定 move 指令的資料來源時顯示）。 |
| medium | long_zh_cue | ispf-and-zos-unix | 1_te3t0o79 | 61 | 00:04:44.310-00:04:49.390 | ZH length 46; 9.1 chars/sec |
| | | | | | EN | Retrieval of path names is supported on those ISPF edit, view and browse panels that allow |
| | | | | | ZH | 在允許於其他資料集名稱欄位輸入路徑名稱的 ISPF 編輯、檢視和瀏覽面板上，
支援路徑名稱的檢索。 |
| medium | possibly_merged_zh_cue | lab-familiarization | 1_599iixml | 32 | 00:02:38.250-00:02:41.930 | Chinese cue has multiple sentence endings in a short time window |
| | | | | | EN | it says busy, then you probably just have to wait a little while for it to come |
| | | | | | ZH | 顯示忙碌，可能要等一段時間它才會重新上線。沒關係。 |
| medium | long_zh_cue | more-fundamental-functions | 1_8tq0t0g0 | 4 | 00:00:15.980-00:00:21.100 | ZH length 48; 9.4 chars/sec |
| | | | | | EN | exit system call, more by a kill signal from another process. Each process has a |
| | | | | | ZH | exit 系統呼叫來終止，更多時候是另一個 process 傳送的 kill 訊號。
每個 process 都有 |
| medium | long_zh_cue | more-shell-commands | 1_wp4d7ohx | 1 | 00:00:03.890-00:00:09.890 | ZH length 43; 7.2 chars/sec |
| | | | | | EN | Hi, my name is Mackenzie Manna, an IBM Redbooks project leader specializing in IBM Z. |
| | | | | | ZH | 您好，我是 Mackenzie Manna，專精 IBM Z 的 IBM
Redbooks 專案主管。 |
| medium | long_zh_cue | more-shell-commands | 1_wp4d7ohx | 56 | 00:06:12.890-00:06:24.890 | ZH length 68; 5.7 chars/sec |
| | | | | | EN | Users with read access to UNIX PRIV class profiles superuser.filesys.changeperms can use the chmod command to change the permission bits of any file. |
| | | | | | ZH | 擁有 UNIX PRIV 類別配置檔中
superuser.filesys.changeperms 讀取權限的使用者，
可以變更任何檔案的權限位元。 |
| medium | long_zh_cue | network-file-system-and-file-security | 1_pnx8ipij | 6 | 00:00:36.670-00:00:44.110 | ZH length 47; 6.3 chars/sec |
| | | | | | EN | Windows or any Unix or Linux system with the NFS client software and ZOS. And the NFS server allows |
| | | | | | ZH | 安裝有 NFS 用戶端軟體的 Windows、Unix 或 Linux 系統與
z/OS。且 NFS 伺服器允許 |
| medium | long_zh_cue | printing-and-access-control-lists | 1_fxdv609j | 3 | 00:00:12.860-00:00:19.340 | ZH length 48; 7.4 chars/sec |
| | | | | | EN | A ZOS UNIX application can use the POSIX functions printf, fprint, write, or fwrite |
| | | | | | ZH | ZOS UNIX 應用程式可使用 POSIX 函數 printf、fprintf、
write 或 fwrite |
| medium | long_zh_cue | shell-scripts-and-rexx | 1_ohj8iew1 | 10 | 00:00:40.560-00:00:47.420 | ZH length 44; 6.4 chars/sec |
| | | | | | EN | Next sesh, switches to the next session and previous sesh, switches to the previous session. |
| | | | | | ZH | Next sesh 會切換到下一個工作階段，previous sesh
會切換到前一個工作階段。 |
| medium | long_zh_cue | shell-scripts-and-rexx | 1_ohj8iew1 | 34 | 00:02:36.600-00:02:43.340 | ZH length 49; 7.3 chars/sec |
| | | | | | EN | Rex execs using zosunix extensions can run from TSOE or in zosbatch and access the zosunix |
| | | | | | ZH | 使用 zosunix 擴展的 Rex execs 可以從 TSOE 或
zosbatch 執行，並存取 zosunix |
| medium | long_zh_cue | system-shell-commands | 1_bvrm90tq | 42 | 00:04:29.790-00:04:38.790 | ZH length 50; 5.6 chars/sec |
| | | | | | EN | When there are a large number of mounted Unix file systems, the file system list presented by the Unix system services ISPF shell can become unmanageable. |
| | | | | | ZH | 當掛載的 Unix 檔案系統數量眾多時，Unix 系統服務 ISPF
外殼所呈現的檔案系統列表可能會難以管理。 |
| medium | long_zh_cue | tso-and-the-zos-unix-shell | 1_ccnbuqha | 3 | 00:00:24.700-00:00:32.700 | ZH length 49; 6.1 chars/sec |
| | | | | | EN | UNIX users can use the ZOS UNIX shell OMVS and TSO users can use the shell under TSO, the i-shell. |
| | | | | | ZH | UNIX 使用者可使用 ZOS UNIX shell OMVS，TSO 使用者可在
TSO 下使用 i-shell。 |
| medium | starts_with_punctuation | types | 1_jwoqqa5m | 44 | 00:03:01.820-00:03:05.820 | Chinese cue starts with punctuation |
| | | | | | EN | Slash dev slash zero is a character special device file. |
| | | | | | ZH | /dev/zero 是一個字元特殊設備檔。 |
| medium | long_zh_cue | unix-implementation-on-zos | 1_kt2xnn6y | 48 | 00:04:02.190-00:04:03.970 | ZH length 45; 25.3 chars/sec |
| | | | | | EN | the batch facility. |
| | | | | | ZH | 您可以從批次作業或 TSLE 環境以呼叫命令、C 程式清單或 RexxXEC 執行
BPX batch。 |
| medium | long_zh_cue | unix-implementation-on-zos | 1_kt2xnn6y | 52 | 00:04:24.690-00:04:31.570 | ZH length 43; 6.3 chars/sec |
| | | | | | EN | Let's look at two exploiters of these facilities which are IBM HTTP server and IBM WebSphere |
| | | | | | ZH | 現在來看看兩個利用這些功能的例子：IBM HTTP server 與 IBM
WebSphere |
| medium | starts_with_punctuation | working-with-the-shell | 1_udrgkkbw | 21 | 00:01:01.540-00:01:06.540 | Chinese cue starts with punctuation |
| | | | | | EN | .etc, .profile, and .home, .profile are used. |
| | | | | | ZH | .etc、.profile 和 .home、.profile 會被使用。 |
| medium | long_zh_cue | working-with-the-shell | 1_udrgkkbw | 78 | 00:03:50.560-00:03:52.600 | ZH length 32; 15.7 chars/sec |
| | | | | | EN | by using a log on procedure |
| | | | | | ZH | 透過使用不包含任何 job lib 或 step lib dd 配置的登入程序 |
| medium | near_duplicate_previous_zh_cue | working-with-the-shell | 1_udrgkkbw | 80 | 00:03:58.800-00:04:02.920 | Similar to previous cue 79 |
| | | | | | EN | This reduces the amount of storage that is copied for fork. |
| | | | | | ZH | 這會降低為 fork 複製的儲存量。 |
| medium | long_zh_cue | working-with-the-shell | 1_udrgkkbw | 87 | 00:04:21.200-00:04:23.120 | ZH length 28; 14.6 chars/sec |
| | | | | | EN | improve the shell's performance for users |
| | | | | | ZH | 可提升從 ISPF 輸入 omvs 命令的使用者的 shell 效能 |
| medium | long_zh_cue | zos-unit-component | 1_hipb0mvo | 50 | 00:02:34.670-00:02:36.310 | ZH length 21; 12.8 chars/sec |
| | | | | | EN | A user gets access to the shell |
| | | | | | ZH | 使用者透過以下方式取得 shell 的存取權限 |
| medium | long_zh_cue | zos-unit-component | 1_hipb0mvo | 67 | 00:03:23.310-00:03:25.430 | ZH length 25; 11.8 chars/sec |
| | | | | | EN | of shell commands called a shell script, |
| | | | | | ZH | 此清單為 shell 命令，稱為 shell script |
| medium | long_zh_cue | zos-unit-component | 1_hipb0mvo | 76 | 00:03:52.790-00:03:55.110 | ZH length 32; 13.8 chars/sec |
| | | | | | EN | to port internationalized applications |
| | | | | | ZH | 將在 ASCII 平台上或針對 ASCII 平台開發的國際化應用程式移植 |
| medium | long_zh_cue | zos-unit-component | 1_hipb0mvo | 127 | 00:06:31.670-00:06:33.070 | ZH length 17; 12.1 chars/sec |
| | | | | | EN | in the upcoming modules, |
| | | | | | ZH | 從更詳盡介紹 z/OS Unix 開始。 |
| medium | semantic_neighbor_drift | zos-unit-component | 1_hipb0mvo | 127 | 00:06:31.670-00:06:33.070 | ZH contains z/OS, but EN cue 128 contains that term |
| | | | | | EN | in the upcoming modules, |
| | | | | | ZH | 從更詳盡介紹 z/OS Unix 開始。 |
| medium | near_duplicate_previous_zh_cue | zos-unit-component | 1_hipb0mvo | 128 | 00:06:33.070-00:06:37.030 | Similar to previous cue 127 |
| | | | | | EN | starting with a more thorough introduction to ZOS Unix. |
| | | | | | ZH | 從更詳盡介紹 z/OS Unix 開始。 |
| low | near_duplicate_next_zh_cue | working-with-the-shell | 1_udrgkkbw | 79 | 00:03:52.600-00:03:57.600 | Similar to next cue 80 |
| | | | | | EN | that does not contain any job lib or step lib dd allocations. |
| | | | | | ZH | 這可減少 fork 時複製的儲存量。 |
| low | near_duplicate_next_zh_cue | zos-unit-component | 1_hipb0mvo | 127 | 00:06:31.670-00:06:33.070 | Similar to next cue 128 |
| | | | | | EN | in the upcoming modules, |
| | | | | | ZH | 從更詳盡介紹 z/OS Unix 開始。 |
