// SkillsPage.tsx
import skillAPI, { Skill } from "@/api/core/skill";
import Button from "@/components/UI/Button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Category templates (same as in the original JS) – keep per‑category colors
const CATEGORY_TEMPLATES: Record<
  string,
  { title: string; icon: string; color: string }
> = {
  language: {
    title: "Programming Languages",
    icon: "fa-code",
    color: "text-indigo-500",
  },
  frontend: {
    title: "Frontend Development",
    icon: "fa-palette",
    color: "text-blue-500",
  },
  backend: {
    title: "Backend & Databases",
    icon: "fa-database",
    color: "text-green-500",
  },
  devops: {
    title: "DevOps & Cloud",
    icon: "fa-cloud",
    color: "text-yellow-500",
  },
  framework: {
    title: "Frameworks & Libraries",
    icon: "fa-cubes",
    color: "text-purple-500",
  },
  design: {
    title: "Design & Tools",
    icon: "fa-screwdriver-wrench",
    color: "text-pink-500",
  },
};

const SkillsPage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredSkills, setFeaturedSkills] = useState<Skill[]>([]);
  const [additionalSkills, setAdditionalSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Record<string, Skill[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await skillAPI.list({ page: 1, page_size: 50 });
        const allSkills = response.results;
        const featured = allSkills.filter((skill) => skill.featured);
        const additional = allSkills.filter((skill) => !skill.featured);

        setFeaturedSkills(featured);
        setAdditionalSkills(additional);

        const grouped: Record<string, Skill[]> = {};
        featured.forEach((skill) => {
          if (!grouped[skill.category]) {
            grouped[skill.category] = [];
          }
          grouped[skill.category].push(skill);
        });
        setCategories(grouped);
      } catch (err: any) {
        setError(
          err.message || "Failed to load skills. Please try again later.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  // Trigger fade-in animations after featured skills are rendered
  useEffect(() => {
    if (!isLoading && featuredSkills.length > 0) {
      const skillItems = document.querySelectorAll(".skill-item");
      skillItems.forEach((item, index) => {
        setTimeout(
          () => {
            item.classList.add("transition-all", "duration-500", "ease-out");
            item.classList.remove("opacity-0", "translate-y-4");
          },
          100 + index * 50,
        );
      });
    }
  }, [isLoading, featuredSkills]);

  return (
    <div className="skills-page min-h-screen">
      {/* Loading indicator */}
      {isLoading && (
        <div
          id="skills-loader"
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div
          id="skills-error"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        >
          <div className="bg-danger/10 border border-danger rounded-lg p-4 text-center">
            <i className="fa-solid fa-triangle-exclamation text-danger text-xl mr-2"></i>
            <span className="text-danger">{error}</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-primary to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Technical Skills
            </h1>
            <div className="w-24 h-1 bg-white/80 mx-auto mb-6 rounded"></div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              My technical expertise and proficiency across various programming
              languages, frameworks, and tools
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-900/30"></div>
      </div>

      {/* Skills Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Skills Overview */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-primary-light/20 text-primary rounded-full p-4 mb-6">
            <i className="fa-solid fa-laptop-code text-3xl"></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-text mb-4">
            Technology Expertise
          </h2>
          <p className="text-xl text-secondary-text max-w-3xl mx-auto">
            I've developed proficiency across a wide range of technologies
            through years of professional experience and continuous learning
          </p>
        </div>

        {/* Skills Grid */}
        <div
          id="skills-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {!isLoading && !error && featuredSkills.length === 0 && (
            <div className="col-span-full text-center py-12">
              <i className="fa-solid fa-laptop-code text-tertiary-text text-4xl mb-4"></i>
              <h3 className="text-xl font-bold text-primary-text mb-2">
                No skills found
              </h3>
              <p className="text-secondary-text">
                Try refreshing the page or contact support.
              </p>
            </div>
          )}

          {!isLoading &&
            !error &&
            Object.entries(categories).map(([category, skills]) => {
              const template = CATEGORY_TEMPLATES[category];
              if (!template) return null;
              return (
                <div
                  key={category}
                  className="bg-card rounded-xl shadow-lg p-6"
                  data-category={template.title}
                >
                  <div className="flex items-center mb-6">
                    <div className="mr-4 bg-primary-light/20 text-primary p-3 rounded-lg">
                      <i className={`fa-solid ${template.icon} text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-primary-text">
                      {template.title}
                    </h3>
                  </div>
                  <div className="space-y-5 skills-container">
                    {skills
                      .sort((a, b) => b.order - a.order)
                      .map((skill) => (
                        <div
                          key={skill.id}
                          className="skill-item opacity-0 translate-y-4"
                        >
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-primary-text flex items-center">
                              <i
                                className={`${skill.icon || "fa-solid fa-code"} ${template.color} mr-2`}
                              ></i>
                              {skill.name}
                            </span>
                            <span className="text-secondary-text font-medium">
                              {skill.proficiency}%
                            </span>
                          </div>
                          <div className="w-full bg-card-secondary rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${skill.proficiency}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Additional Skills */}
        {additionalSkills.length > 0 && (
          <div className="bg-card-secondary rounded-2xl p-8 mb-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl font-bold text-primary-text mb-4">
                Additional Skills & Technologies
              </h3>
              <p className="text-secondary-text max-w-2xl mx-auto">
                Beyond my core expertise, I'm proficient with a wide range of
                complementary technologies and tools
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 additional-skills-container">
              {additionalSkills.map((skill) => {
                const template = CATEGORY_TEMPLATES[skill.category];
                const color = template?.color || "text-tertiary-text";
                const icon = skill.icon || "fa-solid fa-code";
                return (
                  <div
                    key={skill.id}
                    className="px-5 py-3 bg-card rounded-lg shadow flex items-center"
                  >
                    <i className={`${icon} text-xl mr-2 ${color}`}></i>
                    <span className="text-primary-text">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Proficiency Legend */}
        <div className="max-w-3xl mx-auto bg-card rounded-xl shadow-lg p-6 mb-16">
          <h3 className="text-xl font-bold text-primary-text mb-4">
            Proficiency Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white mb-3">
                <i className="fa-solid fa-star text-2xl"></i>
              </div>
              <h4 className="font-bold text-primary-text mb-1">Expert</h4>
              <p className="text-secondary-text text-sm">90-100%</p>
              <p className="text-secondary-text text-sm mt-2">
                Deep expertise, can architect solutions
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center text-white mb-3">
                <i className="fa-solid fa-circle-check text-2xl"></i>
              </div>
              <h4 className="font-bold text-primary-text mb-1">Advanced</h4>
              <p className="text-secondary-text text-sm">75-89%</p>
              <p className="text-secondary-text text-sm mt-2">
                Strong skills, can build complex features
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/60 flex items-center justify-center text-white mb-3">
                <i className="fa-solid fa-check-circle text-2xl"></i>
              </div>
              <h4 className="font-bold text-primary-text mb-1">Proficient</h4>
              <p className="text-secondary-text text-sm">60-74%</p>
              <p className="text-secondary-text text-sm mt-2">
                Comfortable, can work independently
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/40 flex items-center justify-center text-primary mb-3">
                <i className="fa-solid fa-book text-2xl"></i>
              </div>
              <h4 className="font-bold text-primary-text mb-1">Learning</h4>
              <p className="text-secondary-text text-sm">Below 60%</p>
              <p className="text-secondary-text text-sm mt-2">
                Currently learning and improving
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to leverage my skills for your project?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            I'm available for freelance work, collaborations, and full-time
            opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              loading={isLoading}
              variant="primary"
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center px-8 py-3 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              <i className="fa-solid fa-envelope mr-2"></i> Contact Me
            </Button>
            <Button
              loading={isLoading}
              variant="purple"
              onClick={() => navigate("/projects")}
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-dark text-white font-medium rounded-lg shadow-md hover:bg-primary-dark transition-colors"
            >
              <i className="fa-solid fa-briefcase mr-2"></i> View Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
