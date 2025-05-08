
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CreditCard, Lock, Settings, User } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram atualizadas com sucesso.",
      });
      setIsUpdating(false);
    }, 1000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não conferem",
        description: "A nova senha e a confirmação devem ser iguais.",
      });
      return;
    }
    
    setIsUpdatingPassword(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsUpdatingPassword(false);
    }, 1000);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Profile sidebar */}
              <div className="w-full md:w-1/4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold mb-4">Minha Conta</h2>
                  <div className="flex flex-col space-y-1">
                    <Link to="/perfil" className="flex items-center text-lfcom-black font-medium bg-lfcom-gray-100 p-2 rounded">
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </Link>
                    <Link to="/meu-plano" className="flex items-center text-lfcom-gray-600 hover:text-lfcom-black p-2">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Meu Plano
                    </Link>
                    <Link to="/configuracoes" className="flex items-center text-lfcom-gray-600 hover:text-lfcom-black p-2">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </Link>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="w-full md:w-3/4">
                <div className="mb-6">
                  <h1 className="text-2xl font-bold">Meu Perfil</h1>
                  <p className="text-lfcom-gray-600">
                    Gerencie suas informações pessoais e segurança da conta
                  </p>
                </div>

                {/* Current plan info */}
                {user?.plan && (
                  <Card className="mb-6 border-lfcom-gray-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">Plano Atual:</h3>
                            <Badge className={`
                              ${user.plan === 'professional' ? 'bg-blue-100 text-blue-800' : 
                                user.plan === 'enterprise' ? 'bg-purple-100 text-purple-800' : 
                                'bg-green-100 text-green-800'}
                            `}>
                              {user.plan === 'basic' ? 'Básico' : 
                               user.plan === 'professional' ? 'Profissional' : 
                               'Empresarial'}
                            </Badge>
                          </div>
                          <p className="text-sm text-lfcom-gray-600 mt-1">
                            {user.plan === 'basic' ? 'Análises por demanda' : 
                             user.plan === 'professional' ? '10 análises mensais' :
                             '30 análises mensais e recursos exclusivos'}
                          </p>
                        </div>
                        <Link to="/meu-plano">
                          <Button variant="outline" className="border-lfcom-black text-lfcom-black">
                            Gerenciar Plano <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                    <TabsTrigger value="security">Segurança</TabsTrigger>
                  </TabsList>
                  <TabsContent value="personal">
                    <Card>
                      <CardHeader>
                        <CardTitle>Informações Pessoais</CardTitle>
                        <CardDescription>
                          Atualize suas informações de perfil
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nome completo</Label>
                            <Input 
                              id="name" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                              id="email" 
                              type="email"
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="bg-lfcom-black hover:bg-lfcom-gray-800"
                            disabled={isUpdating}
                          >
                            {isUpdating ? "Atualizando..." : "Salvar Alterações"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Segurança</CardTitle>
                        <CardDescription>
                          Atualize sua senha e configurações de segurança
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Senha atual</Label>
                            <Input 
                              id="current-password" 
                              type="password"
                              value={currentPassword} 
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">Nova senha</Label>
                            <Input 
                              id="new-password" 
                              type="password"
                              value={newPassword} 
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                            <Input 
                              id="confirm-password" 
                              type="password"
                              value={confirmNewPassword} 
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div className="pt-2 flex items-center space-x-2 text-sm">
                            <Lock className="text-lfcom-gray-400 h-4 w-4" />
                            <span className="text-lfcom-gray-600">Use uma senha forte com letras, números e símbolos</span>
                          </div>
                          <Button 
                            type="submit" 
                            className="bg-lfcom-black hover:bg-lfcom-gray-800"
                            disabled={isUpdatingPassword}
                          >
                            {isUpdatingPassword ? "Atualizando..." : "Atualizar Senha"}
                          </Button>
                        </form>
                      </CardContent>
                      <CardFooter className="flex flex-col items-start gap-4 border-t p-6">
                        <div>
                          <h4 className="font-medium mb-1">Ações de segurança adicionais</h4>
                          <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                            Excluir minha conta
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
