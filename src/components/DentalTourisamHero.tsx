import { Mail, CheckCircle } from "lucide-react";
import WhyChooseUs from "./WhyChooseUs";
import TestimonialHighlight from "./TestimonialsHighlight";
import GlobalJourney from "./GlobalJourney";
import FAQSection from "./FAQSection";

export default function DentalTourismHero() {
  return (
    <>
    <section className="relative overflow-hidden bg-gradient-to-r from-[#1E4DB7] to-[#2F67D8] text-white">
      
      <div className="container grid lg:grid-cols-2 gap-10 items-center py-20">
        
        {/* LEFT CONTENT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            World-Class Smiles,
            <br />
            Right Here in Mumbai
          </h1>

          <p className="text-white/90 text-lg mb-8 max-w-xl">
            Experience premium dental care at a fraction of the cost with our
            Global Smiles program, specially designed for international patients
            seeking quality dental treatments in India.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <button className="bg-white text-primary px-6 py-3 rounded-lg font-medium shadow hover:opacity-90 transition">
              Start Your Dental Journey
            </button>

            <button className="border border-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-white hover:text-primary transition">
              <Mail className="w-4 h-4" />
              Get Treatment Plan
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1588776814546-ec7e0b7a1c02?q=80&w=1200&auto=format&fit=crop"
            alt="Dental Clinic"
            className="rounded-2xl shadow-lg w-full object-cover"
          />

          {/* Floating Card */}
          <div className="absolute bottom-6 left-6 bg-white text-black rounded-xl p-4 shadow-lg flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <CheckCircle className="text-green-600 w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Save up to 70%</p>
              <p className="text-sm text-gray-500">
                on dental treatments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave Shape */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-[80px]"
          preserveAspectRatio="none"
        >
          <path
            fill="#ffffff"
            d="M0,64L80,74.7C160,85,320,107,480,112C640,117,800,107,960,90.7C1120,75,1280,53,1360,42.7L1440,32V120H0Z"
          ></path>
        </svg>
      </div>
    </section>

    <WhyChooseUs/>
    <TestimonialHighlight/>
    <GlobalJourney/>
    <FAQSection/>
    </>
  );
}