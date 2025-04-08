import ServiceCard from "./ServiceCard";
import { scrollToElement } from "@/lib/utils";

export default function Services() {
  const handleNavClick = (id: string) => {
    scrollToElement(id);
  };

  return (
    <section id="services" className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-4">
            AI-Powered Permit Services in Houston
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto mb-4">
            Our proprietary AI Permit Processor analyzes millions of public records 
            to expedite permits for all types of projects in Houston, TX, delivering 
            unprecedented speed and accuracy.
          </p>
          <div className="inline-block bg-secondary/10 text-secondary font-semibold px-4 py-2 rounded-md mb-4">
            Powered by our revolutionary AI technology
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <ServiceCard
            title="AI-Powered Residential Permits"
            description="Our AI system processes residential permits up to 10x faster than traditional methods for homes, renovations, and additions in Houston."
            image="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
            imageAlt="AI-powered residential building permit"
            features={[
              "AI-optimized application preparation",
              "3-10 day residential approvals",
              "Automated compliance verification",
              "Intelligent code requirement analysis",
            ]}
            popular={true}
            onCtaClick={() => handleNavClick("contact")}
          />

          {/* Service Card 2 */}
          <ServiceCard
            title="AI-Accelerated Commercial Permits"
            description="Our proprietary AI technology expedites permits for retail spaces, offices, and commercial properties with unprecedented speed and accuracy."
            image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
            imageAlt="AI-powered commercial building permit"
            features={[
              "AI data analysis from millions of records",
              "Pattern recognition for faster approvals",
              "Intelligent document preparation",
              "97% first-time approval rate",
            ]}
            onCtaClick={() => handleNavClick("contact")}
          />

          {/* Service Card 3 */}
          <ServiceCard
            title="AI Complex Permit Processing"
            description="Our AI system excels at complex permits, analyzing thousands of similar cases to optimize applications for dispensaries and special use cases."
            image="https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
            imageAlt="AI-powered dispensary permit"
            features={[
              "AI-optimized dispensary permits",
              "Machine learning for zoning variances",
              "Historical property permit automation",
              "Specialized regulatory compliance",
            ]}
            onCtaClick={() => handleNavClick("contact")}
          />
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => handleNavClick("contact")}
            className="inline-flex items-center text-secondary hover:text-secondary/80 font-bold"
          >
            See all our AI-powered permit services
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
