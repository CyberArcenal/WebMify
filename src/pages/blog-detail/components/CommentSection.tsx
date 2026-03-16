import React, { useState } from 'react';
import { Comment } from '@/api/core/comment';
import { formatDate } from '@/utils/formatters';
import { showSuccess, showError } from '@/utils/notification';

interface Props {
  comments: Comment[];
  blogId: number;
  onPostComment: (data: { name?: string; email?: string; content: string }) => Promise<void>;
  onPostReply: (parentId: number, data: { name?: string; email?: string; content: string }) => Promise<void>;
}

const CommentSection: React.FC<Props> = ({ comments, blogId, onPostComment, onPostReply }) => {
  const [replyFormVisible, setReplyFormVisible] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const content = (form.elements.namedItem('comment') as HTMLTextAreaElement).value;

    if (!content) return;

    setSubmitting(true);
    try {
      await onPostComment({ name, email, content });
      form.reset();
      showSuccess('Comment submitted successfully! It will appear after approval.');
    } catch (err: any) {
      showError(err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent<HTMLFormElement>, parentId: number) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const content = (form.elements.namedItem('reply') as HTMLTextAreaElement).value;

    if (!content) return;

    setSubmitting(true);
    try {
      await onPostReply(parentId, { name, email, content });
      form.reset();
      setReplyFormVisible(null);
      showSuccess('Reply submitted successfully!');
    } catch (err: any) {
      showError(err.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const renderComment = (comment: Comment, depth = 0) => {
    const indent = depth * 32;

    return (
      <div key={comment.id} className="mb-6" style={{ marginLeft: indent }}>
        <div className="bg-card rounded-xl shadow p-6">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-4">
              <div className="bg-card-secondary border-2 border-dashed rounded-full w-12 h-12 bg-cover bg-center"
                   style={comment.author?.avatar ? { backgroundImage: `url(${comment.author.avatar})` } : {}}></div>
            </div>
            <div>
              <h4 className="font-bold text-primary-text">{comment.author?.name || 'Anonymous'}</h4>
              <p className="text-sm text-tertiary-text">
                {formatDate(comment.created_at)}
              </p>
            </div>
          </div>
          <p className="text-secondary-text mb-4">{comment.content}</p>
          <button
            onClick={() => setReplyFormVisible(replyFormVisible === comment.id ? null : comment.id)}
            className="text-primary hover:text-primary-dark text-sm font-medium"
          >
            <i className="fa-regular fa-comment-dots mr-1"></i> Reply
          </button>

          {/* Reply form */}
          {replyFormVisible === comment.id && (
            <div className="mt-4">
              <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-text mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-2 border border-color rounded-lg focus:ring-primary focus:border-primary bg-card text-primary-text"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-text mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-2 border border-color rounded-lg focus:ring-primary focus:border-primary bg-card text-primary-text"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-secondary-text mb-1">Reply</label>
                  <textarea
                    name="reply"
                    rows={3}
                    className="w-full px-4 py-2 border border-color rounded-lg focus:ring-primary focus:border-primary bg-card text-primary-text"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium text-sm disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </form>
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              {comment.replies.map(reply => renderComment(reply, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-bold text-primary-text mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      <div className="bg-card rounded-xl shadow p-6 mb-8">
        <h4 className="text-lg font-bold text-primary-text mb-4">Leave a Comment</h4>
        <form id="comment-form" onSubmit={handleCommentSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-secondary-text mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-color rounded-lg focus:ring-primary focus:border-primary bg-card text-primary-text"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-text mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-color rounded-lg focus:ring-primary focus:border-primary bg-card text-primary-text"
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="comment" className="block text-sm font-medium text-secondary-text mb-1">
              Comment
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={4}
              className="w-full px-4 py-2 border border-color rounded-lg focus:ring-primary focus:border-primary bg-card text-primary-text"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium shadow-md transition-colors disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="text-center text-tertiary-text">
          <i className="fa-regular fa-comment-dots mr-1"></i> No comments yet.
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map(comment => renderComment(comment))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;