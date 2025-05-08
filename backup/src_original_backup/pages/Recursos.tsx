
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, BookOpen, Building, Calculator, FileText, ShieldCheck } from "lucide-react";

const Recursos = () => {
  const ferramentas = [
    {
      id: "analise-imoveis",
      title: "Análise de Imóveis",
      icon: <Building className="h-8 w-8 text-lfcom-black" />,
      description: "Relatórios detalhados sobre riscos jurídicos, oportunidades e potencial de retorno em imóveis de leilão e venda direta.",
      features: [
        "Verificação de matrícula e identificação de ônus",
        "Análise de regularidade documental",
        "Avaliação de risco de desocupação",
        "Estimativa de custos de regularização",
        "Projeção de valorização"
      ],
      cta: "/nova-analise"
    },
    {
      id: "calculadoras",
      title: "Calculadoras Financeiras",
      icon: <Calculator className="h-8 w-8 text-lfcom-black" />,
      description: "Ferramentas para estimar custos, financiamentos e retorno sobre investimento em imóveis.",
      features: [
        "Simulação de financiamento imobiliário",
        "Cálculo de ROI para investimentos",
        "Estimativa de custos de reforma",
        "Comparativo entre comprar e alugar",
        "Projeção de fluxo de caixa para aluguel"
      ],
      cta: "/calculadoras"
    },
    {
      id: "monitoramento",
      title: "Monitoramento de Mercado",
      icon: <BarChart3 className="h-8 w-8 text-lfcom-black" />,
      description: "Acompanhamento em tempo real do mercado de leilões e imóveis de bancos.",
      features: [
        "Alertas de novos leilões em regiões de interesse",
        "Comparativo de preços por região",
        "Histórico de vendas e arrematações",
        "Tendências de mercado",
        "Dashboard personalizado"
      ],
      cta: "/monitoramento"
    },
    {
      id: "seguranca-juridica",
      title: "Segurança Jurídica",
      icon: <ShieldCheck className="h-8 w-8 text-lfcom-black" />,
      description: "Ferramentas para garantir segurança jurídica nas transações imobiliárias.",
      features: [
        "Verificação automática de documentação",
        "Análise de jurisprudência relacionada",
        "Identificação de riscos legais",
        "Modelos de documentos personalizáveis",
        "Orientação para regularização"
      ],
      cta: "/seguranca-juridica"
    }
  ];

  const conteudos = [
    {
      title: "Guias e E-books",
      icon: <BookOpen className="h-8 w-8 text-lfcom-black" />,
      description: "Materiais educativos para aprofundar seu conhecimento sobre investimentos em imóveis.",
      link: "/conteudos?tipo=guias"
    },
    {
      title: "Relatórios de Mercado",
      icon: <FileText className="h-8 w-8 text-lfcom-black" />,
      description: "Análises periódicas sobre tendências e oportunidades no mercado imobiliário de leilões.",
      link: "/conteudos?tipo=relatorios"
    },
    {
      title: "Catálogo de Leiloeiros",
      icon: <Building className="h-8 w-8 text-lfcom-black" />,
      description: "Diretório completo de leiloeiros oficiais credenciados em todo o Brasil.",
      link: "/leiloeiros"
    }
  ];

  return (
    <Layout className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Recursos do LFCOM</h1>
          <p className="text-lfcom-gray-600 max-w-2xl mx-auto">
            Conheça todas as ferramentas e recursos disponíveis para ajudar você a tomar decisões mais seguras 
            e lucrativas em investimentos imobiliários.
          </p>
        </div>

        <Tabs defaultValue="ferramentas" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="ferramentas">Ferramentas</TabsTrigger>
            <TabsTrigger value="conteudos">Conteúdos e Recursos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ferramentas" className="space-y-8">
            {ferramentas.map((tool) => (
              <Card key={tool.id} className="overflow-hidden border border-lfcom-gray-200">
                <CardHeader className="bg-lfcom-gray-50 border-b border-lfcom-gray-200">
                  <div className="flex items-center gap-4">
                    {tool.icon}
                    <div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <CardDescription className="mt-1">{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Recursos incluídos:</h4>
                    <ul className="space-y-2">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-lfcom-gray-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-lfcom-black"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className="w-full bg-lfcom-black hover:bg-lfcom-gray-800" asChild>
                    <Link to={tool.cta}>
                      Acessar {tool.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="conteudos">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {conteudos.map((content, index) => (
                <Card key={index} className="border border-lfcom-gray-200 hover:border-lfcom-black transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4">
                        {content.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{content.title}</h3>
                      <p className="text-lfcom-gray-600 mb-6">{content.description}</p>
                      <Button variant="outline" className="border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100" asChild>
                        <Link to={content.link}>
                          Acessar
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-12 bg-white p-8 rounded-lg border border-lfcom-gray-200 text-center">
              <h2 className="text-xl font-semibold mb-4">Precisa de recursos personalizados?</h2>
              <p className="text-lfcom-gray-600 mb-6 max-w-2xl mx-auto">
                Nossa equipe pode desenvolver soluções customizadas para atender às necessidades específicas 
                do seu negócio ou projeto de investimento.
              </p>
              <Button className="bg-lfcom-black hover:bg-lfcom-gray-800 min-w-[200px]" asChild>
                <Link to="/assessoria">Solicitar Assessoria</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Recursos;
