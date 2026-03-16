import React, { useEffect } from "react";
import { useContact } from "./hooks/useContact";
import LoadingSpinner from "../home/components/LoadingSpinner";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import SocialLinks from "./components/SocialLinks";
import FAQ from "./components/FAQ";
import Map from "./components/Map";

const ContactPage: React.FC = () => {
  const { location, socialLinks, loading, error } = useContact();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error || !location) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-danger/10 border border-danger rounded-lg p-6 text-center">
          <i className="fa-solid fa-triangle-exclamation text-danger text-3xl mb-4"></i>
          <h3 className="text-xl font-bold text-danger mb-2">
            Failed to load contact information
          </h3>
          <p className="text-danger mb-4">{error || "Unable to load data"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page min-h-screen">
      {/* Hero Section */}
      <div className="relative py-24 bg-gradient-to-r from-primary to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Get in Touch
            </h1>
            <div className="w-24 h-1 bg-white/80 mx-auto mb-6 rounded"></div>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Have a project in mind? Interested in collaboration? Feel free to
              reach out – I'd love to hear from you!
            </p>
          </div>
        </div>
        <div className="absolute inset-0 bg-gray-900/30"></div>
      </div>

      {/* Contact Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <ContactForm />

          {/* Contact Information & Social Links */}
          <div className="flex flex-col">
            <ContactInfo location={location} loading={loading} />
            <SocialLinks links={socialLinks} />
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-primary-text mb-4">
              Find Me Here
            </h2>
            <p className="text-secondary-text mb-6">
              Based in {location.address}, but available for remote work
              worldwide.
            </p>
          </div>
          <Map coordinates={location.coordinates} address={location.address} />
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
};

export default ContactPage;
