# Rediseño disruptivo + optimización — erickmahecha.com

- **Fecha:** 2026-09-26
- **Estado:** diseño aprobado por secciones (1–3) en conversación; pendiente de revisión de este documento.
- **Dirección creativa elegida:** A — «Blueprint → Live System».
- **Línea base:** `docs/perf-baseline.md` (rama `perf/quick-wins`).

---

## 1. Objetivo y alcance

Rediseñar todo el sitio (Home, About, Work + casos, Blog + posts, Gallery) para que sea visualmente disruptivo, con motion en cada sección y microinteracciones memorables, **y** que quede más rápido que la línea base.

**Intocables**
- Paleta, tipografías y logo del Manual de Marca (Obsidiana `#0B0B0F`, Titanio `#F4F5F7`, Cobalto `#2D5BFF`, Grafito `#6E7681`, Plata `#C7CCD1`; Space Grotesk / Inter / JetBrains Mono; monograma EM).
- Todo el copy existente. Solo se añaden **índices numéricos** (aprobados). Las etiquetas con texto quedan pendientes (§12).
- `.env.local`, secretos, chatbot (`FaqChatbot` + `/api/chatbot`), autenticación (`/api/authenticate`, `/api/check-auth`, `middleware.ts`) y los headers de seguridad/CSP (deben quedar idénticos).
- Archivos de marca en la raíz (PDF, PNG de logo): no se suben ni se mueven.
- IntroLoader: exento de `prefers-reduced-motion` por decisión de marca. Solo se admiten los dos cambios de §8.

**Reglas del manual que guían el diseño**
- Regla 60-30-10: el Cobalto solo en CTAs, métricas, el nodo y acentos. Todo el Cobalto del motion cuenta dentro del 10%.
- Sin gradientes decorativos. El **Glow Border** es el único efecto de luz permitido.
- Los patrones no superan el 8% de opacidad tras texto legible y nunca se combinan entre sí.
- La geometría del movimiento sigue la del monograma: 0°, 45° y 90°.

## 2. Ramas, entrega y aprobaciones

| Rama | Base | Contenido |
|---|---|---|
| `perf/quick-wins` | `main` (`ae7350e`) | Commit Biome (§4) + Fase A (§5) + `docs/perf-baseline.md` |
| `feat/disruptive-redesign` | `perf/quick-wins` | Este spec, el plan, las Fases B–D |

- Se trabaja en worktrees bajo `.claude/worktrees/`, excluidos localmente vía `.git/info/exclude`. Nunca se hace commit en `main`.
- Commits pequeños y atómicos con prefijos convencionales (`style:`, `perf:`, `feat:`, `fix:`, `docs:`, `test:`).
- `feat/disruptive-redesign` se rebasa sobre `perf/quick-wins` a medida que esta avanza.
- Cada push genera un Preview de Vercel. **Cada merge a `main` (de cualquiera de las dos ramas) requiere aprobación explícita de Erick.**
- Gates antes de cada push: `npm run build`, `npx tsc --noEmit` y `npx @biomejs/biome check src` sin errores.

## 3. Presupuesto de performance (obligatorio)

| Métrica (Lighthouse móvil, mediana de 3) | Objetivo | Línea base (peor página) |
|---|---|---|
| Performance | ≥ 95 en las 5 páginas | 67 (Work) |
| Accessibility | ≥ 95 en las 5 páginas | 86 (Blog post) |
| LCP | < 2.0 s | 4.13 s (Blog post) |
| CLS | < 0.05 | 0.497 (Work) |
| INP (lab: web-vitals + CPU 4x) / TBT | < 200 ms | TBT 88 ms |
| First Load JS por ruta (`next build`) | ≤ línea base (+10 KB gzip máx. si se justifica) | 275–312 kB |

Si un efecto rompe el presupuesto, **no se implementa**: se revierte y se documenta en §11.

## 4. Commit previo a la Fase A: limpieza Biome (rama `perf/quick-wins`)

- Hoy `npx @biomejs/biome check src` reporta 93 errores preexistentes (formato, orden de imports y varias reglas de lint).
- **Un commit separado** `style: apply biome safe fixes`:
  - Solo los arreglos seguros (`format` + `organizeImports`) y los fixes marcados como *safe* por Biome.
  - Un `biome-ignore lint/security/noDangerouslySetInnerHtml` justificado en el script `theme-init` de `layout.tsx`, que debe seguir inline para evitar el flash de tema.
  - Los errores de lint que requieran un cambio manual (p. ej. `noExplicitAny`, `useJsxKeyInIterable`) se corrigen solo si el cambio es trivial y no altera el comportamiento. Si no, se configuran explícitamente en `biome.json` con justificación.
