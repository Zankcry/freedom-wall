'use client';

import { useState, useEffect } from 'react';

interface CommentButtonProps {
  postId: number;
}

export default function CommentButton({ postId }: CommentButtonProps) {
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  if (isLoading) {
    return (
      <button
        disabled
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span>...</span>
      </button>
    );
  }

  return (
    <button
      className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
      onClick={() => {
        // Dispatch event to toggle comments visibility
        const event = new CustomEvent('toggleComments', { detail: { postId } });
        window.dispatchEvent(event);
      }}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
      <span className="font-medium">{commentCount}</span>
    </button>
  );
}

