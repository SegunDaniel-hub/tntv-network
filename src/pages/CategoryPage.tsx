import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import NewsCard from '../components/NewsCard';
import { useArticles, NewsArticle } from '@/hooks/useArticles';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const { getArticlesByCategory } = useArticles();
  const [filteredPosts, setFilteredPosts] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      if (!category) return;
      
      setIsLoading(true);
      const posts = await getArticlesByCategory(category);
      setFilteredPosts(posts);
      setIsLoading(false);
    };

    fetchCategoryPosts();
  }, [category]);

  const categoryTitle = category ? 
    (category.toLowerCase() === 'featured' ? 'Featured' : category.charAt(0).toUpperCase() + category.slice(1)) 
    : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {categoryTitle} {category?.toLowerCase() === 'featured' ? 'Stories' : 'News'}
          </h1>
          <p className="text-gray-600">
            {category?.toLowerCase() === 'featured' 
              ? 'Our most important and highlighted stories'
              : `Latest updates and stories from ${categoryTitle.toLowerCase()}`
            }
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              {category?.toLowerCase() === 'featured' 
                ? 'No featured stories available at the moment.'
                : `No news articles found in ${categoryTitle.toLowerCase()} category.`
              }
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