- **Finales de línea:** el índice guarda LF y la máquina tiene `core.autocrlf=true`. Se respeta el formato de línea del índice.
  - Antes de commitear: `git diff --stat` y `git diff --ignore-cr-at-eol --stat` deben coincidir. Ningún archivo puede aparecer reescrito completo solo por finales de línea.
  - **Si el diff sale inflado, se detiene y se avisa.**
- Tras el commit, `npm run build` y `npx tsc --noEmit` deben seguir pasando.

## 5. Fase A — Quick wins (rama `perf/quick-wins`)

Cada punto es un commit independiente, con medición intermedia para atribuir la ganancia.

### A1. RouteGuard síncrono
- **Problema:** `RouteGuard` renderiza un spinner en SSR y muestra el contenido tras hidratar (`useEffect` → `setLoading(false)`). El contenido no está en el HTML del servidor, lo que provoca LCP 3.4–4.1 s y un salto del `<footer>` de 0.214 en todas las páginas.
- **Cambio:** `isRouteEnabled(pathname)` se calcula durante el render (función pura sobre `pathname` + `routes`). Se eliminan el estado y el spinner. `middleware.ts` no se toca.
- **Verificación adicional:**
  - **Rutas protegidas del lado del servidor.** Hoy `protectedRoutes` está vacío, así que en local, **sin commitear**, se activa una ruta de prueba (p. ej. `/work`) con `PAGE_ACCESS_PASSWORD` definida en la shell (no en `.env.local`).
  - Sin cookie, `curl` a esa ruta y a una subruta debe devolver la reescritura a `/unauthorized`, `Cache-Control: no-store` y **ningún** contenido protegido en el HTML ni en el payload RSC (grep de un título de proyecto).
  - Con cookie válida (vía `/api/authenticate`), el contenido se sirve.
- **Rutas desactivadas:**
  - En local se desactiva temporalmente una ruta (p. ej. `/gallery`) y se verifica que se renderiza la UI de NotFound, ahora **ya en el HTML del servidor**.
  - Según el código actual es un *soft 404* (HTTP 200 con la UI de NotFound), porque no hay chequeo en servidor. Se medirá el status real antes y después: el cambio no debe empeorarlo.
  - Convertirlo en HTTP 404 real es una mejora opcional pendiente de decisión (§12).

### A2. `images.formats`
- `next.config.mjs`: `images.formats: ['image/avif', 'image/webp']`. El resto de la config (CSP, headers, `remotePatterns`) queda igual.

### A3. Masters de imagen
- Script `scripts/optimize-images.mjs` (sharp, ya disponible vía Next): PNG/JPG de `public/images/**` → **WebP q90**, con un máximo de 2400px en el lado largo (sin ampliar). Se usa q90 para evitar doble pérdida, porque `next/image` recomprime a AVIF/WebP.
- Se reemplazan los archivos originales por los `.webp` y se actualizan **todas** las referencias: MDX (frontmatter `images`, `image`, `team.avatar` y cuerpo), `content.tsx` (incluidos `person.avatar`, `gallery.images` y `home.image`), metadata/OG (`/api/og/generate` y sus assets), `FaqChatbot`, `GalleryView` y RSS (`/api/rss`).
- `social-preview.jpg` y cualquier imagen consumida por terceros (OG, RSS) se mantiene en JPG optimizado si WebP no es aceptable para ese consumidor. Se decide por archivo y se documenta.
- Auditoría: toda imagen de contenido se sirve con `next/image` (directo o vía `Media` / `Avatar` de Once UI), con `sizes` acorde al layout y `priority` **solo** en el elemento LCP de cada página.
- **Verificación:**
  - `rg` sin coincidencias de los nombres viejos (lista generada por el script).
  - Crawl local de todas las rutas (incluidos todos los `/work/[slug]` y `/blog/[slug]`) sin ninguna imagen 404.
  - Peso de `public/` antes y después.

### A4. Videos
- ffmpeg: H.264 MP4 (`-movflags +faststart`, CRF ajustado por video, máx. 1080p) + WebM VP9 como `<source>` alternativo. Se genera un poster (WebP) para cada uno.
- **Audio:** se elimina la pista **solo** en los videos que la UI reproduce en mute sin controles (p. ej. `videohome.mp4`). Si un video tiene controles o narración, se conserva el audio. Se revisa cada uso, **en particular `leadbot.mp4`**, con `ffprobe` y leyendo el MDX que lo embebe.
- Componente `LazyVideo` (reemplaza `AutoplayVideo`):
  - `preload="none"` + `poster`; reproduce al entrar en viewport (IO, 25% visible) y pausa al salir.
  - Con `prefers-reduced-motion` o `data-fx="lite"` **no hay autoplay**: se muestran el poster y un botón de play.
