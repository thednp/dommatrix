# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.3] - 2026-11-14

### Fixed

- `CSSMatrix.fromString()` (and the `new CSSMatrix(string)` constructor) no longer throws `CSSMatrix: invalid transform string` when a transform function argument is `0`. The parser checked the arguments for truthiness instead of testing them for being a number, so every valid zero value was rejected: `translate(0px, 20px)`, `translateX(0px)`, `scaleX(0)`, `rotate(0deg)`, `rotateX(0deg)`, `rotate3d(0, 0, 1, 0deg)`, `skew(0deg)`, `skewX(0deg)`, `perspective(0px)`, ... All of them now produce the same matrix as the native `DOMMatrix`.
- The CSS angle units are now parsed exactly: `grad` was matched by the `rad` check (`"grad".includes("rad")`) and turned into radians, and `turn` was not converted at all — `rotate(100grad)` was parsed as 100rad and `rotate(0.25turn)` as 0.25deg. Both now convert to the correct degrees (`1grad` = `0.9deg`, `1turn` = `360deg`), so `rotate(100grad)` and `rotate(0.25turn)` both yield the 90deg rotation. The units are case-insensitive, as in CSS (`rotate(10RAD)`).
- The no-op transforms `scale(1, 1)` and `scale3d(1, 1, 1)` were rejected as invalid strings; they now return the identity matrix, like the native `DOMMatrix`.
- Transform arguments that are not numbers (`translate(10px, wombat)`, `scale(2, wombat)`, `skew(10deg, wombat)`) are now rejected with the invalid transform string error instead of being silently parsed as `0`.
- `perspective()` now matches the native `DOMMatrix`: negative lengths are rejected and the perspective length is clamped to a minimum of `1px` (`perspective(0px)` gives `m34` of `-1`).

### Dependencies

- Bump `vitest` and `@vitest/*` from `^4.1.11` to `^5.1.0`, `tsdown` from `^0.22.14` to `^0.23.7`, `playwright` from `^1.62.1` to `^1.65.1` and `@types/node` from `^26.4.1` to `^26.6.6` (with `pnpm-lock.yaml` and `deno.lock` refreshed, and `pnpm-workspace.yaml` extended with the `minimumReleaseAgeExclude` entries for `playwright@1.65.1` / `playwright-core@1.65.1`).

[3.1.3]: https://github.com/thednp/dommatrix/releases/tag/3.1.3

## [3.1.2] - 2026-09-02

### Changed

- Tooling maintenance: rename `tsdown.config.mts` → `tsdown.config.ts` and `vitest.config.mts` → `vitest.config.ts`, add `pnpm-workspace.yaml` with `minimumReleaseAgeExclude` for `@types/node`, and set `minimumDependencyAge: 0` in `deno.json`.
- Rebuild `dist/` and `docs/dommatrix.js` from the 3.1.1 sources (no runtime changes).

### Dependencies

- Bump `vitest` and `@vitest/*` from `^4.1.10` to `^4.1.11`, `@types/node` from `^26.1.2` to `^26.4.1` (with `pnpm-lock.yaml` and `deno.lock` refreshed).


## [3.1.1] - 2026-08-05

### Added

- `pnpm bench:docs` (`scripts/update-benchmark.js`): runs both bench suites twice, parses the printed tables, writes `test/fixtures/bench-results.json`, and regenerates the `BENCHMARK.md` tables and the README `## Benchmarks` summary from it — no more hand-transcribing benchmark numbers.

### Changed

- The full benchmark report moved out of the README into a dedicated `BENCHMARK.md` (static methodology intro and conclusion, with the two result tables wrapped in `<!-- b1 -->` / `<!-- /b1 -->` and `<!-- b2 -->` / `<!-- /b2 -->` markers). The README `## Benchmarks` section is now a short summary — a one-line "X–Yx faster than the previous release / than native" range plus a link to `BENCHMARK.md` — so it keeps the attention on the big picture instead of the per-operation numbers.
- `setMatrixValue()` now **mutates the matrix in place and returns `this`**, matching the native `DOMMatrix.setMatrixValue()` (previously it returned a new matrix and left the original untouched). The `fromArray()` / `fromMatrix()` value writers now accept an optional target instance, so the array / object paths of `setMatrixValue()` write straight into the existing instance instead of allocating a new one. Both benchmark suites gained `setMatrixValue()` operations to cover the new path: array and transform-list inputs against the 3.0.x snapshot, and a parity-checked transform-list case against native (the native parity suite now covers 22 operations).

