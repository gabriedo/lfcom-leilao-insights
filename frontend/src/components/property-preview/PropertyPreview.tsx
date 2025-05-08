import React from 'react';
import { PropertyHeader } from './PropertyHeader';
import { PropertyImages } from './PropertyImages';
import { PropertyLocation } from './PropertyLocation';
import { PropertyPricing } from './PropertyPricing';
import { PropertyExtras } from './PropertyExtras';
import './PropertyPreview.css';

// Dados de exemplo para visualização
const mockProperty = {
  title: 'Apartamento em São Paulo',
  propertyType: 'Apartamento',
  address: 'Rua Augusta, 123',
  city: 'São Paulo',
  state: 'SP',
  images: [
    'https://placehold.co/600x400/jpeg?text=Im%C3%B3vel',
    'https://placehold.co/600x400/jpeg?text=Sala',
    'https://placehold.co/600x400/jpeg?text=Cozinha',
    'https://placehold.co/600x400/jpeg?text=Quarto'
  ],
  minBid: 250000,
  evaluatedValue: 320000,
  auctionDate: '2024-11-15',
  description: 'Apartamento com 2 quartos, sala, cozinha e banheiro em excelente localização no centro de São Paulo. Imóvel em leilão da Caixa Econômica Federal.',
  documents: ['Edital', 'Matrícula', 'Avaliação']
};

export const PropertyPreview: React.FC = () => {
  return (
    <div className="property-preview-container">
      <h1>Análise de Imóvel em Leilão</h1>
      
      <div className="property-content">
        <PropertyHeader 
          title={mockProperty.title} 
          propertyType={mockProperty.propertyType} 
        />
        
        <PropertyImages 
          images={mockProperty.images} 
        />
        
        <div className="property-details-grid">
          <div>
            <PropertyLocation 
              address={mockProperty.address}
              city={mockProperty.city}
              state={mockProperty.state}
              propertyType={mockProperty.propertyType}
            />
          </div>
          
          <div>
            <PropertyPricing 
              minBid={mockProperty.minBid}
              evaluatedValue={mockProperty.evaluatedValue}
              auctionDate={mockProperty.auctionDate}
            />
          </div>
        </div>
        
        <PropertyExtras 
          description={mockProperty.description}
          documents={mockProperty.documents}
          auctionDate={mockProperty.auctionDate}
        />
      </div>
    </div>
  );
}; 