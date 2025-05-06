import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PropertyImagesProps {
  images?: string[] | null;
  title?: string;
}

export const PropertyImages: React.FC<PropertyImagesProps> = ({ images, title }) => {
  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        <Skeleton className="w-full h-full" />
        <span className="absolute text-gray-400 text-xs">Sem imagem disponível</span>
      </div>
    );
  }
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden">
      <img
        src={images[0]}
        alt={title || 'Imagem do imóvel'}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}; 