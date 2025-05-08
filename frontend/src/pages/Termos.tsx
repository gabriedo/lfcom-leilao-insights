
import React from "react";
import Layout from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Termos = () => {
  return (
    <Layout className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Termos de Uso</h1>
            <p className="text-lfcom-gray-600">
              Última atualização: 10 de Abril de 2025
            </p>
          </div>

          <div className="prose max-w-none text-lfcom-gray-800">
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p>
              Ao acessar ou usar a plataforma LFCOM, você concorda em cumprir estes Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">2. Descrição do Serviço</h2>
            <p>
              O LFCOM é uma plataforma de análise de imóveis em leilão e venda direta de bancos. Fornecemos relatórios e análises baseadas em dados disponíveis publicamente e algoritmos proprietários. Os serviços são fornecidos "como estão" e "conforme disponíveis".
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">3. Contas de Usuário</h2>
            <p>
              Para acessar determinados recursos da plataforma, você precisará criar uma conta. Você é responsável por manter a confidencialidade de sua senha e é totalmente responsável por todas as atividades que ocorrem em sua conta.
            </p>
            <p>
              Você concorda em notificar imediatamente o LFCOM sobre qualquer uso não autorizado de sua conta ou qualquer outra violação de segurança.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">4. Conteúdo e Propriedade Intelectual</h2>
            <p>
              Todo o conteúdo presente na plataforma, incluindo textos, gráficos, logos, ícones, imagens, clipes de áudio, downloads digitais e compilações de dados, é propriedade do LFCOM ou de seus fornecedores de conteúdo e está protegido pelas leis brasileiras e internacionais de direitos autorais.
            </p>
            <p>
              É expressamente proibida a reprodução, distribuição, modificação, exibição pública, transmissão ou uso comercial do conteúdo disponibilizado no LFCOM sem autorização prévia por escrito.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">5. Limitação de Responsabilidade</h2>
            <p>
              As informações fornecidas pelo LFCOM são baseadas em fontes que consideramos confiáveis, mas não podemos garantir sua total precisão ou completude. As decisões tomadas com base nas informações fornecidas são de responsabilidade exclusiva do usuário.
            </p>
            <p>
              O LFCOM não será responsável por quaisquer perdas ou danos diretos, indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do uso ou incapacidade de usar nossos serviços.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">6. Pagamentos e Reembolsos</h2>
            <p>
              Ao assinar um plano pago, você concorda em pagar todas as taxas aplicáveis conforme descrito na nossa página de Preços. Os pagamentos são não-reembolsáveis, exceto nos casos especificados na nossa política de reembolso ou exigidos por lei.
            </p>
            <p>
              Reservamo-nos o direito de modificar nossas taxas a qualquer momento, mediante aviso prévio de 30 dias.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">7. Uso Aceitável</h2>
            <p>
              Você concorda em não usar o LFCOM para:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Violar quaisquer leis ou regulamentos aplicáveis</li>
              <li>Infringir direitos de propriedade intelectual de terceiros</li>
              <li>Transmitir vírus ou qualquer código de natureza destrutiva</li>
              <li>Coletar ou rastrear informações pessoais de outros usuários</li>
              <li>Interferir ou interromper a integridade ou desempenho da plataforma</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">8. Modificações nos Termos</h2>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação dos termos atualizados. É sua responsabilidade verificar periodicamente os termos para se manter informado sobre quaisquer alterações.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">9. Lei Aplicável</h2>
            <p>
              Estes termos serão regidos e interpretados de acordo com as leis do Brasil. Qualquer disputa relacionada a estes termos será submetida à jurisdição exclusiva dos tribunais da cidade de São Paulo, SP.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">10. Contato</h2>
            <p>
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco em termos@lfcom.com.br.
            </p>
          </div>
          
          <Separator className="my-8" />
          
          <div className="text-center">
            <p className="mb-6 text-lfcom-gray-600">
              Ao utilizar nossa plataforma, você concorda com estes termos e nossa política de privacidade.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="min-w-[150px]" asChild>
                <Link to="/privacidade">Política de Privacidade</Link>
              </Button>
              <Button className="bg-lfcom-black hover:bg-lfcom-gray-800 min-w-[150px]" asChild>
                <Link to="/contato">Contate-nos</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Termos;
