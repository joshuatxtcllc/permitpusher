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
              Houston's Premier{" "}
              <span className="text-secondary">Rush Permit</span> Service
            </h1>
            <p className="text-lg text-neutral-100 mb-8 max-w-xl">
              Fast-track city compliance permits for residential and commercial
              buildings in Houston, TX. Our expertise gets your projects approved
              faster.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleNavClick("contact")}
                className="bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-6 rounded-md transition duration-300 text-center shadow-lg"
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
            <h2 className="text-xl font-bold text-primary font-heading mb-4">
              Get a Quick Quote Today
            </h2>
            <QuickQuoteForm />
          </div>
        </div>
      </div>

      {/* Trusted by section */}
      <div className="bg-white py-4 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-neutral-500 font-medium mb-4">
            Trusted by Top Houston Developers & Businesses
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="text-neutral-400 font-bold text-xl">COMPANY A</div>
            <div className="text-neutral-400 font-bold text-xl">COMPANY B</div>
            <div className="text-neutral-400 font-bold text-xl">COMPANY C</div>
            <div className="text-neutral-400 font-bold text-xl">COMPANY D</div>
            <div className="text-neutral-400 font-bold text-xl">COMPANY E</div>
          </div>
        </div>
      </div>
    </section>
  );
}
