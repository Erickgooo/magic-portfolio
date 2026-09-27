# Perf Quick Wins Implementation Plan (Plan 1 de 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar erickmahecha.com por encima del presupuesto de performance/a11y *antes* del rediseño, con una rama publicable por separado (`perf/quick-wins`).

**Architecture:** Cambios quirúrgicos sobre el código existente (Next.js 15 App Router + Once UI): render síncrono en `RouteGuard`, masters de imagen y video optimizados, fachada de YouTube, eliminación de layout shifts y arreglos de a11y. Todo se mide con un arnés reproducible (Playwright + Lighthouse) que se crea en la Task 2 y que reutiliza el Plan 2.

**Tech Stack:** Next.js 15.5.23, React 19, TypeScript, SCSS modules, Once UI 1.4.x, Biome 1.9.4, sharp (vía Next), ffmpeg/ffprobe (scoop), `@playwright/test`, Lighthouse 12.8.2.

**Spec:** `docs/superpowers/specs/2026-09-26-disruptive-redesign-design.md`, §2, §3, §4, §5 y §9.

**Dónde se ejecuta:** worktree `.claude/worktrees/perf-quick-wins` (rama `perf/quick-wins`). Antes de la Task 1, copiar este plan y el spec a esa rama:
```bash
# desde el worktree perf-quick-wins
git checkout feat/disruptive-redesign -- docs/superpowers/specs/2026-09-26-disruptive-redesign-design.md docs/superpowers/plans/2026-09-26-perf-quick-wins.md
git commit -m "docs: add redesign spec and quick-wins plan

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

## Ejecución y puntos de control

- Modo: **subagent-driven**. Un implementador y un revisor por tarea, más una revisión final de la rama.
- **Si una tarea no pasa la revisión dos veces seguidas: detenerse y reportar a Erick** en lugar de seguir intentando.
- **CP1 (fin de este plan):** entregar a Erick el Preview de `perf/quick-wins` y `docs/perf-report.md`, con un resumen corto de la fase (tareas hechas, commits, ideas descartadas). **El Plan 2 no empieza hasta que Erick apruebe el merge.**

## Global Constraints

- Rama `perf/quick-wins`, base `main` @ `ae7350e`. **Nunca commit a `main`. Merge solo con aprobación explícita de Erick.**
- **Biome gate** (antes de cada commit a partir de la Task 2): `npx @biomejs/biome check src --max-diagnostics=0` sin errores **y** `node scripts/quality/biome-gate.mjs HEAD` sin warnings nuevos en los archivos tocados. El script se crea en la Task 2.
- DevDependencies con versión exacta (`npm i -D -E`). Sin `postinstall` ni `playwright install` en `package.json`. El build de Vercel (`next build`) no descarga navegadores ni corre tests.
- Commits atómicos con prefijos `style:`, `chore:`, `perf:`, `fix:`, `test:`, `docs:`. Cada mensaje termina con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Gates antes de cada push: `npm run build`, `npx tsc --noEmit` y `npx @biomejs/biome check src` con 0 errores (a partir de la Task 1).
- No tocar `.env.local`, secretos, `middleware.ts`, `src/utils/auth.ts`, `/api/authenticate`, `/api/check-auth` ni la lógica/llamadas de `/api/chatbot`.
- CSP y headers de seguridad de `next.config.mjs` **idénticos** al final. Solo se añade `images.formats`.
- No reescribir copy. Los `aria-label` nuevos son texto accesible, no copy visible.
- Archivos de marca de la raíz (PDF, PNG de logo) intocables.
- IntroLoader: solo el cambio de fuente de la Task 10. Nada más.
- Finales de línea: el índice guarda LF y `core.autocrlf=true`. Ningún commit puede reescribir archivos completos solo por EOL.
- Presupuesto (Lighthouse móvil, mediana de 3): Perf ≥ 95, A11y ≥ 95, LCP < 2.0 s, CLS < 0.05, TBT/INP < 200 ms; First Load JS ≤ línea base.

## Review Focus

1. **Navegación cliente entre rutas tras quitar el estado de `RouteGuard`:** el paso Home → Work → Home debe renderizar la página correcta sin parpadeo de NotFound. Lo cubre el test `client navigation never flashes NotFound` (Task 3).
2. **Imágenes renombradas referenciadas desde MDX frontmatter (`images:`, `team.avatar`) y desde `content.tsx`:** ninguna página debe mostrar una imagen rota. Lo cubren `image-refs.spec.ts` (unit) y `no-broken-images.spec.ts` (crawl de todas las URLs del sitemap) en la Task 5.
3. **Usuario con `prefers-reduced-motion` o `saveData`:** el video de Home no hace autoplay y ofrece un botón de play accesible. Lo cubre `lazy-video.spec.ts` (Task 6).
4. **Teclado en la fachada de YouTube:** Tab + Enter debe arrancar el video y dejar el foco en el iframe. Lo cubre `youtube-facade.spec.ts` (Task 7).
5. **Globo del chatbot en pantallas estrechas (360px):** no debe desplazar nada ni salirse de la pantalla. Lo cubre `cls.spec.ts` más la aserción de bounding box (Task 8).

---

## File Structure

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `biome.json` | Modify | Config de lint para código existente (Task 1) |
| `src/app/layout.tsx` | Modify | `biome-ignore` justificado en `theme-init` (Task 1) |
| `package.json` / `package-lock.json` | Modify | devDeps `@playwright/test`, `lighthouse`; scripts `test:*`, `perf:*` |
| `playwright.config.ts` | Create | Proyectos unit / chromium / mobile-chromium / firefox / webkit + webServer |
| `scripts/perf/lighthouse.mjs` | Create | Corre Lighthouse N veces por página y form factor → `.perf/<tag>/` |
| `scripts/perf/report.mjs` | Create | Tabla markdown (mediana) de uno o dos tags |
| `tests/e2e/helpers.ts` | Create | Rutas, medición de CLS |
| `tests/e2e/smoke.spec.ts` | Create | Todas las rutas 200, sin errores de consola |
| `src/utils/routeEnabled.ts` | Create | Función pura `isRouteEnabled` |
| `src/components/RouteGuard.tsx` | Modify | Render síncrono |
| `tests/unit/routeEnabled.spec.ts`, `tests/e2e/ssr-content.spec.ts` | Create | Tests A1 |
| `next.config.mjs` | Modify | `images.formats` |
| `tests/e2e/image-formats.spec.ts` | Create | AVIF servido |
| `scripts/media/optimize-images.mjs` | Create | Masters WebP q90 / JPEG optimizado + `image-renames.json` |
| `scripts/media/apply-image-renames.mjs` | Create | Reescribe referencias en `src/` |
| `scripts/media/image-renames.json` | Create (generado) | Mapa viejo → nuevo |
| `tests/unit/image-refs.spec.ts`, `tests/e2e/no-broken-images.spec.ts` | Create | Sin referencias viejas ni 404 |
| `src/components/gallery/GalleryView.tsx` | Modify | Lightbox con `Media`; fachada YouTube (Task 7) |
| `src/components/blog/Post.tsx` | Modify | `priority` opcional (default false) |
| `src/components/FaqChatbot.tsx` | Modify | Quitar `priority` del icono (solo ese atributo) |
| `scripts/media/optimize-videos.mjs` | Create | Recompresión MP4 + WebM + poster, decisión de audio |
| `src/components/home/LazyVideo.tsx` + `.module.scss` | Create | Video diferido con poster y fallback de play |
| `src/components/home/AutoplayVideo.tsx` | Delete | Reemplazado por `LazyVideo` |
| `src/app/page.tsx` | Modify | Usar `LazyVideo` |
| `tests/e2e/lazy-video.spec.ts` | Create | 0 bytes de video en la carga, autoplay en viewport, RM |
| `src/utils/youtube.ts`, `src/utils/platform.ts` | Create | URL de embed, id, miniatura; detección iOS |
| `src/components/YouTubeFacade.tsx` + `.module.scss` | Create | Fachada accesible |
| `src/components/mdx/YouTubeEmbed.tsx` | Modify | Usar la fachada |
| `tests/unit/youtube.spec.ts`, `tests/e2e/youtube-facade.spec.ts` | Create | Tests A5 |
| `src/components/FaqChatbot.module.scss` | Modify | Globo `position: absolute` |
| `src/components/ProjectCard.tsx` | Modify | `aspectRatio` fijo en el carrusel |
| `tests/e2e/cls.spec.ts` | Create | CLS < 0.05 por ruta |
| `src/components/Header.tsx`, `src/components/blog/ShareSection.tsx`, `src/components/HeadingLink.tsx` | Modify | Nombres accesibles |
| `tests/e2e/a11y-names.spec.ts` | Create | Nombres accesibles presentes |
| `src/resources/once-ui.config.ts`, `src/resources/custom.css` | Modify | Una sola instancia de Inter |
| `src/components/IntroLoader.tsx`, `src/components/IntroLoader.module.scss` | Modify | Fuente vía `--font-heading` (solo eso) |
| `tests/e2e/intro-font.spec.ts` (+ snapshots) | Create | Capturas idénticas del intro |
| `docs/perf-baseline.md` | Add | Línea base (ya escrita en el worktree, sin commitear) |
| `docs/perf-report.md` | Create | Antes/después de la Fase A |

---

### Task 1: Limpieza Biome (commit previo a la Fase A)

**Files:**
- Modify: todos los `src/**` que Biome formatee u ordene
- Modify: `biome.json`
- Modify: `src/app/layout.tsx` (comentario `biome-ignore`)

**Interfaces:** ninguna (sin cambios de comportamiento).

- [ ] **Step 1: Confirmar árbol limpio y EOL del índice**

```bash
git status --short            # Expected: solo "?? docs/perf-baseline.md" (o docs/)
git config core.autocrlf      # Expected: true
git ls-files --eol src | awk '{print $1}' | sort | uniq -c
```
Expected: todas las entradas `i/lf`. Si aparece `i/crlf`, anotar esos archivos: se deben commitear con el mismo EOL que ya tienen en el índice.

- [ ] **Step 2: Instalar dependencias y capturar el estado inicial de Biome**

```bash
npm ci --no-audit --no-fund
npx @biomejs/biome check src --max-diagnostics=0 2>&1 | tail -3
```
Expected: `Found 93 errors.`

- [ ] **Step 3: Aplicar formato + orden de imports + fixes *safe* de Biome**

```bash
npx @biomejs/biome check src --write
```
`--write` sin `--unsafe` aplica solo los fixes que Biome clasifica como seguros (preservan semántica): formato, `organizeImports` y reglas con fix *safe* (p. ej. `useImportType`, `useConst`, `useNodejsImportProtocol`).

- [ ] **Step 4: Verificar que el diff no está inflado por EOL (GATE: detenerse si falla)**

```bash
git diff --stat | tail -1
git diff --ignore-cr-at-eol --stat | tail -1
```
Expected: ambas líneas idénticas. **Si difieren, parar y avisar a Erick con ambas salidas. No continuar.**

- [ ] **Step 5: Listar los errores de lint restantes**

```bash
npx @biomejs/biome check src --max-diagnostics=300 2>&1 | grep -oE "lint/[a-zA-Z]+/[a-zA-Z]+" | sort | uniq -c | sort -rn
```

- [ ] **Step 6: Resolver los restantes sin cambiar comportamiento**

`biome.json` completo. Las 5 reglas bajan a **`"warn"`, no se desactivan**. La justificación va en el cuerpo del commit:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": { "enabled": false, "clientKind": "git", "useIgnoreFile": false },
  "files": { "ignoreUnknown": false },
  "formatter": { "enabled": true, "indentStyle": "space", "indentWidth": 2, "lineWidth": 100 },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "useJsxKeyInIterable": "warn",
        "useExhaustiveDependencies": "warn"
      },
      "complexity": { "noUselessFragments": "warn" },
      "suspicious": { "noExplicitAny": "warn", "noArrayIndexKey": "warn" }
    }
  },
  "javascript": { "formatter": { "quoteStyle": "double" } }
}
```

Para las reglas que queden y **sí** tienen un arreglo trivial equivalente, aplicar el cambio a mano:
- `noDoubleEquals`: `==` → `===` entre números (p. ej. `response.status == 200` en `src/app/api/og/generate/route.tsx`).
- `useNumberNamespace`: `parseFloat` → `Number.parseFloat`.
- `useExponentiationOperator`: `Math.pow(a, b)` → `a ** b`.
- `useTemplate`: concatenación → template literal.
- `useSelfClosingElements`: `<X></X>` → `<X />`.
- `useOptionalChain`: `a && a.b` → `a?.b`.
- `noUnusedTemplateLiteral`: `` `x` `` → `"x"`.

Si aparece otra regla cuyo arreglo no es trivial o puede cambiar el comportamiento (`noParameterAssign`, `noAssignInExpressions`, `noImplicitAnyLet`), **parar y consultar a Erick** antes de añadirla como `"warn"`: la lista aprobada son exactamente las 5 de arriba.

- [ ] **Step 7: `biome-ignore` justificado en el theme-init**

En `src/app/layout.tsx`, justo encima de `<script id="theme-init"`:

```tsx
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: the theme must be applied before first paint to avoid a light/dark flash; the script body is a static string built from our own config, with no user input */}
        <script
          id="theme-init"
