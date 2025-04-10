
import { useState } from "react";
import { Check, FileText, Search, Gauge, AlertTriangle, BarChart, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FeatureHighlights() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: "matricula",
      title: "Análise de Matrícula",
      description: "Avaliação detalhada do histórico da propriedade, gravames e ônus reais.",
      icon: <FileText className="h-10 w-10 text-lfcom-black" />,
      details: [
        "Identificação de restrições e ônus que podem afetar o imóvel",
        "Verificação da cadeia dominial completa para segurança jurídica",
        "Análise de eventuais pendências judiciais associadas à matrícula",
        "Verificação de hipotecas, penhoras e outras garantias reais",
        "Avaliação de direitos reais de terceiros (servidões, usufrutos)",
      ],
      expandedDescription: "Nossa análise de matrícula vai além da simples leitura do documento. Utilizamos inteligência artificial para extrair e interpretar todas as informações relevantes, identificando possíveis problemas que poderiam passar despercebidos em uma análise convencional. Examinamos cada averbação e registro para garantir que você tenha conhecimento completo da situação jurídica do imóvel."
    },
    {
      id: "edital",
      title: "Análise de Edital",
      description: "Interpretação das condições do leilão, requisitos e restrições especiais.",
      icon: <Search className="h-10 w-10 text-lfcom-black" />,
      details: [
        "Verificação das exigências para participação no leilão",
        "Análise dos prazos e condições de pagamento",
        "Identificação de responsabilidades do arrematante",
        "Avaliação de possíveis pendências que serão transmitidas ao novo proprietário",
        "Detalhamento das garantias oferecidas pelo leiloeiro ou instituição financeira",
      ],
      expandedDescription: "O edital de um leilão contém informações cruciais que podem determinar o sucesso ou fracasso do seu investimento. Nossa análise examina minuciosamente todas as cláusulas do documento, traduzindo a linguagem jurídica em informações claras e práticas. Identificamos condições especiais, riscos ocultos e oportunidades que podem passar despercebidas."
    },
    {
      id: "avaliacao",
      title: "Avaliação do Imóvel",
      description: "Determinação precisa do valor de mercado com base em dados comparativos.",
      icon: <Gauge className="h-10 w-10 text-lfcom-black" />,
      details: [
        "Comparativo de preços com imóveis similares na mesma região",
        "Análise das tendências do mercado imobiliário local",
        "Avaliação do potencial de valorização a curto e médio prazo",
        "Consideração de fatores que influenciam o valor (localização, infraestrutura)",
        "Estimativa de custos de regularização e adequação do imóvel",
      ],
      expandedDescription: "Nossa metodologia de avaliação utiliza algoritmos avançados e bases de dados atualizadas para determinar o valor justo de mercado. Combinamos análise tecnológica com experiência imobiliária para oferecer um panorama completo do valor real do imóvel, considerando não apenas seu estado atual, mas também seu potencial futuro de valorização."
    },
    {
      id: "viabilidade",
      title: "Viabilidade Financeira",
      description: "Projeções de retorno sobre investimento, custos de reforma e valorização.",
      icon: <BarChart className="h-10 w-10 text-lfcom-black" />,
      details: [
        "Análise completa dos custos de aquisição (impostos, taxas, escritura)",
        "Estimativa de investimentos necessários para reforma ou adequação",
        "Projeção de fluxo de caixa para cenários de revenda ou locação",
        "Cálculo da taxa interna de retorno e payback do investimento",
        "Comparativo com outras oportunidades de investimento do mercado",
      ],
      expandedDescription: "Para além do preço de compra, existem diversos fatores que impactam a viabilidade financeira de um imóvel em leilão. Nossa análise considera todos os custos envolvidos na aquisição, reforma e regularização, bem como projeta cenários realistas de retorno financeiro, permitindo que você tome decisões baseadas em dados concretos e não em suposições."
    },
    {
      id: "riscos",
      title: "Análise de Riscos",
      description: "Identificação de fatores de risco legais, físicos e financeiros do imóvel.",
      icon: <AlertTriangle className="h-10 w-10 text-lfcom-black" />,
      details: [
        "Verificação de pendências legais que podem afetar a transferência do imóvel",
        "Análise de riscos ambientais e estruturais da propriedade",
        "Avaliação de possíveis problemas com a ocupação do imóvel",
        "Identificação de dívidas condominiais e tributárias pendentes",
        "Matriz de riscos com probabilidade e impacto de cada fator",
      ],
      expandedDescription: "Investir em imóveis de leilão envolve riscos específicos que precisam ser identificados e avaliados adequadamente. Nossa análise utiliza uma metodologia exclusiva para mapear todos os potenciais problemas, desde questões jurídicas até características físicas do imóvel, apresentando uma avaliação clara dos riscos envolvidos e as estratégias para mitigá-los."
    },
    {
      id: "relatorio",
      title: "Relatório Profissional",
      description: "Documento completo e detalhado para embasar decisões de investimento.",
      icon: <Check className="h-10 w-10 text-lfcom-black" />,
      details: [
        "Consolidação de todas as análises em um documento estruturado e objetivo",
        "Parecer final sobre a viabilidade geral do investimento",
        "Recomendações estratégicas para maximizar o retorno",
        "Indicadores-chave de desempenho para acompanhamento do investimento",
        "Suporte documental para negociação de financiamento bancário",
      ],
      expandedDescription: "Nosso relatório final vai além de uma simples compilação de dados. Ele representa uma análise profissional completa que organiza todas as informações relevantes de forma clara e objetiva, facilitando sua tomada de decisão. O documento serve como base sólida para negociações, captação de recursos e definição da estratégia de investimento."
    },
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(activeFeature === featureId ? null : featureId);
  };

  return (
    <section className="py-20 bg-lfcom-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Análise Completa e Profissional</h2>
          <p className="text-lfcom-gray-600 max-w-2xl mx-auto">
            Nossa plataforma realiza uma análise minuciosa de todas as dimensões relevantes para tomada de decisão em imóveis de leilão.
          </p>
        </div>

        <Tabs defaultValue="cards" className="w-full mb-12">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="cards">Visão Geral</TabsTrigger>
            <TabsTrigger value="detailed">Detalhado</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cards" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => (
                <Card 
                  key={feature.id} 
                  className={`lfcom-card border border-lfcom-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                    activeFeature === feature.id ? 'ring-2 ring-lfcom-black' : ''
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="flex items-start justify-between">
                      {feature.title}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 rounded-full" 
                              onClick={() => handleFeatureClick(feature.id)}
                            >
                              <ArrowRight className={`h-4 w-4 transition-transform ${
                                activeFeature === feature.id ? 'rotate-90' : ''
                              }`} />
                              <span className="sr-only">Detalhes</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Ver mais detalhes</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-lfcom-gray-600 text-sm">
                      {feature.description}
                    </CardDescription>
                    
                    <Collapsible
                      open={activeFeature === feature.id}
                      className="mt-4"
                    >
                      <CollapsibleContent className="space-y-4">
                        <p className="text-sm text-lfcom-gray-700">{feature.expandedDescription}</p>
                        <ul className="space-y-2">
                          {feature.details.map((item, idx) => (
                            <li key={idx} className="flex items-start text-sm">
                              <Check className="h-4 w-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-lfcom-black hover:bg-lfcom-gray-100 p-0"
                      onClick={() => handleFeatureClick(feature.id)}
                    >
                      {activeFeature === feature.id ? 'Ver menos' : 'Saiba mais'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="mt-6 bg-lfcom-gray-50 p-6 rounded-lg">
            <Accordion type="single" collapsible className="w-full">
              {features.map((feature) => (
                <AccordionItem key={feature.id} value={feature.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center">
                      <div className="bg-white p-2 rounded-md mr-3">
                        {feature.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="text-xl font-semibold">{feature.title}</h3>
                        <p className="text-sm text-lfcom-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white p-4 rounded-lg mt-2">
                    <div className="mb-4">
                      <p className="text-lfcom-gray-800">{feature.expandedDescription}</p>
                    </div>
                    <div className="bg-lfcom-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">O que incluímos na análise:</h4>
                      <ul className="space-y-3">
                        {feature.details.map((item, idx) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>
        
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-lfcom-gray-900 to-lfcom-black text-white rounded-xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">Pronto para tomar decisões embasadas em dados concretos?</h3>
            <p className="text-lfcom-gray-300 mb-6">
              Não arrisque seu investimento baseado em palpites. Nossa análise profissional identifica oportunidades e riscos que podem passar despercebidos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                className="bg-white text-lfcom-black hover:bg-lfcom-gray-200 h-12 px-8 rounded-md group"
              >
                <Link to="/nova-analise" className="flex items-center">
                  Solicitar Análise Completa
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 h-12 px-8 rounded-md"
              >
                <Link to="/como-funciona">Conhecer Metodologia</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