- **Objetivos:** `videohome` ≤ 1.2 MB y **0 bytes en la carga inicial de Home**; `video-01` ≤ 4 MB; `leadbot` ≤ 1.2 MB.

### A5. Fachada de YouTube (Gallery y `YouTubeEmbed` de MDX)
- Botón real (`<button>`) con miniatura (`i.ytimg.com`, ya permitido por el CSP) y un icono de play.
- Al hacer clic se monta un iframe `https://www.youtube-nocookie.com/embed/<id>?autoplay=1&playsinline=1` con `allow="autoplay; encrypted-media; picture-in-picture"` y el foco se mueve al iframe en `onLoad`.
- Se elimina el montaje automático por proximidad (`rootMargin: 200px`).
- **iOS Safari:** si requiere un segundo toque, se aplica `mute=1` **solo en iOS**. **El CSP no se toca.** Esta verificación la hace Erick en el Preview.
- Objetivo: Gallery sin JS de YouTube en la carga (baseline ~950 KB).

### A6. Teaser del chatbot sin layout shift
- El globo «Curious about my work?» entra con `transform` + `opacity` sobre un contenedor de posición fija con tamaño reservado. Hoy provoca un CLS de 0.037 en todas las páginas.
- La lógica del chatbot y sus llamadas a la API no cambian.

### A7. Accesibilidad
- Nombre accesible en los `ToggleButton` de navegación (falla `link-name` en todas las páginas), en el botón «Copy» de los bloques de código (`aria-prohibited-attr`) y en el botón sin nombre de `ShareSection` (`button-name`).
- Objetivo: A11y ≥ 95 en las 5 páginas.

### A8. Fuentes
- `--font-label` pasa a apuntar a la instancia de Inter de `--font-body` (hoy son dos instancias).
- **IntroLoader:** reutiliza la instancia de `--font-heading` en lugar de su propio `Space_Grotesk({ weight: "700" })`. Condiciones:
  1. Confirmar que esa instancia es **variable** (Space Grotesk en Google Fonts: eje `wght` 300–700, cargada sin `weight` fijo) o que incluye el 700.
  2. Confirmar que la fuente está **precargada** (`<link rel="preload">` que genera `next/font` en el HTML de Home) y disponible cuando el intro renderiza.
  3. Capturas del intro antes y después en los mismos instantes (t = 0.5 s, 2.5 s y 3.5 s): deben verse idénticas.
- El resto del IntroLoader no se toca en este paso.

## 6. Sistema base de motion (Fase B, rama `feat/disruptive-redesign`)

Todo vive en `src/components/motion/`. **No se usa framer-motion.** `RevealFx` de Once UI se descarta y se reemplaza en sus 20 usos por tres razones:
- Se dispara por temporizador tras hidratar, no por viewport.
- Anima `mask-position` + `filter: blur(1rem)` durante 2 s, fuera de la regla de transform/opacity.
- Mantiene el hero enmascarado y borroso hasta que carga el JS, lo que perjudica el LCP.

### 6.1 Tokens (`motion.css`)
- Duraciones: `--dur-xs: 150ms`, `--dur-s: 300ms`, `--dur-m: 500ms`, `--dur-l: 700ms`.
- Easings: `--ease-precise: cubic-bezier(.2, 0, 0, 1)` y `--ease-out: cubic-bezier(.16, 1, .3, 1)`.
- Distancias: `--shift-s: 8px`, `--shift-m: 16px`.
- Solo se animan `transform` y `opacity`.

### 6.2 Niveles de dispositivo y preferencias
Los fija el script inline de `<head>` (el mismo `theme-init`) antes del primer paint:
- **`data-fx="lite"`** si `navigator.connection?.saveData`, o `deviceMemory ≤ 2` (solo si la propiedad existe: Safari no la expone y ahí se ignora), o `hardwareConcurrency < 4`. En cualquier otro caso, `data-fx="full"`.
  - Lite desactiva: parallax, la imagen flotante de Work (usa la variante de miniatura inline), el autoplay de video y el efecto magnético.
