const { z } = require('zod');

// Aceita IDs como número (coerce) ou string numérica e normaliza para string
const idSchema = z
  .union([z.coerce.number().int().positive(), z.string().regex(/^\d+$/)])
  .transform((v) => v.toString());

// Preprocess comum: suporta payload legado com "descricao" em vez de "descricao_objetivos"
function preprocessDescricao(input) {
  if (input && typeof input === 'object' && !Array.isArray(input)) {
    const obj = { ...input };
    if (
      (obj.descricao_objetivos === undefined || obj.descricao_objetivos === null) &&
      obj.descricao !== undefined &&
      obj.descricao !== null
    ) {
      obj.descricao_objetivos = obj.descricao;
    }
    return obj;
  }
  return input;
}

// ✅ Base precisa ser ZodObject para permitir .partial()
const propostaBaseSchema = z.object({
  titulo: z.string().min(5),
  descricao_objetivos: z.string().min(10),

  // Alinhado com o enum do Prisma
  status: z.enum(['rascunho', 'publicada', 'atribuida', 'encerrada']).optional(),

  // BigInt no Prisma -> validar como numérico/string e normalizar
  coorientadores_ids: z.array(idSchema).optional().default([]),
  alunos_ids: z.array(idSchema).optional().default([]),

  palavras_chave: z.array(z.string().min(2)).optional().default([])
});

// CREATE (com preprocess)
const propostaCreateSchema = z.preprocess(preprocessDescricao, propostaBaseSchema);

// UPDATE (partial aplicado no base, depois preprocess)
const propostaUpdateSchema = z.preprocess(
  preprocessDescricao,
  propostaBaseSchema.partial()
);

module.exports = { propostaCreateSchema, propostaUpdateSchema };
