import { useState, useEffect } from "react";
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
import PermitOnboarding from "@/components/PermitOnboarding";
import PermitProcessingTimer from "@/components/PermitProcessingTimer";

export default function Home() {
  const [showProcessingTimer, setShowProcessingTimer] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProcessingTimer(true);
    }, 8000); // Show popup after 8 seconds

    return () => clearTimeout(timer);
  }, []);


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
      <PermitProcessingTimer
        isOpen={showProcessingTimer}
        onClose={() => setShowProcessingTimer(false)}
        onStartApplication={() => {
          setShowProcessingTimer(false);
          const permitSection = document.getElementById('permit-application');
          if (permitSection) {
            permitSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />
    </div>
  );
}