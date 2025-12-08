'use client';

import { Post } from '@/types/database';
import { useState } from 'react';
import LikeButton from './LikeButton';
import CommentButton from './CommentButton';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-semibold text-gray-800">{post.codename}</p>
            <p className="text-sm text-gray-500">
              {new Date(post.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.message}</p>
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {post.images.map((image, index) => (
              <div
                key={index}
                className="relative w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center min-h-[200px] max-h-[500px] cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => setExpandedImage(image)}
              >
                <img
                  src={image}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto max-h-[500px] object-contain"
                />
              </div>
            ))}
          </div>
        )}
        
        {/* Like and Comment Section */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-6">
            <LikeButton postId={post.id} />
            <CommentButton postId={post.id} />
          </div>
          <CommentSection postId={post.id} />
        </div>
      </div>

      {/* Full-size image modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={expandedImage}
              alt="Expanded view"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-colors"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

