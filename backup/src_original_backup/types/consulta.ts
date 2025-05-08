// Tipos puros para uso no frontend (sem dependências de Mongoose)

export type ConsultaStatus = 'PENDENTE' | 'EM_ANALISE' | 'CONCLUIDA' | 'ERRO';

export interface Consulta {
  id: string;
  userId: string;
  url: string;
  status: ConsultaStatus;
  resultado?: {
    propertyType?: string;
    auctionType?: string;
    minBid?: string;
    evaluatedValue?: string;
    address?: string;
    auctionDate?: string;
    description?: string;
    images?: string[];
    documents?: {
      url: string;
      type: string;
      name: string;
    }[];
  };
  erro?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface NovaConsulta {
  userId: string;
  url: string;
}

export interface AtualizarConsulta {
  status?: ConsultaStatus;
  resultado?: Consulta['resultado'];
  erro?: string;
} 