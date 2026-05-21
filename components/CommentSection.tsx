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
      setDisplayLimit(8);
      setComments(data || []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleToggle = (event: CustomEvent) => {
      if (event.detail.postId === postId) {
        setShowComments((prev) => {
          const newState = !prev;
          if (newState) {
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
      
      // Refresh comment count
      const event = new CustomEvent('refreshCommentCount', { detail: { postId } });
      window.dispatchEvent(event);

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
    <div className="mt-4 border-t border-slate-100 dark:border-zinc-800/60 pt-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-zinc-200">
          Comments ({comments.length})
        </h3>
        <div className="flex gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 cursor-pointer"
          >
            {showForm ? 'Cancel' : 'Add Comment'}
          </button>
          <button
            onClick={() => {
              setShowComments(false);
              // Dispatch event to sync CommentButton open state
              const event = new CustomEvent('toggleComments', { detail: { postId } });
              window.dispatchEvent(event);
            }}
            className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors duration-200 cursor-pointer"
          >
            Hide
          </button>
        </div>
      </div>

      {/* Form Drawer */}
      <div className={`overflow-hidden transition-all duration-300 ${showForm ? 'max-h-[300px] mb-4 opacity-100' : 'max-h-0 opacity-0'}`}>
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 backdrop-blur-sm">
          {error && (
            <div className="mb-3 p-2.5 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs">
              {error}
            </div>
          )}
          <div className="mb-3">
            <input
              type="text"
              value={codename}
              onChange={(e) => setCodename(e.target.value)}
              placeholder="Your codename"
              className="w-full px-3.5 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs text-slate-800 dark:text-zinc-100 bg-white/70 dark:bg-zinc-900/50 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-all duration-200"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write an elegant response..."
              rows={3}
              className="w-full px-3.5 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none text-xs text-slate-800 dark:text-zinc-100 bg-white/70 dark:bg-zinc-900/50 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-4 py-2 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-zinc-200 active:scale-98 transition-all duration-200 disabled:bg-slate-300 dark:disabled:bg-zinc-800 disabled:text-slate-500 disabled:cursor-not-allowed text-xs cursor-pointer shadow-sm"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="text-center py-6 text-slate-400 dark:text-zinc-500 text-xs animate-pulse">
          Loading conversation...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-6 text-slate-400 dark:text-zinc-500 text-xs italic">
          No comments yet. Start the conversation!
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {comments.slice(0, Math.min(displayLimit, comments.length)).map((comment) => (
              <div
                key={comment.id}
                className="bg-white/80 dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800/30 rounded-2xl p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 hover:border-slate-200 dark:hover:border-zinc-800"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-zinc-300 text-xs">
                    {comment.codename}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                    {new Date(comment.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">
                  {comment.message}
                </p>
              </div>
            ))}
          </div>

          {/* Show More */}
          {comments.length > displayLimit && (
            <div className="mt-3 text-center">
              <button
                onClick={() => setDisplayLimit(comments.length)}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200 cursor-pointer"
              >
                Show {comments.length - displayLimit} more comments
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
