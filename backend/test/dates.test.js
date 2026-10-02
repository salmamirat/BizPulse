import { test } from "node:test";
import assert from "node:assert";
import { getDatesFromPeriode } from "../src/ai/dates.js";

test("getDatesFromPeriode", () => {
  const fixedNow = new Date("2026-05-18T12:00:00Z");

  const ceMois = getDatesFromPeriode("ce_mois", fixedNow);
  assert.strictEqual(ceMois.dateDebut, "2026-05-01");
  assert.strictEqual(ceMois.dateFin, "2026-05-31");

  const moisDernier = getDatesFromPeriode("mois_dernier", fixedNow);
  assert.strictEqual(moisDernier.dateDebut, "2026-04-01");
  assert.strictEqual(moisDernier.dateFin, "2026-04-30");

  const tout = getDatesFromPeriode("tout", fixedNow);
  assert.strictEqual(tout.dateDebut, null);
  assert.strictEqual(tout.dateFin, null);
});
