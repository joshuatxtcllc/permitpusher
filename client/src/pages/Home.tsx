import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import HowItWorks from "@/components/HowItWorks";
import PersonalInjury from "@/components/PersonalInjury";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";
import MunicodeTools from "@/components/MunicodeTools";
import PermitApplication from "@/components/PermitApplication";

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-neutral-100 text-neutral-800">
      <Header />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <MunicodeTools />
        <PermitApplication />
        <PersonalInjury />
        <Testimonials />
        <FAQ />
        <Contact />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
