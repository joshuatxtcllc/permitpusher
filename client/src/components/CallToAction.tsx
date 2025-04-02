import { scrollToElement } from "@/lib/utils";

export default function CallToAction() {
  const handleNavClick = (id: string) => {
    scrollToElement(id);
  };
  
  return (
    <section className="py-12 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white font-heading mb-6">
          Don't Let Permit Delays Hold Up Your Project
        </h2>
        <p className="text-white text-lg mb-8 max-w-3xl mx-auto">
          Join hundreds of satisfied Houston clients who've saved time and money
          with our rush permit services.
        </p>
        <button
          onClick={() => handleNavClick("contact")}
          className="inline-block bg-white hover:bg-neutral-100 text-secondary font-bold py-3 px-8 rounded-md transition duration-300 shadow-lg"
        >
          Get Started Today
        </button>
      </div>
    </section>
  );
}
