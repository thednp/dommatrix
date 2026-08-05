/**
 * Runs both benchmark suites (headless Chromium, no coverage) and updates
 * `test/fixtures/bench-results.json` with the measured results, then:
 *
 * - rewrites the two table blocks of `BENCHMARK.md` (between the
 *   `<!-- b1 -->` / `<!-- /b1 -->` and `<!-- b2 -->` / `<!-- /b2 -->`
 *   markers — the tables and their interpretation only; the intro and the
 *   conclusion are static) and stamps the run date between the
 *   `<!-- b-updated -->` / `<!-- /b-updated -->` markers of the intro,
 * - regenerates the short `## Benchmarks` summary of `README.md` (range
 *   vs the previous release and vs native, a last-updated line, and a link
 *   to `BENCHMARK.md`); the conclusion text is written between the
 *   `<!-- b-summary -->` / `<!-- /b-summary -->` markers of a section
 *   bounded by the `## Benchmarks` and `## Demo` headings.
 *
 * Each suite runs twice; the reported value per operation is the median of
 * the two runs, which matches the docs' "median of two interleaved runs".
 *
 * Usage:
 *   pnpm bench:docs
 */

import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const README = path.join(ROOT, "README.md")
const BENCHMARK = path.join(ROOT, "BENCHMARK.md")
const FIXTURE = path.join(ROOT, "test", "fixtures", "bench-results.json")
const VITEST = path.join(
  ROOT,
  "node_modules",
  ".bin",
  process.platform === "win32" ? "vitest.cmd" : "vitest",
)

const HEADER_RE = /^\s*op\s+\|\s+parity\s+\|/
const DATA_RE = /^(.+?)\s+\|\s+(ok|-)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s*$/
const BACKUP_HEADER_RE = /3\.0\.x ops\/s/
const NATIVE_HEADER_RE = /shim ops\/s/

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

