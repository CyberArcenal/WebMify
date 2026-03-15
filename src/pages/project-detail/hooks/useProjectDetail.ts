import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import projectAPI, { Project } from '@/api/core/project';

export const useProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        setError('Invalid project ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch main project
        const projectData = await projectAPI.get(parseInt(id));
        setProject(projectData);

        // Fetch related projects (excluding current)
        const relatedResponse = await projectAPI.list({
          page_size: 3,
          // We can't exclude by ID directly, but we'll filter later if needed
        });
        // Filter out current project and take first 3
        const filtered = relatedResponse.results
          .filter(p => p.id !== projectData.id)
          .slice(0, 3);
        setRelatedProjects(filtered);
      } catch (err: any) {
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, relatedProjects, loading, error };
};