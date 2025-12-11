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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      <BackgroundStickers />
      <div className="container mx-auto px-4 py-8 max-w-3xl relative z-10">
        <header className="mb-8">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
          >
            ← Back to Freedom Wall
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Submit Your Message</h1>
          <p className="text-gray-600">
            Share your thoughts with the community. Your message will appear after admin approval.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Message Submitted!</h2>
              <p className="text-gray-600 mb-3">
                Your message has been submitted successfully.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-left">
                <p className="text-sm text-gray-700 font-medium mb-1">📋 Review Process</p>
                <p className="text-sm text-gray-600">
                  Your message will be reviewed by an administrator and will be either <strong>approved</strong> or <strong>rejected</strong> before being posted on the Freedom Wall. 
                  This process helps maintain a positive community environment.
                </p>
              </div>
              <p className="text-sm text-gray-500">Redirecting to Freedom Wall...</p>
            </div>
          ) : (
            <PostForm onSuccess={handleSuccess} />
          )}
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            All messages are reviewed before being published to maintain a positive community
            environment.
          </p>
        </div>
      </div>
    </div>
  );
}

