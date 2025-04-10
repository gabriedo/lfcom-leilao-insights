
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, Shield } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-lfcom-black to-lfcom-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            Pronto para tomar decisões embasadas em dados concretos?
          </h2>
          <p className="text-lfcom-gray-200 text-lg md:text-xl max-w-3xl mx-auto mb-8 px-2 leading-relaxed">
            Não arrisque seu investimento baseado em palpites. Nossa análise profissional identifica 
            oportunidades e riscos que podem passar despercebidos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto">
            <div className="flex items-start p-5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <BarChart2 className="text-lfcom-gray-300 w-10 h-10 mr-4 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-1">Análise Baseada em Dados</h3>
                <p className="text-lfcom-gray-300">Utilizamos mais de 40 indicadores e métricas do mercado imobiliário</p>
              </div>
            </div>
            <div className="flex items-start p-5 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <Shield className="text-lfcom-gray-300 w-10 h-10 mr-4 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-lg mb-1">Proteção ao Investimento</h3>
                <p className="text-lfcom-gray-300">Identificamos riscos jurídicos e documentais antes da compra</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-white text-lfcom-black hover:bg-lfcom-gray-200 h-12 px-8 rounded-md w-full sm:w-auto text-base group">
              <Link to="/nova-analise" className="flex items-center justify-center">
                Solicitar Análise Completa
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8 rounded-md w-full sm:w-auto text-base">
              <Link to="/conhecer-metodologia">Conhecer Metodologia</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
