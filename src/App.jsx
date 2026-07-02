import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Ecosystem from "./components/Ecosystem";
import Process from "./components/Process";
import TechStack from "./components/TechStack";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import CrmApp from "./crm/CrmApp";

function PublicWebsite() {
  return (
    <div className="app-root">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Ecosystem />
        <Process />
        <TechStack />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  if (window.location.pathname.startsWith("/crm")) {
    return <CrmApp />;
  }

  return <PublicWebsite />;
}
