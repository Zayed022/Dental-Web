import { CheckCircle } from "lucide-react";

const storyContent = {
  heading: "Our Story",
  paragraphs: [
    "Founded with a vision to provide world-class dental care in a comfortable, patient-centered environment, our clinic has grown into one of the most trusted dental practices.",
    "Our journey has been driven by a passion for excellence and innovation in dental care. We continuously integrate modern technology and advanced treatment methods while maintaining personalized patient care.",
    "Today, we serve thousands of patients, including international visitors, delivering reliable and high-quality dental solutions.",
  ],
  missionHeading: "Our Mission",
  missionPoints: [
    "To provide exceptional dental care that enhances patients' quality of life",
    "To make advanced dental treatments accessible and comfortable",
    "To continuously innovate and improve patient experiences",
  ],
  image:
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1200&auto=format&fit=crop",
};

export default function OurStory() {
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Image */}
          <div className="w-full">
            <img
              src={storyContent.image}
              alt="Dental consultation"
              className="rounded-2xl shadow-md w-full object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              {storyContent.heading}
            </h2>

            {/* Paragraphs */}
            <div className="space-y-4 text-muted-foreground">
              {storyContent.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Mission */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {storyContent.missionHeading}
              </h3>

              <div className="space-y-3">
                {storyContent.missionPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="text-primary w-5 h-5 mt-1" />
                    <p className="text-muted-foreground">{point}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}