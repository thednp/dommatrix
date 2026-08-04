import { afterAll, describe, expect, it } from "vitest"
import CSSMatrix from "../src/index"

const median = (values: number[]): number => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

const bench = (a: () => unknown, b: () => unknown, iterations: number): [number, number] => {
  const sample = (run: () => unknown): number => {
    const start = performance.now()
    let sink: unknown
    for (let i = 0; i < iterations; i++) sink = run()
    void sink
    return iterations / ((performance.now() - start) / 1000)
  }
  sample(a)
  sample(b)
  const aSamples: number[] = []
  const bSamples: number[] = []
  for (let s = 0; s < 2; s++) {
    aSamples.push(sample(a))
    bSamples.push(sample(b))
  }
  return [median(aSamples), median(bSamples)]
}

const same = (a: unknown, b: unknown, epsilon = 1e-9): boolean => {
  if (typeof a === "number" && typeof b === "number") return Math.abs(a - b) < epsilon
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((value, index) => same(value, b[index], epsilon))
  }
  if (a !== null && b !== null && typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a).sort()
    const bk = Object.keys(b).sort()
    return (
      ak.length === bk.length &&
      ak.every((key, index) => key === bk[index] && same((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[bk[index]], epsilon))
    )
  }
  return a === b
}

interface BenchRow {
  op: string
  parity: string
  "shim ops/s": string
  "native ops/s": string
  "ratio (shim/native)": string
}

const results: BenchRow[] = []
const benchable = typeof (globalThis as Record<string, unknown>)["__VITEST_COVERAGE__"] !== "object"

interface NativeCase {
  name: string
  iterations: number
  shim: () => () => unknown
  native: () => () => unknown
  epsilon?: number
  parity?: boolean
}

const rotateList = "translate(10px,20px) rotate(30deg)"
const matrix3dList = "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,10,20,30,1)"

const cases: NativeCase[] = [
  { name: "new Matrix()", iterations: 2e5, shim: () => () => new CSSMatrix().toJSON(), native: () => () => new DOMMatrix().toJSON() },
  { name: "new Matrix(matrix 2D)", iterations: 5e4, shim: () => () => new CSSMatrix("matrix(1,0.25,-0.25,1,0,0)").toJSON(), native: () => () => new DOMMatrix("matrix(1,0.25,-0.25,1,0,0)").toJSON() },
  { name: "new Matrix(transform list)", iterations: 2e4, shim: () => () => new CSSMatrix("translate(10px,20px) rotate(45deg) scale(1.5)").toJSON(), native: () => () => new DOMMatrix("translate(10px,20px) rotate(45deg) scale(1.5)").toJSON() },
  { name: "new Matrix(matrix3d)", iterations: 5e4, shim: () => () => new CSSMatrix(matrix3dList).toJSON(), native: () => () => new DOMMatrix(matrix3dList).toJSON() },
  { name: "static from values", iterations: 5e4, shim: () => () => CSSMatrix.fromArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1]).toJSON(), native: () => () => DOMMatrix.fromMatrix({ m11: 1, m12: 0, m13: 0, m14: 0, m21: 0, m22: 1, m23: 0, m24: 0, m31: 0, m32: 0, m33: 1, m34: 0, m41: 10, m42: 20, m43: 30, m44: 1 }).toJSON() },
  { name: "fromMatrix", iterations: 5e4, shim: () => () => CSSMatrix.fromMatrix(new CSSMatrix(rotateList)).toJSON(), native: () => () => DOMMatrix.fromMatrix(new DOMMatrix(rotateList)).toJSON() },
  { name: "multiply", iterations: 5e4, shim: () => () => new CSSMatrix("rotate(30deg)").multiply(new CSSMatrix("translate(10px,20px)")).toJSON(), native: () => () => new DOMMatrix("rotate(30deg)").multiply(new DOMMatrix("translate(10px,20px)")).toJSON() },
  { name: "multiplySelf", iterations: 5e4, shim: () => { const m = new CSSMatrix("rotate(30deg)"); const t = CSSMatrix.Translate(1, 2, 3); return () => m.multiplySelf(t).toJSON() }, native: () => { const m = new DOMMatrix("rotate(30deg)"); const t = new DOMMatrix("translate3d(1px,2px,3px)"); return () => m.multiplySelf(t).toJSON() } },
  { name: "translate", iterations: 1e5, shim: () => () => new CSSMatrix("rotate(30deg)").translate(10, 20, 5).toJSON(), native: () => () => new DOMMatrix("rotate(30deg)").translate(10, 20, 5).toJSON() },
  { name: "translateSelf", iterations: 1e5, shim: () => { const m = new CSSMatrix(); return () => m.translateSelf(10, 20, 5).toJSON() }, native: () => { const m = new DOMMatrix(); return () => m.translateSelf(10, 20, 5).toJSON() } },
  { name: "rotate", iterations: 1e5, shim: () => () => new CSSMatrix("translate(10px,20px)").rotate(30, 45, 60).toJSON(), native: () => () => new DOMMatrix("translate(10px,20px)").rotate(30, 45, 60).toJSON() },
  { name: "rotateSelf", iterations: 1e5, shim: () => { const m = new CSSMatrix(); return () => m.rotateSelf(30, 45, 60).toJSON() }, native: () => { const m = new DOMMatrix(); return () => m.rotateSelf(30, 45, 60).toJSON() } },
  { name: "rotateAxisAngle", iterations: 5e4, shim: () => () => new CSSMatrix().rotateAxisAngle(1, 0, 0, 30).toJSON(), native: () => () => new DOMMatrix().rotateAxisAngle(1, 0, 0, 30).toJSON() },
  { name: "scale", iterations: 1e5, shim: () => () => new CSSMatrix("translate(10px,20px)").scale(1.5, 2, 0.5).toJSON(), native: () => () => new DOMMatrix("translate(10px,20px)").scale(1.5, 2, 0.5).toJSON() },
  { name: "scaleSelf", iterations: 1e5, shim: () => { const m = new CSSMatrix(); return () => m.scaleSelf(1.5, 2, 0.5).toJSON() }, native: () => { const m = new DOMMatrix(); return () => m.scaleSelf(1.5, 2, 0.5).toJSON() } },
  { name: "skewX", iterations: 1e5, shim: () => () => new CSSMatrix("translate(10px,20px)").skewX(30).toJSON(), native: () => () => new DOMMatrix("translate(10px,20px)").skewX(30).toJSON() },
  { name: "skewXSelf", iterations: 1e5, shim: () => { const m = new CSSMatrix(); return () => m.skewXSelf(30).toJSON() }, native: () => { const m = new DOMMatrix(); return () => m.skewXSelf(30).toJSON() } },
  { name: "transformPoint", iterations: 1e5, shim: () => () => new CSSMatrix("rotate(30deg) translate(10px,20px)").transformPoint({ x: 1, y: 2, z: 3, w: 1 }), native: () => { const m = new DOMMatrix("rotate(30deg) translate(10px,20px)"); return () => { const p = m.transformPoint({ x: 1, y: 2, z: 3, w: 1 }); return { x: p.x, y: p.y, z: p.z, w: p.w } } } },
  { name: "toJSON", iterations: 1e5, shim: () => () => new CSSMatrix(rotateList).toJSON(), native: () => () => new DOMMatrix(rotateList).toJSON() },
  { name: "toFloat32Array", iterations: 5e4, shim: () => () => Array.from(new CSSMatrix(rotateList).toFloat32Array()), native: () => () => Array.from(new DOMMatrix(rotateList).toFloat32Array()) },
  { name: "toString", iterations: 5e4, parity: false, shim: () => () => new CSSMatrix(rotateList).toString(), native: () => () => new DOMMatrix(rotateList).toString() },
  { name: "is2D + isIdentity", iterations: 1e6, shim: () => { const m = new CSSMatrix("rotate(30deg)"); return () => m.is2D || m.isIdentity }, native: () => { const m = new DOMMatrix("rotate(30deg)"); return () => m.is2D || m.isIdentity } },
]

