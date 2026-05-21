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
      <div className="glass-panel border border-slate-200/40 dark:border-zinc-800/40 rounded-3xl p-6 md:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)] hover:border-slate-300/60 dark:hover:border-zinc-700/40 group relative overflow-hidden">
        {/* Glow corner detail */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent dark:from-indigo-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-tr-3xl" />
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4.5 relative z-10">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-zinc-100 tracking-tight text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
              {post.codename}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 mt-0.5">
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

        {/* Message */}
        <p className="text-slate-700 dark:text-zinc-300 whitespace-pre-wrap text-[14px] md:text-[15px] leading-relaxed mb-5 font-normal tracking-wide relative z-10">
          {post.message}
        </p>

        {/* Images Grid */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-3.5 mb-5 relative z-10 ${
            post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          }`}>
            {post.images.map((image, index) => (
              <div
                key={index}
                className="group/img relative w-full rounded-2xl overflow-hidden bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/40 flex items-center justify-center min-h-[160px] max-h-[360px] cursor-pointer hover:shadow-sm transition-all duration-300"
                onClick={() => setExpandedImage(image)}
              >
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-auto max-h-[360px] object-contain transition-transform duration-500 group-hover/img:scale-[1.03]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 dark:bg-black/25 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="bg-white/95 dark:bg-zinc-900/95 text-slate-800 dark:text-zinc-100 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-md transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300">
                    Zoom view
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Interaction Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-zinc-800/60 flex flex-col gap-2 relative z-10">
          <div className="flex items-center gap-3">
            <LikeButton postId={post.id} />
            <CommentButton postId={post.id} />
          </div>
          <CommentSection postId={post.id} />
        </div>
      </div>

      {/* Expanded Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/90 dark:bg-zinc-950/95 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setExpandedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img
              src={expandedImage}
              alt="Expanded high quality view"
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/5"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-[-48px] md:top-2 right-2 text-zinc-400 dark:text-zinc-500 hover:text-white dark:hover:text-white bg-white/10 dark:bg-zinc-900/40 hover:bg-white/20 dark:hover:bg-zinc-800/50 rounded-full p-2.5 transition-all duration-200 cursor-pointer shadow-lg"
              aria-label="Close high quality view"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
