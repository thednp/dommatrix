# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.0.5] - 2026-08-03

### Added

- JSDoc coverage for every public class member (the `m11`–`m44` and `a`–`f` properties plus all static helpers), so the generated documentation is complete.
- A `deno.json` with JSR publishing config (`@thednp/dommatrix@3.0.5`) and Deno tasks (`lint`, `check`, `format`, `doc`, `publish`) mirroring the `package.json` scripts.
- The GitHub Actions publish workflow now also publishes to JSR (`deno publish`).

### Changed

- Migrated the build from Vite + `vite-plugin-dts` to [tsdown](https://tsdown.dev) (rolldown-based). The `dist/` output files are unchanged (`dommatrix.mjs`, `dommatrix.cjs`, `dommatrix.js` UMD with the `CSSMatrix` global, plus sourcemaps), so `exports`, `main`, `module` and the `docs/` copy script keep working as-is.
- The bundled `dist/dommatrix.d.ts` now contains the full type declarations (the Vite build emitted an empty `export { }` stub).
- The helper types (`Matrix`, `Matrix3d`, `JSONMatrix`, `PointTuple`, `CSSMatrixInput`) are now exported from the package root, so `import type { Matrix } from "@thednp/dommatrix"` works.
- `src/types.ts` now uses a type-only import (`import type CSSMatrix from "."`) to satisfy `deno lint`'s `verbatim-module-syntax` rule when `deno.json` is present.

### Fixed

- `transformPoint()` no longer references the `DOMPoint` global unconditionally — calling it in Node.js previously threw a `ReferenceError`. It now falls back to a plain `{ x, y, z, w }` tuple when `DOMPoint` is unavailable.
- Initializing a matrix from a JSON object (`new CSSMatrix({...})`, `CSSMatrix.fromMatrix()`, `CSSMatrix.isCompatibleObject()`) no longer throws a `ReferenceError` in Node.js, where the `DOMMatrix` global does not exist.

### Docs

- Added `AGENTS.md` with guidance for AI agents working on this repository.
- Added this `CHANGELOG.md`.
- Added a "CSSMatrix vs native DOMMatrix" comparison section to the `README.md`.

[3.0.5]: https://github.com/thednp/dommatrix/releases/tag/3.0.5
