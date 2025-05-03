import { ExtractedPropertyData, ExtractionResult } from '@/types/property';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174';

// Função para formatar valores monetários
function formatCurrency(value: string | number | undefined): string {
  if (!value) return '';
  
  // Se for string, tenta converter para número
  if (typeof value === 'string') {
    // Remove caracteres não numéricos, exceto ponto e vírgula
    const numericValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
    value = parseFloat(numericValue);
  }

  // Se não for um número válido após a conversão
  if (isNaN(value as number)) return '';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value as number);
}

// Interface para resposta da extração
interface ExtractionResponse {
  success: boolean;
  data?: ExtractedPropertyData;
  error?: string;
}

export const analysisService = {
  // Extrair dados da URL
  async extractDataFromUrl(url: string): Promise<ExtractionResult> {
    try {
      console.log('Iniciando extração para URL:', url);
      
      const response = await fetch(`${API_URL}/api/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Erro ao extrair dados do imóvel');
      }

      const data = await response.json();
      console.log('Dados recebidos da API:', data);

      // Formata e valida os dados
      const formattedData = formatAndValidateData(data);
      console.log('Dados formatados:', formattedData);

      if (!formattedData.success || !formattedData.data) {
        throw new Error(formattedData.error || 'Erro ao formatar dados do imóvel');
      }

      return {
        success: true,
        message: 'Dados extraídos com sucesso',
        data: formattedData.data
      };
    } catch (error) {
      console.error('Erro na extração:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erro ao extrair dados do imóvel'
      };
    }
  }
};

// Função para formatar e validar os dados
function formatAndValidateData(data: any): ExtractionResponse {
  try {
    console.log('Dados recebidos (raw):', data);

    if (!data || typeof data !== 'object') {
      throw new Error('Dados inválidos recebidos da API');
    }

    // Formatar os dados mantendo os valores originais se não houver dados novos
    const formattedData: ExtractedPropertyData = {
      propertyType: data.propertyType || data.type || '',
      auctionType: data.auctionType || data.modality || 'Leilão',
      minBid: formatCurrency(data.minBid || data.sale_value || data.preco_avaliacao),
      evaluatedValue: formatCurrency(data.evaluatedValue || data.preco_avaliacao),
      address: data.address || `${data.title || ''} - ${data.city || ''}, ${data.state || ''}`.trim(),
      auctionDate: data.auctionDate || data.fim_leilao || data.fim_1 || data.fim_2 || data.fim_venda_online || '',
      description: data.description || '',
      images: Array.isArray(data.images) ? data.images.filter(Boolean) : [],
      documents: Array.isArray(data.documents) ? 
        data.documents.filter((doc: any) => doc && doc.url && doc.name) : 
        [
          data.edital_url && {
            url: data.edital_url,
            type: 'edital',
            name: 'Edital do Leilão'
          },
          data.matricula_url && {
            url: data.matricula_url,
            type: 'matricula',
            name: 'Matrícula do Imóvel'
          },
          data.regras_de_venda_url && {
            url: data.regras_de_venda_url,
            type: 'regras',
            name: 'Regras de Venda'
          }
        ].filter(Boolean)
    };

    console.log('Dados formatados:', formattedData);

    return {
      success: true,
      data: formattedData
    };
  } catch (error) {
    console.error('Erro ao formatar dados:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao formatar dados do imóvel'
    };
  }
}
