
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Bell } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/2c273c4c-afb1-4bdd-a4b3-a17ece37b93a.png" 
              alt="TNTV Network" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Politics
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Business
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Technology
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Sports
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Entertainment
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <Link 
              to="/admin/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <a href="#" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Politics
              </a>
              <a href="#" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Business
              </a>
              <a href="#" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Technology
              </a>
              <a href="#" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Sports
              </a>
              <a href="#" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Entertainment
              </a>
              <div className="px-4 py-2 flex items-center space-x-4">
                <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
                <Link 
                  to="/admin/login" 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Admin
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
