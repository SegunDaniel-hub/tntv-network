import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tv, Globe, Users, Instagram, Facebook, MessageCircle, Phone } from 'lucide-react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import NewsSlider from '../components/NewsSlider';
interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  category: string;
  featured?: boolean;
}
const Index = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<NewsPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('news_posts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      setPosts(parsedPosts);
      setFilteredPosts(parsedPosts);
    } else {
      // Initialize with sample data
      const samplePosts: NewsPost[] = [{
        id: '1',
        title: 'TNTV Network Launches New Digital Platform',
        excerpt: 'Breaking new ground in digital journalism with cutting-edge technology and comprehensive coverage.',
        content: 'TNTV Network announces the launch of its revolutionary digital platform...',
        author: 'Sarah Johnson',
        date: '2024-06-21',
        category: 'Technology',
        image: '/placeholder.svg',
        featured: true
      }, {
        id: '2',
        title: 'Global Climate Summit Reaches Historic Agreement',
        excerpt: 'World leaders unite on ambitious climate action plan with unprecedented cooperation.',
        content: 'In a landmark decision that could reshape global environmental policy...',
        author: 'Michael Chen',
        date: '2024-06-20',
        category: 'Environment',
        featured: false
      }, {
        id: '3',
        title: 'Tech Innovation Drives Economic Growth',
        excerpt: 'New study reveals technology sector contributing significantly to economic recovery.',
        content: 'Recent economic data shows remarkable growth in the technology sector...',
        author: 'Emily Rodriguez',
        date: '2024-06-19',
        category: 'Business',
        featured: false
      }];
      localStorage.setItem('news_posts', JSON.stringify(samplePosts));
      setPosts(samplePosts);
      setFilteredPosts(samplePosts);
    }
  }, []);
  useEffect(() => {
    const handleSearch = (event: CustomEvent) => {
      const query = event.detail;
      setSearchQuery(query);
      setIsSearching(true);
      if (query.trim() === '') {
        setFilteredPosts(posts);
        setIsSearching(false);
      } else {
        const filtered = posts.filter(post => post.title.toLowerCase().includes(query.toLowerCase()) || post.excerpt.toLowerCase().includes(query.toLowerCase()) || post.content.toLowerCase().includes(query.toLowerCase()) || post.category.toLowerCase().includes(query.toLowerCase()) || post.author.toLowerCase().includes(query.toLowerCase()));
        setFilteredPosts(filtered);
      }
    };
    window.addEventListener('searchNews', handleSearch as EventListener);
    return () => window.removeEventListener('searchNews', handleSearch as EventListener);
  }, [posts]);
  const featuredPosts = posts.filter(post => post.featured);
  const recentPosts = isSearching ? filteredPosts : posts.slice(0, 6);
  const categories = ['Technology', 'Business', 'Politics', 'Sports', 'Entertainment', 'Environment'];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {!isSearching && (
        <>
          {/* Hero Section with Slider */}
          <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto mb-8">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">News You Can Trust</h1>
              </div>
              
              {/* News Slider in Hero */}
              <div className="max-w-6xl mx-auto">
                <NewsSlider posts={featuredPosts.length > 0 ? featuredPosts : posts} />
              </div>
            </div>
          </section>

          {/* Featured Articles Section */}
          {featuredPosts.length > 0 && (
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {featuredPosts.slice(0, 3).map(post => (
                    <NewsCard key={post.id} post={post} />
                  ))}
                </div>
                {featuredPosts.length > 3 && (
                  <div className="text-center mt-8">
                    <Link 
                      to="/category/featured" 
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      View All Featured Stories
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Categories Section */}
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map(category => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase()}`}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-800 text-center py-4 px-6 rounded-lg font-medium transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Recent News / Search Results */}
      <section className={`py-12 ${isSearching ? 'pt-8' : ''} ${!isSearching ? 'bg-white' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {isSearching ? `Search Results for "${searchQuery}"` : 'Latest News'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map(post => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
          {recentPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {isSearching ? 'No articles found for your search.' : 'No news articles available yet.'}
              </p>
              {!isSearching && (
                <Link to="/admin/login" className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 font-medium">
                  Access Admin Panel to Add News
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src="/lovable-uploads/2c273c4c-afb1-4bdd-a4b3-a17ece37b93a.png" alt="TNTV Network" className="h-12 mb-4" />
              <p className="text-blue-200">
                Your trusted source for comprehensive news coverage and insightful reporting.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-blue-200">
                <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/category/politics" className="hover:text-white transition-colors">Politics</Link></li>
                <li><Link to="/category/business" className="hover:text-white transition-colors">Business</Link></li>
                <li><Link to="/category/technology" className="hover:text-white transition-colors">Technology</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <div className="space-y-3 text-blue-200">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5" />
                  <span>+234 708 951 3080</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5" />
                  <span>+234 708 951 3080</span>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <a href="https://www.instagram.com/tntvnetwork/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Instagram className="h-5 w-5" />
                    <span>Instagram</span>
                  </a>
                  <a href="https://www.facebook.com/TnTvNetwork/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Facebook className="h-5 w-5" />
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-300">
            <p>&copy; 2024 TNTV Network. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
