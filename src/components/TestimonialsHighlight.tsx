import Banner3 from "../../src/assets/Banner3.jpg"
export default function TestimonialHighlight() {
    const testimonial = {
      quote:
        "The combination of world-class treatment and incredible savings made my dental tourism experience unforgettable. I saved $15,000 and got to explore beautiful Mumbai!",
      name: "Michael Johnson",
      country: "United States",
      treatment: "Full Mouth Rehabilitation",
      initials: "MJ",
      
    };
  
    return (
      <section className="section-padding bg-secondary/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
  
            {/* LEFT IMAGE */}
            <div>
              <img
                src={Banner3}
                alt="Dental Clinic"
                className="rounded-2xl shadow-md w-full object-cover"
              />
            </div>
  
            {/* RIGHT CONTENT */}
            <div>
  
              {/* Quote */}
              <p className="text-xl md:text-2xl text-foreground leading-relaxed italic mb-8">
                “{testimonial.quote}”
              </p>
  
              {/* Profile */}
              <div className="flex items-center gap-4">
  
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                  {testimonial.initials}
                </div>
  
                {/* Info */}
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.country} – {testimonial.treatment}
                  </p>
                </div>
  
              </div>
  
            </div>
          </div>
        </div>
      </section>
    );
  }