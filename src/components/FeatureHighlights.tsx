
import { Check, FileText, Search, Gauge, AlertTriangle, BarChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeatureHighlights() {
  const features = [
    {
      title: "Análise de Matrícula",
      description: "Avaliação detalhada do histórico da propriedade, gravames e ônus reais.",
      icon: <FileText className="h-10 w-10 text-lfcom-black" />,
    },
    {
      title: "Análise de Edital",
      description: "Interpretação das condições do leilão, requisitos e restrições especiais.",
      icon: <Search className="h-10 w-10 text-lfcom-black" />,
    },
    {
      title: "Avaliação do Imóvel",
      description: "Determinação precisa do valor de mercado com base em dados comparativos.",
      icon: <Gauge className="h-10 w-10 text-lfcom-black" />,
    },
    {
      title: "Viabilidade Financeira",
      description: "Projeções de retorno sobre investimento, custos de reforma e valorização.",
      icon: <BarChart className="h-10 w-10 text-lfcom-black" />,
    },
    {
      title: "Análise de Riscos",
      description: "Identificação de fatores de risco legais, físicos e financeiros do imóvel.",
      icon: <AlertTriangle className="h-10 w-10 text-lfcom-black" />,
    },
    {
      title: "Relatório Profissional",
      description: "Documento completo e detalhado para embasar decisões de investimento.",
      icon: <Check className="h-10 w-10 text-lfcom-black" />,
    },
  ];

  return (
    <section className="py-20 bg-lfcom-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Análise Completa e Profissional</h2>
          <p className="text-lfcom-gray-600 max-w-2xl mx-auto">
            Nossa plataforma realiza uma análise minuciosa de todas as dimensões relevantes para tomada de decisão em imóveis de leilão.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="lfcom-card border border-lfcom-gray-200 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lfcom-gray-600 text-sm">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