```

- [ ] **Step 8: Verificar 0 errores, build y tsc**

```bash
npx @biomejs/biome check src --max-diagnostics=0 2>&1 | tail -2
npx tsc --noEmit; echo "tsc exit=$?"
npm run build 2>&1 | tail -30
```
Expected: sin errores (los warnings de las 5 reglas se permiten), `tsc exit=0` y la tabla de rutas. First Load JS **idéntico** a `docs/perf-baseline.md` (311/275/309/312/286 kB).

Tests: el repo **no tiene tests** antes de la Task 2. El arnés de la Task 2 corre el smoke sobre este código ya formateado (Task 2, Step 9), y cualquier fallo ahí se atribuye primero a este commit. Adicionalmente, arrancar `npm run start -- -p 3100` y abrir `/`, `/about`, `/work`, `/blog/my-workspace` y `/gallery` confirmando que cargan sin errores en consola.

- [ ] **Step 9: Repetir el gate de EOL y commitear en dos commits**

```bash
git diff --stat | tail -1; git diff --ignore-cr-at-eol --stat | tail -1   # deben coincidir
git add biome.json
git commit -m "chore: downgrade five biome lint rules to warnings for existing code

Kept as warnings (not disabled) so they stay visible; the gate is 0 errors and
no new warnings in touched files:
- useJsxKeyInIterable: content arrays are data; keys are set by the map() that renders them.
- useExhaustiveDependencies: adding deps changes effect timing, a behaviour change.
- noUselessFragments: fragments wrap JSX copy in content.tsx; unwrapping touches copy.
- noExplicitAny: typing those call sites is a refactor outside this change.
- noArrayIndexKey: lists are static; switching keys is a refactor outside this change.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git add src
git commit -m "style: apply biome safe fixes

Formatting, import sorting and Biome's semantics-preserving (safe) fixes only,
plus a justified biome-ignore on the inline theme-init script.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Arnés de tests y de medición

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/helpers.ts`, `tests/e2e/smoke.spec.ts`, `scripts/perf/lighthouse.mjs`, `scripts/perf/report.mjs`
- Modify: `package.json`, `.gitignore`
- Add: `docs/perf-baseline.md`

**Interfaces:**
- Produces:
  - `ROUTES` (`{ name: "home" | "about" | "work" | "blog" | "gallery"; path: string }[]`) desde `tests/e2e/helpers.ts`.
  - `measureCLS(page: Page, settleMs?: number): Promise<number>` desde `tests/e2e/helpers.ts`.
  - `npm run perf:lh` (env `LH_BASE_URL`, `LH_TAG`, `LH_RUNS`, `CHROME_PATH`, `LH_BYPASS`).
  - `npm run perf:report -- <tag> [compareTag]`.

- [ ] **Step 1: devDependencies (versión exacta) y navegadores (solo local)**

```bash
npm i -D -E @playwright/test@1 lighthouse@12.8.2
node -e "const p=require('./package.json');console.log(p.devDependencies['@playwright/test'],p.devDependencies.lighthouse, p.scripts.postinstall ?? 'no postinstall')"
npx playwright install chromium firefox webkit   # local only, never in package.json scripts
```
Expected: versiones sin `^` ni `~` y `no postinstall`. Los navegadores quedan en la caché de usuario de Playwright, fuera del repo. El build de Vercel sigue siendo `next build` (script `build`), así que no descarga navegadores ni corre tests. `@playwright/test` no descarga navegadores en `npm install`.

- [ ] **Step 1b: `scripts/quality/biome-gate.mjs`**

```js
// Usage: node scripts/quality/biome-gate.mjs [baseRef=HEAD]
// Fails if any added/modified file under src/ has MORE Biome diagnostics than
// its version at baseRef (new files: must have zero). Errors are caught by the
// full `biome check src`; this guards "no new warnings in touched files".
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const base = process.argv[2] ?? "HEAD";
const BIOME = path.join("node_modules", "@biomejs", "biome", "bin", "biome");

const changed = execFileSync("git", ["diff", "--name-only", "--diff-filter=AM", base, "--", "src"], { encoding: "utf8" })
  .concat(execFileSync("git", ["ls-files", "--others", "--exclude-standard", "--", "src"], { encoding: "utf8" }))
  .split(/\r?\n/)
  .filter((f) => /\.(tsx?|jsx?|json)$/.test(f));

function count(content, file) {
  const r = spawnSync(process.execPath, [BIOME, "lint", `--stdin-file-path=${file}`], { input: content, encoding: "utf8" });
  return ((r.stdout ?? "") + (r.stderr ?? "")).match(/lint\/[a-zA-Z]+\/[a-zA-Z]+/g)?.length ?? 0;
}

let failed = false;
for (const file of [...new Set(changed)]) {
  const now = count(readFileSync(file, "utf8"), file);
  let before = 0;
  try {
    before = count(execFileSync("git", ["show", `${base}:${file}`], { encoding: "utf8" }), file);
  } catch {
    before = 0; // new file
  }
  if (now > before) {
    failed = true;
    console.error(`NEW WARNINGS ${file}: ${before} -> ${now}`);
  }
}
if (failed) process.exit(1);
console.log(`biome-gate OK (${changed.length} files checked against ${base})`);
```
Autotest: crear un archivo temporal `src/__gate_probe.ts` con `export const x: any = 1;` y correr `node scripts/quality/biome-gate.mjs HEAD`: debe fallar con `NEW WARNINGS src/__gate_probe.ts`. Luego borrar el archivo y volver a correrlo: `biome-gate OK`.

- [ ] **Step 2: Scripts en `package.json`** (añadir dentro de `"scripts"`)

```json
    "test:unit": "playwright test --project=unit",
    "test:e2e": "playwright test --project=chromium --project=mobile-chromium --project=firefox --project=webkit",
    "perf:lh": "node scripts/perf/lighthouse.mjs",
    "perf:report": "node scripts/perf/report.mjs"
```

- [ ] **Step 3: `.gitignore`** (añadir al final)

```
# test & perf artifacts
/test-results/
/playwright-report/
/.perf/
```

- [ ] **Step 4: `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.E2E_PORT ?? 3100);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;
const e2e = /e2e[\\/].*\.spec\.ts$/;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001 } },
  use: { baseURL: BASE_URL, trace: "retain-on-failure" },
  projects: [
    { name: "unit", testMatch: /unit[\\/].*\.spec\.ts$/ },
    { name: "chromium", testMatch: e2e, use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", testMatch: e2e, use: { ...devices["Pixel 7"] } },
    { name: "firefox", testMatch: e2e, use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", testMatch: e2e, use: { ...devices["Desktop Safari"] } },
  ],
  // Requires `npm run build` first. Reuses a server already listening on PORT.
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${PORT}`,
        url: BASE_URL,
        reuseExistingServer: true,
        timeout: 120_000,
      },
});
```

- [ ] **Step 5: `tests/e2e/helpers.ts`**

```ts
import type { Page } from "@playwright/test";

export const ROUTES = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "work", path: "/work" },
  { name: "blog", path: "/blog/my-workspace" },
  { name: "gallery", path: "/gallery" },
] as const;

/**
 * Sums layout-shift entries (excluding those caused by recent input) from page
 * load until `settleMs` after load, the way the CLS metric counts them.
 * Chromium only: layout-shift entries are not exposed by Firefox/WebKit.
 */
export async function measureCLS(page: Page, settleMs = 3500): Promise<number> {
  await page.waitForLoadState("load");
  return page.evaluate(
    (ms) =>
      new Promise<number>((resolve) => {
        let cls = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as unknown as {
            value: number;
            hadRecentInput: boolean;
          }[]) {
            if (!entry.hadRecentInput) cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
        setTimeout(() => resolve(cls), ms);
      }),
    settleMs,
  );
}
```

- [ ] **Step 6: `tests/e2e/smoke.spec.ts`**

```ts
import { expect, test } from "@playwright/test";
import { ROUTES } from "./helpers";

for (const route of ROUTES) {
  test(`smoke: ${route.name} renders without console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("pageerror", (err) => errors.push(err.message));
    const response = await page.goto(route.path);
    expect(response?.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });
}
```

- [ ] **Step 7: `scripts/perf/lighthouse.mjs`**

```js
// Runs Lighthouse LH_RUNS times per page and form factor and writes the JSON
// reports to .perf/<LH_TAG>/<page>-<formFactor>-<run>.json.
// Lighthouse's Windows temp-dir cleanup can exit non-zero (EPERM) after a
// successful run, so success is judged by the report file existing.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const LH_CLI = path.join(path.dirname(require.resolve("lighthouse/package.json")), "cli", "index.js");

const BASE = process.env.LH_BASE_URL ?? "http://localhost:3100";
const TAG = process.env.LH_TAG ?? "local";
const RUNS = Number(process.env.LH_RUNS ?? 3);
const PAGES = {
  home: "/",
  about: "/about",
  work: "/work",
  blog: "/blog/my-workspace",
  gallery: "/gallery",
};

const outDir = path.join(".perf", TAG);
mkdirSync(outDir, { recursive: true });

