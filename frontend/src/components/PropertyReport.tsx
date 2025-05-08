import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertCircle, 
  Download, 
  FileText, 
  Home, 
  Map, 
  Receipt, 
  Scale, 
  Star, 
  CircleDollarSign,
  CalendarCheck,
  BarChart4,
  FileWarning,
  CheckCircle,
  Gavel,
  Building,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Calculator,
  QrCode
} from "lucide-react";
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
import { generatePropertyReportPDF } from "@/utils/pdfService";

type PropertyReportProps = {
  propertyId?: string;
};

export default function PropertyReport({ propertyId }: PropertyReportProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { toast } = useToast();
  
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const propertyDetails = {
    id: propertyId || "123456",
    address: "Rua das Flores, 123 - Apto 304, Jardim América, São Paulo/SP",
    type: "Apartamento",
    area: "75m²",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    minimumBid: "R$ 245.000,00",
    marketValue: "R$ 410.000,00",
    discount: "40%",
    age: "15 anos",
    condition: "Bom",
    location: {
      neighborhood: "Jardim América",
      city: "São Paulo",
      state: "SP",
      coordinates: {
        lat: -23.564,
        lng: -46.652
      }
    },
    auction: {
      date: "15/05/2025",
      type: "Online",
      institution: "Banco XYZ",
      process: "0001234-56.2023.8.26.0100",
      minimumIncrease: "R$ 1.000,00"
    }
  };

  const riskScores = {
    legal: 90,
    financial: 85,
    physical: 75,
    overall: 85,
  };

  const recommendations = [
    "Imóvel apresenta elevado potencial de valorização devido à localização privilegiada em área de crescente desenvolvimento comercial.",
    "Recomenda-se a vistoria presencial para verificação das condições físicas, especialmente com foco na parte hidráulica e elétrica.",
    "Processo de leilão sem irregularidades identificadas na documentação analisada. Todos os requisitos legais estão atendidos.",
    "Encargos a serem assumidos já considerados na análise financeira, incluindo IPTU atrasado e taxa condominial.",
    "Considerar propor um lance inicial 5% acima do valor mínimo para maior chance de arrematação.",
    "Contratar seguro imobiliário logo após a arrematação para proteção do investimento."
  ];

  const registryAnalysis = {
    number: "124.567",
    notaryOffice: "5º Cartório de Registro de Imóveis de São Paulo",
    ownershipHistory: [
      { owner: "Maria Silva", period: "2010-2020", acquisition: "Compra e Venda" },
      { owner: "João Pereira", period: "2000-2010", acquisition: "Herança" },
      { owner: "Antônio Pereira", period: "1985-2000", acquisition: "Compra e Venda" }
    ],
    liens: [
      { type: "Penhora", creditor: "Fazenda Nacional", value: "R$ 45.000,00", process: "0005678-90.2019.8.26.0100", status: "Ativo" }
    ],
    easements: [],
    observations: "Não foram identificados outros ônus que impeçam a aquisição do imóvel. A penhora existente será baixada após a arrematação, conforme previsto no edital."
  };

  const auctionAnalysis = {
    editalNumber: "ED-SP-2025/123",
    requirements: [
      "Depósito de caução de 5% do valor do lance",
      "Pagamento integral em até 24 horas após a arrematação",
      "Comissão do leiloeiro de 5% sobre o valor da arrematação"
    ],
    conditions: [
      "Imóvel será entregue no estado de conservação em que se encontra",
      "Débitos de IPTU anteriores à arrematação serão quitados pelo vendedor",
      "Despesas com escritura e registro por conta do arrematante"
    ],
    restrictions: [
      "Proibição de ceder ou transferir direitos antes da escritura definitiva",
      "Impossibilidade de desistência após homologação do lance"
    ],
    penalties: [
      "Perda da caução em caso de desistência",
      "Multa de 20% sobre o valor da arrematação em caso de não pagamento no prazo"
    ]
  };

  const propertyValuation = {
    marketPrice: "R$ 410.000,00",
    pricePerSquareMeter: "R$ 5.466,67",
    comparativeProperties: [
      { address: "Rua das Flores, 145", area: "72m²", price: "R$ 395.000,00", pricePerSqm: "R$ 5.486,11" },
      { address: "Av. Paulista, 1578", area: "80m²", price: "R$ 450.000,00", pricePerSqm: "R$ 5.625,00" },
      { address: "Rua Augusta, 722", area: "70m²", price: "R$ 380.000,00", pricePerSqm: "R$ 5.428,57" }
    ],
    neighborhoodTrends: [
      { period: "Último ano", variation: "+8.5%" },
      { period: "Últimos 3 anos", variation: "+15.2%" },
      { period: "Últimos 5 anos", variation: "+22.7%" }
    ],
    factors: [
      { name: "Proximidade a transporte público", impact: "Alto positivo" },
      { name: "Segurança da região", impact: "Médio positivo" },
      { name: "Infraestrutura comercial", impact: "Alto positivo" },
      { name: "Qualidade das vias de acesso", impact: "Médio positivo" }
    ]
  };

  const financialAnalysis = {
    acquisitionCosts: [
      { name: "Lance mínimo", value: "R$ 245.000,00" },
      { name: "Comissão do leiloeiro (5%)", value: "R$ 12.250,00" },
      { name: "ITBI (3%)", value: "R$ 7.350,00" },
      { name: "Custas de escritura e registro", value: "R$ 5.100,00" }
    ],
    renovationCosts: [
      { name: "Pintura geral", value: "R$ 8.000,00" },
      { name: "Reforma de piso", value: "R$ 6.000,00" },
      { name: "Atualização elétrica", value: "R$ 4.000,00" },
      { name: "Reforma de banheiro", value: "R$ 7.000,00" }
    ],
    investmentScenarios: [
      {
        type: "Revenda após reforma",
        investmentTotal: "R$ 292.700,00",
        expectedReturn: "R$ 430.000,00",
        profit: "R$ 137.300,00",
        roi: "46.9%",
        timeframe: "6-8 meses"
      },
      {
        type: "Locação",
        investmentTotal: "R$ 292.700,00",
        monthlyIncome: "R$ 2.200,00",
        annualYield: "9.0%",
        breakeven: "11.1 anos"
      }
    ]
  };

  const riskAnalysis = {
    legal: [
      { risk: "Contestação judicial da arrematação", probability: "Baixa", impact: "Alto", mitigation: "Verificação completa do processo de execução" },
      { risk: "Dívidas ocultas", probability: "Baixa", impact: "Médio", mitigation: "Análise minuciosa da matrícula e certidões" }
    ],
    financial: [
      { risk: "Custos de reforma acima do estimado", probability: "Média", impact: "Médio", mitigation: "Vistoria detalhada e orçamentos com margem de segurança" },
      { risk: "Desvalorização da região", probability: "Baixa", impact: "Alto", mitigation: "Análise das tendências imobiliárias da região" }
    ],
    physical: [
      { risk: "Problemas estruturais ocultos", probability: "Média", impact: "Alto", mitigation: "Inspeção técnica por engenheiro especializado" },
      { risk: "Ocupação irregular", probability: "Baixa", impact: "Alto", mitigation: "Verificação in loco antes da arrematação" }
    ]
  };

  const handleDownloadReport = async () => {
    try {
      setIsGeneratingPdf(true);
      toast({
        title: "Gerando relatório",
        description: "Preparando seu PDF, por favor aguarde...",
      });

      const pdfBlob = await generatePropertyReportPDF(
        propertyDetails,
        registryAnalysis,
        auctionAnalysis,
        propertyValuation,
        financialAnalysis,
        riskAnalysis,
        riskScores,
        recommendations
      );

      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const downloadLink = document.createElement("a");
      downloadLink.href = pdfUrl;
      downloadLink.download = `Relatório-Imóvel-${propertyDetails.id}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      URL.revokeObjectURL(pdfUrl);

      toast({
        title: "Relatório baixado com sucesso!",
        description: "Seu PDF foi gerado e baixado.",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o PDF. Por favor, tente novamente."
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      <Card className="lfcom-card overflow-hidden">
        <div className="bg-lfcom-black p-4 text-white flex items-center justify-between">
          <div className="flex items-center">
            <Home className="mr-2 h-5 w-5" />
            <h2 className="text-xl font-bold">Relatório de Análise de Imóvel</h2>
          </div>
          <Button variant="ghost" className="text-white hover:bg-white/10">
            <Download className="mr-2 h-4 w-4" /> Exportar PDF
          </Button>
        </div>
        
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Análise de Oportunidade - Leilão #{propertyDetails.id}</CardTitle>
              <p className="text-lfcom-gray-500 mt-1">{propertyDetails.address}</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
              Alta Viabilidade
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid grid-cols-5 max-w-3xl mb-6">
              <TabsTrigger value="summary">Resumo</TabsTrigger>
              <TabsTrigger value="legal">Jurídico</TabsTrigger>
              <TabsTrigger value="financial">Financeiro</TabsTrigger>
              <TabsTrigger value="physical">Físico</TabsTrigger>
              <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center">
                    <Map className="mr-2 h-5 w-5" /> Dados do Imóvel
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-lfcom-gray-500">Tipo:</span>
                    <span>{propertyDetails.type}</span>
                    <span className="text-lfcom-gray-500">Área:</span>
                    <span>{propertyDetails.area}</span>
                    <span className="text-lfcom-gray-500">Quartos:</span>
                    <span>{propertyDetails.bedrooms}</span>
                    <span className="text-lfcom-gray-500">Banheiros:</span>
                    <span>{propertyDetails.bathrooms}</span>
                    <span className="text-lfcom-gray-500">Vagas:</span>
                    <span>{propertyDetails.parking}</span>
                    <span className="text-lfcom-gray-500">Idade:</span>
                    <span>{propertyDetails.age}</span>
                    <span className="text-lfcom-gray-500">Conservação:</span>
                    <span>{propertyDetails.condition}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-bold text-lg flex items-center">
                    <Receipt className="mr-2 h-5 w-5" /> Dados Financeiros
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-lfcom-gray-500">Lance Mínimo:</span>
                    <span className="font-semibold">{propertyDetails.minimumBid}</span>
                    <span className="text-lfcom-gray-500">Valor de Mercado:</span>
                    <span>{propertyDetails.marketValue}</span>
                    <span className="text-lfcom-gray-500">Desconto:</span>
                    <span className="text-green-600 font-semibold">{propertyDetails.discount}</span>
                    <span className="text-lfcom-gray-500">Custos de Aquisição:</span>
                    <span>R$ 24.700,00</span>
                    <span className="text-lfcom-gray-500">Necessidade de Reforma:</span>
                    <span>R$ 25.000,00</span>
                    <span className="text-lfcom-gray-500">Data do Leilão:</span>
                    <span>{propertyDetails.auction.date}</span>
                  </div>
                </div>
              </div>
              
              <Separator />

              <div className="space-y-4">
                <h3 className="font-bold text-lg flex items-center">
                  <Scale className="mr-2 h-5 w-5" /> Análise de Riscos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Risco Jurídico</span>
                      <span className="text-xs font-semibold">{riskScores.legal}% Seguro</span>
                    </div>
                    <Progress value={riskScores.legal} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Risco Financeiro</span>
                      <span className="text-xs font-semibold">{riskScores.financial}% Seguro</span>
                    </div>
                    <Progress value={riskScores.financial} className="h-2" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Risco Físico/Estrutural</span>
                      <span className="text-xs font-semibold">{riskScores.physical}% Seguro</span>
                    </div>
                    <Progress value={riskScores.physical} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Avaliação Global</span>
                      <span className="text-xs font-semibold">{riskScores.overall}% Seguro</span>
                    </div>
                    <Progress value={riskScores.overall} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div className="bg-lfcom-gray-100 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">Conclusão da Análise</h3>
                    <p className="text-sm text-lfcom-gray-600">Avaliação final baseada em todas as análises</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-lg font-bold">
                    Alta Viabilidade
                  </div>
                </div>
                <p className="mt-4 text-lfcom-gray-700">
                  Considerando o desconto de 40% em relação ao valor de mercado, a localização privilegiada e os 
                  baixos riscos identificados, este imóvel representa uma excelente oportunidade de investimento 
                  com potencial de valorização após pequenas reformas.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="legal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Análise da Matrícula
                  </CardTitle>
                  <CardDescription>
                    Avaliação detalhada do histórico da propriedade, gravames e ônus reais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-lfcom-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-lfcom-gray-700">
                      A análise da matrícula nº {registryAnalysis.number} do {registryAnalysis.notaryOffice} não identificou 
                      ônus que impeçam a aquisição do imóvel. Consta penhora em processo de execução fiscal que será baixada após 
                      a arrematação, conforme previsto no edital. Não há outras restrições ou gravames 
                      que impactem na segurança jurídica da transação.
                    </p>
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="ownership">
                      <AccordionTrigger className="font-medium">
                        Cadeia Dominial
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {registryAnalysis.ownershipHistory.map((entry, i) => (
                            <div key={i} className="flex flex-col border-b border-lfcom-gray-200 pb-2 last:border-0">
                              <div className="flex justify-between">
                                <span className="font-medium">{entry.owner}</span>
                                <span className="text-sm text-lfcom-gray-600">{entry.period}</span>
                              </div>
                              <span className="text-sm">Forma de aquisição: {entry.acquisition}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="liens">
                      <AccordionTrigger className="font-medium">
                        Ônus e Gravames
                      </AccordionTrigger>
                      <AccordionContent>
                        {registryAnalysis.liens.length > 0 ? (
                          <div className="space-y-2">
                            {registryAnalysis.liens.map((lien, i) => (
                              <div key={i} className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                <span className="text-lfcom-gray-500">Tipo:</span>
                                <span>{lien.type}</span>
                                <span className="text-lfcom-gray-500">Credor:</span>
                                <span>{lien.creditor}</span>
                                <span className="text-lfcom-gray-500">Valor:</span>
                                <span>{lien.value}</span>
                                <span className="text-lfcom-gray-500">Processo:</span>
                                <span>{lien.process}</span>
                                <span className="text-lfcom-gray-500">Status:</span>
                                <span className="text-amber-600 font-medium">{lien.status}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-green-600">Não foram identificados ônus ou gravames.</p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gavel className="mr-2 h-5 w-5" /> Análise do Edital
                  </CardTitle>
                  <CardDescription>
                    Interpretação das condições do leilão, requisitos e restrições especiais
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    Edital nº {auctionAnalysis.editalNumber} - Leilão {propertyDetails.auction.type} - {propertyDetails.auction.institution}
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="requirements">
                      <AccordionTrigger className="font-medium">
                        Requisitos para Participação
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 list-disc list-inside text-sm">
                          {auctionAnalysis.requirements.map((req, i) => (
                            <li key={i}>{req}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="conditions">
                      <AccordionTrigger className="font-medium">
                        Condições da Venda
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 list-disc list-inside text-sm">
                          {auctionAnalysis.conditions.map((cond, i) => (
                            <li key={i}>{cond}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="restrictions">
                      <AccordionTrigger className="font-medium">
                        Restrições
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 list-disc list-inside text-sm">
                          {auctionAnalysis.restrictions.map((rest, i) => (
                            <li key={i}>{rest}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="penalties">
                      <AccordionTrigger className="font-medium">
                        Penalidades
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 list-disc list-inside text-sm text-red-600">
                          {auctionAnalysis.penalties.map((pen, i) => (
                            <li key={i}>{pen}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter className="bg-amber-50 border-t">
                  <div className="flex items-start space-x-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                    <p className="text-amber-800">
                      Atenção aos prazos e condições de pagamento. O não cumprimento pode resultar em penalidades severas.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="mr-2 h-5 w-5" /> Avaliação do Imóvel
                  </CardTitle>
                  <CardDescription>
                    Determinação precisa do valor de mercado com base em dados comparativos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Valor de Mercado</h4>
                      <div className="bg-lfcom-gray-50 p-4 rounded-lg">
                        <div className="text-center">
                          <p className="text-xl font-bold">{propertyValuation.marketPrice}</p>
                          <p className="text-sm text-lfcom-gray-600">{propertyValuation.pricePerSquareMeter}/m²</p>
                        </div>
                      </div>
                      
                      <h4 className="font-medium mt-4 mb-2">Tendências do Bairro</h4>
                      <div className="space-y-2">
                        {propertyValuation.neighborhoodTrends.map((trend, i) => (
                          <div key={i} className="flex justify-between text-sm">
                            <span>{trend.period}</span>
                            <span className="text-green-600 font-medium">{trend.variation}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Imóveis Comparáveis</h4>
                      <div className="space-y-3">
                        {propertyValuation.comparativeProperties.map((prop, i) => (
                          <div key={i} className="text-sm p-2 border border-lfcom-gray-200 rounded-md">
                            <p className="font-medium">{prop.address}</p>
                            <div className="grid grid-cols-3 mt-1">
                              <div>
                                <span className="text-lfcom-gray-600 block">Área</span>
                                <span>{prop.area}</span>
                              </div>
                              <div>
                                <span className="text-lfcom-gray-600 block">Preço</span>
                                <span>{prop.price}</span>
                              </div>
                              <div>
                                <span className="text-lfcom-gray-600 block">R$/m²</span>
                                <span>{prop.pricePerSqm}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Fatores de Valorização</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {propertyValuation.factors.map((factor, i) => (
                        <div key={i} className="flex justify-between p-2 bg-lfcom-gray-50 rounded-md">
                          <span>{factor.name}</span>
                          <span className={
                            factor.impact.includes("positivo") 
                              ? "text-green-600 font-medium" 
                              : "text-red-600 font-medium"
                          }>
                            {factor.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="mr-2 h-5 w-5" /> Viabilidade Financeira
                  </CardTitle>
                  <CardDescription>
                    Projeções de retorno sobre investimento, custos de reforma e valorização
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium">Custos de Aquisição</h4>
                      <div className="space-y-1">
                        {financialAnalysis.acquisitionCosts.map((cost, i) => (
                          <div key={i} className="flex justify-between text-sm border-b border-lfcom-gray-100 py-1 last:border-0">
                            <span>{cost.name}</span>
                            <span>{cost.value}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold pt-1 text-sm">
                          <span>Total</span>
                          <span>R$ 269.700,00</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Custos de Reforma</h4>
                      <div className="space-y-1">
                        {financialAnalysis.renovationCosts.map((cost, i) => (
                          <div key={i} className="flex justify-between text-sm border-b border-lfcom-gray-100 py-1 last:border-0">
                            <span>{cost.name}</span>
                            <span>{cost.value}</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-bold pt-1 text-sm">
                          <span>Total</span>
                          <span>R$ 25.000,00</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Cenários de Investimento</h4>
                    
                    <Tabs defaultValue="resale" className="w-full">
                      <TabsList className="grid grid-cols-2 max-w-xs">
                        <TabsTrigger value="resale">Revenda</TabsTrigger>
                        <TabsTrigger value="rental">Locação</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="resale" className="pt-4">
                        <div className="bg-lfcom-gray-50 p-4 rounded-lg space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Investimento Total</span>
                            <span className="text-sm">{financialAnalysis.investmentScenarios[0].investmentTotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Valor Esperado de Venda</span>
                            <span className="text-sm">{financialAnalysis.investmentScenarios[0].expectedReturn}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Lucro Bruto</span>
                            <span className="text-sm text-green-600 font-semibold">{financialAnalysis.investmentScenarios[0].profit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">ROI</span>
                            <span className="text-sm text-green-600 font-semibold">{financialAnalysis.investmentScenarios[0].roi}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Prazo Estimado</span>
                            <span className="text-sm">{financialAnalysis.investmentScenarios[0].timeframe}</span>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="rental" className="pt-4">
                        <div className="bg-lfcom-gray-50 p-4 rounded-lg space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Investimento Total</span>
                            <span className="text-sm">{financialAnalysis.investmentScenarios[1].investmentTotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Renda Mensal</span>
                            <span className="text-sm">{financialAnalysis.investmentScenarios[1].monthlyIncome}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Rentabilidade Anual</span>
                            <span className="text-sm text-green-600 font-semibold">{financialAnalysis.investmentScenarios[1].annualYield}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Retorno do Investimento</span>
                            <span className="text-sm">{financialAnalysis.investmentScenarios[1].breakeven}</span>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
                <CardFooter className="bg-green-50 border-t">
                  <div className="flex items-start space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                    <p className="text-green-800">
                      O cenário de revenda apresenta o melhor retorno financeiro em curto prazo, considerando as tendências de valorização da região.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="physical" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileWarning className="mr-2 h-5 w-5" /> Análise de Riscos
                  </CardTitle>
                  <CardDescription>
                    Identificação de fatores de risco legais, físicos e financeiros do imóvel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="legal-risks">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <Gavel className="mr-2 h-4 w-4" />
                            <span>Riscos Jurídicos</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {riskAnalysis.legal.map((risk, i) => (
                              <div key={i} className="bg-lfcom-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{risk.risk}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-xs text-white px-2 py-0.5 rounded-full bg-green-500">
                                      P: {risk.probability}
                                    </span>
                                    <span className="text-xs text-white px-2 py-0.5 rounded-full bg-amber-500">
                                      I: {risk.impact}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm flex items-start">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{risk.mitigation}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="financial-risks">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <CircleDollarSign className="mr-2 h-4 w-4" />
                            <span>Riscos Financeiros</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {riskAnalysis.financial.map((risk, i) => (
                              <div key={i} className="bg-lfcom-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{risk.risk}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-xs text-white px-2 py-0.5 rounded-full ${
                                      risk.probability === "Baixa" ? "bg-green-500" : 
                                      risk.probability === "Média" ? "bg-amber-500" : "bg-red-500"
                                    }`}>
                                      P: {risk.probability}
                                    </span>
                                    <span className={`text-xs text-white px-2 py-0.5 rounded-full ${
                                      risk.impact === "Baixo" ? "bg-green-500" : 
                                      risk.impact === "Médio" ? "bg-amber-500" : "bg-red-500"
                                    }`}>
                                      I: {risk.impact}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm flex items-start">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{risk.mitigation}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="physical-risks">
                        <AccordionTrigger>
                          <div className="flex items-center">
                            <Building className="mr-2 h-4 w-4" />
                            <span>Riscos Físicos/Estruturais</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            {riskAnalysis.physical.map((risk, i) => (
                              <div key={i} className="bg-lfcom-gray-50 p-3 rounded-lg">
                                <div className="flex justify-between mb-1">
                                  <span className="font-medium">{risk.risk}</span>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-xs text-white px-2 py-0.5 rounded-full ${
                                      risk.probability === "Baixa" ? "bg-green-500" : 
                                      risk.probability === "Média" ? "bg-amber-500" : "bg-red-500"
                                    }`}>
                                      P: {risk.probability}
                                    </span>
                                    <span className={`text-xs text-white px-2 py-0.5 rounded-full ${
                                      risk.impact === "Baixo" ? "bg-green-500" : 
                                      risk.impact === "Médio" ? "bg-amber-500" : "bg-red-500"
                                    }`}>
                                      I: {risk.impact}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-sm flex items-start">
                                  <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{risk.mitigation}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
                <CardFooter className="bg-blue-50 border-t">
                  <div className="flex items-start space-x-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                    <p className="text-blue-800">
                      Os riscos identificados são gerenciáveis com as medidas de mitigação sugeridas. Recomenda-se seguir todas as orientações para minimizar a exposição.
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="mr-2 h-5 w-5" /> Recomendações
                  </CardTitle>
                  <CardDescription>
                    Orientações estratégicas para maximizar o retorno do investimento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-lfcom-gray-50 rounded-lg">
                        <div className="mt-1">
                          <CalendarCheck className="h-5 w-5 text-lfcom-black" />
                        </div>
                        <div>
                          <p className="text-sm">{rec}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="bg-green-50 border-t">
                  <p className="text-sm text-green-800">
                    Recomendamos prosseguir com a aquisição deste imóvel, seguindo as orientações acima para maximizar o retorno do investimento.
                  </p>
                </CardFooter>
              </Card>
              
              <div className="bg-gradient-to-r from-lfcom-gray-900 to-lfcom-black text-white rounded-xl p-8 shadow-xl">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2" /> Próximos Passos
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <div className="bg-white text-lfcom-black rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">1</span>
                    </div>
                    <p>Agendar visita ao imóvel para inspeção detalhada</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-white text-lfcom-black rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">2</span>
                    </div>
                    <p>Verificar documentação completa do processo</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-white text-lfcom-black rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">3</span>
                    </div>
                    <p>Providenciar recursos financeiros para o lance e custos adicionais</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-white text-lfcom-black rounded-full h-6 w-6 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">4</span>
                    </div>
                    <p>Cadastrar-se na plataforma do leiloeiro com antecedência</p>
                  </div>
                </div>
                <Button className="mt-6 bg-white text-lfcom-black hover:bg-lfcom-gray-200">
                  Solicitar Assessoria para Arrematação
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="bg-lfcom-black text-white border-lfcom-black hover:bg-lfcom-gray-800"
              onClick={handleDownloadReport}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? (
                <>Gerando PDF...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> 
                  <QrCode className="mr-2 h-4 w-4" />
                  Baixar Relatório Completo
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
