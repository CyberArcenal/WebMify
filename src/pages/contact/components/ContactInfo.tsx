import React from 'react';
import { LocationData } from '../hooks/useContact';

interface Props {
  location: LocationData | null;
  loading: boolean;
}

const ContactInfo: React.FC<Props> = ({ location, loading }) => {
  const email = location?.email || 'Loading...';
  const phone = location?.phone || 'Loading...';
  const address = location?.address || 'Loading...';
  const availability = location?.availability || '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 contact-info-section">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Contact Information</h2>

      <div className="space-y-6">
        {/* Email */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-4">
            <i className="fa-solid fa-envelope text-blue-500 dark:text-blue-400 text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Email</h3>
            <p className="text-gray-600 dark:text-gray-300" data-field="email">
              {email}
            </p>
            <a
              href={`mailto:${email}`}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm mt-2 inline-block"
            >
              Send me an email
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-4">
            <i className="fa-solid fa-phone text-green-500 dark:text-green-400 text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Phone</h3>
            <p className="text-gray-600 dark:text-gray-300" data-field="phone">
              {phone}
            </p>
            <a
              href={`tel:${phone}`}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm mt-2 inline-block"
            >
              Call me
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-4">
            <i className="fa-solid fa-location-dot text-purple-500 dark:text-purple-400 text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Location</h3>
            <p className="text-gray-600 dark:text-gray-300" data-field="address">
              {address}
            </p>
            <a
              href="#map"
              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 text-sm mt-2 inline-block"
            >
              View on map
            </a>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-4">
            <i className="fa-solid fa-clock text-yellow-500 dark:text-yellow-400 text-xl"></i>
          </div>
          <div id="availability">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">Availability</h3>
            {loading ? (
              <p className="text-gray-600 dark:text-gray-300">Loading...</p>
            ) : (
              availability.split(',').map((line, idx) => (
                <p key={idx} className="text-gray-600 dark:text-gray-300">
                  {line.trim()}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;