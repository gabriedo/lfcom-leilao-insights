import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building2, Home, Landmark, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PropertyPreviewProps {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  minBid: string;
  evaluatedValue: string;
  propertyType: string;
  auctionType: string;
  auctionDate: string;
  description: string;
  images: string[];
  documents: any[];
  auctions: any[];
  extractionStatus?: 'success' | 'fallback_used' | 'partial' | 'failed';
  onRefresh?: () => void;
}

const statusColors = {
  success: 'default',
  fallback_used: 'secondary',
  partial: 'outline',
  failed: 'destructive'
} as const;

const statusLabels = {
  success: 'Sucesso',
  fallback_used: 'Fallback',
  partial: 'Parcial',
  failed: 'Falha'
} as const;

const PropertyPreview: React.FC<PropertyPreviewProps> = ({
  id,
  title,
  address,
  city,
  state,
  minBid,
  evaluatedValue,
  propertyType,
  auctionType,
  auctionDate,
  description,
  images,
  documents,
  auctions,
  extractionStatus = 'success',
  onRefresh
}) => {
  const getPropertyTypeIcon = () => {
    switch (propertyType.toLowerCase()) {
      case "apartment":
        return <Building2 className="h-4 w-4" />;
      case "house":
        return <Home className="h-4 w-4" />;
      case "commercial":
        return <Landmark className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const getPropertyTypeLabel = () => {
    switch (propertyType.toLowerCase()) {
      case "apartment":
        return "Apartamento";
      case "house":
        return "Casa";
      case "commercial":
        return "Comercial";
      case "land":
        return "Terreno";
      default:
        return propertyType || "Não especificado";
    }
  };

  if (extractionStatus === 'failed') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {description}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">
          {title || "Imóvel sem título"}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {extractionStatus && (
            <Badge
              variant={statusColors[extractionStatus]}
            >
              {statusLabels[extractionStatus]}
            </Badge>
          )}
          {onRefresh && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              title="Atualizar dados"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {images.length > 0 && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informações Básicas</h3>
            <div className="space-y-2">
              <p><strong>Endereço:</strong> {address || "Endereço não disponível"}</p>
              <p><strong>Cidade:</strong> {city || "Cidade não disponível"} - {state || "Estado não disponível"}</p>
              <p><strong>Tipo:</strong> {getPropertyTypeLabel()}</p>
              <p><strong>Lance Mínimo:</strong> {minBid || "R$ 0,00"}</p>
              <p><strong>Valor Avaliado:</strong> {evaluatedValue || "Não disponível"}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Informações do Leilão</h3>
            <div className="space-y-2">
              <p><strong>Tipo de Leilão:</strong> {auctionType || "Não especificado"}</p>
              <p><strong>Data do Leilão:</strong> {auctionDate || "Data não disponível"}</p>
              <p><strong>Documentos:</strong> {documents.length} disponíveis</p>
              <p><strong>Lances:</strong> {auctions.length} registrados</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Descrição</h3>
          <p className="text-gray-600">{description || "Sem descrição disponível"}</p>
        </div>
        <Link to={`/property/${id}`}>
          <Button
            size="lg" 
            className="flex-1 w-full"
          >
            Consultar Imóvel
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PropertyPreview; 