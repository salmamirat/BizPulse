const { z } = require('zod');

const chatSchema = z.object({
  message: z.string().min(1, 'Le message est obligatoire')
});

module.exports = {
  chatSchema
};
