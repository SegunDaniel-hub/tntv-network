
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
  featured?: boolean;
}

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<NewsPost[]>([]);

  useEffect(() => {
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('news_posts');
    if (savedPosts) {
      const parsedPosts = JSON.parse(savedPosts);
      setPosts(parsedPosts);
    }
  }, []);

  useEffect(() => {
    if (category && posts.length > 0) {
      const categoryPosts = posts.filter(
        post => post.category.toLowerCase() === category.toLowerCase()
      );
      setFilteredPosts(categoryPosts);
    }
  }, [category, posts]);

  const categoryTitle = category ? category.charAt(0).toUpperCase() + category.slice(1) : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryTitle} News
          </h1>
          <p className="text-gray-600">
            Latest updates and stories from {categoryTitle.toLowerCase()}
          </p>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No news articles found in {categoryTitle.toLowerCase()} category.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
