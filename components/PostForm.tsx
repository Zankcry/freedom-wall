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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Limit file size (e.g., 5MB per image)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = files.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        setError(`Some images are too large. Maximum size is 5MB per image.`);
        return;
      }
      
      setImageFiles(files);
      
      try {
        // Convert files to base64 data URLs for permanent storage
        // Base64 images will work across all browsers and sessions
        const base64Promises = files.map((file) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve(reader.result as string);
            };
            reader.onerror = () => {
              reject(new Error(`Failed to read file: ${file.name}`));
            };
            reader.readAsDataURL(file);
          });
        });
        
        const base64Images = await Promise.all(base64Promises);
        setImages(base64Images);
        setError(''); // Clear any previous errors
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
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit post');
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

