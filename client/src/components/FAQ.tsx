import { useState } from "react";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "How much faster is your rush permit service?",
    answer:
      "Our rush permit service typically cuts the standard Houston permit timeline by 50-75%. While regular permits can take 2-3 months, our fast-track process often secures approvals in as little as 1-3 weeks, depending on the project complexity and permit type. For emergency situations, we even offer expedited services that can secure permits in as little as 1-3 business days.",
  },
  {
    question: "Do you handle permits throughout Houston or just specific areas?",
    answer:
      "We provide permit services throughout all of Houston and surrounding Harris County areas. Our team has established relationships with permitting officials across the region, including specialized knowledge of requirements in different Houston neighborhoods and jurisdictions. We're also familiar with the specific requirements of historic districts, flood zones, and other special planning areas within Houston.",
  },
  {
    question: "How does your \"no win, no fee\" personal injury service work?",
    answer:
      "Our personal injury services operate on a contingency fee basis, meaning you pay absolutely nothing upfront. We cover all costs related to your case, from investigation to expert witnesses to court fees. We only collect payment if we win your case, and then our fee comes as a percentage of your settlement or award. If we don't win, you owe us nothing. This allows injury victims to access quality legal representation regardless of their financial situation.",
  },
  {
    question: "What makes dispensary permits different from other business permits?",
    answer:
      "Dispensary permits involve navigating both standard business permitting and specialized regulatory requirements. In Houston, these permits require compliance with specific zoning restrictions, security protocols, inventory tracking systems, and various other regulations that don't apply to typical businesses. Our expertise in this niche area allows us to anticipate potential roadblocks and prepare applications that satisfy all requirements the first time, avoiding costly delays.",
  },
  {
    question: "What information do I need to provide to get started with a permit?",
    answer:
      "To begin the permit process, we typically need basic project information such as the property address, a description of the proposed work, property ownership details, and any existing plans or drawings. During our initial consultation, we'll identify exactly what documentation your specific project requires. Don't worry if you don't have everything ready – part of our service includes helping you gather and prepare the necessary materials to ensure a smooth permitting process.",
  },
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary font-heading mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Get answers to common questions about permits in Houston and our
            personal injury services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg">
                <button
                  onClick={() => toggleItem(index)}
                  className="flex justify-between items-center w-full p-4 text-left font-bold text-primary hover:bg-neutral-50 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn("h-5 w-5 text-primary transition-transform duration-200", {
                      "rotate-45": openItems[index],
                    })}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    {openItems[index] ? (
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                </button>
                <div
                  className={cn("p-4 pt-0", {
                    hidden: !openItems[index],
                  })}
                >
                  <p className="text-neutral-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
