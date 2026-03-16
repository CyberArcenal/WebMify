import { useState, useEffect } from 'react';
import profileAPI from '@/api/core/profile';
import { showError } from '@/utils/notification';

export interface LocationData {
  email: string;
  phone: string;
  address: string;
  coordinates: string; // "lat,lng"
  availability: string;
}

export interface SocialLinksData {
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  youtube_url: string;
  dribbble_url?: string;
  instagram_url?: string;
}

export const useContact = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLinksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch location and social links in parallel
        const [locationRes, socialRes] = await Promise.all([
          profileAPI.getLocation(),
          profileAPI.getSocialLinks(),
        ]);
        setLocation(locationRes);
        setSocialLinks(socialRes);
      } catch (err: any) {
        setError(err.message || 'Failed to load contact information');
        showError('Failed to load contact information');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { location, socialLinks, loading, error };
};