- **Puntero táctil** (`(pointer: coarse)` / `(hover: none)`), eje independiente: desactiva solo el efecto magnético y el brillo del Glow Border que sigue al puntero. El resto de efectos se mantiene.
- **`prefers-reduced-motion: reduce`:** toda animación nueva queda en su estado final, sin desplazamientos, con como mucho fades ≤ 150 ms. La única excepción es el IntroLoader.
- **`html.mo-io`:** se añade si `!CSS.supports('animation-timeline: view()')` (Firefox sin flag). Activa el fallback con IntersectionObserver.

### 6.3 Primitivas

| Pieza | Tipo | Técnica | JS gzip |
|---|---|---|---|
| `Reveal` | Server | `animation-timeline: view()`, `animation-range: entry 0% entry 60%`, `animation-fill-mode: both`; stagger vía `--i` desplazando el rango. **Fallback:** runtime ligero (IO + `MutationObserver` para navegaciones cliente) que añade `.is-in`. El estado oculto solo existe bajo `html.mo-io`, así que sin JS todo es visible. Watchdog: si el runtime no marca `html.mo-ready` en 3 s, se quita `mo-io`. | ~0.6 (solo fallback) |
| `KineticHeading` | Server | División en palabras en el servidor. Texto completo en un `<span class="sr-only">` con los espacios reales; las palabras animadas en spans `aria-hidden="true"`, separadas por espacios reales. **Visible desde el primer frame:** opacidad 1 y sin máscara; solo `translateY(.35em → 0)` con stagger de 40 ms. Keyframes CSS al cargar en el hero; `view()` en el resto. Si el hijo no es un string, se renderiza tal cual, sin animación. | 0 |
| `BlueprintLine` | Server | Línea de 1px, `scaleX`/`scaleY` desde el origen con `view()`. Posición absoluta, sin ocupar espacio en el flujo. | 0 |
| `DecodeText` | Client | El valor real queda fijo en el DOM, visible en SSR y para lectores de pantalla. Un overlay `aria-hidden` hace el scramble encima: durante la animación (~600 ms) el valor real pasa a `opacity: 0` y luego vuelve. Usa `tabular-nums` y el ancho reservado por el propio valor, así que no hay CLS. Sin `aria-live`. Se dispara una vez al entrar en viewport. Con RM, solo el valor final. | ~0.8 |
| `ScrollRail` (+ nodo) | Server | Riel vertical que se dibuja con `scaleY` sobre un `view-timeline` del contenedor. El nodo usa `position: sticky` (sin timeline, funciona igual en Firefox). Barra de lectura: `animation-timeline: scroll(root)` + `scaleX`, y el nodo en la punta con `translateX`. Sin soporte, la barra se oculta (`@supports not`). | 0 |
| `Magnetic` | Client | Solo con `(pointer: fine)` y `data-fx="full"`. Atracción de ≤ 6px con `transform` en rAF, activa solo mientras el puntero está sobre el CTA. | ~0.6 |
| `GlowTrack` | Client | Brillo que recorre el Glow Border de cards y CTAs hacia el puntero: un highlight pre-renderizado que se mueve con `transform`, recortado por una máscara **estática** al anillo de 1px. Solo con `(pointer: fine)`. | ~0.4 |
| `ViewTransitions` | Client | Ver §6.4. | ~1.3 |

**SpotlightBackground se elimina:** su halo radial global contradice el §5.3 (el Glow Border es el único lugar de luz) y mantenía un loop de rAF permanente. La textura de puntos del `body` (20%) se sustituye por **un único Blueprint Grid al ≤ 8%**, porque el manual prohíbe combinar patrones.

### 6.4 View Transitions — listener global (flag experimental descartado)
- **Descartado `experimental.viewTransition`:** en Next 15.5.23 activa `needsExperimentalReact()` y cambia **toda la app** al canal experimental de React (`unstable_ViewTransition`). Es demasiado riesgo en producción para el chatbot, la autenticación y Once UI frente a ~1.3 KB propios. Se podrá migrar reemplazando un solo componente cuando la API sea estable.
- **Clic:** listener global en fase de captura sobre `<a>` internos (cubre `Link`, `Button href` y `SmartLink` de Once UI). Se ignoran modificadores (ctrl/cmd/shift/alt), botón ≠ 0, `target` ≠ `_self`, `download`, orígenes externos y enlaces a la misma ruta.
  - Llama a `preventDefault()` (el `Link` de Next respeta `defaultPrevented`) y después a `document.startViewTransition(() => promise)`, con `router.push(href)` dentro.
  - La promesa se resuelve en un efecto sobre `usePathname()` cuando renderiza la ruta nueva.
  - **Timeout de 500 ms:** resuelve y llama a `transition.skipTransition()`, para no animar la página vieja.
