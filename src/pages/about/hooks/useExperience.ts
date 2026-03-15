import { useEffect, useState } from 'react';
import experienceAPI, { Experience } from '@/api/core/experience';

export const useExperience = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    experienceAPI.list({ page_size: 100 })
      .then(response => setExperiences(response.results))
      .catch(err => setError(err.message || 'Failed to load experiences'))
      .finally(() => setLoading(false));
  }, []);

  return { experiences, loading, error };
};