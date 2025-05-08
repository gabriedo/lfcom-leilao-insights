import React from 'react';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface PropertyImagesProps {
  images?: string[] | null;
  title?: string | null;
}

export const PropertyImages: React.FC<PropertyImagesProps> = ({ images = [], title = '' }) => {
  if (!images || images.length === 0) {
    return null;
  }

  const baseTitle = title || 'Imóvel';
  const filteredImages = images.filter(img => 
    !img.includes('logotipo') && 
    !img.includes('bank_icons') && 
    !img.includes('_icons')
  );

  if (filteredImages.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <Carousel className="w-full">
        <CarouselContent>
          {filteredImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-video">
                <img
                  src={image}
                  alt={`${baseTitle} - Imagem ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {filteredImages.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </Card>
  );
}; 