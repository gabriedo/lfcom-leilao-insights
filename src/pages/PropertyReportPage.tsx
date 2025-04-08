
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PropertyReport from "@/components/PropertyReport";
import { Button } from "@/components/ui/button";
import { Download, QrCode } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { generatePropertyReportPDF } from "@/utils/pdfService";

export default function PropertyReportPage() {
  const { id } = useParams();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const { toast } = useToast();

  const handleDownloadReport = async () => {
    try {
      setIsGeneratingPdf(true);
      toast({
        title: "Gerando relatório",
        description: "Preparando seu PDF, por favor aguarde...",
      });

      // This is just for demonstration - in a real app you would get this data from API
      const propertyDetails = {
        id: id || "123456",
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
        observations: "Não foram identificados outros ônus que impeçam a aquisição do imóvel."
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
        restrictions: [],
        penalties: []
      };

      const propertyValuation = {
        marketPrice: "R$ 410.000,00",
        pricePerSquareMeter: "R$ 5.466,67",
        comparativeProperties: [
          { address: "Rua das Flores, 145", area: "72m²", price: "R$ 395.000,00", pricePerSqm: "R$ 5.486,11" },
          { address: "Av. Paulista, 1578", area: "80m²", price: "R$ 450.000,00", pricePerSqm: "R$ 5.625,00" },
          { address: "Rua Augusta, 722", area: "70m²", price: "R$ 380.000,00", pricePerSqm: "R$ 5.428,57" }
        ],
        neighborhoodTrends: [],
        factors: []
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
        investmentScenarios: []
      };

      const riskAnalysis = {
        legal: [
          { risk: "Contestação judicial", probability: "Baixa", impact: "Alto", mitigation: "Verificação completa do processo" }
        ],
        financial: [
          { risk: "Custos de reforma acima do estimado", probability: "Média", impact: "Médio", mitigation: "Orçamentos detalhados" }
        ],
        physical: [
          { risk: "Problemas estruturais ocultos", probability: "Média", impact: "Alto", mitigation: "Inspeção técnica especializada" }
        ]
      };

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
    <Layout>
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Relatório de Análise</h1>
              <p className="text-lfcom-gray-600 mt-1">
                Análise completa e detalhada do imóvel
              </p>
            </div>
            <Button 
              onClick={handleDownloadReport} 
              disabled={isGeneratingPdf}
              className="bg-lfcom-black text-white hover:bg-lfcom-gray-800"
            >
              {isGeneratingPdf ? (
                <>Gerando PDF...</>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> 
                  <QrCode className="ml-2 h-4 w-4" />
                  Baixar Relatório Completo
                </>
              )}
            </Button>
          </div>
          
          <PropertyReport propertyId={id} />
        </div>
      </div>
    </Layout>
  );
}
