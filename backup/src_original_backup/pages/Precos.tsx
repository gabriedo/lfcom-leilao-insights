
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  FileText, 
  BarChart3, 
  Clock, 
  Building, 
  Users, 
  Zap 
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Precos() {
  const plans = [
    {
      name: "Básico",
      description: "Ideal para investidores iniciantes",
      price: "R$ 99",
      period: "por análise",
      features: [
        { name: "Análise de matrícula", included: true },
        { name: "Análise de edital", included: true },
        { name: "Avaliação do imóvel", included: true },
        { name: "Análise de riscos básica", included: true },
        { name: "Relatório em PDF", included: true },
        { name: "Histórico de análises (30 dias)", included: true },
        { name: "Análise financeira avançada", included: false },
        { name: "Acesso à base de dados exclusiva", included: false },
        { name: "Suporte prioritário", included: false },
      ],
      popular: false,
      cta: "Começar agora"
    },
    {
      name: "Profissional",
      description: "Para investidores experientes",
      price: "R$ 249",
      period: "por mês",
      features: [
        { name: "Análise de matrícula", included: true },
        { name: "Análise de edital", included: true },
        { name: "Avaliação do imóvel", included: true },
        { name: "Análise de riscos completa", included: true },
        { name: "Relatório em PDF", included: true },
        { name: "Histórico de análises ilimitado", included: true },
        { name: "Análise financeira avançada", included: true },
        { name: "Acesso à base de dados exclusiva", included: true },
        { name: "Suporte prioritário", included: false },
      ],
      popular: true,
      cta: "Assinar agora"
    },
    {
      name: "Empresarial",
      description: "Para empresas e corretoras",
      price: "R$ 599",
      period: "por mês",
      features: [
        { name: "Análise de matrícula", included: true },
        { name: "Análise de edital", included: true },
        { name: "Avaliação do imóvel", included: true },
        { name: "Análise de riscos completa", included: true },
        { name: "Relatório em PDF com marca personalizada", included: true },
        { name: "Histórico de análises ilimitado", included: true },
        { name: "Análise financeira avançada", included: true },
        { name: "Acesso à base de dados exclusiva", included: true },
        { name: "Suporte prioritário 24/7", included: true },
      ],
      popular: false,
      cta: "Falar com consultor"
    }
  ];

  const faqItems = [
    {
      question: "Como funciona a cobrança?",
      answer: "Para o plano Básico, a cobrança é feita por análise realizada. Já para os planos Profissional e Empresarial, a cobrança é mensal com acesso ilimitado às análises dentro da sua cota. Aceitamos cartões de crédito, boleto bancário e PIX."
    },
    {
      question: "Posso cancelar a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas adicionais. O acesso permanecerá ativo até o final do período já pago."
    },
    {
      question: "Existe algum período de teste?",
      answer: "Oferecemos uma análise gratuita para que você possa conhecer nossa plataforma e avaliar a qualidade dos nossos relatórios antes de assinar qualquer plano."
    },
    {
      question: "O que acontece se eu ultrapassar o limite de análises do meu plano?",
      answer: "Caso ultrapasse o limite de análises do seu plano, você poderá adquirir análises adicionais com valores especiais ou fazer um upgrade para um plano com maior capacidade."
    },
    {
      question: "Como faço para mudar de plano?",
      answer: "Você pode mudar de plano a qualquer momento através do painel de controle da sua conta. Se estiver fazendo upgrade, o valor será ajustado proporcionalmente ao período restante. Se for downgrade, a mudança ocorrerá ao final do ciclo atual."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Planos e preços para cada perfil de investidor</h1>
            <p className="text-lg text-lfcom-gray-600 mb-8">
              Escolha o plano ideal para suas necessidades e transforme sua forma de analisar oportunidades em imóveis de leilão e venda direta.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border ${plan.popular ? 'border-lfcom-black shadow-lg' : 'border-lfcom-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <span className="bg-lfcom-black text-white px-4 py-1 text-sm rounded-full">
                      Mais popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-lfcom-gray-600 ml-2">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        {feature.included ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-lfcom-gray-400 mt-0.5" />
                        )}
                        <span className={feature.included ? "text-lfcom-gray-800" : "text-lfcom-gray-500"}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-lfcom-black text-white hover:bg-lfcom-gray-800' : 'bg-white border-2 border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100'}`}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <p className="text-center text-lfcom-gray-500 mt-8">
            Precisa de um plano personalizado para sua empresa? <Link to="/contato" className="text-lfcom-black font-medium underline">Entre em contato</Link>.
          </p>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-20 bg-lfcom-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Comparação detalhada dos planos</h2>
            <p className="text-lfcom-gray-600 max-w-3xl mx-auto">
              Conheça todos os recursos disponíveis em cada plano e escolha o que melhor atende às suas necessidades.
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm border border-lfcom-gray-200">
              <thead>
                <tr className="border-b border-lfcom-gray-200">
                  <th className="p-4 text-left">Recursos</th>
                  <th className="p-4 text-center">Básico</th>
                  <th className="p-4 text-center bg-lfcom-gray-100">Profissional</th>
                  <th className="p-4 text-center">Empresarial</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-lfcom-gray-200">
                  <td className="p-4 font-medium">Análises mensais</td>
                  <td className="p-4 text-center">1 (avulsa)</td>
                  <td className="p-4 text-center bg-lfcom-gray-100">10</td>
                  <td className="p-4 text-center">30</td>
                </tr>
                <tr className="border-b border-lfcom-gray-200">
                  <td className="p-4 font-medium">Extração automática de dados</td>
                  <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center bg-lfcom-gray-100"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-lfcom-gray-200">
                  <td className="p-4 font-medium">Análise de documentos</td>
                  <td className="p-4 text-center">Básica</td>
                  <td className="p-4 text-center bg-lfcom-gray-100">Completa</td>
                  <td className="p-4 text-center">Completa + Jurídica</td>
                </tr>
                <tr className="border-b border-lfcom-gray-200">
                  <td className="p-4 font-medium">Avaliação de imóvel</td>
                  <td className="p-4 text-center">Básica</td>
                  <td className="p-4 text-center bg-lfcom-gray-100">Avançada</td>
                  <td className="p-4 text-center">Premium</td>
                </tr>
                <tr className="border-b border-lfcom-gray-200">
                  <td className="p-4 font-medium">Histórico de análises</td>
                  <td className="p-4 text-center">30 dias</td>
                  <td className="p-4 text-center bg-lfcom-gray-100">12 meses</td>
                  <td className="p-4 text-center">Ilimitado</td>
                </tr>
                <tr className="border-b border-lfcom-gray-200">
                  <td className="p-4 font-medium">Relatório personalizado</td>
                  <td className="p-4 text-center"><XCircle className="h-5 w-5 text-lfcom-gray-400 mx-auto" /></td>
                  <td className="p-4 text-center bg-lfcom-gray-100"><XCircle className="h-5 w-5 text-lfcom-gray-400 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-lfcom-gray-200">
                  <td className="p-4 font-medium">API de integração</td>
                  <td className="p-4 text-center"><XCircle className="h-5 w-5 text-lfcom-gray-400 mx-auto" /></td>
                  <td className="p-4 text-center bg-lfcom-gray-100"><XCircle className="h-5 w-5 text-lfcom-gray-400 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b border-lfcom-gray-200">
                  <td className="p-4 font-medium">Usuários</td>
                  <td className="p-4 text-center">1</td>
                  <td className="p-4 text-center bg-lfcom-gray-100">2</td>
                  <td className="p-4 text-center">5+</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Suporte</td>
                  <td className="p-4 text-center">E-mail</td>
                  <td className="p-4 text-center bg-lfcom-gray-100">E-mail + Chat</td>
                  <td className="p-4 text-center">E-mail + Chat + Telefone</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que escolher a LFCOM?</h2>
            <p className="text-lfcom-gray-600 max-w-3xl mx-auto">
              Descubra como nossa plataforma oferece vantagens únicas para sua estratégia de investimentos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-lfcom-gray-100 p-4 rounded-full mb-4">
                <Zap className="h-8 w-8 text-lfcom-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rapidez nas análises</h3>
              <p className="text-lfcom-gray-600">
                Obtenha análises completas em minutos, não em semanas, permitindo decisões ágeis em um mercado competitivo.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-lfcom-gray-100 p-4 rounded-full mb-4">
                <FileText className="h-8 w-8 text-lfcom-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Relatórios profissionais</h3>
              <p className="text-lfcom-gray-600">
                Documentos detalhados e bem estruturados que oferecem uma visão clara e abrangente do imóvel analisado.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-lfcom-gray-100 p-4 rounded-full mb-4">
                <BarChart3 className="h-8 w-8 text-lfcom-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Análise financeira precisa</h3>
              <p className="text-lfcom-gray-600">
                Projeções financeiras baseadas em dados reais de mercado para embasar suas decisões de investimento.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-lfcom-gray-100 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-lfcom-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Economia de tempo</h3>
              <p className="text-lfcom-gray-600">
                Deixe a busca e análise de documentos por nossa conta e foque no que realmente importa: decidir quais imóveis adquirir.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-lfcom-gray-100 p-4 rounded-full mb-4">
                <Building className="h-8 w-8 text-lfcom-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expertise imobiliária</h3>
              <p className="text-lfcom-gray-600">
                Algoritmos treinados por especialistas do mercado imobiliário, combinando tecnologia e conhecimento humano.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-lfcom-gray-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-lfcom-black" />
              </div>
              <h3 className="text-xl font-bold mb-2">Suporte especializado</h3>
              <p className="text-lfcom-gray-600">
                Conte com uma equipe de especialistas prontos para auxiliar em questões técnicas e estratégicas sobre seus investimentos.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="py-20 bg-lfcom-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Perguntas frequentes sobre preços e planos</h2>
            <p className="text-lfcom-gray-600 max-w-3xl mx-auto">
              Tire suas dúvidas sobre nossos planos, pagamentos e condições.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-lfcom-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-lfcom-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Comece sua jornada de investimentos mais seguros hoje</h2>
            <p className="text-lg mb-8">
              Experimente gratuitamente nossa plataforma e descubra como transformar sua forma de analisar oportunidades em imóveis de leilão.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-lfcom-black hover:bg-lfcom-gray-100">
                <Link to="/nova-analise" className="flex items-center gap-2">
                  Fazer análise gratuita <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/contato">Falar com um consultor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
