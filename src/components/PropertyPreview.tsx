import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, FileText, Download, ArrowUpRight, Building2, Home, Landmark } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExtractedPropertyData } from "@/types/property";
import { Separator } from "@/components/ui/separator";

interface PropertyPreviewProps {
  data?: ExtractedPropertyData | null;
}

console.log("PropertyPreview.tsx iniciado");

export default function PropertyPreview({ data }: PropertyPreviewProps) {
  console.log("PropertyPreview data:", data);
  if (!data) {
    return null;
  }

  const {
    propertyType = '',
    address = '',
    documents = [],
    images = []
  } = data;

  const getPropertyTypeIcon = () => {
    switch (propertyType?.toLowerCase()) {
      case "apartment":
        return <Building2 className="h-4 w-4" />;
      case "house":
        return <Home className="h-4 w-4" />;
      case "land":
        return <Landmark className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const getPropertyTypeLabel = () => {
    switch (propertyType?.toLowerCase()) {
      case "apartment":
        return "Apartamento";
      case "house":
        return "Casa";
      case "land":
        return "Terreno";
      default:
        return propertyType || "Não especificado";
    }
  };

  // Função para formatar o tipo de leilão
  const formatAuctionType = (type?: string) => {
    if (!type) return 'Não informado';
    const types: { [key: string]: string } = {
      'judicial': 'Leilão Judicial',
      'extrajudicial': 'Leilão Extrajudicial',
      'bank': 'Venda Direta (Banco)',
      'other': 'Outro'
    };
    return types[type.toLowerCase()] || type;
  };

  return (
    <div className="space-y-6">
      {/* Imagens do imóvel */}
      {images && images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={image}
                alt={`Imagem ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      )}

      {/* Informações principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getPropertyTypeIcon()}
            {getPropertyTypeLabel()}
          </CardTitle>
          {address && <p className="text-sm text-muted-foreground">{address}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {documents?.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Documentos</p>
                <div className="grid gap-2">
                  {documents.map((doc, index) => (
                    doc?.url && (
                      <div key={index} className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {doc.name || `Documento ${index + 1}`}
                        </a>
                        <Badge variant="outline" className="ml-auto">
                          {doc.type?.toUpperCase() || "PDF"}
                        </Badge>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </>
          )}

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
        </CardContent>
      </Card>
    </div>
  );
} 