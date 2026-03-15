import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Page Title */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">Terms & Conditions</h1>
        <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 mx-auto rounded"></div>
        <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
          Last updated: 6/23/2025
        </p>
      </div>

      {/* Content Sections */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">1. Introduction</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            These Terms & Conditions govern your use of my portfolio website located at darius-portfollio.vercel.app. 
            By accessing or using the site, you agree to be bound by these terms.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">2. Intellectual Property</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            All content on this site, including but not limited to text, graphics, logos, and images, 
            is my property or the property of my licensors and is protected by copyright laws.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            You may not reproduce, distribute, modify, or create derivative works without explicit permission.
          </p>
        </section>

        {/* User Responsibilities */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">3. User Responsibilities</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            When using this site, you agree not to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-gray-300 mb-4 space-y-2">
            <li>Use the site for any unlawful purpose</li>
            <li>Attempt to gain unauthorized access to any part of the site</li>
            <li>Introduce viruses or malicious code</li>
            <li>Engage in any activity that could damage or impair the site's functionality</li>
          </ul>
        </section>

        {/* Disclaimer */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">4. Disclaimer</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The content on this site is provided "as is" without warranties of any kind. 
            I make no representations or warranties about the accuracy, reliability, 
            completeness or timeliness of the content.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            I shall not be liable for any damages arising from the use of this site or its content.
          </p>
        </section>

        {/* Third-Party Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">5. Third-Party Links</h2>
          <p className="text-gray-600 dark:text-gray-300">
            This site may contain links to third-party websites. These links are provided for convenience only, 
            and I have no control over nor responsibility for the content of these sites.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">6. Changes to Terms</h2>
          <p className="text-gray-600 dark:text-gray-300">
            I reserve the right to modify these terms at any time. Continued use of the site after changes 
            constitutes acceptance of the new terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">7. Governing Law</h2>
          <p className="text-gray-600 dark:text-gray-300">
            These terms shall be governed by and construed in accordance with the laws of Philippines, 
            without regard to its conflict of law provisions.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">8. Contact</h2>
          <p className="text-gray-600 dark:text-gray-300">
            For questions about these terms, please contact me at:
            <a href="mailto:dargab1999@gmail.com" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
              dargab1999@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;