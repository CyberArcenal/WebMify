import React from 'react';
import { Project } from '@/api/core/project';

interface Props {
  project: Project;
}

const ProjectHero: React.FC<Props> = ({ project }) => {
  const formatProjectType = (type: string) => {
    const typeMap: Record<string, string> = {
      web: 'Web Application',
      mobile: 'Mobile Application',
      'open-source': 'Open Source',
      design: 'Design Project',
      other: 'Other Project',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="relative py-16 md:py-24 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-700 dark:to-indigo-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
              {formatProjectType(project.project_type)}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {project.title}
          </h1>
          <div className="w-24 h-1 bg-white/80 mx-auto mb-6 rounded"></div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {project.description.length > 150
              ? project.description.substring(0, 150) + '...'
              : project.description}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gray-900/30"></div>
    </div>
  );
};

export default ProjectHero;