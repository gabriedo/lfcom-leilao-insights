import { z } from "zod";

// Schema para documentos
export const DocumentSchema = z.object({
  url: z.string(),
  type: z.string(),
  name: z.string()
}).strict();

// Schema para dados do imóvel
export const PropertyDataSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  propertyType: z.string().optional(),
  auctionType: z.string().optional(),
  minBid: z.string().optional(),
  evaluatedValue: z.string().optional(),
  address: z.string().optional(),
  auctionDate: z.string().optional(),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
  auctions: z.array(z.any()).optional(),
  extractionStatus: z.enum(['success', 'fallback_used', 'partial', 'failed']).optional(),
  documents: z.preprocess(
    (docs: unknown) => {
      if (!Array.isArray(docs)) return undefined;
      const validDocs = docs
        .filter((doc): doc is z.infer<typeof DocumentSchema> => 
          doc && 
          typeof doc === 'object' && 
          'url' in doc && 
          'type' in doc && 
          'name' in doc &&
          typeof doc.url === 'string' &&
          typeof doc.type === 'string' &&
          typeof doc.name === 'string'
        );
      return validDocs.length > 0 ? validDocs : undefined;
    },
    z.array(DocumentSchema).optional()
  )
}).strict();

// Tipos inferidos dos schemas
export type Document = z.infer<typeof DocumentSchema>;
export type ExtractedPropertyData = z.infer<typeof PropertyDataSchema>;

// Interface para resultado da extração
export interface ExtractionResult {
  success: boolean;
  message: string;
  data?: ExtractedPropertyData;
}

// Função para validar e transformar documentos
export function validateDocuments(docs: unknown): Document[] | undefined {
  if (!Array.isArray(docs)) return undefined;
  
  const validDocs = docs
    .filter((doc): doc is Document => 
      doc && 
      typeof doc === 'object' && 
      'url' in doc && 
      'type' in doc && 
      'name' in doc &&
      typeof doc.url === 'string' &&
      typeof doc.type === 'string' &&
      typeof doc.name === 'string'
    );
    
  return validDocs.length > 0 ? validDocs : undefined;
}

// Tipos existentes
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