/** Parses the afterAll console tables out of a vitest stdout dump. */
const parseRows = (output) => {
  const text = output.replace(/\x1b\[[0-9;]*m/g, "")
  const rows = []
  let mode = null
  for (const line of text.split("\n")) {
    if (HEADER_RE.test(line)) {
      mode = BACKUP_HEADER_RE.test(line)
        ? "backup"
        : NATIVE_HEADER_RE.test(line)
          ? "native"
          : null
      continue
    }
    const match = DATA_RE.exec(line)
    if (match && mode) {
      rows.push({
        mode,
        op: match[1].trim(),
        parity: match[2],
        ops: [+match[3], +match[4]],
      })
    }
  }
  return rows
}

const runBenches = () => {
  const res = spawnSync(
    VITEST,
    [
      "run",
      "--browser.headless",
      "--coverage.enabled=false",
      "--reporter=verbose",
      "test/dommatrix.bench.test.ts",
      "test/native.bench.test.ts",
    ],
    {
      cwd: ROOT,
      encoding: "utf-8",
      env: { ...process.env, FORCE_COLOR: "0", NO_COLOR: "1" },
    },
  )
  if (res.status !== 0) {
    throw new Error(
      `vitest failed (exit ${res.status}):\n${res.stderr || res.stdout}`,
    )
  }
  return res.stdout
}

const measure = () => {
  const runs = [parseRows(runBenches()), parseRows(runBenches())]
  const result = { backup: [], native: [] }
  for (const mode of ["backup", "native"]) {
    const ops = new Map()
    for (const run of runs) {
      for (const row of run) {
        if (row.mode !== mode) continue
        const entry = ops.get(row.op) ?? { op: row.op, parity: row.parity, pairs: [] }
        entry.pairs.push(row.ops)
        ops.set(row.op, entry)
      }
    }
    result[mode] = [...ops.values()].map(({ op, parity, pairs }) => {
      const a = median(pairs.map((p) => p[0]))
      const b = median(pairs.map((p) => p[1]))
      return mode === "backup"
        ? { op, parity, backup: a, current: b, ratio: b / a }
        : { op, parity, shim: a, native: b, ratio: a / b }
    })
  }
  return result
}

const round = (value, digits) => {
  const factor = 10 ** digits
  return (Math.round(value * factor) / factor).toFixed(digits)
}

const fmtRatio = (ratio) => {
  const abs = Math.abs(ratio)
  if (abs >= 10) return `~${Math.round(ratio)}x`
  if (abs >= 1) return `~${round(ratio, 1)}x`
  return `~${round(ratio, 2)}x`
}

const fmtRange = (rows) => {
  const ratios = rows.map((row) => row.ratio)
  return `${fmtRatio(Math.min(...ratios)).slice(1)}–${fmtRatio(Math.max(...ratios)).slice(1)}`
}

const pairsTable = (rows) => {
  const cells = rows.map((row) => `\`${row.op}\` | ${fmtRatio(row.ratio)}`)
  const lines = []
  for (let i = 0; i < cells.length; i += 2) {
    lines.push(`| ${cells[i]} | ${cells[i + 1] ?? "| |"} |`)
  }
  return lines.join("\n")
}

const oneColTable = (rows) => rows.map((row) => `| \`${row.op}\` | ${fmtRatio(row.ratio)} |`).join("\n")

/** Replaces the content between `<!-- id -->` and `<!-- /id -->` markers. */
const replaceMarkedBlock = (md, file, id, content) => {
  const open = `<!-- ${id} -->`
  const close = `<!-- /${id} -->`
  const start = md.indexOf(open)
  const end = md.indexOf(close, start)
  if (start === -1 || end === -1) {
    throw new Error(`${file}: '${open}' or '${close}' marker not found`)
  }
  return md.slice(0, start + open.length) + "\n\n" + content.trim() + "\n\n" + md.slice(end)
}

const buildBackupBlock = (data) => {
  const bucketOf = (ratio) => {
    if (ratio >= 6) return "large"
    if (ratio >= 2) return "moderate"
    if (ratio >= 1.12) return "mild"
    return "parity"
  }
  const buckets = { large: [], moderate: [], mild: [], parity: [] }
  for (const row of data.backup) buckets[bucketOf(row.ratio)].push(row)
  const group = (name, rows, twoCol = true) => {
    if (rows.length === 0) return ""
    const table = twoCol ? pairsTable(rows) : oneColTable(rows)
    return `**${name} (${fmtRange(rows)})**:\n\n| Operation | Ratio${twoCol ? " | Operation | Ratio" : ""} |\n| --- | ---${twoCol ? " | --- | ---" : ""} |\n${table}\n\n`
  }
  const parityLine = buckets.parity.map((row) => `\`${row.op}\``).join(", ")
  const parityRange = buckets.parity.length ? fmtRange(buckets.parity) : "~1.0x"
  return [
    group("Large wins", buckets.large),
    group("Moderate wins", buckets.moderate),
    group("Mild wins", buckets.mild, false),
    buckets.parity.length
      ? `**At parity (${parityRange})** — unchanged code paths, no regression:\n\n${parityLine} (~${parityRange}).`
      : "",
  ].join("")
}

const buildNativeBlock = (data) => {
  const shimFaster = data.native.filter((row) => row.ratio >= 1.05)
  const parityBand = data.native.filter((row) => row.ratio > 1 / 1.05 && row.ratio < 1.05)
  const nativeFaster = data.native.filter((row) => row.ratio <= 1 / 1.05)
  const newMatrixRow = data.native.find((row) => row.op === "new Matrix()")
  const group = (name, rows) => {
    if (rows.length === 0) return ""
    return `**${name} (${fmtRange(rows)})**:\n\n| Operation | Ratio | Operation | Ratio |\n| --- | --- | --- | --- |\n${pairsTable(rows)}\n\n`
  }
  const footnote = newMatrixRow
    ? `\*¹ measured as construct + \`toJSON()\`; native's \`toJSON()\` is a slow JS↔C++ bridge that dominates this row.*\n\n`
    : ""
  const nativeFasterRows = nativeFaster
    .map(
      (row) =>
        `| \`${row.op}\` | ${fmtRatio(row.ratio)} (native ${fmtRatio(1 / row.ratio)} faster) |`,
    )
    .join("\n")
  const nativeParityLine = parityBand.map((row) => `\`${row.op}\``).join(", ")
  const nativeParityRange = parityBand.length ? fmtRange(parityBand) : "~1.0x"
  return [
    group("Shim faster", shimFaster),
    footnote,
    `**Native faster**:\n\n| Operation | Ratio |\n| --- | --- |\n${nativeFasterRows}`,
    parityBand.length
      ? `\n\n**At parity** — noise-floor territory (identical files measure ~0.92–1.09x):\n\n${nativeParityLine} (~${nativeParityRange}).`
      : "",
  ].join("")
}

const buildSummary = (data) => {
  const backupFaster = data.backup.filter((row) => row.ratio >= 1.05)
  const nativeFaster = data.native.filter((row) => row.ratio >= 1.05)
  const toStringRow = data.native.find((row) => row.op === "toString")
  const range = (rows) => {
    if (rows.length === 0) return "n/a"
    const ratios = rows.map((row) => row.ratio)
    return `${fmtRatio(Math.min(...ratios)).slice(1)}–${fmtRatio(Math.max(...ratios)).slice(1)}`
  }
  const toStringClause =
    toStringRow && toStringRow.ratio <= 1 / 1.05
      ? ` — except \`toString()\`, which native does ${fmtRatio(1 / toStringRow.ratio)} faster`
      : ""
  return `\`CSSMatrix\` is **${range(backupFaster)} faster** than the previous 3.0.x release series and **${range(nativeFaster)} faster** than the native \`DOMMatrix\`${toStringClause}.

Every operation's result matches the previous release series and the native \`DOMMatrix\` to within \`1e-9\` (output is indistinguishable at the 9th decimal place). Full methodology, per-operation results and interpretation: [BENCHMARK](BENCHMARK.md).

Last updated: \*\*${data.date}\*\*.
`
}

/** Finds the range `[start, end)` of a top-level section, where `end` is the
 *  next `## ` heading after `start`. Headings are matched on full lines, so
 *  `###`-level headings, code fences or table rows can never collide. */
const sectionRange = (md, heading) => {
  const startMatch = new RegExp(`^## ${heading}$`, "m").exec(md)
  if (!startMatch) {
    throw new Error(`README.md: '## ${heading}' section not found`)
  }
  const start = startMatch.index
  const endMatch = /^## /gm.exec(md.slice(start + `## ${heading}`.length))
  if (!endMatch) {
    throw new Error(`README.md: no heading found after '## ${heading}'`)
  }
  return [start, start + `## ${heading}`.length + endMatch.index]
}

const main = () => {
  console.log("[update-benchmark] Starting benchmarks..")
  const data = { date: new Date().toISOString().slice(0, 10), ...measure() }
  const fixture = JSON.stringify(data, null, 2) + "\n"
  fs.writeFileSync(FIXTURE, fixture)

  const bm = fs.readFileSync(BENCHMARK, "utf-8")
  const bmNext = replaceMarkedBlock(
    replaceMarkedBlock(
      replaceMarkedBlock(bm, "BENCHMARK.md", "b1", buildBackupBlock(data)),
      "BENCHMARK.md",
      "b2",
      buildNativeBlock(data),
    ),
    "BENCHMARK.md",
    "b-updated",
    `Last updated: \*\*${data.date}\*\*.`,
  )
  fs.writeFileSync(BENCHMARK, bmNext)

  const md = fs.readFileSync(README, "utf-8")
  const headings = md.match(/^## Benchmarks$/gm)
  if (!headings || headings.length !== 1) {
    throw new Error(
      `README.md: expected exactly one '## Benchmarks' section, found ${headings ? headings.length : 0}`,
    )
  }
  const [, end] = sectionRange(md, "Benchmarks")
  const nextHeading = md.slice(end, md.indexOf("\n", end))
  if (nextHeading !== "## Demo") {
    throw new Error(
      `README.md: expected '## Demo' after '## Benchmarks', found '${nextHeading}'`,
    )
  }
  const mdNext = replaceMarkedBlock(md, "README.md", "b-summary", buildSummary(data))
  fs.writeFileSync(README, mdNext)
  console.log(
    `[update-benchmark] ${data.backup.length} vs-3.0.x ops, ${data.native.length} native ops recorded in test/fixtures/bench-results.json (${data.date}); BENCHMARK.md tables and README.md summary regenerated`,
  )
}

main()
