import Header from "./components/globals/Header";
import CTA from "./components/landing_page/CTA";
import Features from "./components/landing_page/Features";
import Features2 from "./components/landing_page/Features2";
import Features3 from "./components/landing_page/Features3";
import Hero from "./components/landing_page/Hero";
import EmpowerSection from "./components/landing_page/EmpowerSection";
import Testimonials from "./components/landing_page/Testimonials";
import Footer from "./components/landing_page/Footer";
const App = () => {
  return (
    <div className="bg-black">
      <Header />
      <Hero />
      <CTA />
      <Features />
      <Features2 />
      <Features3 />
      <EmpowerSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default App;
