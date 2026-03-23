import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServicesHero() {
  const points = [
    "State-of-the-art technology and equipment",
    "Experienced team of dental specialists",
    "Comprehensive treatment planning",
    "Comfortable and caring environment",
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-foreground">
            Comprehensive{" "}
            <span className="text-primary">Dental Services</span>
            <br />
            at Bombay Dental Clinic in Worli
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-6 max-w-xl">
            Experience world-class dental care with our comprehensive range of
            treatments. From routine check-ups to complex procedures, our{" "}
            <span className="text-primary font-medium">
              dental clinic Worli
            </span>{" "}
            provides personalized care using the latest technology and techniques
            for optimal oral health.
          </p>

          {/* Bullet Points */}
          <div className="space-y-3 mb-8">
            {points.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle className="text-primary w-5 h-5 mt-1 shrink-0" />
                <p className="text-foreground text-sm">{point}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link to = "/book">
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:opacity-90 transition">
            Book Your Appointment Today
            <span>→</span>
          </button>
          </Link>

        </div>

        {/* RIGHT IMAGE */}
        <div>
          <img
            src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?q=80&w=1200&auto=format&fit=crop"
            alt="Dental Clinic"
            className="rounded-2xl shadow-md w-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}