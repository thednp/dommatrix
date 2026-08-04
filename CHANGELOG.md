# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Measured performance deltas (vs `3.0.7` snapshot, Chromium, `pnpm bench`; ops/s ratios are noise-floor-corrected via interleaved sampling): `multiplySelf` ~17–18x, `scale` ~13x, `skew` ~6–14x, `translate` ~6.5–13x, `multiply` ~7x, `fromMatrix` ~7–7.6x, `rotate` ~5–5.6x, `rotateAxisAngle` ~4.1–4.5x, `toJSON` ~9.7–10.1x, `new CSSMatrix(transform list)` ~1.9–2.4x; unchanged code paths (`new CSSMatrix()`, `fromArray`, `transformPoint`, `toString`, `is2D`/`isIdentity`) measure ~0.96–1.1x.
- vs native `DOMMatrix` (`pnpm bench:native`, Chromium): the shim is faster on construction and mutation-heavy operations (e.g. `multiplySelf` ~48x, `translateSelf` ~28x, `scaleSelf` ~36x, `multiply` ~4x — largely native's Web IDL per-property access and `toJSON()` overhead), while native wins the pure-compute cases: `transformPoint` ~0.36x and `toString` ~0.84x (shim/native ratios); `toFloat32Array` is at parity.

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