- **Atrás/adelante (popstate):** sin transición, por diseño. Next procesa el popstate en su propio `startTransition`, así que no se puede capturar el estado anterior sin una carrera, y iOS ya anima el gesto de volver.
  - Se verifica que Next conserva la restauración de scroll y que no quedan `view-transition-name` residuales.
- **Anclas:** los `#hash` de la misma ruta usan el scroll nativo, sin transición. Un enlace a otra ruta con hash hace la transición y luego el scroll al ancla. `ScrollToHash` se mantiene.
- **Scroll:** Next hace scroll al tope en el commit (layout effect), antes de que el efecto resuelva la promesa, así que el snapshot nuevo ya está arriba.
- **Nombres únicos:**
  - En el clic, **solo el elemento clicado** recibe `view-transition-name: project-<slug>` inline, y se borra en `transition.finished`.
  - El hero del caso de estudio es el único elemento con ese nombre en su página.
  - El header lleva `view-transition-name: site-header`, para que quede estático.
  - Una verificación automática falla si hay nombres duplicados en el DOM.
- **Animación de página:** crossfade + `translateY(8px)` en ~350 ms (`--ease-precise`). Durante la transición (`html.vt-active`), una línea Cobalto de 1px barre el borde del header con `scaleX`.
- **RM:** `::view-transition-*` con `animation: none`, así que el cambio es instantáneo.
- **Sin soporte:** navegación normal.

### 6.5 Regla de LCP
- El elemento LCP de cada página se pinta **visible desde el primer frame** (opacidad 1, sin máscara ni clip) y nunca depende de JS para verse. Su animación, si la tiene, es solo `transform` sobre texto ya visible, en CSS puro, ≤ 600 ms.
- **Medición obligatoria:** LCP del hero de Home con y sin `KineticHeading` (mediana de 3, móvil). Si hay diferencia medible (> 50 ms), se usa la versión estática.

## 7. Diseño por página (Fase C)

Hilo conductor: **«El Nodo de crecimiento»**. El nodo Cobalto del monograma conecta el sitio con líneas a 0° y 90°, como un plano que se cablea mientras se recorre. La numeración (`01 / 05`, filas y h2) se genera siempre desde los datos, nunca se escribe a mano.

### 7.1 Home ★ «El sistema se cablea»
- **Hero** (columna editorial asimétrica):
  - Marco blueprint con líneas de 1px trazadas desde las esquinas y marcas de corte a 90°.
  - Headline con `KineticHeading`, `subline` estático y stats con `DecodeText`.
- **Secuencia con el IntroLoader:** con `html.intro-pending` (§8), el trazado del marco, `KineticHeading` y `DecodeText` quedan en pausa (`animation-play-state: paused` / sin disparar) y arrancan cuando se quita la clase. El texto sigue visible y pintado desde el primer frame. Sin intro, arrancan en el primer paint.
- **Riel + ramas:**
  - **≥ 1024px:** riel vertical en el margen izquierdo, **fuera** de la columna `max-width`, con el nodo sticky.
  - En cada sección (video, proyecto destacado, blog, CTA) una rama sale del riel a 90° y se traza hasta la sección (`scaleX` con `view()`). La sección hace su `Reveal` al conectarse.
  - **< 1024px:** riel y nodo con `display: none`. Cada sección tiene una `BlueprintLine` horizontal de ancho completo que se traza al entrar, junto a su índice `0N / 05`.
  - Las líneas son `position: absolute` con altura 0 en el flujo, así que no restan ancho útil. Se verifica comparando el ancho de la columna de contenido antes y después.
- **Video:** `LazyVideo` dentro de un marco que se acopla (`scale .92 → 1` con `view()`) mientras las marcas de corte se retraen.
- **Proyecto destacado:** ficha técnica con la imagen con profundidad (parallax ±12px, `translateY` con `view()`). Es el origen del morph `project-<slug>`.
- **Blog y CTA:** `Reveal` + Glow Border con `GlowTrack`. CTA primario con `Magnetic`.

| Efecto | Técnica | KB | Lite | RM | Firefox |
|---|---|---|---|---|---|
| Riel + ramas | `view()` + `scaleX/Y`, nodo sticky | 0 | Igual | Riel y ramas ya dibujados; el nodo sticky sigue el scroll (no es animación) | Ramas vía IO; nodo sticky igual |
| Hero | Keyframes CSS | 0 | Igual | Estado final | Igual |
| Stats | `DecodeText` | 0.8 | Solo el valor final | Solo el valor final | Igual |
| Video acoplado | `view()` + `scale` | 0 | Sin autoplay | Estático, sin autoplay | Vía IO |
| Parallax | `view()` + `translateY` | 0 | Desactivado | Desactivado | Desactivado |

