import React from 'react';

interface PropertyPricingProps {
  minBid?: string | null;
  evaluatedValue?: string | null;
}

export const PropertyPricing: React.FC<PropertyPricingProps> = ({ minBid, evaluatedValue }) => (
  <div className="space-y-2">
    <p><strong>Lance Mínimo:</strong> {minBid ? minBid : 'R$ 0,00'}</p>
    <p><strong>Valor Avaliado:</strong> {evaluatedValue ? evaluatedValue : 'Não disponível'}</p>
  </div>
); 