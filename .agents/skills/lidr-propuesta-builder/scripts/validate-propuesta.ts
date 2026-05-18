#!/usr/bin/env tsx
/**
 * validate-propuesta.ts — Propuesta Builder Validator
 *
 * Validates that the three JSONs produced by the propuesta-builder skill conform to
 * the canonical Zod schemas in src/data/schemas/propuesta-schema.ts.
 *
 * Validates per file:
 *   - JSON parses
 *   - Schema validation succeeds (Zod errors reported with paths)
 *   - Cross-checks:
 *       diagnostico.json → painPoints non-empty, summary lists ≥1 item each
 *       mejoras.json     → fases sorted by phaseNumber 1→8, gate mapping correct
 *       flujo.json       → every edge source/target is a node id, no duplicate node ids
 *
 * Usage:
 *   npx tsx .claude/skills/propuesta-builder/scripts/validate-propuesta.ts <clientId>
 *
 * Examples:
 *   npx tsx .claude/skills/propuesta-builder/scripts/validate-propuesta.ts aramis
 *   npx tsx .claude/skills/propuesta-builder/scripts/validate-propuesta.ts docline
 *
 * Exit codes: 0 = all valid, 1 = at least one error.
 */

import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  validateDiagnostico,
  validateMejoras,
  validateFlujo,
  type Diagnostico,
  type Mejoras,
  type Flujo,
} from "../../../../src/data/schemas/propuesta-schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "../../../..");

interface CheckResult {
  readonly file: string;
  readonly ok: boolean;
  readonly errors: string[];
  readonly skipped?: boolean;
}

function check(label: string, file: string, run: () => string[]): CheckResult {
  if (!existsSync(file)) {
    return { file: label, ok: true, errors: [], skipped: true };
  }
  try {
    const errs = run();
    return { file: label, ok: errs.length === 0, errors: errs };
  } catch (e) {
    return {
      file: label,
      ok: false,
      errors: [e instanceof Error ? e.message : String(e)],
    };
  }
}

function checkDiagnostico(filePath: string): string[] {
  const raw = JSON.parse(readFileSync(filePath, "utf-8"));
  const r = validateDiagnostico(raw);
  if (!r.success) return r.errors ?? ["schema validation failed"];
  const data = r.data as Diagnostico;
  const errs: string[] = [];
  if (data.painPoints.length === 0) errs.push("painPoints[] is empty");
  if (data.summary.fortalezas.length === 0) errs.push("summary.fortalezas[] is empty");
  if (data.summary.oportunidades.length === 0) errs.push("summary.oportunidades[] is empty");
  if (data.summary.gapsCriticos.length === 0) errs.push("summary.gapsCriticos[] is empty");
  return errs;
}

function checkMejoras(filePath: string): string[] {
  const raw = JSON.parse(readFileSync(filePath, "utf-8"));
  const r = validateMejoras(raw);
  if (!r.success) return r.errors ?? ["schema validation failed"];
  const data = r.data as Mejoras;
  const errs: string[] = [];
  const phases = data.fases.map((f) => f.phaseNumber);
  const sorted = [...phases].sort((a, b) => a - b);
  if (phases.join(",") !== sorted.join(",")) {
    errs.push(`fases not sorted by phaseNumber (got ${phases.join("→")})`);
  }
  // Expected mapping: F1→G0, F2→G1, ..., F8→G7
  for (const f of data.fases) {
    if (f.gateNumber !== undefined && f.gateNumber !== f.phaseNumber - 1) {
      errs.push(
        `fase '${f.id}' phase=${f.phaseNumber} expected gate=${f.phaseNumber - 1}, got ${f.gateNumber}`
      );
    }
  }
  return errs;
}

function checkFlujo(filePath: string): string[] {
  const raw = JSON.parse(readFileSync(filePath, "utf-8"));
  const r = validateFlujo(raw);
  if (!r.success) return r.errors ?? ["schema validation failed"];
  const data = r.data as Flujo;
  const errs: string[] = [];
  const nodeIds = new Set(data.diagram.nodes.map((n) => n.id));
  if (nodeIds.size !== data.diagram.nodes.length) {
    errs.push("diagram.nodes[] has duplicate ids");
  }
  for (const e of data.diagram.edges) {
    if (!nodeIds.has(e.source)) errs.push(`edge '${e.id}' source '${e.source}' not in nodes`);
    if (!nodeIds.has(e.target)) errs.push(`edge '${e.id}' target '${e.target}' not in nodes`);
  }
  return errs;
}

function main(): number {
  const clientId = process.argv[2];
  if (!clientId) {
    console.error(
      "Usage: npx tsx .claude/skills/propuesta-builder/scripts/validate-propuesta.ts <clientId>"
    );
    return 2;
  }

  const base = join(REPO_ROOT, "src", "data", "clients", clientId, "propuesta");
  const files: Array<[string, string, (p: string) => string[]]> = [
    ["diagnostico.json", join(base, "diagnostico.json"), checkDiagnostico],
    ["mejoras.json", join(base, "mejoras.json"), checkMejoras],
    ["flujo.json", join(base, "flujo.json"), checkFlujo],
  ];

  const results = files.map(([label, file, fn]) => check(label, file, () => fn(file)));
  let failures = 0;
  console.log(`\n=== Propuesta validation: client '${clientId}' ===`);
  for (const r of results) {
    if (r.skipped) {
      console.log(`  ⊘ ${r.file}  (not present — will use base fallback)`);
      continue;
    }
    if (r.ok) {
      console.log(`  ✅ ${r.file}`);
    } else {
      failures += 1;
      console.log(`  ❌ ${r.file}`);
      for (const e of r.errors) console.log(`     - ${e}`);
    }
  }
  console.log(
    `\n${failures === 0 ? "All present JSONs are valid." : `${failures} file(s) failed validation.`}\n`
  );
  return failures === 0 ? 0 : 1;
}

process.exit(main());
