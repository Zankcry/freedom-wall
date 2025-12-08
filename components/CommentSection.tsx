'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/types/database';

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(8);
  const [codename, setCodename] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      // Reset display limit BEFORE setting comments to ensure it applies
      setDisplayLimit(8);
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Listen for toggle event from CommentButton
    const handleToggle = (event: CustomEvent) => {
      if (event.detail.postId === postId) {
        setShowComments((prev) => {
          const newState = !prev;
          if (newState) {
            // Reset display limit when opening comments
            setDisplayLimit(8);
            fetchComments();
          }
          return newState;
        });
      }
    };

    window.addEventListener('toggleComments', handleToggle as EventListener);
    return () => {
      window.removeEventListener('toggleComments', handleToggle as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!codename.trim() || !message.trim()) {
      setError('Please fill in both codename and message');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codename: codename.trim(), message: message.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit comment');
      }

      const newComment = await response.json();
      setComments([...comments, newComment]);
      setCodename('');
      setMessage('');
      setShowForm(false);
      // Refresh comment count by dispatching event
      const event = new CustomEvent('refreshCommentCount', { detail: { postId } });
      window.dispatchEvent(event);
      // If showing limited comments and we're at the limit, expand to show the new one
      if (comments.length >= displayLimit) {
        setDisplayLimit(comments.length + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showComments) {
    return null;
  }

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Comments ({comments.length})
        </h3>
        <div className="flex gap-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            {showForm ? 'Cancel' : 'Add Comment'}
          </button>
          <button
            onClick={() => setShowComments(false)}
            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Hide
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-lg">
          {error && (
            <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          <div className="mb-3">
            <input
              type="text"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              placeholder="Your codename"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 bg-white placeholder:text-gray-500"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-gray-900 bg-white placeholder:text-gray-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {isSubmitting ? 'Submitting...' : 'Post Comment'}
          </button>
        </form>
      )}

      {isLoading ? (
        <div className="text-center py-4 text-gray-500 text-sm">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-4 text-gray-500 text-sm">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {comments.slice(0, Math.min(displayLimit, comments.length)).map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-gray-800 text-sm">{comment.codename}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.message}</p>
              </div>
            ))}
          </div>
          {comments.length > displayLimit && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setDisplayLimit(comments.length)}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Show more... ({comments.length - displayLimit} more)
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

