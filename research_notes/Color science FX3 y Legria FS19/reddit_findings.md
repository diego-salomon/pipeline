# Reddit: color science, firmware y IA para una Sony FX3 y una Canon Legria FS19

Investigación en Reddit, 2026-11-09. Perspectiva: cineasta independiente, dueño de las dos cámaras, con enfoque práctico. Decisión: qué vale la pena hacer para sacar la mejor imagen y el mejor look.

**Aviso de método (leer primero).** El diagnóstico de la skill (`arctic.py preflight`) dio el veredicto **"Ninguna"**: esta sesión no tiene la CLI de Composio, y el proxy de la organización bloquea `arctic-shift.photon-reddit.com` y `www.reddit.com` (403). La skill pide revisar también si la sesión trae otras herramientas de Reddit. Había una: el MCP **LurkAPI**, que lee posts y comentarios públicos de Reddit (búsqueda global, búsqueda dentro de un subreddit, hilo con sus comentarios). Toda la evidencia de este informe viene de ahí, es decir, de Reddit mismo, sin blogs ni webs como sustituto. LurkAPI cobra créditos por llamada y el saldo se agotó a las **19 llamadas** (2 de ellas fallidas). Fue entonces una pasada **media-corta**, no el modo completo: ver "Confianza y límites".

---

## Respuesta directa

1. **La app que buscabas se llama Chromagraph, no "Chromacast".** Es una app de cámara para iPhone que salió a fines de octubre de 2026, con Steve Yedlin (director de fotografía de *Knives Out*) y Rian Johnson detrás. Solo hace fotos, no video, y cuesta unos USD 12.99 de pago único, con precios regionales más bajos. En Reddit nadie dice haberle hecho ingeniería inversa. Varios usuarios, en dos comunidades distintas, la describen como "en esencia un LUT o transform (posiblemente LogC más un look), más grano y halación, más captura RAW o Bayer por bracketing", y dicen que hay LUTs parecidos. El grano y la halación reciben elogios. Las quejas más repetidas son que no hay preview del look en vivo, que la interfaz es básica, que hay un solo look y que el tono sale naranja o amarillo.
2. **Que la FX3 se parezca a una Alexa es, para los coloristas que leímos, una tarea de gestión de color y no de magia.** Convertir S-Log3/S-Gamut3.Cine a LogC3, igualar balance de blancos y exposición en lineal, y después ajustar a mano con scopes. Lo hacen a diario. Las herramientas que mencionan son ColorClone, el DCTL tetra, FilmConvert CineMatch y Color Warper. El argumento de Yedlin de que la "color science" inalcanzable de ARRI es un mito tiene defensores fuertes y detractores igual de fuertes: unos dicen que eso es justamente su punto, y otros que "es solo un LUT con mucha jerga".
3. **ProRes RAW o BRAW por grabador externo en la FX3 sí da más margen, pero con rendimientos decrecientes.** Ayuda sobre todo si vas a empujar mucho la imagen o a corregir balance de blancos, y a cambio pierdes reducción de ruido en cámara, correcciones de lente, compensación de breathing y estabilización por giroscopio. Antes de comprar un Ninja conviene hacer una prueba propia.
4. **Hackear la FX3 no tiene hoy, en Reddit, un camino demostrado que mejore la imagen.** Hay una ola reciente (octubre de 2026) de hacks de firmware de Sony asistidos por IA, pero lo que se pide es open gate, bitrate o pre-captura en cuerpos Alpha. El único caso concreto de FX3 que encontramos es un costo: una cámara con el idioma desbloqueado por una modificación perdió la entrada de audio analógica, y Sony cotizó €745. Para la Legria FS19 no encontramos ningún hilo de Magic Lantern, CHDK ni firmware alternativo.
5. **La IA para video viejo de camcorder ayuda (reduce ruido, define bordes) pero no hace milagros.** En r/TopazLabs avisan que ningún modelo deja ese material como "4K real", que los modelos agresivos (Starlight Precise, Astra) pueden empeorar fuentes de calidad media y que cada modelo tiene "su look". Recomiendan la reducción de ruido temporal de Resolve Studio y pasadas conservadoras (Starlight Mini, Proteus, Iris).

