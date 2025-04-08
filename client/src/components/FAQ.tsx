import { useState } from "react";
import { cn } from "@/lib/utils";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is your AI Permit Processor and how does it work?",
    answer:
      "Our proprietary AI Permit Processor is a revolutionary technology that analyzes millions of public records and permit applications at lightning speed. This sophisticated system identifies patterns in successful permit approvals, automates documentation preparation, and optimizes submission strategies based on historical data. It works by instantly determining your project's requirements, preparing perfectly compliant documentation, and identifying the fastest approval pathways through Houston's permitting systems. This technology allows us to achieve permit processing speeds up to 10x faster than traditional methods.",
  },
  {
    question: "How much faster is your AI-powered permit service?",
    answer:
      "Our AI-powered permit service dramatically outperforms traditional methods, cutting standard Houston permit timelines by 70-90%. While regular permits typically take 2-3 months, our advanced AI system often secures approvals in as little as 3-10 days, depending on project complexity and permit type. Our technology's ability to instantly analyze millions of records, prepare perfect documentation, and identify optimal submission channels delivers unprecedented speed. For emergency situations, our AI-priority service can secure certain permits in as little as 24-48 hours.",
  },
  {
    question: "What advanced technologies does your AI Permit Processor use?",
    answer:
      "Our proprietary AI system utilizes a sophisticated neural network architecture combined with natural language processing capabilities that can interpret and process complex regulatory texts. The system employs advanced pattern recognition algorithms to identify approval factors from historical data and uses predictive modeling to optimize permit applications. Our technology stack includes transformer-based models for document analysis, computer vision components for plan review, and reinforcement learning systems that continuously improve outcomes based on real permit results. This comprehensive approach enables our AI to understand permitting requirements at a level that surpasses human capability.",
  },
  {
    question: "How secure is my data with your AI permit system?",
    answer:
      "We implement enterprise-grade security protocols to protect all client data in our AI system. All information is encrypted both in transit and at rest using AES-256 encryption standards. Our architecture employs multi-layered security measures including access controls, intrusion detection, and continuous monitoring. We maintain strict compliance with data protection regulations and regularly undergo security audits. Our AI is designed with privacy-by-design principles, processing only the information necessary for permit applications while maintaining strict confidentiality safeguards for all sensitive project details.",
  },
  {
    question: "Is your AI Permit Processor more accurate than human permit specialists?",
    answer:
      "Absolutely. Our AI Permit Processor achieves significantly higher accuracy rates than even the most experienced human permit specialists. The system has analyzed hundreds of thousands of successful and failed permit applications to identify exactly what leads to approvals. It constantly learns from new data and updates its processing algorithms to account for even minor changes in regulations or submission requirements. This results in a first-time approval rate of over 97% compared to the industry average of about 65%. The AI eliminates human errors in documentation while ensuring every submission perfectly addresses all current compliance requirements.",
  },
  {
    question: "How does the AI stay current with changing permit regulations?",
    answer:
      "Our AI Permit Processor features an advanced regulatory tracking system that automatically monitors changes to Houston's building codes, zoning laws, and permitting requirements across all jurisdictions. The system ingests official regulatory updates in real-time and uses natural language processing to interpret how these changes affect various permit types. When regulations change, our neural networks automatically adjust their processing parameters to ensure all new applications reflect current requirements. Additionally, our system performs daily validation checks against the latest published standards to guarantee continuous compliance even with the most recent regulatory updates.",
  },
  {
    question: "Do you handle permits throughout Houston or just specific areas?",
    answer:
      "We provide AI-powered permit services throughout all of Houston and surrounding Harris County areas. Our technology has been trained on permit data from every jurisdiction in the region and contains specialized knowledge of requirements in different Houston neighborhoods. The AI system is specifically optimized for handling complex cases in historic districts, flood zones, and other special planning areas within Houston, where requirements are particularly intricate and challenging.",
  },
  {
    question: "How does your \"no win, no fee\" personal injury service work?",
    answer:
      "Our personal injury services operate on a contingency fee basis, meaning you pay absolutely nothing upfront. We cover all costs related to your case, from investigation to expert witnesses to court fees. We only collect payment if we win your case, and then our fee comes as a percentage of your settlement or award. If we don't win, you owe us nothing. This allows injury victims to access quality legal representation regardless of their financial situation.",
  },
  {
    question: "What makes dispensary permits different from other business permits?",
    answer:
      "Dispensary permits involve navigating both standard business permitting and specialized regulatory requirements. In Houston, these permits require compliance with specific zoning restrictions, security protocols, inventory tracking systems, and various other regulations that don't apply to typical businesses. Our AI Permit Processor has been specially trained on thousands of dispensary permit applications to understand these unique requirements. This specialized training allows our system to anticipate potential roadblocks and prepare applications that satisfy all requirements the first time, avoiding costly delays that are common in this complex permitting area.",
  },
  {
    question: "What information do I need to provide to get started with your AI permit service?",
    answer:
      "Getting started with our AI permit service requires less information than traditional permit processors. We typically need basic project information such as the property address, a general description of the proposed work, and property ownership details. Our AI system can often fill in many gaps and identify exactly what additional documentation will be required for your specific project type and location. The system automatically analyzes property records, zoning requirements, and other public data to minimize the information you need to provide upfront. This streamlined approach saves you time while ensuring nothing is overlooked in your application.",
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
            Frequently Asked Questions About Our AI Technology
          </h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Learn more about our revolutionary AI Permit Processor and how it can
            expedite your permit applications with unprecedented speed and accuracy.
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
