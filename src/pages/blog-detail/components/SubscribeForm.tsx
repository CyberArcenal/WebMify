import React, { useState } from 'react';
import { showSuccess, showWarning, showError } from '@/utils/notification';

const SubscribeForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showWarning('Please enter a valid email address');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/subscribe/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.status) {
        showSuccess(data.message);
        setEmail('');
      } else {
        throw new Error(data.errors?.email?.[0] || 'Subscription failed');
      }
    } catch (err: any) {
      showError(err.message || 'Subscription failed. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 overflow-hidden">
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400 rounded-full p-4 mb-6">
          <i className="fa-solid fa-envelope-open-text text-2xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Subscribe to my newsletter
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
          Get the latest articles, tutorials, and resources on web development delivered straight to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-subscribe-input flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-b-lg sm:rounded-b-none sm:rounded-r-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {submitting ? '...' : 'Subscribe'}
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            No spam, just valuable content. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SubscribeForm;