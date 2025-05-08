import React from 'react';

interface PropertyPricingProps {
  minBid?: string | number;
  evaluatedValue?: string | number;
}

export const PropertyPricing: React.FC<PropertyPricingProps> = ({ minBid, evaluatedValue }) => {
  console.log('PropertyPricing rendering with:', { minBid, evaluatedValue });
  
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
    <div className="property-pricing">
      <h3>Valor Mínimo</h3>
      <span className="price">{formatCurrency(minBid)}</span>
      {evaluatedValue && (
        <>
          <h3>Valor Avaliado</h3>
          <span className="price">{formatCurrency(evaluatedValue)}</span>
        </>
      )}
    </div>
  );
};

export default PropertyPricing; 