Si hay que priorizar, lo que tiene más respaldo en lo que leímos es: (a) un pipeline de gestión de color bien armado para la FX3 (S-Log3 → LogC3 o un espacio de trabajo único, con un transform de display elegido a propósito), (b) RAW externo solo si una prueba muestra que tu grade se rompe en ProRes 422 HQ, (c) para la Legria, limpieza conservadora con IA o abrazar el look de camcorder, nunca intentar que pase por 4K. Firmware custom en la FX3: no lo recomienda nadie de lo leído, y hay un caso documentado de daño.

---

## Hallazgos principales

### H1. La app es Chromagraph, de Yedlin y Rian Johnson, y el consenso es que es un transform o LUT bien hecho con grano y halación, no un secreto (evidencia E1-E4)

- Identificación: cinco hilos en cuatro comunidades usan el nombre Chromagraph y lo atribuyen a Yedlin: r/cinematography `1xp7ltl` ("Steve Yedlin's Chromagraph Camera App", 2026-11-06), r/nofusion `1xipf52` (2026-10-29, 66 pts, 55 com), r/iPhoneography `1xmc1vz`, `1xkbwo7` y `1xpsmx0`, y r/ProjectIndigoiOS `1xipw08`. Un usuario de r/nofusion (almen72) dice que detrás están "Rian Johnson y su director de fotografía Steve Yedlin". También hay un hilo en r/sideload (`1xiwdnu`) que pide el IPA pirata. Lo anotamos como contexto, no como recomendación.
- Qué es técnicamente, según quienes la usan. Ninguno lo verificó:
  - max_retik, r/cinematography: "toma una imagen lineal y le aplica un LUT elegante, lo más probable una transformación a LogC con un look de color". Menciona un proyecto open source parecido, **Crepuscule**.
  - Brilliant_Copy5752: "es solo un LUT y grano, bloom, etc.". N8_M: "hay LUTs por ahí más o menos parecidos".
  - GlassKlass, r/nofusion, que la usó 48 horas: "en general es un LUT con captura bayerRAW y edición, hay LUTs bastante similares".
  - CaptainFalcon206: un solo look con balance de blancos, tinte, exposición, recorte, grano y halación. Arma RAW por bracketing incluso en iPhones que no son Pro.
  - En contra: ncphoto919 (16 pts, r/nofusion) dice que "no hay receta similar, es su propia cosa", y officialhoami destaca que el grano y la halación están "muy bien hechos", mejor que en otras apps.
- **Ingeniería inversa:** no encontramos a nadie que diga haberla hecho ni haberla replicado con un LUT concreto y publicado. La pregunta "se puede recrear con un LUT?" aparece (chillyjulius, Professional_Cow_928) y las respuestas son "hay LUTs parecidos", nunca "este LUT la replica".
- Críticas que se repiten, de usuarios distintos en dos comunidades:
  - No hay preview del look al disparar (SARShasMONO, 16 pts). EwanMcNugget lo resume: "cómo decides la exposición si no ves el resultado".
  - Interfaz "de desarrollador primerizo" (noxnoctus, 19 pts). Rango dinámico "recortado" en los controles de altas y sombras (noxnoctus). Lag del obturador (Loganca).
  - Sale "muy naranja" (jazzmandjango) o "un poco demasiado amarilla" (SSVR).
  - Gente que se arrepiente: ktkrup ("increíblemente decepcionado"), TCivan ("quiero mis 13 dólares de vuelta… más o menos").
- Lo que sí rescatan: sirve como editor de RAW o ProRAW tomados con otra app (noxnoctus, todayplustomorrow), y es simple, "te hace pensar menos en la cámara" (CaptainFalcon206).
- Alternativas que nombran: **Tech Scout** (ktkrup y chrisbsky, ambos en r/cinematography), que según ktkrup permite cargar tu propio LUT de monitoreo de la cámara y la color science del proyecto y fotografiar a través de él, útil para scouting. También NoFusion, PhotonCam, Moment Pro 2, Mood, Analogue y Lightroom en HDR.

**Para tu caso:** Chromagraph no sirve para la FX3 ni para la Legria, porque es una app de fotos para iPhone. Lo útil es la idea de fondo: un transform de display propio más una textura de grano y halación bien hecha, aplicados a todo el proyecto.

### H2. El argumento de Yedlin divide a r/cinematography, pero los dos lados coinciden en el hecho práctico: el transform de display es un paso que puedes controlar (E5)

Hilo clave: r/cinematography `10knvkf`, "Steve Yedlin's comparison of display prep transformations with Knives Out" (2023-01-25, 805 pts, 103 com). Es histórico, pero el argumento no depende de la fecha.

