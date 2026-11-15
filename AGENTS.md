# AGENTS.md

Guidance for AI agents working on this repository.

## Project Overview

`@thednp/dommatrix` is a TypeScript shim for the native [DOMMatrix](https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix) interface. It ships a single default export, the `CSSMatrix` class, with a nearly identical API surface to native `DOMMatrix`, but works in **Node.js** and legacy browsers where `DOMMatrix` does not exist.

The library is intentionally small and dependency-free. There are no runtime dependencies; the `dist/` bundle is produced from `src/index.ts` alone.

## Tech Stack

- **Language**: TypeScript 7 (`typescript@^7`), `strict` mode, `moduleResolution: "Bundler"`
- **Package manager**: vite-plus aka vp
- **Build**: [tsdown](https://tsdown.dev) (rolldown-based), config in `tsdown.config.ts` — produces ESM (`dommatrix.mjs`), CJS (`dommatrix.cjs`), UMD (`dommatrix.js`, global `CSSMatrix`) and bundled types (`dommatrix.d.ts`) into `dist/`
- **JSR**: `deno.json` mirrors `package.json` (name, version, MIT license, keywords) and publishes the raw TypeScript source via `deno publish`. Keep `version` in sync between the two files
- **Tests**: Vitest 5 in **browser mode** only (Playwright + Chromium, headless), with istanbul coverage in `vitest.config.ts`
- **Lint/format**: Vite+ (oxlint / oxfmt via `vp lint src` and `vp fmt src`) — not ESLint/Prettier
- **Runtime requirement**: Node >= 20, vite-plus >= 1.6.0

## Commands

```sh
vpr build          # tsdown build (vp pack) + copy dist/dommatrix.js to docs/
vpr test           # vitest browser tests (headless Chromium) + coverage
vpr test-ui        # vitest browser tests with UI
vpr lint           # oxlint src + tsc --noEmit
vpr lint:ts        # oxlint src
vpr check:ts       # tsc --noEmit
vpr fix:ts         # oxlint src --fix
vpr format         # oxfmt src
vpr bench          # vitest browser bench vs test/fixtures/index-3.0.x.ts (no coverage)
vpr bench:native   # vitest browser bench vs native DOMMatrix (no coverage)
vpr bench:docs     # run both bench suites (2x), write test/fixtures/bench-results.json, regenerate the BENCHMARK.md tables and the README ## Benchmarks summary
```

Always run `vpr lint` and `vpr test` after making changes.

Deno equivalents: `deno task test`, `deno task lint`, `deno task check`, `deno task format` (also usable as bare `deno test`-style commands: `deno lint src`, `deno check src/index.ts`, `deno fmt src`, `deno doc src/index.ts`, `deno publish`).

## CI Workflows

The GitHub Actions workflows are driven by Vite+; they use the `voidzero-dev/setup-vp` action (pinned to the exact release that ships with the pinned Vite+ version — never the frozen `v1` tag), which installs the `vp`/`vpr`/`vpx` binaries, the Node.js runtime, the package manager and the dependency cache.

- `.github/workflows/ci.yml` — runs on pushes and pull requests; `vpr lint`, `vpr build` and `vpr test` (with `vp exec playwright install` for the browsers), then uploads the coverage report to Coveralls.
- `.github/workflows/publish.yml` — runs on a published GitHub Release; sets up Deno as well, then publishes to npm with `vp pm publish` (provenance, `--ignore-scripts` so the release is built from the committed sources instead of the `prepublishOnly` dependency bump) and to JSR with `deno publish --allow-dirty` (the build step regenerates the committed `dist/` and `docs/` artifacts).
- `.github/workflows/codeql.yml` — CodeQL analysis; the build step uses `vpr build` so the job has the same toolchain as the other workflows.

Keep the `paths` filters of all three workflows in sync when adding a file that affects the build, the tests or the toolchain.

## Project Structure

- `src/index.ts` — the entire library (single file, ~1200 lines). The `CSSMatrix` class plus module-level helper functions (`Translate`, `Rotate`, `fromString`, etc.). Heavily documented with JSDoc.
- `test/fixtures/index-3.0.x.ts` — snapshot of the pre-3.1.0 implementation used as the benchmark baseline by `test/dommatrix.bench.test.ts`. Excluded from coverage (see `vitest.config.ts`) and from JSR publish (only the `publish.include` files ship). Included in the `tsconfig.json` `include` so `vpr check:ts` covers it.
- `src/types.ts` — exported types (`JSONMatrix`, `Matrix`, `Matrix3d`, `PointTuple`)
- `test/dommatrix.test.ts` — the full test suite (Vitest, browser mode)
- `test/dommatrix.bench.test.ts` — benchmark vs the `test/fixtures/index-3.0.x.ts` snapshot: parity suite (every op must match the backup within `1e-9`, runs in `vp test` and gates CI) + interleaved perf suite (auto-skipped under coverage)
- `test/native.bench.test.ts` — benchmark vs native `DOMMatrix`: parity suite (22 ops at `1e-9`, runs in `vp test`) + interleaved perf suite
- `test/fixtures/bench-results.json` — last measured results, written by `scripts/update-benchmark.js`; single source of truth for the `BENCHMARK.md` tables and the README `## Benchmarks` summary
- `scripts/update-benchmark.js` — runs both bench suites (2x, ~1 min), parses the `afterAll` tables from vitest stdout, writes the fixture, rewrites the two table blocks of `BENCHMARK.md` (between the `<!-- b1 -->`/`<!-- /b1 -->` and `<!-- b2 -->`/`<!-- /b2 -->` markers, plus the `<!-- b-updated -->` date stamp) and regenerates the README `## Benchmarks` summary
- `BENCHMARK.md` — the full benchmark report (static methodology intro, `<!-- b1 -->`/`<!-- b2 -->`-marked table blocks, static conclusion); only the marked blocks are regenerated by `vpr bench:docs`
- `test/fixtures/` — test helpers, sample data, and the bench-results fixture
- `docs/` — GitHub Pages demo; `docs/dommatrix.js` is a build artifact copied from `dist/`
- `dist/` — build output, committed to the repo; regenerate with `vp build`, never edit by hand
- `experiments/` — archived Cypress experiments (not part of the build)

## Code Conventions

- **Single default export**: `export default class CSSMatrix` — there are no runtime named exports. The helper types (`Matrix`, `Matrix3d`, `JSONMatrix`, `PointTuple`, `CSSMatrixInput`) are re-exported from `./types.ts` as type-only exports (`export type { ... } from "./types.ts"`)
- **Style**: Deno-style — no semicolons, double quotes, 2-space indent, trailing commas. `deno lint` and `deno fmt src` enforce this; do not fight the formatter
- **No comments unless they are JSDoc** — the codebase uses JSDoc extensively on public API, matching the existing style
- **Naming**: `m11`-`m44` are the canonical 3D values; `a`-`f` are the 2D aliases (getters/setters sync both)
- **API design**: mirrors native `DOMMatrix` — immutable methods (`translate()`, `rotate()`, `scale()`, `skew()`, `multiply()`) return new matrices; `*Self` variants mutate and return `this`. Static helpers (`fromString`, `fromArray`, `fromMatrix`, `Translate`, `Rotate`, ...) live on the class as static properties
- **Error style**: throw `TypeError` with messages prefixed `CSSMatrix: ...` (tests assert on exact messages)
- **`is2D`/`isIdentity`** are computed getters (from matrix values), not construction-time flags

## Critical Rules (do not violate)

1. **No runtime references to browser-only globals** (`DOMMatrix`, `DOMPoint`, `CSSMatrix`) without a `typeof ... !== "undefined"` guard. The library must work in Node.js where these globals do not exist. The `instanceof` guards in `isCompatibleObject()` and `transformPoint()` are the canonical pattern:
   ```ts
   typeof DOMMatrix !== "undefined" && object instanceof DOMMatrix;
   ```
2. **Tests run in a browser, so a missing global guard will NOT fail tests on its own.** The test suite simulates Node.js with `vi.stubGlobal("DOMMatrix", undefined)` / `vi.stubGlobal("DOMPoint", undefined)` in the `"Node.js Environment Test"` describe block — keep that block covering any code path that touches these globals.
3. **Coverage must stay 100%** (statements, branches, functions, lines). The CI gate enforces it via istanbul. Every new branch needs a test.
4. **Do not edit `dist/` or `docs/dommatrix.js` directly** — they are build outputs; run `vpr build`.
5. **Do not add runtime dependencies.** This is a zero-dependency library; `src/` must stay import-free.
6. **Do not change the dist file names** (`dommatrix.cjs/.js/.mjs/.d.ts` + maps) — package.json `exports`, `main`, `module`, and the docs copy script depend on them.

## Releasing (patch/minor/major)

1. Bump `version` in `package.json` **and** in `deno.json`
2. Add an entry to `CHANGELOG.md` (Keep a Changelog style, date-stamped)
3. Run `vpr build && vpr lint && vpr test` and `deno publish --dry-run --allow-dirty`
4. Commit, then tag with the **bare version number** (no `v` prefix — existing tags are `1.0.0` ... `3.1.2`)

The GitHub Actions `publish.yml` workflow publishes to both npm and JSR on GitHub Release (JSR via OIDC when enabled on the scope, otherwise the `JSR_TOKEN` secret).

Note: `prepublishOnly` runs `vp up --latest` (updates all deps), `vpr format`, `vpr lint`, `vpr build` — expect dependency bumps to land in the same commit if publishing.

## Gotchas

- The build config is `tsdown.config.ts` (renamed from `tsdown.config.mts` in 3.1.2) and is wired into Vite+ through `vite.config.ts` (`pack: tsdownConfig`). The tsdown config relies on: object-form `entry` for the chunk name (`dommatrix`), an `outputOptions` override for UMD (it must spread defaults, otherwise `sourcemap` is silently dropped), and `outExtensions` to keep the `.d.ts` filename. `package.json` declares `"type": "module"`; `require()` still works because the `exports` map points at the explicit `.cjs` / `.mjs` files
- With `deno.json` present, `deno lint` enforces `verbatim-module-syntax` — type-only imports (like `import type CSSMatrix from "."` in `src/types.ts`) must use `import type`
- Vitest runs only in browser mode; any Node-only concern (globals, `require()`, `process`) needs the stubbed-global test pattern
- **Browser `console.table` is NOT forwarded to the terminal** — both bench suites accumulate rows on `globalThis` (`__CSSMATRIX_BENCH__`, `__CSSMATRIX_NATIVE_BENCH__`, inspectable in `vpr test-ui` devtools) and print a pad-aligned `console.log` table in `afterAll`. `console.log` in `afterAll` _does_ forward (but only with the verbose reporter — see next bullet).
- **The `BENCHMARK.md` tables are generated** by `vpr bench:docs` (`scripts/update-benchmark.js`) from `test/fixtures/bench-results.json` — do not hand-edit the blocks between the `<!-- b1 -->`/`<!-- /b1 -->` and `<!-- b2 -->`/`<!-- /b2 -->` markers (the tables and their interpretation only), nor the `<!-- b-updated -->`/`<!-- /b-updated -->` date stamp; the intro and the closing conclusion are otherwise static. The script also regenerates the short README `## Benchmarks` summary — a "X–Yx faster" report with a last-updated line, linking to `BENCHMARK.md` — by writing between the `<!-- b-summary -->`/`<!-- /b-summary -->` markers of the section bounded by the `## Benchmarks` and `## Demo` headings (the script fails if that boundary is not found). It spawns vitest with `--reporter=verbose` (the default reporter does not forward browser `console.log`), parses the two `afterAll` tables from stdout, runs each suite twice and reports medians. Grouping thresholds: vs-3.0.x buckets at 6x / 2x / 1.12x (ratio >= 6 “Large”, >= 2 “Moderate”, >= 1.12 “Mild”, else “At parity”); native is split three-way at ±5% (the measured noise floor).
- **Bench measurements must run without coverage**: istanbul instruments `src/index.ts` but not `test/fixtures/index-3.0.x.ts`, so under coverage the current file measures 30-60% slower than an identical backup. The suites skip timing at runtime when `typeof globalThis["__VITEST_COVERAGE__"] === "object"` (the key only appears after instrumented code executes) — parity assertions still run in `vpr test`.
- **Interleaved sampling**: `bench(a, b, iterations)` warms up both implementations, then takes 2 alternating samples each and reports medians. Sequential per-implementation measurement biases toward the first implementation (~20-30%) because the second's allocations raise GC pressure. Identical files must measure ~0.92-1.09x.
- Native DOMMatrix quirks that shaped `test/native.bench.test.ts`: Chrome lacks `DOMMatrix.fromArray` (use `DOMMatrix.fromMatrix(values)`); native has no `skew()`/`skewSelf()` (only `skewX`/`skewY`); `rotateAxisAngle(x, y, z, angle)` takes the angle last; `DOMPoint` exposes `x/y/z/w` as prototype getters so `Object.keys()` is empty — extract values into a plain object before comparing; the bench test needs a long timeout (120s) because 23 interleaved cases take ~15s.
- `rotateAxisAngle`/`rotateAxisAngleSelf` throw only when any of the 4 values is non-finite; zero-length vector returns a copy (or `this` for the `Self` variant)
- `deno lint` runs on `src/` only — the `tsconfig.json` `include` is `["src/*"]`, `noEmit: true`

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Running Scripts

Run TypeScript and JavaScript files with `vpx <file>`, for example `vpx ./scripts/seed.ts --dry-run`. It handles enums, decorators, JSX, and tsconfig `paths`, so do not add `tsx` or `ts-node` to run scripts. `vpx --watch <file>` reruns the file when a file it uses changes, in place of `tsx watch`. `vp node <file>` runs plain Node.js.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
