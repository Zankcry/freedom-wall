'use client';

import { useState } from 'react';

export default function PostForm({ onSuccess }: { onSuccess?: () => void }) {
  const [message, setMessage] = useState('');
  const [codename, setCodename] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const compressImage = (file: File, maxWidth: number = 1920, maxHeight: number = 1920, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error('Failed to read compressed image'));
              reader.readAsDataURL(blob);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Limit file size (2MB per image before compression)
      const maxSize = 2 * 1024 * 1024; // 2MB
      const oversizedFiles = files.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        setError(`Some images are too large. Maximum size is 2MB per image.`);
        return;
      }

      // Limit number of images
      if (files.length > 4) {
        setError(`Maximum 4 images allowed.`);
        return;
      }
      
      setImageFiles(files);
      
      try {
        setError(''); // Clear any previous errors
        // Compress and convert images to base64
        const base64Promises = files.map((file) => compressImage(file));
        const base64Images = await Promise.all(base64Promises);
        
        // Check total size (base64 is ~33% larger, and Vercel limit is ~4.5MB)
        const totalSize = base64Images.reduce((sum, img) => sum + img.length, 0);
        const maxTotalSize = 3 * 1024 * 1024; // 3MB total for safety
        
        if (totalSize > maxTotalSize) {
          setError(`Total image size is too large. Please use fewer or smaller images.`);
          setImages([]);
          setImageFiles([]);
          return;
        }
        
        setImages(base64Images);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to process images');
        setImages([]);
        setImageFiles([]);
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
    setImageFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          codename,
          images: images.length > 0 ? images : null,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit post';
        
        if (response.status === 413) {
          errorMessage = 'Images are too large. Please use fewer or smaller images (max 2MB each, 4 images total).';
          setImages([]);
          setImageFiles([]);
        } else {
          try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } catch (jsonError) {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        }
        throw new Error(errorMessage);
      }

      setSuccess(true);
      setMessage('');
      setCodename('');
      setImages([]);
      setImageFiles([]);
      
      if (onSuccess) {
        onSuccess();
      }

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      {!onSuccess && (
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/25">
          <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium flex items-center gap-1.5">
            <span>📋</span> All submissions are reviewed by an administrator before appearing publicly.
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4.5 bg-emerald-50/70 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl animate-fadeIn">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-emerald-800 dark:text-emerald-350 text-xs mb-0.5">Post Submitted!</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 leading-normal">
                Your thoughts have been safely cataloged and are waiting in our verification queue.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input Codename */}
      <div className="space-y-2">
        <label htmlFor="codename" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Your Codename
        </label>
        <input
          type="text"
          id="codename"
          value={codename}
          onChange={(e) => setCodename(e.target.value)}
          required
          className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 dark:text-zinc-100 bg-white/70 dark:bg-zinc-900/50 placeholder:text-slate-400 dark:placeholder:text-zinc-550 transition-all duration-300"
          placeholder="Anonymous Wanderer"
        />
      </div>

      {/* Input Message */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Your Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="w-full px-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-slate-800 dark:text-zinc-100 bg-white/70 dark:bg-zinc-900/50 placeholder:text-slate-400 dark:placeholder:text-zinc-550 resize-none transition-all duration-300"
          placeholder="Unleash your feelings, tell a secret, or share support..."
        />
      </div>

      {/* Upload Box */}
      <div className="space-y-2.5">
        <label htmlFor="images" className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Add Media (Optional)
        </label>
        
        {/* Upload Drop Zone */}
        <div className="relative group/zone border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-indigo-400 dark:hover:border-zinc-700 transition-colors duration-300 p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/20 dark:bg-zinc-900/10">
          <input
            type="file"
            id="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <svg className="w-8 h-8 text-slate-400 group-hover/zone:text-indigo-500 dark:text-zinc-500 transition-colors duration-300 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375 0 11-.75 0 .375 0 01.75 0z" />
          </svg>
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-350">Click to select files</span>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">Up to 4 images, max 2MB each</span>
        </div>

        {/* Thumbnail Previews with dynamic trash close button */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
            {images.map((image, index) => (
              <div key={index} className="group relative w-full h-24 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-zinc-800/40">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-rose-600 text-white rounded-full p-1 transition-colors duration-200 cursor-pointer"
                  aria-label="Remove image"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-slate-900 text-white dark:bg-zinc-50 dark:text-zinc-900 py-3.5 px-4 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-zinc-200 active:scale-99 transition-all duration-200 disabled:bg-slate-200 dark:disabled:bg-zinc-800 disabled:text-slate-400 dark:disabled:text-zinc-500 disabled:cursor-not-allowed text-xs shadow-sm cursor-pointer"
      >
        {isSubmitting ? 'Verifying Payload...' : 'Submit Message'}
      </button>
    </form>
  );
}