let headersFile = null;
if (process.env.LH_BYPASS) {
  headersFile = path.join(outDir, "extra-headers.json");
  writeFileSync(
    headersFile,
    JSON.stringify({
      "x-vercel-protection-bypass": process.env.LH_BYPASS,
      "x-vercel-set-bypass-cookie": "true",
    }),
  );
}

const failures = [];
for (const [name, pagePath] of Object.entries(PAGES)) {
  for (const formFactor of ["mobile", "desktop"]) {
    for (let run = 1; run <= RUNS; run++) {
      const file = path.join(outDir, `${name}-${formFactor}-${run}.json`);
      const args = [
        LH_CLI,
        BASE + pagePath,
        "--output=json",
        `--output-path=${file}`,
        "--only-categories=performance,accessibility,best-practices,seo",
        "--max-wait-for-load=45000",
        "--quiet",
        "--chrome-flags=--headless=new --no-sandbox",
      ];
      if (formFactor === "desktop") args.push("--preset=desktop");
      if (headersFile) args.push(`--extra-headers=${headersFile}`);
      spawnSync(process.execPath, args, { stdio: "inherit", timeout: 240_000 });
      if (!existsSync(file)) failures.push(`${name}-${formFactor}-${run}`);
    }
  }
}
if (failures.length) {
  console.error(`Missing reports: ${failures.join(", ")}`);
  process.exit(1);
}
console.log(`Reports written to ${outDir}`);
```

- [ ] **Step 8: `scripts/perf/report.mjs`**

```js
// Usage: node scripts/perf/report.mjs <tag> [compareTag]
// Prints a markdown table with the median of each metric per page/form factor.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const [tag, compareTag] = process.argv.slice(2);
if (!tag) {
  console.error("usage: report.mjs <tag> [compareTag]");
  process.exit(1);
}

const median = (xs) => {
  const s = xs.filter((x) => x != null).sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : null;
};

function load(t, page, ff) {
  const runs = [];
  for (let i = 1; i <= 5; i++) {
    const f = path.join(".perf", t, `${page}-${ff}-${i}.json`);
    if (!existsSync(f)) continue;
    const j = JSON.parse(readFileSync(f, "utf8"));
    if (!j.runtimeError && j.categories.performance.score != null) runs.push(j);
  }
  return runs;
}

function bytes(j, type) {
  const items = j.audits["network-requests"]?.details?.items ?? [];
  return items
    .filter((r) => !type || r.resourceType === type)
    .reduce((sum, r) => sum + (r.transferSize ?? 0), 0);
}

function metrics(runs) {
  if (!runs.length) return null;
  const m = (fn) => median(runs.map(fn));
  return {
    perf: Math.round(m((j) => j.categories.performance.score * 100)),
    a11y: Math.round(m((j) => j.categories.accessibility.score * 100)),
    lcp: m((j) => j.audits["largest-contentful-paint"].numericValue) / 1000,
    cls: m((j) => j.audits["cumulative-layout-shift"].numericValue),
    tbt: Math.round(m((j) => j.audits["total-blocking-time"].numericValue)),
    js: Math.round(m((j) => bytes(j, "Script")) / 1024),
    total: Math.round(m((j) => bytes(j)) / 1024),
  };
}

const fmt = (x) =>
  x
    ? `${x.perf} / ${x.a11y} / ${x.lcp.toFixed(2)} s / ${x.cls.toFixed(3)} / ${x.tbt} ms / ${x.js} KB / ${x.total} KB`
    : "n/a";

console.log(
  compareTag
    ? `| Página | FF | ${compareTag} (Perf / A11y / LCP / CLS / TBT / JS / Total) | ${tag} |`
    : "| Página | FF | Perf / A11y / LCP / CLS / TBT / JS / Total |",
);
console.log(compareTag ? "|---|---|---|---|" : "|---|---|---|");
for (const page of ["home", "about", "work", "blog", "gallery"]) {
  for (const ff of ["mobile", "desktop"]) {
    const a = metrics(load(tag, page, ff));
    if (compareTag) {
      const b = metrics(load(compareTag, page, ff));
      console.log(`| ${page} | ${ff} | ${fmt(b)} | ${fmt(a)} |`);
    } else {
      console.log(`| ${page} | ${ff} | ${fmt(a)} |`);
    }
  }
}
```

- [ ] **Step 9: Verificar el arnés contra el build actual**

```bash
npm run build
npx playwright test --project=chromium tests/e2e/smoke.spec.ts
```
Expected: 5 passed. Si falla por errores de consola **preexistentes**, anotarlos en `docs/perf-baseline.md` («Known console errors») y excluir exactamente esos mensajes en el test con un comentario. No se oculta ningún error nuevo.

- [ ] **Step 10: Línea base local (el mismo servidor servirá para comparar)**

```bash
export CHROME_PATH="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
npm run start -- -p 3100 &
LH_TAG=base-local npm run perf:lh
npm run perf:report -- base-local
```
Pegar la tabla en `docs/perf-baseline.md` bajo `## Local next start (same machine, for apples-to-apples comparison)`.

- [ ] **Step 11: Commit**

```bash
git add package.json package-lock.json playwright.config.ts .gitignore tests scripts/perf scripts/quality docs/perf-baseline.md
git commit -m "test: add Playwright and Lighthouse measurement harness and biome gate

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: A1 — RouteGuard síncrono

**Files:**
- Create: `src/utils/routeEnabled.ts`, `tests/unit/routeEnabled.spec.ts`, `tests/e2e/ssr-content.spec.ts`
- Modify: `src/components/RouteGuard.tsx`

**Interfaces:**
- Produces: `isRouteEnabled(pathname: string | null, routes: RoutesConfig): boolean`, en `@/utils/routeEnabled`.

- [ ] **Step 1: Test unitario (falla porque el módulo no existe)**

`tests/unit/routeEnabled.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { isRouteEnabled } from "@/utils/routeEnabled";

const routes = { "/": true, "/about": true, "/work": true, "/blog": false, "/gallery": true } as const;

test.describe("isRouteEnabled", () => {
  test("static routes follow the config", () => {
    expect(isRouteEnabled("/", routes)).toBe(true);
    expect(isRouteEnabled("/about", routes)).toBe(true);
    expect(isRouteEnabled("/blog", routes)).toBe(false);
  });
  test("dynamic children inherit /work and /blog", () => {
    expect(isRouteEnabled("/work/leadbot-ai", routes)).toBe(true);
    expect(isRouteEnabled("/blog/my-workspace", routes)).toBe(false);
  });
  test("/unauthorized is always enabled (middleware rewrite target)", () => {
    expect(isRouteEnabled("/unauthorized", routes)).toBe(true);
  });
  test("unknown or missing paths are disabled", () => {
    expect(isRouteEnabled("/nope", routes)).toBe(false);
    expect(isRouteEnabled("/gallery/x", routes)).toBe(false);
    expect(isRouteEnabled("/workshop", routes)).toBe(false);
    expect(isRouteEnabled(null, routes)).toBe(false);
  });
});
```

- [ ] **Step 2: Ejecutarlo y verificar que falla**

Run: `npx playwright test --project=unit tests/unit/routeEnabled.spec.ts`
Expected: FAIL (`Cannot find module '@/utils/routeEnabled'`).

- [ ] **Step 3: Implementar `src/utils/routeEnabled.ts`**

```ts
import type { RoutesConfig } from "@/types";

/** Routes whose children (/work/[slug], /blog/[slug]) inherit the parent's flag. */
const DYNAMIC_PARENTS = ["/blog", "/work"] as const;

/**
 * Whether `pathname` should render, given the `routes` config. Pure, so it can
 * run during render on the server and the client alike (no effect, no flash).
 * Password protection is NOT decided here — middleware.ts enforces it.
 */
export function isRouteEnabled(pathname: string | null, routes: RoutesConfig): boolean {
  if (!pathname) return false;

  // Rendered by the middleware rewrite for protected routes; never in `routes`.
  if (pathname === "/unauthorized") return true;

  if (pathname in routes) {
    return routes[pathname as keyof RoutesConfig];
  }

  for (const parent of DYNAMIC_PARENTS) {
    if (pathname.startsWith(`${parent}/`) && routes[parent]) {
      return true;
    }
  }

  return false;
}
```

Nota: el código viejo usaba `startsWith(route)` sin barra, así que `/workshop` contaba como hijo de `/work`. Ahora es `false`, que es lo correcto, y lo cubre el test `unknown or missing paths`.

- [ ] **Step 4: Test unitario en verde**

Run: `npx playwright test --project=unit tests/unit/routeEnabled.spec.ts`
Expected: 4 passed.

- [ ] **Step 5: Test e2e de contenido en el HTML del servidor (falla hoy)**

`tests/e2e/ssr-content.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

// With JavaScript disabled the page shows exactly the server HTML. Before the
// fix RouteGuard rendered a spinner on the server, so no heading existed.
test.describe("server-rendered content", () => {
  test.use({ javaScriptEnabled: false });

  const cases = [
    { path: "/", text: /I Build Marketing Infrastructure/ },
    { path: "/about", text: /Erick Mahecha/ },
    { path: "/work", text: /Projects/ },
    { path: "/blog/my-workspace", text: /My Workspace/ },
    { path: "/gallery", text: /Visual Work/ },
  ];

  for (const c of cases) {
    test(`${c.path} has its h1 in the server HTML`, async ({ page }) => {
      await page.goto(c.path);
      await expect(page.locator("h1").first()).toHaveText(c.text);
    });
  }
});

test("client navigation never flashes NotFound", async ({ page }) => {
  await page.goto("/");
  const seen: string[] = [];
  await page.exposeFunction("__record", (t: string) => seen.push(t));
  await page.evaluate(() => {
    new MutationObserver(() => {
      if (document.body.innerText.includes("This page hasn't been built yet")) {
        (window as unknown as { __record: (t: string) => void }).__record("404");
      }
    }).observe(document.body, { childList: true, subtree: true });
  });
  await page.locator('header a[href="/work"]').first().click();
  await page.waitForURL("**/work");
  await page.locator('header a[href="/"]').first().click();
  await page.waitForURL((url) => url.pathname === "/");
  expect(seen).toEqual([]);
});
```

Run: `npm run build && npx playwright test --project=chromium tests/e2e/ssr-content.spec.ts`
Expected: FAIL en los 5 casos sin JS (no hay `h1`).

- [ ] **Step 6: Reescribir `src/components/RouteGuard.tsx`**

```tsx
"use client";

import NotFound from "@/app/not-found";
import { routes } from "@/resources";
import { isRouteEnabled } from "@/utils/routeEnabled";
import { usePathname } from "next/navigation";

interface RouteGuardProps {
  children: React.ReactNode;
}

/**
 * Hides routes disabled in the `routes` config.
 *
 * Decided during render (pure function of the pathname), so the page is part
 * of the server HTML — the previous effect-based version rendered a spinner on
 * the server and only swapped the page in after hydration, which delayed LCP
 * and shifted the footer on every route.
 *
 * Password protection is NOT handled here — middleware.ts enforces it on the
 * server before the page is ever rendered.
 */
const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();

  if (!isRouteEnabled(pathname, routes)) {
    return <NotFound />;
  }

  return <>{children}</>;
};

