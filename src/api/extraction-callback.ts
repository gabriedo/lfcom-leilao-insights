import { analysisService } from "@/services/analysis";

// Armazenamento temporário dos resultados
export const extractionResults = new Map<string, any>();

export async function POST(request: Request): Promise<Response> {
  try {
    console.log('Iniciando processamento da requisição POST');
    console.log('Headers recebidos:', Object.fromEntries(request.headers.entries()));
    console.log('Método da requisição:', request.method);
    console.log('URL da requisição:', request.url);
    
    const text = await request.text();
    console.log('Body recebido (raw):', text);
    
    let body;
    try {
      body = JSON.parse(text);
      console.log('Dados parseados:', body);
    } catch (e) {
      console.error('Erro ao fazer parse do JSON:', e);
      return new Response(JSON.stringify({ error: 'JSON inválido', details: e.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (!body.url) {
      console.error('URL não fornecida nos dados:', body);
      return new Response(JSON.stringify({ error: 'URL não fornecida' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    extractionResults.set(body.url, body);
    console.log('Dados armazenados para URL:', body.url);
    console.log('Dados completos:', body);

    return addCorsHeaders(new Response(JSON.stringify({ 
      success: true,
      message: 'Dados recebidos com sucesso',
      url: body.url
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }));
  } catch (error) {
    console.error('Erro ao processar requisição POST:', error);
    return addCorsHeaders(new Response(JSON.stringify({ 
      error: 'Erro ao processar dados', 
      details: error.message,
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    }));
  }
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const propertyUrl = url.searchParams.get('url');

  if (!propertyUrl) {
    return new Response(JSON.stringify({ error: 'URL não fornecida' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const data = extractionResults.get(propertyUrl);
  if (!data) {
    return new Response(JSON.stringify({ error: 'Dados não encontrados' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Remove os dados após enviar a resposta
  extractionResults.delete(propertyUrl);
  console.log('Dados enviados e removidos para URL:', propertyUrl);

  return addCorsHeaders(new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  }));
}

// Adicionar suporte a OPTIONS para CORS
export function OPTIONS(): Response {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
      'Access-Control-Max-Age': '86400'
    }
  });
}

// Função auxiliar para adicionar headers CORS
function addCorsHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Accept');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
} 