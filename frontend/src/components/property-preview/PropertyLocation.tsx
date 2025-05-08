import React from 'react';
import { Building2, Home, Landmark } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyLocationProps {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  propertyType?: string | null;
}

const PropertyLocation: React.FC<PropertyLocationProps> = ({
  address = 'Endereço não disponível',
  city = 'Cidade não informada',
  state = 'Estado não informado',
  propertyType = 'Não especificado'
}) => {
  console.log('[PropertyLocation] Dados recebidos:', {
    address,
    city,
    state,
    propertyType
  });

  const getPropertyTypeIcon = () => {
    const type = propertyType?.toLowerCase() || '';
    if (type.includes('apartamento') || type.includes('apartment')) {
      return <Building2 className="h-4 w-4" />;
    }
    if (type.includes('casa') || type.includes('house')) {
      return <Home className="h-4 w-4" />;
    }
    if (type.includes('comercial') || type.includes('commercial')) {
      return <Landmark className="h-4 w-4" />;
    }
    return <Home className="h-4 w-4" />;
  };

  const getPropertyTypeLabel = () => {
    const type = propertyType?.toLowerCase() || '';
    if (type.includes('apartamento') || type.includes('apartment')) {
      return "Apartamento";
    }
    if (type.includes('casa') || type.includes('house')) {
      return "Casa";
    }
    if (type.includes('comercial') || type.includes('commercial')) {
      return "Comercial";
    }
    if (type.includes('terreno') || type.includes('land')) {
      return "Terreno";
    }
    return propertyType || "Não especificado";
  };

  const hasLocation = address && city && state;
  const locationText = hasLocation 
    ? `${address}, ${city} - ${state}`
    : 'Localização não disponível';

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {getPropertyTypeIcon()}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">
              {getPropertyTypeLabel()}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              {locationText}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyLocation; 