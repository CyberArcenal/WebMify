import { useState, useEffect, useCallback, useMemo } from 'react';
import blogAPI, { Blog } from '@/api/core/blog';
import categoryAPI, { Category } from '@/api/core/category';
import { showSuccess, showWarning, showError } from '@/utils/notification';

interface UseBlogReturn {
  blogs: Blog[];
  popular: Blog[];
  categories: Category[];
  pagination: {
    count: number;
    current_page: number;
    total_pages: number;
    page_size: number;
  };
  loading: boolean;
  error: string | null;
  currentCategory: string;
  searchTerm: string;
  setCurrentCategory: (category: string) => void;
  setSearchTerm: (term: string) => void;
  handlePageChange: (page: number) => void;
}

export const useBlog = (): UseBlogReturn => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [popular, setPopular] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    count: 0,
    current_page: 1,
    total_pages: 1,
    page_size: 10,
  });
  const [currentCategory, setCurrentCategory] = useState('All');
  const [categorySlug, setCategorySlug] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.list();
        setCategories(res.results);
      } catch (err: any) {
        console.error('Categories fetch error:', err);
        // Don't set global error, just log
      }
    };
    fetchCategories();
  }, []);

  // Fetch blogs whenever dependencies change
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: any = {
          page: pagination.current_page,
          search: searchTerm,
        };
        if (currentCategory !== 'All') {
          params.category = categorySlug;
        }
        const res = await blogAPI.list(params);
        setBlogs(res.results);
        setPagination({
          count: res.pagination.count,
          current_page: res.pagination.current_page,
          total_pages: res.pagination.total_pages,
          page_size: res.pagination.page_size,
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [pagination.current_page, searchTerm, currentCategory, categorySlug]);

  // Fetch popular articles
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await blogAPI.getPopular();
        setPopular(data);
      } catch (err: any) {
        console.error('Popular articles error:', err);
      }
    };
    fetchPopular();
  }, []);

  // Update category slug when category changes
  useEffect(() => {
    if (currentCategory === 'All') {
      setCategorySlug('');
    } else {
      const cat = categories.find(c => c.name === currentCategory);
      setCategorySlug(cat?.slug || '');
    }
  }, [currentCategory, categories]);

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, current_page: page }));
  };


  return {
    blogs,
    popular,
    categories,
    pagination,
    loading,
    error,
    currentCategory,
    searchTerm,
    setCurrentCategory,
    setSearchTerm,
    handlePageChange,
  };
};