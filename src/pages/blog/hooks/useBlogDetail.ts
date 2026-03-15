import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import blogAPI, { Blog } from '@/api/core/blog';

export const useBlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Invalid blog slug');
      setLoading(false);
      return;
    }
    const fetchBlog = async () => {
      try {
        const data = await blogAPI.getBySlug(slug);
        setBlog(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  return { blog, loading, error };
};