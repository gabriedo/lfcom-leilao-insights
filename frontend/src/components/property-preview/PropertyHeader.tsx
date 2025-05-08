import React from 'react';

interface PropertyHeaderProps {
  title?: string;
  propertyType?: string;
}

export const PropertyHeader: React.FC<PropertyHeaderProps> = ({ title, propertyType }) => {
  return (
    <div className="property-header">
      <h2 className="title">{title || 'Título não disponível'}</h2>
      {propertyType && <span className="property-type">{propertyType}</span>}
    </div>
  );
};

export default PropertyHeader; 