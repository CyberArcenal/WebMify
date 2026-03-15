import React from 'react';
import { Profile } from '@/api/core/profile';
import { BlogAuthor } from '@/api/core/blog';

interface Props {
  profile: Profile | null;
  author?: BlogAuthor;
}

const AuthorBio: React.FC<Props> = ({ profile, author }) => {
  const name = profile?.name || author?.name || 'Anonymous';
  const bio = profile?.bio || author?.bio || '';
  const imageUrl = profile?.profile_image_url || author?.image_url;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 md:p-8 mb-16 shadow-md">
      <div className="flex flex-col items-center md:flex-row md:items-start">
        <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
          <div className="border-2 border-blue-400 rounded-full w-24 h-24 overflow-hidden shadow-lg">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 border-2 border-dashed"></div>
            )}
          </div>
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{bio}</p>
          <div className="flex justify-center md:justify-start space-x-4">
            {profile?.github_url && (
              <a href={profile.github_url} className="text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white social-icon">
                <i className="fab fa-github"></i>
              </a>
            )}
            {profile?.linkedin_url && (
              <a href={profile.linkedin_url} className="text-blue-700 hover:text-blue-900 dark:text-blue-500 dark:hover:text-blue-300 social-icon">
                <i className="fab fa-linkedin-in"></i>
              </a>
            )}
            {profile?.twitter_url && (
              <a href={profile.twitter_url} className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 social-icon">
                <i className="fab fa-twitter"></i>
              </a>
            )}
            {profile?.youtube_url && (
              <a href={profile.youtube_url} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 social-icon">
                <i className="fab fa-youtube"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;