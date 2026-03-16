import React, { useEffect } from 'react';
import { formatDate } from '@/utils/formatters';
import LoadingSpinner from '../home/components/LoadingSpinner';
import { useProfile } from '../home/hooks/useProfile';
import { useExperience } from './hooks/useExperience';
import { useEducation } from './hooks/useEducation';
import { useSkills } from '../home/hooks/useSkills';
import Button from '@/components/UI/Button';
import { useNavigate } from 'react-router-dom';

const About: React.FC = () => {
  const navigate = useNavigate();
  const { profile, loading: profileLoading, error: profileError } = useProfile();
  const { experiences, loading: expLoading, error: expError } = useExperience();
  const { education, loading: eduLoading, error: eduError } = useEducation();
  const { skills, loading: skillsLoading, error: skillsError } = useSkills({ featured: false, limit: 100 });


    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

  const isLoading = profileLoading || expLoading || eduLoading || skillsLoading;
  const hasError = profileError || expError || eduError || skillsError;

  // Fade‑in animations
  useEffect(() => {
    if (!isLoading) {
      const sections = document.querySelectorAll('.about-page > div');
      sections.forEach((section, index) => {
        section.classList.add('opacity-0', 'translate-y-6');
        setTimeout(() => {
          section.classList.add('transition-all', 'duration-500', 'ease-out');
          section.classList.remove('opacity-0', 'translate-y-6');
        }, 100 + index * 150);
      });
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (hasError) {
    return (
      <div className="text-center py-12 text-danger">
        Error loading content. Please refresh.
      </div>
    );
  }

  // Icon mapping (same as original)
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

  return (
    <div className="about-page min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About Me</h1>
            <div className="w-24 h-1 bg-white/80 mx-auto mb-6 rounded"></div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Learn about my journey, professional experience, and educational background
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-900/30"></div>
      </div>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Profile Image */}
          <div className="w-full lg:w-5/12 flex justify-center">
            <div className="relative">
              <img
                src={profile?.profile_image_url || '/default-avatar.png'}
                alt={profile?.name}
                className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-white p-3 rounded-full shadow-lg">
                <i className="fa-solid fa-star text-xl"></i>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="w-full lg:w-7/12">
            <div className="mb-6">
              <span className="text-primary font-semibold">
                PROFESSIONAL PROFILE
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-text mt-2 mb-4">
                {profile?.name}
              </h2>
              <h3 className="text-2xl text-primary font-semibold mb-6">
                {profile?.title}
              </h3>
              <p className="text-lg text-secondary-text leading-relaxed whitespace-pre-line">
                {profile?.bio}
              </p>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 contact-grid">
              {/* Email */}
              <div className="flex items-center contact-item">
                <div className="w-10 h-10 rounded-full bg-primary-light/20 text-primary flex items-center justify-center mr-4 contact-icon">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div className="contact-details">
                  <p className="text-sm text-tertiary-text">Email</p>
                  <p className="text-primary-text">{profile?.email}</p>
                </div>
              </div>

              {/* Phone */}
              {profile?.phone && (
                <div className="flex items-center contact-item">
                  <div className="w-10 h-10 rounded-full bg-primary-light/20 text-primary flex items-center justify-center mr-4 contact-icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div className="contact-details">
                    <p className="text-sm text-tertiary-text">Phone</p>
                    <p className="text-primary-text">{profile.phone}</p>
                  </div>
                </div>
              )}

              {/* Location */}
              {profile?.address && (
                <div className="flex items-center contact-item">
                  <div className="w-10 h-10 rounded-full bg-primary-light/20 text-primary flex items-center justify-center mr-4 contact-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="contact-details">
                    <p className="text-sm text-tertiary-text">Location</p>
                    <p className="text-primary-text">{profile.address}</p>
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center contact-item">
                <div className="w-10 h-10 rounded-full bg-primary-light/20 text-primary flex items-center justify-center mr-4 contact-icon">
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <div className="contact-details">
                  <p className="text-sm text-tertiary-text">Status</p>
                  <p className="text-primary-text my-status">
                    {profile?.status_display || profile?.status || 'Available'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-900 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-6"
                >
                  <i className="fab fa-github"></i>
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-6"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
              )}
              {profile?.twitter_url && (
                <a
                  href={profile.twitter_url}
                  className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-blue-500 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-6"
                >
                  <i className="fab fa-twitter"></i>
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              {profile?.resume_url && (
                <Button
                  href={profile.resume_url}
                  className="px-6! py-3! bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors shadow-md"
                >
                  <i className="fa-solid fa-download mr-2"></i>Download Resume
                </Button>
              )}
              <a
                href="#contact"
                className="px-6 py-3 bg-card border border-color hover:bg-card-secondary text-primary-text rounded-lg font-medium transition-colors shadow-md"
              >
                <i className="fa-solid fa-envelope mr-2"></i>Contact Me
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Work Experience Section */}
      {experiences.length > 0 && (
        <div className="bg-card-secondary py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-text">
                Work Experience
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
              <p className="mt-4 text-xl text-secondary-text max-w-2xl mx-auto">
                My professional journey and career milestones
              </p>
            </div>

            {/* Timeline */}
            <div className="relative timeline-container">
              {/* Timeline line */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary-light transform -translate-x-1/2"></div>

              {experiences.map((exp, index) => {
                const isEven = index % 2 === 0;
                const isLast = index === experiences.length - 1;

                return (
                  <div
                    key={exp.id}
                    className={`time-line-prototype flex flex-col lg:flex-row ${isLast ? 'pb-8' : 'mb-16'}`}
                  >
                    {isEven ? (
                      <>
                        {/* Info side (left for even) */}
                        <div className="lg:w-1/2 lg:pr-16 lg:text-right mb-6 lg:mb-0">
                          <div className="inline-block px-4 py-1 bg-primary text-white rounded-full text-sm mb-3">
                            {exp.duration}
                          </div>
                          <h3 className="text-2xl font-bold text-primary-text">
                            {exp.position}
                          </h3>
                          <p className="text-xl text-primary mb-4">
                            {exp.company}
                          </p>
                          <div className="inline-flex justify-center lg:justify-end mb-4">
                            {exp.company_logo_url ? (
                              <img
                                src={exp.company_logo_url}
                                alt={exp.company}
                                className="w-16 h-16 object-contain"
                              />
                            ) : (
                              <div className="bg-card-secondary border-2 border-dashed border-color rounded-lg w-16 h-16"></div>
                            )}
                          </div>
                        </div>

                        {/* Timeline marker */}
                        <div className="hidden lg:flex lg:w-1/2 lg:px-16 items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-card z-10"></div>
                        </div>

                        {/* Description side */}
                        <div className="lg:w-1/2 lg:px-16">
                          <div className="bg-card rounded-xl shadow-lg p-6">
                            <p className="text-secondary-text mb-4 whitespace-pre-line">
                              {exp.description}
                            </p>
                            {exp.responsibilities && exp.responsibilities.length > 0 && (
                              <ul className="text-secondary-text space-y-2 list-disc pl-5">
                                {exp.responsibilities.map((resp: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, idx: React.Key | null | undefined) => (
                                  <li key={idx}>{resp}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* For odd: description first, then marker, then info */}
                        <div className="lg:w-1/2 lg:px-16 lg:order-1">
                          <div className="bg-card rounded-xl shadow-lg p-6">
                            <p className="text-secondary-text mb-4 whitespace-pre-line">
                              {exp.description}
                            </p>
                            {exp.responsibilities && exp.responsibilities.length > 0 && (
                              <ul className="text-secondary-text space-y-2 list-disc pl-5">
                                {exp.responsibilities.map((resp: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, idx: React.Key | null | undefined) => (
                                  <li key={idx}>{resp}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>

                        <div className="hidden lg:flex lg:w-1/2 lg:px-16 items-center justify-center lg:order-2">
                          <div className="w-6 h-6 rounded-full bg-primary border-4 border-white dark:border-card z-10"></div>
                        </div>

                        <div className="lg:w-1/2 lg:pl-16 lg:text-left lg:order-3 mb-6 lg:mb-0">
                          <div className="inline-block px-4 py-1 bg-primary text-white rounded-full text-sm mb-3">
                            {exp.duration}
                          </div>
                          <h3 className="text-2xl font-bold text-primary-text">
                            {exp.position}
                          </h3>
                          <p className="text-xl text-primary mb-4">
                            {exp.company}
                          </p>
                          <div className="inline-flex justify-center lg:justify-start mb-4">
                            {exp.company_logo_url ? (
                              <img
                                src={exp.company_logo_url}
                                alt={exp.company}
                                className="w-16 h-16 object-contain"
                              />
                            ) : (
                              <div className="bg-card-secondary border-2 border-dashed border-color rounded-lg w-16 h-16"></div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-text">
              Education
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded"></div>
            <p className="mt-4 text-xl text-secondary-text max-w-2xl mx-auto">
              My academic background and qualifications
            </p>
          </div>

          <div className="education-grid grid grid-cols-1 md:grid-cols-2 gap-8">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="bg-card rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-primary-text mb-2">
                        {edu.degree}
                      </h3>
                      <p className="text-primary">{edu.field_of_study}</p>
                    </div>
                    {edu.institution_logo_url ? (
                      <img
                        src={edu.institution_logo_url}
                        alt={edu.institution}
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <div className="bg-card-secondary border-2 border-dashed border-color rounded-lg w-16 h-16"></div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-tertiary-text mb-4">
                    <i className="fa-solid fa-graduation-cap mr-2"></i>
                    <span>{edu.institution}</span>
                  </div>
                  <div className="flex items-center text-sm text-tertiary-text mb-4">
                    <i className="fa-solid fa-calendar-days mr-2"></i>
                    <span>{edu.duration}</span>
                  </div>
                  <p className="text-secondary-text mb-4 whitespace-pre-line">
                    {edu.description}
                  </p>
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="mt-4">
                      {edu.achievements.map((ach: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, idx: React.Key | null | undefined) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-card-secondary text-tertiary-text text-sm rounded-full mr-2 mb-2 inline-block"
                        >
                          {ach}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {skills.length > 0 && (
        <div className="bg-card-secondary py-16 tech-expertise-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 tech-container">
            <div className="text-center mb-16 tech-header">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-text tech-title">
                Technical Expertise
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto mt-4 rounded tech-divider"></div>
              <p className="mt-4 text-xl text-secondary-text max-w-2xl mx-auto tech-description">
                Technologies and skills I specialize in
              </p>
            </div>

            <div className="skills-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 tech-grid">
              {skills.map((skill) => {
                const iconClass = defaultSkillIcons[skill.name] || skill.icon || 'fas fa-star text-tertiary-text';
                return (
                  <div key={skill.id} className="flex flex-col items-center tech-item mb-4">
                    <div className="w-20 h-20 rounded-full bg-card-secondary flex items-center justify-center mb-4 tech-icon">
                      <i className={`${iconClass} text-4xl`}></i>
                    </div>
                    <span className="skill-name font-medium text-primary-text tech-label">
                      {skill.name}
                    </span>
                    <span className="skill-category text-sm text-tertiary-text">
                      {skill.category}
                    </span>
                    <div className="w-full bg-card-secondary rounded-full h-2.5 mt-2">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${skill.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12 tech-footer">
              <a
                href="#skills"
                className="inline-flex items-center text-primary font-medium hover:underline tech-link"
              >
                View full skills list
                <i className="fa-solid fa-arrow-right ml-2 tech-link-icon"></i>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Interested in working together?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Whether you have a project in mind or just want to connect, I'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant='primary'
              onClick={() => {navigate(`/contact`)}}
              className="inline-flex items-center justify-center px-8 py-3 bg-indigo-700 font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              <i className="fa-solid fa-envelope mr-2"></i> Contact Me
            </Button>
            <Button
              loading={isLoading}
              variant="purple"
              onClick={() => {
                navigate(`/projects`);
              }}
              className="inline-flex items-center justify-center px-8 py-3 bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:bg-indigo-800 transition-colors"
            >
              <i className="fa-solid fa-briefcase mr-2"></i> View Projects
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;