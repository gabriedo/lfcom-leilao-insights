
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  plan?: 'basic' | 'professional' | 'enterprise' | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check for saved authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('lfcom_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error("Error restoring authentication", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with an actual API call
      // For now we'll simulate a successful login
      if (email && password) {
        // Mock response - in real app this would be an API response
        const mockUser: User = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          name: email.split('@')[0],
          role: 'user',
          plan: 'basic'
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('lfcom_user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao LFCOM.",
        });
        
        navigate('/dashboard');
      } else {
        throw new Error("Por favor, preencha todos os campos.");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login.");
      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: err.message || "Houve um problema ao fazer login.",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // This would be replaced with an actual API call
      if (email && password && name) {
        // Mock registration - in real app this would call an API
        const mockUser: User = {
          id: "user-" + Math.random().toString(36).substr(2, 9),
          email,
          name,
          role: 'user',
          plan: null
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('lfcom_user', JSON.stringify(mockUser));
        setUser(mockUser);
        
        toast({
          title: "Registro realizado com sucesso!",
          description: "Sua conta foi criada. Bem-vindo ao LFCOM!",
        });
        
        navigate('/dashboard');
      } else {
        throw new Error("Por favor, preencha todos os campos.");
      }
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta.");
      toast({
        variant: "destructive",
        title: "Erro no registro",
        description: err.message || "Houve um problema ao criar sua conta.",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('lfcom_user');
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você saiu da sua conta.",
    });
    navigate('/');
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
