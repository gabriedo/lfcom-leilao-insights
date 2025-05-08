import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lfcom-leilao';

export async function conectarMongoDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado ao MongoDB');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

// Eventos de conexão
mongoose.connection.on('error', (error) => {
  console.error('Erro na conexão com MongoDB:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('Desconectado do MongoDB');
});

// Reconexão automática
mongoose.connection.on('disconnected', () => {
  console.log('Tentando reconectar ao MongoDB...');
  setTimeout(conectarMongoDB, 5000);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('Erro não tratado:', error);
  // Aqui você pode adicionar lógica para notificar sua equipe
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Conexão com MongoDB fechada');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao fechar conexão com MongoDB:', error);
    process.exit(1);
  }
}); 