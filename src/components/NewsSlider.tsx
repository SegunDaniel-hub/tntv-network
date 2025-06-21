
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, User } from 'lucide-react';

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

interface NewsSliderProps {
  posts: NewsPost[];
}

const NewsSlider = ({ posts }: NewsSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderPosts = posts.slice(0, 3);

  useEffect(() => {
    if (sliderPosts.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderPosts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [sliderPosts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderPosts.length) % sliderPosts.length);
  };

  if (sliderPosts.length === 0) {
    return (
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center rounded-lg">
        <div className="text-blue-400 text-2xl md:text-4xl font-bold opacity-20">
          No featured posts available
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-lg">
      {sliderPosts.map((post, index) => (
        <div
          key={post.id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="relative h-full">
            {post.image ? (
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-blue-400 text-4xl md:text-6xl font-bold opacity-20">
                  NEWS
                </div>
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            
            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
              <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm mb-2 md:mb-3">
                <span className="bg-blue-600 px-2 md:px-3 py-1 rounded-full font-medium">
                  {post.category}
                </span>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 md:h-4 w-3 md:w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 md:h-4 w-3 md:w-4" />
                  <span>{post.author}</span>
                </div>
              </div>
              <h2 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 line-clamp-2">
                {post.title}
              </h2>
              <p className="text-sm md:text-lg text-gray-200 line-clamp-2 hidden sm:block">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      {sliderPosts.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1 md:p-2 rounded-full transition-all"
          >
            <ChevronLeft className="h-4 md:h-6 w-4 md:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1 md:p-2 rounded-full transition-all"
          >
            <ChevronRight className="h-4 md:h-6 w-4 md:w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {sliderPosts.length > 1 && (
        <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {sliderPosts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsSlider;
