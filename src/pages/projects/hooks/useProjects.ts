// src/hooks/useProjects.ts
import { useEffect, useState } from 'react';
import projectAPI, { Project, ProjectListParams } from '@/api/core/project';

interface UseProjectsOptions {
  featured?: boolean;
  project_type?: "web" | "mobile" | "software" | "design" | "other" | "all";
  search?: string;
  page?: number;
  page_size?: number;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  pagination: {
    count: number;
    next: string | null;
    previous: string | null;
    current_page: number;
    total_pages: number;
    page_size: number;
  } | null;
  refetch: () => void;
}

export const useProjects = (options: UseProjectsOptions = {}): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseProjectsReturn['pagination']>(null);

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: ProjectListParams = {
        featured: options.featured,
        project_type: options.project_type,
        search: options.search,
        page: options.page,
        page_size: options.page_size,
      };
      const response = await projectAPI.list(params);
      setProjects(response.results);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [options.featured, options.project_type, options.search, options.page, options.page_size]);

  return { projects, loading, error, pagination, refetch: fetchProjects };
};