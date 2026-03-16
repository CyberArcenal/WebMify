import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/api/core/project';
import { markdownToHtml, styleMarkdownElements } from '@/utils/markdown';

interface Props {
  project: Project;
  onReadMore: (e: React.MouseEvent) => void;
}

const ProjectCard: React.FC<Props> = ({ project, onReadMore }) => {
  const navigate = useNavigate();
  const descRef = useRef<HTMLDivElement>(null); // Change to HTMLDivElement

  const typeClasses: Record<string, { bg: string; text: string }> = {
    web: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200' },
    mobile: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200' },
    'open-source': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200' },
    default: { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200' },
  };

  const typeClass = typeClasses[project.project_type] || typeClasses.default;

  const techTags = project.technologies_list.map((tech) => (
    <span
      key={tech}
      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full"
    >
      {tech}
    </span>
  ));

  const maxDescLength = 120;
  const displayDescription =
    project.description.length > maxDescLength
      ? project.description.substring(0, maxDescLength) + '...'
      : project.description;

  const descriptionHtml = markdownToHtml(displayDescription);

  useEffect(() => {
    if (descRef.current) {
      styleMarkdownElements(descRef.current);
    }
  }, [descriptionHtml]);

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const demoText = project.project_type === 'mobile' ? 'App Store' : 'Live Demo';
  const demoIcon =
    project.project_type === 'mobile' ? (
      <i className="fa-brands fa-app-store-ios ml-1"></i>
    ) : (
      <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-sm"></i>
    );

  return (
    <div
      className="bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl opacity-0 translate-y-6 project-card group h-full flex flex-col cursor-pointer"
      data-project-id={project.id}
      onClick={handleCardClick}
    >
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            crossOrigin="anonymous"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-t-xl w-full h-full"></div>
        )}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="view-project-btn px-5 py-2 bg-white text-primary font-medium rounded-full shadow-md hover:bg-gray-100 transition-colors"
            onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project.id}`); }}
          >
            View Project
          </button>
        </div>
        {project.featured && (
          <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full z-10">
            Featured
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-primary-text line-clamp-1">{project.title}</h3>
          <span className={`text-xs px-2 py-1 ${typeClass.bg} ${typeClass.text} rounded-full flex-shrink-0`}>
            {project.project_type === 'web'
              ? 'Web App'
              : project.project_type === 'mobile'
              ? 'Mobile'
              : project.project_type === 'open-source'
              ? 'Open Source'
              : project.project_type}
          </span>
        </div>

        <div className="flex-1">
          {/* Changed from <p> to <div> and added class */}
          <div
            ref={descRef}
            className="project-card-description text-secondary-text mb-3 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
          {project.description.length > maxDescLength && (
            <span
              className="text-primary cursor-pointer font-medium read-more ml-1"
              data-id={project.id}
              onClick={(e) => {
                e.stopPropagation();
                onReadMore(e);
              }}
            >
              Read More
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4 mt-2">{techTags}</div>

        <div className="flex justify-between mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary hover:text-primary-dark font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              {demoText}
              {demoIcon}
            </a>
          )}
          {project.source_code_url && (
            <a
              href={project.source_code_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-tertiary-text hover:text-primary-text"
              onClick={(e) => e.stopPropagation()}
            >
              Source Code
              <i className="fab fa-github ml-1"></i>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;