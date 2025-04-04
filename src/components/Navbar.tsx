
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-lfcom-black">
              LFCOM
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/dashboard" className="text-lfcom-black hover:text-lfcom-gray-500 font-medium">
              Dashboard
            </Link>
            <Link to="/analises" className="text-lfcom-black hover:text-lfcom-gray-500 font-medium">
              Análises
            </Link>
            <Link to="/sobre" className="text-lfcom-black hover:text-lfcom-gray-500 font-medium">
              Sobre
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" className="border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100">
              Entrar
            </Button>
            <Button className="bg-lfcom-black text-white hover:bg-lfcom-gray-800">
              Começar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-2 bg-white border-t border-lfcom-gray-200 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link to="/dashboard" className="text-lfcom-black hover:text-lfcom-gray-500 font-medium py-2">
                Dashboard
              </Link>
              <Link to="/analises" className="text-lfcom-black hover:text-lfcom-gray-500 font-medium py-2">
                Análises
              </Link>
              <Link to="/sobre" className="text-lfcom-black hover:text-lfcom-gray-500 font-medium py-2">
                Sobre
              </Link>
              <div className="pt-4 flex flex-col space-y-2">
                <Button variant="outline" className="w-full border-lfcom-black text-lfcom-black hover:bg-lfcom-gray-100">
                  Entrar
                </Button>
                <Button className="w-full bg-lfcom-black text-white hover:bg-lfcom-gray-800">
                  Começar
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
