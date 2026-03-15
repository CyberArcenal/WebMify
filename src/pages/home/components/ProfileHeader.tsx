import React from 'react';
import { Profile } from '@/api/core/profile';

interface Props {
  profile: Profile;
}

const ProfileHeader: React.FC<Props> = ({ profile }) => {
  return (
    <>
      {/* Profile Image */}
      <div className="w-full md:w-2/5 flex justify-center">
        <div className="relative" id="profile-image-container">
          <img
            src={profile.profile_image_url || ''}
            alt={profile.name}
            crossOrigin="anonymous"
            className="rounded-xl w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.parentElement!.innerHTML = '<div class="bg-card-secondary border-2 border-dashed rounded-xl w-64 h-64 md:w-80 md:h-80"></div>';
            }}
          />
          <div className="absolute -bottom-4 -right-4 bg-primary text-white p-3 rounded-full shadow-lg">
            <i className="fa-solid fa-star text-xl"></i>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="w-full md:w-3/5 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-text mb-4">
          {profile.name}
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
          {profile.title}
        </h2>
        <p className="text-xl text-secondary-text mb-8 leading-relaxed">
          {profile.bio}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <i className="fa-solid fa-envelope text-primary"></i>
            <span className="text-secondary-text">{profile.email}</span>
          </div>
          {profile.phone && (
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <i className="fa-solid fa-phone text-primary"></i>
              <span className="text-secondary-text">{profile.phone}</span>
            </div>
          )}
          {profile.address && (
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <i className="fa-solid fa-location-dot text-primary"></i>
              <span className="text-secondary-text">{profile.address}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-md inline-flex items-center"
            >
              <i className="fa-solid fa-download mr-2"></i>Download Resume
            </a>
          )}
          <a
            href="#contact"
            className="px-6 py-3 bg-card border border-color hover:bg-card-secondary text-primary-text rounded-lg font-medium transition-colors shadow-md inline-flex items-center"
          >
            <i className="fa-solid fa-envelope mr-2"></i>Contact Me
          </a>
        </div>

        <div className="mt-8 flex justify-center md:justify-start space-x-4">
          {profile.github_url && (
            <a href={profile.github_url} className="text-tertiary-text hover:text-primary transition-colors">
              <i className="fab fa-github fa-2x"></i>
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} className="text-tertiary-text hover:text-primary transition-colors">
              <i className="fab fa-linkedin fa-2x"></i>
            </a>
          )}
          {profile.twitter_url && (
            <a href={profile.twitter_url} className="text-tertiary-text hover:text-primary transition-colors">
              <i className="fab fa-twitter fa-2x"></i>
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;