
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, Instagram, Facebook, Phone, MessageCircle } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Trigger search functionality
      window.dispatchEvent(new CustomEvent('searchNews', {
        detail: searchQuery
      }));
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/lovable-uploads/2c273c4c-afb1-4bdd-a4b3-a17ece37b93a.png" alt="TNTV Network" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-blue-600">TNTV NETWORK</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/category/politics" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Politics
            </Link>
            <Link to="/category/business" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Business
            </Link>
            <Link to="/category/technology" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Technology
            </Link>
            <Link to="/category/sports" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Sports
            </Link>
            <Link to="/category/entertainment" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Entertainment
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search news..."
                  className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button type="submit" className="ml-2 p-2 text-blue-600 hover:text-blue-800">
                  <Search className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="ml-1 p-2 text-gray-600 hover:text-blue-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
            
            {/* Contact Links */}
            <div className="flex items-center space-x-2">
              <a
                href="https://www.instagram.com/tntvnetwork/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/TnTvNetwork/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/2347089513080"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-600 hover:text-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a
                href="tel:+2347089513080"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
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
              <Link
                to="/"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/category/politics"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Politics
              </Link>
              <Link
                to="/category/business"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Business
              </Link>
              <Link
                to="/category/technology"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Technology
              </Link>
              <Link
                to="/category/sports"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Sports
              </Link>
              <Link
                to="/category/entertainment"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Entertainment
              </Link>
              
              {/* Mobile Search */}
              <div className="px-4 py-2">
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button type="submit" className="ml-2 p-2 text-blue-600 hover:text-blue-800">
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              </div>

              {/* Mobile Contact Links */}
              <div className="px-4 py-2 flex items-center space-x-4">
                <a
                  href="https://www.instagram.com/tntvnetwork/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.facebook.com/TnTvNetwork/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="https://wa.me/2347089513080"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-green-600 transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href="tel:+2347089513080"
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
