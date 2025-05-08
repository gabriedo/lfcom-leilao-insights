import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';

interface PropertyPricingProps {
  minBid?: string | null;
  evaluatedValue?: string | null;
}

const PropertyPricing: React.FC<PropertyPricingProps> = ({
  minBid = '',
  evaluatedValue = ''
}) => {
  console.log('[PropertyPricing] Dados recebidos:', {
    minBid,
    evaluatedValue
  });

  const formatValue = (value: string | null | undefined) => {
    if (!value) return 'Valor não disponível';
    try {
      // Remove caracteres não numéricos exceto ponto e vírgula
      const cleanValue = value.replace(/[^\d.,]/g, '');
      // Converte para número
      const numericValue = parseFloat(cleanValue.replace(',', '.'));
      if (isNaN(numericValue)) return 'Valor inválido';
      return formatCurrency(numericValue);
    } catch (error) {
      console.error('Erro ao formatar valor:', error);
      return 'Erro ao formatar valor';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Lance Mínimo</h4>
            <p className="text-lg font-semibold text-primary">
              {formatValue(minBid)}
            </p>
          </div>
          {evaluatedValue && (
            <div>
              <h4 className="text-sm font-medium text-gray-900">Valor de Avaliação</h4>
              <p className="text-lg font-semibold text-gray-600">
                {formatValue(evaluatedValue)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyPricing; 