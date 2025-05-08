
import React from "react";
import Layout from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Privacidade = () => {
  return (
    <Layout className="bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-white shadow-sm rounded-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Política de Privacidade</h1>
            <p className="text-lfcom-gray-600">
              Última atualização: 10 de Abril de 2025
            </p>
          </div>
          
          <Tabs defaultValue="resumo" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
              <TabsTrigger value="detalhada">Política Detalhada</TabsTrigger>
              <TabsTrigger value="direitos">Seus Direitos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="resumo" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">O que coletamos:</h3>
                  <ul className="list-disc pl-6 space-y-1 text-lfcom-gray-600">
                    <li>Informações que você nos fornece (nome, email, telefone)</li>
                    <li>Dados sobre o uso da plataforma</li>
                    <li>Informações técnicas do dispositivo e conexão</li>
                    <li>Cookies e tecnologias semelhantes</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Como usamos:</h3>
                  <ul className="list-disc pl-6 space-y-1 text-lfcom-gray-600">
                    <li>Fornecer e melhorar nossos serviços</li>
                    <li>Personalizar sua experiência</li>
                    <li>Comunicar atualizações e ofertas</li>
                    <li>Garantir segurança e prevenir fraudes</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Compartilhamento:</h3>
                  <ul className="list-disc pl-6 space-y-1 text-lfcom-gray-600">
                    <li>Prestadores de serviço que nos auxiliam</li>
                    <li>Parceiros comerciais (com seu consentimento)</li>
                    <li>Quando exigido por lei</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Seus direitos:</h3>
                  <ul className="list-disc pl-6 space-y-1 text-lfcom-gray-600">
                    <li>Acessar seus dados</li>
                    <li>Corrigir informações incorretas</li>
                    <li>Excluir seus dados</li>
                    <li>Revogar consentimento</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="detalhada" className="mt-6 prose max-w-none text-lfcom-gray-800">
              <h2 className="text-xl font-semibold mt-6 mb-3">1. Informações que Coletamos</h2>
              <p>
                Coletamos informações quando você se registra em nosso site, faz login, preenche formulários, realiza uma compra ou interage com nossa plataforma de outras formas.
              </p>
              <p>
                <strong>Informações pessoais</strong> que podemos coletar incluem:
              </p>
              <ul className="list-disc pl-6 my-4 space-y-1">
                <li>Nome completo</li>
                <li>Endereço de e-mail</li>
                <li>Número de telefone</li>
                <li>Endereço físico</li>
                <li>CPF ou CNPJ</li>
                <li>Informações de pagamento</li>
              </ul>
              
              <p>
                <strong>Informações de uso</strong> que podemos coletar incluem:
              </p>
              <ul className="list-disc pl-6 my-4 space-y-1">
                <li>Páginas visitadas e recursos utilizados</li>
                <li>Tempo gasto em cada página</li>
                <li>Horário e data de acesso</li>
                <li>Fluxo de cliques na plataforma</li>
                <li>Buscas realizadas</li>
              </ul>
              
              <p>
                <strong>Informações técnicas</strong> que podemos coletar incluem:
              </p>
              <ul className="list-disc pl-6 my-4 space-y-1">
                <li>Endereço IP</li>
                <li>Tipo de dispositivo</li>
                <li>Sistema operacional</li>
                <li>Tipo de navegador</li>
                <li>Provedor de serviços de internet</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-3">2. Como Usamos suas Informações</h2>
              <p>Utilizamos as informações coletadas para:</p>
              <ul className="list-disc pl-6 my-4 space-y-1">
                <li>Processar transações e fornecer os serviços contratados</li>
                <li>Enviar informações sobre sua conta ou assinatura</li>
                <li>Personalizar sua experiência na plataforma</li>
                <li>Melhorar nosso site e serviços com base em feedback</li>
                <li>Enviar e-mails periódicos com ofertas e atualizações</li>
                <li>Solucionar problemas técnicos e garantir segurança</li>
                <li>Cumprir obrigações legais e fiscais</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8 mb-3">3. Compartilhamento de Informações</h2>
              <p>Não vendemos, trocamos ou transferimos suas informações pessoais para terceiros, exceto nas seguintes situações:</p>
              <ul className="list-disc pl-6 my-4 space-y-1">
                <li>Com prestadores de serviços que nos auxiliam na operação do site ou na prestação de serviços</li>
                <li>Com parceiros de negócios, desde que tenhamos seu consentimento prévio</li>
                <li>Quando necessário para cumprir ordens judiciais ou processos legais</li>
                <li>Para proteger nossos direitos, propriedade ou segurança</li>
              </ul>
              
              <h2 className="text-xl font-semibold mt-8 mb-3">4. Cookies e Tecnologias Semelhantes</h2>
              <p>
                Utilizamos cookies, pixels e outras tecnologias similares para melhorar sua experiência em nosso site, analisar o tráfego e personalizar o conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-3">5. Segurança</h2>
              <p>
                Implementamos medidas técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-3">6. Retenção de Dados</h2>
              <p>
                Mantemos suas informações pessoais pelo tempo necessário para cumprir os propósitos descritos nesta Política de Privacidade, a menos que um período de retenção mais longo seja exigido ou permitido por lei.
              </p>

              <h2 className="text-xl font-semibold mt-8 mb-3">7. Alterações na Política de Privacidade</h2>
              <p>
                Podemos atualizar nossa Política de Privacidade periodicamente. Quando fizermos alterações significativas, notificaremos você através de um aviso em nosso site ou por e-mail.
              </p>
            </TabsContent>
            
            <TabsContent value="direitos" className="mt-6">
              <div className="space-y-6">
                <p className="text-lfcom-gray-600">
                  De acordo com a Lei Geral de Proteção de Dados (LGPD), você possui os seguintes direitos em relação aos seus dados pessoais:
                </p>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Direito de acesso:</h3>
                  <p className="text-lfcom-gray-600">
                    Você pode solicitar confirmação da existência de tratamento e acesso aos seus dados pessoais que coletamos.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Direito de retificação:</h3>
                  <p className="text-lfcom-gray-600">
                    Você pode solicitar a correção de dados incompletos, inexatos ou desatualizados.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Direito de eliminação:</h3>
                  <p className="text-lfcom-gray-600">
                    Você pode solicitar a exclusão dos seus dados pessoais que tratamos, exceto quando houver obrigação legal ou regulatória.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Direito à portabilidade:</h3>
                  <p className="text-lfcom-gray-600">
                    Você pode solicitar a transferência dos seus dados para outro fornecedor de serviço.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Direito de não consentir:</h3>
                  <p className="text-lfcom-gray-600">
                    Você pode se opor ao tratamento de dados quando este for realizado com base no seu consentimento.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Como exercer seus direitos:</h3>
                  <p className="text-lfcom-gray-600">
                    Para exercer qualquer um desses direitos, entre em contato conosco por meio do e-mail privacidade@lfcom.com.br ou através da página de Contato.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Prazo para resposta:</h3>
                  <p className="text-lfcom-gray-600">
                    Responderemos à sua solicitação no prazo de até 15 dias, conforme estabelecido pela LGPD.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-8" />
          
          <div className="text-center">
            <p className="mb-6 text-lfcom-gray-600">
              Se você tiver dúvidas ou preocupações sobre nossa Política de Privacidade ou práticas de dados, entre em contato conosco.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" className="min-w-[150px]" asChild>
                <Link to="/termos">Termos de Uso</Link>
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

export default Privacidade;
