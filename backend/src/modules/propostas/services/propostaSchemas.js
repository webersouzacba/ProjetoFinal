const { z } = require('zod');

const propostaCreateSchema = z.object({
  titulo: z.string().min(5),
  descricao_objetivos: z.string().min(10),
  status: z.enum(['rascunho', 'publicada', 'arquivada']).optional(),
  coorientadores_ids: z.array(z.string().uuid()).optional().default([]),
  alunos_ids: z.array(z.string().uuid()).optional().default([]),
  palavras_chave: z.array(z.string().min(2)).optional().default([])
});

const propostaUpdateSchema = propostaCreateSchema.partial();

module.exports = { propostaCreateSchema, propostaUpdateSchema };