### 7.2 Work ★ «Índice → Ficha técnica» (desktop) + ★ «La fila que se enciende» (táctil)
- Las `ProjectCard` con carrusel pasan a ser un **índice numerado**: número mono `01–N` (desde el array ordenado), título grande en Space Grotesk, badge de métrica y resumen. **Se conserva todo el texto actual** (título, resumen, métrica, enlaces «Read case study» / «View project»). Cada fila es un `<a>` enfocable con alto fijo y el hueco de la miniatura reservado.
- **Desktop (`pointer: fine` + `data-fx="full"`):**
  - Con `:hover` **o** `:focus-visible` en una fila, las demás bajan el texto al **60%** (contraste calculado ~6.7:1 en oscuro y ~5.0:1 en claro) y su miniatura y badge al 30%.
  - La métrica de la fila activa se descifra.
  - **Una sola** imagen flotante por página (`WorkPreview`) sigue al cursor con lerp (`translate3d` + `rotate` ±3°), en un marco angular con Glow Border.
  - Con `:focus-visible` la imagen se ancla a la fila.
  - Las imágenes de preview son AVIF de 640w y se cargan en idle.
  - **Clic:** la imagen flotante recibe `project-<slug>` y hace morph al hero del caso.
- **Táctil (y lite) — firma por scroll:**
  - Cada fila tiene su `view-timeline`. Al cruzar la banda central (`animation-range: cover 30% cover 70%`, con pico entre 40% y 60%), la miniatura pasa de `scale(.6)`/`opacity 0` a `scale(1)`/`opacity 1` y el número se enciende en Cobalto.
  - Un IO con `rootMargin: -45% 0px -45% 0px` dispara el `DecodeText` de la métrica una vez por fila.
  - Sin animar la altura, así que no hay CLS. La miniatura clicada es el origen del morph.

| Efecto | Técnica | KB | Lite / táctil | RM | Firefox |
|---|---|---|---|---|---|
| Imagen flotante | rAF + lerp, `transform` | 1.2 | Variante de fila por scroll | Miniatura estática visible | Igual que Chrome |
| Fila que se enciende | `view()` + IO de banda central | 0.3 | Activa | Miniatura y métrica finales siempre visibles | IO alterna `.is-active` + transiciones CSS |
| Morph al caso | `ViewTransitions` | (base) | Igual | Instantáneo | VT si la versión lo soporta; si no, navegación normal |

### 7.3 Caso de estudio (`/work/[slug]`)
- El hero recibe el morph y es el único elemento con `project-<slug>`.
- `ResultsStats` usa `DecodeText`; las secciones usan `Reveal`.
- **Sin** numeración automática de h2: varios MDX ya incluyen números u ordinales en sus títulos (`Ad 01 · QMS…`, `Act One · The Booth`).
- 0 KB extra.

### 7.4 About ★ «El timeline se construye»
- El riel de la experiencia se dibuja con el scroll (`scaleY` sobre el `view-timeline` de la lista).
- Cada empresa tiene un nodo hueco que se rellena de Cobalto al cruzar el centro (`animation-range: entry 100% contain 50%`, `fill: both`). Los logros entran escalonados con `Reveal`.
- Avatar en un marco blueprint con marcas de corte que se trazan.
- El TOC fijo pasa a ser un índice mono con el nodo marcando la sección activa (`transform`).
- 0 KB.
- **RM:** todo estático y relleno. **Firefox:** los nodos se rellenan vía IO (`rootMargin: -50% 0px`).

### 7.5 Blog post ★ «Leer compila»
- Línea de 1px bajo el header (en la parte superior del viewport en móvil, donde el header va abajo) que se traza con el progreso de lectura (`scroll(root)` + `scaleX`), con el nodo viajando en la punta.
- **h2 numerados automáticamente** con un contador CSS (`01`, `02`… en JetBrains Mono). Verificado: `my-workspace.mdx` (6 h2) no lleva numeración manual.
- «On this page» muestra **la misma numeración**, derivada del índice de los h2 en el array de `useHeadingLinks`. Una verificación automática compara ambas secuencias. El indicador activo se desliza con `transform`.
- 0 KB.
- **RM:** barra sin nodo animado. **Firefox:** barra y nodo ocultos (decorativos).

