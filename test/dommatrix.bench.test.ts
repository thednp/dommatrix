import { afterAll, describe, expect, it } from "vitest"
import CSSMatrix from "../src/index"
import CSSMatrixBak from "./fixtures/index-3.0.x"

type CSSMatrixCtor = typeof CSSMatrix

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
  "3.0.x ops/s": string
  "3.1.x ops/s": string
  "ratio (current/backup)": string
}

const results: BenchRow[] = []
const benchable = typeof (globalThis as Record<string, unknown>)["__VITEST_COVERAGE__"] !== "object"

interface BenchCase {
  name: string
  iterations: number
  make: (C: CSSMatrixCtor) => () => unknown
}

const cases: BenchCase[] = [
  { name: "new CSSMatrix()", iterations: 2e5, make: (C) => () => new C() },
  { name: "new CSSMatrix(matrix 2D)", iterations: 5e4, make: (C) => () => new C("matrix(1,0.25,-0.25,1,0,0)") },
  { name: "new CSSMatrix(transform list)", iterations: 2e4, make: (C) => () => new C("translate(10px,20px) rotate(45deg) scale(1.5)") },
  { name: "new CSSMatrix(matrix3d)", iterations: 5e4, make: (C) => () => new C("matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,10,20,30,1)") },
  { name: "fromArray", iterations: 5e4, make: (C) => () => C.fromArray([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 10, 20, 30, 1]) },
  { name: "fromMatrix", iterations: 5e4, make: (C) => { const m = new C(); return () => C.fromMatrix(m) } },
  { name: "setMatrixValue (array)", iterations: 5e4, make: (C) => { const m = new C(); return () => m.setMatrixValue([1, 0, 0, 1, 10, 20]) } },
  { name: "setMatrixValue (transform list)", iterations: 2e4, make: (C) => { const m = new C(); return () => m.setMatrixValue("translate(10px,20px)") } },
  { name: "multiply", iterations: 5e4, make: (C) => { const a = new C("rotate(30deg)"); const b = new C("translate(10px,20px)"); return () => a.multiply(b) } },
  { name: "multiplySelf", iterations: 5e4, make: (C) => { const m = new C("rotate(30deg)"); const t = C.Translate(1, 2, 3); return () => m.multiplySelf(t) } },
  { name: "translate", iterations: 1e5, make: (C) => { const m = new C("rotate(30deg)"); return () => m.translate(10, 20, 5) } },
  { name: "translateSelf", iterations: 1e5, make: (C) => { const m = new C(); return () => m.translateSelf(10, 20, 5) } },
  { name: "rotate", iterations: 1e5, make: (C) => { const m = new C("translate(10px,20px)"); return () => m.rotate(30, 45, 60) } },
  { name: "rotateSelf", iterations: 1e5, make: (C) => { const m = new C(); return () => m.rotateSelf(30, 45, 60) } },
  { name: "rotateAxisAngle", iterations: 5e4, make: (C) => { const m = new C(); return () => m.rotateAxisAngle(30, 1, 0, 0) } },
  { name: "scale", iterations: 1e5, make: (C) => { const m = new C("translate(10px,20px)"); return () => m.scale(1.5, 2, 0.5) } },
  { name: "scaleSelf", iterations: 1e5, make: (C) => { const m = new C(); return () => m.scaleSelf(1.5, 2, 0.5) } },
  { name: "skew", iterations: 1e5, make: (C) => { const m = new C("translate(10px,20px)"); return () => m.skew(30, 45) } },
  { name: "skewSelf", iterations: 1e5, make: (C) => { const m = new C(); return () => m.skewSelf(30, 45) } },
  { name: "transformPoint", iterations: 1e5, make: (C) => { const m = new C("rotate(30deg) translate(10px,20px)"); return () => m.transformPoint({ x: 1, y: 2, z: 3, w: 1 }) } },
  { name: "toString", iterations: 5e4, make: (C) => { const m = new C("rotate(30deg) translate(10px,20px)"); return () => m.toString() } },
  { name: "toJSON", iterations: 1e5, make: (C) => { const m = new C("rotate(30deg) translate(10px,20px)"); return () => m.toJSON() } },
  { name: "toFloat32Array", iterations: 5e4, make: (C) => { const m = new C("rotate(30deg) translate(10px,20px)"); return () => m.toFloat32Array() } },
  { name: "is2D + isIdentity", iterations: 1e6, make: (C) => { const m = new C("rotate(30deg)"); return () => m.is2D || m.isIdentity } },
]

describe("benchmark: current vs backup", () => {
  it("produces results identical to the backup implementation", () => {
    for (const { name, iterations, make } of cases) {
      const backup = make(CSSMatrixBak)
      const current = make(CSSMatrix)
      const parity = same(backup(), current())
      expect(parity, name).toBe(true)
      results.push({
        op: name,
        parity: "ok",
        "3.0.x ops/s": "n/a",
        "3.1.x ops/s": "n/a",
        "ratio (current/backup)": "n/a",
      })
      if (benchable) {
        const [backupOps, currentOps] = bench(backup, current, iterations)
        const row = results[results.length - 1]
        row["3.0.x ops/s"] = String(Math.round(backupOps))
        row["3.1.x ops/s"] = String(Math.round(currentOps))
        row["ratio (current/backup)"] = (currentOps / backupOps).toFixed(3)
        expect(backupOps).toBeGreaterThan(0)
        expect(currentOps).toBeGreaterThan(0)
      }
    }
  })
})

afterAll(() => {
  ;(globalThis as Record<string, unknown>)["__CSSMATRIX_BENCH__"] = results
  if (!benchable) {
    console.log("benchmark measurements skipped: istanbul instrumentation distorts timings; run `pnpm bench`")
  }
  const pad = (value: string, width: number, left = true): string =>
    left ? value.padStart(width) : value.padEnd(width)
  console.log("")
  console.log(
    [pad("op", 28, false), pad("parity", 8), pad("3.0.x ops/s", 12), pad("3.1.x ops/s", 12), pad("ratio", 8)].join(" | "),
  )
  for (const row of results) {
    console.log(
      [pad(row.op, 28, false), pad(row.parity, 8), pad(row["3.0.x ops/s"], 12), pad(row["3.1.x ops/s"], 12), pad(row["ratio (current/backup)"], 8)].join(" | "),
    )
  }
  console.log("")
})
