// src/layouts/MainLayout.jsx
// Shared shell for standard pages (Home, listings, dashboards, etc).
// Same structure as the current Home.jsx body, just generalized and
// switched from hardcoded `bg-white dark:bg-black` to the theme tokens
// in global.css so it actually follows the brand palette in dark mode
// instead of dropping to flat black.
import Navbar from '../components/shared/Navbar';
import Footer from '../components/shared/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="theme-root min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;

/* ── Usage (drop-in replacement for Home.jsx's own wrapper) ──────────────

import MainLayout from '../../layouts/MainLayout';
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProfessionals from '../components/FeaturedProfessionals';
import CTASection from '../components/CTASection';

const Home = () => (
  <MainLayout>
    <HeroSection />
    <TrustBar />
    <CategoriesSection />
    <FeaturedProfessionals />
    <CTASection />
  </MainLayout>
);

export default Home;

---------------------------------------------------------------------- */