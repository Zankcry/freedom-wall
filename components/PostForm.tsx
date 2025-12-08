'use client';

import { useState, useEffect } from 'react';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    try {
      // Images are already converted to base64 data URLs
      // These will be stored in the database and work across all browsers
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
        
        // Handle 413 Payload Too Large error specifically
        if (response.status === 413) {
          errorMessage = 'Images are too large. Please use fewer or smaller images (max 2MB each, 4 images total).';
          setImages([]);
          setImageFiles([]);
        } else {
          try {
            const data = await response.json();
            errorMessage = data.error || errorMessage;
          } catch (jsonError) {
            // If response is not JSON, get text
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

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {!onSuccess && <h2 className="text-2xl font-bold mb-4 text-gray-800">Share Your Message</h2>}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Your message has been submitted! It will appear after admin approval.
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="codename" className="block text-sm font-medium text-gray-700 mb-2">
          Your Codename
        </label>
        <input
          type="text"
          id="codename"
          value={codename}
          onChange={(e) => setCodename(e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder:text-gray-500"
          placeholder="Enter your codename"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Your Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 bg-white placeholder:text-gray-500"
          placeholder="Write your message here..."
        />
      </div>

      <div className="mb-4">
        <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
          Images (Optional)
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Maximum 4 images, 2MB each. Images will be automatically compressed.
        </p>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Message'}
      </button>
    </form>
  );
}

