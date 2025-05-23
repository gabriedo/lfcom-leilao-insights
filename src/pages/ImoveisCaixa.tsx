import React, { useState } from "react";
import Layout from "@/components/Layout";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useLocation } from "react-router-dom";

// Enhanced Property interface
interface Property {
  id: string;
  url?: string;
  title: string;
  address: string;
  city: string;
  state: string;
  sale_value: any; // sale_value
  preco_avaliacao?: any; // preco_avaliacao
  discount?: any;
  area: any; // total_area
  privateArea?: number; // private_area
  bedrooms: number; // quartos
  bathrooms: number; // banheiros
  parking: number; // garagem
  imageUrl: string;
  images?: string[];
  propertyType: string; // type
  modality:
    | "Leilão SFI"
    | "Licitação Aberta"
    | "Venda Online"
    | "Venda Direta Online";
  fim_1?: string; // Data do 1º leilão (SFI)
  fim_2?: string; // Data do 2º leilão (SFI)
  fim_venda_online?: string; // Data fim venda online/licitação
  acceptsFinancing: boolean; // aceita_financiamento
  acceptsFGTS: boolean; // aceita_FGTS
  acceptsInstallments?: boolean; // aceita_parcelamento
  acceptsConsortium?: boolean; // aceita_consorcio
  description?: string;
  observations?: string; // ps
  registryNumber?: string; // matricula_number
  registryUrl?: string; // matricula_url
  propertyRegistration?: string; // inscricao_imobiliaria
  editalNumber?: string; // number_property_edital
  editalUrl?: string; // edital_url
  salesRulesUrl?: string; // regras_de_venda_url
}

// Enhanced mock data for Imóveis da Caixa
export const mockProperties: Property[] = [
  {
    id: "1",
    url: "https://www.caixa.gov.br/voce/habitacao/imoveis-venda/Paginas/default.aspx",
    title: "Apartamento em São Paulo",
    address: "Rua Augusta, 123",
    city: "São Paulo",
    state: "SP",
    price: 420000,
    originalPrice: 500000,
    discount: 16,
    area: 78,
    privateArea: 70,
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    imageUrl: "https://picsum.photos/400/300",
    images: [
      "https://picsum.photos/400/300",
      "https://picsum.photos/400/301",
      "https://picsum.photos/400/302",
    ],
    propertyType: "Apartamento",
    modality: "Leilão SFI",
    fim_1: "2025-05-15",
    fim_2: "2025-05-30",
    acceptsFinancing: true,
    acceptsFGTS: true,
    acceptsInstallments: false,
    acceptsConsortium: false,
    description: "Apartamento bem localizado próximo à Avenida Paulista",
    observations: "Imóvel ocupado",
    registryNumber: "123456",
    registryUrl: "https://example.com/matricula",
    propertyRegistration: "000.000.0001.0001.0001",
    editalNumber: "0001/2025",
    editalUrl: "https://example.com/edital",
  },
  {
    id: "2",
    url: "https://www.caixa.gov.br/voce/habitacao/imoveis-venda/Paginas/default.aspx",
    title: "Casa em Osasco",
    address: "Av. dos Autonomistas, 456",
    city: "Osasco",
    state: "SP",
    price: 380000,
    originalPrice: 430000,
    discount: 12,
    area: 120,
    privateArea: 110,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    imageUrl: "https://picsum.photos/400/302",
    images: [
      "https://picsum.photos/400/302",
      "https://picsum.photos/400/303",
      "https://picsum.photos/400/304",
    ],
    propertyType: "Casa",
    modality: "Venda Direta Online",
    acceptsFinancing: true,
    acceptsFGTS: true,
    acceptsInstallments: true,
    acceptsConsortium: true,
    description: "Casa ampla com quintal em bairro residencial",
  },
  {
    id: "3",
    url: "https://www.caixa.gov.br/voce/habitacao/imoveis-venda/Paginas/default.aspx",
    title: "Apartamento em Santo André",
    address: "Rua das Figueiras, 789",
    city: "Santo André",
    state: "SP",
    price: 310000,
    originalPrice: 350000,
    discount: 11,
    area: 65,
    privateArea: 60,
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    imageUrl: "https://picsum.photos/400/301",
    images: [
      "https://picsum.photos/400/301",
      "https://picsum.photos/400/305",
      "https://picsum.photos/400/306",
    ],
    propertyType: "Apartamento",
    modality: "Licitação Aberta",
    fim_venda_online: "2025-06-15",
    acceptsFinancing: false,
    acceptsFGTS: true,
    acceptsInstallments: true,
    acceptsConsortium: false,
    editalNumber: "0002/2025",
    editalUrl: "https://example.com/edital2",
  },
  {
    id: "4",
    url: "https://www.caixa.gov.br/voce/habitacao/imoveis-venda/Paginas/default.aspx",
    title: "Casa em Guarulhos",
    address: "Av. Tiradentes, 555",
    city: "Guarulhos",
    state: "SP",
    price: 480000,
    originalPrice: 550000,
    discount: 13,
    area: 150,
    privateArea: 145,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    imageUrl: "https://picsum.photos/400/303",
    images: [
      "https://picsum.photos/400/303",
      "https://picsum.photos/400/307",
      "https://picsum.photos/400/308",
    ],
    propertyType: "Casa",
    modality: "Venda Online",
    fim_venda_online: "2025-05-20",
    acceptsFinancing: true,
    acceptsFGTS: false,
    acceptsInstallments: false,
    acceptsConsortium: false,
    description: "Casa espaçosa em condomínio fechado",
    observations: "Necessita de pequenas reformas",
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
    privateArea: 65,
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    imageUrl: "https://picsum.photos/400/304",
    images: [
      "https://picsum.photos/400/304",
      "https://picsum.photos/400/309",
      "https://picsum.photos/400/310",
    ],
    propertyType: "Apartamento",
    modality: "Leilão SFI",
    fim_1: "2025-06-10",
    fim_2: "2025-06-25",
    acceptsFinancing: true,
    acceptsFGTS: true,
    description: "Apartamento em excelente localização no centro de Campinas",
    editalNumber: "0003/2025",
    editalUrl: "https://example.com/edital3",
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
    parking: 0,
    imageUrl: "https://picsum.photos/400/305",
    images: ["https://picsum.photos/400/305", "https://picsum.photos/400/311"],
    propertyType: "Terreno",
    modality: "Venda Direta Online",
    acceptsFinancing: true,
    acceptsFGTS: false,
    acceptsInstallments: true,
    acceptsConsortium: true,
    description: "Terreno plano em área de expansão urbana",
    registryNumber: "789012",
    registryUrl: "https://example.com/matricula3",
    propertyRegistration: "000.000.0003.0001.0001",
  },
];

