
import { Calendar, User, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface NewsCardProps {
  post: NewsPost;
}

const NewsCard = ({ post }: NewsCardProps) => {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {post.image ? (
        <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
          <div className="text-blue-400 text-6xl font-bold opacity-20">
          TNTV  NEWS
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {post.category}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
          {post.title}
        </h3>
        
        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <User className="h-3 w-3" />
            <span>{post.author}</span>
          </div>
          
          <Link 
            to={`/article/${post.id}`}
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Read More
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;
