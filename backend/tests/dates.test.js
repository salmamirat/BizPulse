import { test } from "node:test";
import assert from "node:assert";
import { getDatesFromPeriode } from "../src/ai/dates.js";

test("ce_mois", () => {
  const result = getDatesFromPeriode("ce_mois", new Date(2026, 8, 15));
  assert.strictEqual(result.dateDebut, "2026-09-01");
  assert.strictEqual(result.dateFin, "2026-09-30");
});

test("mois_dernier", () => {
  const result = getDatesFromPeriode("mois_dernier", new Date(2026, 0, 10));
  assert.strictEqual(result.dateDebut, "2025-12-01");
  assert.strictEqual(result.dateFin, "2025-12-31");
});

test("tout", () => {
  const result = getDatesFromPeriode("tout");
  assert.strictEqual(result.dateDebut, null);
  assert.strictEqual(result.dateFin, null);
});
