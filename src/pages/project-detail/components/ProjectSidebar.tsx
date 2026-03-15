import React from 'react';
import { Project } from '@/api/core/project';
import { formatDate } from '@/utils/formatters';

interface Props {
  project: Project;
}

const valueOrDefault = (val: string | number | null | undefined): string => {
  if (val == null || (typeof val === 'string' && val.trim() === '')) {
    return 'N/A';
  }
  return String(val);
};

const ProjectSidebar: React.FC<Props> = ({ project }) => {
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

  const stats = project.impact_stats || {};

  return (
    <div className="sticky top-24">
      {/* Project Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Project Details
        </h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Project Type
            </p>
            <p className="font-medium text-gray-800 dark:text-white">
              {formatProjectType(project.project_type)}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Date Completed
            </p>
            <p className="font-medium text-gray-800 dark:text-white">
              {formatDate(project.created_at, 'MMMM dd, yyyy')}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Development Time
            </p>
            <p className="font-medium text-gray-800 dark:text-white">
              {project.development_time || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Client
            </p>
            <p className="font-medium text-gray-800 dark:text-white">
              {project.client || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Technologies
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies_list.map(tech => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-3">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium shadow-md transition-colors"
            >
              <i className="fa-solid fa-globe mr-2"></i> View Live Demo
            </a>
          )}
          {project.source_code_url && (
            <a
              href={project.source_code_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium shadow-md transition-colors"
            >
              <i className="fab fa-github mr-2"></i> Source Code
            </a>
          )}
        </div>
      </div>

      {/* Project Impact Stats */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Project Impact
        </h3>

        <div className="space-y-4">
          <div className="flex items-center">
            <div className="mr-4 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 p-3 rounded-lg">
              <i className="fa-solid fa-chart-line text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {valueOrDefault(stats.sales_increase)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Increase in online sales
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-4 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-3 rounded-lg">
              <i className="fa-solid fa-bolt text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {valueOrDefault(stats.load_time)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average page load time
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-4 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 p-3 rounded-lg">
              <i className="fa-solid fa-users text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {valueOrDefault(stats.users)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly active users
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="mr-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 p-3 rounded-lg">
              <i className="fa-solid fa-code text-xl"></i>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {valueOrDefault(stats.test_coverage)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test coverage
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSidebar;