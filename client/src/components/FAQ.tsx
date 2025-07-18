import { useState } from "react";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "How does your permit processing service work?",
    answer:
      "Our permit processing service analyzes project requirements and public records to expedite permit applications. We identify the fastest approval pathways through Houston's permitting system, prepare compliant documentation, and submit applications through optimized channels. This allows us to process permits up to 10x faster than traditional methods.",
  },
  {
    question: "How much faster is your permit service?",
    answer:
      "Our permit service typically cuts standard Houston permit timelines by 70-90%. While regular permits can take 2-3 months, our system often secures approvals in as little as 3-10 days, depending on project complexity and permit type. For emergency situations, our priority service can secure certain permits in as little as 24-48 hours.",
  },
  {
    question: "Is my data secure with your system?",
    answer:
      "Yes, all client data is fully protected. Information is encrypted both in transit and at rest using industry-standard protocols. We implement strict access controls and maintain compliance with data protection regulations. We only process the information necessary for permit applications while maintaining strict confidentiality for all project details.",
  },
  {
    question: "What is your approval success rate?",
    answer:
      "We maintain a first-time approval rate of over 97% compared to the industry average of about 65%. This high success rate comes from our thorough understanding of Houston's permitting requirements and our attention to detail in application preparation.",
  },
  {
    question: "How do you stay current with changing permit regulations?",
    answer:
      "We continuously monitor changes to Houston's building codes, zoning laws, and permitting requirements across all jurisdictions. When regulations change, we immediately update our processes to ensure all new applications reflect current requirements.",
  },
  {
    question: "Do you handle permits throughout Houston or just specific areas?",
    answer:
      "We provide permit services throughout all of Houston and surrounding Harris County areas. We have expertise in every jurisdiction in the region and specialized knowledge of requirements in different Houston neighborhoods, including historic districts, flood zones, and other special planning areas.",
  },
  {
    question: "How fast can my permit be processed?",
    answer:
      "Our AI system can process most residential permits in 2-4 hours and commercial permits in 4-8 hours. This is dramatically faster than traditional processing which can take 2-3 weeks. The exact time depends on permit complexity and document completeness.",
  },
  {
    question: "What makes our AI permit processing different from traditional methods?",
    answer:
      "Dispensary permits involve navigating both standard business permitting and specialized regulatory requirements. These permits require compliance with specific zoning restrictions, security protocols, inventory tracking systems, and various other regulations that don't apply to typical businesses. We have expertise in these complex permits to help avoid costly delays.",
  },
  {
    question: "What information do I need to provide to get started?",
    answer:
      "We typically need basic project information such as the property address, a general description of the proposed work, and property ownership details. We can identify what additional documentation will be required for your specific project type and location, minimizing the information you need to provide upfront.",
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
    <section id="faq" className="py-12 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Learn how we can expedite your permit applications with speed and accuracy.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* FAQ Accordion */}
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-neutral-200">
                <button
                  onClick={() => toggleItem(index)}
                  className="flex justify-between items-center w-full py-3 text-left font-medium text-primary hover:text-primary/80 focus:outline-none"
                >
                  <span>{faq.question}</span>
                  <span className="text-xl">{openItems[index] ? '−' : '+'}</span>
                </button>
                <div
                  className={cn("pb-3", {
                    hidden: !openItems[index],
                  })}
                >
                  <p className="text-neutral-600 text-sm">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