- **A favor:**
  - kwmcmillan (21 pts): "su punto no es que hizo un gran LUT, sino que su transform de espacio de color funciona mejor que los de fábrica. Se gradúa *debajo* de ese transform".
  - IM_A_BLOWFISH_YO (18 pts): usar el transform Rec709 de Resolve te deja "a merced" de ese transform. Agrega que con equipo prosumer hay menos datos, pero que cambiar cómo piensas el pipeline te da más autoría.
  - El autor del post (Ok-Neighborhood1865): la idea de que ARRI tiene una color science que nadie puede igualar "es un sinsentido", y con los datos y el proceso correctos puedes hacer que la imagen se vea como cualquier cosa.
  - ampsuu: su Sigma fp en RAW tiene un gamut comparable al de cámaras que cuestan entre 10 y 20 veces más.
- **En contra:**
  - C47man (159 pts, el comentario más votado): Yedlin es "verboso para parecer más listo". Para él, (1) es log visto en lineal, (2) es un transform Rec709 estándar y (3) "es literalmente un LUT que hizo. Todos hacen esto". Lo reconoce como genio técnico, pero hasta que "muestre la matemática" asume que trabaja con Resolve o Nuke.
  - greencookiemonster (17 pts): "pretentious bullshit, es un viewing LUT".
- Un comentario borrado afirma que el LUT se construye mapeando cartas de ±5 stops contra película 500T. Es un rumor sin fuente.
- Para quien quiera entender esto sin la jerga de Yedlin, un usuario recomienda el canal de **Cullen Kelly**.

### H3. Empatar S-Log3 con Alexa: los coloristas lo tratan como algo rutinario (E6)

Hilo: r/colorists `1sa9uvi`, "Matching FX6 to Alexa Mini" (2026-04-02, 14 com, todos leídos). La FX6 usa el mismo S-Log3/S-Gamut3.Cine que la FX3.

- ExpBalSat (7 pts) dice que empata a diario S-Log, C-Log, ARRI, RED, BRAW, HLG, D-Log M y otros. Su proceso: "primero gestión de color, después ajustes sutiles", apoyado en los scopes. Advierte que hay características que una cámara no puede reproducir de la otra, y que la profundidad de campo, el motion blur y la resolución también cuentan.
- finnjaeger1337: "convierte S-Log3 a LogC3 y empata a mano desde ahí. Empieza por balance de blancos y exposición en lineal, y ya estás al 90%".
- Herramientas que nombran: el DCTL tetra en lineal (ejacson), ColorClone (bnguyen227), FilmConvert CineMatch (shaheedmalik) y Color Warper (Sufficient-Ear-9151). Zakaree: "casi cualquier imagen log moderna se puede empatar con otra".
- El matiz que importa para tu caso viene de bozduke13: empatar es fácil cuando tienes material de Alexa como referencia, y "más difícil cuando quieres que tu FX6 parezca Alexa sin estar filmando con una", aunque sigue siendo posible.

Dehancer, los LUTs de Leeming y los LUTs de Cullen Kelly no aparecieron en los hilos que alcanzamos a leer, fuera de la mención de Cullen Kelly como divulgador. Falta evidencia de Reddit sobre ellos (ver límites).

### H4. RAW externo (Ninja V con ProRes RAW, o Video Assist con BRAW) en la FX3: mejor, pero menos de lo que promete el marketing (E7)

Hilo: r/colorists `1qbks94`, "Experience with 12-bit (B)RAW shot on FX3?" (2026-01-13, 29 com; leímos 8 de 12 ramas).

- gargoyle37 (técnico): "rendimientos decrecientes". ProRes 422 HQ con un log bien diseñado como S-Log3 y el RAW "están más cerca de lo que parecen". Para entregar en SDR a un observador humano, son prácticamente indistinguibles. El RAW pesa cuando hay que empujar mucho la imagen (balance de blancos o exposición fuera de rango) o en VFX y keying. Propone una prueba concreta: gradúa el RAW, reconfórmalo a ProRes 422 HQ y mira si el grade se rompe.
- joema2 dice haber graduado más de 1.000 entrevistas multicámara en S-Log3, BRAW, R3D y ProRes RAW, con FS5, FX6, A7SIII y Ronin 4D. Para él, el RAW de 12 bits no es una ventaja "tremenda" frente al XAVC-I de 10 bits 4:2:2 de la FX6, y es más ventaja frente al MP4 S-Log3 de las mirrorless. En Sony, con RAW pierdes reducción de ruido en cámara, correcciones de lente, compensación de breathing y estabilización por giroscopio en post. La diferencia se nota en los qualifiers HSL, y muchas veces hace falta una pasada de denoise.
- ejacson: "es raw que se comporta como se espera". La ventaja principal es el balance de blancos antes del debayer y la señal 4:4:4. BRAW agrega la recuperación de altas luces, con resultados variables.
- Experiencias de campo, cada una de un solo usuario: VividDistrict895 (A7SIII, misma familia de sensor, con Ninja V, bajo el agua) dice que es mucho mejor para un balance de blancos que cambia con la profundidad, con archivos enormes. Different-Vegetable6 (FX6 en ProRes RAW) podía empujar la exposición, pero el color se le rompía fácil y lo tapó con reducción de ruido.

