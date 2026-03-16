// src/pages/ProjectsList.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { showError } from "@/utils/notification";
import { useProjects } from "./hooks/useProjects";
import FilterButtons from "./components/FilterButtons";
import ProjectCard from "@/components/UI/ProjectCard";
import SkeletonProjectCard from "@/components/UI/SkeletonProjectCard";
import Pagination from "@/components/UI/Pagination";
import { Project } from "@/api/core/project";
import ProjectModal from "@/components/UI/ProjectModal";
import Button from "@/components/UI/Button";

const ProjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const filter = searchParams.get("filter") || "all";
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [currentFilter, setCurrentFilter] = useState(filter);

  const { projects, loading, error, pagination } = useProjects({
    project_type: currentFilter === "all" ? undefined : currentFilter as "web" | "mobile" | "software" | "design" | "other" | "all",
    page: currentPage,
    page_size: 6,
  });

  // Auto‑scroll to top kapag nagbago ang page o filter
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage, currentFilter]);

  // Animation para sa project cards (fade‑in)
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

  const openModal = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  // Sync state with URL params
  useEffect(() => {
    setCurrentPage(page);
    setCurrentFilter(filter);
  }, [page, filter]);

  const handleFilterChange = (newFilter: string) => {
    setSearchParams({ page: "1", filter: newFilter });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), filter: currentFilter });
  };

  if (error) {
    showError(error);
  }

  const startItem = pagination
    ? (currentPage - 1) * pagination.page_size + 1
    : 0;
  const endItem = pagination
    ? Math.min(currentPage * pagination.page_size, pagination.count)
    : 0;

  return (
    <div className="projects-page min-h-screen py-12">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-text mb-4">
            My Projects
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-6 rounded"></div>
          <p className="text-xl text-secondary-text max-w-3xl mx-auto">
            Explore my portfolio of completed projects. Each represents a unique
            challenge and solution developed with care and expertise.
          </p>
          <div className="mt-8 flex justify-center">
            <FilterButtons
              currentFilter={currentFilter}
              onFilterChange={handleFilterChange}
            />
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonProjectCard key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <i className="fa-solid fa-folder-open text-tertiary-text text-4xl mb-4"></i>
            <h3 className="text-xl font-bold text-primary-text mb-2">
              No projects found
            </h3>
            <p className="text-secondary-text">
              Try changing your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest(".read-more")) return;
                  navigate(`/projects/${project.id}`);
                }}
              >
                <ProjectCard
                  project={project}
                  onReadMore={() => openModal(project)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination Info and Controls */}
      {pagination && pagination.count > 0 && !loading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.total_pages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing{" "}
                  <span className="font-medium">
                    {startItem}-{endItem}
                  </span>{" "}
                  of <span className="font-medium">{pagination.count}</span>{" "}
                  projects
                </p>
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 bg-primary-500 dark:bg-primary-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Have a project in mind?
            </h2>
            <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
              I'm available for freelance work and collaborations. Let's discuss
              how I can help bring your ideas to life.
            </p>
            <div className="mt-8">
              <Button
                onClick={() => navigate("/contact")}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white shadow-sm hover:bg-gray-100"
              >
                Contact Me
                <i className="fa-solid fa-arrow-right ml-2"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default ProjectsList;
