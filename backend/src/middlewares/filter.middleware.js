const forbiddenWords = [
  "ignore tes instructions",
  "ignore les instructions",
  "ignore previous instructions",
  "ignore all instructions",
  "system prompt",
  "prompt système",
  "prompt systeme",
  "drop table",
  "delete from",
  "supprime toutes",
  "mot de passe",
  "password"
];

function filterMessage(req, res, next) {
  const message = req.body.message.toLowerCase();

  for (const word of forbiddenWords) {
    if (message.includes(word)) {
      return res.status(400).json({ error: "Demande non autorisée" });
    }
  }

  next();
}

export default filterMessage;
