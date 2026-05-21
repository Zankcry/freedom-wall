'use client';

import { useState, useEffect } from 'react';

interface CommentButtonProps {
  postId: number;
}

export default function CommentButton({ postId }: CommentButtonProps) {
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setCommentCount((data || []).length);
    } catch (err) {
      console.error('Error fetching comment count:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommentCount();
  }, [postId]);

  // Listen for refresh events (when new comment is added)
  useEffect(() => {
    const handleRefresh = (event: CustomEvent) => {
      if (event.detail.postId === postId) {
        fetchCommentCount();
      }
    };

    window.addEventListener('refreshCommentCount', handleRefresh as EventListener);
    return () => {
      window.removeEventListener('refreshCommentCount', handleRefresh as EventListener);
    };
  }, [postId]);

  // Listen to toggle events to keep track of open/closed state
  useEffect(() => {
    const handleToggle = (event: CustomEvent) => {
      if (event.detail.postId === postId) {
        // Toggle happens in CommentSection, but let's sync state
        // To be safe, we can trigger toggle event and track it
      }
    };
    // Standard toggler listener
  }, [postId]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-zinc-900/50 border border-slate-200/20 dark:border-zinc-800/20 text-slate-400 dark:text-zinc-500 text-xs font-medium">
        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span>...</span>
      </div>
    );
  }

  return (
    <button
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
        isOpen
          ? 'bg-indigo-50/70 border-indigo-100 dark:bg-indigo-950/10 dark:border-indigo-900/20 text-indigo-600 dark:text-indigo-400'
          : 'bg-slate-50/50 border-slate-200/50 dark:bg-zinc-900/30 dark:border-zinc-800/30 text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/5'
      } cursor-pointer active:scale-95`}
      onClick={() => {
        setIsOpen(!isOpen);
        // Dispatch event to toggle comments visibility
        const event = new CustomEvent('toggleComments', { detail: { postId } });
        window.dispatchEvent(event);
      }}
    >
      <svg
        className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <span className="font-semibold text-xs transition-colors duration-300">{commentCount}</span>
    </button>
  );
}
