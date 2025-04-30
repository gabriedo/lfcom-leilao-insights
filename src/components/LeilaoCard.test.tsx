import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LeilaoCard } from './LeilaoCard'

describe('LeilaoCard', () => {
  const mockLeilao = {
    id: 1,
    titulo: 'Leilão Teste',
    descricao: 'Descrição do leilão teste',
    dataInicio: '2024-03-20T10:00:00',
    dataFim: '2024-03-21T10:00:00',
    valorInicial: 1000,
    valorAtual: 1500,
    status: 'ABERTO',
    imagemUrl: 'https://exemplo.com/imagem.jpg',
    categoria: 'IMOVEL',
    localizacao: 'São Paulo, SP',
    lances: [
      {
        id: 1,
        valor: 1500,
        data: '2024-03-20T11:00:00',
        usuario: {
          id: 1,
          nome: 'Usuário Teste',
          email: 'teste@exemplo.com'
        }
      }
    ]
  }

  it('deve renderizar o título do leilão', () => {
    render(<LeilaoCard leilao={mockLeilao} />)
    expect(screen.getByText('Leilão Teste')).toBeInTheDocument()
  })

  it('deve renderizar o valor atual do leilão', () => {
    render(<LeilaoCard leilao={mockLeilao} />)
    expect(screen.getByText('R$ 1.500,00')).toBeInTheDocument()
  })

  it('deve renderizar a localização do leilão', () => {
    render(<LeilaoCard leilao={mockLeilao} />)
    expect(screen.getByText('São Paulo, SP')).toBeInTheDocument()
  })

  it('deve renderizar o status do leilão', () => {
    render(<LeilaoCard leilao={mockLeilao} />)
    expect(screen.getByText('ABERTO')).toBeInTheDocument()
  })
}) 