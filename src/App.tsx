import Header from "./components/globals/Header";
import CTA from "./components/landing_page/CTA";
import Features from "./components/landing_page/Features";
import Features2 from "./components/landing_page/Features2";
import Hero from "./components/landing_page/Hero";
const App = () => {
  return (
    <div className="bg-black">
      <Header />
      <Hero />
      <CTA />
      <Features />
      <Features2 />
    </div>
  );
};

export default App;