### 7.6 Gallery ★ «Contact sheet»
- La masonry hace reveal **columna por columna** con stagger (`Reveal` con `--i` por columna).
- En desktop, al pasar el cursor aparece una cruz de retícula blueprint en la esquina con el `alt` existente en mono.
- **Morph miniatura → visor:** `document.startViewTransition(() => flushSync(() => setOpen(true)))`.
  - La miniatura lleva `view-transition-name: gallery-active` solo en el snapshot anterior; dentro del callback se quita y lo recibe el medio del Dialog.
  - Al cerrar, el proceso inverso. Nunca hay dos elementos con el nombre a la vez.
- **Accesibilidad del Dialog:**
  - Las miniaturas pasan de `div onClick` a `<button>`. Hoy no se pueden abrir con teclado y el foco no tiene a dónde volver.
  - Se conserva el manejo de Once UI `Dialog`: trampa de foco, Esc, `inert` en el resto y retorno del foco al elemento que abrió.
  - La view transition solo envuelve el cambio de estado.
- YouTube con la fachada de A5.
- 0.3 KB.
- **Lite:** igual. **RM:** apertura instantánea. **Firefox:** morph si soporta VT; si no, apertura normal.

### 7.7 Global
- Transición de página y barrido del header (§6.4).
- `Magnetic` en CTAs primarios; `GlowTrack` en cards y CTAs.
- Blueprint Grid ≤ 8% como único patrón de fondo.

### 7.8 Presupuesto de JS
- Base: Reveal 0.6 + Decode 0.8 + Magnetic 0.6 + GlowTrack 0.4 + ViewTransitions 1.3.
- Work: 1.2 + 0.3. Gallery: 0.3.
- **Total ≈ +5.5 KB gzip**, dentro del máximo de +10 KB.
- Restan la eliminación de `SpotlightBackground` y, si el tree-shaking lo saca del bundle, `RevealFx`.

## 8. IntroLoader

- Exento de `prefers-reduced-motion` (sin cambios).
- **Cambio 1 — señal de fin:**
  - El script inline de `<head>` añade `html.intro-pending` cuando `location.pathname === "/"` y `!document.hidden`, la misma decisión que toma el IntroLoader en una carga de documento.
  - El IntroLoader solo añade `document.documentElement.classList.remove("intro-pending")` al pasar a `leaving` (inicio del fade-out) y cuando decide no mostrarse.
  - Respaldo en el script del head: se quita la clase a los 7 s (> `MAX_LIFETIME_MS` = 6.5 s).
  - Duración, fases, animaciones y la exención quedan idénticas.
- **Cambio 2 — fuente:** ver A8.
- **Medición (solo reporte):** Home en build de producción local.
  - Variantes: (a) normal; (b) copia temporal **no commiteada** donde el IntroLoader no renderiza.
  - Se reportan LCP, CLS, TBT e INP de un clic durante el intro (el overlay intercepta clics hasta ~5 s) y después de él.

## 9. Plan de verificación

**Gates automáticos (antes de cada push)**
- `npm run build`, `npx tsc --noEmit` y `npx @biomejs/biome check src` con 0 errores.
- `rg "RevealFx" src` = 0 resultados.
- Ningún `<img>` crudo salvo la miniatura de la fachada de YouTube (justificada).
- Sin referencias a nombres de imagen viejos.

**Performance**
- Lighthouse móvil y desktop ×3 (mediana) en Home, About, Work, `/blog/my-workspace` y Gallery.
  - Baseline y resultado sobre el mismo `next start` local, más el Preview de Vercel y la línea base de producción.
- First Load JS por ruta con `next build`.
- INP de laboratorio con `web-vitals` inyectado vía Playwright + CDP, **CPU 4x** y viewport móvil. Interacciones: navegación, abrir el chatbot, fila de Work (hover/focus/tap), abrir y cerrar el Dialog de Gallery y play de YouTube.
- Traza de Performance con CPU 4x durante el scroll de Home y Work: sin tareas largas > 50 ms atribuibles al motion.
- **Cada momento firma se mide antes y después en su commit.** Si rompe el presupuesto, se revierte y va a §11.
- **Deployment Protection:** si bloquea a Lighthouse en el Preview, **no se desactiva**. Se dan a Erick las instrucciones exactas para generar un token de *Protection Bypass for Automation*: Vercel → Project → Settings → Deployment Protection → Protection Bypass for Automation → Add secret. Se usa como header `x-vercel-protection-bypass: <secret>` (más `x-vercel-set-bypass-cookie: true`) en Lighthouse (`--extra-headers`).