### H5. Firmware custom en la FX3: entusiasmo general, cero resultados de imagen y un caso de daño (E8)

- r/SonyAlpha `1xgysff`, "Will we see more hacked firmware in the future?" (2026-10-27, 41 pts, 67 com). Superiority-Qomplex (41 pts) dice que "estamos en la infancia" de esto y cita un video de Tony Northrup hackeando su cámara. Varios usuarios dicen que el firmware se está modificando con ayuda de LLMs: B0yW0nd3r dice haber hecho su hack "usando Claude", y también lo mencionan lemonspread_ y darthnut. Lo que la gente pide es open gate, más bitrate, desactivar la reducción de ruido ("un Magic Lantern para Sony", Exyide), pre-captura, LUTs en modo foto y H.265 en 30p. Todo es para cuerpos Alpha. Ningún comentario de los que leímos reporta una mejora de imagen lograda en una FX3. Normal_Red_Sky (8 pts) cree que lo más probable es que Sony exija firmware firmado.
- r/FX3 `1ufeb0a` (2026-06-25): una FX3 modificada para desbloquear idiomas perdió la entrada analógica de 3,5 mm después de una actualización. Sony Francia atribuyó la falla a la modificación no oficial y cotizó €745 por cambiar un módulo. En los comentarios recuerdan que el firmware custom rompe la garantía.
- OpenMemories y PMCA: no apareció ningún título que los relacione con la FX3 en la búsqueda global. **No encontramos evidencia suficiente** para decir si funcionan o no en la FX3. La búsqueda tampoco devolvió hilos de PMCA en otros cuerpos, así que la ausencia es débil.

### H6. Legria FS19 y Magic Lantern o CHDK: sin evidencia (E9)

Dos búsquedas (global, y dentro de r/MagicLantern con "camcorder") no devolvieron ningún hilo sobre firmware alternativo para camcorders Canon. Las comunidades de camcorders que aparecieron hablaban de comprar CCD con Nightshot o de 24p en una Canon XH A1s. No vimos en Reddit a nadie que haya hackeado una Legria. Por conocimiento general, y no verificado en esta pasada, Magic Lantern se hizo para las EOS DSLR y CHDK para las PowerShot, no para camcorders.

### H7. IA sobre footage de camcorder: limpieza sí, "4K real" no (E10)

- r/TopazLabs `1uzxgtq`, "Making camcorder footage from 2010s look less blobby and soft" (2026-07-18), con un cruce a r/davinciresolve `1uyka76`. Primary_Forever_4429 dice que Starlight Precise 2.5 es "revolucionario" con fuentes muy malas, pero necesita un PC potente o créditos en la nube caros. Por encima de cierto umbral de calidad puede **empeorar** la imagen. "Ningún modelo de Topaz va a hacer que esto parezca 4K real". Cada modelo tiene su "look", que es cuestión de gusto más que una mejora objetiva, e Iris y Proteus reducen los halos en los bordes. El autor del post cuenta que la reducción de ruido temporal de Resolve Studio le ayudó y que el upscaling de Resolve (SuperScale) "no tanto".
- r/TopazLabs `1xic9wm`, "I've tried over 12 video upscaling methods" (2026-10-29, 45 pts). El autor trabajaba con clips de IA, no de camcorder, pero los comentarios traen consejo para video real:
  - ssherun: para no "inventar caras", Starlight Mini o una pasada ligera de Proteus o Iris es "el carril más seguro para footage real".
  - greekhop: con video real usa Starlight Precise 2.5 y después estabilización, motion deblur y denoise para bajar el shimmer.
  - AI_TimeMachine: Precise 2.6 solo con sharpness entre 1 y 2, y sobre video ya limpio.
  - Costos y bugs: Starlight Mini local exige la suscripción de Topaz Video (unos USD 59 al mes) y tiene un bug de línea horizontal, y los modelos locales gratuitos (SeedVR2, FlashVSR+) hacen smear en movimiento.
