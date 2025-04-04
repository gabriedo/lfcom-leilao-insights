
import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const faqs = [
    {
      category: "Geral",
      questions: [
        {
          question: "O que é o LFCOM?",
          answer: "O LFCOM é uma plataforma especializada em análise de imóveis em leilão e venda direta de bancos. Utilizamos tecnologia avançada e expertise imobiliária para extrair, analisar e interpretar dados de editais, matrículas e mercado, oferecendo relatórios profissionais que ajudam investidores a tomar decisões mais seguras."
        },
        {
          question: "Como o LFCOM pode me ajudar?",
          answer: "O LFCOM ajuda investidores e compradores de imóveis a avaliar oportunidades em leilões com maior segurança e precisão. Nossa plataforma automatiza a análise de documentos, identifica riscos, calcula valores de mercado e projeta retornos potenciais, economizando seu tempo e reduzindo riscos na tomada de decisão."
        },
        {
          question: "Quem pode utilizar o LFCOM?",
          answer: "O LFCOM é ideal para investidores imobiliários, compradores de primeira viagem interessados em leilões, corretores de imóveis, advogados especializados em direito imobiliário e empresas do setor. Temos planos adaptados para diferentes necessidades, desde iniciantes até profissionais experientes."
        }
      ]
    },
    {
      category: "Análises e Relatórios",
      questions: [
        {
          question: "Quais informações são incluídas nas análises?",
          answer: "Nossas análises incluem: verificação detalhada da matrícula e ônus reais, interpretação do edital e condições do leilão, avaliação do valor de mercado do imóvel, análise de riscos jurídicos e físicos, projeção de custos adicionais (reformas, regularização, etc.), cálculo de viabilidade financeira e retorno sobre investimento, e recomendações personalizadas."
        },
        {
          question: "Quanto tempo leva para receber uma análise completa?",
          answer: "O tempo de processamento depende da complexidade do imóvel e da documentação disponível. Em geral, análises básicas ficam prontas em até 30 minutos. Casos mais complexos podem levar algumas horas. Nossa plataforma trabalha 24/7, então você receberá notificações assim que sua análise estiver pronta."
        },
        {
          question: "As análises são confiáveis?",
          answer: "Sim, nossas análises combinam tecnologia avançada com conhecimento especializado do mercado imobiliário. Utilizamos dados atualizados de mercado, jurisprudência recente e parâmetros técnicos validados por profissionais do setor. Entretanto, recomendamos que decisões finais sejam tomadas considerando também a orientação de advogados e outros especialistas quando necessário."
        }
      ]
    },
    {
      category: "Planos e Pagamentos",
      questions: [
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
        }
      ]
    },
    {
      category: "Suporte e Dúvidas Técnicas",
      questions: [
        {
          question: "Como obtenho suporte técnico?",
          answer: "Oferecemos diferentes canais de suporte conforme seu plano. Todos os usuários têm acesso ao suporte por e-mail. Clientes dos planos Profissional e Empresarial também contam com chat ao vivo e, no caso do plano Empresarial, suporte telefônico dedicado."
        },
        {
          question: "Posso solicitar ajuda na interpretação dos relatórios?",
          answer: "Sim, oferecemos orientação para interpretação dos relatórios. Para casos mais complexos que exijam consultoria especializada, oferecemos serviços adicionais ou encaminhamento para parceiros qualificados, dependendo do seu plano."
        },
        {
          question: "A plataforma funciona em dispositivos móveis?",
          answer: "Sim, o LFCOM é totalmente responsivo e funciona em smartphones, tablets e computadores. Você pode acessar suas análises, fazer uploads de documentos e gerenciar sua conta de qualquer dispositivo com acesso à internet."
        }
      ]
    }
  ];

  // Filter FAQs based on search term
  const filteredFaqs = searchTerm 
    ? faqs.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
               q.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0)
    : faqs;

  return (
    <Layout>
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Perguntas Frequentes</h1>
            <p className="text-lfcom-gray-600 max-w-2xl mx-auto">
              Encontre respostas para as principais dúvidas sobre nossa plataforma, serviços e como podemos ajudar em seus investimentos imobiliários.
            </p>
            
            {/* Search */}
            <div className="mt-8 max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lfcom-gray-500 h-4 w-4" />
                <Input
                  placeholder="Buscar perguntas frequentes..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lfcom-gray-600">Nenhum resultado encontrado.</p>
              <p className="mt-2">Tente outra pesquisa ou entre em contato com nosso suporte.</p>
              <Button className="mt-4 bg-lfcom-black hover:bg-lfcom-gray-800">
                <Link to="/contato">Entrar em Contato</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-10">
              {filteredFaqs.map((category, index) => (
                <div key={index} className="space-y-4">
                  <h2 className="text-xl font-semibold border-b pb-2">{category.category}</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                        <AccordionTrigger className="text-left font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-lfcom-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-16 bg-lfcom-gray-100 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-3">Ainda tem dúvidas?</h2>
            <p className="mb-4 text-lfcom-gray-600">
              Nossa equipe está pronta para ajudar você com qualquer pergunta adicional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" className="border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-200">
                <Link to="/contato">Falar com Suporte</Link>
              </Button>
              <Button className="bg-lfcom-black text-white hover:bg-lfcom-gray-800">
                <Link to="/nova-analise">Testar Gratuitamente</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
