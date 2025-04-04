
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CallToAction() {
  return (
    <section className="py-20 bg-lfcom-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Pronto para tomar decisões mais seguras em leilões imobiliários?
        </h2>
        <p className="text-lfcom-gray-300 max-w-2xl mx-auto mb-8">
          Experimente nossa plataforma e receba análises profissionais automatizadas para qualquer imóvel em leilão ou venda direta de bancos.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button className="bg-white text-lfcom-black hover:bg-lfcom-gray-200 h-12 px-8 rounded-md">
            <Link to="/nova-analise">Analisar Agora</Link>
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white/10 h-12 px-8 rounded-md">
            <Link to="/precos">Ver Planos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
