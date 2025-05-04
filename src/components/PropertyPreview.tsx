import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, FileText, Download, ArrowUpRight, Building2, Home, Landmark } from "lucide-react";
import { format, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ExtractedPropertyData } from "@/types/property";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Image as ImageIcon, MessageCircle } from "lucide-react";

// Função auxiliar para formatar moeda
const formatCurrency = (value: string) => {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Number(value));
  } catch {
    return value;
  }
};

interface PropertyPreviewProps {
  data: ExtractedPropertyData | null;
  isLoading?: boolean;
  error?: string | null;
  onConfirm?: () => void;
}

console.log("PropertyPreview.tsx iniciado");

export default function PropertyPreview({ data, isLoading = false, error, onConfirm }: PropertyPreviewProps) {
  console.log("PropertyPreview data:", data);
  console.log("PropertyPreview isLoading:", isLoading);
  console.log("PropertyPreview error:", error);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
        </AlertDescription>
      </Alert>
    );
  }

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

  // Função para formatar a data do leilão
  const formatAuctionDate = (dateStr?: string) => {
    if (!dateStr) return 'Não informado';
    try {
      const date = new Date(dateStr);
      if (!isValid(date)) {
        console.warn('Data inválida:', dateStr);
        return 'Data inválida';
      }
      return format(date, "PPP", { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Data inválida';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateStr;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {data.propertyType || 'Imóvel'}
        </CardTitle>
        {data.address && (
          <p className="text-sm text-muted-foreground">{data.address}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {data.images && data.images.length > 0 && (
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img 
              src={data.images[0]} 
              alt={data.propertyType || 'Imóvel'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/800x450?text=Imagem+não+disponível';
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.minBid && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Lance Mínimo</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(data.minBid)}
              </p>
            </div>
          )}
          
          {data.auctionDate && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Data do Leilão</p>
              <p className="text-lg font-medium">
                {formatDate(data.auctionDate)}
              </p>
            </div>
          )}
        </div>

        {data.description && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Descrição</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {data.description}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button 
            size="lg" 
            className="flex-1"
            onClick={onConfirm}
          >
            Consultar Imóvel
          </Button>
          
          <a
            href="https://wa.me/5511999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Precisa de ajuda?
          </a>
        </div>
      </CardContent>
    </Card>
  );
} 