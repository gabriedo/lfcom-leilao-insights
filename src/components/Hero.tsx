
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative flex items-center bg-lfcom-white pt-20 pb-32">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6">
              Análise Automatizada de Imóveis em Leilão
            </h1>
            <p className="text-lfcom-gray-600 text-xl mb-8 max-w-lg">
              Tecnologia de ponta para avaliação completa de oportunidades em leilões imobiliários e vendas diretas por bancos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-lfcom-black text-white hover:bg-lfcom-gray-800 h-12 px-8 rounded-md">
                <Link to="/nova-analise" className="flex items-center">
                  Analisar Imóvel <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" className="border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100 h-12 px-8 rounded-md">
                <Link to="/como-funciona">Como Funciona</Link>
              </Button>
            </div>
          </div>
          <div className="relative z-10">
            <div className="bg-lfcom-gray-100 rounded-lg p-1">
              <div className="bg-white rounded-lg p-6 shadow-xl">
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
          </div>
        </div>
      </div>
      
      {/* Abstract shapes for visual enhancement */}
      <div className="absolute -z-10 right-0 bottom-0 w-1/2 h-1/2 bg-lfcom-gray-100 rounded-tl-[200px]" />
      <div className="absolute -z-10 left-0 top-20 w-64 h-64 bg-lfcom-gray-200/50 rounded-full blur-3xl" />
    </section>
  );
}