export { RouteGuard };
```

- [ ] **Step 7: Verificar**

```bash
npm run build && npx playwright test --project=chromium --project=firefox --project=webkit tests/e2e/ssr-content.spec.ts tests/e2e/smoke.spec.ts
```
Expected: todo en verde.

- [ ] **Step 8: Verificación de seguridad del lado del servidor (manual, sin commitear)**

1. Editar temporalmente `src/resources/protectedRoutes.ts`: `const protectedRoutes: ProtectedRoutesConfig = { "/work": true };`
2. Build y arranque con la contraseña en la shell (no en `.env.local`):
```bash
npm run build
PAGE_ACCESS_PASSWORD=qa-temp-pass AUTH_SECRET=qa-temp-secret npm run start -- -p 3300 &
```
3. Sin cookie:
```bash
curl -s -D - http://localhost:3300/work -o .perf/work.html | grep -iE "^HTTP|cache-control"
grep -c "LeadBot AI" .perf/work.html                                   # Expected: 0
curl -s http://localhost:3300/work/leadbot-ai | grep -c "LeadBot AI"   # Expected: 0
curl -s -H "RSC: 1" http://localhost:3300/work | grep -c "LeadBot AI"  # Expected: 0
```
Expected: `Cache-Control: no-store` y 0 coincidencias en los tres casos.
4. Con cookie:
```bash
curl -s -c .perf/jar -H "Content-Type: application/json" -d '{"password":"qa-temp-pass"}' http://localhost:3300/api/authenticate -o /dev/null -w "%{http_code}\n"   # Expected: 200
curl -s -b .perf/jar http://localhost:3300/work | grep -c "LeadBot AI"   # Expected: >= 1
```
5. **Ruta desactivada:** editar temporalmente `src/resources/once-ui.config.ts` con `"/gallery": false`, rebuild y arranque, luego:
```bash
curl -s -o .perf/g.html -w "%{http_code}\n" http://localhost:3300/gallery
grep -c "This page hasn't been built yet" .perf/g.html
```
Expected: UI de NotFound **presente en el HTML del servidor** (≥ 1). Anotar el status. Repetir el mismo `curl` sobre `main` (worktree raíz, con el mismo cambio temporal, `npm run build && npm run start -- -p 3301`) y anotar su status: **el de la rama no debe ser peor.** Revertir el cambio temporal en `main` con `git checkout -- src/resources/once-ui.config.ts`.
6. Revertir en la rama: `git checkout -- src/resources/protectedRoutes.ts src/resources/once-ui.config.ts` y verificar que `git status --short` no muestra esos archivos. Detener los servidores.
7. Guardar los resultados en `.perf/security-notes.txt`. Pasan a `docs/perf-report.md` en la Task 11.

- [ ] **Step 9: Commit**

```bash
git add src/utils/routeEnabled.ts src/components/RouteGuard.tsx tests/unit/routeEnabled.spec.ts tests/e2e/ssr-content.spec.ts
git commit -m "perf: render RouteGuard synchronously so pages are in the server HTML

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: A2 — `images.formats`

**Files:**
- Modify: `next.config.mjs` (bloque `images`)
- Create: `tests/e2e/image-formats.spec.ts`

- [ ] **Step 1: Test (falla: hoy sirve WebP)**

```ts
import { expect, test } from "@playwright/test";

test("next/image serves AVIF when the browser accepts it", async ({ request }) => {
  const res = await request.get("/_next/image?url=%2Fimages%2Favatar.jpg&w=256&q=75", {
    headers: { accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
  });
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toBe("image/avif");
});
```
Run: `npm run build && npx playwright test --project=chromium tests/e2e/image-formats.spec.ts`
Expected: FAIL (`image/webp`).

- [ ] **Step 2: Añadir `formats` en `next.config.mjs`**

```js
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.google.com",
        pathname: "**",
      },
    ],
  },
```

- [ ] **Step 3: Verificar y commitear**

```bash
npm run build && npx playwright test --project=chromium tests/e2e/image-formats.spec.ts   # PASS
git add next.config.mjs tests/e2e/image-formats.spec.ts
git commit -m "perf: serve AVIF from next/image

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: A3 — Masters de imagen y auditoría de `next/image`

**Files:**
- Create: `scripts/media/optimize-images.mjs`, `scripts/media/apply-image-renames.mjs`, `scripts/media/image-renames.json` (generado), `tests/unit/image-refs.spec.ts`, `tests/e2e/no-broken-images.spec.ts`
- Modify: `public/images/**` (binarios), referencias en `src/**`, `src/components/gallery/GalleryView.tsx`, `src/components/blog/Post.tsx`, `src/components/FaqChatbot.tsx` (solo el atributo `priority`)

**Interfaces:**
- Produces: `scripts/media/image-renames.json` con la forma `{ "renames": { "/images/a.png": "/images/a.webp" }, "jpeg": ["/images/avatar.jpg"] }`.

**Excepciones JPEG** (consumidas por terceros que pueden no aceptar WebP: crawlers OG, lectores RSS, Satori en `/api/og/generate`):
- `/images/avatar.jpg`: lo usan `/api/og/generate` (Satori), RSS y el schema.
- `/images/blog/PC.jpg`: `image:` del post, que es su imagen OG.
- `/images/og/home.jpg` y `/images/og/social-preview.jpg`.

- [ ] **Step 1: Tests de referencias**

`tests/unit/image-refs.spec.ts`:

```ts
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

const MAP = "scripts/media/image-renames.json";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = path.join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

test("no source file references a renamed image", () => {
  expect(existsSync(MAP)).toBe(true);
  const { renames } = JSON.parse(readFileSync(MAP, "utf8")) as { renames: Record<string, string> };
  const sources = walk("src").filter((f) => /\.(tsx?|mdx?|s?css|json)$/.test(f));
  const offenders: string[] = [];
  for (const file of sources) {
    const text = readFileSync(file, "utf8");
    for (const oldPath of Object.keys(renames)) {
      if (text.includes(oldPath)) offenders.push(`${file}: ${oldPath}`);
    }
  }
  expect(offenders).toEqual([]);
});

test("every /images path referenced in src exists in public", () => {
  const sources = walk("src").filter((f) => /\.(tsx?|mdx?)$/.test(f));
  const missing: string[] = [];
  for (const file of sources) {
    for (const m of readFileSync(file, "utf8").matchAll(/["'(](\/images\/[^"')\s]+)["')]/g)) {
      if (!existsSync(path.join("public", m[1]))) missing.push(`${file}: ${m[1]}`);
    }
  }
  expect(missing).toEqual([]);
});
```

`tests/e2e/no-broken-images.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("no page in the sitemap has a broken image", async ({ page, request, baseURL }) => {
  test.setTimeout(180_000);
  const xml = await (await request.get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  expect(paths.length).toBeGreaterThan(5);

  const failures: string[] = [];
  page.on("response", (res) => {
    if (res.request().resourceType() === "image" && res.status() >= 400) {
      failures.push(`${res.status()} ${res.url()}`);
    }
  });

  for (const p of paths) {
    await page.goto(new URL(p, baseURL).toString());
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
    });
    await page.waitForLoadState("networkidle");
    const broken = await page.$$eval("img", (imgs) =>
      imgs
        .filter((i) => i.complete && i.naturalWidth === 0 && !i.src.startsWith("data:"))
        .map((i) => i.currentSrc || i.src),
    );
    failures.push(...broken.map((b) => `${p}: ${b}`));
  }
  for (const api of ["/api/rss", "/api/og/generate?title=QA"]) {
    const res = await request.get(api);
    if (res.status() !== 200) failures.push(`${res.status()} ${api}`);
  }
  expect(failures).toEqual([]);
});
```

- [ ] **Step 2: Ejecutar: el unitario falla (no hay mapa); el e2e da la línea base**

```bash
npx playwright test --project=unit tests/unit/image-refs.spec.ts        # FAIL (no map)
npm run build && npx playwright test --project=chromium tests/e2e/no-broken-images.spec.ts   # debe pasar hoy; si no, anotar las roturas preexistentes
du -sh public
```

- [ ] **Step 3: `scripts/media/optimize-images.mjs`**

```js
// Converts public/images/**/*.{png,jpg,jpeg} into high-quality masters:
//  - WebP q90 (max 2400px long edge, never upscaled) for everything rendered on-site,
//    so next/image recompresses to AVIF/WebP from a near-lossless source.
//  - Optimized JPEG for images consumed by third parties that may not accept WebP
//    (Open Graph crawlers, RSS readers, the Satori renderer in /api/og/generate).
// Writes scripts/media/image-renames.json and deletes the replaced originals.
import { readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = "public/images";
const MAX = 2400;
const KEEP_JPEG = new Map([
  ["/images/avatar.jpg", { max: 800 }],
  ["/images/blog/PC.jpg", { max: 1600 }],
  ["/images/og/home.jpg", { max: 1200 }],
  ["/images/og/social-preview.jpg", { max: 1200 }],
]);

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const toWeb = (p) => `/${p.split(path.sep).join("/").replace(/^public\//, "")}`;
const renames = {};
const jpeg = [];
let before = 0;
let after = 0;

for (const file of await walk(ROOT)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const webPath = toWeb(file);
  const size = (await stat(file)).size;
  before += size;

  if (KEEP_JPEG.has(webPath)) {
    const { max } = KEEP_JPEG.get(webPath);
    const tmp = `${file}.tmp`;
    await sharp(file)
      .rotate()
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true, progressive: true })
      .toFile(tmp);
    const newSize = (await stat(tmp)).size;
    if (newSize < size) {
      await rename(tmp, file);
      after += newSize;
    } else {
      await rm(tmp);
      after += size;
    }
    jpeg.push(webPath);
    console.log(`jpeg  ${webPath}  ${(size / 1024) | 0}KB -> ${(Math.min(newSize, size) / 1024) | 0}KB`);
    continue;
  }

  const out = file.replace(/\.(png|jpe?g)$/i, ".webp");
  await sharp(file)
    .rotate()
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 90, alphaQuality: 100, effort: 6 })
    .toFile(out);
  const newSize = (await stat(out)).size;
  after += newSize;
  await rm(file);
  renames[webPath] = toWeb(out);
  console.log(`webp  ${webPath}  ${(size / 1024) | 0}KB -> ${(newSize / 1024) | 0}KB`);
}

await writeFile("scripts/media/image-renames.json", `${JSON.stringify({ renames, jpeg }, null, 2)}\n`);
console.log(`\nTotal: ${(before / 1048576).toFixed(1)}MB -> ${(after / 1048576).toFixed(1)}MB`);
```

- [ ] **Step 4: `scripts/media/apply-image-renames.mjs`**

```js
// Rewrites every reference to a renamed image inside src/ (tsx/ts/mdx/md/scss/css/json).
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const { renames } = JSON.parse(await readFile("scripts/media/image-renames.json", "utf8"));
// Longest first so a shorter path never partially rewrites a longer one.
const pairs = Object.entries(renames).sort((a, b) => b[0].length - a[0].length);

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = path.join(dir, name);
    if ((await stat(p)).isDirectory()) out.push(...(await walk(p)));
    else if (/\.(tsx?|mdx?|s?css|json)$/.test(p)) out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of await walk("src")) {
  const original = await readFile(file, "utf8");
  let text = original;
  for (const [from, to] of pairs) text = text.split(from).join(to);
  if (text !== original) {
    await writeFile(file, text);
    changed++;
    console.log(`updated ${file}`);
  }
}
console.log(`${changed} files updated`);
```

- [ ] **Step 5: Ejecutar ambos scripts**

```bash
node scripts/media/optimize-images.mjs | tee .perf/image-report.txt
node scripts/media/apply-image-renames.mjs
du -sh public
git diff --stat -- src | tail -1; git diff --ignore-cr-at-eol --stat -- src | tail -1   # deben coincidir (EOL)
```
Expected: `qms-arquiexpo/2.png` (17 MB) → `2.webp` < 600 KB y el total de imágenes muy por debajo del original (los videos se tratan en la Task 6).

- [ ] **Step 6: Auditoría de `next/image` y `priority`**

1. `src/components/gallery/GalleryView.tsx`, lightbox de `ImageCell`: reemplazar el `<img>` crudo (que descargaba el master completo) por:
```tsx
        <Media
          src={item.image.src}
          alt={item.image.alt}
          sizes="(max-width: 900px) 100vw, 900px"
          radius="m"
        />
