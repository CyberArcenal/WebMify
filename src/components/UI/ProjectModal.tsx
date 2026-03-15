import React, { useEffect, useState } from "react";
import { Project } from "@/api/core/project";
import { markdownToHtml, styleMarkdownElements } from "@/utils/markdown";
import Modal from "./Modal";

interface Props {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<Props> = ({ project, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      styleMarkdownElements(contentRef.current);
    }
  }, [isOpen, project]);

  if (!isVisible || !project) return null;

  const typeClasses: Record<string, { bg: string; text: string }> = {
    web: { bg: "bg-blue-100 dark:bg-blue-900", text: "text-blue-800 dark:text-blue-200" },
    mobile: { bg: "bg-green-100 dark:bg-green-900", text: "text-green-800 dark:text-green-200" },
    "open-source": { bg: "bg-purple-100 dark:bg-purple-900", text: "text-purple-800 dark:text-purple-200" },
    default: { bg: "bg-gray-100 dark:bg-gray-700", text: "text-gray-800 dark:text-gray-200" },
  };

  const typeClass = typeClasses[project.project_type] || typeClasses.default;
  const demoText = project.project_type === "mobile" ? "App Store" : "Live Demo";
  const descriptionHtml = markdownToHtml(project.description);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={project.title}>
      <div className="">
        <div className="mb-6">
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4">
            {project.image_url ? (
              <img
                src={project.image_url}
                alt={project.title}
                crossOrigin="anonymous"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-lg w-full h-full"></div>
            )}
          </div>

          <div className="flex items-center mb-4">
            <span className={`px-3 py-1 ${typeClass.bg} ${typeClass.text} rounded-full text-sm font-medium mr-4`}>
              {project.project_type === "web"
                ? "Web App"
                : project.project_type === "mobile"
                ? "Mobile"
                : project.project_type === "open-source"
                ? "Open Source"
                : project.project_type}
            </span>
            {project.featured && (
              <span className="px-3 py-1 bg-primary-light dark:bg-primary-dark text-primary-dark dark:text-primary-light rounded-full text-sm font-medium">
                Featured Project
              </span>
            )}
          </div>

          <div
            ref={contentRef}
            className="text-secondary-text mb-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-primary-text mb-3">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies_list.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {project.demo_url && (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                {demoText}
                <i className="fa-solid fa-arrow-up-right-from-square ml-2"></i>
              </a>
            )}
            {project.source_code_url && (
              <a
                href={project.source_code_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-card-secondary text-primary-text rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Source Code
                <i className="fab fa-github ml-2"></i>
              </a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectModal;