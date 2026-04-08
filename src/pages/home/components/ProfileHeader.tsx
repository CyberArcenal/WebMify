import React, { useState } from "react";
import { Profile } from "@/api/core/profile";
import Button from "@/components/UI/Button";

interface Props {
  profile: Profile;
}

const ProfileHeader: React.FC<Props> = ({ profile }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!profile.resume_url) return;
    setIsDownloading(true);
    try {
      const response = await fetch(profile.resume_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Kunin ang filename mula sa URL o mag-set ng default
      const filename = profile.resume_url.split("/").pop() || "resume.pdf";
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };
  const socialLinks = [
    {
      href: `${profile?.github_url}`,
      icon: "fab fa-github",
      label: "GitHub",
      color: "hover:text-gray-300!",
    },
    {
      href: `${profile?.linkedin_url}`,
      icon: "fab fa-linkedin",
      label: "LinkedIn",
      color: "hover:text-blue-400!",
    },
    {
      href: `${profile?.twitter_url}`,
      icon: "fab fa-twitter",
      label: "Twitter",
      color: "hover:text-sky-400!",
    },
    {
      href: `${profile?.youtube_url}`,
      icon: "fab fa-youtube",
      label: "Youtube",
      color: "hover:text-pink-400!",
    },
  ];

  return (
    <>
      {/* Profile Image */}
      <div className="w-full md:w-2/5 flex justify-center">
        <div className="relative" id="profile-image-container">
          <img
            src={profile.profile_image_url || ""}
            alt={profile.name}
            crossOrigin="anonymous"
            className="rounded-xl w-64 h-64 md:w-80 md:h-80 object-cover shadow-lg"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.parentElement!.innerHTML =
                '<div class="bg-card-secondary border-2 border-dashed rounded-xl w-64 h-64 md:w-80 md:h-80"></div>';
            }}
          />
          <div className="absolute -bottom-4 -right-4 bg-primary text-white p-3 rounded-full shadow-lg">
            <i className="fa-solid fa-star text-xl"></i>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="w-full md:w-3/5 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-text mb-4">
          {profile.name}
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
          {profile.title}
        </h2>
        <p className="text-xl text-secondary-text mb-8 leading-relaxed">
          {profile.bio}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <i className="fa-solid fa-envelope text-primary"></i>
            <span className="text-secondary-text">{profile.email}</span>
          </div>
          {profile.phone && (
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <i className="fa-solid fa-phone text-primary"></i>
              <span className="text-secondary-text">{profile.phone}</span>
            </div>
          )}
          {profile.address && (
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <i className="fa-solid fa-location-dot text-primary"></i>
              <span className="text-secondary-text">{profile.address}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          {profile.resume_url && (
            <Button
              size="md"
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-6! py-3! hover:bg-primary-dark! text-white font-medium transition-colors shadow-md inline-flex items-center"
            >
              <i
                className={`fa-solid ${isDownloading ? "fa-spinner fa-spin" : "fa-download"} mr-2`}
              ></i>
              {isDownloading ? "Downloading..." : "Download Resume"}
            </Button>
          )}
          <a
            href="#contact"
            className="px-6 py-3 bg-card border border-color hover:bg-card-secondary text-primary-text rounded-lg font-medium transition-colors shadow-md inline-flex items-center"
          >
            <i className="fa-solid fa-envelope mr-2"></i>Contact Me
          </a>
        </div>

        <div className="mt-8 flex justify-center md:justify-start space-x-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-center w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm border border-border-color text-tertiary-text transition-all duration-300 hover:scale-110 hover:rotate-6 ${link.color}`}
              aria-label={link.label}
            >
              <i
                className={`${link.icon} fa-lg transition-transform duration-300 group-hover:scale-110`}
              ></i>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
