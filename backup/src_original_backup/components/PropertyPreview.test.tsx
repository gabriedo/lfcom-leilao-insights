import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PropertyPreview from './PropertyPreview';

const mockProperty = {
  id: '1',
  title: 'Test Property',
  address: 'Test Address',
  city: 'Test City',
  state: 'Test State',
  minBid: 'R$ 100.000,00',
  evaluatedValue: 'R$ 200.000,00',
  propertyType: 'Casa',
  auctionType: 'Leilão',
  auctionDate: '2024-03-20',
  description: 'Test Description',
  images: ['test-image.jpg'],
  documents: [],
  auctions: [],
  extractionStatus: 'success' as const
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PropertyPreview', () => {
  it('renders property data correctly', () => {
    renderWithRouter(<PropertyPreview {...mockProperty} />);
    
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText(/Test Address/)).toBeInTheDocument();
    expect(screen.getByText(/Test City - Test State/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 100\.000,00/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 200\.000,00/)).toBeInTheDocument();
    expect(screen.getByText('Casa')).toBeInTheDocument();
    expect(screen.getByText('Leilão')).toBeInTheDocument();
    expect(screen.getByText('2024-03-20')).toBeInTheDocument();
  });

  it('renders fallback values when data is missing', () => {
    const propertyWithMissingData = {
      ...mockProperty,
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
      images: []
    };

    renderWithRouter(<PropertyPreview {...propertyWithMissingData} />);
    
    expect(screen.getByText('Imóvel sem título')).toBeInTheDocument();
    expect(screen.getByText(/Endereço não disponível/)).toBeInTheDocument();
    expect(screen.getByText(/Cidade não disponível - Estado não disponível/)).toBeInTheDocument();
    expect(screen.getByText(/R\$ 0,00/)).toBeInTheDocument();
    expect(screen.getByText('Não especificado')).toBeInTheDocument();
    expect(screen.getByText('Data não disponível')).toBeInTheDocument();
  });

  it('renders success status badge correctly', () => {
    renderWithRouter(<PropertyPreview {...mockProperty} extractionStatus="success" />);
    expect(screen.getByText('Sucesso')).toBeInTheDocument();
  });

  it('renders fallback status badge correctly', () => {
    renderWithRouter(<PropertyPreview {...mockProperty} extractionStatus="fallback_used" />);
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });

  it('renders partial status badge correctly', () => {
    renderWithRouter(<PropertyPreview {...mockProperty} extractionStatus="partial" />);
    expect(screen.getByText('Parcial')).toBeInTheDocument();
  });

  it('renders failed status badge correctly', () => {
    renderWithRouter(<PropertyPreview {...mockProperty} extractionStatus="failed" />);
    expect(screen.getByText('Falha')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const onRefresh = jest.fn();
    renderWithRouter(<PropertyPreview {...mockProperty} onRefresh={onRefresh} />);
    
    const refreshButton = screen.getByRole('button', { name: /atualizar dados/i });
    fireEvent.click(refreshButton);
    
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('has correct link to property details', () => {
    renderWithRouter(<PropertyPreview {...mockProperty} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/property/1');
  });
}); 