- Sobre el **look lo-fi de camcorder** como elección estética (no restaurar sino abrazar el SD) no llegamos a leer hilos (ver límites).

---

## Lo que se repite

- "Es un LUT": lo dicen de Chromagraph (r/cinematography y r/nofusion) y del transform de *Knives Out* (r/cinematography 2023). En los dos casos los defensores contestan que el mérito está en cómo se construyó ese LUT, no en el formato.
- Primero la gestión de color y después los ajustes a mano. Aparece en r/colorists (`1sa9uvi`) y, por otro camino, en el debate sobre Yedlin (`10knvkf`).
- Hacer tu propia prueba en vez de fiarte de YouTube: gargoyle37 y joema2 en `1qbks94`, y el autor del post se queja de los reviewers "que graban a su gato".
- Con la IA, menos es más en fuentes que no están destrozadas. Lo dicen tres o cuatro usuarios en dos hilos de r/TopazLabs.

## Dónde discrepan

- **Yedlin: genio o jerga.** Hay una división clara en `10knvkf`. El comentario más votado (C47man, 159) lo baja a "un LUT como hacen todos", y las respuestas con más contenido técnico (kwmcmillan 21, IM_A_BLOWFISH_YO 18) defienden que el punto es tomar control del transform de display. No es un promedio: son dos lecturas incompatibles del mismo material.
- **Chromagraph vale o no.** En r/nofusion y en r/cinematography conviven "damn it's good" (Fresh-Journalist3102) y "es genial para lo que es" (CaptainFalcon206) con "underwhelmed" (ktkrup) y "quiero mi plata de vuelta" (TCivan). El factor que decide parece ser si te gusta ese look en particular: "solo si te gusta la salsa de Yedlin" (noxnoctus).
- **Cuánto vale el RAW.** ejacson y zeb__g dicen "es mejor, punto", gargoyle37 y joema2 dicen "más cerca de lo que crees", y Pyatnitsky discute la aritmética de bits ("64 veces más colores") con gargoyle37, que le responde que en RAW es un valor por fotosito y no tres.

## Minoría interesante

- **Tech Scout** como alternativa profesional a Chromagraph: permite fotografiar a través del LUT de monitoreo de tu propia cámara. Lo mencionan dos usuarios (ktkrup, que dice estar en la beta, y chrisbsky). Puede servir para scouting con el look de la FX3.
- **Crepuscule**, un proyecto open source que según un usuario (max_retik) se parece a Chromagraph. Un solo testimonio, sin verificar.
- Los hacks de firmware hechos con LLMs (r/SonyAlpha): es una tendencia de las últimas semanas según tres usuarios, sin resultados verificables para la FX3.

## Mapa de comunidades

| Comunidad | Tipo | Qué aportó | Sesgo observado |
|---|---|---|---|
| r/cinematography | núcleo, experta | Chromagraph de primera mano, el debate Yedlin | escepticismo marcado hacia el discurso de Yedlin; también fans |
| r/colorists | experta | cómo empatar con Alexa, RAW en FX3 | pragmática, profesional; poca paciencia con el hype |
| r/nofusion | adyacente (apps de foto para iPhone) | primeras impresiones de Chromagraph, precio, comparación con otras apps | usuarios de apps móviles, compran varias apps |
| r/iPhoneography, r/ProjectIndigoiOS | adyacentes | muestras de Chromagraph (solo títulos) | entusiastas de foto móvil |
| r/SonyAlpha | núcleo (firmware) | ola de hacks 2026 | consumidores Alpha, entusiasmo, poca evidencia técnica |
| r/FX3 | núcleo | caso de daño por modificación | dueños; poco volumen sobre hacks |
| r/TopazLabs | núcleo (IA) | límites reales del upscaling | usuarios del producto, muchos con material generado por IA |
| r/camcorders, r/MagicLantern | núcleo para la Legria | nada útil sobre firmware | - |
| r/sideload | inesperada | piden el IPA pirata de Chromagraph | piratería; solo contexto |

## Hilos representativos

