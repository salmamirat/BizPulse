import { z } from "zod";

const idSchema = z.string().uuid();

function validateId(req, res, next) {
  if (!idSchema.safeParse(req.params.id).success) {
    return res.status(400).json({ error: "ID invalide" });
  }

  next();
}

export default validateId;