import mongoose, { Model, Document } from 'mongoose';
import { Consulta, NovaConsulta, AtualizarConsulta, validarConsulta, validarNovaConsulta, validarAtualizacaoConsulta } from '@/models/Consulta';

// Interface do documento MongoDB
interface ConsultaDocument extends Document, Omit<Consulta, 'id'> {
  id: string;
}

// Schema do Mongoose
const consultaSchema = new mongoose.Schema<ConsultaDocument>({
  userId: { type: String, required: true, index: true },
  url: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['PENDENTE', 'EM_ANALISE', 'CONCLUIDA', 'ERRO'],
    index: true 
  },
  resultado: {
    propertyType: String,
    auctionType: String,
    minBid: String,
    evaluatedValue: String,
    address: String,
    auctionDate: String,
    description: String,
    images: [String],
    documents: [{
      url: String,
      type: String,
      name: String
    }]
  },
  erro: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  completedAt: Date
}, {
  timestamps: true,
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Índices para otimização de consultas
consultaSchema.index({ userId: 1, createdAt: -1 });
consultaSchema.index({ status: 1, createdAt: -1 });

// Modelo do Mongoose
const ConsultaModel: Model<ConsultaDocument> = mongoose.models.Consulta || mongoose.model<ConsultaDocument>('Consulta', consultaSchema);

export class ConsultaRepository {
  // Criar nova consulta
  async criar(dados: NovaConsulta): Promise<Consulta> {
    const dadosValidados = validarNovaConsulta(dados);
    const consulta = new ConsultaModel({
      ...dadosValidados,
      status: 'PENDENTE'
    });
    
    const consultaSalva = await consulta.save();
    return validarConsulta(consultaSalva.toJSON());
  }

  // Buscar consulta por ID
  async buscarPorId(id: string): Promise<Consulta | null> {
    const consulta = await ConsultaModel.findById(id);
    if (!consulta) return null;
    return validarConsulta(consulta.toJSON());
  }

  // Buscar consultas por usuário
  async buscarPorUsuario(userId: string, pagina: number = 1, limite: number = 10): Promise<{ consultas: Consulta[], total: number }> {
    const skip = (pagina - 1) * limite;
    
    const [consultas, total] = await Promise.all([
      ConsultaModel.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limite),
      ConsultaModel.countDocuments({ userId })
    ]);

    return {
      consultas: consultas.map(c => validarConsulta(c.toJSON())),
      total
    };
  }

  // Atualizar consulta
  async atualizar(id: string, dados: AtualizarConsulta): Promise<Consulta | null> {
    const dadosValidados = validarAtualizacaoConsulta(dados);
    
    const consulta = await ConsultaModel.findByIdAndUpdate(
      id,
      { 
        ...dadosValidados,
        updatedAt: new Date(),
        ...(dadosValidados.status === 'CONCLUIDA' && { completedAt: new Date() })
      },
      { new: true }
    );

    if (!consulta) return null;
    return validarConsulta(consulta.toJSON());
  }

  // Buscar consultas pendentes
  async buscarPendentes(limite: number = 10): Promise<Consulta[]> {
    const consultas = await ConsultaModel.find({ status: 'PENDENTE' })
      .sort({ createdAt: 1 })
      .limit(limite);

    return consultas.map(c => validarConsulta(c.toJSON()));
  }

  // Deletar consulta (soft delete)
  async deletar(id: string): Promise<boolean> {
    const resultado = await ConsultaModel.findByIdAndUpdate(
      id,
      { 
        status: 'ERRO',
        erro: 'Consulta removida pelo usuário',
        updatedAt: new Date()
      }
    );
    
    return !!resultado;
  }

  // Buscar estatísticas de consultas
  async buscarEstatisticas(userId: string): Promise<{
    total: number;
    pendentes: number;
    concluidas: number;
    comErro: number;
  }> {
    const [total, pendentes, concluidas, comErro] = await Promise.all([
      ConsultaModel.countDocuments({ userId }),
      ConsultaModel.countDocuments({ userId, status: 'PENDENTE' }),
      ConsultaModel.countDocuments({ userId, status: 'CONCLUIDA' }),
      ConsultaModel.countDocuments({ userId, status: 'ERRO' })
    ]);

    return { total, pendentes, concluidas, comErro };
  }
} 