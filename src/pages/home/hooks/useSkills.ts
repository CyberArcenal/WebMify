import { useEffect, useState } from 'react';
import skillAPI, { Skill } from '@/api/core/skill';

interface UseSkillsOptions {
  featured?: boolean;
  limit?: number;
}

export const useSkills = ({ featured, limit }: UseSkillsOptions = {}) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    skillAPI.list({ featured, page_size: limit })
      .then(response => setSkills(response.results))
      .catch(err => setError(err.message || 'Failed to load skills'))
      .finally(() => setLoading(false));
  }, [featured, limit]);

  return { skills, loading, error };
};