import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeToggle } from "../ui/theme-toggle";
import { Link } from "wouter";

interface HeaderProps {
  onLogin: () => void;
  onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogin, onRegister }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed w-full transition-all duration-300 z-50 ${
      isScrolled 
        ? "bg-white dark:bg-gray-800 shadow-md" 
        : "bg-transparent dark:bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold dark:text-white">GuglyMail</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('features')} 
              className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('tech')} 
              className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
            >
              Technology
            </button>
            <button 
              onClick={() => scrollToSection('about')} 
              className="font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
            >
              About
            </button>
            
            <ThemeToggle />
            
            <Button 
              variant="outline" 
              onClick={onLogin} 
              className="text-primary border border-primary-200 hover:shadow-md transition-all"
            >
              Login
            </Button>
            
            <Button 
              onClick={onRegister}
              className="bg-primary text-white hover:bg-primary-600 shadow-sm hover:shadow-md transition-all"
            >
              Get Started
            </Button>
          </nav>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button 
              onClick={toggleMobileMenu} 
              className="flex items-center text-gray-800 dark:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <div className={`md:hidden bg-white dark:bg-gray-800 shadow-lg w-full absolute animate-fade-in ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-4 py-3 space-y-3">
          <button
            onClick={() => scrollToSection('features')}
            className="block font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors py-2 w-full text-left"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection('tech')}
            className="block font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors py-2 w-full text-left"
          >
            Technology
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="block font-medium text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors py-2 w-full text-left"
          >
            About
          </button>
          
          <Link href="/auth">
            <Button 
              variant="outline" 
              onClick={onLogin} 
              className="w-full mt-4 text-primary border border-primary-200 hover:shadow-md transition-all"
            >
              Login
            </Button>
          </Link>
          
          <Link href="/auth">
            <Button 
              onClick={onRegister}
              className="w-full mt-2 bg-primary text-white hover:bg-primary-600 shadow-sm hover:shadow-md transition-all"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
