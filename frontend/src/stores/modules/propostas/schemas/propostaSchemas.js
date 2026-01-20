import * as yup from 'yup';

export const propostaFormSchema = yup.object({
  titulo: yup.string().trim().min(3).max(200).required('Título é obrigatório.'),
  descricao: yup.string().trim().max(5000).nullable(),

  status: yup
    .string()
    .oneOf(['rascunho', 'publicada', 'atribuida', 'encerrada'], 'Status inválido.')
    .required('Status é obrigatório.'),

  // POC: IDs como string para compatibilidade com BigInt
  id_orientador: yup.string().trim().required('ID do orientador é obrigatório.'),

  coorientadores_ids: yup.array().of(yup.string().trim()).default([]),
  alunos_ids: yup.array().of(yup.string().trim()).default([]),
  palavras_chave: yup.array().of(yup.string().trim().max(80)).default([])
});
