// src/hooks/useProjects.ts
import { useEffect, useState } from "react";
import projectAPI, { Project, ProjectListParams } from "@/api/core/project";
import categoryAPI, { Category } from "@/api/core/category";

interface UseProjectsOptions {
  featured?: boolean;
  project_type?: number;
  search?: string;
  page?: number;
  page_size?: number;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  category: Category[];
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

export const useProjects = (
  options: UseProjectsOptions = {},
): UseProjectsReturn => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] =
    useState<UseProjectsReturn["pagination"]>(null);
  const [category, setCategory] = useState<Category[]>([]);

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
      setError(err.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.list();
      setCategory(response.results);
    } catch (err: any) {}
  };

  useEffect(() => {
    fetchProjects();
    loadCategories();
  }, [
    options.featured,
    options.project_type,
    options.search,
    options.page,
    options.page_size,
  ]);

  console.log(category);


  return { projects, loading, error, pagination, category, refetch: fetchProjects };
};
