import React, { useState } from "react";
import { Comment } from "@/api/core/comment";
import { formatDate, formatDateTime } from "@/utils/formatters";
import { showSuccess, showError } from "@/utils/notification";
import Pagination from "@/components/UI/Pagination";

interface Props {
  comments: Comment[];
  blogId: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
  };
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
  onPageChange: (page: number) => Promise<void>;
  onPostComment: (data: {
    name?: string;
    email?: string;
    content: string;
  }) => Promise<void>;
  onPostReply: (
    parentId: number,
    data: { name?: string; email?: string; content: string },
  ) => Promise<void>;
}

const CommentSection: React.FC<Props> = ({
  comments,
  pagination,
  loadingReplies,
  loadRepliesPage,
  replyPagination,
  onPageChange,
  onPostComment,
  onPostReply,
}) => {
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyContents, setReplyContents] = useState<Record<number, string>>({});
  const [userExpanded, setUserExpanded] = useState<Set<number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (
      e.currentTarget.elements.namedItem("name") as HTMLInputElement
    )?.value.trim();
    const email = (
      e.currentTarget.elements.namedItem("email") as HTMLInputElement
    )?.value.trim();
    const content = newCommentContent.trim();

    if (!content) return;

    setSubmitting(true);
    try {
      await onPostComment({
        name: name || undefined,
        email: email || undefined,
        content,
      });
      setNewCommentContent("");
      e.currentTarget.reset();
      showSuccess("Comment submitted! It will appear after approval.");
    } catch (err: any) {
      showError(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: number) => {
    const content = replyContents[parentId]?.trim();
    if (!content) return;

    setSubmitting(true);
    try {
      await onPostReply(parentId, { content });
      setUserExpanded((prev) => new Set([...prev, parentId]));
      setReplyContents((prev) => ({ ...prev, [parentId]: "" }));
      setActiveReplyId(null);
      showSuccess("Reply submitted!");
    } catch (err: any) {
      showError(err.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleReplyForm = (id: number) => {
    setActiveReplyId((prev) => (prev === id ? null : id));
  };

  const toggleThread = (id: number) => {
    setUserExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const hasLoadedReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = userExpanded.has(comment.id);
    const showReplies = hasLoadedReplies && isExpanded;
    const indent = Math.min(depth * 32, 96);

    return (
      <div key={comment.id} className="relative mb-3 last:mb-0">
        {depth > 0 && (
          <div
            className="absolute top-2 bottom-0 w-0.5 bg-card-secondary rounded-full"
            style={{ left: `${indent - 16}px` }}
          />
        )}

        <div className="flex gap-2.5" style={{ marginLeft: `${indent}px` }}>
          {/* Avatar */}
          <div className="flex-shrink-0 pt-0.5">
            {comment.author?.avatar ? (
              <img
                src={comment.author.avatar}
                alt=""
                className="w-8 h-8 rounded-full object-cover ring-1 ring-border-color"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-card-secondary flex items-center justify-center text-tertiary-text text-sm">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>

          {/* Comment content - block level */}
          <div className="flex-1 min-w-0">
            <div className="px-3.5 py-2 text-sm">
              <div className="font-medium text-primary-text text-[0.94rem]">
                {comment.author?.name || "Anonymous"}
              </div>
              <div className="text-secondary-text leading-snug break-words whitespace-pre-wrap mt-0.5">
                {comment.content}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-1 flex items-center gap-3 text-xs text-tertiary-text">
              <span>{formatDateTime(comment.created_at)}</span>
              <button
                onClick={() => toggleReplyForm(comment.id)}
                className="font-medium hover:text-primary transition-colors"
              >
                Reply
              </button>
            </div>

            {/* Reply form */}
            {activeReplyId === comment.id && (
              <div className="mt-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-card-secondary flex items-center justify-center text-tertiary-text text-xs flex-shrink-0">
                  <i className="fas fa-user"></i>
                </div>
                <div className="flex-1 flex items-center bg-card-secondary rounded-full px-3 py-1.5 text-sm border border-color">
                  <input
                    placeholder="Write reply..."
                    value={replyContents[comment.id] || ""}
                    onChange={(e) =>
                      setReplyContents((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReplySubmit(comment.id);
                      }
                    }}
                    className="flex-1 bg-transparent border-none focus:outline-none min-w-0 text-sm text-primary-text"
                  />
                  <button
                    onClick={() => handleReplySubmit(comment.id)}
                    disabled={submitting || !replyContents[comment.id]?.trim()}
                    className="ml-1.5 text-primary hover:text-primary-dark disabled:opacity-40 text-base"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            )}

            {/* Thread toggle */}
            {comment.replies_count > 0 && (
              <div className="mt-1.5">
                <button
                  onClick={() => {
                    if (!hasLoadedReplies) {
                      loadRepliesPage(comment.id, 1);
                      setUserExpanded((prev) => new Set([...prev, comment.id]));
                    } else {
                      toggleThread(comment.id);
                    }
                  }}
                  disabled={loadingReplies[comment.id]}
                  className="text-xs text-primary hover:underline flex items-center gap-1.5 disabled:opacity-50"
                >
                  <i
                    className={`fas fa-chevron-${
                      loadingReplies[comment.id]
                        ? "down animate-spin"
                        : !hasLoadedReplies
                          ? "down"
                          : isExpanded
                            ? "up"
                            : "down"
                    } text-[0.75rem]`}
                  />
                  {loadingReplies[comment.id]
                    ? "Loading..."
                    : !hasLoadedReplies
                      ? `${comment.replies_count} ${comment.replies_count === 1 ? "reply" : "replies"}`
                      : isExpanded
                        ? "Hide replies"
                        : `${comment.replies_count} ${comment.replies_count === 1 ? "reply" : "replies"}`}
                </button>

                {/* Loaded replies */}
                {showReplies && (
                  <>
                    <div className="mt-3 space-y-3">
                      {comment.replies.map((reply) =>
                        renderComment(reply, depth + 1),
                      )}
                    </div>

                    {/* Pagination for thread */}
                    {replyPagination[comment.id]?.totalPages > 1 && (
                      <div className="mt-4 flex justify-center">
                        <Pagination
                          currentPage={replyPagination[comment.id].currentPage}
                          totalPages={replyPagination[comment.id].totalPages}
                          onPageChange={(newPage) =>
                            loadRepliesPage(comment.id, newPage)
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mb-16">
      <h3 className="text-xl font-bold text-primary-text mb-5">
        Comments {pagination.totalCount > 0 && `(${pagination.totalCount})`}
      </h3>

      {/* New comment form */}
      <div className="bg-card-secondary/50 rounded-xl p-4 mb-8 border border-color">
        <form onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="What are your thoughts?"
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            rows={2}
            className="w-full bg-card border border-color rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none text-primary-text"
            required
          />

          <div className="mt-3 flex flex-wrap gap-3 justify-between items-center">
            <div className="flex flex-wrap gap-3">
              <input
                name="name"
                placeholder="Name (optional)"
                className="text-sm px-3 py-1.5 border border-color rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-primary min-w-[140px] text-primary-text"
              />
              <input
                name="email"
                type="email"
                placeholder="Email (optional)"
                className="text-sm px-3 py-1.5 border border-color rounded-lg bg-transparent focus:outline-none focus:ring-1 focus:ring-primary min-w-[140px] text-primary-text"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !newCommentContent.trim()}
              className="px-5 py-1.5 bg-primary hover:bg-primary-dark text-white rounded-lg text-sm font-medium disabled:opacity-60 transition min-w-[100px]"
            >
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center py-10 text-tertiary-text text-sm">
          <i className="far fa-comment-dots text-2xl mb-2 block"></i>
          No comments yet.
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment, 0))}
        </div>
      )}

      {/* Top-level pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CommentSection;