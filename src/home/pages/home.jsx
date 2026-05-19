import Navbar from "../../components/shared/Navbar";
import HeroSection from '../components/HeroSection';
import TrustBar from '../components/TrustBar';
import CategoriesSection from '../components/CategoriesSection';
import FeaturedProfessionals from '../components/FeaturedProfessionals';
import CTASection from '../components/CTASection';
import Footer from "../../components/shared/Footer";

const Home = () => {
  return (
    <div className="bg-white text-black dark:bg-black dark:text-white">
      <Navbar />
      <main>
        <HeroSection />
        <TrustBar />
        <CategoriesSection />
        <FeaturedProfessionals />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;