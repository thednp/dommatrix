# Benchmark

Two benchmark suites run headless Chromium via Vitest and gate CI with **parity assertions** (output must be identical within `1e-9`), while the timings are reported only:

- `pnpm bench` — `test/dommatrix.bench.test.ts`, current implementation vs a `test/fixtures/index-3.0.x.ts` snapshot of the previous series
- `pnpm bench:native` — `test/native.bench.test.ts`, current implementation vs the browser's native `DOMMatrix`

Measurements are skipped under coverage (istanbul instrumentation distorts timings) and use interleaved sampling — both implementations are alternated per sample and medians are reported, so the ratios are noise-floor-corrected (identical files measure ~0.92–1.09x). Results are also stored on `globalThis.__CSSMATRIX_BENCH__` / `__CSSMATRIX_NATIVE_BENCH__` for inspection in `pnpm test-ui` devtools, since browser `console.table` output is not forwarded to the terminal.

The tables below report the median of two interleaved runs on headless Chromium, generated with `pnpm bench:docs` into `test/fixtures/bench-results.json`. Ratios above 1 mean the shim is faster.

<!-- b-updated -->

Last updated: **2026-08-05**.

<!-- /b-updated -->

## vs 3.0.x (previous series)

Ratio = 3.1.x ops/s ÷ 3.0.x ops/s.

<!-- b1 -->

**Large wins (6.4x–91x)**:

| Operation | Ratio | Operation | Ratio |
| --- | --- | --- | --- |
| `fromMatrix` | ~6.4x | `multiply` | ~6.8x |
| `multiplySelf` | ~19x | `translate` | ~14x |
| `translateSelf` | ~51x | `scale` | ~13x |
| `scaleSelf` | ~64x | `skew` | ~13x |
| `skewSelf` | ~91x | `toJSON` | ~9.6x |

**Moderate wins (2.3x–5.2x)**:

| Operation | Ratio | Operation | Ratio |
| --- | --- | --- | --- |
| `new CSSMatrix(transform list)` | ~2.3x | `setMatrixValue (transform list)` | ~2.3x |
| `rotate` | ~5.2x | `rotateSelf` | ~4.6x |
| `rotateAxisAngle` | ~4.1x | | | |

**Mild wins (1.2x–1.5x)**:

| Operation | Ratio |
| --- | --- |
| `new CSSMatrix(matrix 2D)` | ~1.5x |
| `new CSSMatrix(matrix3d)` | ~1.2x |
| `setMatrixValue (array)` | ~1.3x |
| `toFloat32Array` | ~1.2x |

**At parity (0.97x–1.0x)** — unchanged code paths, no regression:

`new CSSMatrix()`, `fromArray`, `transformPoint`, `toString`, `is2D + isIdentity` (~0.97x–1.0x).

<!-- /b1 -->

## vs native `DOMMatrix`

Ratio = shim ops/s ÷ native ops/s.

<!-- b2 -->

**Shim faster (1.8x–162x)**:

| Operation | Ratio | Operation | Ratio |
| --- | --- | --- | --- |
| `new Matrix()` | ~162x | `new Matrix(matrix 2D)` | ~2.5x |
| `new Matrix(transform list)` | ~1.9x | `new Matrix(matrix3d)` | ~2.0x |
| `static from values` | ~7.5x | `fromMatrix` | ~3.8x |
| `setMatrixValue (transform list)` | ~3.4x | `multiply` | ~3.9x |
| `multiplySelf` | ~49x | `translate` | ~4.0x |
| `translateSelf` | ~31x | `rotate` | ~3.6x |
| `rotateSelf` | ~8.4x | `rotateAxisAngle` | ~9.6x |
| `scale` | ~3.9x | `scaleSelf` | ~37x |
| `skewX` | ~3.9x | `skewXSelf` | ~35x |
| `transformPoint` | ~12x | `toJSON` | ~2.1x |
| `is2D + isIdentity` | ~1.8x | | | |

*¹ measured as construct + `toJSON()`; native's `toJSON()` is a slow JS↔C++ bridge that dominates this row.*

**Native faster**:

| Operation | Ratio |
| --- | --- |
| `toString` | ~0.82x (native ~1.2x faster) |

**At parity** — noise-floor territory (identical files measure ~0.92–1.09x):

`toFloat32Array` (~0.97x–0.97x).

<!-- /b2 -->

The shim wins construction, mutation-heavy operations and point transforms because V8 fully optimizes the plain-JS hot paths, while native `DOMMatrix` pays a C++ call per property access and per Web IDL argument/result conversion. Native C++ wins only where the operation itself is the whole cost: serialization (`toString`).
