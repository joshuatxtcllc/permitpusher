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
            Our Permit Services in Houston
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            We expedite permits for all types of projects in Houston, TX. Our team
            knows the ins and outs of local regulations to get your approvals fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <ServiceCard
            title="Residential Building Permits"
            description="Fast-track permits for new homes, renovations, additions, and other residential construction projects in Houston."
            image="https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
            imageAlt="Residential building permit"
            features={[
              "New construction permits",
              "Home renovation permits",
              "Electrical & plumbing permits",
              "Deck & pool permits",
            ]}
            popular={true}
            onCtaClick={() => handleNavClick("contact")}
          />

          {/* Service Card 2 */}
          <ServiceCard
            title="Commercial Building Permits"
            description="Expedited permits for retail spaces, offices, restaurants, and other commercial properties in Houston."
            image="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
            imageAlt="Commercial building permit"
            features={[
              "New commercial construction",
              "Tenant improvement permits",
              "Change of use permits",
              "Commercial remodels",
            ]}
            onCtaClick={() => handleNavClick("contact")}
          />

          {/* Service Card 3 */}
          <ServiceCard
            title="Specialized Permits"
            description="Expert handling of complex permits including dispensaries, industrial facilities, and special use cases."
            image="https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
            imageAlt="Dispensary permit"
            features={[
              "Dispensary permits",
              "Industrial & manufacturing",
              "Special zoning variances",
              "Historical property permits",
            ]}
            onCtaClick={() => handleNavClick("contact")}
          />
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => handleNavClick("contact")}
            className="inline-flex items-center text-secondary hover:text-secondary/80 font-bold"
          >
            See all our permit services
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
