
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Bed, Bath, Maximize2, MapPin, CalendarDays, Home, Info, Building, Star, Download, ArrowUpRight, Calendar, FileText, Square } from "lucide-react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

// Import mockProperties from ImoveisCaixa to use the same data
import { mockProperties } from "./ImoveisCaixa";

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the property in our mock data
      const foundProperty = mockProperties.find(p => p.id === id);
      
      if (!foundProperty) {
        throw new Error("Imóvel não encontrado");
      }
      
      return foundProperty;
    },
  });

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Helper to determine the auction details based on modality
  const getAuctionInfo = (property: any) => {
    switch(property.modality) {
      case 'Leilão SFI':
        return {
          title: "Leilão SFI",
          dates: [
            { label: "1º Leilão", date: property.fim_1 && formatDate(property.fim_1) },
            { label: "2º Leilão", date: property.fim_2 && formatDate(property.fim_2) }
          ],
          editalInfo: property.editalNumber && property.editalUrl ? {
            number: property.editalNumber,
            url: property.editalUrl
          } : undefined
        };
      case 'Licitação Aberta':
        return {
          title: "Licitação Aberta",
          dates: [
            { label: "Fim da Licitação", date: property.fim_venda_online && formatDate(property.fim_venda_online) }
          ],
          editalInfo: property.editalNumber && property.editalUrl ? {
            number: property.editalNumber,
            url: property.editalUrl
          } : undefined
        };
      case 'Venda Online':
        return {
          title: "Venda Online",
          dates: [
            { label: "Fim da Oferta", date: property.fim_venda_online && formatDate(property.fim_venda_online) }
          ],
          rulesInfo: property.salesRulesUrl ? {
            url: property.salesRulesUrl
          } : undefined
        };
      case 'Venda Direta Online':
        return {
          title: "Venda Direta Online (Compra Imediata)",
          rulesInfo: property.salesRulesUrl ? {
            url: property.salesRulesUrl
          } : undefined
        };
      default:
        return { title: "Informações de Venda", dates: [] };
    }
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  // Get modality badge color
  const getModalityColor = (modality: string) => {
    switch(modality) {
      case 'Leilão SFI':
        return "bg-amber-500 hover:bg-amber-500/90";
      case 'Licitação Aberta':
        return "bg-emerald-600 hover:bg-emerald-600/90";
      case 'Venda Online':
        return "bg-blue-500 hover:bg-blue-500/90";
      case 'Venda Direta Online':
        return "bg-purple-500 hover:bg-purple-500/90";
      default:
        return "";
    }
  };

  // Generate multiple images for the carousel (since we only have one in the mock data)
  const getPropertyImages = (property: any) => {
    if (property.images && property.images.length > 0) {
      return property.images;
    }
    
    // Fallback if no images array
    const images = [];
    for (let i = 0; i < 5; i++) {
      // Append a random query param to get different images
      images.push(`${property.imageUrl}?random=${i}`);
    }
    return images;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Imóvel não encontrado</h2>
            <p className="mb-6">O imóvel que você está procurando não foi encontrado.</p>
            <Button asChild>
              <Link to="/imoveis-caixa">Voltar para listagem</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const imageUrls = getPropertyImages(property);
  const auctionInfo = getAuctionInfo(property);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm mb-6">
          <Link to="/" className="text-muted-foreground hover:text-primary">Home</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <Link to="/imoveis-caixa" className="text-muted-foreground hover:text-primary">Imóveis Caixa</Link>
          <span className="mx-2 text-muted-foreground">/</span>
          <span className="text-foreground">{property.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details Section */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <Badge className={getModalityColor(property.modality)}>
                {property.modality}
              </Badge>
              <Badge variant="outline">{property.propertyType}</Badge>
              {property.acceptsFinancing && (
                <Badge variant="secondary">Aceita Financiamento</Badge>
              )}
              {property.acceptsFGTS && (
                <Badge variant="secondary">Aceita FGTS</Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">{property.address}</p>
            
            <div className="flex items-center mb-6">
              <MapPin className="h-5 w-5 mr-1 text-muted-foreground" />
              <span className="mr-2">{property.city}, {property.state}</span>
              {property.id && (
                <span className="text-sm text-muted-foreground ml-2">
                  Código: {property.id}
                </span>
              )}
            </div>

            {/* Image Carousel */}
            <div className="mb-8">
              <Carousel className="w-full">
                <CarouselContent>
                  {imageUrls.map((url, index) => (
                    <CarouselItem key={index}>
                      <div className="overflow-hidden rounded-lg">
                        <img
                          src={url}
                          alt={`Vista do imóvel ${index + 1}`}
                          className="w-full h-[400px] object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-2">
                  <CarouselPrevious />
                  <CarouselNext />
                </div>
              </Carousel>
            </div>

            {/* Property Information Tabs */}
            <Tabs defaultValue="details" className="mb-10">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="features">Características</TabsTrigger>
                <TabsTrigger value="auction">Edital/Regras</TabsTrigger>
                <TabsTrigger value="location">Localização</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                    <Maximize2 className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Área Total</span>
                    <span className="font-medium">{property.area} m²</span>
                  </div>
                  {property.privateArea && (
                    <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                      <Home className="h-6 w-6 mb-2 text-primary" />
                      <span className="text-sm text-muted-foreground">Área Privativa</span>
                      <span className="font-medium">{property.privateArea} m²</span>
                    </div>
                  )}
                  <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                    <Bed className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Quartos</span>
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                    <Bath className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Banheiros</span>
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                    <Square className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Vagas</span>
                    <span className="font-medium">{property.parking}</span>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                    <Building className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Sobre este imóvel</h3>
                  {property.description ? (
                    <p className="mb-4">{property.description}</p>
                  ) : (
                    <p className="mb-4">
                      Este {property.propertyType.toLowerCase()} está localizado em {property.city}, {property.state}, em uma excelente localização com fácil acesso a comércios, escolas e transporte público. 
                      Com {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'} e {property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}, 
                      oferece {property.area}m² de área {property.privateArea ? `total e ${property.privateArea}m² de área privativa` : 'útil'} e excelente oportunidade de investimento.
                    </p>
                  )}
                  
                  <p className="mb-4">
                    Por ser um imóvel da Caixa Econômica Federal, você tem a oportunidade de adquiri-lo com condições diferenciadas 
                    {property.acceptsFinancing && " com possibilidade de financiamento"}
                    {property.acceptsFGTS && " e uso do FGTS"}
                    {(property.acceptsInstallments || property.acceptsConsortium) && ", além de outras facilidades como "}
                    {property.acceptsInstallments && "parcelamento"}
                    {property.acceptsInstallments && property.acceptsConsortium && " e "}
                    {property.acceptsConsortium && "consórcio"}
                    .
                  </p>
                  
                  {property.originalPrice && (
                    <p>
                      <strong>Oportunidade de economia:</strong> Este imóvel está com desconto de {property.discount}% 
                      em relação ao valor de avaliação que é de {formatCurrency(property.originalPrice)}.
                    </p>
                  )}
                  
                  {property.observations && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold mb-2">Observações importantes</h4>
                      <div className="p-4 bg-muted/30 rounded-md">
                        {property.observations}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Características do imóvel</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>{property.area} m² de área total</span>
                  </div>
                  {property.privateArea && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>{property.privateArea} m² de área privativa</span>
                    </div>
                  )}
                  {property.bedrooms > 0 && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>{property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
                    </div>
                  )}
                  {property.parking > 0 && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>{property.parking} {property.parking === 1 ? 'vaga de garagem' : 'vagas de garagem'}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>Tipo: {property.propertyType}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>Modalidade: {property.modality}</span>
                  </div>
                  {property.acceptsFinancing && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Aceita financiamento</span>
                    </div>
                  )}
                  {property.acceptsFGTS && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Aceita FGTS</span>
                    </div>
                  )}
                  {property.acceptsInstallments && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Aceita parcelamento</span>
                    </div>
                  )}
                  {property.acceptsConsortium && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Aceita consórcio</span>
                    </div>
                  )}
                  {property.registryNumber && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Matrícula: {property.registryNumber}</span>
                    </div>
                  )}
                  {property.propertyRegistration && (
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Inscrição imobiliária: {property.propertyRegistration}</span>
                    </div>
                  )}
                </div>

                {(property.registryUrl || property.editalUrl || property.salesRulesUrl) && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold mb-3">Documentos do imóvel</h4>
                    <div className="flex flex-wrap gap-4">
                      {property.registryUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={property.registryUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Matrícula
                          </a>
                        </Button>
                      )}
                      {property.editalUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={property.editalUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Edital
                          </a>
                        </Button>
                      )}
                      {property.salesRulesUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={property.salesRulesUrl} target="_blank" rel="noopener noreferrer">
                            <FileText className="h-4 w-4 mr-2" />
                            Ver Regras de Venda
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="auction" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">{auctionInfo.title}</h3>
                
                {auctionInfo.dates && auctionInfo.dates.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Datas importantes</h4>
                    <div className="space-y-3">
                      {auctionInfo.dates.map((dateInfo, index) => (
                        dateInfo.date && (
                          <div key={index} className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-primary" />
                            <span className="font-medium">{dateInfo.label}: </span>
                            <span className="ml-2">{dateInfo.date}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
                
                {auctionInfo.editalInfo && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Informações do Edital</h4>
                    <p className="mb-2">Edital Número: {auctionInfo.editalInfo.number}</p>
                    <Button variant="outline" size="sm" asChild>
                      <a href={auctionInfo.editalInfo.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Edital
                      </a>
                    </Button>
                  </div>
                )}
                
                {auctionInfo.rulesInfo && (
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Regras da Venda</h4>
                    <Button variant="outline" size="sm" asChild>
                      <a href={auctionInfo.rulesInfo.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Ver Regras de Venda
                      </a>
                    </Button>
                  </div>
                )}
                
                {property.url && (
                  <div className="mt-8">
                    <h4 className="font-semibold mb-3">Acessar oferta no site da Caixa</h4>
                    <Button asChild>
                      <a href={property.url} target="_blank" rel="noopener noreferrer">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Acessar no Site Oficial
                      </a>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="location" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Localização</h3>
                <p className="mb-4">{property.address}, {property.city} - {property.state}</p>
                
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Mapa indisponível</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Proximidades</h4>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Supermercados</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Escolas</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Hospitais</span>
                    </div>
                    <div className="flex items-center">
                      <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                      <span>Transporte público</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar with Price and Actions */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>
                  {property.originalPrice ? (
                    <>
                      <div className="text-sm line-through text-muted-foreground">
                        De {formatCurrency(property.originalPrice)}
                      </div>
                      <div className="text-3xl font-bold text-primary">
                        Por {formatCurrency(property.price)}
                      </div>
                    </>
                  ) : (
                    <div className="text-3xl font-bold">
                      {formatCurrency(property.price)}
                    </div>
                  )}
                  
                  {property.discount && (
                    <Badge variant="destructive" className="mt-2">
                      {property.discount}% de desconto
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Button className="w-full" size="lg" asChild>
                    <Link to={`/nova-analise?propertyId=${property.id}`}>
                      Analisar este imóvel
                    </Link>
                  </Button>
                  
                  {property.url && (
                    <Button variant="outline" className="w-full" size="lg" asChild>
                      <a href={property.url} target="_blank" rel="noopener noreferrer">
                        Ver no site da Caixa
                      </a>
                    </Button>
                  )}
                </div>
                
                <Separator />
                
                {auctionInfo.dates && auctionInfo.dates.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      Datas importantes
                    </h4>
                    
                    <div className="space-y-2">
                      {auctionInfo.dates.map((dateInfo, index) => (
                        dateInfo.date && (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{dateInfo.label}:</span>
                            <span className="font-medium">{dateInfo.date}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    Detalhes do financiamento
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Simulação aproximada para este imóvel:
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Entrada (20%):</span>
                      <span className="font-medium">{formatCurrency(property.price * 0.2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Financiamento:</span>
                      <span className="font-medium">{formatCurrency(property.price * 0.8)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Parcela estimada:</span>
                      <span className="font-medium">{formatCurrency((property.price * 0.8) / 360)}/mês</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Análise preliminar
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Valor do m²:</span>
                      <span className="font-medium">{formatCurrency(property.price / property.area)}/m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Média da região:</span>
                      <span className="font-medium">{formatCurrency((property.price / property.area) * 1.1)}/m²</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Economia potencial:</span>
                      <span className="font-medium">
                        {property.discount ? property.discount : "10"}% abaixo do mercado
                      </span>
                    </div>
                  </div>
                </div>
                
                <Button variant="ghost" className="w-full" size="sm" asChild>
                  <Link to={`/nova-analise?propertyId=${property.id}`}>
                    Ver análise completa
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-12 mb-6">
          <h2 className="text-2xl font-bold mb-6">Imóveis similares</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockProperties
              .filter(p => p.id !== property.id)
              .slice(0, 3)
              .map(similarProperty => (
                <Card key={similarProperty.id} className="overflow-hidden">
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={similarProperty.imageUrl} 
                      alt={similarProperty.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-1 line-clamp-1">{similarProperty.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{similarProperty.address}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{formatCurrency(similarProperty.price)}</span>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/imoveis-caixa/${similarProperty.id}`}>Ver detalhes</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
