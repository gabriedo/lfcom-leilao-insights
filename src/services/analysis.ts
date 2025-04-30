interface ExtractionResponse {
  success: boolean;
  data?: {
    propertyType: string;
    auctionType: string;
    minBid: string;
    evaluatedValue: string;
    address: string;
    auctionDate?: string;
    description?: string;
    images?: string[];
    documents?: {
      url: string;
      type: string;
      name: string;
    }[];
  };
  error?: string;
}

export const analysisService = {
  extractDataFromUrl: async (url: string): Promise<ExtractionResponse> => {
    try {
      console.log('Iniciando extração para URL:', url);

      // Obter a URL do ngrok
      const ngrokUrl = import.meta.env.VITE_NGROK_URL || 'http://localhost:4040';
      const callbackUrl = `${ngrokUrl}/api/extraction-callback`;

      console.log('URL do callback:', callbackUrl);

      // Validar a URL antes de fazer a requisição
      if (!url.startsWith('http')) {
        throw new Error('URL inválida. Deve começar com http:// ou https://');
      }

      const response = await fetch('https://lfcom.app.n8n.cloud/webhook-test/imovel-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          url: url,
          timestamp: new Date().toISOString(),
          callbackUrl: callbackUrl
        })
      });

      console.log('Status da resposta:', response.status);
      console.log('Headers da resposta:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro na API:', errorText);
        throw new Error(`Erro na API: ${response.status} - ${errorText}`);
      }

      const initialData = await response.json();
      console.log('Resposta inicial:', initialData);

      // Se recebemos apenas a mensagem de confirmação, precisamos fazer polling
      if (initialData.message === 'Workflow was started') {
        // Fazer polling por até 30 segundos
        const maxAttempts = 30;
        const interval = 1000; // 1 segundo

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          console.log(`Tentativa ${attempt + 1} de ${maxAttempts}`);
          
          try {
            // Verificar se os dados já estão disponíveis
            const pollResponse = await fetch(`${callbackUrl}?url=${encodeURIComponent(url)}`);
            
            if (pollResponse.ok) {
              const contentType = pollResponse.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const pollData = await pollResponse.json();
                console.log('Dados recebidos:', pollData);
                return formatAndValidateData(pollData);
              } else {
                console.warn('Resposta não é JSON:', contentType);
              }
            } else {
              console.warn('Resposta não OK:', pollResponse.status);
            }
          } catch (error) {
            console.warn('Erro no polling:', error);
          }

          // Aguardar o intervalo
          await new Promise(resolve => setTimeout(resolve, interval));
        }

        throw new Error('Tempo limite excedido ao aguardar os dados');
      }

      // Se já temos os dados diretamente, retornamos
      return formatAndValidateData(initialData);
    } catch (error) {
      console.error('Erro na extração:', error);
      return {
        success: false,
        error: 'Não foi possível extrair os dados do imóvel. Verifique a URL ou preencha os dados manualmente.'
      };
    }
  }
};

// Função auxiliar para formatar e validar os dados
function formatAndValidateData(data: any): ExtractionResponse {
  console.log('Dados recebidos (raw):', data);
  console.log('Tipo dos dados:', typeof data);
  console.log('Propriedades:', Object.keys(data));

  // Validação básica
  if (!data || typeof data !== 'object') {
    throw new Error('Resposta inválida da API');
  }

  // Formatação dos valores monetários
  const formatCurrency = (value: string | number) => {
    if (!value) return '';
    if (typeof value === 'string' && value.includes('R$')) return value;
    const number = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) / 100 : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(number);
  };

  // Formatar os dados mantendo os valores originais se não houver dados novos
  const formattedData = {
    propertyType: data.propertyType || '',
    auctionType: data.auctionType || 'Leilão',
    minBid: formatCurrency(data.minBid || ''),
    evaluatedValue: formatCurrency(data.evaluatedValue || ''),
    address: data.address || '',
    auctionDate: data.auctionDate || '',
    description: data.description || '',
    images: Array.isArray(data.images) ? data.images.filter(Boolean) : [],
    documents: Array.isArray(data.documents) ? data.documents.filter((doc: any) => doc && doc.url) : []
  };

  console.log('Dados formatados:', formattedData);

  return {
    success: true,
    data: formattedData
  };
}
