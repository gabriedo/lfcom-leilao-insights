import React from 'react';
import { Building2, Home, Landmark } from 'lucide-react';

interface PropertyLocationProps {
  address?: string | null;
  city?: string | null;
  state?: string | null;
  propertyType?: string | null;
}

const getPropertyTypeIcon = (type?: string | null) => {
  switch ((type || '').toLowerCase()) {
    case 'apartment':
    case 'apartamento':
      return <Building2 className="h-4 w-4 inline-block mr-1" />;
    case 'house':
    case 'casa':
      return <Home className="h-4 w-4 inline-block mr-1" />;
    case 'commercial':
    case 'comercial':
      return <Landmark className="h-4 w-4 inline-block mr-1" />;
    default:
      return <Home className="h-4 w-4 inline-block mr-1" />;
  }
};

const getPropertyTypeLabel = (type?: string | null) => {
  switch ((type || '').toLowerCase()) {
    case 'apartment':
    case 'apartamento':
      return 'Apartamento';
    case 'house':
    case 'casa':
      return 'Casa';
    case 'commercial':
    case 'comercial':
      return 'Comercial';
    case 'land':
    case 'terreno':
      return 'Terreno';
    default:
      return type || 'Não especificado';
  }
};

export const PropertyLocation: React.FC<PropertyLocationProps> = ({ address, city, state, propertyType }) => (
  <div className="space-y-2">
    <p><strong>Endereço:</strong> {address || 'Endereço não disponível'}</p>
    <p><strong>Cidade:</strong> {city || 'Cidade não disponível'} - {state || 'Estado não disponível'}</p>
    <p><strong>Tipo:</strong> {getPropertyTypeIcon(propertyType)}{getPropertyTypeLabel(propertyType)}</p>
  </div>
); 