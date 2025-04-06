
export default function Partners() {
  // Logotipos fictícios de parceiros
  const partners = [
    { name: "Banco Imobiliário", logo: "https://via.placeholder.com/150x60?text=Banco" },
    { name: "Leilões Brasil", logo: "https://via.placeholder.com/150x60?text=Leilões" },
    { name: "Imóveis Seguros", logo: "https://via.placeholder.com/150x60?text=Imóveis" },
    { name: "Juridico & Associados", logo: "https://via.placeholder.com/150x60?text=Juridico" },
    { name: "Valor Consultoria", logo: "https://via.placeholder.com/150x60?text=Valor" },
    { name: "Invista Já", logo: "https://via.placeholder.com/150x60?text=Invista" },
  ];

  return (
    <section className="py-12 bg-lfcom-gray-50 border-t border-b border-lfcom-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold text-lfcom-gray-600">Parceiros de Confiança</h3>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner, index) => (
            <div key={index} className="grayscale hover:grayscale-0 transition-all duration-300">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="h-12 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
