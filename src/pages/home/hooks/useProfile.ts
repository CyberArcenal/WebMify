import { useEffect, useState } from 'react';
import profileAPI, { Profile } from '@/api/core/profile';

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileAPI.get()
      .then(setProfile)
      .catch(err => setError(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading, error };
};