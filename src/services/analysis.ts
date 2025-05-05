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

// Função para sanitizar a URL
function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (error) {
    console.error('Erro ao sanitizar URL:', error);
    throw new Error('URL inválida');
  }
}

export const analysisService = {
  // Extrair dados da URL
  async extractDataFromUrl(url: string): Promise<ExtractionResult> {
    try {
      console.log('Iniciando extração para URL:', url);
      
      // Sanitiza a URL
      const sanitizedUrl = sanitizeUrl(url);
      console.log('URL sanitizada:', sanitizedUrl);
      
      // Primeiro, inicia a extração
      const extractResponse = await fetch(`${API_URL}/api/v1/pre-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: sanitizedUrl }),
      });

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erro ao iniciar extração do imóvel');
      }

      // Faz polling para verificar os resultados
      const maxAttempts = 15; // 30 segundos total (15 tentativas * 2 segundos)
      const interval = 2000; // 2 segundos
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        console.log(`Tentativa ${attempt + 1}/${maxAttempts} de buscar resultados`);
        
        try {
          const response = await fetch(`${API_URL}/api/v1/pre-analysis?url=${encodeURIComponent(sanitizedUrl)}`);
          
          if (response.status === 404) {
            console.log('Análise ainda não disponível, aguardando...');
            await new Promise(resolve => setTimeout(resolve, interval));
            continue;
          }
          
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Erro ao buscar resultados da extração');
          }
          
          const result = await response.json();
          console.log('Resposta da API:', result);
          
          // Formata e valida os dados
          const formattedData = formatAndValidateData(result);
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
          console.error(`Erro na tentativa ${attempt + 1}:`, error);
          lastError = error instanceof Error ? error : new Error('Erro desconhecido');
          
          // Se for o último erro, lança a exceção
          if (attempt === maxAttempts - 1) {
            throw lastError;
          }
          
          // Aguarda antes da próxima tentativa
          await new Promise(resolve => setTimeout(resolve, interval));
        }
      }
      
      throw lastError || new Error('Tempo limite excedido ao aguardar extração');
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
      minBid: formatCurrency(data.minBid || data.valor_minimo || data.sale_value || data.preco_avaliacao),
      evaluatedValue: formatCurrency(data.evaluatedValue || data.preco_avaliacao),
      address: data.address || data.titulo || '',
      auctionDate: data.auctionDate || data.data_leilao || data.fim_leilao || data.fim_1 || data.fim_2 || data.fim_venda_online || '',
      description: data.description || '',
      images: Array.isArray(data.images) ? data.images.filter(Boolean) : [data.imagem].filter(Boolean),
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
