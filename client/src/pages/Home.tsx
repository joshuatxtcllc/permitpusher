import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import MunicodeTools from "@/components/MunicodeTools";
import PermitApplication from "@/components/PermitApplication";
import PersonalInjuryPopup from "@/components/PersonalInjuryPopup";
import PermitOnboarding from "@/components/PermitOnboarding";

export default function Home() {
  const [showPersonalInjuryPopup, setShowPersonalInjuryPopup] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPermitApp, setShowPermitApp] = useState(false);

  if (showOnboarding) {
    return (
      <PermitOnboarding 
        onStart={() => {
          setShowOnboarding(false);
          setShowPermitApp(true);
        }} 
      />
    );
  }

  if (showPermitApp) {
    return (
      <div className="min-h-screen font-sans bg-neutral-100 text-neutral-800">
        <Header />
        <PermitApplication />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-neutral-100 text-neutral-800">
      <Header />
      <main>
        <Hero onStartTutorial={() => setShowOnboarding(true)} />
        <Services />
        <HowItWorks />
        <MunicodeTools />
        <PermitApplication />
        <Testimonials />
        <FAQ />
        <Contact />
        <CallToAction />
      </main>
      <Footer />
      <PersonalInjuryPopup />
    </div>
  );
}