import mongoose from 'mongoose';
import { ConsultaRepository } from '../consultaRepository';
import { conectarMongoDB } from '@/config/database';

describe('ConsultaRepository', () => {
  let repository: ConsultaRepository;
  const userId = '123e4567-e89b-12d3-a456-426614174000';

  beforeAll(async () => {
    // Conecta ao banco de dados de teste
    await conectarMongoDB();
    repository = new ConsultaRepository();
  });

  afterAll(async () => {
    // Limpa o banco de dados e fecha a conexão
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Limpa a coleção antes de cada teste
    await mongoose.connection.collection('consultas').deleteMany({});
  });

  describe('criar', () => {
    it('deve criar uma nova consulta com sucesso', async () => {
      const dados = {
        userId,
        url: 'https://exemplo.com/imovel/123'
      };

      const consulta = await repository.criar(dados);

      expect(consulta).toBeDefined();
      expect(consulta.userId).toBe(userId);
      expect(consulta.url).toBe(dados.url);
      expect(consulta.status).toBe('PENDENTE');
      expect(consulta.createdAt).toBeDefined();
      expect(consulta.updatedAt).toBeDefined();
    });

    it('deve lançar erro ao criar consulta com dados inválidos', async () => {
      const dados = {
        userId,
        url: 'url-invalida'
      };

      await expect(repository.criar(dados)).rejects.toThrow();
    });
  });

  describe('buscarPorId', () => {
    it('deve retornar consulta existente', async () => {
      const dados = {
        userId,
        url: 'https://exemplo.com/imovel/123'
      };

      const consultaCriada = await repository.criar(dados);
      const consultaEncontrada = await repository.buscarPorId(consultaCriada.id);

      expect(consultaEncontrada).toBeDefined();
      expect(consultaEncontrada?.id).toBe(consultaCriada.id);
    });

    it('deve retornar null para consulta inexistente', async () => {
      const consulta = await repository.buscarPorId('id-inexistente');
      expect(consulta).toBeNull();
    });
  });

  describe('buscarPorUsuario', () => {
    it('deve retornar lista de consultas do usuário com paginação', async () => {
      // Criar múltiplas consultas
      const consultas = await Promise.all([
        repository.criar({ userId, url: 'https://exemplo.com/imovel/1' }),
        repository.criar({ userId, url: 'https://exemplo.com/imovel/2' }),
        repository.criar({ userId, url: 'https://exemplo.com/imovel/3' })
      ]);

      const resultado = await repository.buscarPorUsuario(userId, 1, 2);

      expect(resultado.consultas).toHaveLength(2);
      expect(resultado.total).toBe(3);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar status da consulta', async () => {
      const dados = {
        userId,
        url: 'https://exemplo.com/imovel/123'
      };

      const consultaCriada = await repository.criar(dados);
      const consultaAtualizada = await repository.atualizar(consultaCriada.id, {
        status: 'CONCLUIDA',
        resultado: {
          propertyType: 'Apartamento',
          auctionType: 'Leilão',
          minBid: 'R$ 100.000,00',
          evaluatedValue: 'R$ 150.000,00',
          address: 'Rua Exemplo, 123'
        }
      });

      expect(consultaAtualizada).toBeDefined();
      expect(consultaAtualizada?.status).toBe('CONCLUIDA');
      expect(consultaAtualizada?.resultado).toBeDefined();
      expect(consultaAtualizada?.completedAt).toBeDefined();
    });
  });

  describe('buscarPendentes', () => {
    it('deve retornar apenas consultas pendentes', async () => {
      // Criar consultas com diferentes status
      await Promise.all([
        repository.criar({ userId, url: 'https://exemplo.com/imovel/1' }),
        repository.criar({ userId, url: 'https://exemplo.com/imovel/2' })
      ]);

      const consulta = await repository.criar({ userId, url: 'https://exemplo.com/imovel/3' });
      await repository.atualizar(consulta.id, { status: 'CONCLUIDA' });

      const pendentes = await repository.buscarPendentes();

      expect(pendentes).toHaveLength(2);
      expect(pendentes.every(c => c.status === 'PENDENTE')).toBe(true);
    });
  });

  describe('deletar', () => {
    it('deve realizar soft delete da consulta', async () => {
      const dados = {
        userId,
        url: 'https://exemplo.com/imovel/123'
      };

      const consultaCriada = await repository.criar(dados);
      const deletado = await repository.deletar(consultaCriada.id);

      expect(deletado).toBe(true);

      const consulta = await repository.buscarPorId(consultaCriada.id);
      expect(consulta?.status).toBe('ERRO');
      expect(consulta?.erro).toBe('Consulta removida pelo usuário');
    });
  });

  describe('buscarEstatisticas', () => {
    it('deve retornar estatísticas corretas', async () => {
      // Criar consultas com diferentes status
      await Promise.all([
        repository.criar({ userId, url: 'https://exemplo.com/imovel/1' }),
        repository.criar({ userId, url: 'https://exemplo.com/imovel/2' })
      ]);

      const consulta = await repository.criar({ userId, url: 'https://exemplo.com/imovel/3' });
      await repository.atualizar(consulta.id, { status: 'CONCLUIDA' });

      const stats = await repository.buscarEstatisticas(userId);

      expect(stats.total).toBe(3);
      expect(stats.pendentes).toBe(2);
      expect(stats.concluidas).toBe(1);
      expect(stats.comErro).toBe(0);
    });
  });
}); 