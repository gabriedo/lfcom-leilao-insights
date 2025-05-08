import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import PropertyPreview from '../PropertyPreview';
import { MemoryRouter } from 'react-router-dom';
import { axe, toHaveNoViolations } from 'jest-axe';
(expect as any).extend(toHaveNoViolations);

// Limpa o DOM após cada teste
afterEach(cleanup);

const baseProps = {
  id: '1',
  title: 'Apartamento Teste',
  address: 'Rua Exemplo, 123',
  city: 'São Paulo',
  state: 'SP',
  minBid: 'R$ 100.000,00',
  evaluatedValue: 'R$ 120.000,00',
  propertyType: 'Apartamento',
  auctionType: 'Judicial',
  auctionDate: '2025-05-10',
  description: 'Descrição do imóvel',
  images: ['https://img.com/1.jpg'],
  documents: [{ name: 'Edital' }],
  auctions: [{ label: '1º Leilão' }],
  extractionStatus: 'success' as 'success',
  onRefresh: vi.fn(),
};

function renderComponent(customProps = {}) {
  return render(
    <MemoryRouter>
      <PropertyPreview {...baseProps} {...customProps} />
    </MemoryRouter>
  );
}

describe('PropertyPreview (integração)', () => {
  it('renderiza corretamente com status "success"', () => {
    renderComponent();
    expect(screen.getByText('Apartamento Teste')).toBeInTheDocument();
    expect(screen.getByText('Rua Exemplo, 123')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('São Paulo') && content.includes('SP'))).toBeInTheDocument();
    expect(screen.getByText('Apartamento')).toBeInTheDocument();
    expect(screen.getByText('R$ 100.000,00')).toBeInTheDocument();
    expect(screen.getByText('R$ 120.000,00')).toBeInTheDocument();
    expect(screen.getByText('Judicial')).toBeInTheDocument();
    expect(screen.getByText('2025-05-10')).toBeInTheDocument();
    expect(screen.getByText('Descrição do imóvel')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://img.com/1.jpg');
    expect(screen.getByRole('button', { name: /consultar imóvel/i })).toBeInTheDocument();
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
  });

  it('renderiza fallback parcial com status "partial"', () => {
    renderComponent({
      extractionStatus: 'partial' as 'partial',
      title: '',
      address: '',
      city: '',
      state: '',
      minBid: '',
      evaluatedValue: '',
      propertyType: '',
      auctionType: '',
      auctionDate: '',
      description: '',
      images: [],
      documents: [],
      auctions: [],
    });
    expect(screen.getByText(/algumas informações não foram extraídas/i)).toBeInTheDocument();
    const notSpecifieds = screen.getAllByText('Não especificado');
    expect(notSpecifieds.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Parcial')).toBeInTheDocument();
    expect(screen.getByText('Sem descrição disponível')).toBeInTheDocument();
    expect(screen.getByText('Data não disponível')).toBeInTheDocument();
  });

  it('renderiza alerta de falha com status "failed"', () => {
    const onRefresh = vi.fn();
    renderComponent({ extractionStatus: 'failed' as 'failed', description: 'Erro ao extrair', onRefresh });
    expect(screen.getByText(/erro ao extrair/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /tentar novamente/i }));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('renderiza corretamente com status "fallback_used"', () => {
    renderComponent({ extractionStatus: 'fallback_used' as 'fallback_used' });
    expect(screen.getByText('Fallback')).toBeInTheDocument();
    expect(screen.getByText('Apartamento Teste')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /consultar imóvel/i })).toBeInTheDocument();
  });

  it('renderiza corretamente com props ausentes ou nulas', () => {
    renderComponent({
      id: null,
      title: null,
      address: null,
      city: null,
      state: null,
      minBid: null,
      evaluatedValue: null,
      propertyType: null,
      auctionType: null,
      auctionDate: null,
      description: null,
      images: undefined,
      documents: undefined,
      auctions: undefined,
      extractionStatus: 'success' as 'success',
      onRefresh: undefined,
    });
    const notSpecifieds = screen.getAllByText('Não especificado');
    expect(notSpecifieds.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Sem descrição disponível')).toBeInTheDocument();
    expect(screen.getByText('Data não disponível')).toBeInTheDocument();
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
  });

  it('chama onRefresh ao clicar no botão de atualizar', () => {
    const onRefresh = vi.fn();
    renderComponent({ extractionStatus: 'partial' as 'partial', onRefresh });
    const btn = screen.getByRole('button', { name: /atualizar|refresh|tentar novamente/i });
    fireEvent.click(btn);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('renderiza corretamente com snapshot', () => {
    const { asFragment } = renderComponent(baseProps);
    expect(asFragment()).toMatchSnapshot();
  });

  it('não possui violações de acessibilidade', async () => {
    const { container } = renderComponent(baseProps);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renderiza corretamente apenas com title, minBid e images', () => {
    const props = {
      title: 'Mega Leilão - Imóvel Teste',
      minBid: 'R$ 200.000,00',
      images: ['https://img.com/mega.jpg'],
      address: '',
      city: '',
      state: '',
      propertyType: '',
      evaluatedValue: '',
      auctionType: '',
      auctionDate: '',
      description: '',
      documents: [],
      auctions: [],
      extractionStatus: 'success' as const,
      id: 'mega-1',
      onRefresh: vi.fn(),
    };
    const { asFragment } = render(
      <MemoryRouter>
        <PropertyPreview {...props} />
      </MemoryRouter>
    );
    // Título e imagem devem aparecer
    expect(screen.getByText('Mega Leilão - Imóvel Teste')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://img.com/mega.jpg');
    expect(screen.getByText('R$ 200.000,00')).toBeInTheDocument();
    // Fallbacks para campos ausentes
    expect(screen.getByText('Endereço não disponível')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('Cidade não disponível') && content.includes('Estado não disponível'))).toBeInTheDocument();
    expect(screen.getAllByText('Não especificado').length).toBe(2);
    expect(screen.getByText('Não disponível')).toBeInTheDocument();
    expect(screen.getByText('Data não disponível')).toBeInTheDocument();
    expect(screen.getByText('Sem descrição disponível')).toBeInTheDocument();
    // Snapshot
    expect(asFragment()).toMatchSnapshot();
  });
}); 