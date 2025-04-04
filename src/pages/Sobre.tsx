
import Layout from "@/components/Layout";

export default function Sobre() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-lfcom-black">
            Sobre a LFCOM
          </h1>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-lfcom-black">Nossa Missão</h2>
            <p className="text-lg text-lfcom-gray-600 mb-6">
              A LFCOM nasceu com o objetivo de democratizar o acesso a oportunidades imobiliárias em leilões e vendas diretas por bancos, 
              através de análises profissionais automatizadas que simplificam decisões complexas.
            </p>
            <p className="text-lg text-lfcom-gray-600">
              Utilizamos tecnologia de ponta para analisar automaticamente cada oportunidade, 
              proporcionando relatórios detalhados e precisos que permitem decisões de investimento mais seguras e rentáveis.
            </p>
          </div>
          
          <div className="mb-12">
            <div className="relative h-80 md:h-96 overflow-hidden rounded-xl mb-8">
              <img 
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                alt="Equipe LFCOM analisando dados" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <h2 className="text-2xl font-semibold mb-4 text-lfcom-black">Nossa Abordagem</h2>
            <p className="text-lg text-lfcom-gray-600 mb-6">
              Combinamos expertise em mercado imobiliário com inteligência artificial avançada para identificar 
              e analisar oportunidades muitas vezes imperceptíveis ao olho humano.
            </p>
            <p className="text-lg text-lfcom-gray-600">
              Cada relatório gerado pela LFCOM considera múltiplos fatores: análise da matrícula, 
              avaliação do edital, valoração do imóvel, viabilidade financeira e avaliação de riscos, 
              tudo isso de forma automatizada e confiável.
            </p>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-lfcom-black">Nossa Equipe</h2>
            <p className="text-lg text-lfcom-gray-600 mb-6">
              A LFCOM é formada por especialistas em análise imobiliária, desenvolvedores de software 
              e profissionais do mercado financeiro. Nossa equipe multidisciplinar trabalha constantemente 
              para aprimorar nossos algoritmos e oferecer o melhor serviço aos nossos clientes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                    alt="Equipe de Tecnologia" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-lfcom-black">Equipe de Tecnologia</h3>
                <p className="text-center text-lfcom-gray-600">
                  Responsáveis pelo desenvolvimento da plataforma e algoritmos de análise automatizada.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" 
                    alt="Especialistas em Imóveis" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-lfcom-black">Especialistas em Imóveis</h3>
                <p className="text-center text-lfcom-gray-600">
                  Profissionais com vasta experiência no mercado imobiliário e em leilões.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-lfcom-black">Entre em Contato</h2>
            <p className="text-lg text-lfcom-gray-600 mb-6">
              Estamos sempre à disposição para esclarecer dúvidas, receber feedback e 
              conversar sobre como podemos ajudar você a encontrar as melhores oportunidades.
            </p>
            <div className="bg-lfcom-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-lfcom-black">Informações de Contato</h3>
              <ul className="space-y-3 text-lfcom-gray-600">
                <li>Email: contato@lfcom.com.br</li>
                <li>Telefone: (11) 3456-7890</li>
                <li>Endereço: Av. Paulista, 1000 - São Paulo, SP</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
