
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Facebook, Twitter, MessageCircle } from 'lucide-react';
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
    // Load posts from localStorage
    const savedPosts = localStorage.getItem('news_posts');
    if (savedPosts && id) {
      const parsedPosts = JSON.parse(savedPosts);
      const foundPost = parsedPosts.find((p: NewsPost) => p.id === id);
      setPost(foundPost || null);
      
      // Get related posts from same category
      if (foundPost) {
        const related = parsedPosts
          .filter((p: NewsPost) => p.category === foundPost.category && p.id !== foundPost.id)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Article not found.</p>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = post.title;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{post.author}</span>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-8">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {/* Share Buttons */}
        <div className="border-t border-gray-200 pt-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share this article
          </h3>
          <div className="flex flex-wrap gap-3">
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors"
            >
              <Twitter className="h-4 w-4" />
              Twitter
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/article/${relatedPost.id}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {relatedPost.image ? (
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                      <div className="text-blue-400 text-2xl font-bold opacity-20">NEWS</div>
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default NewsArticle;
