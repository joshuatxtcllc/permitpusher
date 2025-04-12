import ServiceCard from "./ServiceCard";
import { scrollToElement } from "@/lib/utils";

export default function Services() {
  const handleNavClick = (id: string) => {
    scrollToElement(id);
  };

  return (
    <section id="services" className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Permit Services in Houston
          </h2>
          <p className="text-base text-neutral-600 max-w-2xl mx-auto">
            We expedite permits for all types of projects in Houston with industry-leading speed and accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service Card 1 */}
          <ServiceCard
            title="Residential Permits"
            description="Fast permit processing for homes, renovations, and additions in Houston."
            features={[
              "Application preparation",
              "3-10 day residential approvals",
              "Compliance verification",
              "Code requirement analysis"
            ]}
            popular={true}
            onCtaClick={() => handleNavClick("contact")}
          />

          {/* Service Card 2 */}
          <ServiceCard
            title="Commercial Permits"
            description="Expedited permits for retail spaces, offices, and commercial properties."
            features={[
              "Data analysis for optimization",
              "Faster approval strategies",
              "Document preparation",
              "97% first-time approval rate"
            ]}
            onCtaClick={() => handleNavClick("contact")}
          />

          {/* Service Card 3 */}
          <ServiceCard
            title="Specialized Permits"
            description="Expert handling of complex permits including dispensaries and special use cases."
            features={[
              "Dispensary permits",
              "Zoning variance assistance",
              "Historical property permits",
              "Regulatory compliance"
            ]}
            onCtaClick={() => handleNavClick("contact")}
          />
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-200 text-center">
          <button
            onClick={() => handleNavClick("contact")}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
          >
            Get more information about our services
            <span className="ml-1">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
