import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: '#', icon: 'fab fa-github', label: 'GitHub' },
    { href: '#', icon: 'fab fa-linkedin', label: 'LinkedIn' },
    { href: '#', icon: 'fab fa-twitter', label: 'Twitter' },
    { href: '#', icon: 'fab fa-instagram', label: 'Instagram' },
  ];

  const footerLinks = [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-card-secondary border-t border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="text-xl font-bold text-primary">
              Portfolio
            </Link>
          </div>
          <div className="mt-4 md:mt-0 flex justify-center">
            <div className="flex space-x-6">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tertiary-text hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  <i className={`${link.icon} fa-lg`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center md:flex md:items-center md:justify-between">
          <p className="text-sm text-tertiary-text">
            © {currentYear} My Portfolio. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex justify-center space-x-6">
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                to={link.to}
                className="text-sm text-tertiary-text hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;