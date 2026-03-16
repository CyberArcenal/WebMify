import React, { useState } from 'react';
import subscriberAPI from '@/api/core/subscriber';
import { showSuccess, showWarning, showError, showApiError } from '@/utils/notification';
import { dialogs } from '@/utils/dialogs';

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
      await subscriberAPI.create({ email });
      await dialogs.success('Successfully subscribed! Please check your email to confirm.');
      setEmail('');
    } catch (err: any) {
      console.log(err)
      showApiError('Already subscriber or try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-primary-light/20 rounded-2xl p-8 overflow-hidden">
      <div className="text-center">
        <div className="inline-flex items-center justify-center bg-primary-light/30 text-primary rounded-full p-4 mb-6">
          <i className="fa-solid fa-envelope-open-text text-2xl"></i>
        </div>
        <h3 className="text-2xl font-bold text-primary-text mb-4">
          Subscribe to my newsletter
        </h3>
        <p className="text-secondary-text max-w-xl mx-auto mb-6">
          Get the latest articles, tutorials, and resources on web development delivered straight to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-subscribe-input flex-1 px-3 py-2 border border-color rounded-t-lg sm:rounded-t-none sm:rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-primary-text"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-white rounded-b-lg sm:rounded-b-none sm:rounded-r-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {submitting ? '...' : 'Subscribe'}
            </button>
          </div>
          <p className="text-sm text-tertiary-text mt-3">
            No spam, just valuable content. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SubscribeForm;