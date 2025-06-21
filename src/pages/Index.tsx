
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tv, Globe, Users } from 'lucide-react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';

interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  image?: string;
  category: string;
}

const Index = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<NewsPost | null>(null);

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('news_posts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      setPosts(parsedPosts);
      setFeaturedPost(parsedPosts[0] || null);
    } else {
      // Initialize with sample data
      const samplePosts: NewsPost[] = [
        {
          id: '1',
          title: 'TNTV Network Launches New Digital Platform',
          excerpt: 'Breaking new ground in digital journalism with cutting-edge technology and comprehensive coverage.',
          content: 'TNTV Network announces the launch of its revolutionary digital platform...',
          author: 'Sarah Johnson',
          date: '2024-06-21',
          category: 'Technology',
          image: '/placeholder.svg'
        },
        {
          id: '2',
          title: 'Global Climate Summit Reaches Historic Agreement',
          excerpt: 'World leaders unite on ambitious climate action plan with unprecedented cooperation.',
          content: 'In a landmark decision that could reshape global environmental policy...',
          author: 'Michael Chen',
          date: '2024-06-20',
          category: 'Environment'
        },
        {
          id: '3',
          title: 'Tech Innovation Drives Economic Growth',
          excerpt: 'New study reveals technology sector contributing significantly to economic recovery.',
          content: 'Recent economic data shows remarkable growth in the technology sector...',
          author: 'Emily Rodriguez',
          date: '2024-06-19',
          category: 'Business'
        }
      ];
      localStorage.setItem('news_posts', JSON.stringify(samplePosts));
      setPosts(samplePosts);
      setFeaturedPost(samplePosts[0]);
    }
  }, []);

  const recentPosts = posts.slice(1, 7);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Trusted Source for News
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Stay informed with TNTV Network's comprehensive coverage of local and global events
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <Tv className="h-5 w-5" />
                <span>Live Coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <span>Global Reach</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>Trusted by Millions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Featured Story</h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                {featuredPost.image && (
                  <div className="h-64 md:h-80 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {featuredPost.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <button className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Read Full Article
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent News */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
          {recentPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No news articles available yet.</p>
              <Link 
                to="/admin/login" 
                className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Access Admin Panel to Add News
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img 
                src="/lovable-uploads/2c273c4c-afb1-4bdd-a4b3-a17ece37b93a.png" 
                alt="TNTV Network" 
                className="h-12 mb-4"
              />
              <p className="text-blue-200">
                Your trusted source for comprehensive news coverage and insightful reporting.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Connect With Us</h3>
              <p className="text-blue-200 mb-4">
                Stay updated with the latest news and developments.
              </p>
              <Link 
                to="/admin/login"
                className="text-blue-300 hover:text-white transition-colors text-sm"
              >
                Admin Access
              </Link>
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
