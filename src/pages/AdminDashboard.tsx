
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, LogOut, Save, X, Settings, Upload, Star } from 'lucide-react';
import { toast } from 'sonner';
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

const AdminDashboard = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<NewsPost>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    image: '',
    featured: false
  });
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin/login');
      return;
    }

    // Load posts from localStorage
    const savedPosts = localStorage.getItem('news_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }

    // Load admin credentials
    const savedCredentials = localStorage.getItem('admin_credentials');
    if (savedCredentials) {
      setCredentials(JSON.parse(savedCredentials));
    } else {
      setCredentials({ username: 'admin', password: 'tntv2024' });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    localStorage.removeItem('admin_login_time');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      image: '',
      featured: false
    });
    setImageFile(null);
    setIsCreateModalOpen(true);
  };

  const openEditModal = (post: NewsPost) => {
    setFormData(post);
    setImageFile(null);
    setEditingPost(post);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setEditingPost(null);
    setIsSettingsOpen(false);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      image: '',
      featured: false
    });
    setImageFile(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCredentialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const saveCredentials = () => {
    localStorage.setItem('admin_credentials', JSON.stringify(credentials));
    toast.success('Credentials updated successfully');
    setIsSettingsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.author || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingPost) {
      // Update existing post
      const updatedPosts = posts.map(post => 
        post.id === editingPost.id 
          ? { ...formData, id: editingPost.id, date: editingPost.date } as NewsPost
          : post
      );
      setPosts(updatedPosts);
      localStorage.setItem('news_posts', JSON.stringify(updatedPosts));
      toast.success('Post updated successfully');
    } else {
      // Create new post
      const newPost: NewsPost = {
        ...formData as NewsPost,
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0]
      };
      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('news_posts', JSON.stringify(updatedPosts));
      toast.success('Post created successfully');
    }

    closeModals();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(post => post.id !== id);
      setPosts(updatedPosts);
      localStorage.setItem('news_posts', JSON.stringify(updatedPosts));
      toast.success('Post deleted successfully');
    }
  };

  const toggleFeatured = (id: string) => {
    const updatedPosts = posts.map(post =>
      post.id === id ? { ...post, featured: !post.featured } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('news_posts', JSON.stringify(updatedPosts));
    const post = posts.find(p => p.id === id);
    toast.success(`Post ${post?.featured ? 'removed from' : 'marked as'} featured`);
  };

  const categories = ['Technology', 'Business', 'Politics', 'Sports', 'Entertainment', 'Health', 'Environment', 'Science'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your news content</p>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Create Post
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Posts Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Title</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Category</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Author</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Date</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Featured</th>
                  <th className="text-right py-4 px-6 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="max-w-xs">
                        <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                        <p className="text-sm text-gray-600 truncate">{post.excerpt}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-900">{post.author}</td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleFeatured(post.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          post.featured 
                            ? 'text-yellow-600 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:bg-gray-50'
                        }`}
                      >
                        <Star className={`h-4 w-4 ${post.featured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(post)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No posts created yet.</p>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <PlusCircle className="h-5 w-5" />
                Create your first post
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Admin Settings</h2>
                <button onClick={closeModals} className="p-2 text-gray-600 hover:text-gray-800">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    onChange={handleCredentialsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleCredentialsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={saveCredentials}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={closeModals}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingPost) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <button onClick={closeModals} className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                      Author *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                      Mark as Featured
                    </label>
                  </div>
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('image')?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      Choose Image
                    </button>
                    {imageFile && <span className="text-sm text-gray-600">{imageFile.name}</span>}
                  </div>
                  {formData.image && (
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="mt-2 h-20 w-20 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief summary of the article..."
                    required
                  />
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content || ''}
                    onChange={handleInputChange}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Full article content..."
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModals}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
