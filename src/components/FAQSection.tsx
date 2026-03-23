import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const faqs = [
    {
      question: "How much can I save on dental treatments in India?",
      answer:
        "Patients typically save up to 60–70% compared to treatment costs in the US, UK, Australia, and other countries, without compromising on quality.",
    },
    {
      question: "How long will I need to stay in Mumbai for my treatment?",
      answer:
        "It depends on the treatment. Simple procedures may take a few days, while complex treatments like implants or full mouth rehabilitation may require 1–2 weeks or staged visits.",
    },
    {
      question:
        "Do you provide assistance with accommodation and local transport?",
      answer:
        "Yes, we assist with hotel bookings, airport pickup, and local transportation to ensure a comfortable and hassle-free experience.",
    },
    {
      question:
        "What if I need follow-up care after returning to my home country?",
      answer:
        "We provide detailed aftercare instructions and offer remote consultations. We also coordinate with your local dentist if needed.",
    },
    {
      question: "Are your dentists internationally qualified?",
      answer:
        "Yes, our dentists are highly experienced, internationally trained, and follow global standards with advanced technology.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container max-w-4xl">

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Get answers to common questions about seeking dental treatment in India as an international patient.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 cursor-pointer transition hover:shadow-sm"
              onClick={() => toggleFAQ(index)}
            >
              {/* Question */}
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-foreground">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Answer */}
              {activeIndex === index && (
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}