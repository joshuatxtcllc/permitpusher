import { scrollToElement } from "@/lib/utils";

export default function HowItWorks() {
  const handleNavClick = (id: string) => {
    scrollToElement(id);
  };

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-4">
            How Our Permit Rush Process Works
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            We've streamlined the complex permitting process to save you time and
            money while ensuring compliance with all Houston regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-primary font-heading mb-2">
              Consultation
            </h3>
            <p className="text-neutral-600">
              We assess your project requirements and determine the exact permits
              needed for compliance in Houston.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-primary font-heading mb-2">
              Documentation
            </h3>
            <p className="text-neutral-600">
              Our experts prepare all required paperwork, plans, and supporting
              documents to meet city requirements.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-primary font-heading mb-2">
              Submission
            </h3>
            <p className="text-neutral-600">
              We submit your application through our fast-track channels and
              monitor its progress through the system.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="text-xl font-bold text-primary font-heading mb-2">
              Approval
            </h3>
            <p className="text-neutral-600">
              We deliver your approved permits and provide guidance on next steps
              for your project.
            </p>
          </div>
        </div>

        <div className="mt-16 bg-neutral-100 rounded-lg p-8 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <img
                src="https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
                alt="Fast permit processing"
                className="rounded-lg shadow-md w-full md:w-64 h-40 object-cover"
              />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary font-heading mb-2">
                Why Choose Our Fast-Track Service?
              </h3>
              <p className="text-neutral-600 mb-4">
                Our specialized knowledge of Houston's permit system and
                established relationships with city departments allow us to
                expedite your permits when others can't.
              </p>
              <button
                onClick={() => handleNavClick("contact")}
                className="inline-block bg-secondary hover:bg-secondary/80 text-white font-medium py-2 px-6 rounded-md transition duration-300"
              >
                Start Your Project Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
