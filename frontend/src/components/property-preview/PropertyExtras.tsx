import React from 'react';

interface PropertyExtrasProps {
  description?: string;
  documents?: string[];
  auctionDate?: string;
}

export const PropertyExtras: React.FC<PropertyExtrasProps> = ({ 
  description, 
  documents = [], 
  auctionDate 
}) => {
  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch {
      return date;
    }
  };

  return (
    <div className="property-extras">
      {description && (
        <div className="description">
          <h3>Descrição</h3>
          <p>{description}</p>
        </div>
      )}
      
      {documents.length > 0 && (
        <div className="documents">
          <h3>Documentos</h3>
          <ul>
            {documents.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        </div>
      )}
      
      {auctionDate && (
        <div className="auction-date">
          <h3>Data do Leilão</h3>
          <p>{formatDate(auctionDate)}</p>
        </div>
      )}
    </div>
  );
};

export default PropertyExtras; 