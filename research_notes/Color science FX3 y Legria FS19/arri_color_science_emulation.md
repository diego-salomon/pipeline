# ARRI Alexa "Color Science" and How Close a Sony FX3 Can Get in Post (as of Nov 2026)

Research note on method: The built-in WebFetch tool could not reach yedlin.net, arri.com, frame.io, juan-melara.squarespace.com or lowepost.com from this session (DNS blocked). The full texts of Yedlin's "On Color Science", the ARRI Color FAQ, Juan Melara's Sony2Alexa product page and Newsshooter's FX3 v2.00 firmware article were retrieved through a third-party fetch service (LurkAPI). Everything else comes from search-result snippets, which are less reliable. Claims that rest only on snippets are marked "(snippet)".

## 1. What makes the Alexa image look the way it does: real technical advantages vs marketing

### Takeaway
The Alexa's real, measurable advantages are capture-side. Large photosites and a Dual Gain Architecture (DGA) give it class-leading dynamic range and highlight headroom, and one consistent, well-documented log encoding (LogC3/AWG3, now LogC4/AWG4) makes its data predictable. The "look" people call Alexa color science comes mostly from ARRI's display transforms: the classic K1S1 / "ALEXA Classic 709" LUT, the newer ARRI 709, and the REVEAL DRTs. Those transforms are published, free and portable. ARRI itself says a camera "does not really have its own gamut".

