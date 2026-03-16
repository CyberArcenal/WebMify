import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import blogAPI, { Blog } from '@/api/core/blog';
import commentAPI, { Comment } from '@/api/core/comment';
import profileAPI, { Profile } from '@/api/core/profile';
import projectAPI, { Project } from '@/api/core/project'; // for related articles? but we'll use blogAPI for related

export interface BlogDetailData {
  blog: Blog | null;
  comments: Comment[];
  relatedArticles: Blog[];
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  fetchComments: () => Promise<void>;
  postComment: (data: any) => Promise<void>;
  postReply: (parentId: number, data: any) => Promise<void>;
}

export const useBlogDetail = (): BlogDetailData => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<Blog[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog, comments, profile, related
  useEffect(() => {
    const fetchAll = async () => {
      if (!slug) {
        setError('Invalid blog slug');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch blog details
        const blogData = await blogAPI.getBySlug(slug);
        setBlog(blogData);

        // Fetch profile
        try {
          const profileData = await profileAPI.get();
          setProfile(profileData);
        } catch (err) {
          console.error('Failed to fetch profile', err);
          // non-critical, don't set error
        }

        // Fetch comments
        try {
          const commentsRes = await commentAPI.list({
            content_type: 'blog',
            object_id: blogData.id,
            page_size: 50,
          });
          setComments(commentsRes.results);
        } catch (err) {
          console.error('Failed to fetch comments', err);
        }

        // Fetch related articles (by first category)
        if (blogData.categories && blogData.categories.length > 0) {
          const categorySlug = blogData.categories[0].slug;
          const relatedRes = await blogAPI.list({
            category: categorySlug,
            page_size: 2,
          });
          // exclude current blog
          const filtered = relatedRes.results.filter(b => b.id !== blogData.id);
          setRelatedArticles(filtered.slice(0, 2));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [slug]);

  const fetchComments = async () => {
    if (!blog) return;
    try {
      const res = await commentAPI.list({
        content_type: 'blog',
        object_id: blog.id,
        page_size: 50,
      });
      setComments(res.results);
    } catch (err) {
      console.error('Failed to refresh comments', err);
    }
  };

  const postComment = async (data: any) => {
    if (!blog) return;
    const payload = {
      ...data,
      blog: blog.id,
    };
    const newComment = await commentAPI.create(payload);
    // refresh comments
    await fetchComments();
  };

  const postReply = async (parentId: number, data: any) => {
    if (!blog) return;
    const payload = {
      ...data,
      blog: blog.id,
      parent: parentId,
    };
    await commentAPI.create(payload);
    await fetchComments();
  };

  return {
    blog,
    comments,
    relatedArticles,
    profile,
    loading,
    error,
    fetchComments,
    postComment,
    postReply,
  };
};