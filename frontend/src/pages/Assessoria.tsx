
import React from 'react';
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Award, BarChart3, Briefcase, CheckCircle, Clock, DollarSign, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Assessoria = () => {
  return (
    <Layout removeHeaderSpace={true}>
      <div className="bg-black text-white">
        {/* Hero Section with Black Header */}
        <section className="relative overflow-hidden py-20 md:py-32 bg-black border-b border-gray-800">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-700/50 via-black to-black" />
          </div>
          
          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent drop-shadow-[0_1.2px_1.2px_rgba(255,255,255,0.5)]">
                  Assessoria Especializada
                </span>
                <br className="hidden md:block" />
                <span className="text-white mt-2 inline-block">
                  para Investimentos em Leilões
                </span>
              </h1>
              
              <p className="mb-10 text-lg text-gray-300 md:text-xl">
                Potencialize seus investimentos em leilões judiciais e extrajudiciais com uma 
                estratégia personalizada de alto desempenho e mitigação de riscos.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-black hover:bg-gray-200 text-base py-6 px-8" asChild>
                  <Link to="/contato">
                    Agende uma Consultoria <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10 text-base py-6 px-8">
                  <Link to="/como-funciona">Saiba Mais</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Less Colorful */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Por que escolher nossa assessoria?
              </h2>
              <p className="text-gray-300 text-lg">
                Combinamos expertise jurídica e financeira para maximizar o retorno e minimizar riscos em cada operação.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-900/80 p-8 rounded-lg border border-gray-800 hover:border-white/50 transition-all duration-300">
                <ShieldCheck className="h-12 w-12 text-white mb-4" />
                <h3 className="text-xl font-bold mb-3">Análise Completa de Riscos</h3>
                <p className="text-gray-400">
                  Identificação preventiva de possíveis ônus, pendências jurídicas e contingências ocultas antes do investimento.
                </p>
              </div>
              
              <div className="bg-gray-900/80 p-8 rounded-lg border border-gray-800 hover:border-white/50 transition-all duration-300">
                <BarChart3 className="h-12 w-12 text-white mb-4" />
                <h3 className="text-xl font-bold mb-3">Avaliações Precisas</h3>
                <p className="text-gray-400">
                  Valoração detalhada do imóvel considerando localização, potencial de valorização e comparativos de mercado.
                </p>
              </div>
              
              <div className="bg-gray-900/80 p-8 rounded-lg border border-gray-800 hover:border-white/50 transition-all duration-300">
                <DollarSign className="h-12 w-12 text-white mb-4" />
                <h3 className="text-xl font-bold mb-3">Estratégia de Lance</h3>
                <p className="text-gray-400">
                  Desenvolvimento de estratégias personalizadas para oferecer lances competitivos com maior probabilidade de sucesso.
                </p>
              </div>
              
              <div className="bg-gray-900/80 p-8 rounded-lg border border-gray-800 hover:border-white/50 transition-all duration-300">
                <Briefcase className="h-12 w-12 text-white mb-4" />
                <h3 className="text-xl font-bold mb-3">Acompanhamento Jurídico</h3>
                <p className="text-gray-400">
                  Orientação e representação em todas as etapas do processo, desde a análise do edital até a transferência de propriedade.
                </p>
              </div>
              
              <div className="bg-gray-900/80 p-8 rounded-lg border border-gray-800 hover:border-white/50 transition-all duration-300">
                <Clock className="h-12 w-12 text-white mb-4" />
                <h3 className="text-xl font-bold mb-3">Monitoramento Contínuo</h3>
                <p className="text-gray-400">
                  Acompanhamento de oportunidades em tempo real, alertas personalizados e análises rápidas para decisões ágeis.
                </p>
              </div>
              
              <div className="bg-gray-900/80 p-8 rounded-lg border border-gray-800 hover:border-white/50 transition-all duration-300">
                <Users className="h-12 w-12 text-white mb-4" />
                <h3 className="text-xl font-bold mb-3">Equipe Multidisciplinar</h3>
                <p className="text-gray-400">
                  Profissionais especializados em direito, finanças, engenharia e mercado imobiliário trabalhando em conjunto.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section - Less Colorful */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nosso Processo de Assessoria
              </h2>
              <p className="text-gray-300 text-lg">
                Um acompanhamento completo e personalizado em todas as etapas do seu investimento
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto">
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                  1
                </div>
                <div className="absolute left-5 top-10 h-full w-px bg-gradient-to-b from-white to-transparent"></div>
                <h3 className="text-xl font-bold mb-2">Identificação de Oportunidades</h3>
                <p className="text-gray-400">
                  Mapeamento contínuo do mercado para identificar imóveis com potencial de valorização e rentabilidade acima da média.
                </p>
              </div>
              
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                  2
                </div>
                <div className="absolute left-5 top-10 h-full w-px bg-gradient-to-b from-white to-transparent"></div>
                <h3 className="text-xl font-bold mb-2">Análise Documental Completa</h3>
                <p className="text-gray-400">
                  Verificação minuciosa da documentação do imóvel, incluindo matrículas, certidões e processos judiciais relacionados.
                </p>
              </div>
              
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                  3
                </div>
                <div className="absolute left-5 top-10 h-full w-px bg-gradient-to-b from-white to-transparent"></div>
                <h3 className="text-xl font-bold mb-2">Avaliação Técnica e Financeira</h3>
                <p className="text-gray-400">
                  Análise detalhada do valor de mercado, potencial de valorização e custos envolvidos na aquisição e eventual reforma.
                </p>
              </div>
              
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                  4
                </div>
                <div className="absolute left-5 top-10 h-full w-px bg-gradient-to-b from-white to-transparent"></div>
                <h3 className="text-xl font-bold mb-2">Planejamento Estratégico</h3>
                <p className="text-gray-400">
                  Desenvolvimento de estratégia personalizada para participação no leilão, definição de valores máximos e táticas de lance.
                </p>
              </div>
              
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                  5
                </div>
                <div className="absolute left-5 top-10 h-full w-px bg-gradient-to-b from-white to-transparent"></div>
                <h3 className="text-xl font-bold mb-2">Representação no Leilão</h3>
                <p className="text-gray-400">
                  Participação ativa no certame com equipe especializada para garantir a melhor execução da estratégia definida.
                </p>
              </div>
              
              <div className="relative pl-16">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
                  6
                </div>
                <h3 className="text-xl font-bold mb-2">Assessoria Pós-Arrematação</h3>
                <p className="text-gray-400">
                  Acompanhamento de todos os trâmites após a arrematação, incluindo pagamento, transferência de propriedade e regularização.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                O que nossos clientes dizem
              </h2>
              <p className="text-gray-300 text-lg">
                Investidores que transformaram suas estratégias de investimento com nossa assessoria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-800 relative">
                <div className="absolute -top-5 left-8">
                  <span className="text-5xl text-gray-700">"</span>
                </div>
                <p className="text-gray-300 mb-6 pt-4">
                  A assessoria completa me permitiu arrematar um imóvel com 40% de desconto em relação ao valor de mercado. O retorno do investimento superou todas as expectativas.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">RP</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Ricardo Peixoto</h4>
                    <p className="text-gray-400 text-sm">Empresário, São Paulo</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-800 relative">
                <div className="absolute -top-5 left-8">
                  <span className="text-5xl text-gray-700">"</span>
                </div>
                <p className="text-gray-300 mb-6 pt-4">
                  A equipe identificou riscos que eu jamais teria percebido sozinho. Essa análise preventiva me poupou de problemas jurídicos significativos e garantiu um investimento seguro.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">CM</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Carolina Mendes</h4>
                    <p className="text-gray-400 text-sm">Investidora, Rio de Janeiro</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-lg border border-gray-800 relative">
                <div className="absolute -top-5 left-8">
                  <span className="text-5xl text-gray-700">"</span>
                </div>
                <p className="text-gray-300 mb-6 pt-4">
                  Em apenas um ano, adquiri três imóveis em leilões judiciais com a assessoria. O processo foi tranquilo e a rentabilidade média está acima de 25% ao ano.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">MA</span>
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold">Marcelo Almeida</h4>
                    <p className="text-gray-400 text-sm">Investidor, Belo Horizonte</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services & Packages Section - Less Colorful */}
        <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nossos Serviços Especializados
              </h2>
              <p className="text-gray-300 text-lg">
                Soluções customizadas para diferentes perfis de investidores
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-800 transition-all hover:border-white/50 hover:-translate-y-1 duration-300">
                <div className="bg-gray-800 p-6 border-b border-gray-800">
                  <h3 className="text-2xl font-bold mb-2">Assessoria Pontual</h3>
                  <p className="text-gray-300">Para oportunidades específicas</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Análise completa de um imóvel específico</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Avaliação jurídica e documental</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Estratégia personalizada de lance</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Representação no leilão</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-white text-black hover:bg-gray-300" asChild>
                    <Link to="/contato">Saiba Mais</Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-700 transform scale-105 shadow-xl relative">
                <div className="absolute -top-4 right-0 left-0 flex justify-center">
                  <span className="bg-white text-black text-sm py-1 px-4 rounded-full">Mais Popular</span>
                </div>
                <div className="bg-gray-800 p-6 border-b border-gray-800">
                  <h3 className="text-2xl font-bold mb-2">Assessoria Completa</h3>
                  <p className="text-gray-300">Para investidores ativos</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Busca ativa de oportunidades</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Análise completa de até 10 imóveis/mês</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Estratégia de investimento personalizada</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Representação em leilões ilimitada</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Acompanhamento pós-arrematação</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-white text-black hover:bg-gray-300" asChild>
                    <Link to="/contato">Contratar Agora</Link>
                  </Button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border border-gray-800 transition-all hover:border-white/50 hover:-translate-y-1 duration-300">
                <div className="bg-gray-800 p-6 border-b border-gray-800">
                  <h3 className="text-2xl font-bold mb-2">Assessoria Premium</h3>
                  <p className="text-gray-300">Para grandes investidores</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Todos os benefícios do plano Completo</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Gerente de conta exclusivo</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Análise de portfólio completa</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Estruturação de operações complexas</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>Acesso antecipado a oportunidades</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-white text-black hover:bg-gray-300" asChild>
                    <Link to="/contato">Consultar</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Less Colorful */}
        <section className="py-20 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-900/20" />
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto para transformar sua estratégia de investimentos?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Agende uma consultoria gratuita e descubra como nossa assessoria especializada pode potencializar seus resultados em leilões judiciais e extrajudiciais.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-black hover:bg-gray-300 text-lg py-6 px-8" asChild>
                  <Link to="/contato">
                    Agende uma Consultoria Gratuita <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <p className="text-gray-400 mt-6">
                <Clock className="inline h-4 w-4 mr-1" />
                Resposta em até 24 horas
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-black border-t border-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-white">+500</p>
                <p className="text-gray-400 mt-2">Imóveis analisados</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">98%</p>
                <p className="text-gray-400 mt-2">Taxa de sucesso</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">35%</p>
                <p className="text-gray-400 mt-2">Desconto médio obtido</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-white">+100</p>
                <p className="text-gray-400 mt-2">Clientes satisfeitos</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Assessoria;