```
   `Media` con su `aspectRatio` por defecto (`"original"`) renderiza `next/image` con altura automática y sin recorte, que era el objetivo del `<img>`. Borrar el `eslint-disable-next-line` asociado y ajustar el comentario de arriba.
2. `src/components/blog/Post.tsx`: añadir `priority?: boolean` a `PostProps`, desestructurarlo con default `false` y pasar `priority={priority}` a `Media` en lugar del `priority` fijo.
3. `src/components/FaqChatbot.tsx`: quitar solo el atributo `priority` del `<Image … alt="ErickBot" …>`. Es un icono de 64px que hoy se precarga en todas las páginas y compite con el LCP.
4. `rg -n "<img" src`: solo debe quedar la miniatura de YouTube de `GalleryView` (la reemplaza la Task 7).
5. `rg -n "priority" src`: solo deben quedar el hero de `/work/[slug]`, el hero de `/blog/[slug]` y la prop opcional de `Post`.

- [ ] **Step 7: Verificar**

```bash
npx playwright test --project=unit tests/unit/image-refs.spec.ts           # PASS
npm run build && npx playwright test --project=chromium tests/e2e/no-broken-images.spec.ts tests/e2e/smoke.spec.ts   # PASS
```
Revisión visual del lightbox de Gallery (desktop 1280px y móvil 390px): la imagen completa, sin recorte. Capturas en `.perf/screens/a3-lightbox-{desktop,mobile}.png`.

- [ ] **Step 8: Commit** (binarios y código por separado)

```bash
git add -A public/images scripts/media/image-renames.json scripts/media/optimize-images.mjs scripts/media/apply-image-renames.mjs
git commit -m "perf: replace image sources with WebP q90 / optimized JPEG masters

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git add src tests/unit/image-refs.spec.ts tests/e2e/no-broken-images.spec.ts
git commit -m "perf: point all image references at the new masters and serve them via next/image

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: A4 — Videos (recompresión + `LazyVideo`)

**Files:**
- Create: `scripts/media/optimize-videos.mjs`, `src/components/home/LazyVideo.tsx`, `src/components/home/LazyVideo.module.scss`, `tests/e2e/lazy-video.spec.ts`
- Modify: `public/**/*.mp4` (+ `.webm` y posters nuevos), `src/app/page.tsx`
- Delete: `src/components/home/AutoplayVideo.tsx`

**Interfaces:**
- Produces: `LazyVideo` con props `{ src: string; webm?: string; poster: string; width: number; height: number; label: string; watermark?: boolean; className?: string; style?: React.CSSProperties; "data-testid"?: string }`, en `@/components/home/LazyVideo`.

**Usos actuales (determinan la decisión de audio):**

| Archivo | Uso en la UI | ¿Controles? | ¿Muted? |
|---|---|---|---|
| `videohome.mp4` | Home, `AutoplayVideo` | No | Sí |
| `images/projects/project-01/leadbot.mp4` | Carrusel de `leadbot-ai` (Once UI `Media` → `<video autoPlay loop muted>`) | No | Sí |
| `images/projects/project-01/chatbot-artesa.mp4` | Ídem | No | Sí |
| `images/projects/cuatrimotos-project/chatbot-video.mp4` | Carrusel de `atv-riders` | No | Sí |
| `images/projects/project-01/video-01.mp4` | **Sin referencias** (verificar con `rg -n "video-01" src`) | — | — |

Regla (spec A4): se quita el audio **solo** si el video se reproduce en mute sin controles **y** no tiene narración. «Tiene narración» = pista de audio con `mean_volume > -45 dB`, y entonces se conserva (criterio conservador). `video-01`, que no tiene uso: se recomprime conservando el audio y se reporta como candidato a eliminar.

- [ ] **Step 1: Test e2e (falla: hoy Home descarga el video al cargar)**

`tests/e2e/lazy-video.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("home video", () => {
  test("downloads 0 video bytes on load and plays once scrolled into view", async ({
    page,
    browserName,
  }) => {
    const videoRequests: string[] = [];
    page.on("request", (r) => {
      if (/videohome\.(mp4|webm)/.test(r.url())) videoRequests.push(r.url());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(videoRequests).toEqual([]);

    const video = page.locator('[data-testid="home-video"] video');
    await video.scrollIntoViewIfNeeded();
    await expect.poll(() => videoRequests.length).toBeGreaterThan(0);
    test.skip(browserName === "webkit", "WebKit on Windows has no H.264 decoder");
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  });

  test("respects prefers-reduced-motion: no autoplay, accessible play button", async ({
    page,
    browserName,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const wrap = page.locator('[data-testid="home-video"]');
    await wrap.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    expect(await wrap.locator("video").evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
    const play = wrap.getByRole("button", { name: /play/i });
    await expect(play).toBeVisible();
    await play.focus();
    await page.keyboard.press("Enter");
    test.skip(browserName === "webkit", "WebKit on Windows has no H.264 decoder");
    await expect
      .poll(() => wrap.locator("video").evaluate((v: HTMLVideoElement) => !v.paused))
      .toBe(true);
  });

  test("reserves its box so it causes no layout shift", async ({ page }) => {
    await page.goto("/");
    const before = await page.locator('[data-testid="home-video"]').boundingBox();
    await page.locator('[data-testid="home-video"]').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    const after = await page.locator('[data-testid="home-video"]').boundingBox();
    expect(Math.round(after?.height ?? 0)).toBe(Math.round(before?.height ?? -1));
  });
});
```

Run: `npm run build && npx playwright test --project=chromium tests/e2e/lazy-video.spec.ts`
Expected: FAIL.

- [ ] **Step 2: `scripts/media/optimize-videos.mjs`**

```js
// Recompresses the site's videos: H.264 MP4 (+faststart) replacing the original
// in place, a VP9 WebM next to it, and a WebP poster when none exists.
// Audio is removed ONLY for videos the UI plays muted without controls AND that
// carry no audible content (mean_volume <= -45 dB or no audio stream).
import { spawnSync } from "node:child_process";
import { existsSync, renameSync, rmSync, statSync } from "node:fs";
import sharp from "sharp";

const VIDEOS = [
  { file: "public/videohome.mp4", mutedNoControls: true, targetMB: 1.2, poster: false },
  { file: "public/images/projects/project-01/leadbot.mp4", mutedNoControls: true, targetMB: 1.2, poster: true },
  { file: "public/images/projects/project-01/chatbot-artesa.mp4", mutedNoControls: true, targetMB: 1.2, poster: true },
  { file: "public/images/projects/cuatrimotos-project/chatbot-video.mp4", mutedNoControls: true, targetMB: 1.0, poster: true },
  { file: "public/images/projects/project-01/video-01.mp4", mutedNoControls: false, targetMB: 4, poster: true },
];

function run(cmd, args) {
  const r = spawnSync(cmd, args, { encoding: "utf8" });
  if (r.status !== 0) throw new Error(`${cmd} ${args.join(" ")}\n${r.stderr}`);
  return r;
}

function probe(file) {
  const r = run("ffprobe", ["-v", "error", "-show_streams", "-of", "json", file]);
  const streams = JSON.parse(r.stdout).streams;
  const v = streams.find((s) => s.codec_type === "video");
  return { width: v.width, height: v.height, hasAudio: streams.some((s) => s.codec_type === "audio") };
}

function meanVolume(file) {
  const r = spawnSync("ffmpeg", ["-i", file, "-af", "volumedetect", "-vn", "-f", "null", "-"], {
    encoding: "utf8",
  });
  const m = r.stderr.match(/mean_volume:\s*(-?[\d.]+) dB/);
  return m ? Number(m[1]) : Number.NEGATIVE_INFINITY;
}

const scale = "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))'";
const mb = (f) => statSync(f).size / 1048576;

for (const v of VIDEOS) {
  if (!existsSync(v.file)) {
    console.log(`skip (missing) ${v.file}`);
    continue;
  }
  const info = probe(v.file);
  const vol = info.hasAudio ? meanVolume(v.file) : Number.NEGATIVE_INFINITY;
  const keepAudio = info.hasAudio && (!v.mutedNoControls || vol > -45);
  const before = mb(v.file);

  let crf = 26;
  const tmp = v.file.replace(/\.mp4$/, ".tmp.mp4");
  for (;;) {
    run("ffmpeg", [
      "-y", "-i", v.file, "-vf", scale,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(crf),
      "-profile:v", "high", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
      ...(keepAudio ? ["-c:a", "aac", "-b:a", "96k"] : ["-an"]),
      tmp,
    ]);
    if (mb(tmp) <= v.targetMB || crf >= 32) break;
    crf += 2;
  }

  const webm = v.file.replace(/\.mp4$/, ".webm");
  run("ffmpeg", [
    "-y", "-i", tmp, "-c:v", "libvpx-vp9", "-crf", String(crf + 8), "-b:v", "0",
    "-row-mt", "1", "-deadline", "good", "-cpu-used", "2",
    ...(keepAudio ? ["-c:a", "libopus", "-b:a", "64k"] : ["-an"]),
    webm,
  ]);

  const posterWebp = v.file.replace(/\.mp4$/, "-poster.webp");
  if (v.poster && !existsSync(posterWebp)) {
    const png = v.file.replace(/\.mp4$/, ".poster.png");
    run("ffmpeg", ["-y", "-ss", "0.5", "-i", tmp, "-frames:v", "1", png]);
    await sharp(png).webp({ quality: 85 }).toFile(posterWebp);
    rmSync(png);
  }

  rmSync(v.file);
  renameSync(tmp, v.file);
  const out = probe(v.file);
  console.log(
    `${v.file}: ${before.toFixed(2)}MB -> mp4 ${mb(v.file).toFixed(2)}MB / webm ${mb(webm).toFixed(2)}MB | ` +
      `crf ${crf} | ${out.width}x${out.height} | audio: ${info.hasAudio ? `${vol} dB` : "none"} -> ${keepAudio ? "KEPT" : "REMOVED"}` +
      `${mb(v.file) > v.targetMB ? "  !! OVER TARGET" : ""}`,
  );
}
```

- [ ] **Step 3: Ejecutar y registrar las decisiones**

