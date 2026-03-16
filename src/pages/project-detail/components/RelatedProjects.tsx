import React from 'react';
import { Project } from '@/api/core/project';
import ProjectCard from '@/components/UI/ProjectCard';

interface Props {
  projects: Project[];
  onReadMore: (project: Project) => void;
}

const RelatedProjects: React.FC<Props> = ({ projects, onReadMore }) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-folder-open text-tertiary-text text-4xl mb-4"></i>
        <h3 className="text-xl font-bold text-primary-text mb-2">
          No related projects
        </h3>
        <p className="text-secondary-text">
          Check back later for more projects.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onReadMore={() => onReadMore(project)}
        />
      ))}
    </div>
  );
};

export default RelatedProjects;