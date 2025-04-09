
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useBreakpoint } from "@/hooks/use-mobile";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const breakpoint = useBreakpoint();

  useEffect(() => {
    // Pequeno atraso para permitir a animação iniciar após o carregamento
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative flex items-center bg-lfcom-white pt-16 md:pt-20 pb-16 md:pb-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <div 
            className={`text-center lg:text-left transition-all duration-700 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4 md:mb-6">
              Análise Automatizada de Imóveis em Leilão
            </h1>
            <p className="text-lfcom-gray-600 text-lg mb-6 md:mb-8 max-w-lg mx-auto lg:mx-0">
              Tecnologia de ponta para avaliação completa de oportunidades em leilões imobiliários e vendas diretas por bancos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                className="bg-lfcom-black text-white hover:bg-lfcom-gray-800 h-12 px-8 rounded-md group"
              >
                <Link to="/nova-analise" className="flex items-center">
                  Analisar Imóvel 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100 h-12 px-8 rounded-md"
              >
                <Link to="/como-funciona">Como Funciona</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`}
                    alt={`User ${i}`}
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <p className="ml-3 text-sm text-lfcom-gray-600">
                +3.500 análises realizadas no último mês
              </p>
            </div>
          </div>

          <div 
            className={`relative z-10 transition-all duration-1000 delay-300 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            } ${breakpoint === 'mobile' ? 'mt-6' : ''}`}
          >
            <div className="bg-lfcom-gray-100 rounded-lg p-1">
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-xl">
                <div className="border-b border-lfcom-gray-200 pb-4 mb-4">
                  <h3 className="font-bold text-lg">Relatório de Análise</h3>
                  <p className="text-lfcom-gray-500 text-sm">Apto 75m² - Edital 342/2024</p>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Valor do Lance Mínimo</span>
                    <span className="text-lfcom-black font-semibold">R$ 245.000,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Valor de Mercado</span>
                    <span className="text-lfcom-black font-semibold">R$ 410.000,00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Potencial de Valorização</span>
                    <span className="text-green-600 font-semibold">+67%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Risco Jurídico</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Baixo</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Custos Adicionais</span>
                    <span className="text-lfcom-black font-semibold">R$ 32.450,00</span>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-lfcom-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Viabilidade Final</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Alta</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 h-24 w-24 bg-lfcom-black rounded-full flex items-center justify-center text-white font-bold text-center text-sm p-2 shadow-lg transform rotate-6">
              Economia<br />de 40%<br />no preço
            </div>
          </div>
        </div>
      </div>
      
      {/* Abstract shapes for visual enhancement */}
      <div className="absolute -z-10 right-0 bottom-0 w-1/2 h-1/2 bg-lfcom-gray-100 rounded-tl-[200px]" />
      <div className="absolute -z-10 left-0 top-20 w-64 h-64 bg-lfcom-gray-200/50 rounded-full blur-3xl" />
    </section>
  );
}
