import React, { useState } from 'react';
import subscriberAPI from '@/api/core/subscriber';
import { showSuccess, showError } from '@/utils/notification';

const SubscribeForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await subscriberAPI.create({ email });
      showSuccess('Successfully subscribed! Please check your email to confirm.');
      setEmail('');
    } catch (err: any) {
      showError(err.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex subscribe-form">
      <input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="email-subscribe-input flex-1 px-4 py-2 border border-border-color rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-primary-text placeholder-tertiary-text"
        required
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading}
        className="subscribe-btn px-4 py-2 bg-primary text-white rounded-r-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
      >
        {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
      </button>
    </form>
  );
};

export default SubscribeForm;