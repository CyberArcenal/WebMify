// TestimonialsPage.tsx
import React, { JSX, useEffect, useState } from 'react';
import { showApiError } from '@/utils/notification';
import testimonialAPI, { Testimonial } from '@/api/core/testimonial';
import statsAPI, { Stats } from '@/api/core/stats';
import Button from '@/components/UI/Button';
import { useNavigate } from 'react-router-dom';

const TestimonialsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch testimonials and stats on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const testimonialResponse = await testimonialAPI.list({ approved: true });
        setTestimonials(testimonialResponse.results);

        const statsData = await statsAPI.get();
        setStats(statsData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load testimonials';
        setError(errorMessage);
        showApiError(err, 'Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generate star rating (keep yellow-400 – brand color for stars)
  const generateStarRating = (rating: number): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={`full-${i}`} className="fa-solid fa-star text-yellow-400"></i>);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-solid fa-star-half-alt text-yellow-400"></i>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star text-yellow-400"></i>);
    }

    return stars;
  };

  // Handle image error fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null;
    const parent = target.parentElement;
    if (parent) {
      parent.innerHTML = '<div class="bg-card-secondary border-2 border-dashed border-color rounded-full w-16 h-16"></div>';
    }
  };

  return (
    <div className="testimonials-page min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Client Testimonials
            </h1>
            <div className="w-24 h-1 bg-white/80 mx-auto mb-6 rounded"></div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              What people are saying about my work and collaboration
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-900/30"></div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-white/20 text-white rounded-full p-3 mb-6">
            <i className="fa-solid fa-quote-right text-2xl"></i>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-text mb-4">
            Trusted by Professionals
          </h2>
          <p className="text-xl text-secondary-text max-w-3xl mx-auto">
            Here's what clients and colleagues have shared about working with me
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && (
            <div className="col-span-full text-center py-12">
              <i className="fa-solid fa-spinner animate-spin text-3xl text-primary mb-4"></i>
              <p className="text-secondary-text">Loading testimonials...</p>
            </div>
          )}

          {error && !loading && (
            <div className="col-span-full text-center py-12">
              <i className="fa-solid fa-triangle-exclamation text-danger text-3xl mb-4"></i>
              <h3 className="text-xl font-bold text-primary-text mb-2">
                Failed to load testimonials
              </h3>
              <p className="text-secondary-text">{error}</p>
              <button
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                onClick={() => window.location.reload()}
              >
                <i className="fa-solid fa-rotate-right mr-2"></i> Reload Page
              </button>
            </div>
          )}

          {!loading && !error && testimonials.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-secondary-text">No approved testimonials found.</p>
            </div>
          )}

          {!loading &&
            !error &&
            testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-card rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 testimonial-card"
              >
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0 mr-4">
                    <img
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                      src={testimonial.author_image_url || ''}
                      alt={testimonial.author}
                      onError={handleImageError}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary-text">
                      {testimonial.author}
                    </h3>
                    <p className="text-primary">
                      {testimonial.author_title}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">{generateStarRating(testimonial.rating)}</div>
                <p className="text-secondary-text italic">"{testimonial.content}"</p>
                <div className="mt-6 text-right">
                  <i className="fa-solid fa-quote-right text-3xl text-tertiary-text"></i>
                </div>
              </div>
            ))}
        </div>

        {/* Stats Section */}
        <div className="mt-24 bg-card-secondary rounded-2xl p-8">
          <div id="stats-container" className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stats ? `${stats.projects_completed}+` : 'n/a'}
              </div>
              <p className="text-secondary-text">Projects Completed</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stats ? `${stats.client_satisfaction}%` : 'n/a'}
              </div>
              <p className="text-secondary-text">Client Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stats ? `${stats.years_experience}+` : 'n/a'}
              </div>
              <p className="text-secondary-text">Years Experience</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                {stats ? `${stats.happy_clients}+` : 'n/a'}
              </div>
              <p className="text-secondary-text">Happy Clients</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to work together?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Let's discuss how I can help bring your ideas to life and deliver outstanding results for your project.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center px-8 py-3 bg-white  font-medium rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              <i className="fa-solid fa-envelope mr-2"></i> Contact Me
            </Button>
            <Button
              onClick={() => navigate('/projects')}
              className="inline-flex items-center justify-center px-8 py-3 bg-primary-dark text-white font-medium rounded-lg shadow-md hover:bg-primary-dark transition-colors"
            >
              <i className="fa-solid fa-briefcase mr-2"></i> View Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Additional styles (adjusted for theme) */}
      <style>{`
        .testimonials-page {
          scroll-behavior: smooth;
        }
        .testimonial-card {
          position: relative;
          overflow: hidden;
        }
        .testimonial-card::before {
          content: "";
          position: absolute;
          top: -20px;
          left: -20px;
          font-size: 120px;
          color: var(--primary-500);
          opacity: 0.1;
          font-family: Georgia, serif;
          line-height: 1;
          z-index: 0;
        }
        .dark .testimonial-card::before {
          color: var(--primary-600);
        }
      `}</style>
    </div>
  );
};

export default TestimonialsPage;