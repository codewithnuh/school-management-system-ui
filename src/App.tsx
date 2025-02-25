import Header from "./components/globals/Header";
import CTA from "./components/landing_page/CTA";
import Hero from "./components/landing_page/Hero";
const App = () => {
  return (
    <div className="bg-black">
      <Header />
      <Hero />
      <CTA />
    </div>
  );
};

export default App;
