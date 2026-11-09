# Sony FX3: Firmware Hacking vs. Legitimate Ways to Maximize Image Quality (state as of Nov 2026)

Research notes compiled 2026-11-09. Several primary pages could not be fetched from this research session because these hosts were blocked by the network sandbox: newsshooter.com, cined.com, sony.ca, sony-cinematography.com, britishcinematographer.co.uk and openmemories.readthedocs.io. Findings from those sites come from search-result snippets and summaries, not from reading the full pages, and are marked "(snippet)". GitHub pages were read directly.

---

## 1. Is there a Magic Lantern-style hack, custom firmware or reverse-engineering project for the FX3 / A7S III / FX30 / A7 IV?

### Takeaway
No. As of Nov 2026 there is no custom firmware and no Magic Lantern equivalent for the FX3 or any other BIONZ XR body, and nothing public raises image quality (bitrate, codec, RAW, dynamic range). What does exist is the ma1co Sony-PMCA-RE toolset and its community forks. Over USB "service mode" they can read and write the camera's stored settings (its backup properties) without changing the firmware. On BIONZ XR bodies this has only unlocked region and menu settings: menu language, and a hidden NTSC/PAL selector found in November 2026.

### Cited Findings
- **Sony-PMCA-RE (ma1co):** This project "interfaces with Sony digital cameras through USB" to change settings, dump firmware, and on PlayMemories Camera Apps (PMCA) cameras install custom Android apps. It has three modes: App Installer (PMCA cameras only), Firmware Updater (boots the camera's update partition to run custom code, "the camera firmware itself remains untouched") and Service Mode (the servicing USB mode, which "has the best camera compatibility"). — [GitHub: ma1co/Sony-PMCA-RE](https://github.com/ma1co/Sony-PMCA-RE)
- **Signed-firmware architectures are excluded:** The README says devices based on the **CXD90045 and CXD90057 architectures are not compatible** with the updater-mode approach "since their firmware is cryptographically signed." — [GitHub: ma1co/Sony-PMCA-RE](https://github.com/ma1co/Sony-PMCA-RE)
- **The maintainers' own warning:** They call the project "an experiment in a very early stage" that "could cause harm to your hardware… If you break your camera, you get to keep both pieces. We won't take any responsibility." — [GitHub: ma1co/Sony-PMCA-RE](https://github.com/ma1co/Sony-PMCA-RE)
- **OpenMemories: Tweak** says it should be compatible with all Sony cameras that support PMCA. Search results give no evidence that the FX3 is on that list. — [GitHub: ma1co/OpenMemories-Tweak](https://github.com/ma1co/OpenMemories-Tweak) (snippet)
- **What Tweak does on older bodies:** On pre-2019 PMCA-era bodies it was used to remove the 29:59 recording limit and unlock menu languages. Videomaker said in 2016 that it is risky and voids the warranty. — [Videomaker (2016, OLD)](https://www.videomaker.com/videonews/2016/04/unofficial-sony-alpha-hack-extends-video-record-time-enables-language-selection/) (snippet)
- **Older "hacks" ran apps, not new firmware:** A forum commenter on the 2015-era hacks: "these apps are not hacked firmware, they all access to the cameras API." A 2015 claim of internal 4K on the original A7S was met with public skepticism. — [Sony Alpha Rumors (OLD)](https://www.sonyalpharumors.com/few-more-info-on-the-sony-hack/); [DIYPhotography (2015, OLD)](https://www.diyphotography.net/this-hack-claims-to-add-internal-4k-to-the-sony-a7s-were-skeptical/) (snippets)
- **Magic Lantern is a Canon project.** It runs alongside Canon's stock firmware. No Sony port exists. — [Wikipedia: Magic Lantern (firmware)](https://en.wikipedia.org/wiki/Magic_Lantern_(firmware)); [DPReview forum thread](https://www.dpreview.com/forums/thread/3940714) (snippets)
- **A7S III activity in the issue tracker (titles and dates only):**
  - #298 "Sony a7siii unlock language by usb pmca-gui" (closed May 2022)
  - #420 "Sony A7SIII LANGUAGE PROBLEM" (Aug 2023)
  - #472 "SONY a7S III language settings" (Dec 2023)
  - #315 "a7iv USB Error on macOS and Linux" (2022)
  - #473 "still works for Sony A7CR" (Dec 2023)
  - No issue mentions the FX3 by name.
  - — [GitHub issues search](https://github.com/ma1co/Sony-PMCA-RE/issues?q=a7s+III)
- **Newest finding, issue #756 (opened 6 Nov 2026), "A7 IV: hidden NTSC/PAL Selector menu is gated by backup property 0x02cf0004":**
  - Camera: A7 IV on firmware 6.02.
  - The author dumped the camera's backup data and compared it with the region seed images inside Sony's official 6.02 updater, unpacked with `fwtool.py`.
  - They disassembled `appFw.so`, which is **AArch64** code, and set the single byte to `01` with `pmca-console.py serviceshell` (`bk r/w/s` commands).
  - They believe the same ID applies to other BIONZ XR bodies. Commenter LAK132 confirmed it on an **a7S III** and added commits to a fork.
  - Caveats in the issue:
    - Write only `00` or `01`; other values trigger an assert on every menu read.
    - A full-image backup write (`setBackupPresetData`) reportedly fails on the A7 IV.
    - A firmware update or settings reset may revert the value.
    - Backup dumps contain the serial number and an SSH private key, so they should not be shared.
  - The firmware itself is not modified.
  - — [GitHub issue #756](https://github.com/ma1co/Sony-PMCA-RE/issues/756)
- **Search results on "firmware dump", "decrypt" and "Magic Lantern" for the A7S III / FX3** returned nothing specific, only 2014–2015-era material and a spam "Magic Lantern Sony a7iii firmware" download site (gofirmware.com), which is not credible. — [search-result summary; e.g. magiclantern.fm forum topic (OLD)](https://www.magiclantern.fm/forum/index.php?topic=2103.0)

### Inferences
- What is real today on an FX3 or A7S III-class body:
  - Service-mode changes to stored settings: menu language, a hidden NTSC/PAL selector.
  - Reading or dumping the backup and settings area.
- What is myth: any hack that raises bitrate, unlocks internal RAW, adds dynamic range or removes "crippling." Nothing like that exists publicly for BIONZ XR bodies.
- **Risks:**
  - Bricking, which is small for single-property writes and larger for full-image writes or assert-triggering values.
  - Warranty and service disputes.
  - Exposure of a private key if a dump is shared.
  - Changes reverting after updates.
- The FX3 is not named in these issues. It shares the A7S III platform (sensor and BIONZ XR), so service-mode settings tweaks probably behave the same on it. This is unverified: test only what has been confirmed by others, and only reversible changes.
- Whether the FX3 / A7S III are specifically "CXD90057" bodies is my inference. The README names the chip, not the models. The timing and the AArch64 code fit BIONZ XR, but no source here states the mapping.

### Gaps
- The OpenMemories device list (openmemories.readthedocs.io) could not be reached, so I could not confirm which architecture the FX3 has or whether it is listed.
- I could not confirm whether the FX3 ever supported PlayMemories Camera Apps. My understanding is that it did not, since Sony dropped PMCA before BIONZ XR, but I found no source for this.
- I found no source on whether Sony refuses warranty service after service-mode property changes.
- I found no public, credible FX3 firmware decryption or full dump project for 2025–2026.

---

## 2. Why is Sony firmware hard to hack? Any progress in 2025–2026?

### Takeaway
On recent Sony bodies the firmware is cryptographically signed: the camera only accepts a firmware image carrying Sony's signature. That removes the "custom updater" route Sony-PMCA-RE relied on for older bodies. PMCA apps, the other historical way in, are gone from current bodies. The only 2025–2026 progress is in reading the camera (settings dumps, disassembling the official updater's application code) and flipping hidden settings, not in running custom code.

### Cited Findings
- **Signing blocks the updater route:** CXD90045 and CXD90057 firmware is "cryptographically signed," so Sony-PMCA-RE's custom-updater method does not work on them. — [GitHub: ma1co/Sony-PMCA-RE](https://github.com/ma1co/Sony-PMCA-RE)
- **Older bodies were different:** On older bodies, community members (nex-hack) decrypted firmware updates, which allowed the early OpenMemories work. — [search summary referencing OpenMemories / nex-hack history](https://github.com/ma1co/OpenMemories-Tweak) (snippet)
- **The official updater can still be unpacked and analysed:** The 2026 A7 IV work unpacked the official 6.02 updater with `fwtool.py` and disassembled the AArch64 `appFw.so` to find settings gates. Whether decryption was needed is not stated. Nothing was flashed. — [GitHub issue #756](https://github.com/ma1co/Sony-PMCA-RE/issues/756)
- **Sony's own signing technology:** Sony is adding signing and authentication features, for example C2PA and Camera Authenticity firmware for the a1, a1 II and a9 III in Jan 2025. This is image signing, not firmware signing, but it shows a security-first direction. — [PetaPixel (2025)](https://petapixel.com/2025/01/15/sony-seeks-image-authenticity-with-a1-a1-ii-and-a9-iii-firmware-updates)
- **Comparison with Canon:** A Hack.lu 2025 talk by Laurent Clévy covered decrypting **Canon** updates; the author would not release keys or dumps. It is not Sony-related, but it shows such work stays private and legally cautious. — [Hack.lu 2025 speaker page](https://pretalx.com/hack-lu-2025/speaker/LWBGBS/) (snippet)

### Inferences
- The barriers stack up:
  - signed firmware (no custom images),
  - no app platform (PMCA gone),
  - a closed BIONZ XR image pipeline whose encoders are hardware blocks, so bitrate or codec hacks would need deep work even with code execution,
  - a small community, with no Magic Lantern-sized group on Sony.
- Realistic outlook: more hidden settings may be found and flipped. A Magic Lantern-style FX3 port in the near term is very unlikely (speculation).

### Gaps
- No source describes the BIONZ XR secure-boot chain, key storage, or any known bypass.
- I could not verify whether FX3 updater packages are encrypted as well as signed.

---

## 3. Official upgrades: firmware history and latest version (Nov 2026)

### Takeaway
Official firmware has done far more for FX3 image quality and workflow than any hack:
- v2.00 (2022): Cine EI, user LUTs, timecode
- v3.00 (2023): 24.00p, de-squeeze, breathing compensation
- v6.00 (2024): shutter angle, clip flags, 709tone
- v7.00 (Aug 2025): BIG6 home screen, more de-squeeze ratios, external Blackmagic RAW over HDMI

The latest version found is **Ver. 7.02 (17 Mar 2026)**. I found no v8.00.

### Cited Findings
- **Ver. 2.00 (July 2022):**
  - New Log shooting modes for S-Log3: Flexible ISO, Cine EI and Cine EI Quick. Cine EI uses base ISO 800 / 12800.
  - S-Log2 removed.
  - User LUT import, with 16 slots; LUTs can be used for monitoring or baked in via a picture profile.
  - Timecode sync and input through a new adapter cable.
  - EI and LUT settings, plus stabilization and rotation data, stored as clip metadata.
  - — [CineD (2022)](https://www.cined.com/sony-fx3-firmware-2-00-released-cine-ei-workflow-custom-luts-support-and-more/); [B&H Explora](https://www.bhphotovideo.com/explora/video/news/sony-fx3-v20-cine-ei-user-lut-import-timecode-sync); [DPReview](https://www.dpreview.com/news/4828619031/sony-updates-fx3-with-new-log-shooting-modes-lut-importing-timecode-sync-and-more/) (snippets)
- **Base ISO note:** Base ISO was listed as 640 before; Cine EI puts it at 800. — [xdcam-user (Alister Chapman)](https://xdcam-user.com/2022/07/sony-fx3-gets-cineei-and-luts) (snippet)
- **Ver. 3.00 (Apr 2023):** True 24.00p and DCI 4K, anamorphic de-squeeze, focus-breathing compensation. — [FX Rumors firmware list](https://www.fxrumors.com/firmware); [Newsshooter (2023)](https://www.newsshooter.com/2023/04/11/sony-firmware-updates-for-the-fx3-ver-3-00-fx30-ver-2-00/); [Brian Smith](https://briansmith.com/sony-fx3-fx30-firmware-anamorphic-de-squeeze-24p-4k-dci-creators-app-compatibility) (snippets; the FX Rumors formatting was garbled)
- **Nov 2022 boot-loop pull:** Sony pulled an FX3 / FX30 firmware in Nov 2022 after reports that it could trap cameras in a boot loop. Official updates carry some risk too. — [PetaPixel (2022)](https://petapixel.com/2022/11/18/sony-pulls-fx30-fx3-firmware-amid-reports-it-traps-them-in-a-boot-loop/)
- **Ver. 5.00:** listed for Feb 2024, with no feature list in my sources. — [FX Rumors](https://www.fxrumors.com/firmware) (snippet)
- **Ver. 6.00 (Sept 2024):** shutter-angle exposure, OK/NG/KEEP clip flags, "709tone" look. Bodies on 2.02 or earlier must go to 2.04 or 2.05 first. — [FX Rumors](https://www.fxrumors.com/firmware); [Alpha Shooters](https://www.alphashooters.com/cameras/sony-fx3/firmware/) (snippets)
- **Ver. 7.00 (26–27 Aug 2025):**
  - BIG6 home screen.
  - Expanded monitoring and anamorphic de-squeeze options (1.5x / 1.6x reported).
  - **RAW output over HDMI for external Blackmagic RAW** on compatible Blackmagic devices.
  - The same 2.04/2.05 stepping rule applies.
  - — [Imaging Resource (2025)](https://www.imaging-resource.com/news/2025/08/27/sony-releases-new-firmware-for-fx3-fx3a-and-fx30-cinema-cameras); [RedShark](https://www.redsharknews.com/sony-updates-fx3-fx3a-fx30-firmware-adds-big6-home-screen); [CineD ES](https://www.cined.com/es/sony-fx3-fx3a-and-fx30-firmware-update-adds-big6-home-screen-new-de-squeeze-options-and-more/); [cameradecision summary](https://cameradecision.com/blog/Sony-FX3-and-FX30-Firmware-Updates-adds-the-BIG6-setting-15x-and-16x-anamorphic-de-squeeze-and-BRAW-Recording-) (snippets)
- **Roadmap:** Sony's Nov 2024 Cinema Line roadmap scheduled FX3 / FX30 updates for Sept 2025, with lineup features continuing through 2026–2027. No v8 was announced in what I found. — [Newsshooter (2024)](https://www.newsshooter.com/2024/11/06/sony-announces-firmware-roadmap-for-its-cinema-line/); [CineD](https://www.cined.com/sony-firmware-roadmap-for-burano-venice-2-fx3-fx30-and-fx6-announced/) (snippets)
- **Latest version found: Ver. 7.02, release date 17/03/2026**, on Sony's ILME-FX3 support page. The same page lists a Creators' App release dated 28/10/2026. — [Sony Canada support downloads](https://www.sony.ca/en/electronics/support/camcorders-and-video-cameras-interchangeable-lens-camcorders/ilme-fx3/downloads) (snippet; page not directly fetchable)
- **Sony FX5 (July 2026):** Sony now sells the FX5, reportedly with triple base ISO, 5K RAW and internal 16-bit X-OCN. It sits between the FX3 and FX6 and makes FX3 v8 feature additions less likely (speculation). — [Fstoppers](https://fstoppers.com/gear/triple-base-iso-and-5k-raw-what-fx5-brings-run-and-gun-work-903733); [The Gadgeteer (Jul 2026)](https://the-gadgeteer.com/2026/07/23/sony-fx5-cinema-camera/) (snippets)

### Inferences
- An owner should run Ver. 7.02 (or later if Sony posts one). It contains all earlier features, so only the latest version needs installing, after the 2.04/2.05 step for very old bodies.
- I could not see the 7.01 / 7.02 change notes. They are probably maintenance fixes, but this is unconfirmed.

### Gaps
- I found no feature list for Ver. 4.00 or 5.00, and no change notes for 7.01 / 7.02. Check Sony's support pages directly.
- I could not independently confirm FX5 specifications.

---

## 4. RAW over HDMI: ProRes RAW (Atomos) and Blackmagic RAW. Real gains over internal XAVC S-I

### Takeaway
The FX3 sends a 16-bit linear RAW signal over HDMI at 4.2K up to 60p. Atomos Ninja V / V+ record it as ProRes RAW, supported since 2021. Since FX3 Ver. 7.00 plus Video Assist 3.22 (Nov 2025), Blackmagic Video Assist 5" / 7" 12G HDR units record it as 12-bit Blackmagic RAW. The "16-bit" figure describes the output, not a proven 16-bit sensor readout. Tests show little or no dynamic-range gain over internal 10-bit 4:2:2 S-Log3. The gains are in grading flexibility (white balance and ISO in post), no long-GOP or chroma-subsampling artifacts, and freedom from the in-camera noise reduction and sharpening of internal recording.

### Cited Findings
- **Atomos:** ProRes RAW on Ninja V / V+ from the FX3 supports **4.2K up to 60 fps**. A 2021 announcement describes the FX3's 16-bit RAW output at up to 4Kp60. AtomOS 10.63 (Apr 2021) enabled ProRes RAW for the Sony A1, FX3, BGH1 and Sigma fp L. The ProRes RAW codec had to be activated through Atomos' website. — [Broadcast Beat (2021)](https://broadcastbeat.com/news/atomos-announces-prores-raw-support-on-the-ninja-v-for-sonys-new-fx3); [4K Shooters (2021)](https://4kshooters.net/2021/04/01/ninja-v-atomos-10-63-enables-prores-raw-to-sony-a1-fx3-lumix-bgh1-and-sigma-fp-l); [CineD](https://www.cined.com/atomos-ninja-v-will-record-prores-raw-from-the-sony-fx3/) (snippets)
- **Bit-depth conversion:** For the Sony A1 the 16-bit linear output is converted to 12-bit log in ProRes RAW. Sources do not say whether the same applies to the FX3. — (search summary of Atomos / ProVideo Coalition coverage; [ProVideo Coalition](https://www.provideocoalition.com/atomos-ninja-v-and-v-support-hdmi-sdi-raw-from-sonys-fx6/)) (snippet)
- **Blackmagic RAW:** Video Assist **3.22** (Nov 2025) adds Blackmagic RAW recording from the Sony FX3, FX30 and Leica SL3-S. It is a free update for **Video Assist 5" 12G HDR and 7" 12G HDR**. — [No Film School](https://nofilmschool.com/blackmagic-video-assist-update-322); [Newsshooter (Nov 2025)](https://www.newsshooter.com/2025/11/05/blackmagic-video-assist-3-22/); [PetaPixel (Oct 2025)](https://petapixel.com/2025/10/06/blackmagic-raw-worlds-fastest-raw-format-arrives-soon-on-select-sony-cameras) (snippets)
- **BRAW recording modes:** CineD's recording-modes database lists FX3 Blackmagic RAW as **Full Format 4.2K (4240 x 2385) 16:9, 12-bit, external**, at 59.94p / 50p / 29.97p and others. A 24p entry was not visible in the snippet. — [CineD camera database](https://www.cined.com/camera-database/?recording-modes=FX3) (snippet)
- **Is it really 16-bit?** In 2021 CineD questioned whether Sony's "16-bit RAW" reflects a true 16-bit sensor readout at video frame rates; Sony declined to disclose the readout mode. A related CineD figure: FX3 **stills** readout drops to 12-bit up to 9.42 fps and 10-bit up to 21.33 fps at full resolution. Sony's product page says "16-bit RAW data output." — [CineD](https://cined.com/sony-cinema-line-does-16-bit-raw-provide-a-true-16-bit-sensor-readout) (snippet); [DVXuser thread](https://www.dvxuser.com/goto/post?id=5692951) (forum opinions)
- **ProRes RAW vs internal:** A 4K Shooters FX3 comparison found "the dynamic range looks to be the same between the two" (ProRes RAW vs internal XAVC S-I). This was a visual comparison, not a lab measurement. — [4K Shooters (Nov 2023)](https://4kshooters.net/2023/11/10/prores-raw-vs-internal-recording-on-the-sony-fx3)
- **The Creator:** The feature (2023, IMAX release) was shot mainly on the FX3, using an Atomos Ninja for ProRes RAW capture. — [No Film School](https://nofilmschool.com/one-lens-one-vision-the-cinematography-of-the-creator); [YMCinema](https://ymcinema.com/?p=18045); [B&H Explora (Soffer)](https://www.bhphotovideo.com/explora/node/118941) (snippets)

### Inferences
- **Real gains from RAW:**
  - about 4.2K oversampled from the sensor's full width rather than internal UHD,
  - no long-GOP or chroma-subsampling artifacts,
  - white balance and ISO adjustable in post,
  - no in-camera noise reduction, sharpening or compression, so cleaner, more gradeable shadows.
- **Little or no gain:** dynamic range itself.
- **Costs:**
  - a recorder, with extra power and size,
  - an HDMI cable as a fragile link,
  - bigger files,
  - ProRes RAW decoding support that is narrower than standard formats (it historically needed Final Cut Pro / Premiere / Assimilate / Resolve support).
- **BRAW vs ProRes RAW:** BRAW now gives Resolve-native RAW with a 12G HDR Video Assist. ProRes RAW requires an Atomos Ninja-family recorder.

### Gaps
- I found no CineD lab measurement of FX3 RAW vs internal dynamic range.
- I could not confirm which newer Atomos units (Ninja Ultra, Shogun, Ninja TX) support FX3 ProRes RAW, or the exact 24p frame-rate list for BRAW.

---

## 5. Best internal settings and measured dynamic range vs ARRI

### Takeaway
For maximum dynamic range and color fidelity, shoot S-Log3 with S-Gamut3.Cine in Cine EI at base 800 (or base 12800 in low light). Record XAVC S-I 4:2:2 10-bit and monitor through a LUT. Rate the EI below base (for example base 800 at EI 400, or base 12800 at EI 6400–3200) to expose brighter (ETTR) and reduce noise, at the cost of about one stop of highlight headroom per stop. CineD measured the A7S III (same sensor) at about 12.4 stops (SNR=2), against Sony's claimed 15+. CineD measured the ALEXA Mini LF at 13.4–13.5 stops and the ALEXA 35 at 15.1 stops (SNR=2).

### Cited Findings
- **A7S III dynamic range (CineD database):** maximum **12.4 stops at SNR=2** (FF 4K 25p, ISO 640, S-Log3). At ISO 16000 IMATEST measured **11.9 stops** at SNR=2, so raising ISO costs little dynamic range. Exposure latitude was about **7 stops**. Rolling shutter was **8.7 ms** in UHD full frame, best CineD had measured on a full-frame camera at the time. Sony Alpha Rumors headlined "13 stops true dynamic range," likely the SNR=1 figure (unconfirmed). — [CineD camera database: a7S III](https://www.cined.com/camera-database/?camera=Alpha-a7S-III); [CineD a7S III lab test](https://www.cined.com/es/sony-a7s-iii-lab-test-does-it-live-up-to-the-hype/); [Sony Alpha Rumors](https://www.sonyalpharumors.com/sony-a7s-iii-lab-test-by-cined-12-800-native-iso-best-rolling-shutter-performance-ever-tested-13-stops-true-dynamic-range/) (snippets)
- **Sony's claim:** Sony markets the FX3 as having "15+ stops." This is a manufacturer figure, not a lab result. — [Sony Canada FX3 features](https://www.sony.ca/en/interchangeable-lens-cameras/products/ilme-fx3/feature1) (snippet)
- **For comparison:** CineD's FX2 test gave 12.4 stops (SNR=2) in UHD XAVC, ISO 800, S-Log3. — [CineD camera database: FX2](https://www.cined.com/camera-database/?camera=FX2) (snippet)
- **ARRI ALEXA 35 (CineD, ARRIRAW, EI 800):** **15.1 stops at SNR=2 and 16.3 at SNR=1**, against ARRI's claimed 17. CineD notes that the 17th stop "sits already inside the noise floor." That is about 1.7 stops (SNR=2) better than the Mini LF. — [CineD ALEXA 35 lab test](https://www.cined.com/arri-alexa-35-lab-test-rolling-shutter-dynamic-range-and-latitude/) (snippet)
- **ARRI ALEXA Mini LF (CineD):** 13.4 stops (SNR=2) and 14.7 (SNR=1) in the article; the database lists 13.5 stops (SNR=2) in ProRes 4444 XQ, Log C, ISO 800. Latitude references: Mini LF 10 stops, Venice 2 9 stops. — [CineD Mini LF lab test](https://www.cined.com/arri-alexa-classic-mini-lf-lab-test-rolling-shutter-dynamic-range-and-latitude/); [CineD database: Mini LF](https://www.cined.com/camera-database/?camera=ALEXA-Mini-LF) (snippets)
- **How Cine EI works:** Cine EI fixes recording at base ISO 800 or 12800; the EI only changes the monitoring display. The monitoring LUT is not baked into the S-Log3 file. — [Camaleon Rental FX3 guide](https://www.camaleonrental.com/gb/blog/sony-fx3-manual-complete-camera-guide.html); [Budgetcam](https://budgetcam.nl/en/blog/tutorials/get-the-most-out-of-your-footage-with-cine-ei-on-the-sony-fx3) (snippets)
- **The EI trade-off, from Sony's Cine EI documentation (FX9 manual):** an EI below base brightens the S-Log3 file and lowers graded noise, but "your highlight range will be reduced by 1 stop." An EI above base "will increase noise … should be used with caution." — [Sony FX9 manual via ManualsLib](https://www.manualslib.com/manual/1997690/Sony-Pxw-Fx9.html?page=107) (snippet)
- **Practice at high base:** Alister Chapman typically shoots the FX6 and FX3 at EI 6400–3200 at high base, one to two stops brighter, to offset noise. Camaleon calls EI 6400 at base 12800 "+1 stop ETTR." — [xdcam-user](https://www.xdcam-user.com/tag/cineei/); [Camaleon](https://www.camaleonrental.com/gb/blog/sony-fx3-complete-guide.html) (snippets; practitioner and rental blogs)
- **FX3 noise study (2025):** found "minimal visual differences in noise between base EI 800 and 12800" in its tests. Going from 800 to 12800 does not raise noise uniformly across channels. White balance mattered more: noise rose moderately at 3200K, mainly in the blue channel. Some users report base 12800 noticeably noisier. — [IMAGO noise study PDF (Sept 2025)](https://imago.org/wp-content/uploads/2025/09/Noise_study_on_the_Sony_ILME-FX3_camera.pdf); counter-opinion: [xdcam-user comments](https://www.xdcam-user.com/tag/cineei/) (snippets)

### Inferences
- **Recommended internal recipe:**
  - XAVC S-I 4K 4:2:2 10-bit (All-Intra), or XAVC HS 10-bit 4:2:2 if storage is tight.
  - S-Log3 / S-Gamut3.Cine in Cine EI.
  - Base 800 at EI 400–800 in good light; base 12800 at EI 3200–6400 in low light.
  - Expose with false color or waveform through the monitoring LUT.
  - Avoid tungsten white balance plus high base where possible, because of blue-channel noise.
- **FX3 vs ALEXA:** On CineD's SNR=2 metric the FX3 / A7S III sensor is about 1 stop behind the Mini LF and about 2.7 stops behind the ALEXA 35. The bigger practical difference is highlight roll-off and latitude: about 7 stops vs 10 on the Mini LF.

### Gaps
- I found no FX3-specific CineD lab test, only the A7S III figure, which shares the sensor. The FX3's internal fan could change the noise floor slightly over long takes; this is unverified.
- I found no measured dynamic-range figure for the FX3 in RAW (ProRes RAW or BRAW).

---

## 6. Hardware and optical changes that shape the "look" more than firmware

### Takeaway
DPs who used the FX3 at feature level credit lenses, lighting and post far more than the camera body. The Creator was shot mostly on one vintage Kowa 75mm anamorphic lens. Diffusion filters (Pro-Mist and Black Diffusion types), vintage or anamorphic glass, good ND and lighting are widely recommended for taking the digital edge off the image. Much of this guidance comes from opinion or vendor sources, not controlled tests.

### Cited Findings
- **The Creator (dir. Gareth Edwards; DPs Greig Fraser ASC ACS and Oren Soffer):**
  - Shot mainly on the FX3, chosen partly for its low-light ability; the camera was cheap enough to buy several bodies.
  - "95% of the film was shot on one vintage 75mm Kowa anamorphic lens," recorded to an Atomos Ninja in ProRes RAW.
  - Fraser earlier shot test commercials with the same combination, and a FotoKem screening showed the image held up at cinema quality.
  - — [No Film School "One Lens, One Vision"](https://nofilmschool.com/one-lens-one-vision-the-cinematography-of-the-creator); [No Film School](https://nofilmschool.com/greig-fraser-gareth-edwards-sony-fx3); [RedShark](https://www.redsharknews.com/shooting-the-creator-on-a-sony-fx3); [British Cinematographer](https://britishcinematographer.co.uk/oren-soffer-and-greig-fraser-asc-acs-the-creator/); [Sony Alpha Universe production profile](https://www.sony.ie/alphauniverse/stories/production-profile-the-creator) (snippets)
- **Diffusion filters:** Filmmakers use Pro-Mist-style filters to "de-digitize" overly sharp modern lenses and sensors; a diffusion filter "will soften the sharpness of a modern lens for a more retro look." Tiffen markets Black Diffusion FX as turning "harsh digital sharpness into a classic, ethereal cinematic look" (vendor claim). Note that "FX3" is also a Tiffen filter strength, a source of search confusion. — [Digital Camera World: best diffusion filters](https://digitalcameraworld.com/buying-guides/best-diffusion-filters); [Vocas Tiffen listing](https://en.vocas.nl/tiffen-58mm-black-diffusion-fx-3-filter.html) (snippets)
- **Lens over body:** One writer concludes that for a film-like look "the lens matters just as much as the camera." — [Digital Camera World](https://www.digitalcameraworld.com/cameras/digital-cameras-that-look-like-film-are-trendy-but-the-secret-to-that-retro-look-may-actually-be-the-lens) (opinion; snippet)
- **Firmware support for anamorphic:** Official firmware added anamorphic de-squeeze (v3.00) and more ratios (v7.00), so vintage anamorphics are well supported in monitoring. — [Brian Smith](https://briansmith.com/sony-fx3-fx30-firmware-anamorphic-de-squeeze-24p-4k-dci-creators-app-compatibility); [cameradecision](https://cameradecision.com/blog/Sony-FX3-and-FX30-Firmware-Updates-adds-the-BIG6-setting-15x-and-16x-anamorphic-de-squeeze-and-BRAW-Recording-) (snippets)

### Inferences
- Rough ranking of where an FX3 owner gets more "cinema" per dollar: lighting and contrast control, lenses (vintage, anamorphic, or simply matched cine sets), diffusion / ND / IR-cut-aware ND, then the grade (a good S-Log3-to-film LUT or a color-managed pipeline). RAW comes next. Firmware hacks contribute nothing to image quality today. This ranking is an editorial synthesis, not a measured result.
- Strong ND filters on Sony sensors can introduce IR contamination. This is a common community claim, unverified in this research; use IR-cut ND.

### Gaps
- I could not fetch the full interviews (British Cinematographer, B&H) for exact ISO, picture profile, diffusion or LUT details on The Creator. I found no confirmed source for its exact base ISO or filtration.
- I found no controlled test that ranks diffusion or lenses against codec or RAW in perceived image quality.
