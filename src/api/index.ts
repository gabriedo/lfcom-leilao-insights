import { GET, POST, OPTIONS } from './extraction-callback';
import { ConsultaRepository } from '@/repositories/consultaRepository';
import { conectarMongoDB } from '@/config/database';

// Inicializa conexão com MongoDB
conectarMongoDB().catch(console.error);

const repo = new ConsultaRepository();

export async function handleApiRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  console.log(`Requisição recebida: ${request.method} ${url.pathname}`);
  console.log('Headers recebidos:', Object.fromEntries(request.headers.entries()));

  // Rota para criação de consulta
  if (url.pathname.includes('criar-consulta')) {
    if (request.method === 'POST') {
      try {
        const body = await request.json();
        const novaConsulta = await repo.criar(body);

        return new Response(JSON.stringify(novaConsulta), {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Método não permitido' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  // Rota para callback de extração
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