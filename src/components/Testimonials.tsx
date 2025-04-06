
import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Roberto Silva",
    role: "Investidor Imobiliário",
    content: "A análise fornecida pela LFCOM me economizou mais de R$ 50.000 ao identificar problemas estruturais que não foram divulgados no edital.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/men/41.jpg"
  },
  {
    name: "Mariana Costa",
    role: "Advogada",
    content: "Recomendo a todos os meus clientes. A análise jurídica é completa e já nos salvou de comprar imóveis com problemas legais graves.",
    rating: 5,
    image: "https://randomuser.me/api/portraits/women/63.jpg"
  },
  {
    name: "Carlos Mendes",
    role: "Empresário",
    content: "Já participei de mais de 12 leilões usando as análises da LFCOM. A precisão nos valores de mercado é impressionante.",
    rating: 4,
    image: "https://randomuser.me/api/portraits/men/36.jpg"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-lfcom-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-3">O Que Nossos Clientes Dizem</h2>
          <p className="text-lfcom-gray-600 max-w-2xl mx-auto">
            Investidores e profissionais confiam na LFCOM para tomar decisões seguras em leilões imobiliários.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-lfcom-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-lfcom-gray-300'}`} 
                      fill={i < testimonial.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p className="text-lfcom-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-lfcom-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
