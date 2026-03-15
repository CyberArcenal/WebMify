import React from 'react';
import { ProjectTechStack as TechStackType } from '@/api/core/project';

interface Props {
  techStack: TechStackType[];
}

const categoryColors: Record<string, { bg: string; darkBg: string; text: string }> = {
  frontend: { bg: 'bg-blue-100', darkBg: 'dark:bg-blue-900', text: 'text-blue-500' },
  backend: { bg: 'bg-green-100', darkBg: 'dark:bg-green-900', text: 'text-green-500' },
  database: { bg: 'bg-blue-100', darkBg: 'dark:bg-blue-900', text: 'text-blue-500' },
  cloud: { bg: 'bg-yellow-100', darkBg: 'dark:bg-yellow-900', text: 'text-yellow-500' },
};

const getIconClass = (name: string, category: string): string => {
  const iconMap: Record<string, string> = {
    Django: 'fa-brands fa-python',
    Vite: 'fa-solid fa-bolt',
    Tailwind: 'fa-solid fa-wind',
    CSS: 'fa-brands fa-css3-alt',
    HTML: 'fa-brands fa-html5',
    JavaScript: 'fa-brands fa-js',
    React: 'fa-brands fa-react',
    'Node.js': 'fa-brands fa-node-js',
    PostgreSQL: 'fa-solid fa-database',
    AWS: 'fa-brands fa-aws',
    Redis: 'fa-solid fa-database',
  };
  return iconMap[name] || (category === 'database' ? 'fa-solid fa-database' : 'fa-solid fa-code');
};

const ProjectTechStack: React.FC<Props> = ({ techStack }) => {
  if (!techStack || techStack.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No technology details available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {techStack.map((tech, index) => {
        const colors = categoryColors[tech.category] || categoryColors.frontend;
        const iconClass = getIconClass(tech.name, tech.category);
        return (
          <div
            key={index}
            className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
          >
            <div className={`w-16 h-16 rounded-full ${colors.bg} ${colors.darkBg} flex items-center justify-center mb-3`}>
              <i className={`${iconClass} text-3xl ${colors.text}`}></i>
            </div>
            <span className="font-medium text-gray-800 dark:text-white">{tech.name}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{tech.category}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectTechStack;