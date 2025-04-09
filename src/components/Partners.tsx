
import { useBreakpoint } from "@/hooks/use-mobile";

export default function Partners() {
  const breakpoint = useBreakpoint();
  
  // Logotipos fictícios de parceiros
  const partners = [
    { name: "Banco Imobiliário", logo: "https://via.placeholder.com/150x60?text=Banco" },
    { name: "Leilões Brasil", logo: "https://via.placeholder.com/150x60?text=Leilões" },
    { name: "Imóveis Seguros", logo: "https://via.placeholder.com/150x60?text=Imóveis" },
    { name: "Juridico & Associados", logo: "https://via.placeholder.com/150x60?text=Juridico" },
    { name: "Valor Consultoria", logo: "https://via.placeholder.com/150x60?text=Valor" },
    { name: "Invista Já", logo: "https://via.placeholder.com/150x60?text=Invista" },
  ];

  // Display fewer partners on mobile
  const displayPartners = breakpoint === 'mobile' ? partners.slice(0, 4) : partners;

  return (
    <section className="py-8 md:py-12 bg-lfcom-gray-50 border-t border-b border-lfcom-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-semibold text-lfcom-gray-600">Parceiros de Confiança</h3>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12">
          {displayPartners.map((partner, index) => (
            <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="h-8 md:h-12 object-contain"
              />
            </div>
          ))}
        </div>
        {breakpoint === 'mobile' && partners.length > 4 && (
          <div className="text-center mt-4">
            <span className="text-sm text-lfcom-gray-500">+{partners.length - 4} parceiros</span>
          </div>
        )}
      </div>
    </section>
  );
}
