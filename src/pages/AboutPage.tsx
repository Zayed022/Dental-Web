import { PublicLayout } from '@/components/PublicLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CLINIC_CONFIG } from '@/lib/clinic-config';
import { Shield, Award, Heart, Users, CheckCircle } from 'lucide-react';

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

const journeyData = [
  {
    year: "2008",
    title: "Founded in Mumbai",
    desc: "Started as a small clinic with a vision to provide quality dental care.",
  },
  {
    year: "2012",
    title: "Expanded Services",
    desc: "Introduced advanced dental treatments and modern technology.",
  },
  {
    year: "2015",
    title: "Reached 5,000 Patients",
    desc: "Successfully served thousands of happy patients with trusted care.",
  },
  {
    year: "2020",
    title: "Modern Clinic Upgrade",
    desc: "Upgraded infrastructure with cutting-edge equipment and digital systems.",
  },
];

export default function AboutPage() {
  return (
    <>
    <PublicLayout>
      <section className="section-padding bg-gradient-to-br from-dental-50 via-background to-secondary/30">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About SmileCare</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Established in 2015, {CLINIC_CONFIG.name} has been at the forefront of dental innovation in Mumbai, combining cutting-edge technology with compassionate care.
              </p>
            </div>
          </ScrollReveal>

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

            {/*Timeline*/}

            

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

    <section className="section-padding bg-secondary/30">
      <div className="container">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Our Journey
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          
          {/* Center Line */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-1 bg-primary transform -translate-x-1/2"></div>

          <div className="space-y-12">
            {journeyData.map((item, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                
                {/* Content Card */}
                <div className="md:w-1/2 w-full px-4">
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-semibold shadow-md">
                  {item.year}
                </div>

                {/* Spacer */}
                <div className="md:w-1/2 hidden md:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <ScrollReveal delay={80}>
              <div className="bg-card rounded-xl border border-border/60 p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide accessible, affordable, and advanced dental care to every individual in Mumbai. We believe that a healthy smile transforms lives, and our team is dedicated to making that possible for every patient who walks through our doors.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={160}>
              <div className="bg-card rounded-xl border border-border/60 p-8">
                <h2 className="text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be Mumbai's most trusted dental care provider, known for clinical excellence, patient-centric approach, and a commitment to lifelong oral health. We invest in the latest technology and continuous education to stay ahead.
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, value: '15,000+', label: 'Happy Patients' },
              { icon: Award, value: '10+', label: 'Years Experience' },
              { icon: Shield, value: '98%', label: 'Success Rate' },
              { icon: Heart, value: '3', label: 'Expert Doctors' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center p-6 bg-card rounded-xl border border-border/60">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
    </>
  );
}