```bash
rg -n "video-01" src || echo "video-01 unreferenced"
node scripts/media/optimize-videos.mjs | tee .perf/video-decisions.txt
```
Expected: una línea por video con tamaños, WxH y la decisión de audio. Si aparece `!! OVER TARGET`, reportarlo (no bajar de CRF 32). **Anotar el `WxH` de `videohome.mp4`** para el Step 5.

- [ ] **Step 4: `src/components/home/LazyVideo.tsx` y `LazyVideo.module.scss`**

```tsx
"use client";

import { EMIcon } from "@/resources/EMIcon";
import { useEffect, useRef, useState } from "react";
import styles from "./LazyVideo.module.scss";

interface LazyVideoProps {
  src: string;
  webm?: string;
  poster: string;
  /** Intrinsic size, used to reserve the box (no layout shift). */
  width: number;
  height: number;
  /** Accessible name for the play button, e.g. "Play showreel". */
  label: string;
  watermark?: boolean;
  className?: string;
  style?: React.CSSProperties;
  "data-testid"?: string;
}

type NetworkInformationLike = { saveData?: boolean };

/** Autoplay is skipped for reduced-motion and data-saver users; they get a play button. */
function canAutoplay(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return !connection?.saveData;
}

/**
 * Muted, looping video that downloads nothing until it scrolls into view
 * (preload="none" + poster), plays while visible and pauses when it leaves.
 */
export function LazyVideo({
  src,
  webm,
  poster,
  width,
  height,
  label,
  watermark = false,
  className,
  style,
  "data-testid": testId,
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsButton, setNeedsButton] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const auto = canAutoplay();
    setNeedsButton(!auto);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (auto) {
            video.muted = true;
            video.play().catch(() => setNeedsButton(true));
          }
        } else if (!video.paused) {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const start = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video
      .play()
      .then(() => setNeedsButton(false))
      .catch(() => setNeedsButton(true));
  };

  return (
    <div
      className={`${styles.root} ${className ?? ""}`}
      style={{ aspectRatio: `${width} / ${height}`, ...style }}
      data-testid={testId}
    >
      <video
        ref={videoRef}
        className={styles.video}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        width={width}
        height={height}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={src} type="video/mp4" />
      </video>
      {needsButton && !playing && (
        <button type="button" className={styles.play} onClick={start} aria-label={label}>
          <span aria-hidden="true" className={styles.playIcon} />
        </button>
      )}
      {watermark && (
        <span aria-hidden="true" className={styles.watermark}>
          <EMIcon />
        </span>
      )}
    </div>
  );
}
```

```scss
.root {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 64px;
  height: 64px;
  border: 1px solid var(--brand-alpha-medium);
  border-radius: 50%;
  background: rgba(11, 11, 15, 0.7);
  box-shadow: var(--glow-border);
  cursor: pointer;
  display: grid;
  place-items: center;

  &:focus-visible {
    outline: 2px solid var(--brand-solid-medium);
    outline-offset: 4px;
  }
}

.playIcon {
  width: 0;
  height: 0;
  margin-left: 4px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 16px solid #f4f5f7;
}

.watermark {
  position: absolute;
  right: 16px;
  bottom: 16px;
  font-size: 22px;
  color: #f4f5f7;
  opacity: 0.7;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.6));
  line-height: 0;
  pointer-events: none;
}
```

- [ ] **Step 5: Usarlo en `src/app/page.tsx` y borrar `AutoplayVideo`**

Cambiar el import `AutoplayVideo` por `import { LazyVideo } from "@/components/home/LazyVideo";` y reemplazar el bloque del video por:

```tsx
          <RevealFx translateY="12" delay={0.5} fillWidth horizontal="center" paddingTop="32">
            <LazyVideo
              data-testid="home-video"
              src="/videohome.mp4"
              webm="/videohome.webm"
              poster="/images/videohome-poster.webp"
              width={1920}
              height={1080}
              label="Play showreel"
              watermark
            />
          </RevealFx>
```
**Reemplazar `1920`/`1080` por los valores reales del `WxH` anotado en el Step 3** si difieren. Confirmar que el poster ya es `.webp` desde la Task 5: `ls public/images/videohome-poster.*`.

```bash
git rm src/components/home/AutoplayVideo.tsx
rg -n "AutoplayVideo" src   # Expected: sin resultados
```

- [ ] **Step 6: Verificar**

```bash
npm run build && npx playwright test --project=chromium --project=mobile-chromium --project=firefox --project=webkit tests/e2e/lazy-video.spec.ts tests/e2e/smoke.spec.ts
```
Expected: PASS (WebKit salta solo el paso de reproducción, documentado en el test). Revisión manual: `/work/leadbot-ai` y `/work/atv-riders`, confirmar que los videos del carrusel se siguen reproduciendo.

- [ ] **Step 7: Commit**

```bash
git add -A public/videohome.* public/images/projects scripts/media/optimize-videos.mjs
git commit -m "perf: recompress videos (H.264 faststart + VP9) and add posters

Audio removed only where the UI plays the video muted without controls and the
track has no audible content (decisions listed in docs/perf-report.md).

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git add src/components/home src/app/page.tsx tests/e2e/lazy-video.spec.ts
git commit -m "perf: lazy-load the home video (preload=none, play in viewport, no autoplay for RM/save-data)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: A5 — Fachada de YouTube

**Files:**
- Create: `src/utils/youtube.ts`, `src/utils/platform.ts`, `src/components/YouTubeFacade.tsx`, `src/components/YouTubeFacade.module.scss`, `tests/unit/youtube.spec.ts`, `tests/e2e/youtube-facade.spec.ts`
- Modify: `src/components/gallery/GalleryView.tsx` (`YouTubeCell`, `extractYouTubeId`, `embedUrl`), `src/components/mdx/YouTubeEmbed.tsx`

**Interfaces:**
- Produces:
  - `extractYouTubeId(src: string): string`
  - `youTubeEmbedUrl(videoId: string, opts?: { mute?: boolean }): string`
  - `youTubeThumbnail(videoId: string): string`
  - `isIOS(ua: string, platform: string, maxTouchPoints: number): boolean`
  - `<YouTubeFacade videoId title aspectRatio className? />`

- [ ] **Step 1: Tests unitarios (fallan)**

`tests/unit/youtube.spec.ts`:

```ts
import { expect, test } from "@playwright/test";
import { isIOS } from "@/utils/platform";
import { extractYouTubeId, youTubeEmbedUrl, youTubeThumbnail } from "@/utils/youtube";

test("extractYouTubeId handles shorts, watch and youtu.be URLs", () => {
  expect(extractYouTubeId("https://youtube.com/shorts/BzDuYfJs3Oo")).toBe("BzDuYfJs3Oo");
  expect(extractYouTubeId("https://youtube.com/shorts/BzDuYfJs3Oo?feature=share")).toBe("BzDuYfJs3Oo");
  expect(extractYouTubeId("https://www.youtube.com/watch?v=abc123&t=4")).toBe("abc123");
  expect(extractYouTubeId("https://youtu.be/xyz789")).toBe("xyz789");
  expect(extractYouTubeId("https://example.com")).toBe("");
});

test("embed URL uses youtube-nocookie with autoplay and playsinline", () => {
  const url = new URL(youTubeEmbedUrl("BzDuYfJs3Oo"));
  expect(url.origin).toBe("https://www.youtube-nocookie.com");
  expect(url.pathname).toBe("/embed/BzDuYfJs3Oo");
  expect(url.searchParams.get("autoplay")).toBe("1");
  expect(url.searchParams.get("playsinline")).toBe("1");
  expect(url.searchParams.has("mute")).toBe(false);
  expect(new URL(youTubeEmbedUrl("x", { mute: true })).searchParams.get("mute")).toBe("1");
});

test("thumbnail comes from i.ytimg.com (allowed by the CSP)", () => {
  expect(youTubeThumbnail("abc")).toBe("https://i.ytimg.com/vi/abc/hqdefault.jpg");
});

