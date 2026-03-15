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
    <div className="bg-card rounded-2xl shadow-xl p-8 mb-8 contact-info-section">
      <h2 className="text-3xl font-bold text-primary-text mb-8">Contact Information</h2>

      <div className="space-y-6">
        {/* Email */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mr-4">
            <i className="fa-solid fa-envelope text-primary text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-text mb-1">Email</h3>
            <p className="text-secondary-text" data-field="email">
              {email}
            </p>
            <a
              href={`mailto:${email}`}
              className="text-primary hover:text-primary-dark text-sm mt-2 inline-block"
            >
              Send me an email
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mr-4">
            <i className="fa-solid fa-phone text-primary text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-text mb-1">Phone</h3>
            <p className="text-secondary-text" data-field="phone">
              {phone}
            </p>
            <a
              href={`tel:${phone}`}
              className="text-primary hover:text-primary-dark text-sm mt-2 inline-block"
            >
              Call me
            </a>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mr-4">
            <i className="fa-solid fa-location-dot text-primary text-xl"></i>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary-text mb-1">Location</h3>
            <p className="text-secondary-text" data-field="address">
              {address}
            </p>
            <a
              href="#map"
              className="text-primary hover:text-primary-dark text-sm mt-2 inline-block"
            >
              View on map
            </a>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-light/20 flex items-center justify-center mr-4">
            <i className="fa-solid fa-clock text-primary text-xl"></i>
          </div>
          <div id="availability">
            <h3 className="text-lg font-semibold text-primary-text mb-1">Availability</h3>
            {loading ? (
              <p className="text-secondary-text">Loading...</p>
            ) : (
              availability.split(',').map((line, idx) => (
                <p key={idx} className="text-secondary-text">
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