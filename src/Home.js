import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import ServicesSection from "./components/ServicesSection";
import ContactSection from "./components/ContactSection";

const Home = () => {
return (
    <>
    <Navbar />
    <HeroSection />
    <AboutSection />
    <ServicesSection />
    <ContactSection />
    </>
);
};

export default Home;