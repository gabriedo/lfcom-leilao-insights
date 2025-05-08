
import { FileUp, Search, BarChart3, FileCheck } from "lucide-react";
import { useBreakpoint } from "@/hooks/use-mobile";

export default function HowItWorks() {
  const breakpoint = useBreakpoint();
  
  const steps = [
    {
      title: "Envie os documentos",
      description: "Faça upload do edital, matrícula e fotos do imóvel de interesse.",
      icon: <FileUp className="w-8 h-8" />,
    },
    {
      title: "Análise automática",
      description: "Nossa tecnologia extrai e analisa todos os dados relevantes.",
      icon: <Search className="w-8 h-8" />,
    },
    {
      title: "Avaliação financeira",
      description: "Cálculo de valorização, custos e viabilidade do investimento.",
      icon: <BarChart3 className="w-8 h-8" />,
    },
    {
      title: "Relatório completo",
      description: "Receba um documento profissional para embasar sua decisão.",
      icon: <FileCheck className="w-8 h-8" />,
    },
  ];

  return (
    <section className="py-12 md:py-20 bg-lfcom-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Como Funciona</h2>
          <p className="text-lfcom-gray-600 max-w-2xl mx-auto">
            Análise completa de imóveis em leilão em apenas quatro etapas simples.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md mb-5">
                {step.icon}
              </div>
              
              {index < steps.length - 1 && breakpoint === 'desktop' && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-lfcom-gray-300"></div>
              )}
              
              <h3 className="text-xl font-bold mb-2 text-center">{step.title}</h3>
              <p className="text-lfcom-gray-600 text-center max-w-xs">
                {step.description}
              </p>
              <div className="mt-3 bg-lfcom-black text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
