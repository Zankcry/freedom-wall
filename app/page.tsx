'use client';

import { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import { Post } from '@/types/database';
import Link from 'next/link';
import BackgroundStickers from '@/components/BackgroundStickers';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?approved=true');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 relative selection:bg-indigo-500/25">
      <BackgroundStickers />
      
      {/* Floating Theme Switcher top header layout */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16 max-w-2xl relative z-10">
        <header className="text-center mb-12">
          {/* Stunning styled heading */}
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2.5 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-100 bg-clip-text text-transparent">
            Freedom Wall
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm md:text-base font-normal max-w-md mx-auto leading-relaxed mb-6">
            An open forum to share your authentic feelings, support messages, and anonymous whispers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/submit"
              className="bg-slate-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-6 py-2.5 rounded-full font-bold hover:scale-105 active:scale-98 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-indigo-500/5 dark:hover:shadow-purple-500/5 hover:bg-slate-800 dark:hover:bg-zinc-200 cursor-pointer text-xs"
            >
              Submit a Message
            </Link>
          </div>
        </header>

        <div className="max-w-xl mx-auto space-y-6">
          {loading ? (
            <div className="text-center py-20 animate-pulse">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-300 dark:border-zinc-700 border-t-indigo-600 dark:border-t-indigo-400 mb-4"></div>
              <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500">Decrypting messages...</p>
            </div>
          ) : error ? (
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-semibold text-center">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="glass-panel border border-slate-200/40 dark:border-zinc-800/40 rounded-3xl p-10 text-center shadow-[0_4px_25px_rgba(0,0,0,0.01)] backdrop-blur-xl animate-fadeIn">
              <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium mb-5">No thoughts have been pinned yet. Be the first!</p>
              <Link
                href="/submit"
                className="inline-block bg-slate-900 text-white dark:bg-zinc-50 dark:text-zinc-900 px-6 py-2.5 rounded-full font-bold hover:scale-105 active:scale-98 transition-all duration-300 shadow-md hover:bg-slate-800 dark:hover:bg-zinc-200 cursor-pointer text-xs"
              >
                Submit Your First Message
              </Link>
            </div>
          ) : (
            <div className="space-y-6 animate-fadeIn">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
