import { Consulta, NovaConsulta, AtualizarConsulta } from '@/models/Consulta';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

export const consultaService = {
  // Criar nova consulta
  async criar(dados: NovaConsulta): Promise<Consulta> {
    const response = await fetch(`${API_URL}/api/consultas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar consulta');
    }

    return response.json();
  },

  // Buscar consulta por ID
  async buscarPorId(id: string): Promise<Consulta | null> {
    const response = await fetch(`${API_URL}/api/consultas/${id}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar consulta');
    }

    return response.json();
  },

  // Buscar consultas por usuário
  async buscarPorUsuario(userId: string, pagina: number = 1, limite: number = 10): Promise<{ consultas: Consulta[], total: number }> {
    const response = await fetch(
      `${API_URL}/api/consultas?userId=${userId}&pagina=${pagina}&limite=${limite}`
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar consultas');
    }

    return response.json();
  },

  // Atualizar consulta
  async atualizar(id: string, dados: AtualizarConsulta): Promise<Consulta | null> {
    const response = await fetch(`${API_URL}/api/consultas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dados),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error('Erro ao atualizar consulta');
    }

    return response.json();
  },

  // Deletar consulta
  async deletar(id: string): Promise<boolean> {
    const response = await fetch(`${API_URL}/api/consultas/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar consulta');
    }

    return true;
  },

  // Buscar estatísticas
  async buscarEstatisticas(userId: string): Promise<{
    total: number;
    pendentes: number;
    concluidas: number;
    comErro: number;
  }> {
    const response = await fetch(`${API_URL}/api/consultas/estatisticas?userId=${userId}`);

    if (!response.ok) {
      throw new Error('Erro ao buscar estatísticas');
    }

    return response.json();
  },
}; 