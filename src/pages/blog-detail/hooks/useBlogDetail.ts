// src/hooks/useBlogDetail.ts  (or wherever this file lives)

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import blogAPI, { Blog } from "@/api/core/blog";
import commentAPI, { Comment } from "@/api/core/comment";
import profileAPI, { Profile } from "@/api/core/profile";

export interface BlogDetailData {
  blog: Blog | null;
  comments: Comment[];
  commentPagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
  relatedArticles: Blog[];
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  loadingReplies: Record<number, boolean>;
  loadRepliesPage: (parentId: number, page?: number) => Promise<void>;
  replyPagination: Record<
    number,
    {
      currentPage: number;
      totalPages: number;
      pageSize: number;
      totalCount: number;
    }
  >;
  loadRepliesForComment: (commentId: number) => Promise<void>;
  fetchCommentsPage: (page: number) => Promise<void>;
  postComment: (data: any) => Promise<void>;
  postReply: (parentId: number, data: any) => Promise<void>;
}

// Helper to turn flat list → nested tree + sort newest first
const buildCommentTree = (flatComments: Comment[]): Comment[] => {
  const commentMap = new Map<number, Comment & { replies: Comment[] }>();
  const roots: Comment[] = [];

  // 1. Populate map + initialize empty replies array
  flatComments.forEach((comment) => {
    commentMap.set(comment.id, {
      ...comment,
      replies: [],
    });
  });

  // 2. Link children to parents
  flatComments.forEach((comment) => {
    const node = commentMap.get(comment.id)!;

    if (comment.parent !== null && comment.parent !== undefined) {
      const parent = commentMap.get(comment.parent);
      if (parent) {
        parent.replies.push(node);
      } else {
        roots.push(node); // orphan
      }
    } else {
      roots.push(node);
    }
  });

  // 3. Sort: NEWEST FIRST (reverse chronological)
  const sortReplies = (node: Comment & { replies: Comment[] }) => {
    // Newest on top → subtract b from a
    node.replies.sort((a, b) => {
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

    // Recurse into children
    node.replies.forEach(sortReplies);
  };

  // Also sort root comments newest first
  roots.sort((a, b) => {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  roots.forEach(sortReplies);

  return roots;
};

export const useBlogDetail = (): BlogDetailData => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingReplies, setLoadingReplies] = useState<Record<number, boolean>>(
    {},
  );

  const [replyPagination, setReplyPagination] = useState<
    Record<
      number,
      {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalCount: number;
      }
    >
  >({});

  const [commentPagination, setCommentPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [relatedArticles, setRelatedArticles] = useState<Blog[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadRepliesPage = async (parentId: number, page: number = 1) => {
    if (!blog?.id) return;
    if (loadingReplies[parentId]) return;

    setLoadingReplies((prev) => ({ ...prev, [parentId]: true }));

    try {
      const res = await commentAPI.list({
        content_type: "blog",
        object_id: blog.id,
        parent: parentId.toString(),
        page,
        page_size: 10, // or make configurable, e.g. 15–20 for replies
      });

      // Merge new replies into the existing ones (append if page > 1)
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === parentId
            ? {
                ...comment,
                replies:
                  page === 1
                    ? res.results
                    : [...(comment.replies || []), ...res.results],
                replies_count: res.pagination.count, // update total count
              }
            : comment,
        ),
      );

      // Update pagination state for this thread
      setReplyPagination((prev) => ({
        ...prev,
        [parentId]: {
          currentPage: res.pagination.current_page,
          totalPages: res.pagination.total_pages,
          pageSize: res.pagination.page_size,
          totalCount: res.pagination.count,
        },
      }));
    } catch (err) {
      console.error(`Failed to load replies for comment ${parentId}`, err);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [parentId]: false }));
    }
  };
  const loadRepliesForComment = async (commentId: number) => {
    if (loadingReplies[commentId]) return;

    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
    try {
      const res = await commentAPI.list({
        content_type: "blog",
        object_id: blog?.id!,
        parent: commentId.toString(), // kunin replies ng specific parent
        page_size: 50, // o mas maliit kung marami
        // page: 1, etc. kung may pagination sa replies
      });

      // Update yung specific comment sa state
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === commentId
            ? { ...c, replies: res.results, replies_count: res.results.length }
            : c,
        ),
      );
    } catch (err) {
      console.error("Failed to load replies", err);
    } finally {
      setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      if (!slug) {
        setError("Invalid blog slug");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const blogData = await blogAPI.getBySlug(slug);
        setBlog(blogData);

        try {
          const profileData = await profileAPI.get();
          setProfile(profileData);
        } catch (err) {
          console.error("Failed to fetch profile", err);
        }

        await fetchCommentsPage(1, blogData.id);

        if (blogData.categories && blogData.categories.length > 0) {
          const categorySlug = blogData.categories[0].slug;
          const relatedRes = await blogAPI.list({
            category: categorySlug,
            page_size: 2,
          });
          const filtered = relatedRes.results.filter(
            (b) => b.id !== blogData.id,
          );
          setRelatedArticles(filtered.slice(0, 2));
        }
      } catch (err: any) {
        setError(err.message || "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [slug]);

  const fetchCommentsPage = async (page: number, blogIdOverride?: number) => {
    const targetBlogId = blogIdOverride || blog?.id;
    if (!targetBlogId) return;

    try {
      const res = await commentAPI.list({
        content_type: "blog",
        object_id: targetBlogId,
        page,
        page_size: commentPagination.pageSize,
      });

      // ── Key change: transform flat → nested ──
      const nestedComments = buildCommentTree(res.results);

      setComments(nestedComments);
      setCommentPagination({
        currentPage: res.pagination.current_page,
        totalPages: res.pagination.total_pages,
        pageSize: res.pagination.page_size,
        totalCount: res.pagination.count,
      });
    } catch (err) {
      console.error("Failed to fetch comments", err);
    }
  };

  const postComment = async (data: any) => {
    if (!blog) return;
    const payload = { ...data, blog: blog.id };
    await commentAPI.create(payload);
    await fetchCommentsPage(1);
  };

  const postReply = async (parentId: number, data: any) => {
    if (!blog) return;
    const payload = { ...data, blog: blog.id, parent: parentId };
    await commentAPI.create(payload);
    await fetchCommentsPage(1);
  };

  return {
    blog,
    comments,
    commentPagination,
    relatedArticles,
    profile,
    loading,
    error,
    loadRepliesPage,
    replyPagination,
    loadingReplies,
    loadRepliesForComment,
    fetchCommentsPage,
    postComment,
    postReply,
  };
};
