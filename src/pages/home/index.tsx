import React, { useEffect, useState } from 'react';
import { showApiError } from '@/utils/notification';
import type { Project } from '@/api/core/project';
import { useProfile } from './hooks/useProfile';
import { useProjects } from './hooks/useProjects';
import { useSkills } from './hooks/useSkills';
import SkeletonProfile from '@/components/UI/SkeletonProfile';
import ProfileHeader from './components/ProfileHeader';
import ProjectCard from '@/components/UI/ProjectCard';
import SkeletonProjectCard from '@/components/UI/SkeletonProjectCard';
import SkillsPreview from '@/components/UI/SkillsPreview';
import SkeletonSkills from '@/components/UI/SkeletonSkills';
import ProjectModal from '@/components/UI/ProjectModal';

const Home: React.FC = () => {
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { projects, loading: projectsLoading, error: projectsError } = useProjects({ featured: true, limit: 3 });
  const { skills, loading: skillsLoading, error: skillsError } = useSkills({ featured: true, limit: 10 });

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

  useEffect(() => {
    if (profileError) showApiError(profileError, 'Failed to load profile');
    if (projectsError) showApiError(projectsError, 'Failed to load projects');
    if (skillsError) showApiError(skillsError, 'Failed to load skills');
  }, [profileError, projectsError, skillsError]);

  useEffect(() => {
    if (!projectsLoading) {
      const cards = document.querySelectorAll('.project-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('transition-all', 'duration-500', 'ease-out');
          card.classList.remove('opacity-0', 'translate-y-6');
        }, 100 + index * 150);
      });
    }
  }, [projectsLoading]);

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  const isLoading = profileLoading || projectsLoading || skillsLoading;
  const hasError = profileError || projectsError || skillsError;

  if (hasError && !isLoading) {
    return (
      <div className="text-center py-12">
        <i className="fa-solid fa-triangle-exclamation text-danger text-3xl mb-4"></i>
        <h3 className="text-xl font-bold text-primary-text mb-2">Failed to load content</h3>
        <p className="text-secondary-text mb-4">Please refresh the page.</p>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          onClick={() => window.location.reload()}
        >
          <i className="fa-solid fa-rotate-right mr-2"></i> Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="home-page min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="hero py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            {profileLoading ? <SkeletonProfile /> : <ProfileHeader profile={profile!} />}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="featured-projects py-16 bg-card-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-text">
              Featured Projects
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
            <p className="mt-4 text-xl text-secondary-text max-w-2xl mx-auto">
              Some of my most notable work and contributions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonProjectCard key={i} />)
              : projects.map((project) => (
                  <ProjectCard key={project.id} project={project} onReadMore={() => openModal(project)} />
                ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#projects"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark transition-colors"
            >
              View All Projects
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Skills Preview Section */}
      <section className="skills-preview py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-text">
              Technical Expertise
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
            <p className="mt-4 text-xl text-secondary-text max-w-2xl mx-auto">
              Technologies I specialize in and work with daily
            </p>
          </div>

          {skillsLoading ? <SkeletonSkills /> : <SkillsPreview skills={skills} />}

          <div className="text-center mt-12">
            <a
              href="#skills"
              className="inline-flex items-center text-primary font-medium hover:underline"
            >
              Explore all skills and technologies
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal project={selectedProject} isOpen={modalOpen} onClose={closeModal} />
    </div>
  );
};

export default Home;