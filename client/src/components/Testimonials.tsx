import { scrollToElement } from "@/lib/utils";

export default function Testimonials() {
  const handleNavClick = (id: string) => {
    scrollToElement(id);
  };

  return (
    <section id="testimonials" className="py-16 bg-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            We've helped hundreds of clients in Houston navigate the permit
            process and win personal injury cases. Here are some of their stories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="absolute -top-4 left-6 text-5xl text-primary opacity-20">
              "
            </div>
            <div className="mb-4 flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-neutral-600 mb-4 italic">
              "City Permit Rush saved our project timeline! We were facing months
              of delays with our commercial building permit, but they got it
              approved in just 2 weeks. Their expertise with Houston's permitting
              system is invaluable."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                <span className="font-bold text-primary">JD</span>
              </div>
              <div>
                <h4 className="font-bold">James Davis</h4>
                <p className="text-sm text-neutral-500">
                  Commercial Developer, Houston
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="absolute -top-4 left-6 text-5xl text-primary opacity-20">
              "
            </div>
            <div className="mb-4 flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-neutral-600 mb-4 italic">
              "After my car accident, I was worried about medical bills and lost
              wages. The personal injury team at City Permit Rush handled
              everything, and I received a settlement that was far more than I
              expected. They truly fight for their clients!"
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                <span className="font-bold text-primary">SL</span>
              </div>
              <div>
                <h4 className="font-bold">Sarah Lee</h4>
                <p className="text-sm text-neutral-500">Personal Injury Client</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-white rounded-lg shadow-md p-6 relative">
            <div className="absolute -top-4 left-6 text-5xl text-primary opacity-20">
              "
            </div>
            <div className="mb-4 flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-neutral-600 mb-4 italic">
              "Getting a dispensary permit in Houston seemed impossible until we
              found City Permit Rush. They navigated the complex regulations and
              secured our permit when other firms couldn't help. Worth every penny
              for their specialized knowledge."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center mr-3">
                <span className="font-bold text-primary">MR</span>
              </div>
              <div>
                <h4 className="font-bold">Michael Rodriguez</h4>
                <p className="text-sm text-neutral-500">
                  Business Owner, Houston
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => handleNavClick("contact")}
            className="inline-flex items-center bg-primary hover:bg-primary/80 text-white font-medium py-2 px-6 rounded-md transition duration-300"
          >
            Become Our Next Success Story
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
