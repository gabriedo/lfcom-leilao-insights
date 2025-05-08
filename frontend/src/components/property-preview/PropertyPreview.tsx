import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  PropertyHeader,
  PropertyImages,
  PropertyPricing,
  PropertyLocation,
  PropertyExtras
} from './index';

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
  console.log('[PropertyPreview] props recebidas:', props);
  
  const {
    id = 'temp-id',
    title,
    address = '',
    city,
    state,
    minBid = '',
    evaluatedValue,
    propertyType = '',
    auctionType = '',
    auctionDate = '',
    description = '',
    images = [],
    documents = [],
    auctions = [],
    extractionStatus = 'success',
    onRefresh
  } = props;

  const statusMessage = getStatusMessage(extractionStatus, description);
  const documentCount = documents?.length ?? 0;
  const bidCount = auctions?.length ?? 0;

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

  return (
    <Card className="w-full">
      <PropertyHeader 
        title={title || null} 
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
        <PropertyImages 
          images={images} 
          title={title} 
        />
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
            <PropertyPricing 
              minBid={minBid} 
              evaluatedValue={evaluatedValue} 
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Informações do Leilão</h3>
            <div className="space-y-2">
              <p><strong>Tipo de Leilão:</strong> {auctionType || 'Não especificado'}</p>
              <p><strong>Data do Leilão:</strong> {auctionDate || 'Data não disponível'}</p>
            </div>
            <Separator className="my-2" />
            <PropertyExtras 
              documents={documents} 
              auctions={auctions} 
              documentCount={documentCount}
              bidCount={bidCount}
            />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Descrição</h3>
          <p className="text-gray-600">{description || 'Sem descrição disponível'}</p>
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