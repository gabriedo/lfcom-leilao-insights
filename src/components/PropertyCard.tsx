
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Bed, Bath, Maximize2, MapPin, Tag, Calendar, Home, Square } from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Property {
  id: string;
  url?: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  area: number;
  privateArea?: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  imageUrl: string;
  images?: string[];
  propertyType: string;
  modality: "Leilão SFI" | "Licitação Aberta" | "Venda Online" | "Venda Direta Online";
  fim_1?: string;
  fim_2?: string;
  fim_venda_online?: string;
  acceptsFinancing: boolean;
  acceptsFGTS: boolean;
  acceptsInstallments?: boolean;
  acceptsConsortium?: boolean;
  description?: string;
  observations?: string;
  registryNumber?: string;
  registryUrl?: string;
  propertyRegistration?: string;
  editalNumber?: string;
  editalUrl?: string;
  salesRulesUrl?: string;
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

  // Helper to determine the end date to show
  const getEndDate = () => {
    let date: string | undefined;
    let label: string = '';
    
    switch(property.modality) {
      case 'Leilão SFI':
        date = property.fim_2 || property.fim_1;
        label = property.fim_2 ? '2º Leilão' : '1º Leilão';
        break;
      case 'Licitação Aberta':
        date = property.fim_venda_online;
        label = 'Fim Licitação';
        break;
      case 'Venda Online':
        date = property.fim_venda_online;
        label = 'Fim Oferta';
        break;
      case 'Venda Direta Online':
        label = 'Compra Imediata';
        break;
    }

    if (date) {
      try {
        return {
          formatted: format(parseISO(date), "dd/MM/yyyy", { locale: ptBR }),
          label
        };
      } catch (e) {
        console.error("Error formatting date:", e);
        return { formatted: date, label };
      }
    }
    
    return { formatted: '', label };
  };

  const endDate = getEndDate();

  // Get modality background color
  const getModalityColor = () => {
    switch(property.modality) {
      case 'Leilão SFI':
        return "bg-amber-500 hover:bg-amber-500/90";
      case 'Licitação Aberta':
        return "bg-emerald-600 hover:bg-emerald-600/90";
      case 'Venda Online':
        return "bg-blue-500 hover:bg-blue-500/90";
      case 'Venda Direta Online':
        return "bg-purple-500 hover:bg-purple-500/90";
      default:
        return "bg-gray-500 hover:bg-gray-500/90";
    }
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
            className={getModalityColor()}
          >
            {property.modality}
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
        {endDate.formatted && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 px-3 py-1.5 flex justify-between items-center">
            <span className="text-white text-xs flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {endDate.label}
            </span>
            <span className="text-white text-xs font-semibold">
              {endDate.formatted}
            </span>
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
        
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-wrap gap-4 text-sm">
            {property.bedrooms > 0 && (
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.parking > 0 && (
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>{property.parking} vaga{property.parking > 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="flex items-center">
              <Maximize2 className="h-4 w-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {property.acceptsFinancing && (
            <Badge variant="secondary" className="text-xs">Financiamento</Badge>
          )}
          {property.acceptsFGTS && (
            <Badge variant="secondary" className="text-xs">FGTS</Badge>
          )}
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