### Cited Findings
**Sensor and dynamic range (real advantage)**
- ARRI describes the ALEV sensor design as resting on "two main principles": large photosites and a Dual Gain Architecture. DGA "simultaneously provides two separate read-out paths from each pixel with different amplification." — [ARRI ALEV sensors](https://arri.com/en/learn-help/technology/alev-sensors) (snippet)
- RedShark's Phil Rhodes explains why dual gain matters: building two readout paths, each capable of 60–70 dB at different amplification, "is much more plausible than one path reaching the full range." — [RedShark News](https://redsharknews.com/how-can-the-alexa-35-achieve-17-stops-of-dynamic-range) (snippet)
- ALEV 3 was used in the first ALEXA (2010) through ALEXA 65, LF and Mini LF. ALEV 4 (ALEXA 35) is a Super 35 4.6K sensor "with significantly increased dynamic range and higher sensitivity." — [ARRI ALEV sensors](https://arri.com/en/learn-help/technology/alev-sensors) (snippet)
- Marketing figure: ARRI claims 17 stops for the ALEXA 35, "with filmic highlight roll-off", from 1.5 stops more highlight headroom and 1 stop more shadow sensitivity than before. — [ARRI ALEXA 35 HDR page](https://www.arri.com/en/camera-systems/cameras/alexa-35-xtreme/alexa-35-and-alexa-35-xtreme-high-dynamic-range) (snippet)
- Independent measurement: CineD's lab measured the ALEXA 35 at 15.1 stops (SNR=2) and 16.3 stops (SNR=1) in ARRIRAW at EI 800, noting the 17th claimed stop "sits already inside the noise floor." CineD's camera database lists up to 15.3 stops (Open Gate, ProRes 4444 XQ, LogC4). It also reported recovery of up to 8 stops of underexposure with noise reduction. — [CineD ALEXA 35 lab test](https://www.cined.com/arri-alexa-35-lab-test-rolling-shutter-dynamic-range-and-latitude-plus-video/); [CineD database](https://www.cined.com/camera-database/?camera=ALEXA-35) (snippets)
- ARRI says its cameras capture HDR in a single exposure at one point in time, avoiding multi-exposure motion artifacts, and claims "the highest dynamic range of any camera" (a marketing claim). — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)

**Log encoding and gamut (LogC3/AWG3 → LogC4/AWG4)**
- ARRI: "Does a camera have its own gamut? ... There are no colors a camera can't see, so it does not really make sense to talk about the gamut of a camera." ARRI Wide Gamut 3/4 is only the encoding space used with Log C. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- LogC3 has been ARRI's encoding since 2011 (per ARRI's LogC4 documentation). Older cameras like the Mini LF output only LogC3 on SDI. — [ARRI LogC3/LogC4 mixing guideline](https://www.Arri.com/resource/blob/359512/56ec83a18dbcb2f147dd1498b90115f1/arri-mixing-arri-logc3-and-logc4-on-set-guideline-data.pdf) (snippet). The LogC3 math is public and implemented in the open-source `colour` library, including EI-dependent parameters. — [colour-science docs](https://colour.readthedocs.io/en/latest/_modules/colour/models/rgb/transfer_functions/arri.html) (snippet)
- In LogC the maximum code value depends on EI. ARRI's LogC→video LUTs "normalize" so the sensor clip point always maps to 100% video, whether it is 6, 7 or 8 stops above middle grey. "Photometric" LUTs skip this step. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- ARRI on REVEAL: "With the new ALEV4 sensor we've taken our color science through its biggest rewrite since we introduced the ALEV3 sensor in the first ALEXA in 2010... LogC3 had to change to hold all the dynamic range... So all is new: ARRI Color Engine, ARRI Wide Gamut 4, LogC4. To sum it up we call the new color science REVEAL." — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- ARRI's 2022 grading guide lists REVEAL's components as a new debayer (ADA-7), a new color engine (ACE4), AWG4 and LogC4. AWG4 has a D65 white point per the LogC4 specification. — [ARRI "How to grade LogC4" PDF](https://arri.com/resource/blob/283986/223017b546a29cfe7aa7f1efcefc0b88/2022-07-alexa-35-how-to-grade-logc4-footage-data.pdf); [ARRI LogC4 specification](https://www.afcinema.com/IMG/pdf/9/2/e/arri_logc4_specification.pdf) (snippets)
- REVEAL is used inside ALEXA 35, 35 Xtreme and 265. ALEV3 ARRIRAW (every digital ARRI except D-20/D-21) can be debayered into AWG4/LogC4 for a "perfect color match", according to ARRI. — [ARRI REVEAL page](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/reveal-color-science) (snippet); [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- LogC4 is "too different" from LogC3 for looks or LUTs to be converted. ARRI says they must be rebuilt visually and "highly recommend[s] not to create an inversion of an ALF2 look to create an ALF4 look." — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- Historical: from SUP 3.0 to 7.0 ARRI offered a "film style matrix" that made LogC color "similar to negative film scanned on an ARRISCAN", intended for use with a print film emulation. It is now discontinued. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)

**Display transforms: K1S1, ARRI 709, ALF-2, ALF4 (where the "look" largely lives)**
- The old ARRI K1S1 Rec.709 LUT has been renamed "ALEXA Classic 709". A newer "ARRI 709" LUT became the default Rec.709 choice in AMIRA, SXT, Mini, LF and Mini LF. — [Lowepost "The new ARRI LUT"](https://wwwa.lowepost.com/insider/workflow/the-new-arri-lut-r56) (snippet; secondary source)
- ALF-2 (ALEXA SXT, Mini, AMIRA, 65, LF, Mini LF; all ALEV3) combines a creative grade (CDL or 3D LUT) with a color-space transform. The look must be built on LogC3, and the 3D LUT must have the Rec.709 transform baked in. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- ALF4 (ALEXA 35, 35 Xtreme, 265) separates a LogC4→LogC4 "Creative Modification Transform" (CMT) from the Display Render Transform (DRT). In-camera DRTs are REC 709, REC 2020, REC 2100 PQ and REC 2100 HLG, matching the post LUTs `ARRI_LogC4-to-Gamma24_Rec709-D65_v1`, etc. Custom DRTs are possible in "Custom Color Management" mode. ALF2 and ALF4 are not interconvertible. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- The ARRI Look Library is free, as LogC3 and LogC4 log-to-log 3D LUTs and as ALF2/ALF4 files. ARRI's online LUT Generator (LogC3 only) and the LogC4 LUT package give the official conversion LUTs. The ARRI Reference Tool (ART) replaces the discontinued ARRI Color Tool. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)

**Texture/noise**
- ALEV3 cameras expose sharpness, detail and ARRI noise-reduction parameters (documented in an ARRI "Texture Control" white paper). The ALEXA 35/35 Xtreme instead have "ARRI Textures", a dedicated in-camera feature, while the ALEXA 265 has fixed settings. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- For low light, ARRI recommends ALEV4's EI 6400, "Enhanced Sensitivity" mode and a Shadow Texture. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)

### Inferences
- **Real, non-transferable advantages:** highlight headroom and total DR (about 15+ measured stops on ALEXA 35, from DGA and large photosites); clean single-exposure HDR; a noise floor and texture that ARRI tunes in-camera (ARRI Textures); and consistent, documented encoding.
- **Transferable "look" components:** the tone curve and roll-off of the display transform (K1S1 / ARRI 709 / REVEAL DRT), the color rendering in the 709 LUTs, and the Look Library looks. These are free math that can be applied to any footage once it is mapped into LogC/AWG.
- **Partly marketing:** "17 stops" (independent tests find about 15–16), and "filmic highlight roll-off" as a sensor property. Roll-off is largely produced by the DRT curve, provided the sensor has the headroom to feed it. Yedlin makes this point directly (Section 2).

### Gaps
- No ARRI primary source found that gives an official stop count for ALEV3 (the commonly cited "14+ stops" figure was not verified).
- Specific REVEAL improvements (for example, hue linearity for saturated colors) could not be verified because the frame.io and ARRI REVEAL pages could not be fetched.
- ARRI's "ALEV III dual gain" white paper text was not retrieved.

## 2. Steve Yedlin ASC: Display Prep Demo, "On Color Science", and how he matched cameras

### Takeaway
Yedlin argues that with any professional-quality capture format, "the substantial part of the perceptual look comes from the mathematical preparation of the image for display and not from the camera format." He demonstrated this by cutting 35mm film against Alexa footage that had a single fixed, non-shot-specific transform applied. Calibrated-theater audiences, including top DPs and colorists, could not tell which was which better than chance. His tools are custom-built math: empirical tone mapping, 3D geometry and scattered data interpolation in RGB space, plus probability-based grain, halation and gate-weave models. He stresses that the approach only works if the camera captured enough data. No source found names Nuke as his platform.

### Cited Findings
- Display Prep Demo: shot July 2015, shown at Camerimage, and overhauled in April 2019 (v2) with new masters and a rewritten voiceover. It intercuts 35mm film and Alexa without saying which is which. — [ASC: Yedlin releases Display Prep Demo](https://theasc.com/news/yedlin-releases-display-prep-demo); [yedlin.net Display Prep Demo page](https://www.yedlin.net/DisplayPrepDemo/)
- Method: the same algorithm version was applied to all Alexa shots, with no side-by-side reference and no shot-specific tailoring. Film and Alexa were shot under the same circumstances with the same lenses. Later color correction was limited to overall color and luminance balance. — [yedlin.net Original Voiceover](https://www.yedlin.net/NerdyFilmTechStuff/OriginalVoiceover_DispPrepDemo) (snippet); [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- Core thesis (June 20, 2016 essay): "As long as we're comparing high quality capture formats that get enough information for professional cinema (and not inferior acquisition devices like, say smartphone cameras), then whether we're talking about color rendition, apparent resolution, highlight rolloff, halation, or myriad other perceptual attributes, the substantial part of the perceptual look comes from the mathematical preparation of the image for display and not from the camera format." — [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- Evidence 1: one scan of one 35mm frame, prepared with the display-prep math of three major Hollywood post houses, a generic prescription and his own, looks substantially different each time. Alexa alone also varies a lot across prescriptions, while film and Alexa under "equivalent (not identical)" preps look nearly the same. "There's no consensus even from top vendors on what the core starting point is." — [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- Evidence 2 (blind viewing): filmmakers shown the DCP in calibrated theaters "never identify which image is film and which is Alexa any more reliably than could be done by random guessing." — [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- Outliers (the palm-tree green): residual hue differences can be pushed either way by changing the prep of either format. Film can also be prepared to look "Alexa-like". — [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- On grading tools: grading software UIs are complex, but "the underlying math... is too primitive and simple to achieve the type of transformations I'm talking about." Grading is a "polishing step" and cannot replace the core transform. He compares the split to Color Timer vs Kodak chemist. — [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- Attribute taxonomy: intrapixel (contrast, density, color, highlight roll-off, skin tones), spatial (resolution vs apparent sharpness, halation), temporal (motion blur, frame rate, rolling-shutter sweep). Grain and gate weave span categories. — [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- Tools he describes:
  - Empirical tone mapping to match one system's tonal response to another's "all through the latitude range".
  - "Three dimensional geometry" and "scattered data interpolation" to remap 3D color data. He shows Alexa and Kodak 5219 data sets (scanned on a Scanity with defined settings) being mapped onto each other.
  - His own probability-distribution-based grain algorithm built from real film data, plus empirical halation and gate-weave models.
  - "I had to build custom tools from scratch because existing off-the-shelf solutions were not suitable."
  — [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- The crucial caveat (the "Camera A vs B" example): "Recovering data that was never captured is impossible. But what is possible is to remap captured data." He would choose a camera with more highlight latitude and a faster shutter sweep over one with a pleasing out-of-box color, because display prep can replace the color but cannot recover the missing data. — [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- He has said manufacturer LUTs are "just a proposed way to display data", which he doesn't have to use. On *Danny Collins* he used a system built from photochemical data sets that converts Alexa LogC into a photochemical-like response, plus a custom probability-map grain. He applied the same process to *Knives Out*, and says *The Last Jedi* "is the biggest display prep demo of all time." — [British Cinematographer](https://britishcinematographer.co.uk/steve-yedlin-danny-collins/); [Studio Daily, Knives Out](https://studiodaily.com/2019/11/steve-yedlin-asc-controlling-look-knives-out); [ASC](https://theasc.com/news/yedlin-releases-display-prep-demo) (snippets)
- Yedlin, Rian Johnson and Eric Cameron released Chromagraph Camera, an iPhone app that builds images from raw sensor data using his film color math, including grain and halation. — [CineD](https://www.cined.com/?p=446292) (snippet)
- Skeptical view: RedShark News suggested the work may be little more than "clever". — [RedShark News](https://redsharknews.com/production/item/3184-is-the-secret-of-emulating-film-all-in-the-display-prep) (snippet)

### Inferences
- Applied to FX3 to Alexa, Yedlin's framework splits the problem in two. (a) Color and tone rendering is a remapping problem that can be solved with good transforms. (b) Data-collection gaps cannot be fixed in post: highlight clip point, noise floor, codec/bit depth, and shutter sweep. The FX3's limits sit mostly in (b).
- His own exclusion of "inferior acquisition devices like smartphone cameras" leaves open where a 10-bit, consumer-codec FX3 falls. The thesis implies the FX3 can match Alexa color and tone within its captured range, but not its headroom or texture under stress.

### Gaps
- No source confirms Nuke as Yedlin's platform, or tetrahedral interpolation specifically. He describes his tools only as custom-built ("3D geometry", "scattered data interpolation"). Treat "Nuke" as unverified.
- His resolution demos were not retrieved in this session.
- He did not publicly demonstrate a Sony mirrorless to Alexa match. His published work is Alexa vs 35mm film.

## 3. Camera matching methods (charts, CST, IDTs, 3D LUT generation, Lattice)

### Takeaway
The standard technical route has three layers. First, a Color Space Transform from S-Log3/S-Gamut3(.Cine) into ARRI LogC3/AWG3, which only changes the encoding container. Second, an optional chart-derived camera-match transform (a 3×3 matrix, or a 3D LUT or scattered-data fit from side-by-side chart shoots) that corrects the sensor's spectral differences. Third, an ARRI DRT: K1S1/ALEXA Classic 709, ARRI 709, or a REVEAL DRT. A plain CST gets the tone curve and gamut container right but not the sensor's color response. That is why chart-based matching exists.

### Cited Findings
- Resolve CST approach: set the input to Sony S-Log3 / S-Gamut3.Cine and the output to ARRI LogC3 / ARRI Wide Gamut, then apply ARRI's LUT. The same source warns against matching by eye with lift, gamma and gain. — [Cutsio: mixed ALEXA 35 / FX6 / FX3 pipeline](https://cutsio.com/blog/mixed-alexa-35-sony-fx6-fx3-color-pipeline); [Cutsio: color-matching workflow](https://cutsio.com/blog/color-matching-workflow-davinci-resolve-arri-sony-canon) (snippets)
- The same source names highlight roll-off and skin tones as the hardest parts to match, and recommends using a LUT only as a viewing transform while grading from the original log. — [Cutsio](https://cutsio.com/blog/mixed-alexa-35-sony-fx6-fx3-color-pipeline) (snippet)
- A LUT vendor advises using S-Gamut3 rather than S-Gamut3.Cine as the source gamut when converting S-Log3 to LogC3. — vendor snippet via [search result for S-Log3→LogC3](https://terra88.sellfy.store/p/cinelog-convert) (snippet; vendor claim)
- A colorist blog describes a 3×3 matrix/technical transform as the method high-end post houses use for camera matching. It also gives a method for computing an "inverse camera native matrix" from a ColorChecker shot in S-Log3 plus a RAW still. — [How to calculate the Inverse Camera Native Matrix](https://tarpon-apple-f3n2.squarespace.com/blog/how-to-calculate-the-inverse-camera-native-matrix) (snippet)
- Classic side-by-side chart workflow, Canon C300 to Alexa: [ProVideo Coalition](https://www.provideocoalition.com/color-matching-a-canon-c300-to-an-arri-alexa/). The CML (Cinematography Mailing List) also has a camera-match page. — [CML](https://cinematography.net/edited-pages/camera-match.html) (snippets)
- Lattice (Video Village) can convert 3D LUTs and can export an "approximate" ARRI Look XML (ALF1). ARRI itself names it as a third-party option. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- ACES: ARRI provides an ACES 1.3 IDT for REVEAL (AWG4/LogC4) but no in-camera ACES workflow. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- Practical note from Juan Melara's product: LogC LUTs were re-exported "without gamut mapping/saturation compression" so that values below LogC's black level (code 95) are not clamped. This shows that out-of-range handling matters when converting into LogC. — [Juan Melara Sony2Alexa](https://juan-melara.squarespace.com/products/sony-to-alexa-powergrade-and-luts)
- Historical: on F55 footage, a 2015 test found "almost no difference" between Sony's LC709 Type A and ARRI's Rec.709 LUT, with the ARRI version slightly more saturated. LC709 Type A was in fact designed to emulate the Alexa 709 look. — [DVinfo](https://www.dvinfo.net/?p=11525); [ProVideo Coalition: hack Alexa LUT into Sony F cameras](https://www.provideocoalition.com/hack-alexa-lut-into-sony-f-cameras/) (snippets)
- Cullen Kelly's documented teaching on Mixing Light covers look development: anchoring middle grey with an exposure chart, contrast with Custom Curves and the HDR Zone tool, preferential color mapping, and a piece comparing ARRI's LogC4 LUTs to Resolve Color Management. — [Mixing Light author page](https://mixinglight.com/author/cullen-kelly/); [dvresolve.com tutorial](https://dvresolve.com/tutorial/basic-creative-look-development/) (snippets)

### Inferences
- Recommended rigorous workflow (synthesized from the above, not one source's recipe):
  1. Shoot a ColorChecker or similar chart plus a grey scale with the FX3, ideally next to an Alexa or from Alexa reference data, under the same light.
  2. CST S-Log3/S-Gamut3 to LogC3/AWG3.
  3. Fit a 3×3 matrix (or a 3D LUT with Lattice or a custom fit) to minimize chart error.
  4. Apply ARRI's official LogC3→Rec.709 LUT from the LUT Generator. For LogC4/REVEAL, the official DRT LUTs.
  5. Grade the creative look in log, upstream of the DRT.
- Because LogC4 looks cannot be derived from LogC3 ones (per ARRI), FX3 users should choose a target: the "classic Alexa" look (LogC3 + K1S1 / ARRI 709) or REVEAL (LogC4 + ARRI DRT).

### Gaps
- No Cullen Kelly piece specifically on matching Sony to Alexa was found. His Mixing Light/YouTube content was not fetched, so his views on "color science" as a concept are not cited here.
- No Lift Gamma Gain or Lowepost thread on FX3 to Alexa could be fetched (Lowepost was DNS-blocked).
- No Sony or ARRI official document gives an S-Log3→LogC3 transform. The CST math comes from Resolve's built-in color management.

## 4. Products and LUTs claiming Sony to ARRI conversion: what they are and their limits

### Takeaway
Several real, identifiable products exist. Juan Melara's Sony2Alexa (FX3/A7SIII/A7IV/FX6 to LogC, plus ARRI 709 output LUTs) is the most transparent, and it explicitly admits it is not a 100% match. FilmConvert CineMatch profiles a source camera and re-renders it into a target camera such as an ALEXA 35 pack. Colourlab AI does computer-vision shot and camera matching. Gamut.io BaseLUTs claims sensor-matched emulation of ARRI Classic709. Many smaller Sellfy/Gumroad vendors make unverifiable claims. ARRI's own LUTs and Look Library are free and are the reference target.

### Cited Findings
- **Juan Melara: "Sony A7SIII, A7IV, FX3 and FX6 to Alexa PowerGrade and LUT" (Sony2Alexa).**
  - Pricing: LUTs USD $19.99, PowerGrade $29.99, bundle $39.99.
  - Contents: a "LogC camera match" LUT that transforms FX3/A7SIII footage "to match the Alexa in its native LogC format", meant to pair with any Alexa output LUT. Also bundled ARRI LogC2Video Rec.709 output LUTs (Standard, Standard V2, Standard V3, WDR V2), 65-point post LUTs, and 33-point in-camera/on-set LUTs.
  - Variants: Resolve Color Managed (DaVinci Wide Gamut/Intermediate) PowerGrades, and separate A7IV and FX6 transforms (FX6 added 21 May 2025).
  - The vendor's own stated limit: "The transform does not produce a 100% accurate match to the Alexa, but it's still a better start point than Sony's standard colour science."
  - Initial release 19 June 2022.
  — [Juan Melara product page](https://juan-melara.squarespace.com/products/sony-to-alexa-powergrade-and-luts)
- Melara also sells parallel BMPCC 6K→Alexa and Canon C70/C300 III→Alexa packs, which shows a consistent methodology across brands. — [Melara BMPCC](https://juan-melara.squarespace.com/products/bmpcc-6k-to-alexa-powergrade-and-luts); [Melara Canon](https://juan-melara.squarespace.com/products/canon-to-alexa-powergrade-and-luts) (snippets)
- **FilmConvert CineMatch / Nitrate.** CineMatch is a camera-matching plugin for Resolve and Premiere. FilmConvert splits a camera's look into "the light-sensing characteristics of the sensor" and "the color science created by the camera manufacturer": it profiles the sensor, then reapplies the target's color science. An ALEXA 35 camera pack (LogC4) was added in February 2025. Workflow: source profile = your camera, target = ARRI profile, then a Rec.709 transform. When combined with Nitrate, do the ARRI conversion in CineMatch. — [Newsshooter, Feb 2025](https://www.newsshooter.com/2025/02/20/filmconvert-nitrate-cinematch-now-support-the-arri-alexa-35/); [FilmConvert ALEXA 35 pack](https://www.filmconvert.com/blog/?p=2727); [ProVideo Coalition review](https://www.provideocoalition.com/cinematch-from-filmconvert/); [CineD](https://www.cined.com/filmconverts-cinematch-and-nitrate-now-compatible-with-the-arri-alexa-35/) (snippets)
- **Colourlab AI.** A Resolve plugin using "computer vision and machine learning" for shot and look matching. v2.0 added instant matching of shots from different cameras "in a full color-managed pipeline". It supports 40+ camera spaces including ARRI and Sony. Mixing Light has a "Computer-Assisted Shot Matching with Colourlab AI" tutorial. — [CDM](https://cdm.link/colourlab-ai-1-0-arrives-and-the-future-of-color-grading-comes-with-it-details/); [Colourlab AI for Resolve](https://colourlab.ai/colourlab-ai-for-davinci-resolve/?amp=1); [Mixing Light](https://mixinglight.com/color-grading-tutorials/computer-assisted-shot-matching-with-colourlab-ai-part-1) (snippets). Pricing seen on a promotional page (Creator $29 / Pro $49) is unverified.
- **Filmatica ColorClone**: announced as an AI camera-matching plugin for Resolve and Premiere. — [CineD](https://www.cined.com/filmaticais-colorclone-announced-an-ai-camera-matching-plug-in-for-davinci-resolve-and-adobe-premiere-pro/) (snippet)
- **Gamut.io BaseLUTs**: markets "True ARRI emulation" with sensor-matched transforms toward ARRI Classic709 / K1S1, covering Sony cameras among others. — [gamut.io](https://gamut.io/true-arri-emulation-baseluts-reimagined/); [gamut.io Sony](https://gamut.io/camera/sony/) (snippets; vendor marketing)
- A related "One LUT" for Apple Log was marketed as "perfectly" matching the Alexa look. This illustrates the marketing language common in the category. — [PetaPixel](https://petapixel.com/2024/01/26/the-one-lut-for-apple-log-perfectly-matches-the-arri-alexas-iconic-look) (snippet)
- Smaller vendors: Serr "Sony to Arri Alexa Conversion LUTs" (sold via Moment), James Jackson "ARRI LogC3 camera matching node trees and LUTs", Terra88 "CineLog Convert", Rocket Rooster Sony LUTs and "Infinity Grades Sony FX series". — [Moment/Serr](https://www.shopmoment.com/products/serr-sony-conversion-luts); [James Jackson](https://james-jackson-films.sellfy.store/p/arri-logc3-camera-matching-node-trees-and-luts/) (snippets; no independent evaluation found)
- **ARRI's own free tools** (the reference target): LUT Generator (LogC3), the LogC4 LUT package, the Look Library as LogC3/LogC4 log-to-log LUTs plus ALF2/ALF4, and the ARRI Reference Tool. — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
- A vendor-blog claim (Cinecolor) that Sony S-Log3 has a "bad reputation" for color science is marketing framing. — [cinecolor.io](https://cinecolor.io/blogs/news/how-to-male-sony-s-log3-footage-look-like-arri-alexa-35-without-complex-tools) (snippet)

### Inferences
- Professional standing: Melara's work appears often in colorist circles and he publishes his limits, but no independent professional review of Sony2Alexa was found. CineMatch and Colourlab are covered by trade press and Mixing Light. No independent accuracy measurement (for example, ΔE vs a real Alexa) was found for any product.
- All of these products target color/tone (Yedlin's intrapixel category). None can add highlight headroom or change noise structure.

### Gaps
- **Leeming LUT**: no result found tying Leeming LUT Pro to an Alexa emulation for FX3. I did not verify whether Leeming LUTs cover the FX3 or claim Alexa emulation.
- **Dehancer**: no result found on a Sony to ARRI conversion. Dehancer is a film-emulation plugin; its camera-profile coverage of the FX3 is unverified.
- **Hector Berrebi / "Alexa emulation" packs**: no source found. Do not cite.
- **CineMatch FX3 profile**: FilmConvert has profiles for other Sony cameras (a7S III, a6700, a7R V), but an FX3-specific pack was not confirmed. FX3 users typically use the a7S III profile (same sensor family). That is an inference, not verified.
- Cullen Kelly's commercial looks/tools were not verified in this session.

## 5. Hard physical limits: what the FX3 cannot match, and what ProRes RAW improves

### Takeaway
The FX3 can be remapped to Alexa color and tone within its captured range. It cannot match the Alexa's extra highlight headroom, its noise floor and texture, or its intra-frame image integrity under heavy grading. Internal recording is 10-bit 4:2:2 XAVC with in-camera noise reduction and lens corrections. External ProRes RAW via Atomos (12-bit, 4.2K) removes some processing and quantization limits, but not the sensor's dynamic range.

### Cited Findings
- Sony claims 15+ stops for the FX3 in S-Log3. A secondary roundup says measured results are "typically 13–14 usable stops in 10-bit files after grading" (no test lab named). Compare the ALEXA 35 at 15.1 stops SNR=2 in CineD's lab. — [ts2.tech roundup](https://ts2.tech/en/sony-fx3-vs-fx6-vs-a7s-iii-the-2025-comprehensive-comparison/) (snippet; low reliability); [CineD ALEXA 35](https://www.cined.com/arri-alexa-35-lab-test-rolling-shutter-dynamic-range-and-latitude-plus-video/)
- FX3 sensor: about 10.2 MP effective (sources say 10.2 or 10.3 MP), with dual base ISO 800/12,800 in S-Log3/Cine EI. — [Camaleon Rental guide](https://www.camaleonrental.com/gb/blog/sony-fx3-complete-guide.html); [Newsshooter FX3 v2.00](https://www.newsshooter.com/2022/07/13/sony-fx3-version-2-00-firmware-update/) (Newsshooter confirms base ISO 800/12800)
- Rolling shutter: a secondary roundup cites about 8–9 ms for FX3/A7S III, unverified. — [ts2.tech](https://ts2.tech/en/sony-fx3-vs-fx6-vs-a7s-iii-the-2025-comprehensive-comparison/) (snippet; unverified)
- ProRes RAW: the FX3 outputs a 16-bit linear RAW signal over HDMI at 4.2K (4240×2385). The Ninja V/V+ records it as 12-bit ProRes RAW. Internal recording is 10-bit XAVC at 3840×2160 and includes lens corrections and noise reduction, which the RAW path skips. ProRes RAW files run a bit over twice the size of internal XAVC S-I. Enabling RAW output locks the internal frame rate to the RAW output frame rate. — [Sony Cine: shooting RAW with FX3](https://sonycine.com/articles/shooting-raw-with-the-fx3-and-alpha-7s-iii); [4K Shooters: ProRes RAW vs internal](https://4kshooters.net/2023/11/10/prores-raw-vs-internal-recording-on-the-sony-fx3); [CineD](https://www.cined.com/atomos-ninja-v-will-record-prores-raw-from-the-sony-fx3/) (snippets)
- Yedlin's principle: lost highlight data and slow shutter sweep "can never" be retrieved, only remapped. — [On Color Science](https://www.yedlin.net/NerdyFilmTechStuff/OnColorScience/)
- ARRI controls texture and noise in-camera (ARRI Textures on ALEXA 35; Texture Control on ALEV3). — [ARRI Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)

### Inferences
- **What cannot be matched:**
  - About 1–2+ stops less highlight headroom than ALEXA 35. The FX3 clips earlier, so the Alexa's gentle roll-off in extreme highlights (practicals, skies, specular light) has no data to work with. A DRT can roll off only what was captured.
  - A different noise structure. The FX3's internal NR and 10-bit long-GOP or All-Intra compression produce smearing or blockiness in shadows under push. Alexa ProRes 4444 XQ / ARRIRAW at 12-bit has a cleaner, finer-grained floor.
  - Rolling-shutter skew. Yedlin calls this a temporal attribute that cannot be fixed in post.
- **Format:** both FX3 and Mini LF are full-frame-ish, so the FX3 is not at a format disadvantage against the Alexa Mini LF. Against the ALEXA 35 (Super 35), the FX3 is actually larger. "Large-format look" is therefore not a blocker. Note that classic Alexa Mini/SXT is Super 35.
- **ProRes RAW helps** with bit depth (12-bit vs 10-bit, meaning less banding and better skin and gradients under heavy transforms), removes in-camera NR and lens corrections, and gives slightly more resolution. It does not add dynamic range. It also complicates the Resolve workflow: ProRes RAW support in Resolve historically lagged, which is outside this research's scope and unverified here.

### Gaps
- No CineD lab test of the FX3 itself was found in results, so a reliable independent DR number for the FX3 is missing. The a7S III / FX3 sensor tests by CineD likely exist but were not retrieved.
- No verified rolling-shutter measurement for the FX3.
- Current (2026) Resolve support status for ProRes RAW was not verified.

## 6. Baking an ARRI-like LUT into the FX3 in-camera

### Takeaway
Yes. Since firmware v2.00 (July 2022), the FX3 imports up to 16 user 3D LUTs in 33-point .cube format. A LUT can be burned into the recording by registering it in a Picture Profile ("PP LUT"; one user reports the menu item as "Basic Look"). In the dedicated Log/Cine EI modes, the LUT is monitoring-only plus metadata, and the file stays S-Log3. Melara's Sony2Alexa includes 33-point "In-Camera/On-Set" LUTs for exactly this purpose.

### Cited Findings
- FX3 v2.00 added Cine EI, Cine EI Quick and Flexible ISO for S-Log3, preset LUTs (s709), user LUT import (up to 16), and embedded LUT/EI metadata readable in Catalyst Prepare/Browse. "Any LUT that you import can also be 'baked' into your footage if you register it as a picture profile." — [Newsshooter FX3 v2.00](https://www.newsshooter.com/2022/07/13/sony-fx3-version-2-00-firmware-update/)
- The FX3 accepts 33×33×33 .cube LUTs from an SD card. In Log shooting mode, "the LUT is NOT BAKED IN to the file, the recording remains as S-Log3" (only metadata is saved). To bake in, you leave the Log shooting mode and use a Picture Profile with the user LUT selected under "PPLUT"/"Basic Look". One user also warns that with a LUT on, it bakes into the proxies. — [XDCAM-User: notes on FX3 v2 update](https://www.xdcam-user.com/2022/07/notes-on-the-fx3-version-2-update) (snippet; Alister Chapman, a well-known Sony workflow writer)
- Juan Melara ships 33-point In-Camera/On-Set Rec.709 LUTs (Sony2Alexa camera match combined with ARRI Rec.709 Standard V2/V3/WDR V2), "for camera and monitor compatibility". — [Juan Melara](https://juan-melara.squarespace.com/products/sony-to-alexa-powergrade-and-luts)

### Inferences
- Baking a LogC3-match + ARRI 709 LUT gives an Alexa-like Rec.709 image straight out of camera. But it throws away log latitude, bakes in the 709 highlight roll-off and clipping, and is limited by 33-point LUT precision and 10-bit 709 encoding. Most colorists would advise recording S-Log3 with the LUT as monitor/metadata only and applying the 65-point version in post. Cutsio gives the same "LUT as viewing transform" advice.
- Whether later FX3 firmware (v3.x/v4.x, through 2026) changed the LUT menu naming or behavior was not verified.

### Gaps
- The exact current menu label ("Basic Look" vs "Base Look") under current firmware is unverified. Check Sony's current FX3 Help Guide.
- No source confirms whether the newer "FX3A" variant (seen as model ILME-FX3A in one retail listing) differs in LUT handling.
