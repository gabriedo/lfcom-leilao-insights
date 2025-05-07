import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building2, Home, Landmark, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  PropertyHeader,
  PropertyImages,
  PropertyPricing,
  PropertyLocation,
  PropertyExtras
} from './property-preview';

interface PropertyPreviewProps {
  id?: string | null;
  title: string;
  address?: string | null;
  city: string;
  state: string;
  minBid?: string | null;
  evaluatedValue: string;
  propertyType?: string | null;
  auctionType?: string | null;
  auctionDate?: string | null;
  description?: string | null;
  images?: string[] | null;
  documents?: any[] | null;
  auctions?: any[] | null;
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

const getStatusMessage = (status: string | undefined, description?: string | null) => {
  if (status === 'failed') {
    return description || 'Não foi possível extrair os dados deste imóvel. Tente novamente ou verifique a URL.';
  }
  if (status === 'partial') {
    return 'Algumas informações não foram extraídas corretamente. Confira os campos abaixo.';
  }
  return null;
};

const PropertyPreview: React.FC<PropertyPreviewProps> = (props) => {
  console.log('[PropertyPreview] Props recebidas:', {
    title: props.title,
    address: props.address,
    city: props.city,
    state: props.state,
    propertyType: props.propertyType,
    minBid: props.minBid,
    evaluatedValue: props.evaluatedValue,
    extractionStatus: props.extractionStatus,
    documents: props.documents?.length,
    auctions: props.auctions?.length
  });
  
  const {
    id = 'temp-id',
    title = 'Título não disponível',
    address = 'Endereço não disponível',
    city = 'Cidade não informada',
    state = 'Estado não informado',
    minBid = '',
    evaluatedValue = '',
    propertyType = 'Não especificado',
    auctionType = 'Leilão',
    auctionDate = '',
    description = 'Sem descrição disponível',
    images = [],
    documents = [],
    auctions = [],
    extractionStatus = 'success',
    onRefresh
  } = props;

  const statusMessage = getStatusMessage(extractionStatus, description);
  const documentCount = documents?.length ?? 0;
  const bidCount = auctions?.length ?? 0;

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

  if (extractionStatus === 'failed') {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{statusMessage}</AlertDescription>
        {onRefresh && (
          <div className="mt-2">
            <Button variant="outline" onClick={onRefresh}>Tentar novamente</Button>
          </div>
        )}
      </Alert>
    );
  }

  console.log('[PropertyPreview] Renderizando com dados:', {
    title,
    address,
    city,
    state,
    propertyType,
    minBid,
    evaluatedValue,
    documentCount,
    bidCount
  });

  return (
    <Card className="w-full">
      <PropertyHeader 
        title={title} 
        extractionStatus={extractionStatus} 
        onRefresh={onRefresh} 
      />
      <CardContent className="space-y-6">
        {statusMessage && extractionStatus === 'partial' && (
          <Alert variant="default" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        )}
        <PropertyImages images={images} title={title} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Informações Básicas</h3>
            <PropertyLocation 
              address={address} 
              city={city} 
              state={state} 
              propertyType={propertyType} 
            />
            <Separator className="my-2" />
            <PropertyPricing minBid={minBid} evaluatedValue={evaluatedValue} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Informações do Leilão</h3>
            <div className="space-y-2">
              <p><strong>Tipo de Leilão:</strong> {auctionType}</p>
              <p><strong>Data do Leilão:</strong> {auctionDate || 'Data não disponível'}</p>
            </div>
            <Separator className="my-2" />
            <PropertyExtras documents={documents} auctions={auctions} />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Descrição</h3>
          <p className="text-gray-600">{description}</p>
        </div>
        <Link to={`/property/${id}`}>
          <Button size="lg" className="flex-1 w-full">
            Consultar Imóvel
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PropertyPreview; 