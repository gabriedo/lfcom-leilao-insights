
import React, { useState } from "react";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Tipo para propriedade imobiliária
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

// Mock de dados para imóveis da Caixa
export const mockProperties: Property[] = [
  {
    id: "1",
    title: "Apartamento em São Paulo",
    address: "Rua Augusta, 123",
    city: "São Paulo",
    state: "SP",
    price: 420000,
    originalPrice: 500000,
    discount: 16,
    area: 78,
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: "https://picsum.photos/400/300",
    propertyType: "Apartamento",
    status: "Ocupado"
  },
  {
    id: "2",
    title: "Casa em Osasco",
    address: "Av. dos Autonomistas, 456",
    city: "Osasco",
    state: "SP",
    price: 380000,
    originalPrice: 430000,
    discount: 12,
    area: 120,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "https://picsum.photos/400/302",
    propertyType: "Casa",
    status: "Desocupado"
  },
  {
    id: "3",
    title: "Apartamento em Santo André",
    address: "Rua das Figueiras, 789",
    city: "Santo André",
    state: "SP",
    price: 310000,
    originalPrice: 350000,
    discount: 11,
    area: 65,
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: "https://picsum.photos/400/301",
    propertyType: "Apartamento",
    status: "Desocupado"
  },
  {
    id: "4",
    title: "Casa em Guarulhos",
    address: "Av. Tiradentes, 555",
    city: "Guarulhos",
    state: "SP",
    price: 480000,
    originalPrice: 550000,
    discount: 13,
    area: 150,
    bedrooms: 3,
    bathrooms: 2,
    imageUrl: "https://picsum.photos/400/303",
    propertyType: "Casa",
    status: "Ocupado"
  },
  {
    id: "5",
    title: "Apartamento em Campinas",
    address: "Av. Norte-Sul, 1000",
    city: "Campinas",
    state: "SP",
    price: 350000,
    originalPrice: 400000,
    discount: 12.5,
    area: 70,
    bedrooms: 2,
    bathrooms: 1,
    imageUrl: "https://picsum.photos/400/304",
    propertyType: "Apartamento",
    status: "Desocupado"
  },
  {
    id: "6",
    title: "Terreno em Sorocaba",
    address: "Rua das Palmeiras, 222",
    city: "Sorocaba",
    state: "SP",
    price: 180000,
    originalPrice: 220000,
    discount: 18,
    area: 300,
    bedrooms: 0,
    bathrooms: 0,
    imageUrl: "https://picsum.photos/400/305",
    propertyType: "Terreno",
    status: "Desocupado"
  }
];

// Função para buscar imóveis (simulação de API)
const fetchProperties = async (filters: any = {}): Promise<Property[]> => {
  // Simulando um delay de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredProperties = [...mockProperties];
  
  // Aplicar filtros
  if (filters.city && filters.city !== "all-cities") {
    filteredProperties = filteredProperties.filter(prop => prop.city === filters.city);
  }
  
  if (filters.propertyType && filters.propertyType !== "all-types") {
    filteredProperties = filteredProperties.filter(prop => prop.propertyType === filters.propertyType);
  }
  
  if (filters.priceMin > 0 || filters.priceMax < 1000000) {
    filteredProperties = filteredProperties.filter(
      prop => prop.price >= filters.priceMin && prop.price <= filters.priceMax
    );
  }
  
  if (filters.bedrooms > 0) {
    filteredProperties = filteredProperties.filter(prop => prop.bedrooms >= filters.bedrooms);
  }
  
  if (filters.status && filters.status !== "all-status") {
    filteredProperties = filteredProperties.filter(prop => prop.status === filters.status);
  }
  
  return filteredProperties;
};

export default function ImoveisCaixa() {
  const [filters, setFilters] = useState({
    city: "",
    propertyType: "",
    priceMin: 0,
    priceMax: 1000000,
    bedrooms: 0,
    status: ""
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
  });

  return (
    <Layout>
      <div className="bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold mb-2">Imóveis da Caixa Econômica Federal</h1>
            <p className="text-lg text-muted-foreground">
              Encontre as melhores oportunidades de imóveis da Caixa com descontos exclusivos
            </p>
          </div>

          <PropertyFilters filters={filters} setFilters={setFilters} />

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {properties && properties.length > 0 ? (
                <>
                  <div className="mt-8 mb-4">
                    <p className="text-muted-foreground">
                      {properties.length} imóveis encontrados
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>

                  <Pagination className="mt-10">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">Nenhum imóvel encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente modificar os filtros para encontrar mais resultados.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
