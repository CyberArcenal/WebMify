import React from "react";
import { Project } from "@/api/core/project";

interface Props {
  project: Project;
  onImageClick?: () => void;
}

const ProjectHero: React.FC<Props> = ({ project, onImageClick }) => {

  return (
    <div className="relative py-16 md:py-24 bg-gradient-to-r from-primary to-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="px-4 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
              {project.project_type.name}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            {project.title}
          </h1>
          <div className="w-24 h-1 bg-white/80 mx-auto mb-6 rounded"></div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {project.description.length > 150
              ? project.description.substring(0, 150) + "..."
              : project.description}
          </p>
        </div>
      </div>
      <div className="absolute inset-0 bg-gray-900/30"></div>
      {project.image_url && (
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={onImageClick}
          title="Click to view full image"
        />
      )}
    </div>
  );
};

export default ProjectHero;
