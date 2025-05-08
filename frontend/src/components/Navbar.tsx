import { Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavbarProps {
  isDarkMode?: boolean;
}

export default function Navbar({ isDarkMode = false }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const getNavbarBackground = () => {
    if (isDarkMode) {
      return isScrolled ? 'bg-black shadow-md' : 'bg-black';
    }
    return isScrolled ? 'bg-white shadow-md' : 'bg-transparent';
  };

  const getTextColor = () => {
    if (isDarkMode) {
      return 'text-white';
    }
    return isScrolled ? 'text-lfcom-black' : 'text-lfcom-black';
  };

  const isActive = (path: string) => {
    const activeClass = isDarkMode ? "text-white font-semibold" : "text-lfcom-black font-semibold";
    const inactiveClass = isDarkMode 
      ? "text-gray-300 hover:text-white" 
      : "text-lfcom-gray-600 hover:text-lfcom-black";
    
    return location.pathname === path ? activeClass : inactiveClass;
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${getNavbarBackground()}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className={`text-2xl font-bold ${getTextColor()}`}>
              LFCOM
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link to="/dashboard" className={`transition-colors ${isActive('/dashboard')}`}>
              Dashboard
            </Link>
            <Link to="/nova-analise" className={`transition-colors ${isActive('/nova-analise')}`}>
              Nova Análise
            </Link>
            <Link to="/imoveis-caixa" className={`transition-colors ${isActive('/imoveis-caixa')}`}>
              Imóveis Caixa
            </Link>
            <Link to="/conteudos" className={`transition-colors ${isActive('/conteudos')}`}>
              Conteúdos
            </Link>
            <Link to="/como-funciona" className={`transition-colors ${isActive('/como-funciona')}`}>
              Como Funciona
            </Link>
            <Link to="/assessoria" className={`transition-colors ${isActive('/assessoria')}`}>
              Assessoria
            </Link>
            <Link to="/precos" className={`transition-colors ${isActive('/precos')}`}>
              Preços
            </Link>
            <Link to="/sobre" className={`transition-colors ${isActive('/sobre')}`}>
              Sobre
            </Link>
            <Link to="/extraction-report" className={`transition-colors ${isActive('/extraction-report')}`}>
              Relatório de Extração
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarFallback className={isDarkMode ? "bg-white text-black" : "bg-lfcom-black text-white"}>
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/perfil" className="cursor-pointer">Perfil</Link>
                  </DropdownMenuItem>
                  {user?.plan && (
                    <DropdownMenuItem asChild>
                      <Link to="/meu-plano" className="cursor-pointer">
                        Meu Plano ({user.plan.charAt(0).toUpperCase() + user.plan.slice(1)})
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant={isDarkMode ? "outline" : "outline"} 
                  className={isDarkMode 
                    ? "border-white text-white hover:bg-white/10" 
                    : "border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100"
                  }
                >
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button 
                  className={isDarkMode 
                    ? "bg-white text-black hover:bg-gray-200" 
                    : "bg-lfcom-black text-white hover:bg-lfcom-gray-800"
                  }
                >
                  <Link to="/register">Começar</Link>
                </Button>
              </>
            )}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className={`md:hidden ${isDarkMode ? 'text-white hover:bg-white/10' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden py-4 px-2 ${isDarkMode ? 'bg-black/95' : 'bg-white'} border-t ${isDarkMode ? 'border-white/20' : 'border-lfcom-gray-200'} animate-fade-in`}>
            <nav className="flex flex-col space-y-4">
              <Link to="/dashboard" className={`py-2 ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <Link to="/nova-analise" className={`py-2 ${isActive('/nova-analise')}`}>
                Nova Análise
              </Link>
              <Link to="/imoveis-caixa" className={`py-2 ${isActive('/imoveis-caixa')}`}>
                Imóveis Caixa
              </Link>
              <Link to="/conteudos" className={`py-2 ${isActive('/conteudos')}`}>
                Conteúdos
              </Link>
              <Link to="/como-funciona" className={`py-2 ${isActive('/como-funciona')}`}>
                Como Funciona
              </Link>
              <Link to="/assessoria" className={`py-2 ${isActive('/assessoria')}`}>
                Assessoria
              </Link>
              <Link to="/precos" className={`py-2 ${isActive('/precos')}`}>
                Preços
              </Link>
              <Link to="/sobre" className={`py-2 ${isActive('/sobre')}`}>
                Sobre
              </Link>
              <Link to="/extraction-report" className={`py-2 ${isActive('/extraction-report')}`}>
                Relatório de Extração
              </Link>
              <div className="pt-4 flex flex-col space-y-2">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 py-2">
                      <Avatar>
                        <AvatarFallback className={isDarkMode ? "bg-white text-black" : "bg-lfcom-black text-white"}>
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className={`font-medium ${isDarkMode ? 'text-white' : ''}`}>{user?.name}</span>
                    </div>
                    <Link to="/perfil" className={`py-2 flex items-center ${isDarkMode ? 'text-gray-300 hover:text-white' : ''}`}>
                      <User className="h-4 w-4 mr-2" />
                      Perfil
                    </Link>
                    <Button 
                      variant="outline" 
                      className={isDarkMode 
                        ? "w-full border-red-400 text-red-400 hover:bg-red-900/20" 
                        : "w-full border-red-600 text-red-600 hover:bg-red-50"
                      }
                      onClick={logout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      className={isDarkMode 
                        ? "w-full border-white text-white hover:bg-white/10" 
                        : "w-full border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100"
                      }
                    >
                      <Link to="/login">Entrar</Link>
                    </Button>
                    <Button 
                      className={isDarkMode 
                        ? "w-full bg-white text-black hover:bg-gray-300" 
                        : "w-full bg-lfcom-black text-white hover:bg-lfcom-gray-800"
                      }
                    >
                      <Link to="/register">Começar</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
