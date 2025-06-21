
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Copy } from 'lucide-react';
import Header from '../components/Header';

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

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<NewsPost[]>([]);

  useEffect(() => {
    const savedPosts = localStorage.getItem('news_posts');
    if (savedPosts && id) {
      const posts: NewsPost[] = JSON.parse(savedPosts);
      const foundPost = posts.find(p => p.id === id);
      setPost(foundPost || null);
      
      if (foundPost) {
        const related = posts
          .filter(p => p.id !== id && p.category === foundPost.category)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [id]);

  const handleShare = (platform: string) => {
    if (!post) return;
    
    const url = window.location.href;
    const text = `Check out this article: ${post.title}`;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        break;
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          {/* Article header */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            {post.image && (
              <div className="h-64 md:h-96">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {post.excerpt}
              </p>
              
              {/* Share buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <span className="text-sm text-gray-600 font-medium">Share:</span>
                <button
                  onClick={() => handleShare('facebook')}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Article content */}
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>
          </div>

          {/* Related articles */}
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link
                    key={relatedPost.id}
                    to={`/article/${relatedPost.id}`}
                    className="group block"
                  >
                    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {relatedPost.image ? (
                        <div className="h-32">
                          <img 
                            src={relatedPost.image} 
                            alt={relatedPost.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                          <div className="text-blue-400 text-2xl font-bold opacity-20">
                            NEWS
                          </div>
                        </div>
                      )}
                      
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default NewsArticle;
