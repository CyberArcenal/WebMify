import React from 'react';
import { SocialLinksData } from '../hooks/useContact';

interface Props {
  links: SocialLinksData | null;
}

const platformMap: Record<string, keyof SocialLinksData> = {
  'fa-linkedin-in': 'linkedin_url',
  'fa-github': 'github_url',
  'fa-twitter': 'twitter_url',
  'fa-youtube': 'youtube_url',
  'fa-dribbble': 'dribbble_url',
  'fa-instagram': 'instagram_url',
};

const SocialLinks: React.FC<Props> = ({ links }) => {
  const platforms = [
    { icon: 'fa-linkedin-in', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: 'fa-github', color: 'bg-gray-800 hover:bg-gray-900' },
    { icon: 'fa-twitter', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: 'fa-youtube', color: 'bg-red-600 hover:bg-red-700' },
    { icon: 'fa-dribbble', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { icon: 'fa-instagram', color: 'bg-pink-500 hover:bg-pink-600' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Connect With Me</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Follow me on social media to stay updated with my latest projects and insights.
      </p>

      <div className="flex flex-wrap gap-4">
        {platforms.map(({ icon, color }) => {
          const platformKey = platformMap[icon];
          const url = links?.[platformKey] as string | undefined;

          if (!url || url === 'N/A') return null;

          return (
            <a
              key={icon}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-14 h-14 rounded-full ${color} flex items-center justify-center text-white transition-colors`}
            >
              <i className={`fab ${icon} text-xl`}></i>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default SocialLinks;