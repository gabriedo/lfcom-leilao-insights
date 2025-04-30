import { z } from 'zod';

// Schema de validação para Consulta
export const ConsultaSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  url: z.string().url(),
  status: z.enum(['PENDENTE', 'EM_ANALISE', 'CONCLUIDA', 'ERRO']),
  resultado: z.object({
    propertyType: z.string(),
    auctionType: z.string(),
    minBid: z.string(),
    evaluatedValue: z.string(),
    address: z.string(),
    auctionDate: z.string().optional(),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
    documents: z.array(z.object({
      url: z.string(),
      type: z.string(),
      name: z.string()
    })).optional()
  }).optional(),
  erro: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  completedAt: z.date().optional()
});

// Tipo inferido do schema
export type Consulta = z.infer<typeof ConsultaSchema>;

// Interface para criação de nova consulta
export interface NovaConsulta {
  userId: string;
  url: string;
}

// Interface para atualização de consulta
export interface AtualizarConsulta {
  status?: Consulta['status'];
  resultado?: Consulta['resultado'];
  erro?: string;
}

// Função para criar uma nova consulta
export function criarConsulta(dados: NovaConsulta): Omit<Consulta, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    userId: dados.userId,
    url: dados.url,
    status: 'PENDENTE'
  };
}

// Função para validar uma consulta
export function validarConsulta(consulta: unknown): Consulta {
  return ConsultaSchema.parse(consulta);
}

// Função para validar uma nova consulta
export function validarNovaConsulta(dados: unknown): NovaConsulta {
  return z.object({
    userId: z.string().uuid(),
    url: z.string().url()
  }).parse(dados);
}

// Função para validar atualização de consulta
export function validarAtualizacaoConsulta(dados: unknown): AtualizarConsulta {
  return z.object({
    status: ConsultaSchema.shape.status.optional(),
    resultado: ConsultaSchema.shape.resultado.optional(),
    erro: z.string().optional()
  }).parse(dados);
} 