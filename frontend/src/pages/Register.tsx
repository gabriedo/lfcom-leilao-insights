
import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const { register, error } = useAuth();

  const validateForm = () => {
    if (password !== confirmPassword) {
      setPasswordError("As senhas não conferem.");
      return false;
    }

    if (!acceptedTerms) {
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await register(email, password, name);
      // Navigation is handled in the register function
    } catch (err) {
      // Error handling is done in the register function
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="py-16 px-4 min-h-[80vh] flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="border border-lfcom-gray-200 shadow-md">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
              <CardDescription>
                Crie sua conta para começar a usar o LFCOM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
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
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Crie uma senha forte"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {passwordError && (
                    <p className="text-red-600 text-xs mt-1">{passwordError}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Eu concordo com os{" "}
                    <Link to="/termos" className="text-lfcom-black hover:underline">
                      Termos de Serviço
                    </Link>{" "}
                    e{" "}
                    <Link to="/privacidade" className="text-lfcom-black hover:underline">
                      Política de Privacidade
                    </Link>
                  </label>
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-lfcom-black hover:bg-lfcom-gray-800" 
                  disabled={isSubmitting || !acceptedTerms}
                >
                  {isSubmitting ? "Registrando..." : "Criar conta"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-lfcom-gray-600">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-lfcom-black hover:underline">
                  Entrar
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
