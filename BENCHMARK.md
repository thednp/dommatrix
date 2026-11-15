# Benchmark

Two benchmark suites run headless Chromium via Vitest and gate CI with **parity assertions** (output must be identical within `1e-9`), while the timings are reported only:

- `pnpm bench` — `test/dommatrix.bench.test.ts`, current implementation vs a `test/fixtures/index-3.0.x.ts` snapshot of the previous series
- `pnpm bench:native` — `test/native.bench.test.ts`, current implementation vs the browser's native `DOMMatrix`

Measurements are skipped under coverage (istanbul instrumentation distorts timings) and use interleaved sampling — both implementations are alternated per sample and medians are reported, so the ratios are noise-floor-corrected (identical files measure ~0.92–1.09x). Results are also stored on `globalThis.__CSSMATRIX_BENCH__` / `__CSSMATRIX_NATIVE_BENCH__` for inspection in `pnpm test-ui` devtools, since browser `console.table` output is not forwarded to the terminal.

The tables below report the median of two interleaved runs on headless Chromium, generated with `pnpm bench:docs` into `test/fixtures/bench-results.json`. Ratios above 1 mean the shim is faster.

<!-- b-updated -->

Last updated: **2026-11-15**.

<!-- /b-updated -->

## vs 3.0.x (previous series)

Ratio = 3.1.x ops/s ÷ 3.0.x ops/s.

<!-- b1 -->

**Large wins (6.3x–89x)**:

| Operation       | Ratio | Operation    | Ratio |
| --------------- | ----- | ------------ | ----- |
| `fromMatrix`    | ~6.3x | `multiply`   | ~6.9x |
| `multiplySelf`  | ~18x  | `translate`  | ~13x  |
| `translateSelf` | ~50x  | `rotateSelf` | ~13x  |
| `scale`         | ~13x  | `scaleSelf`  | ~69x  |
| `skew`          | ~13x  | `skewSelf`   | ~89x  |
| `toJSON`        | ~6.7x |              |       |     |

**Moderate wins (2.1x–5.4x)**:

| Operation                       | Ratio | Operation                         | Ratio |
| ------------------------------- | ----- | --------------------------------- | ----- |
| `new CSSMatrix(transform list)` | ~2.1x | `setMatrixValue (transform list)` | ~2.4x |
| `rotate`                        | ~5.4x | `rotateAxisAngle`                 | ~4.0x |

**Mild wins (1.2x–1.3x)**:

| Operation                  | Ratio |
| -------------------------- | ----- |
| `new CSSMatrix(matrix 2D)` | ~1.2x |
| `setMatrixValue (array)`   | ~1.3x |
| `toFloat32Array`           | ~1.3x |

**At parity (0.83x–1.1x)** — unchanged code paths, no regression:

`new CSSMatrix()`, `new CSSMatrix(matrix3d)`, `fromArray`, `transformPoint`, `toString`, `is2D + isIdentity` (~0.83x–1.1x).

<!-- /b1 -->

## vs native `DOMMatrix`

Ratio = shim ops/s ÷ native ops/s.

<!-- b2 -->

**Shim faster (1.3x–166x)**:

| Operation                         | Ratio | Operation               | Ratio |
| --------------------------------- | ----- | ----------------------- | ----- |
| `new Matrix()`                    | ~166x | `new Matrix(matrix 2D)` | ~2.2x |
| `new Matrix(transform list)`      | ~1.8x | `new Matrix(matrix3d)`  | ~1.3x |
| `static from values`              | ~8.9x | `fromMatrix`            | ~3.7x |
| `setMatrixValue (transform list)` | ~3.3x | `multiply`              | ~3.8x |
| `multiplySelf`                    | ~49x  | `translate`             | ~3.5x |
| `translateSelf`                   | ~33x  | `rotate`                | ~3.0x |
| `rotateSelf`                      | ~8.6x | `rotateAxisAngle`       | ~9.5x |
| `scale`                           | ~3.8x | `scaleSelf`             | ~35x  |
| `skewX`                           | ~3.4x | `skewXSelf`             | ~37x  |
| `transformPoint`                  | ~12x  | `toJSON`                | ~2.1x |
| `is2D + isIdentity`               | ~1.8x |                         |       |     |

_¹ measured as construct + `toJSON()`; native's `toJSON()` is a slow JS↔C++ bridge that dominates this row._

**Native faster**:

| Operation        | Ratio                        |
| ---------------- | ---------------------------- |
| `toFloat32Array` | ~0.95x (native ~1.1x faster) |
| `toString`       | ~0.82x (native ~1.2x faster) |

<!-- /b2 -->

The shim wins construction, mutation-heavy operations and point transforms because V8 fully optimizes the plain-JS hot paths, while native `DOMMatrix` pays a C++ call per property access and per Web IDL argument/result conversion. Native C++ wins only where the operation itself is the whole cost: serialization (`toString`).
