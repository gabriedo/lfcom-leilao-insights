import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface PropertyPricingProps {
    minBid?: number;
    evaluatedValue?: number;
    auctionDate?: string;
}

export const PropertyPricing: React.FC<PropertyPricingProps> = ({
    minBid,
    evaluatedValue,
    auctionDate
}) => {
    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Informações do Leilão</h3>
            
            <div className="space-y-3">
                {minBid && (
                    <div>
                        <span className="text-gray-600">Lance Mínimo:</span>
                        <span className="ml-2 font-medium">{formatCurrency(minBid)}</span>
                    </div>
                )}
                
                {evaluatedValue && (
                    <div>
                        <span className="text-gray-600">Valor Avaliado:</span>
                        <span className="ml-2 font-medium">{formatCurrency(evaluatedValue)}</span>
                    </div>
                )}
                
                {auctionDate && (
                    <div>
                        <span className="text-gray-600">Data do Leilão:</span>
                        <span className="ml-2 font-medium">
                            {new Date(auctionDate).toLocaleDateString('pt-BR')}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}; 