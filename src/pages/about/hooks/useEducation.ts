import { useEffect, useState } from 'react';
import educationAPI, { Education } from '@/api/core/education';

export const useEducation = () => {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    educationAPI.list({ page_size: 100 })
      .then(response => setEducation(response.results))
      .catch(err => setError(err.message || 'Failed to load education'))
      .finally(() => setLoading(false));
  }, []);

  return { education, loading, error };
};