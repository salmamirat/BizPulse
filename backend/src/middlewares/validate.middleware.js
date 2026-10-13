function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const errorMessage = firstIssue?.message || "Données invalides";
      return res.status(400).json({
        error: errorMessage,
        errors: result.error.issues
      });
    }

    req.body = result.data;
    next();
  };
}

export default validate;

