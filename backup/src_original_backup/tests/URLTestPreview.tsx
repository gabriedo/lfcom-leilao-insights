import React, { useEffect, useState } from 'react';
import PropertyPreview from '@/components/PropertyPreview';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PropertyData {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  minBid: string;
  evaluatedValue: string;
  propertyType: string;
  auctionType: string;
  auctionDate: string;
  description: string;
  images: string[];
  documents: any[];
  auctions: any[];
  extractionStatus?: 'success' | 'fallback_used' | 'partial' | 'failed';
}

const urls = [
  "https://www.portalzuk.com.br/imovel/sp/presidente-prudente/jardim-sao-sebastiao/rua-edith-gurgel-petermann-151/32919-201632",
  "https://www.megaleiloes.com.br/imoveis/apartamentos/sp/sao-paulo/apartamento-25-m2-vila-madalena-sao-paulo-sp-x110491",
  "https://venda-imoveis.caixa.gov.br/sistema/detalhe-imovel.asp?hdnOrigem=index&hdnimovel=1555531017715"
];

const URLTestPreview: React.FC = () => {
  const [results, setResults] = useState<{ url: string; data: PropertyData | null; error?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        urls.map(async (url) => {
          try {
            const response = await fetch(`/api/v1/pre-analysis?url=${encodeURIComponent(url)}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Verificar campos obrigatórios
            const missingFields = [];
            if (!data.title) missingFields.push('title');
            if (!data.minBid) missingFields.push('minBid');
            if (!data.propertyType) missingFields.push('propertyType');
            if (!data.images?.length) missingFields.push('images');

            if (missingFields.length > 0) {
              console.warn(`URL ${url} está faltando campos:`, missingFields);
            }

            // Garantir que todos os campos obrigatórios existam
            const propertyData: PropertyData = {
              id: data.id || url,
              title: data.title || 'Sem título',
              address: data.address || 'Endereço não disponível',
              city: data.city || 'Cidade não disponível',
              state: data.state || 'Estado não disponível',
              minBid: data.minBid || 'R$ 0,00',
              evaluatedValue: data.evaluatedValue || 'Não disponível',
              propertyType: data.propertyType || 'Não especificado',
              auctionType: data.auctionType || 'Não especificado',
              auctionDate: data.auctionDate || 'Data não disponível',
              description: data.description || 'Sem descrição disponível',
              images: data.images || [],
              documents: data.documents || [],
              auctions: data.auctions || [],
              extractionStatus: data.extractionStatus || 'success'
            };

            return { 
              url, 
              data: propertyData, 
              error: missingFields.length > 0 ? `Campos faltando: ${missingFields.join(', ')}` : undefined 
            };
          } catch (error) {
            console.error(`Erro ao buscar dados para ${url}:`, error);
            return { url, data: null, error: error instanceof Error ? error.message : 'Erro desconhecido' };
          }
        })
      );

      setResults(results);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Teste de Preview de URLs</h1>
      
      {results.map((result, index) => (
        <div key={index} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">URL {index + 1}</h2>
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {result.url}
            </a>
          </div>

          {result.error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{result.error}</AlertDescription>
            </Alert>
          )}

          {result.data && (
            <div className="border rounded-lg p-4">
              <PropertyPreview {...result.data} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default URLTestPreview; 