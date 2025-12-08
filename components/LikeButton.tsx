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
      <button
        disabled
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>...</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleLike}
      disabled={isToggling}
      className={`flex items-center gap-2 transition-colors ${
        hasLiked
          ? 'text-red-600 hover:text-red-700'
          : 'text-gray-500 hover:text-red-600'
      } ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <svg
        className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`}
        fill={hasLiked ? 'currentColor' : 'none'}
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="font-medium">{likeCount}</span>
    </button>
  );
}

