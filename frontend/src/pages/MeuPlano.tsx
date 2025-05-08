
import { useState } from "react";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Check, CreditCard, HelpCircle, AlertCircle, Clock, Package, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBreakpoint } from "@/hooks/use-mobile";

// Plan feature type
interface PlanFeature {
  name: string;
  included: boolean;
  limited?: string;
}

// Plan type definition
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  features: PlanFeature[];
  highlight?: boolean;
  badgeColor: string;
  textColor: string;
}

export default function MeuPlano() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const breakpoint = useBreakpoint();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Current plan description mapping
  const planDescriptions = {
    basic: "Análises por demanda",
    professional: "10 análises mensais",
    enterprise: "30 análises mensais e recursos exclusivos"
  };

  // Available plans
  const plans: Plan[] = [
    {
      id: "basic",
      name: "Básico",
      description: "Ideal para quem está começando",
      price: 29.90,
      period: "por análise",
      badgeColor: "bg-green-100 text-green-800",
      textColor: "text-green-600",
      features: [
        { name: "Análise completa de imóveis", included: true },
        { name: "Acesso à documentação", included: true },
        { name: "Suporte por email", included: true },
        { name: "Análises mensais", included: false },
        { name: "Assessoria personalizada", included: false },
        { name: "Prioridade em novos imóveis", included: false },
      ]
    },
    {
      id: "professional",
      name: "Profissional",
      description: "Perfeito para compradores ativos",
      price: 99.90,
      period: "por mês",
      highlight: true,
      badgeColor: "bg-blue-100 text-blue-800",
      textColor: "text-blue-600",
      features: [
        { name: "Análise completa de imóveis", included: true },
        { name: "Acesso à documentação", included: true },
        { name: "Suporte por email", included: true },
        { name: "Análises mensais", included: true, limited: "10 análises/mês" },
        { name: "Assessoria personalizada", included: false },
        { name: "Prioridade em novos imóveis", included: false },
      ]
    },
    {
      id: "enterprise",
      name: "Empresarial",
      description: "Para investidores e corretores",
      price: 199.90,
      period: "por mês",
      badgeColor: "bg-purple-100 text-purple-800",
      textColor: "text-purple-600",
      features: [
        { name: "Análise completa de imóveis", included: true },
        { name: "Acesso à documentação", included: true },
        { name: "Suporte por email", included: true },
        { name: "Análises mensais", included: true, limited: "30 análises/mês" },
        { name: "Assessoria personalizada", included: true },
        { name: "Prioridade em novos imóveis", included: true },
      ]
    }
  ];

  // Get current plan details
  const getCurrentPlan = () => {
    if (!user?.plan) return null;
    return plans.find(plan => plan.id === user.plan) || null;
  };

  const currentPlan = getCurrentPlan();

  // Handle plan upgrade
  const handleUpgrade = (plan: Plan) => {
    setSelectedPlan(plan);
    setUpgradeDialogOpen(true);
  };

  // Process payment for plan change
  const processPayment = () => {
    if (!selectedPlan) return;

    setIsProcessing(true);
    
    // Simulate payment process
    setTimeout(() => {
      setIsProcessing(false);
      setUpgradeDialogOpen(false);

      toast({
        title: "Plano atualizado com sucesso!",
        description: `Seu plano foi alterado para ${selectedPlan.name}.`,
      });

      // In a real application, you would update the user's plan in the backend here
      
      // For now, we'll just navigate back to the profile page
      navigate("/perfil");
    }, 2000);
  };

  // Cancel subscription
  const cancelSubscription = () => {
    toast({
      title: "Assinatura cancelada",
      description: "Sua assinatura será encerrada ao final do período atual.",
    });
  };

  // Render the appropriate dialog or drawer based on device size
  const PlanChangeDialog = () => {
    const dialogContent = (
      <>
        <DialogHeader>
          <DialogTitle>Alterar para o plano {selectedPlan?.name}</DialogTitle>
          <DialogDescription>
            {selectedPlan?.description}. Você será cobrado {selectedPlan?.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} {selectedPlan?.period}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-3">
          {selectedPlan?.features.filter(f => f.included).map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check size={16} className="text-green-500" />
              <span>{feature.name}{feature.limited ? ` (${feature.limited})` : ''}</span>
            </div>
          ))}

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
            <AlertCircle size={18} className="text-amber-500 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800">
                Ao confirmar, você concorda com os <a href="/termos" className="underline">termos de serviço</a> e <a href="/privacidade" className="underline">política de privacidade</a>.
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setUpgradeDialogOpen(false)}>Cancelar</Button>
          <Button 
            onClick={processPayment} 
            disabled={isProcessing}
            className="bg-lfcom-black hover:bg-lfcom-gray-800"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin mr-2">
                  <Clock size={16} />
                </span>
                Processando...
              </>
            ) : (
              <>
                <CreditCard size={16} className="mr-2" />
                Confirmar mudança
              </>
            )}
          </Button>
        </DialogFooter>
      </>
    );

    return breakpoint === 'mobile' ? (
      <Drawer open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DrawerContent>
          <div className="p-4 max-w-md mx-auto">
            {dialogContent}
          </div>
        </DrawerContent>
      </Drawer>
    ) : (
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {dialogContent}
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Layout>
      <div className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col space-y-6">
            {/* Page header */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold">Gerenciar meu plano</h1>
              <p className="text-lfcom-gray-600">
                Gerencie seu plano atual e explore outras opções disponíveis
              </p>
            </div>

            {/* Current plan info */}
            <Card className="border-lfcom-gray-200">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Plano Atual 
                      <Badge className={currentPlan?.badgeColor || "bg-gray-100 text-gray-800"}>
                        {currentPlan?.name || "Nenhum"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {user?.plan ? planDescriptions[user.plan as keyof typeof planDescriptions] : "Você não possui um plano ativo"}
                    </CardDescription>
                  </div>

                  {user?.plan && user.plan !== "basic" && (
                    <Button 
                      variant="outline" 
                      className="text-red-600 border-red-200 hover:bg-red-50 mt-4 md:mt-0"
                      onClick={cancelSubscription}
                    >
                      Cancelar assinatura
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {currentPlan ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">
                          {currentPlan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <span className="text-lfcom-gray-600 ml-1">{currentPlan.period}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <h3 className="font-semibold">Recursos incluídos:</h3>
                      <ul className="space-y-2">
                        {currentPlan.features.filter(f => f.included).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check size={16} className={currentPlan.textColor} />
                            <span>{feature.name}{feature.limited ? ` (${feature.limited})` : ''}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Package className="mx-auto h-12 w-12 text-lfcom-gray-400" />
                    <h3 className="mt-2 text-lg font-semibold text-lfcom-black">Nenhum plano ativo</h3>
                    <p className="mt-1 text-lfcom-gray-600">Escolha um plano para começar a usar todos os recursos</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available plans */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Planos disponíveis</h2>
              
              {breakpoint !== 'mobile' ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {plans.map((plan) => (
                    <Card key={plan.id} className={`border-lfcom-gray-200 relative ${plan.highlight ? 'ring-2 ring-blue-500' : ''}`}>
                      {plan.highlight && (
                        <div className="absolute -top-3 left-0 right-0 flex justify-center">
                          <span className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                            Mais popular
                          </span>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <span className="text-2xl font-bold">
                            {plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          <span className="text-lfcom-gray-600 ml-1">{plan.period}</span>
                        </div>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                              {feature.included ? (
                                <Check size={16} className="text-green-500" />
                              ) : (
                                <div className="w-4 h-4 flex items-center justify-center">
                                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                </div>
                              )}
                              <span className={feature.included ? "" : "text-lfcom-gray-500"}>
                                {feature.name}
                                {feature.limited && feature.included ? ` (${feature.limited})` : ''}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className={`w-full ${user?.plan === plan.id ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-lfcom-black hover:bg-lfcom-gray-800'}`}
                          disabled={user?.plan === plan.id}
                          onClick={() => handleUpgrade(plan)}
                        >
                          {user?.plan === plan.id ? 'Plano atual' : 'Escolher plano'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Tabs defaultValue="basic">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="professional">Pro</TabsTrigger>
                    <TabsTrigger value="enterprise">Empresa</TabsTrigger>
                  </TabsList>
                  {plans.map((plan) => (
                    <TabsContent key={plan.id} value={plan.id}>
                      <Card>
                        <CardHeader>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <span className="text-2xl font-bold">
                              {plan.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                            <span className="text-lfcom-gray-600 ml-1">{plan.period}</span>
                          </div>
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-center gap-2">
                                {feature.included ? (
                                  <Check size={16} className="text-green-500" />
                                ) : (
                                  <div className="w-4 h-4 flex items-center justify-center">
                                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                  </div>
                                )}
                                <span className={feature.included ? "" : "text-lfcom-gray-500"}>
                                  {feature.name}
                                  {feature.limited && feature.included ? ` (${feature.limited})` : ''}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button 
                            className={`w-full ${user?.plan === plan.id ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-lfcom-black hover:bg-lfcom-gray-800'}`}
                            disabled={user?.plan === plan.id}
                            onClick={() => handleUpgrade(plan)}
                          >
                            {user?.plan === plan.id ? 'Plano atual' : 'Escolher plano'}
                          </Button>
                        </CardFooter>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </div>

            {/* FAQ Section */}
            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-semibold">Perguntas frequentes</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-lfcom-gray-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle size={16} />
                      Como funciona a cobrança?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Para planos mensais, a cobrança é feita automaticamente todo mês. Para o plano básico,
                      você paga apenas pelas análises que solicitar.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-lfcom-gray-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle size={16} />
                      Posso cancelar a qualquer momento?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Sim, você pode cancelar sua assinatura a qualquer momento. Você continuará com acesso
                      aos recursos até o fim do período atual.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-lfcom-gray-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle size={16} />
                      Como posso trocar de plano?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Você pode trocar de plano a qualquer momento clicando no botão "Escolher plano".
                      A mudança é imediata e a cobrança será ajustada proporcionalmente.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="border-lfcom-gray-200">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle size={16} />
                      O que acontece se eu exceder o limite de análises?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Se você exceder o limite de análises do seu plano, será cobrada uma taxa adicional por análise
                      conforme o valor do plano básico.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-lfcom-gray-500 mt-4">
              <Shield size={14} />
              <span>Pagamentos seguros processados por Stripe. Seus dados estão protegidos.</span>
            </div>
          </div>
        </div>
      </div>
      <PlanChangeDialog />
    </Layout>
  );
}
