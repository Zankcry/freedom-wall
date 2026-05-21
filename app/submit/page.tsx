'use client';

import { useState } from 'react';
import PostForm from '@/components/PostForm';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BackgroundStickers from '@/components/BackgroundStickers';

export default function SubmitPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const handleSuccess = () => {
    setSubmitted(true);
    // Redirect to home page after 2 seconds
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 relative selection:bg-indigo-500/25">
      <BackgroundStickers />
      <div className="container mx-auto px-4 py-12 max-w-2xl relative z-10">
        <header className="mb-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 mb-6 transition-all duration-300"
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform duration-300">←</span> Back to Freedom Wall
          </Link>
          <h1 className="text-3.5xl font-extrabold text-slate-800 dark:text-zinc-50 tracking-tight mb-2">
            Submit Your Message
          </h1>
          <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">
            Share your authentic thoughts with the community. Your message will be reviewed by an administrator prior to appearing on the wall.
          </p>
        </header>

        <div className="glass-panel border border-slate-200/40 dark:border-zinc-800/40 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] backdrop-blur-xl">
          {submitted ? (
            <div className="text-center py-8 animate-fadeIn">
              <div className="mb-5 flex justify-center">
                <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 rounded-full flex items-center justify-center text-emerald-500">
                  <svg
                    className="h-8 w-8 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-zinc-50 mb-2">Message Submitted!</h2>
              <p className="text-slate-500 dark:text-zinc-400 text-sm mb-5">
                Your message has been uploaded and queued.
              </p>
              
              <div className="bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-200/50 dark:border-zinc-800/40 rounded-2xl p-4.5 mb-6 text-left max-w-md mx-auto">
                <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 flex items-center gap-1.5">
                  <span>📋</span> Review Guidelines
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  Administrators review posts to filter out harmful material and maintain a warm, welcoming community space. Thank you for making this wall amazing!
                </p>
              </div>
              <p className="text-xs text-slate-400 dark:text-zinc-500 animate-pulse">Redirecting to Wall...</p>
            </div>
          ) : (
            <PostForm onSuccess={handleSuccess} />
          )}
        </div>

        <div className="mt-8 text-center text-slate-400 dark:text-zinc-500 text-xs">
          <p>
            All messages are subject to automatic encryption and manual administrative verification.
          </p>
        </div>
      </div>
    </div>
  );
}
