
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Download, FileText, Home, Map, Receipt, Scale, Star } from "lucide-react";

export default function PropertyReport() {
  const propertyDetails = {
    address: "Rua das Flores, 123 - Apto 304, Jardim América, São Paulo/SP",
    type: "Apartamento",
    area: "75m²",
    bedrooms: 2,
    bathrooms: 1,
    parking: 1,
    minimumBid: "R$ 245.000,00",
    marketValue: "R$ 410.000,00",
    discount: "40%",
  };

  const riskScores = {
    legal: 90,
    financial: 85,
    physical: 75,
    overall: 85,
  };

  const recommendations = [
    "Imóvel apresenta elevado potencial de valorização devido à localização privilegiada.",
    "Recomenda-se a vistoria presencial para verificação das condições físicas.",
    "Processo de leilão sem irregularidades identificadas na documentação analisada.",
    "Encargos a serem assumidos já considerados na análise financeira.",
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
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
              <CardTitle className="text-2xl">Análise de Oportunidade - Leilão</CardTitle>
              <p className="text-lfcom-gray-500 mt-1">{propertyDetails.address}</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
              Alta Viabilidade
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
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
                <span>R$ 12.450,00</span>
                <span className="text-lfcom-gray-500">Necessidade de Reforma:</span>
                <span>R$ 20.000,00</span>
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
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center">
              <FileText className="mr-2 h-5 w-5" /> Análise da Matrícula
            </h3>
            <div className="bg-lfcom-gray-50 p-4 rounded-lg">
              <p className="text-sm text-lfcom-gray-700">
                A análise da matrícula nº 124.567 do 5º Cartório de Registro de Imóveis de São Paulo não identificou 
                ônus que impeçam a aquisição do imóvel. Consta penhora em processo de execução fiscal que será baixada após 
                a arrematação, conforme previsto no edital. Não há outras restrições ou gravames 
                que impactem na segurança jurídica da transação.
              </p>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center">
              <Star className="mr-2 h-5 w-5" /> Recomendações
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="mt-1">
                    <AlertCircle className="h-4 w-4 text-lfcom-black" />
                  </div>
                  <p className="text-sm">{rec}</p>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
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
        </CardContent>
      </Card>
    </div>
  );
}