### Fixed

- The native benchmark's `transformPoint` case measured asymmetric work: the shim side constructed the matrix from a transform string on every iteration while the native side reused a pre-built `DOMMatrix`. Both sides now pre-build the matrix, and the corrected measurement is ~11x shim-faster on `transformPoint` (previously reported as ~0.36x native-faster, see the 3.1.0 entry above); `test/fixtures/bench-results.json`, the `BENCHMARK.md` tables and the README `## Benchmarks` summary were regenerated with `pnpm bench:docs`.

[3.1.2]: https://github.com/thednp/dommatrix/releases/tag/3.1.2
[3.1.1]: https://github.com/thednp/dommatrix/releases/tag/3.1.1

## [3.1.0] - 2026-08-04

### Added

- A benchmark suite in `test/dommatrix.bench.test.ts` comparing the current implementation against a `test/fixtures/index-3.0.x.ts` snapshot of the previous release: a parity suite (every operation must produce output identical to the backup, within `1e-9`) and a performance suite with interleaved, median-of-2 sampling per operation. Measurements are skipped automatically under coverage (istanbul instrumentation distorts timings); run `pnpm bench`.
- A native comparison suite in `test/native.bench.test.ts` comparing the current implementation against the browser's native `DOMMatrix`: parity at `1e-9` for 21 operations plus interleaved performance measurements; run `pnpm bench:native`.
- `pnpm bench` and `pnpm bench:native` scripts. Both suites store their result tables on `globalThis.__CSSMATRIX_BENCH__` / `__CSSMATRIX_NATIVE_BENCH__` for inspection in `pnpm test-ui` devtools, and print a combined table to the terminal (browser `console.table` output is not forwarded by Vitest).

### Changed

- Major performance rework of the internal hot paths, all parity-verified against the previous release and against native `DOMMatrix`:
  - `new CSSMatrix(init)` now fast-paths string / array / typed-array / object initializers instead of round-tripping through `setMatrixValue()`, and construction is funneled through a new internal `fromValues()` factory that writes all 22 aliases in one pass (a single hidden class keeps the constructor monomorphic).
  - `CSSMatrix.fromString()` parses transform lists with a single regex iteration instead of split/filter/forEach, with equivalent strict validation of non-transform garbage.
  - `CSSMatrix.fromArray()` and `CSSMatrix.fromMatrix()` validate and destructure input directly, no intermediate `Array` copy.
  - `multiply()`/`multiplySelf()` share a new `multiplyInto()` kernel with a single 64-multiplication pass; `multiplySelf()` writes into `this` instead of allocating and spreading a result object.
  - `translate()`, `translateSelf()`, `scale()`, `scaleSelf()`, `skew()`, `skewSelf()` (plus `skewX()`/`skewY()` delegating to `skew()`) use specialized pre-multiply math instead of general matrix multiplication.
  - `toJSON()` builds the result object with explicit property writes instead of spreading `this`; `toFloat32Array()`/`toFloat64Array()` build typed arrays directly, skipping the intermediate `toArray()` allocation.
