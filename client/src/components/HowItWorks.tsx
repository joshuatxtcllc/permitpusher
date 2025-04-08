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
            Revolutionary AI-Powered Permit Rush Process
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto mb-4">
            Our proprietary AI Permit Processor utilizes advanced machine learning algorithms to analyze 
            millions of public records, historical permit data, and regulatory patterns in milliseconds,
            delivering unprecedented speed and compliance accuracy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-primary/10 text-primary rounded-lg p-3">
              <div className="font-bold text-2xl mb-1">10x</div>
              <div className="text-sm">Faster than traditional methods</div>
            </div>
            <div className="bg-primary/10 text-primary rounded-lg p-3">
              <div className="font-bold text-2xl mb-1">97%</div>
              <div className="text-sm">First-time approval rate</div>
            </div>
            <div className="bg-primary/10 text-primary rounded-lg p-3">
              <div className="font-bold text-2xl mb-1">24/7</div>
              <div className="text-sm">Continuous AI optimization</div>
            </div>
          </div>
          <div className="inline-block bg-secondary/10 text-secondary font-semibold px-4 py-2 rounded-md">
            <span className="font-bold">PROPRIETARY NEURAL NETWORK</span> • Trained on 500,000+ Houston permits
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-primary font-heading mb-2">
              AI Analysis
            </h3>
            <p className="text-neutral-600">
              Our AI instantly analyzes your project and searches millions of records to 
              identify all required permits and potential compliance issues.
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-primary font-heading mb-2">
              Smart Documentation
            </h3>
            <p className="text-neutral-600">
              Our AI Processor automatically prepares all required documentation 
              in perfect compliance with the latest Houston regulations.
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-primary font-heading mb-2">
              Expedited Submission
            </h3>
            <p className="text-neutral-600">
              Our system identifies optimal submission pathways and leverages fast-track 
              channels for the quickest possible processing.
            </p>
          </div>

          {/* Step 4 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 className="text-xl font-bold text-primary font-heading mb-2">
              Rapid Approval
            </h3>
            <p className="text-neutral-600">
              Our AI-optimized submissions achieve record-breaking approval times, 
              getting your projects moving faster than ever before.
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
                Why Our AI Permit Processor Outperforms Competition
              </h3>
              <p className="text-neutral-600 mb-3">
                Our proprietary AI technology analyzes hundreds of thousands of public records
                and permit applications to identify approval patterns and optimize your submission.
              </p>
              <ul className="text-neutral-600 mb-4 list-disc list-inside space-y-1">
                <li><span className="font-semibold">Lightning-fast processing</span> - AI completes in seconds what takes humans days</li>
                <li><span className="font-semibold">Unmatched accuracy</span> - Our system learns from millions of successful permits</li> 
                <li><span className="font-semibold">Continuous optimization</span> - AI constantly improves through machine learning</li>
              </ul>
              <button
                onClick={() => handleNavClick("contact")}
                className="inline-block bg-secondary hover:bg-secondary/80 text-white font-medium py-2 px-6 rounded-md transition duration-300"
              >
                Experience AI-Powered Permitting
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
