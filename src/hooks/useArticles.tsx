import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string;
  image: string | null;
  category: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface ArticleFormData {
  title: string;
  excerpt: string;
  content: string;
  author: string;
  image: string;
  category: string;
  featured: boolean;
  published: boolean;
}

export const useArticles = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArticles = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load articles');
    } else {
      setArticles(data || []);
    }
    setIsLoading(false);
  };

  const createArticle = async (formData: ArticleFormData, userId: string) => {
    const { data, error } = await supabase
      .from('news_articles')
      .insert({
        title: formData.title,
        excerpt: formData.excerpt || null,
        content: formData.content,
        author: formData.author,
        image: formData.image || null,
        category: formData.category,
        featured: formData.featured,
        published: formData.published,
        created_by: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      toast.error('Failed to create article');
      return null;
    }

    toast.success('Article created successfully');
    await fetchArticles();
    return data;
  };

  const updateArticle = async (id: string, formData: Partial<ArticleFormData>) => {
    const { error } = await supabase
      .from('news_articles')
      .update({
        ...formData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating article:', error);
      toast.error('Failed to update article');
      return false;
    }

    toast.success('Article updated successfully');
    await fetchArticles();
    return true;
  };

  const deleteArticle = async (id: string) => {
    const { error } = await supabase
      .from('news_articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
      return false;
    }

    toast.success('Article deleted successfully');
    await fetchArticles();
    return true;
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    const success = await updateArticle(id, { featured: !currentFeatured });
    if (success) {
      toast.success(currentFeatured ? 'Removed from featured' : 'Marked as featured');
    }
    return success;
  };

  const getArticleById = async (id: string) => {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching article:', error);
      return null;
    }

    return data;
  };

  const getArticlesByCategory = async (category: string) => {
    let query = supabase
      .from('news_articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (category.toLowerCase() === 'featured') {
      query = query.eq('featured', true);
    } else {
      query = query.ilike('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching articles by category:', error);
      return [];
    }

    return data || [];
  };

  const searchArticles = async (searchQuery: string) => {
    const { data, error } = await supabase
      .from('news_articles')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,author.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching articles:', error);
      return [];
    }

    return data || [];
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    articles,
    isLoading,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    toggleFeatured,
    getArticleById,
    getArticlesByCategory,
    searchArticles
  };
};