- r/cinematography, "Steve Yedlin's Chromagraph Camera App", 2026-11-06. Las reseñas de primera mano más equilibradas. https://www.reddit.com/r/cinematography/comments/1xp7ltl/
- r/nofusion, "Saw this app (Chromagraph) get a lot of traction on twitter, does anyone have its recipe?", 2026-10-29. Se discute si se puede replicar con un LUT. https://www.reddit.com/r/nofusion/comments/1xipf52/
- r/cinematography, "Steve Yedlin's comparison of display prep transformations with Knives Out", 2023-01-25 (histórico). El núcleo del debate sobre el mito de la color science. https://www.reddit.com/r/cinematography/comments/10knvkf/
- r/colorists, "Matching FX6 to Alexa Mini", 2026-04-02. Recetas concretas para S-Log3 → LogC3. https://www.reddit.com/r/colorists/comments/1sa9uvi/
- r/colorists, "Experience with 12-bit (B)RAW shot on FX3?", 2026-01-13. Si vale la pena un Ninja o un Video Assist. https://www.reddit.com/r/colorists/comments/1qbks94/
- r/SonyAlpha, "Will we see more hacked firmware in the future?", 2026-10-27. El estado de los hacks de Sony. https://www.reddit.com/r/SonyAlpha/comments/1xgysff/
- r/FX3, "Sony FX3 audio input failure after language unlock firmware modification – Sony quoted €745", 2026-06-25. El riesgo concreto de modificar la FX3. https://www.reddit.com/r/FX3/comments/1ufeb0a/
- r/TopazLabs, "Making camcorder footage from 2010s look less blobby and soft", 2026-07-18. Es el caso más parecido al de tu Legria. https://www.reddit.com/r/TopazLabs/comments/1uzxgtq/
- r/TopazLabs, "I've tried over 12 video upscaling methods", 2026-10-29. Comparativa de modelos de upscaling. https://www.reddit.com/r/TopazLabs/comments/1xic9wm/

## Confianza y límites

- **Herramientas:** sin Arctic Shift ni Composio. No se pudo buscar dentro del cuerpo de los comentarios ni leer el histórico profundo, y los árboles de comentarios vinieron parciales: LurkAPI devuelve las mejores ramas y deja más comentarios detrás de un cursor que no seguimos. En `10knvkf` leímos unas 10 de 103 ramas, y en `1qbks94` 8 de 12.
- **Presupuesto:** 19 llamadas, y los créditos de LurkAPI se agotaron. Dos búsquedas globales fallaron por ruido: con orden por comentarios y sin ventana de tiempo devolvían los megahilos de todo Reddit, 0 de 7 útiles. Están anotadas como FALLIDAS, no como "sin resultados".
- **Fuerte:** que la app es Chromagraph, sus críticas, y que empatar S-Log3 con Alexa es rutinario. Las tres cosas tienen varios testimonios en más de una comunidad.
- **Medio:** la lectura de Chromagraph como "LUT más grano" (son inferencias de usuarios, nadie lo verificó), el valor relativo del RAW (pocos testimonios, aunque sólidos) y los límites de Topaz (una comunidad, la del propio producto).
- **Débil o sin datos:**
  - OpenMemories o PMCA en la FX3, y cualquier hack de Magic Lantern o CHDK para la Legria FS19: no encontramos evidencia, y eso no prueba que no exista.
  - LUTs de Leeming, LUTs de Cullen Kelly, Dehancer y FilmConvert más allá de una mención: no leímos hilos dedicados.
  - El look lo-fi de camcorder como estética: no leímos hilos.
  - Comunidades en español, r/videography, r/filmmakers, r/editors, r/davinciresolve y r/VideoEditing: no llegamos a explorarlas.
- **Sesgos:** r/cinematography premia el escepticismo hacia las figuras mediáticas, y r/TopazLabs está lleno de gente que trabaja con material generado por IA, no con cintas ni camcorders.
- Un hilo de r/sideload pide una versión pirata de la app. Es contenido de terceros, no se siguió.
- **Para completar** con otra sesión que tenga Arctic Shift o créditos: buscar en el cuerpo de los comentarios "Leeming", "Cullen Kelly", "Dehancer", "CineMatch" y "FX3" en r/cinematography, r/colorists y r/videography; hilos de "camcorder aesthetic" en r/camcorders y r/VideoEditing; el hilo `1xipw08` (Chromagraph frente a Project Indigo); y el hilo `1vl6ssc` (FX3 de Hong Kong, firmware y bloqueo de región).
