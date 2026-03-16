import { useEffect, useState } from 'react';
import projectAPI, { Project } from '@/api/core/project';

interface UseProjectsOptions {
  featured?: boolean;
  limit?: number;
}

export const useProjects = ({ featured, limit }: UseProjectsOptions = {}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    projectAPI.list({ featured, page_size: limit })
      .then(response => setProjects(response.results))
      .catch(err => setError(err.message || 'Failed to load projects'))
      .finally(() => setLoading(false));
  }, [featured, limit]);

  return { projects, loading, error };
};