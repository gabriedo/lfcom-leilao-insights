console.log("services/consultaService.ts iniciado");

import { Consulta, NovaConsulta, AtualizarConsulta } from '@/models/Consulta';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

export const consultaService = {
  // Criar nova consulta
  async criar(dados: NovaConsulta): Promise<Consulta> {
    try {
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

      const consulta = await response.json();
      return consulta;
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      throw error;
    }
  },

  // Buscar consulta por ID
  async buscarPorId(id: string): Promise<Consulta | null> {
    try {
      const response = await fetch(`${API_URL}/api/consultas/${id}`);

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar consulta');
      }

      const consulta = await response.json();
      return consulta;
    } catch (error) {
      console.error('Erro ao buscar consulta:', error);
      throw error;
    }
  },

  // Buscar consultas por usuário
  async buscarPorUsuario(userId: string, pagina: number = 1, limite: number = 10): Promise<{ consultas: Consulta[], total: number }> {
    try {
      const response = await fetch(
        `${API_URL}/api/consultas?userId=${userId}&pagina=${pagina}&limite=${limite}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar consultas');
      }

      const resultado = await response.json();
      
      // Verifica se o resultado tem a estrutura esperada
      if (!resultado || !Array.isArray(resultado.consultas)) {
        throw new Error('Resposta inválida do servidor');
      }

      return {
        consultas: resultado.consultas,
        total: resultado.total || 0
      };
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      throw error;
    }
  },

  // Atualizar consulta
  async atualizar(id: string, dados: AtualizarConsulta): Promise<Consulta | null> {
    try {
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

      const consulta = await response.json();
      return consulta;
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
      throw error;
    }
  },

  // Deletar consulta
  async deletar(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/api/consultas/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar consulta');
      }

      return true;
    } catch (error) {
      console.error('Erro ao deletar consulta:', error);
      throw error;
    }
  },

  // Buscar estatísticas
  async buscarEstatisticas(userId: string): Promise<{
    total: number;
    pendentes: number;
    concluidas: number;
    comErro: number;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/consultas/estatisticas?userId=${userId}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas');
      }

      const resultado = await response.json();
      
      // Verifica se o resultado tem a estrutura esperada
      if (!resultado || typeof resultado !== 'object') {
        throw new Error('Resposta inválida do servidor');
      }

      return {
        total: resultado.total || 0,
        pendentes: resultado.pendentes || 0,
        concluidas: resultado.concluidas || 0,
        comErro: resultado.comErro || 0
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}; 