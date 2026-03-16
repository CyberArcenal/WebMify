import React from 'react';
import { Skill } from '@/api/core/skill';

const defaultSkillIcons: Record<string, string> = {
  AWS: 'fab fa-aws text-orange-500',
  'Android Studio': 'fab fa-android text-green-600',
  CSS: 'fab fa-css3-alt text-blue-600',
  Django: 'fas fa-code text-green-700',
  HTML5: 'fab fa-html5 text-red-500',
  Java: 'fab fa-java text-red-600',
  JavaScript: 'fab fa-js text-yellow-500',
  Kotlin: 'fas fa-code text-purple-600',
  Python: 'fab fa-python text-blue-400',
  VSCode: 'fab fa-vscode text-blue-400',
  tailwind: 'fab fa-css3-alt text-teal-500',
  React: 'fab fa-react text-blue-500',
  'Node.js': 'fab fa-node-js text-green-500',
  'Vue.js': 'fab fa-vuejs text-green-500',
  Express: 'fas fa-server text-gray-500',
  MongoDB: 'fas fa-database text-green-700',
  Bootstrap: 'fab fa-bootstrap text-purple-600',
  Sass: 'fab fa-sass text-pink-500',
  Git: 'fab fa-git-alt text-orange-600',
  PHP: 'fab fa-php text-indigo-600',
  Laravel: 'fab fa-laravel text-red-500',
  'C++': 'fas fa-code text-blue-600',
};

interface Props {
  skills: Skill[];
}

const SkillsPreview: React.FC<Props> = ({ skills }) => {
  return (
    <div className="skills-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
      {skills.map((skill) => {
        const iconClass = defaultSkillIcons[skill.name] || skill.icon || 'fas fa-star text-gray-400';
        return (
          <div key={skill.id} className="flex flex-col items-center skill-card mb-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4 skill-icon">
              <i className={`${iconClass} text-4xl`}></i>
            </div>
            <span className="skill-name font-medium text-primary-text">{skill.name}</span>
            <span className="skill-category text-sm text-secondary-text">{skill.category}</span>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${skill.proficiency}%` }}></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SkillsPreview;