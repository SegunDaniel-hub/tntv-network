import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Facebook, Twitter, Copy } from 'lucide-react';
import { Helmet } from 'react-helmet';
import Header from '../components/Header';
import { useArticles, NewsArticle as NewsArticleType } from '@/hooks/useArticles';
import { toast } from 'sonner';

const NewsArticle = () => {
  const { id } = useParams<{ id: string }>();
  const { getArticleById, articles } = useArticles();
  const [post, setPost] = useState<NewsArticleType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<NewsArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAbsoluteUrl = (url: string | null | undefined): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const foundPost = await getArticleById(id);
      setPost(foundPost);
      
      if (foundPost) {
        const related = articles
          .filter(p => p.id !== id && p.category === foundPost.category && p.published)
          .slice(0, 3);
        setRelatedPosts(related);
      }
      setIsLoading(false);
    };

    fetchArticle();
  }, [id, articles]);

  useEffect(() => {
    return () => {
      document.title = 'TNTV Network';
    };
  }, []);

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
        toast.success('Link copied to clipboard!');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

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

  const articleUrl = `${window.location.origin}/article/${post.id}`;
  const articleImage = getAbsoluteUrl(post.image);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{post.title} - TNTV Network</title>
        <meta name="description" content={post.excerpt || post.title} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        {articleImage && <meta property="og:image" content={articleImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || ''} />
        {articleImage && <meta name="twitter:image" content={articleImage} />}
      </Helmet>
      <Header />
      
      <article className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

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
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              )}
              
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

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>
          </div>

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
