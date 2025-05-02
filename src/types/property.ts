export interface PropertyData {
  id: string;
  ps?: string[];
  url: string;
  city: string;
  type: string;
  fim_1?: string;
  fim_2?: string;
  state: string;
  title: string;
  bairro: string;
  images: string[];
  address: string;
  garagem: string;
  quartos: string;
  modality: string;
  banheiros: string;
  edital_url?: string;
  sale_value: number;
  total_area: string;
  aceita_FGTS?: string;
  description?: string;
  private_area: number;
  matricula_url?: string;
  preco_avaliacao: number;
  aceita_consorcio?: string | null;
  fim_venda_online?: string;
  matricula_number?: string;
  aceita_parcelamento?: string | null;
  regras_de_venda_url?: string;
  aceita_financiamento?: string;
  inscricao_imobiliaria?: string;
  number_property_edital?: string;
  fim_leilao: string;
}

export interface Property {
  id: number;
  category_path: string | null;
  site_id: string;
  data: PropertyData;
  end_date: string;
}

export interface PropertyFilters {
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