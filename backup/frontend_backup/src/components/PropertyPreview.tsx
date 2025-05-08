import React from 'react';

interface PropertyPreviewProps {
  minBid?: string | number;
}

const PropertyPreview: React.FC<PropertyPreviewProps> = ({ minBid }) => {
  const formatCurrency = (value: string | number | undefined) => {
    if (!value) return 'Não informado';
    
    // Converte para número e divide por 100 para corrigir a escala
    const numericValue = Number(value) / 100;
    
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <span>
      {formatCurrency(minBid)}
    </span>
  );
};

export default PropertyPreview; 