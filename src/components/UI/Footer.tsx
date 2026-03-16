import { useProfile } from '@/pages/home/hooks/useProfile';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { profile, loading: profileLoading, error: profileError } = useProfile();

  const socialLinks = [
    { href: `${profile?.github_url}`, icon: 'fab fa-github', label: 'GitHub', color: 'hover:text-gray-300!' },
    { href: `${profile?.linkedin_url}`, icon: 'fab fa-linkedin', label: 'LinkedIn', color: 'hover:text-blue-400!' },
    { href: `${profile?.twitter_url}`, icon: 'fab fa-twitter', label: 'Twitter', color: 'hover:text-sky-400!' },
    { href: `${profile?.youtube_url}`, icon: 'fab fa-youtube', label: 'Youtube', color: 'hover:text-pink-400!' },
  ];

  const footerLinks = [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/contact', label: 'Contact' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-card-secondary border-t border-border-color mt-auto">
      {/* Decorative gradient line sa ibabaw */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Branding */}
          <div className="text-center md:text-left">
            <Link to="/" className="text-2xl font-bold text-primary floating inline-block">
              Portfolio
            </Link>
            <p className="mt-2 text-sm text-tertiary-text">
              Crafting digital experiences with passion and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="text-sm text-tertiary-text hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media with animated icons */}
          <div className="text-center md:text-right">
            <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Connect
            </h3>
            <div className="flex justify-center md:justify-end space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center justify-center w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-border-color text-tertiary-text transition-all duration-300 hover:scale-110 hover:rotate-6 ${link.color}`}
                  aria-label={link.label}
                >
                  <i className={`${link.icon} fa-lg transition-transform duration-300 group-hover:scale-110`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row with copyright and back-to-top */}
        <div className="mt-10 pt-6 border-t border-border-color/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-tertiary-text flex items-center gap-1">
            © {currentYear} Portfolio. Made with
            <i className="fas fa-heart text-primary animate-pulse"></i>
            by You
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm text-tertiary-text hover:text-primary transition-colors duration-200 group"
          >
            <span>Back to top</span>
            <i className="fas fa-arrow-up transform transition-transform duration-300 group-hover:-translate-y-1"></i>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;