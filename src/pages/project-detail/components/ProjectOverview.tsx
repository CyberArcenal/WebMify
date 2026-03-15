import React, { useRef, useEffect } from 'react';
import { Project } from '@/api/core/project';
import { markdownToHtml, styleMarkdownElements } from '@/utils/markdown';

interface Props {
  project: Project;
}

const ProjectOverview: React.FC<Props> = ({ project }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      styleMarkdownElements(contentRef.current);
    }
  }, [project]);

  const descriptionHtml = markdownToHtml(project.description);

  const featuresHtml = project.features?.length
    ? `
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
        Key Features
      </h3>
      <ul class="text-gray-600 dark:text-gray-300 mb-6 pl-5 list-disc space-y-2">
        ${project.features.map(f => `<li>${markdownToHtml(f.description)}</li>`).join('')}
      </ul>
    `
    : '';

  const challengesHtml = project.challenges || project.solutions
    ? `
      <h3 class="text-xl font-semibold text-gray-800 dark:text-white mt-8 mb-4">
        Challenges & Solutions
      </h3>
      ${project.challenges ? `<div class="challenges-section">${markdownToHtml(project.challenges)}</div>` : ''}
      ${project.solutions ? `<div class="solutions-section mt-4">${markdownToHtml(project.solutions)}</div>` : ''}
    `
    : '';

  const fullHtml = `
    <div class="markdown-content">
      ${descriptionHtml}
      ${featuresHtml}
      ${challengesHtml}
    </div>
  `;

  return (
    <div id="project-overview" className="mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Project Overview
      </h2>
      <div
        ref={contentRef}
        className="prose prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: fullHtml }}
      />
    </div>
  );
};

export default ProjectOverview;