// Enhanced filter interface
interface PropertyFilters {
  city: string;
  state: string;
  propertyType: string;
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  parking: number;
  modality: string;
  acceptsFinancing: boolean | null;
  acceptsFGTS: boolean | null;
  minDiscount: number;
  areaMin: number;
  sortBy: string;
}

// Function to fetch properties (simulação de API)
const fetchProperties = async (
  filters: PropertyFilters,
  page
): Promise<Property[]> => {
  var myHeaders = new Headers();
  myHeaders.append(
    "X-Api-Key",
    "gAAAAABn3ODQd_A82IRyOyKE_AwEAXITB6TY4Q0lxFVkiG_DxA0Ochmod4g-0jcReIuh2X7DaZLBJ5TbZIpZTxvsXRWuinq_NFxnf3chEWUZiaFPRFfhONMnIB2mtkV3cgDq2TlODXez"
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };
  const url = new URL(
    `https://scraphub.comercify.shop/api/items/2/?page=${page}`
  );

  // Aplicar filtros
  if (filters.city && filters.city !== "all-cities") {
    url.searchParams.set("city", filters.city);
  }

  if (filters.state && filters.state !== "all-states") {
    url.searchParams.set("state", filters.state);
  }

  if (filters.propertyType && filters.propertyType !== "all-types") {
    url.searchParams.set("type", filters.propertyType);
  }

  if (filters.modality && filters.modality !== "all-modalities") {
    url.searchParams.set("modality", filters.modality);
  }

  if (filters.priceMin > 0 || filters.priceMax < 1000000) {
    url.searchParams.set("preco_avaliacao__lte", filters.priceMax);
    url.searchParams.set("preco_avaliacao__gte", filters.priceMin);
  }

  if (filters.bedrooms > 0) {
    url.searchParams.set("quartos", filters.bedrooms);
  }

  if (filters.parking > 0) {
    url.searchParams.set("garagem", filters.parking);
  }

  if (filters.acceptsFinancing !== null) {
    url.searchParams.set("aceita_financiamento__isnull", false);
  }

  if (filters.acceptsFGTS !== null) {
    url.searchParams.set("aceita_FGTS__isnull", false);
  }

  if (filters.minDiscount > 0) {
    url.searchParams.set("desconto__gte", filters.minDiscount);
  }

  if (filters.areaMin > 0) {
    url.searchParams.set("private_area__gte", filters.areaMin);
  }

  // Sort properties
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case "price-asc":
        filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProperties.sort((a, b) => b.price - a.price);
        break;
      case "discount-desc":
        filteredProperties.sort(
          (a, b) => (b.discount || 0) - (a.discount || 0)
        );
        break;
      case "end-date-asc":
        filteredProperties.sort((a, b) => {
          const dateA = getEndDate(a);
          const dateB = getEndDate(b);
          if (!dateA) return 1;
          if (!dateB) return -1;
          return new Date(dateA).getTime() - new Date(dateB).getTime();
        });
        break;
      default:
        break;
    }
  }
  let response = await fetch(url, requestOptions);
  let filteredProperties = await response.json();
  filteredProperties.currentPage = page;
  filteredProperties.totalPages = filteredProperties.count / 20;

  return filteredProperties;
};

