import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Detect scroll para magdagdag ng shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/projects", label: "Projects" },
    { to: "/skills", label: "Skills" },
    { to: "/blog", label: "Blog" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/contact", label: "Contact" },
  ];

  // Active link na may underline animation
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-all duration-300 
     hover:text-primary hover:scale-105
     ${isActive ? "text-primary" : "text-secondary-text"}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-card/80 backdrop-blur-md shadow-lg"
          : "bg-card/60 backdrop-blur-sm"
      }`}
    >
      {/* Animated bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary to-primary/40 transform scale-x-0 transition-transform duration-500 origin-left" style={{ transform: scrolled ? 'scaleX(1)' : 'scaleX(0)' }} />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo na may floating effect */}
          <NavLink
            to="/"
            className="text-2xl font-bold text-primary floating"
          >
            Portfolio
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={getNavLinkClass}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-slideInBottom" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            {/* Theme Toggle na may rotate animation */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-card-secondary text-secondary-text hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:rotate-12 hover:scale-110"
              aria-label="Toggle theme"
            >
              <i className={`fa-solid ${theme === "light" ? "fa-moon" : "fa-sun"} text-lg`} />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-card-secondary text-secondary-text hover:bg-primary/10 hover:text-primary transition-all duration-300"
              aria-label="Toggle menu"
            >
              <i className={`fa-solid fa-${mobileMenuOpen ? "times" : "bars"} text-lg`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu with smooth slide & fade */}
      <div
        className={`md:hidden bg-card/95 backdrop-blur-md border-t border-border-color shadow-xl transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-96 opacity-100 translate-y-0"
            : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
        } overflow-hidden`}
      >
        <div className="px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary pl-6"
                    : "text-secondary-text hover:bg-card-secondary hover:pl-6"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;