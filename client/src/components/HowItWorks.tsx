import { scrollToElement } from "@/lib/utils";

export default function HowItWorks() {
  const handleNavClick = (id: string) => {
    scrollToElement(id);
  };

  return (
    <section id="how-it-works" className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-heading mb-4">
            Our Permit Process
          </h2>
          <p className="text-base text-neutral-600 max-w-2xl mx-auto">
            Our AI-powered system streamlines the permit application process for faster approvals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div>
            <div className="text-primary font-bold text-xl mb-2">1. Analysis</div>
            <p className="text-neutral-600">
              Our system analyzes your project requirements and identifies all necessary permits.
            </p>
          </div>

          {/* Step 2 */}
          <div>
            <div className="text-primary font-bold text-xl mb-2">2. Documentation</div>
            <p className="text-neutral-600">
              We prepare all required documentation in compliance with Houston regulations.
            </p>
          </div>

          {/* Step 3 */}
          <div>
            <div className="text-primary font-bold text-xl mb-2">3. Submission</div>
            <p className="text-neutral-600">
              We use fast-track channels for the quickest possible processing.
            </p>
          </div>

          {/* Step 4 */}
          <div>
            <div className="text-primary font-bold text-xl mb-2">4. Approval</div>
            <p className="text-neutral-600">
              Our optimized submissions achieve faster approval times than traditional methods.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-neutral-200 pt-10">
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary font-heading mb-3">
              Why Choose Our Permit Services
            </h3>
            <p className="text-neutral-600 mb-4 max-w-2xl mx-auto">
              Our technology analyzes thousands of permit applications to optimize your submission.
            </p>
            <ul className="text-neutral-600 mb-6 max-w-md mx-auto">
              <li className="mb-2">• Fast processing - completed in days, not weeks</li>
              <li className="mb-2">• High accuracy - 97% first-time approval rate</li> 
              <li className="mb-2">• Continuous optimization - constantly improving</li>
            </ul>
            <button
              onClick={() => handleNavClick("contact")}
              className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-md transition duration-300"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