test("isIOS detects iPhone and iPadOS-as-Mac, not desktop Mac", () => {
  expect(isIOS("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)", "iPhone", 5)).toBe(true);
  expect(isIOS("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "MacIntel", 5)).toBe(true);
  expect(isIOS("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "MacIntel", 0)).toBe(false);
  expect(isIOS("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Win32", 0)).toBe(false);
});
```

Run: `npx playwright test --project=unit tests/unit/youtube.spec.ts` → FAIL.

- [ ] **Step 2: `src/utils/youtube.ts` y `src/utils/platform.ts`**

```ts
// src/utils/youtube.ts
export function extractYouTubeId(src: string): string {
  if (src.includes("youtu.be/")) return src.split("youtu.be/")[1].split(/[?&#]/)[0];
  if (src.includes("shorts/")) return src.split("shorts/")[1].split(/[?&#]/)[0];
  if (src.includes("v=")) return src.split("v=")[1].split(/[&#]/)[0];
  return "";
}

/** Privacy-enhanced embed that starts playing as soon as it mounts (after a user click). */
export function youTubeEmbedUrl(videoId: string, opts: { mute?: boolean } = {}): string {
  const params = new URLSearchParams({ autoplay: "1", playsinline: "1", rel: "0" });
  if (opts.mute) params.set("mute", "1");
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?${params}`;
}

export function youTubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${encodeURIComponent(videoId)}/hqdefault.jpg`;
}
```

```ts
// src/utils/platform.ts
/** iPhone/iPod/iPad, including iPadOS which reports itself as a touch-capable Mac. */
export function isIOS(ua: string, platform: string, maxTouchPoints: number): boolean {
  if (/iPad|iPhone|iPod/.test(ua)) return true;
  return platform === "MacIntel" && maxTouchPoints > 1;
}
```

- [ ] **Step 3: Tests unitarios en verde**

Run: `npx playwright test --project=unit tests/unit/youtube.spec.ts` → 4 passed.

- [ ] **Step 4: Test e2e (falla: hoy los iframes se montan al acercarse)**

`tests/e2e/youtube-facade.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const isYouTubePlayer = (url: string) =>
  /youtube(-nocookie)?\.com\/(embed|s\/player|youtubei)/.test(url);

test("gallery loads no YouTube player until a facade is activated", async ({ page }) => {
  const ytRequests: string[] = [];
  page.on("request", (r) => {
    if (isYouTubePlayer(r.url())) ytRequests.push(r.url());
  });
  await page.goto("/gallery");
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
  });
  await page.waitForLoadState("networkidle");
  expect(ytRequests).toEqual([]);
});

test("keyboard activation starts the player and moves focus into it", async ({ page }) => {
  await page.goto("/gallery");
  const facade = page.getByRole("button", { name: /^Play video:/ }).first();
  await facade.focus();
  await page.keyboard.press("Enter");
  const iframe = page.locator('iframe[src*="youtube-nocookie.com/embed/"]').first();
  await expect(iframe).toBeVisible();
  expect(await iframe.getAttribute("src")).toContain("autoplay=1");
  await expect.poll(() => page.evaluate(() => document.activeElement?.tagName)).toBe("IFRAME");
});
```

Run: `npm run build && npx playwright test --project=chromium tests/e2e/youtube-facade.spec.ts` → FAIL.

- [ ] **Step 5: `src/components/YouTubeFacade.tsx` + `.module.scss`**

```tsx
"use client";

import { isIOS } from "@/utils/platform";
import { youTubeEmbedUrl, youTubeThumbnail } from "@/utils/youtube";
import { useRef, useState } from "react";
import styles from "./YouTubeFacade.module.scss";

/**
 * Flip to true ONLY if the manual check on a real iPhone shows that autoplay
 * after the tap needs a second tap. Muted autoplay is allowed by iOS without a
 * second gesture; the CSP is not touched either way (spec A5).
 */
const MUTE_ON_IOS = false;

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  /** CSS aspect-ratio, e.g. "9 / 16" or "16 / 9". */
  aspectRatio: string;
  className?: string;
}

/**
 * Static thumbnail + play button; the heavy YouTube iframe is mounted only
 * after the user activates it, then starts playing and receives focus.
 */
export function YouTubeFacade({ videoId, title, aspectRatio, className }: YouTubeFacadeProps) {
  const [active, setActive] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const mute =
    MUTE_ON_IOS &&
    typeof navigator !== "undefined" &&
    isIOS(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);

  return (
    <div className={`${styles.root} ${className ?? ""}`} style={{ aspectRatio }}>
      {active ? (
        <iframe
          ref={iframeRef}
          className={styles.iframe}
          src={youTubeEmbedUrl(videoId, { mute })}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          onLoad={() => iframeRef.current?.focus()}
        />
      ) : (
        <button
          type="button"
          className={styles.button}
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
        >
          {/* biome-ignore lint/a11y/useAltText: decorative; the button carries the accessible name */}
          <img
            className={styles.thumb}
            src={youTubeThumbnail(videoId)}
            alt=""
            loading="lazy"
            decoding="async"
          />
          <span className={styles.play} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
```

```scss
.root {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: var(--radius-m, 8px);
  background: var(--surface-background);
}

.button {
  all: unset;
  position: absolute;
  inset: 0;
  cursor: pointer;
  display: block;

  &:focus-visible {
    outline: 2px solid var(--brand-solid-medium);
    outline-offset: -2px;
  }
}

.thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: rgba(11, 11, 15, 0.7);
  box-shadow: var(--glow-border);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    width: 0;
    height: 0;
    transform: translateX(2px);
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    border-left: 14px solid #f4f5f7;
  }
}

.iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
```

- [ ] **Step 6: Integrar en `GalleryView` y `YouTubeEmbed`**

1. `GalleryView.tsx`:
   - Borrar la función local `extractYouTubeId` e importar `extractYouTubeId` de `@/utils/youtube`.
   - Importar `YouTubeFacade` de `@/components/YouTubeFacade`.
   - Borrar el campo `embedUrl` del tipo `GalleryItem` y de `buildGalleryItems`.
   - Reemplazar **todo** `YouTubeCell` (estado, `IntersectionObserver`, iframe y miniatura) y su comentario de bloque por:
```tsx
function YouTubeCell({ item }: { item: Extract<GalleryItem, { type: "youtube" }> }) {
  return (
    <YouTubeFacade
      videoId={item.videoId}
      title={item.image.alt}
      aspectRatio={getAspectRatio(item.image.orientation, true)}
    />
  );
}
```
2. `src/components/mdx/YouTubeEmbed.tsx`: import `import { YouTubeFacade } from "@/components/YouTubeFacade";` y, dentro de `styles.container`, reemplazar el `<iframe …/>` por:
```tsx
          <YouTubeFacade
            className={styles.iframe}
            videoId={videoId}
            title={title}
            aspectRatio={isVert ? "9 / 16" : "16 / 9"}
          />
```
   Revisar `YouTubeEmbed.module.scss`: si `.container` ya fija la relación (padding-top o `aspect-ratio`) y `.iframe` es `position: absolute; inset: 0`, pasar `aspectRatio="auto"` para no duplicar la relación.

- [ ] **Step 7: Verificar**

```bash
npm run build && npx playwright test --project=chromium --project=firefox --project=webkit tests/e2e/youtube-facade.spec.ts tests/e2e/smoke.spec.ts
rg -n "youtube.com/embed" src   # Expected: sin resultados
```
Revisión manual: un caso de estudio con `<YouTubeEmbed>` (`rg -ln "YouTubeEmbed" src/app/work/projects`): miniatura, play y enlace de Instagram.

- [ ] **Step 8: Commit**

```bash
git add src/utils/youtube.ts src/utils/platform.ts src/components/YouTubeFacade.tsx src/components/YouTubeFacade.module.scss src/components/gallery/GalleryView.tsx src/components/mdx/YouTubeEmbed.tsx tests/unit/youtube.spec.ts tests/e2e/youtube-facade.spec.ts
git commit -m "perf: load YouTube players only on demand behind an accessible facade

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: A6 — Globo del chatbot y carrusel de proyectos sin layout shift

**Files:**
- Modify: `src/components/FaqChatbot.module.scss` (`.greetingBubble`), `src/components/ProjectCard.tsx` (prop `aspectRatio` del `Carousel`)
- Create: `tests/e2e/cls.spec.ts`

- [ ] **Step 1: Test de CLS (falla hoy)**

```ts
import { expect, test } from "@playwright/test";
import { ROUTES, measureCLS } from "./helpers";

test.describe("layout stability", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "layout-shift entries are Chromium-only");

  for (const route of ROUTES) {
    test(`${route.name}: CLS < 0.05 including the chatbot greeting`, async ({ page }) => {
      await page.goto(route.path);
      // 3.5 s covers the greeting bubble, which appears 2.5 s after load.
      const cls = await measureCLS(page, 3500);
      expect(cls).toBeLessThan(0.05);
    });
  }

  test("greeting bubble stays inside a 360px viewport", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/about");
    const bubble = page.getByText("Curious about my work?");
    await expect(bubble).toBeVisible({ timeout: 5000 });
    const box = await bubble.boundingBox();
    expect(box?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(360);
  });
});
```

Run: `npm run build && npx playwright test --project=chromium --project=mobile-chromium tests/e2e/cls.spec.ts`
Expected: FAIL en `work` (carrusel) y cerca del límite en el resto (globo, ~0.037).

- [ ] **Step 2: Globo fuera del flujo del contenedor fijo**

En `.greetingBubble`, reemplazar `position: relative;` y `margin-bottom: 12px;` por:

```scss
  /* Out of the fixed wrapper's flow: appearing no longer grows the wrapper
     upward, which registered as a layout shift on every page. */
  position: absolute;
  right: 0;
  bottom: calc(100% + 12px);
```
El resto (ancho, `max-width: calc(100vw - 3rem)`, animación `slideUpFadeIn` con `transform` + `opacity`) queda igual.

- [ ] **Step 3: Relación fija en el carrusel de `ProjectCard`**

```tsx
      <Carousel
        sizes="(max-width: 960px) 100vw, 960px"
        aspectRatio="16 / 9"
        items={images.map((image) => ({
```
Revisión visual en `/work` y en el proyecto destacado de Home: si alguna imagen principal no es 16:9 y queda recortada de forma notable, captura en `.perf/screens/a6-*.png` y reporte a Erick (el índice del Plan 2 reemplaza este carrusel igualmente).

- [ ] **Step 4: Verificar y commitear**

```bash
npm run build && npx playwright test --project=chromium --project=mobile-chromium tests/e2e/cls.spec.ts   # PASS
git add src/components/FaqChatbot.module.scss src/components/ProjectCard.tsx tests/e2e/cls.spec.ts
git commit -m "fix: remove layout shifts from the chatbot greeting and project carousels

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: A7 — Nombres accesibles

**Files:**
- Modify: `src/components/Header.tsx` (4 `ToggleButton` móviles), `src/components/blog/ShareSection.tsx`, `src/components/HeadingLink.tsx`
- Create: `tests/e2e/a11y-names.spec.ts`

- [ ] **Step 1: Test (falla)**

```ts
import { devices, expect, test } from "@playwright/test";

test.describe("mobile nav", () => {
  test.use({ ...devices["Pixel 7"] });
  test("icon-only nav links have accessible names", async ({ page }) => {
    await page.goto("/");
    for (const name of ["About", "Projects", "Blog", "Visual Work"]) {
      await expect(page.getByRole("link", { name, exact: true })).toBeVisible();
    }
  });
});

test("share and copy-link controls have accessible names", async ({ page }) => {
  await page.goto("/blog/my-workspace");
  await expect(page.getByRole("link", { name: "Share on X" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Share on LinkedIn" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Share by email" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copy link to this post" })).toBeVisible();
});

test("heading copy-link controls are real buttons with a name", async ({ page }) => {
  await page.goto("/blog/my-workspace");
  expect(await page.getByRole("button", { name: /^Copy link to section/ }).count()).toBeGreaterThan(0);
  expect(await page.locator("div[aria-label='Copy']").count()).toBe(0);
});
```

Run: `npm run build && npx playwright test --project=chromium tests/e2e/a11y-names.spec.ts` → FAIL.

- [ ] **Step 2: Header**

A cada uno de los 4 `ToggleButton` dentro de `<Row hide s={{ hide: false }}>`, añadir `aria-label` con el mismo texto que la variante desktop:

```tsx
                    <ToggleButton
                      prefixIcon="person"
                      href="/about"
                      aria-label={about.label}
                      selected={pathname === "/about"}
                    />
```
Idem con `aria-label={work.label}` (`/work`), `aria-label={blog.label}` (`/blog`) y `aria-label={gallery.label}` (`/gallery`).

- [ ] **Step 3: ShareSection**

```tsx
const shareLabel = (platform: SocialPlatform) =>
  platform.name === "email" ? "Share by email" : `Share on ${platform.label}`;
```
Declararlo sobre `ShareSection`. Pasar `aria-label={shareLabel(platform)}` a cada `Button` de plataforma, y `aria-label="Copy link to this post"` al `Button` de copiar.

- [ ] **Step 4: HeadingLink**

El `IconButton` actual se renderiza como `div` con `aria-label`, lo que provoca `aria-prohibited-attr`. Darle `onClick` (así se renderiza como `<button>`) y un nombre:

```tsx
      <IconButton
        className={styles.visibility}
        size="s"
        icon="openLink"
        variant="ghost"
        tooltip="Copy"
        tooltipPosition="right"
        aria-label={`Copy link to section: ${typeof children === "string" ? children : id}`}
        onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          copyURL(id);
        }}
      />
```
`stopPropagation` evita el doble toast con el `onClick` del contenedor, cuyo comportamiento se conserva. Si el test sigue encontrando `div[aria-label='Copy']` (porque `IconButton` no cambia de elemento), reemplazar el `IconButton` por:
```tsx
      <button
        type="button"
        className={styles.visibility}
        aria-label={`Copy link to section: ${typeof children === "string" ? children : id}`}
        onClick={(event) => {
          event.stopPropagation();
          copyURL(id);
        }}
      >
        <Icon name="openLink" size="s" />
      </button>
```
(con `Icon` añadido al import de `@once-ui-system/core`).

- [ ] **Step 5: Verificar y commitear**

```bash
npm run build && npx playwright test --project=chromium tests/e2e/a11y-names.spec.ts tests/e2e/smoke.spec.ts   # PASS
git add src/components/Header.tsx src/components/blog/ShareSection.tsx src/components/HeadingLink.tsx tests/e2e/a11y-names.spec.ts
git commit -m "fix: give icon-only nav, share and heading-link controls accessible names

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: A8 — Fuentes (una instancia de Inter; IntroLoader con `--font-heading`)

**Files:**
- Modify: `src/resources/once-ui.config.ts`, `src/resources/custom.css`, `src/components/IntroLoader.tsx` (solo la fuente), `src/components/IntroLoader.module.scss` (`.wordmark`)
- Create: `tests/e2e/intro-font.spec.ts` (+ snapshots)

- [ ] **Step 1: Confirmar las condiciones del spec (A8.1 y A8.2)**

```bash
npm run build
grep -o '<link rel="preload"[^>]*as="font"[^>]*>' .next/server/app/index.html
grep -rhoE "font-weight:[^;}]*" .next/static/css/*.css | sort | uniq -c
```
Expected:
- Preloads `woff2` en el HTML de Home. Anotar cuántos hay (N): tras el cambio deben ser ≤ N.
- Una entrada `font-weight:300 700` (rango variable) para Space Grotesk, que confirma que la instancia `heading` es variable e incluye el 700. En `once-ui.config.ts`, la instancia `heading` no fija `weight`.

- [ ] **Step 2: Capturas de referencia del intro ANTES del cambio**

`tests/e2e/intro-font.spec.ts`:

```ts
import { type Page, expect, test } from "@playwright/test";

// Seeks every Web Animation on the intro to a fixed time, so each screenshot is
// a deterministic frame regardless of machine speed.
async function seek(page: Page, ms: number) {
  await page.evaluate((t) => {
    for (const a of document.getAnimations()) {
      a.pause();
      a.currentTime = t;
    }
  }, ms);
}

test.describe("IntroLoader wordmark font", () => {
  test.skip(({ browserName }) => browserName !== "chromium", "reference frames are Chromium-only");
  test.use({ viewport: { width: 1280, height: 800 } });

  for (const ms of [500, 2500, 3500]) {
    test(`frame at ${ms}ms is unchanged`, async ({ page }) => {
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await seek(page, ms);
      await expect(page.locator('[class*="IntroLoader_overlay"]')).toHaveScreenshot(`intro-${ms}.png`);
    });
  }
});
```

```bash
npx playwright test --project=chromium tests/e2e/intro-font.spec.ts --update-snapshots
git add tests/e2e/intro-font.spec.ts tests/e2e/intro-font.spec.ts-snapshots
git commit -m "test: capture IntroLoader reference frames before the font change

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 3: Una sola instancia de Inter**

- `src/resources/once-ui.config.ts`: borrar `const label = Inter({ … });` y en `fonts` poner `label: body`.
- `src/resources/custom.css`: añadir dentro del primer bloque `:root`:
```css
  /* Labels use the body Inter instance (one font download instead of two). */
  --font-label: var(--font-body);
```

- [ ] **Step 4: IntroLoader usa `--font-heading`**

En `src/components/IntroLoader.tsx`:
- Borrar `import { Space_Grotesk } from "next/font/google";` y el bloque `const wordmarkFont = Space_Grotesk({ … });`.
- En el `<span ref={wordmarkRef} …>`, dejar `className={styles.wordmark}`.

En `src/components/IntroLoader.module.scss`, dentro de `.wordmark`:
```scss
  font-family: var(--font-heading), sans-serif;
  font-weight: 700;
```
**Nada más cambia en el IntroLoader.**

- [ ] **Step 5: Comparar las capturas**

```bash
npm run build && npx playwright test --project=chromium tests/e2e/intro-font.spec.ts
```
Expected: 3 passed (`maxDiffPixelRatio: 0.001`). **Si falla**, adjuntar los diffs (`test-results/**/intro-*-diff.png`), revertir el Step 4 (`git checkout -- src/components/IntroLoader.tsx src/components/IntroLoader.module.scss`) y **reportar a Erick** que la instancia variable no renderiza idéntico a la estática. El Step 3 (Inter) se conserva.

- [ ] **Step 6: Verificar preloads y commitear**

```bash
grep -o '<link rel="preload"[^>]*as="font"[^>]*>' .next/server/app/index.html | wc -l   # <= N del Step 1
npx playwright test --project=chromium tests/e2e/smoke.spec.ts
git add src/resources/once-ui.config.ts src/resources/custom.css src/components/IntroLoader.tsx src/components/IntroLoader.module.scss
git commit -m "perf: drop duplicate font instances (label Inter, IntroLoader Space Grotesk)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Verificación completa, reporte, push y Preview

**Files:**
- Create: `docs/perf-report.md`

- [ ] **Step 1: Gates**

```bash
npx @biomejs/biome check src --max-diagnostics=0 2>&1 | tail -2
npx tsc --noEmit; echo "tsc exit=$?"
npm run build 2>&1 | tail -30
npm run test:unit && npm run test:e2e
```
Expected: todo en verde. First Load JS por ruta ≤ línea base (`/` 311, `/about` 275, `/work` 309, `/blog/[slug]` 312, `/gallery` 286 kB).

- [ ] **Step 2: Headers de seguridad idénticos a producción**

```bash
H='content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy|strict-transport-security|x-dns-prefetch-control'
curl -sI https://www.erickmahecha.com/ | grep -iE "$H" | tr -d '\r' | sort > .perf/headers-prod.txt
curl -sI http://localhost:3100/ | grep -iE "$H" | tr -d '\r' | sort > .perf/headers-branch.txt
diff .perf/headers-prod.txt .perf/headers-branch.txt && echo "HEADERS IDENTICAL"
```
Expected: `HEADERS IDENTICAL`.

- [ ] **Step 3: Chatbot y endpoints de auth (no regresión)**

```bash
curl -s -o /dev/null -w "check-auth %{http_code}\n" http://localhost:3100/api/check-auth
curl -s -o /dev/null -w "authenticate(bad) %{http_code}\n" -H "Content-Type: application/json" -d '{"password":"wrong"}' http://localhost:3100/api/authenticate
```
Comparar con los mismos comandos contra `main` (worktree raíz, `npm run build && npm run start -- -p 3301`): los códigos deben coincidir. Chatbot: en el sitio local, enviar «What does Erick do?» y confirmar que llega respuesta (usa `.env.local` de la raíz; **no leer ni tocar ese archivo**; si el worktree no tiene `.env.local`, probar el chatbot en el Preview del Step 7).

- [ ] **Step 4: Lighthouse local (mismo servidor que la línea base local)**

```bash
export CHROME_PATH="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
LH_TAG=quickwins-local npm run perf:lh
npm run perf:report -- quickwins-local base-local
du -sh public
```

- [ ] **Step 5: `docs/perf-report.md`**

Rellenar con las salidas reales, sin redondear a favor:

```markdown
# Performance report

## Fase A — Quick wins (`perf/quick-wins`)

### Lighthouse (median of 3), local `next start`, same machine
<salida de `npm run perf:report -- quickwins-local base-local`>

### Lighthouse (median of 3), Vercel Preview vs production baseline
<tabla del Step 7>

### First Load JS (`next build`)
| Route | Baseline | Quick wins | Δ |
|---|---|---|---|
| `/` | 311 kB | | |
| `/about` | 275 kB | | |
| `/work` | 309 kB | | |
| `/blog/[slug]` | 312 kB | | |
| `/gallery` | 286 kB | | |

### Assets
| | Baseline | Quick wins |
|---|---|---|
| `public/` total | 109 MB | |
| Home video bytes on load | ~3.5 MB | 0 |
| Gallery JS incl. third parties | ~1212 KB | |

### Video audio decisions
<contenido de .perf/video-decisions.txt>

### Security checks
<resultados de Task 3 Step 8 (.perf/security-notes.txt) y Task 11 Steps 2–3>

### Open items
- `video-01.mp4` is not referenced anywhere — candidate for deletion (Erick decides).
- iOS YouTube single-tap check pending (Erick, on the Preview).
```

```bash
git add docs/perf-report.md
git commit -m "docs: add Phase A performance report

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Push y URL del Preview**

```bash
git push -u origin perf/quick-wins
SHA=$(git rev-parse HEAD)
# Tras 2–4 min:
curl -s "https://api.github.com/repos/Erickgooo/magic-portfolio/deployments?sha=$SHA" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{for(const d of JSON.parse(s))console.log(d.id,d.environment)})'
curl -s "https://api.github.com/repos/Erickgooo/magic-portfolio/deployments/<id>/statuses" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{for(const x of JSON.parse(s))console.log(x.state,x.environment_url)})'
```
Expected: `success https://magic-portfolio-<hash>.vercel.app`.

- [ ] **Step 7: Lighthouse sobre el Preview**

```bash
curl -s -o /dev/null -w "%{http_code}\n" "<preview-url>/"
```
- **200:** `LH_BASE_URL=<preview-url> LH_TAG=quickwins-preview npm run perf:lh` y `npm run perf:report -- quickwins-preview` (comparar con la tabla de producción de `docs/perf-baseline.md`).
- **401/403 (Deployment Protection):** **no desactivarla.** Pasar a Erick estas instrucciones exactas y esperar el secreto:
  1. Vercel Dashboard → proyecto `magic-portfolio` → **Settings** → **Deployment Protection**.
  2. Sección **Protection Bypass for Automation** → **Add Secret** → copiar el valor generado.
  3. Compartirlo por un canal privado (nunca en el repo). Se usa solo como variable local: `LH_BYPASS=<secret> LH_BASE_URL=<preview-url> LH_TAG=quickwins-preview npm run perf:lh`. El script lo envía como headers `x-vercel-protection-bypass: <secret>` y `x-vercel-set-bypass-cookie: true`.

Actualizar `docs/perf-report.md` con la tabla del Preview, commit `docs:` y push.

- [ ] **Step 7b: Tiempo de build en Vercel (impacto de las devDeps)**

Con los estados del GitHub Deployment, calcular la duración del build como la diferencia entre el primer estado (`pending`/`in_progress`) y `success`, para el deployment de la rama y para el último de producción (`fa4f820`, id `5811457674`):
```bash
for id in 5811457674 <preview-deployment-id>; do
  curl -s "https://api.github.com/repos/Erickgooo/magic-portfolio/deployments/$id/statuses" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const x=JSON.parse(s);const t=x.map(e=>new Date(e.created_at));console.log(process.argv[1],x.map(e=>e.state).join(">"),Math.round((Math.max(...t)-Math.min(...t))/1000)+"s")})' "$id"
done
```
Si GitHub solo expone el estado final (una sola entrada), pedirle a Erick la duración que muestra Vercel → Deployments → (deployment) → Build Logs. Anotar ambos tiempos y el Δ en `docs/perf-report.md` («Vercel build time»).

- [ ] **Step 8: CP1 — entrega a Erick y ESPERA**

Mensaje con:
- Resumen corto de la fase: tareas hechas, commits (`git log --oneline main..perf/quick-wins`) e ideas descartadas.
- URL del Preview.
- Tiempo de build en Vercel, antes y después.
- Tabla antes/después.
- Decisiones de audio.
- Resultados de seguridad.
- Checklist de iOS: fachada de YouTube con un solo toque; si pide dos, commit `fix:` con `MUTE_ON_IOS = true`.
- `video-01.mp4` sin uso.
- La pregunta explícita de si aprueba el merge de `perf/quick-wins` a `main`.

**No hacer merge sin un «sí» explícito.**
