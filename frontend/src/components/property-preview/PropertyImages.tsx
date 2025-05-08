import React from 'react';

interface PropertyImagesProps {
  images?: string[];
}

export const PropertyImages: React.FC<PropertyImagesProps> = ({ images = [] }) => {
  if (!images.length) {
    return (
      <div className="property-images">
        <div className="no-image">Sem imagens disponíveis</div>
      </div>
    );
  }

  return (
    <div className="property-images">
      <div className="main-image">
        <img src={images[0]} alt="Imagem principal do imóvel" />
      </div>
      {images.length > 1 && (
        <div className="thumbnail-grid">
          {images.slice(1).map((image, index) => (
            <img key={index} src={image} alt={`Imagem ${index + 2} do imóvel`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyImages; 