**Navegadores (Playwright)**
- **Chromium:** camino `view()`/`scroll()`.
- **Firefox:** confirmar `CSS.supports('animation-timeline: view()') === false`, `html.mo-io` presente y que, tras el scroll, todos los `[data-reveal]` quedan en su estado final vía IO.
- **WebKit** (motor de Safari 26 de escritorio).
- Sin errores de consola en ninguno.
- Emulación de `reducedMotion: 'reduce'`: sin transformaciones en curso ni estados intermedios; el IntroLoader sigue animando.
- Script que detecta `view-transition-name` duplicados en cada página y tras cada navegación.

**Manual en el Preview (Erick, con checklist):** Safari de macOS y iOS.
- Fachada de YouTube con un solo toque.
- Gesto de volver sin doble animación.
- Timelines de scroll.
- Firma táctil de Work.
- Intro → hero.

**Accesibilidad**
- Lighthouse A11y ≥ 95.
- Snapshot del árbol de accesibilidad: el nombre del h1 de Home es igual al copy original con espacios, y las métricas se leen con su valor real, sin el scramble.
- Recorrido con teclado:
  - Filas de Work (`:focus-visible` activa atenuado, decode e imagen).
  - Dialog de Gallery (trampa de foco, Esc y retorno a la miniatura).
  - Foco en el iframe de YouTube tras el clic.
  - Anclas y «skip» de headings.

**No regresiones**
- Chatbot: enviar un mensaje y recibir respuesta en local.
- `/api/authenticate` y `/api/check-auth`: mismas respuestas que antes.
- Rutas protegidas y desactivadas según A1.
- Diff de headers (`curl -I`) antes y después: CSP y headers de seguridad idénticos.
- Restauración de scroll con atrás/adelante.
- Capturas antes y después por página, en móvil y desktop, tema claro y oscuro.

## 10. Entregables
1. URL del Preview de Vercel de cada rama.
2. `docs/perf-report.md`: tabla antes/después por página (Lighthouse, LCP, CLS, INP/TBT, KB de JS y peso de assets), la medición del IntroLoader y la de KineticHeading.
3. Resumen por página: qué animaciones o cambios se hicieron y con qué técnica.
4. Lista de ideas descartadas (§11).

## 11. Ideas descartadas (hasta ahora)
| Idea | Motivo |
|---|---|
| Canvas de Neural Grid reactivo al cursor | Loop continuo en el hilo principal, con riesgo para TBT/INP en móvil |
| Scroll horizontal anclado en Gallery | Accesibilidad y usabilidad en móvil; páginas artificialmente largas |
| Tilt 3D con resorte (Motion) | +18 KB diferidos; el tilt 2D con CSS cubre la idea |
| Cursor personalizado global | Accesibilidad e INP |
| Spotlight radial global (SpotlightBackground) | Contradice el Manual §5.3 (luz solo en el Glow Border) y usaba un loop de rAF permanente |
| `experimental.viewTransition` de Next | Cambia toda la app al canal experimental de React |
| Transición en atrás/adelante | Carrera con el popstate de Next y doble animación con el gesto nativo de iOS |

## 12. Decisiones pendientes
- **Etiquetas con texto** (Erick decide viendo el Preview): Home `01 Overview · 02 Reel · 03 Featured work · 04 Writing · 05 Contact`; Work `Selected work — 09 projects`; About `Experience log`; Gallery `Contact sheet`; Blog `Reading — 01 / 06`. Por defecto: solo números.
- **Rutas desactivadas con HTTP 404 real** (hoy *soft 404* con status 200, según el código). Mejora opcional fuera del alcance actual.

## 13. Riesgos
| Riesgo | Mitigación |
|---|---|
| Diff de Biome inflado por CRLF | Comparar `--stat` con y sin `--ignore-cr-at-eol`; detenerse si difieren |
| Referencias a imágenes renombradas que se escapan (MDX, OG, RSS) | Lista de renombres generada por el script + `rg` + crawl local de 404 |
| El timeout de 500 ms en redes lentas corta el morph | `skipTransition()`; Next precarga los `Link` en viewport en producción |
| Nombres de view transition duplicados | Se asignan solo al elemento clicado + test automático |
| Firefox sin `view()` | Fallback IO probado explícitamente; el estado oculto solo con `html.mo-io` y un watchdog de 3 s |
| Autoplay de YouTube en iOS | `mute=1` solo en iOS; el CSP no se toca |
