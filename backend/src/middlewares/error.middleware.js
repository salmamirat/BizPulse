function errorMiddleware(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Requête invalide" });
  }

  console.error(err);
  res.status(500).json({ error: "Erreur serveur" });
}

export default errorMiddleware;

