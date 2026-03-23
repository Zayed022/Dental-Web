import { CheckCircle, Star, Globe, Mail } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: CheckCircle,
      title: "Cost-Effective",
      desc: "Save up to 70% on dental treatments compared to costs in the US, UK, Australia, and other countries.",
    },
    {
      icon: Star,
      title: "Quality Care",
      desc: "Internationally trained dentists using state-of-the-art technology and adhering to global standards.",
    },
    {
      icon: Globe,
      title: "Full Support",
      desc: "Comprehensive assistance with travel planning, accommodation, local transportation, and tourism.",
    },
    {
      icon: Mail,
      title: "Seamless Communication",
      desc: "English-speaking staff and 24/7 support before, during, and after your treatment journey.",
    },
  ];

  return (
    <section className="section-padding bg-secondary/30">
      <div className="container">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Us for Global Care
          </h2>
          <p className="text-muted-foreground">
            We combine world-class dental expertise with personalized care and
            substantial cost savings for our international patients.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition"
            >
              {/* Icon */}
              <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full bg-primary/10">
                <item.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}