import { GET, POST, OPTIONS } from './extraction-callback';

export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  console.log(`Requisição recebida: ${request.method} ${url.pathname}`);
  console.log('Headers recebidos:', Object.fromEntries(request.headers.entries()));

  if (url.pathname.includes('extraction-callback')) {
    console.log('Roteando para extraction-callback');
    switch (request.method) {
      case 'GET':
        console.log('Processando GET');
        return GET(request);
      case 'POST':
        console.log('Processando POST');
        return POST(request);
      case 'OPTIONS':
        console.log('Processando OPTIONS');
        return OPTIONS();
      default:
        console.log('Método não suportado:', request.method);
        return new Response(JSON.stringify({ error: 'Método não suportado' }), {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
    }
  }

  console.log('Endpoint não encontrado:', url.pathname);
  return new Response(JSON.stringify({ error: 'Endpoint não encontrado' }), {
    status: 404,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
} 