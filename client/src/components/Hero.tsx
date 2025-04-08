import QuickQuoteForm from "./QuickQuoteForm";
import { scrollToElement } from "@/lib/utils";

export default function Hero() {
  const handleNavClick = (id: string) => {
    scrollToElement(id);
  };

  return (
    <section className="relative bg-primary overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486325212027-8081e485255e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        <div className="md:flex md:items-center md:space-x-12">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white font-heading leading-tight mb-4">
              Houston's Revolutionary{" "}
              <span className="text-secondary">Neural Network</span> Permit AI
            </h1>
            <p className="text-lg text-neutral-100 mb-6 max-w-xl">
              Our proprietary machine learning system analyzes millions of permit records in milliseconds, 
              identifies approval patterns, and processes applications with 97% first-time approval rate — 
              up to 10x faster than traditional methods.
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6 backdrop-blur-sm">
              <div className="flex flex-wrap gap-4 justify-between">
                <div className="text-center">
                  <div className="text-secondary font-bold text-2xl">10x</div>
                  <div className="text-white text-sm">Faster Processing</div>
                </div>
                <div className="text-center">
                  <div className="text-secondary font-bold text-2xl">97%</div>
                  <div className="text-white text-sm">Approval Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-secondary font-bold text-2xl">500K+</div>
                  <div className="text-white text-sm">Analyzed Records</div>
                </div>
              </div>
            </div>
            <p className="text-lg text-white font-semibold mb-8 max-w-xl flex items-center">
              <span className="bg-secondary text-white px-2 py-1 rounded-md mr-2 text-xs font-bold">NEW</span>
              Advanced transformer-based models deliver unprecedented permit optimization
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleNavClick("contact")}
                className="bg-secondary hover:bg-secondary/80 text-neutral-900 font-bold py-3 px-6 rounded-md transition duration-300 text-center shadow-lg"
              >
                Get Your Permit Fast
              </button>
              <button
                onClick={() => handleNavClick("services")}
                className="bg-white hover:bg-neutral-200 text-primary font-bold py-3 px-6 rounded-md transition duration-300 text-center shadow-lg"
              >
                View Our Services
              </button>
            </div>
          </div>

          <div className="md:w-1/2 bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xl font-bold text-primary font-heading">
                AI-Powered Permit Quote
              </h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">AI ASSISTED</span>
            </div>
            <p className="text-sm text-neutral-500 mb-4">
              Our AI instantly analyzes your project requirements and provides an accurate quote
            </p>
            <QuickQuoteForm />
            <div className="mt-3 text-center">
              <p className="text-xs text-neutral-500">
                <span className="text-secondary">✓</span> Secure AI processing {" "}
                <span className="text-secondary">✓</span> Instant analysis {" "}
                <span className="text-secondary">✓</span> Privacy guaranteed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted by section */}
      <div className="bg-white py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-neutral-500 font-medium mb-4">
            Trusted by Houston's Leading Tech-Forward Developers
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="text-neutral-400 font-bold text-xl">NEURODEV</div>
            <div className="text-neutral-400 font-bold text-xl">TECHDYNAMICS</div>
            <div className="text-neutral-400 font-bold text-xl">QUANTUM BUILDERS</div>
            <div className="text-neutral-400 font-bold text-xl">AI ARCHITECTS</div>
            <div className="text-neutral-400 font-bold text-xl">FUTURESCAPE</div>
          </div>
        </div>
      </div>
    </section>
  );
}
