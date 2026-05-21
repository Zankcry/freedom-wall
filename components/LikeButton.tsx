'use client';

import { useState, useEffect } from 'react';

interface LikeButtonProps {
  postId: number;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Generate or retrieve user identifier from localStorage
    let identifier = localStorage.getItem('userIdentifier');
    if (!identifier) {
      identifier = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userIdentifier', identifier);
    }
    setUserIdentifier(identifier);
  }, []);

  useEffect(() => {
    if (userIdentifier) {
      fetchLikeStatus();
    }
  }, [postId, userIdentifier]);

  const fetchLikeStatus = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/posts/${postId}/likes?userIdentifier=${encodeURIComponent(userIdentifier)}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch like status');
      }
      const data = await response.json();
      setLikeCount(data.count || 0);
      setHasLiked(data.hasLiked || false);
    } catch (err) {
      console.error('Error fetching like status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!userIdentifier || isToggling) return;

    try {
      setIsToggling(true);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);

      const response = await fetch(`/api/posts/${postId}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIdentifier }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      setHasLiked(data.liked);
      setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setIsToggling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/50 dark:bg-zinc-900/50 border border-slate-200/20 dark:border-zinc-800/20 text-slate-400 dark:text-zinc-500 text-xs font-medium">
        <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>...</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isToggling}
      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
        hasLiked
          ? 'bg-rose-50/70 border-rose-100 dark:bg-rose-950/10 dark:border-rose-900/20 text-rose-600 dark:text-rose-400'
          : 'bg-slate-50/50 border-slate-200/50 dark:bg-zinc-900/30 dark:border-zinc-800/30 text-slate-500 hover:text-rose-600 dark:text-zinc-400 dark:hover:text-rose-400 hover:bg-rose-50/30 dark:hover:bg-rose-950/5'
      } ${isToggling ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
    >
      <svg
        className={`w-4 h-4 transition-transform duration-300 ${
          isAnimating ? 'scale-130' : 'group-hover:scale-110'
        } ${hasLiked ? 'fill-rose-600 dark:fill-rose-400' : 'fill-none'}`}
        stroke="currentColor"
        strokeWidth={hasLiked ? 1.5 : 2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-semibold text-xs transition-colors duration-300">{likeCount}</span>
    </button>
  );
}
