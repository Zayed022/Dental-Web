import { User, Heart, Plane, Award, Globe } from "lucide-react";
import Banner4 from "../../src/assets/Banner4.jpg"

export default function GlobalJourney() {
  const steps = [
    {
      icon: User,
      title: "Online Consultation",
      desc: "Connect with our specialists via video call for an initial assessment and treatment planning.",
    },
    {
      icon: Heart,
      title: "Treatment Plan & Quote",
      desc: "Receive a personalized treatment plan and detailed cost breakdown within 48 hours.",
    },
    {
      icon: Plane,
      title: "Travel & Arrival",
      desc: "We assist with visa documentation, travel arrangements, and airport pickup services.",
    },
    {
      icon: Award,
      title: "Treatment Excellence",
      desc: "Receive world-class dental care in our state-of-the-art facility with personalized attention.",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Your Global Smile Journey
          </h2>
          <p className="text-muted-foreground">
            We've designed a smooth, stress-free process for our international patients, guiding you every step of the way from consultation to aftercare.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT STEPS */}
          <div className="space-y-10">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-4">

                {/* Number */}
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold shrink-0">
                  {i + 1}
                </div>

                {/* Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

              </div>
            ))}
          </div>

          {/* RIGHT SIDE */}
          <div className="relative">

            

            {/* Floating CTA Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl shadow-lg p-6 text-center">

              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center rounded-full bg-primary/10">
                <Globe className="text-primary w-6 h-6" />
              </div>

              <h3 className="font-semibold text-foreground mb-1">
                Ready to Start?
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                Book your virtual consultation today
              </p>

              <button className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition">
                Book Consultation
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}