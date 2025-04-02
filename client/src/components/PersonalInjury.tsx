import { scrollToElement } from "@/lib/utils";

export default function PersonalInjury() {
  const handleNavClick = (id: string) => {
    scrollToElement(id);
  };

  return (
    <section id="personal-injury" className="py-16 bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Personal Injury Legal Services
          </h2>
          <p className="text-lg text-neutral-100 max-w-3xl mx-auto">
            Our firm maintains a substantial liquid reserve specifically allocated
            for personal injury cases, allowing us to fight for the compensation
            you deserve.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white text-neutral-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-primary font-heading mb-4">
                No Win, No Fee Guarantee
              </h3>
              <p className="text-neutral-600 mb-6">
                You don't pay unless we win your case. Our fees come directly from
                the settlement, so there's no financial risk to you.
              </p>
              <ul className="mb-6 space-y-4">
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-success mt-1 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold block">Free Case Evaluation</span>
                    <span className="text-neutral-500">
                      Get your case assessed at no cost
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-success mt-1 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold block">No Upfront Costs</span>
                    <span className="text-neutral-500">
                      We cover all expenses during your case
                    </span>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-success mt-1 mr-3 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <span className="font-semibold block">
                      Contingency-Based Fee
                    </span>
                    <span className="text-neutral-500">
                      We only get paid when you get paid
                    </span>
                  </div>
                </li>
              </ul>
              <button
                onClick={() => handleNavClick("contact")}
                className="block text-center bg-secondary hover:bg-secondary/80 text-white font-bold py-3 px-6 rounded-md transition duration-300 shadow-sm w-full"
              >
                Discuss Your Case
              </button>
            </div>
          </div>

          <div className="bg-white text-neutral-800 rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-primary font-heading mb-4">
                Types of Cases We Handle
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-secondary mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 16v3M19 9V6M9 13v3m0-6V7m5 10v-4m0-3V6"
                      />
                    </svg>
                    <h4 className="font-bold">Auto Accidents</h4>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    Car accidents, truck collisions, motorcycle crashes
                  </p>
                </div>
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-secondary mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                      />
                    </svg>
                    <h4 className="font-bold">Work Injuries</h4>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    Construction accidents, occupational hazards
                  </p>
                </div>
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-secondary mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    <h4 className="font-bold">Premises Liability</h4>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    Slip and falls, negligent security, unsafe conditions
                  </p>
                </div>
                <div className="bg-neutral-100 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-secondary mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    <h4 className="font-bold">Serious Injuries</h4>
                  </div>
                  <p className="text-neutral-600 text-sm">
                    Brain injuries, spinal cord damage, amputations
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={() => handleNavClick("testimonials")}
                  className="inline-flex items-center text-secondary hover:text-secondary/80 font-bold"
                >
                  See our track record
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
          </div>
        </div>

        <div className="text-center">
          <div className="inline-flex items-center bg-white text-primary rounded-full px-6 py-2 text-lg font-bold mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-secondary mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Millions Recovered for Our Clients
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-primary-dark bg-opacity-50 rounded-lg p-6">
              <div className="text-3xl font-bold mb-1">$4.2M</div>
              <div className="text-neutral-200 text-sm">
                Auto Accident Settlement
              </div>
            </div>
            <div className="bg-primary-dark bg-opacity-50 rounded-lg p-6">
              <div className="text-3xl font-bold mb-1">$2.8M</div>
              <div className="text-neutral-200 text-sm">
                Workplace Injury Verdict
              </div>
            </div>
            <div className="bg-primary-dark bg-opacity-50 rounded-lg p-6">
              <div className="text-3xl font-bold mb-1">$1.5M</div>
              <div className="text-neutral-200 text-sm">
                Premises Liability Case
              </div>
            </div>
            <div className="bg-primary-dark bg-opacity-50 rounded-lg p-6">
              <div className="text-3xl font-bold mb-1">$3.6M</div>
              <div className="text-neutral-200 text-sm">Medical Malpractice</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