// Helper function to get the end date based on modality
const getEndDate = (property: Property): string | undefined => {
  if (property.modality === "Leilão SFI") {
    return property.fim_2 || property.fim_1;
  } else if (
    property.modality === "Licitação Aberta" ||
    property.modality === "Venda Online"
  ) {
    return property.fim_venda_online;
  }
  return undefined;
};

export default function ImoveisCaixa() {
  const [filters, setFilters] = useState<PropertyFilters>({
    city: "",
    state: "",
    propertyType: "",
    modality: "",
    priceMin: 0,
    priceMax: 1000000,
    bedrooms: 0,
    parking: 0,
    acceptsFinancing: null,
    acceptsFGTS: null,
    minDiscount: 0,
    areaMin: 0,
    sortBy: "",
  });
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  let currentPage = queryParams.get("page") || 1;
  currentPage = parseInt(currentPage);
  const { data, isLoading } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => fetchProperties(filters, currentPage),
  });

  return (
    <Layout>
      <div className="bg-background py-12">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold mb-2">
              Imóveis da Caixa Econômica Federal
            </h1>
            <p className="text-lg text-muted-foreground">
              Encontre as melhores oportunidades de imóveis da Caixa com
              descontos exclusivos
            </p>
          </div>

          <PropertyFilters filters={filters} setFilters={setFilters} />

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {data?.results && data?.results.length > 0 ? (
                <>
                  <div className="mt-8 mb-4">
                    <p className="text-muted-foreground">
                      {data?.count} imóveis encontrados
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.results?.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property.data}
                      />
                    ))}
                  </div>

                  <Pagination className="mt-10">
                    <PaginationContent>
                      {currentPage > 1 ? (
                        <PaginationItem>
                          <PaginationPrevious
                            href={`/imoveis-caixa?page=${currentPage - 1}`}
                          />
                        </PaginationItem>
                      ) : (
                        ""
                      )}
                      {currentPage > 1 ? (
                        <PaginationItem>
                          <PaginationLink
                            href={`/imoveis-caixa?page=${currentPage - 1}`}
                          >
                            {currentPage - 1}
                          </PaginationLink>
                        </PaginationItem>
                      ) : (
                        ""
                      )}
                      <PaginationItem>
                        <PaginationLink isActive href="#">
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage < data.count / 20 ? (
                        <PaginationItem>
                          <PaginationLink
                            href={`/imoveis-caixa?page=${currentPage + 1}`}
                          >
                            {currentPage + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ) : (
                        ""
                      )}
                      {currentPage < data.count / 20 ? (
                        <PaginationItem>
                          <PaginationNext
                            href={`/imoveis-caixa?page=${currentPage + 1}`}
                          />
                        </PaginationItem>
                      ) : (
                        ""
                      )}
                    </PaginationContent>
                  </Pagination>
                </>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">
                    Nenhum imóvel encontrado
                  </h3>
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
