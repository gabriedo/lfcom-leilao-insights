
import React from "react";
import Layout from "@/components/Layout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BookOpen, FileQuestion, Headphones, LifeBuoy, Mail, MessageCircleQuestion, Phone } from "lucide-react";

const Ajuda = () => {
  const helpCategories = [
    {
      id: "iniciantes",
      title: "Iniciantes",
      content: [
        {
          question: "Como começar com o LFCOM?",
          answer: "Para começar, crie uma conta gratuita clicando em 'Registrar' no canto superior direito. Após o registro, você terá acesso à análise gratuita para testar nossa plataforma."
        },
        {
          question: "Como funciona a análise de imóveis?",
          answer: "Nossa análise coleta dados de fontes confiáveis, processa-os com algoritmos avançados e apresenta informações relevantes sobre o imóvel, incluindo riscos jurídicos, estimativas de valor de mercado e potencial de retorno."
        },
        {
          question: "Quanto custa usar o LFCOM?",
          answer: "Oferecemos planos variados, desde análises unitárias até assinaturas mensais com acesso ilimitado. Confira todos os detalhes na nossa página de Preços."
        }
      ]
    },
    {
      id: "analises",
      title: "Análises",
      content: [
        {
          question: "Quanto tempo leva para receber uma análise?",
          answer: "Análises básicas geralmente ficam prontas em até 30 minutos. Casos mais complexos podem levar algumas horas, dependendo da disponibilidade de documentos."
        },
        {
          question: "Posso solicitar análise de qualquer imóvel?",
          answer: "Nossa plataforma foca em imóveis em leilão e venda direta de bancos. Se você precisa analisar outros tipos de imóveis, entre em contato com nossa equipe para verificar a disponibilidade."
        },
        {
          question: "Os relatórios podem ser personalizados?",
          answer: "Sim, especialmente para usuários dos planos Profissional e Empresarial, oferecemos opções de personalização dos relatórios, incluindo ênfase em aspectos específicos do imóvel."
        }
      ]
    },
    {
      id: "conta",
      title: "Conta e Pagamentos",
      content: [
        {
          question: "Como alterar meu plano?",
          answer: "Acesse sua conta, vá até 'Meu Plano' e selecione a opção de upgrade ou downgrade. Mudanças no plano são aplicadas imediatamente ou no próximo ciclo de faturamento."
        },
        {
          question: "Quais formas de pagamento são aceitas?",
          answer: "Aceitamos cartões de crédito das principais bandeiras, transferência bancária e PIX para pagamentos nacionais."
        },
        {
          question: "Como solicitar reembolso?",
          answer: "Caso não esteja satisfeito com nossos serviços nos primeiros 7 dias após a assinatura, entre em contato com nosso suporte para solicitar reembolso integral."
        }
      ]
    }
  ];

  return (
    <Layout className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Central de Ajuda</h1>
            <p className="text-lfcom-gray-600 max-w-2xl mx-auto">
              Encontre respostas para suas dúvidas e aprenda a tirar o máximo proveito da plataforma LFCOM.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="border border-lfcom-gray-200 hover:border-lfcom-black transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <BookOpen className="h-10 w-10 mb-4 text-lfcom-black" />
                  <h3 className="font-semibold mb-2">Guias e Tutoriais</h3>
                  <p className="text-sm text-lfcom-gray-600 mb-4">Aprenda com nossos guias passo-a-passo</p>
                  <Button variant="outline" className="mt-2">Ver Guias</Button>
                </CardContent>
              </Card>
              
              <Card className="border border-lfcom-gray-200 hover:border-lfcom-black transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <FileQuestion className="h-10 w-10 mb-4 text-lfcom-black" />
                  <h3 className="font-semibold mb-2">FAQ</h3>
                  <p className="text-sm text-lfcom-gray-600 mb-4">Perguntas frequentes sobre a plataforma</p>
                  <Button variant="outline" className="mt-2" asChild>
                    <Link to="/faq">Ver FAQ</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border border-lfcom-gray-200 hover:border-lfcom-black transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <Headphones className="h-10 w-10 mb-4 text-lfcom-black" />
                  <h3 className="font-semibold mb-2">Suporte</h3>
                  <p className="text-sm text-lfcom-gray-600 mb-4">Fale diretamente com nossa equipe</p>
                  <Button variant="outline" className="mt-2" asChild>
                    <Link to="/contato">Contatar Suporte</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Busca Rápida por Categoria</h2>
              <Tabs defaultValue="iniciantes" className="w-full">
                <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-6">
                  {helpCategories.map(category => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {helpCategories.map(category => (
                  <TabsContent key={category.id} value={category.id}>
                    <Accordion type="single" collapsible className="w-full">
                      {category.content.map((item, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left font-medium">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-lfcom-gray-600">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>
          
          <div className="bg-lfcom-gray-100 rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Ainda precisa de ajuda?</h2>
            <p className="mb-6 text-lfcom-gray-600">
              Nossa equipe está pronta para ajudar você com qualquer dúvida ou problema.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center">
                  <Mail className="h-8 w-8 mb-3 text-lfcom-black" />
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-sm text-lfcom-gray-600">suporte@lfcom.com.br</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center">
                  <Phone className="h-8 w-8 mb-3 text-lfcom-black" />
                  <h3 className="font-medium mb-1">Telefone</h3>
                  <p className="text-sm text-lfcom-gray-600">(11) 3456-7890</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center">
                  <MessageCircleQuestion className="h-8 w-8 mb-3 text-lfcom-black" />
                  <h3 className="font-medium mb-1">Chat ao Vivo</h3>
                  <p className="text-sm text-lfcom-gray-600">Dias úteis, 9h às 18h</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Ajuda;
