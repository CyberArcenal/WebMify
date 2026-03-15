// src/App.tsx
import { ThemeProvider } from "@/contexts/ThemeContext";
import Layout from "@/layouts/Layout";
import About from "@/pages/about";
import BlogPage from "@/pages/blog";
import BlogDetailPage from "@/pages/blog-detail";
import ContactPage from "@/pages/contact";
import Home from "@/pages/home";
import Privacy from "@/pages/privacy-policy";
import ProjectDetail from "@/pages/project-detail";
import ProjectsList from "@/pages/projects";
import SkillsPage from "@/pages/skills";
import Terms from "@/pages/terms";
import TestimonialsPage from "@/pages/testimonials";
import { Navigate, Route, Routes } from "react-router-dom";

// Admin pages (import when ready)
// import Dashboard from './pages/admin/Dashboard';
// etc.

const PlaceholderPage = ({ name }: { name: string }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-[var(--sidebar-text)]">
      {name} Page
    </h1>
    <p className="mt-2 text-[var(--text-secondary)]">
      This page is under construction.
    </p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public routes */}
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/testimonials" element={<TestimonialsPage />} />
          {/* Placeholder for other pages */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="*" element={<PlaceholderPage name="404 - Not Found" />} />
        </Route>
        {/* Catch-all 404 */}
        
      </Routes>
    </ThemeProvider>
  );
}

export default App;
