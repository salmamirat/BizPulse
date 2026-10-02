function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(y, m, d) {
  return `${y}-${pad(m + 1)}-${pad(d)}`;
}

export function getDatesFromPeriode(periode, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();

  if (periode === "ce_mois") {
    const lastDay = new Date(y, m + 1, 0).getDate();
    return { dateDebut: formatDate(y, m, 1), dateFin: formatDate(y, m, lastDay) };
  }

  if (periode === "mois_dernier") {
    const previous = new Date(y, m - 1, 1);
    const py = previous.getFullYear();
    const pm = previous.getMonth();
    const lastDay = new Date(y, m, 0).getDate();
    return { dateDebut: formatDate(py, pm, 1), dateFin: formatDate(py, pm, lastDay) };
  }

  return { dateDebut: null, dateFin: null };
}
