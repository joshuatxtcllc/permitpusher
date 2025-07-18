import QuickQuoteForm from "./QuickQuoteForm";
import { scrollToElement } from "@/lib/utils";

export default function Hero() {
  const handleNavClick = (id: string) => {
    scrollToElement(id);
  };

  return (
    <section className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="md:flex md:items-center md:space-x-8">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-heading leading-tight mb-4">
              Houston's AI-Powered Permit Services
            </h1>
            <p className="text-lg text-neutral-100 mb-6 max-w-xl">
              Our AI system processes permit applications up to 10x faster with a 97% first-time approval rate.
            </p>
            <div className="flex justify-between mb-6 text-white">
              <div>
                <div className="font-bold text-2xl">10x</div>
                <div className="text-sm">Faster</div>
              </div>
              <div>
                <div className="font-bold text-2xl">97%</div>
                <div className="text-sm">Approval Rate</div>
              </div>
              <div>
                <div className="font-bold text-2xl">24/7</div>
                <div className="text-sm">Processing</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => {
                  // Navigate to permit application
                  const permitSection = document.getElementById('permit-application');
                  if (permitSection) {
                    permitSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-secondary hover:bg-secondary/80 text-neutral-900 font-bold py-3 px-6 rounded-md transition duration-300 text-center flex items-center justify-center"
              >
                <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 12h8"/>
                  <path d="M12 8v8"/>
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6"/>
                  <path d="M12 17v6"/>
                </svg>
                Take Interactive Tour
              </button>
              <button
                onClick={() => handleNavClick("permit-application")}
                className="border border-white text-white hover:bg-white hover:text-primary font-bold py-3 px-6 rounded-md transition duration-300 text-center"
              >
                Apply for Permit
              </button>
              <button
                onClick={() => handleNavClick("contact")}
                className="border border-white text-white hover:bg-white hover:text-primary font-bold py-3 px-6 rounded-md transition duration-300 text-center"
              >
                Contact Us
              </button>
            </div>
          </div>

          <div className="md:w-1/2 bg-white rounded-md p-6">
            <div className="mb-2">
              <h2 className="text-xl font-bold text-primary font-heading">
                Quick Permit Quote
              </h2>
            </div>
            <p className="text-sm text-neutral-500 mb-4">
              Get an instant estimate for your project
            </p>
            <QuickQuoteForm />
            <div className="mt-3">
              <p className="text-xs text-neutral-500">
                Secure processing • Instant analysis • Privacy guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted by section */}
      <div className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-neutral-500 mb-4">
            Trusted by Houston's Leading Developers
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <div className="text-neutral-400 font-medium">NEURODEV</div>
            <div className="text-neutral-400 font-medium">TECHDYNAMICS</div>
            <div className="text-neutral-400 font-medium">QUANTUM BUILDERS</div>
            <div className="text-neutral-400 font-medium">AI ARCHITECTS</div>
            <div className="text-neutral-400 font-medium">FUTURESCAPE</div>
          </div>
        </div>
      </div>
    </section>
  );
}