
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
import { Bed, Bath, Maximize2, MapPin, CalendarDays, Home, Info, Building, Star } from "lucide-react";
import { Link } from "react-router-dom";

// Import mockProperties from ImoveisCaixa to use the same data for now
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

  // Generate multiple images for the carousel (since we only have one in the mock data)
  const generateImageUrls = (baseUrl: string, count: number = 5) => {
    const images = [];
    for (let i = 0; i < count; i++) {
      // Append a random query param to get different images
      images.push(`${baseUrl}?random=${i}`);
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

  const imageUrls = generateImageUrls(property.imageUrl);

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
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">{property.address}</p>
            
            <div className="flex items-center mb-6">
              <MapPin className="h-5 w-5 mr-1 text-muted-foreground" />
              <span className="mr-2">{property.city}, {property.state}</span>
              <Badge variant="outline" className="mr-2">
                {property.propertyType}
              </Badge>
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detalhes</TabsTrigger>
                <TabsTrigger value="features">Características</TabsTrigger>
                <TabsTrigger value="location">Localização</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex flex-col items-center p-4 bg-muted/20 rounded-lg">
                    <Maximize2 className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Área</span>
                    <span className="font-medium">{property.area} m²</span>
                  </div>
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
                    <Building className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm text-muted-foreground">Tipo</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Sobre este imóvel</h3>
                  <p className="mb-4">
                    Este {property.propertyType.toLowerCase()} está localizado em {property.city}, {property.state}, em uma excelente localização com fácil acesso a comércios, escolas e transporte público. 
                    Com {property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'} e {property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}, 
                    oferece {property.area}m² de área útil e excelente oportunidade de investimento.
                  </p>
                  <p className="mb-4">
                    Por ser um imóvel da Caixa Econômica Federal, você tem a oportunidade de adquiri-lo com condições diferenciadas de financiamento 
                    e possibilidade de uso do FGTS, conforme regras vigentes.
                  </p>
                  {property.originalPrice && (
                    <p>
                      <strong>Oportunidade de economia:</strong> Este imóvel está com desconto de {property.discount}% 
                      em relação ao valor de avaliação que é de {formatCurrency(property.originalPrice)}.
                    </p>
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
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>{property.bathrooms} {property.bathrooms === 1 ? 'banheiro' : 'banheiros'}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>Situação: {property.status}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>Tipo: {property.propertyType}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>Aceita financiamento</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-primary rounded-full mr-2"></div>
                    <span>Aceita FGTS</span>
                  </div>
                </div>
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
                  
                  <Button variant="outline" className="w-full" size="lg">
                    Agendar visita
                  </Button>
                </div>
                
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
                
                <Button variant="ghost" className="w-full" size="sm">
                  Ver análise completa
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
