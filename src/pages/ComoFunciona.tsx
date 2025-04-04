
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Lightbulb, BarChart3, FileCheck, AlertTriangle, BrainCircuit, Database, Building, CheckCircle2 } from "lucide-react";

export default function ComoFunciona() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Análise profissional automatizada de imóveis</h1>
              <p className="text-lg text-lfcom-gray-600 mb-8">
                Entenda como a LFCOM transforma o processo de análise de imóveis em leilão e venda direta por bancos, unindo tecnologia de ponta e expertise imobiliária.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-lfcom-black text-white hover:bg-lfcom-gray-800">
                  <Link to="/nova-analise" className="flex items-center gap-2">
                    Começar agora <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100">
                  <Link to="/precos">Ver planos</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="bg-lfcom-gray-100 rounded-lg p-1">
                  <img 
                    src="/placeholder.svg" 
                    alt="Plataforma LFCOM em ação" 
                    className="rounded-lg w-full shadow-lg"
                    width={600}
                    height={400}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg border border-lfcom-gray-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 h-6 w-6" />
                    <p className="font-medium">Análise completa em minutos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-lfcom-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Como funciona nossa plataforma</h2>
            <p className="text-lfcom-gray-600 max-w-3xl mx-auto">
              Nossa tecnologia analisa automaticamente todos os aspectos relevantes do imóvel para entregar um relatório profissional completo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-lfcom-gray-200 relative">
              <div className="bg-lfcom-black text-white w-10 h-10 rounded-full flex items-center justify-center mb-6">1</div>
              <h3 className="text-xl font-bold mb-3">Insira o link do imóvel</h3>
              <p className="text-lfcom-gray-600">
                Cole o link do anúncio do imóvel em leilão ou venda direta pelo banco. Nossa tecnologia fará a extração automática de todos os dados disponíveis.
              </p>
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 hidden lg:block">
                <ArrowRight className="h-8 w-8 text-lfcom-gray-400" />
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-lfcom-gray-200 relative">
              <div className="bg-lfcom-black text-white w-10 h-10 rounded-full flex items-center justify-center mb-6">2</div>
              <h3 className="text-xl font-bold mb-3">Processamento inteligente</h3>
              <p className="text-lfcom-gray-600">
                Nossos algoritmos analisam documentos, extraem informações e cruzam dados para construir uma análise completa e embasada sobre o imóvel.
              </p>
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 hidden lg:block">
                <ArrowRight className="h-8 w-8 text-lfcom-gray-400" />
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-lfcom-gray-200 relative">
              <div className="bg-lfcom-black text-white w-10 h-10 rounded-full flex items-center justify-center mb-6">3</div>
              <h3 className="text-xl font-bold mb-3">Análise multidimensional</h3>
              <p className="text-lfcom-gray-600">
                O sistema avalia aspectos legais, valores, riscos, potencial de valorização e viabilidade financeira do investimento.
              </p>
              <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 hidden lg:block">
                <ArrowRight className="h-8 w-8 text-lfcom-gray-400" />
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-lfcom-gray-200">
              <div className="bg-lfcom-black text-white w-10 h-10 rounded-full flex items-center justify-center mb-6">4</div>
              <h3 className="text-xl font-bold mb-3">Relatório profissional</h3>
              <p className="text-lfcom-gray-600">
                Receba um documento detalhado com todas as informações necessárias para tomar uma decisão informada sobre o investimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Recursos principais da plataforma</h2>
            <p className="text-lfcom-gray-600 max-w-3xl mx-auto">
              Nossa solução oferece uma análise completa e detalhada para embasar suas decisões de investimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg border border-lfcom-gray-200 hover:shadow-md transition-shadow">
              <FileText className="h-12 w-12 text-lfcom-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Análise de Documentos</h3>
              <p className="text-lfcom-gray-600">
                Interpretação automática de editais, matrículas, laudos e demais documentos relacionados ao imóvel.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Revisão de gravames e ônus
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Verificação de regularidade
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Condições do leilão
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-lfcom-gray-200 hover:shadow-md transition-shadow">
              <BarChart3 className="h-12 w-12 text-lfcom-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Análise Financeira</h3>
              <p className="text-lfcom-gray-600">
                Avaliação detalhada sobre a viabilidade financeira do investimento e projeções de retorno.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Potencial de valorização
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Custos de adequação
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> ROI estimado
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-lfcom-gray-200 hover:shadow-md transition-shadow">
              <AlertTriangle className="h-12 w-12 text-lfcom-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Análise de Riscos</h3>
              <p className="text-lfcom-gray-600">
                Identificação e classificação de potenciais riscos legais, físicos e financeiros do imóvel.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Riscos jurídicos
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Riscos estruturais
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Riscos de mercado
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-lfcom-gray-200 hover:shadow-md transition-shadow">
              <Building className="h-12 w-12 text-lfcom-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Avaliação de Imóveis</h3>
              <p className="text-lfcom-gray-600">
                Estimativa precisa do valor de mercado do imóvel com base em dados comparativos da região.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Preço justo de mercado
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Comparativos da região
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Tendências de valorização
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-lfcom-gray-200 hover:shadow-md transition-shadow">
              <BrainCircuit className="h-12 w-12 text-lfcom-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Inteligência Artificial</h3>
              <p className="text-lfcom-gray-600">
                Algoritmos avançados que processam grandes volumes de dados para gerar insights precisos.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Reconhecimento de padrões
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Aprendizado contínuo
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Processamento de linguagem natural
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-lfcom-gray-200 hover:shadow-md transition-shadow">
              <Database className="h-12 w-12 text-lfcom-black mb-4" />
              <h3 className="text-xl font-bold mb-3">Base de Dados Exclusiva</h3>
              <p className="text-lfcom-gray-600">
                Acesso a informações históricas de leilões e vendas diretas para embasar decisões.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Histórico de transações
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Estatísticas de mercado
                </li>
                <li className="flex items-center gap-2 text-sm text-lfcom-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500" /> Indicadores de desempenho
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-lfcom-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
            <p className="text-lfcom-gray-600 max-w-3xl mx-auto">
              Descubra como a LFCOM tem ajudado investidores a tomar decisões mais seguras e rentáveis.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-lfcom-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-lfcom-gray-200 rounded-full"></div>
                <div>
                  <h4 className="font-bold">Carlos Mendes</h4>
                  <p className="text-sm text-lfcom-gray-600">Investidor Imobiliário</p>
                </div>
              </div>
              <p className="text-lfcom-gray-600">
                "A plataforma LFCOM revolucionou minha forma de analisar oportunidades em leilões. O relatório detalhado me ajudou a evitar armadilhas e encontrar excelentes negócios."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-lfcom-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-lfcom-gray-200 rounded-full"></div>
                <div>
                  <h4 className="font-bold">Ana Paula Silva</h4>
                  <p className="text-sm text-lfcom-gray-600">Corretora de Imóveis</p>
                </div>
              </div>
              <p className="text-lfcom-gray-600">
                "Como corretora, utilizo a LFCOM para oferecer um diferencial aos meus clientes. Os relatórios profissionais trazem segurança e agilidade ao processo de decisão."
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm border border-lfcom-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-lfcom-gray-200 rounded-full"></div>
                <div>
                  <h4 className="font-bold">Roberto Almeida</h4>
                  <p className="text-sm text-lfcom-gray-600">Empresário</p>
                </div>
              </div>
              <p className="text-lfcom-gray-600">
                "A análise de risco da LFCOM me salvou de um grande problema. Identificaram pendências jurídicas que passariam despercebidas em uma análise tradicional."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-lfcom-gray-600 max-w-3xl mx-auto">
              Tire suas dúvidas sobre nossa plataforma e como ela pode ajudar nos seus investimentos.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg border border-lfcom-gray-200">
              <h3 className="text-xl font-bold mb-2">Quanto tempo leva para gerar um relatório?</h3>
              <p className="text-lfcom-gray-600">
                Nossos relatórios são gerados em minutos, dependendo da complexidade e disponibilidade dos documentos do imóvel. O processo é totalmente automatizado e utiliza tecnologia de ponta para entregar resultados rápidos e precisos.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-lfcom-gray-200">
              <h3 className="text-xl font-bold mb-2">Como funciona a avaliação do imóvel?</h3>
              <p className="text-lfcom-gray-600">
                Nossa plataforma utiliza algoritmos de machine learning que analisam milhares de dados de transações imobiliárias, características do imóvel, localização e tendências de mercado para determinar um valor justo e preciso.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-lfcom-gray-200">
              <h3 className="text-xl font-bold mb-2">Os relatórios são aceitos por instituições financeiras?</h3>
              <p className="text-lfcom-gray-600">
                Sim, nossos relatórios são elaborados seguindo padrões técnicos rigorosos e são aceitos por diversas instituições financeiras como documento auxiliar em processos de financiamento e investimento.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-lfcom-gray-200">
              <h3 className="text-xl font-bold mb-2">É possível analisar qualquer tipo de imóvel?</h3>
              <p className="text-lfcom-gray-600">
                Nossa plataforma está otimizada para analisar imóveis residenciais, comerciais e terrenos disponíveis em leilões ou venda direta por bancos. Imóveis rurais ou com características muito específicas podem requerer análises complementares.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-20 bg-lfcom-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Pronto para investir com segurança?</h2>
            <p className="text-lg mb-8">
              Comece agora mesmo a utilizar nossa plataforma e tenha acesso a análises profissionais que irão transformar sua forma de investir em imóveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-lfcom-black hover:bg-lfcom-gray-100">
                <Link to="/precos" className="flex items-center gap-2">
                  Ver planos e preços
                </Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/nova-analise">Fazer uma análise grátis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