- Measured performance deltas (vs the `3.0.x` snapshot, Chromium, `pnpm bench`; ops/s ratios are noise-floor-corrected via interleaved sampling): `multiplySelf` ~17–18x, `scale` ~13x, `skew` ~6–14x, `translate` ~6.5–13x, `multiply` ~7x, `fromMatrix` ~7–7.6x, `rotate` ~5–5.6x, `rotateAxisAngle` ~4.1–4.5x, `toJSON` ~9.7–10.1x, `new CSSMatrix(transform list)` ~1.9–2.4x; unchanged code paths (`new CSSMatrix()`, `fromArray`, `transformPoint`, `toString`, `is2D`/`isIdentity`) measure ~0.96–1.1x.
- vs native `DOMMatrix` (`pnpm bench:native`, Chromium): the shim is faster on construction and mutation-heavy operations (e.g. `multiplySelf` ~48x, `translateSelf` ~28x, `scaleSelf` ~36x, `multiply` ~4x — largely native's Web IDL per-property access and `toJSON()` overhead) and on point transforms (`transformPoint` ~11x), while native wins only the serialization case: `toString` ~0.84x (shim/native ratios); `toFloat32Array` is at parity.

### Fixed

- `CSSMatrix.toArray()` remained coverage-uncovered after the typed-array paths stopped using it; the `is2D` branch is now exercised by tests again (coverage back to 100%).

[3.1.0]: https://github.com/thednp/dommatrix/releases/tag/3.1.0

## [3.0.6] - 2026-08-04
- The `README.md` now documents installing from JSR (`jsr add @thednp/dommatrix`).

## [3.0.5] - 2026-08-04

### Added

- JSDoc coverage for every public class member (the `m11`–`m44` and `a`–`f` properties plus all static helpers), so the generated documentation is complete.
- A `deno.json` for JSR publishing (`@thednp/dommatrix@3.0.5`, `exports: "./src/index.ts"`) with Deno tasks mirroring the `package.json` scripts (`test`, `test-ui`, `clean-coverage`, `lint`, `check`, `format`, `fix`, `build`, `copy-docs`), the vitest/playwright dev dependencies declared via `npm:` specifiers in `imports`, and a `publish.include` list.
- The GitHub Actions publish workflow now also publishes to JSR (`deno publish`).


### Changed

- Migrated the build from Vite + `vite-plugin-dts` to [tsdown](https://tsdown.dev) (rolldown-based). The `dist/` output files are unchanged (`dommatrix.mjs`, `dommatrix.cjs`, `dommatrix.js` UMD with the `CSSMatrix` global, plus sourcemaps), so `exports`, `main`, `module` and the `docs/` copy script keep working as-is.
- The bundled `dist/dommatrix.d.ts` now contains the full type declarations (the Vite build emitted an empty `export { }` stub).
- The helper types (`Matrix`, `Matrix3d`, `JSONMatrix`, `PointTuple`, `CSSMatrixInput`) are now exported from the package root, so `import type { Matrix } from "@thednp/dommatrix"` works.
- `src/types.ts` now uses a type-only import (`import type CSSMatrix from "."`) to satisfy `deno lint`'s `verbatim-module-syntax` rule when `deno.json` is present.
- Added `"type": "module"` to `package.json`, eliminating the Node `MODULE_TYPELESS_PACKAGE_JSON` ESM-reparse warning during builds. The `exports` map still routes `require` to the `.cjs` build, so CommonJS consumers are unaffected.
- Renamed `tsdown.config.ts` to `tsdown.config.mts` and `vitest.config.ts` to `vitest.config.mts`, explicitly marking both as ESM.

### Fixed

- `transformPoint()` no longer references the `DOMPoint` global unconditionally — calling it in Node.js previously threw a `ReferenceError`. It now falls back to a plain `{ x, y, z, w }` tuple when `DOMPoint` is unavailable.
- Initializing a matrix from a JSON object (`new CSSMatrix({...})`, `CSSMatrix.fromMatrix()`, `CSSMatrix.isCompatibleObject()`) no longer throws a `ReferenceError` in Node.js, where the `DOMMatrix` global does not exist.

### Docs

- Added `AGENTS.md` with guidance for AI agents working on this repository.
- Added this `CHANGELOG.md`.
- Added a "CSSMatrix vs native DOMMatrix" comparison section to the `README.md`.

[3.0.5]: https://github.com/thednp/dommatrix/releases/tag/3.0.5
