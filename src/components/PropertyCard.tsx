
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bed, Bath, Maximize2, MapPin, Tag } from "lucide-react";

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string;
  propertyType: string;
  status: string;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="overflow-hidden border-muted hover:shadow-md transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 m-3">
          <Badge 
            variant={property.status === "Desocupado" ? "default" : "outline"}
            className={property.status === "Desocupado" ? 
              "bg-green-500 hover:bg-green-500/90" : 
              "bg-white text-black hover:bg-gray-100"
            }
          >
            {property.status}
          </Badge>
        </div>
        {property.discount && (
          <div className="absolute top-0 right-0 m-3">
            <Badge 
              variant="destructive" 
              className="px-2 py-1 font-semibold"
            >
              {property.discount}% OFF
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-5">
        <div className="mb-2 flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{property.city}, {property.state}</span>
          <Badge variant="outline" className="ml-2">
            {property.propertyType}
          </Badge>
        </div>
        <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{property.address}</p>
        
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center space-x-4 text-sm">
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.bedrooms}</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.bathrooms}</span>
                </div>
              )}
              <div className="flex items-center">
                <Maximize2 className="h-4 w-4 mr-1" />
                <span>{property.area} m²</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start border-t p-5 space-y-2">
        <div className="w-full">
          {property.originalPrice ? (
            <div className="flex flex-col">
              <span className="text-sm line-through text-muted-foreground">
                De {formatCurrency(property.originalPrice)}
              </span>
              <span className="text-xl font-bold text-primary">
                Por {formatCurrency(property.price)}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold">
              {formatCurrency(property.price)}
            </span>
          )}
        </div>

        <div className="w-full flex space-x-2">
          <Button variant="outline" className="w-1/2" asChild>
            <Link to={`/imoveis-caixa/${property.id}`}>Detalhes</Link>
          </Button>
          <Button className="w-1/2" asChild>
            <Link to={`/nova-analise?propertyId=${property.id}`}>Analisar</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
