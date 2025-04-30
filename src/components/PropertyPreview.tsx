import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, FileText, Download, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PropertyPreviewProps {
  data: {
    propertyType: string;
    auctionType: string;
    minBid: string;
    evaluatedValue: string;
    address: string;
    auctionDate?: string;
    description?: string;
    images?: string[];
    documents?: {
      url: string;
      type: string;
      name: string;
    }[];
  };
}

export default function PropertyPreview({ data }: PropertyPreviewProps) {
  // Função para formatar o tipo de imóvel
  const formatPropertyType = (type: string) => {
    const types: { [key: string]: string } = {
      'apartment': 'Apartamento',
      'house': 'Casa',
      'commercial': 'Comercial',
      'land': 'Terreno',
      'rural': 'Rural'
    };
    return types[type] || type;
  };

  // Função para formatar o tipo de leilão
  const formatAuctionType = (type: string) => {
    const types: { [key: string]: string } = {
      'judicial': 'Leilão Judicial',
      'extrajudicial': 'Leilão Extrajudicial',
      'bank': 'Venda Direta (Banco)',
      'other': 'Outro'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Imagens do imóvel */}
      {data.images && data.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.images.map((image, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Imagem ${index + 1} do imóvel`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Informações principais */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">
              {formatPropertyType(data.propertyType)}
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              {formatAuctionType(data.auctionType)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Lance Mínimo</p>
              <p className="text-2xl font-bold text-primary">
                {data.minBid || 'Não informado'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Valor de Avaliação</p>
              <p className="text-2xl font-bold">
                {data.evaluatedValue || 'Não informado'}
              </p>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-2">
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">Endereço</span>
            </div>
            <p className="text-lg">{data.address || 'Não informado'}</p>
          </div>

          {/* Data do leilão */}
          {data.auctionDate && (
            <div className="space-y-2">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="text-sm">Data do Leilão</span>
              </div>
              <p className="text-lg">
                {format(new Date(data.auctionDate), "PPP", { locale: ptBR })}
              </p>
            </div>
          )}

          {/* Descrição */}
          {data.description && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Descrição</p>
              <p className="text-lg">{data.description}</p>
            </div>
          )}

          {/* Documentos */}
          {data.documents && data.documents.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Documentos</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.documents.map((doc, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={doc.url} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      {doc.name}
                      <Download className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 