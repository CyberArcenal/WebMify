import React, { useEffect, useState } from "react";
import LoadingSpinner from "../home/components/LoadingSpinner";
import { useProjectDetail } from "./hooks/useProjectDetail";
import ProjectHero from "./components/ProjectHero";
import ProjectOverview from "./components/ProjectOverview";
import ProjectTechStack from "./components/ProjectTechStack";
import ProjectGallery from "./components/ProjectGallery";
import ProjectSidebar from "./components/ProjectSidebar";
import ProjectTestimonial from "./components/ProjectTestimonial";
import RelatedProjects from "./components/RelatedProjects";
import ProjectModal from "@/components/UI/ProjectModal";
import type { Project } from "@/api/core/project";
import Button from "@/components/UI/Button";
import { useNavigate } from "react-router-dom";
import ImageViewerModal from "@/components/UI/ImageViewerModal";

const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();
  const { project, relatedProjects, loading, error } = useProjectDetail();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Sa loob ng ProjectDetail component
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Kunin ang listahan ng lahat ng images (hero + gallery)
  const allImages = [
    project?.image_url,
    ...(project?.gallery_images?.map((img) => img.image_url) || []),
  ].filter(Boolean); // tanggalin ang null/undefined

  const handleImageClick = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleHeroClick = () => {
    if (project?.image_url) {
      setViewerIndex(0);
      setViewerOpen(true);
    }
  };

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  useEffect(() => {
    if (!loading) {
      const cards = document.querySelectorAll(".project-card");
      cards.forEach((card, index) => {
        setTimeout(
          () => {
            card.classList.add("transition-all", "duration-500", "ease-out");
            card.classList.remove("opacity-0", "translate-y-6");
          },
          100 + index * 150,
        );
      });
    }
  }, [loading]);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  if (loading) return <LoadingSpinner />;
  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-danger/10 border border-danger rounded-lg p-6 text-center">
          <i className="fa-solid fa-triangle-exclamation text-danger text-3xl mb-4"></i>
          <h3 className="text-xl font-bold text-danger mb-2">
            Failed to load project details
          </h3>
          <p className="text-danger mb-4">{error || "Project not found"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-danger/80 transition"
          >
            <i className="fa-solid fa-rotate-right mr-2"></i> Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-detail-page min-h-screen">
      <ProjectHero project={project} onImageClick={handleHeroClick}/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="w-full lg:w-8/12">
            {/* Project Image */}
            <div className="rounded-2xl shadow-xl overflow-hidden mb-12">
              {project.image_url ? (
                <img
                onClick={handleHeroClick}
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-96 md:h-[500px] object-cover"
                />
              ) : (
                <div className="bg-card-secondary border-2 border-dashed border-color w-full h-96 md:h-[500px]"></div>
              )}
            </div>

            <ProjectOverview project={project} />

            {/* Technology Stack */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-text mb-6">
                Technology Stack
              </h2>
              <ProjectTechStack techStack={project.tech_stack_details} />
            </div>

            {/* Project Gallery */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-text mb-6">
                Project Gallery
              </h2>
              <ProjectGallery
                images={project.gallery_images}
                onImageClick={(idx) => handleImageClick(idx + 1)}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-4/12">
            <ProjectSidebar project={project} />
          </div>
        </div>
      </div>

      {/* Testimonial */}
      {project.testimonial && (
        <ProjectTestimonial testimonial={project.testimonial} />
      )}

      {/* Related Projects */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-text">
            More Projects
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
          <p className="mt-4 text-xl text-secondary-text max-w-2xl mx-auto">
            Explore other projects I've worked on
          </p>
        </div>
        <RelatedProjects projects={relatedProjects} onReadMore={openModal} />
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

      {/* CTA */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Have a project in mind?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Let's discuss how I can help bring your ideas to life and deliver
            outstanding results.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="primary"
              loading={loading}
              onClick={() => {
                navigate(`/contact`);
              }}
              className="inline-flex items-center justify-center px-8 py-3 bg-indigo-700 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              <i className="fa-solid fa-envelope mr-2"></i> Contact Me
            </Button>
            <Button
              onClick={() => navigate("/home")}
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-dark text-white font-medium rounded-lg shadow-md hover:bg-primary-dark transition-colors"
            >
              <i className="fa-solid fa-briefcase mr-2"></i> View Portfolio
            </Button>
          </div>
        </div>
      </div>

      {/* Project Modal for related projects */}
      <ProjectModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={closeModal}
      />
      <ImageViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={allImages as string[]}
        initialIndex={viewerIndex}
        showThumbnails={true}
      />
    </div>
  );
};

export default ProjectDetail;
