'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/types/database';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import AdminLogin from '@/components/AdminLogin';
import BackgroundStickers from '@/components/BackgroundStickers';
import ThemeToggle from '@/components/ThemeToggle';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'deleted'>('pending');

  useEffect(() => {
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?includeDeleted=true');
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

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_approved: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to approve post');
      }

      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject this post? It will be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post? You can undo this action later.')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUndo = async (id: number) => {
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_deleted: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to restore post');
      }

      fetchPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === 'pending') return !post.is_approved && !post.is_deleted;
    if (filter === 'approved') return post.is_approved && !post.is_deleted;
    if (filter === 'deleted') return post.is_deleted === true;
    return !post.is_deleted;
  });

  if (!isAuthenticated) {
    return <AdminLogin onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 relative selection:bg-indigo-500/25">
      <BackgroundStickers />
      <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3.5xl font-extrabold text-slate-800 dark:text-zinc-50 tracking-tight">Admin Console</h1>
              <p className="text-slate-500 dark:text-zinc-400 text-sm">Review, approve, and manage posts submitted by users.</p>
            </div>
            
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                href="/"
                className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 hover:bg-slate-100 dark:hover:bg-zinc-850 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300"
              >
                ← Back to Wall
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold px-4 py-2.5 rounded-xl border border-rose-100 dark:border-rose-900/20 bg-rose-50/70 dark:bg-rose-950/10 text-rose-600 dark:text-rose-450 hover:bg-rose-100/70 dark:hover:bg-rose-950/20 transition-all duration-300 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Unified Filter Tabs segmented control */}
          <div className="p-1 rounded-2xl bg-slate-200/50 dark:bg-zinc-900/50 border border-slate-200/20 dark:border-zinc-800/20 flex gap-1 max-w-lg">
            <button
              onClick={() => setFilter('pending')}
              className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                filter === 'pending'
                  ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-50 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-350'
              }`}
            >
              Pending ({posts.filter((p) => !p.is_approved && !p.is_deleted).length})
            </button>
            <button
              onClick={() => setFilter('approved')}
              className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                filter === 'approved'
                  ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-50 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-350'
              }`}
            >
              Approved ({posts.filter((p) => p.is_approved && !p.is_deleted).length})
            </button>
            <button
              onClick={() => setFilter('deleted')}
              className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                filter === 'deleted'
                  ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-50 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-350'
              }`}
            >
              Deleted ({posts.filter((p) => p.is_deleted).length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-zinc-800 text-slate-800 dark:text-zinc-50 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-zinc-350'
              }`}
            >
              All ({posts.filter((p) => !p.is_deleted).length})
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-rose-600 dark:text-rose-450 p-4 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-2 border-indigo-500 border-t-transparent"></div>
            <p className="mt-4 text-xs font-medium text-slate-400 dark:text-zinc-500">Retrieving secure logs...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="glass-panel border border-slate-200/40 dark:border-zinc-800/40 rounded-3xl p-12 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
            <p className="text-slate-400 dark:text-zinc-500 text-sm font-medium">No posts matched this state.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="relative group">
                <div className={`transition-opacity duration-300 ${post.is_deleted ? 'opacity-50' : ''}`}>
                  <PostCard post={post} />
                </div>
                
                {/* Admin controls container integrated neatly overlaying the card */}
                <div className="absolute top-4.5 right-4.5 flex gap-2 z-20">
                  {post.is_deleted ? (
                    <button
                      onClick={() => handleUndo(post.id)}
                      className="bg-indigo-600 text-white dark:bg-indigo-500 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-all duration-200 shadow-sm cursor-pointer"
                    >
                      Restore Post
                    </button>
                  ) : !post.is_approved ? (
                    <>
                      <button
                        onClick={() => handleApprove(post.id)}
                        className="bg-emerald-600 text-white dark:bg-emerald-500 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-emerald-700 dark:hover:bg-emerald-400 transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(post.id)}
                        className="bg-rose-600 text-white dark:bg-rose-500 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-rose-700 dark:hover:bg-rose-400 transition-all duration-200 shadow-sm cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="bg-emerald-50/70 border border-emerald-100/50 dark:bg-emerald-950/15 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-3 py-1.5 rounded-xl select-none">
                        Approved
                      </span>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="bg-rose-600 text-white dark:bg-rose-500 text-[10px] font-bold px-3 py-1.5 rounded-xl hover:bg-rose-700 dark:hover:bg-rose-450 transition-all duration-200 shadow-sm cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Move to trash bin"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