describe("benchmark: shim vs native DOMMatrix", () => {
  it("produces results identical to the native DOMMatrix", () => {
    for (const { name, iterations, shim, native, epsilon = 1e-9, parity = true } of cases) {
      const shimRun = shim()
      const nativeRun = native()
      if (parity) {
        const ok = same(shimRun(), nativeRun(), epsilon)
        expect(ok, name).toBe(true)
      }
      results.push({
        op: name,
        parity: parity ? "ok" : "-",
        "shim ops/s": "n/a",
        "native ops/s": "n/a",
        "ratio (shim/native)": "n/a",
      })
      if (benchable) {
        const [shimOps, nativeOps] = bench(shimRun, nativeRun, iterations)
        const row = results[results.length - 1]
        row["shim ops/s"] = String(Math.round(shimOps))
        row["native ops/s"] = String(Math.round(nativeOps))
        row["ratio (shim/native)"] = (shimOps / nativeOps).toFixed(3)
        expect(shimOps).toBeGreaterThan(0)
        expect(nativeOps).toBeGreaterThan(0)
      }
    }
  }, 120000)
})

afterAll(() => {
  ;(globalThis as Record<string, unknown>)["__CSSMATRIX_NATIVE_BENCH__"] = results
  if (!benchable) {
    console.log("benchmark measurements skipped: istanbul instrumentation distorts timings; run `pnpm bench:native`")
  }
  const pad = (value: string, width: number, left = true): string =>
    left ? value.padStart(width) : value.padEnd(width)
  console.log("")
  console.log(
    [pad("op", 28, false), pad("parity", 8), pad("shim ops/s", 12), pad("native ops/s", 12), pad("ratio", 8)].join(" | "),
  )
  for (const row of results) {
    console.log(
      [pad(row.op, 28, false), pad(row.parity, 8), pad(row["shim ops/s"], 12), pad(row["native ops/s"], 12), pad(row["ratio (shim/native)"], 8)].join(" | "),
    )
  }
  console.log("")
})
