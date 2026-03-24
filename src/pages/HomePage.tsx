import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/components/PublicLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CLINIC_CONFIG } from '@/lib/clinic-config';
import { Calendar, Shield, Star, Clock, Users, Heart, ArrowRight, Phone, CheckCircle2, Zap, CheckCircle, Smile, Award } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ContactPage from './ContactPage';
import ServicesHero from '@/components/ServicesHero';
import VideoTestimonials from '@/components/VideoTestimonials';
import Banner5 from "../../src/assets/Banner5.jpg"

const testimonials = [
  {
    name: "Rahul Mehta",
    review:
      "Amazing experience! The doctors were extremely professional and the Invisalign treatment was completely painless. Highly recommended!",
  },
  {
    name: "Priya Sharma",
    review:
      "Very clean clinic and friendly staff. I was nervous at first, but they made me feel comfortable throughout the procedure.",
  },
  {
    name: "Amit Verma",
    review:
      "Best dental clinic in Worli! The results exceeded my expectations. My smile has completely transformed.",
  },
  {
    name: "Neha Kapoor",
    review:
      "Quick appointments, no waiting time, and very hygienic environment. Truly a premium dental experience.",
  },
];

export default function HomePage() {
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('services').select('*').eq('is_active', true).order('sort_order').limit(6).then(({ data }) => data && setServices(data));
    supabase.from('doctors').select('*').eq('is_active', true).then(({ data }) => data && setDoctors(data));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dental-50 via-background to-secondary/30">
  <div className="container py-20 md:py-32 grid lg:grid-cols-2 gap-12 items-center">

    {/* LEFT CONTENT */}
    <div className="max-w-2xl">
      <ScrollReveal>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-6">
          <Star className="w-3.5 h-3.5 fill-current" /> Most Trusted Dentist in Worli, Mumbai
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.08] tracking-tight mb-6">
          Advanced Dental Care with a Gentle Touch
        </h1>
      </ScrollReveal>

      <ScrollReveal delay={160}>
        <p className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
          Experience world-class dentistry in the heart of Mumbai. From routine cleanings to complex implants, we make every visit comfortable.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={240}>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <Link to="/book">
              <Calendar className="w-4 h-4 mr-2" /> Book Appointment
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
            <a href={`tel:${CLINIC_CONFIG.phone}`}>
              <Phone className="w-4 h-4 mr-2" /> Call Now
            </a>
          </Button>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={320}>
        <div className="flex flex-wrap gap-6 mt-10 text-sm text-muted-foreground">
          {['10+ Years Experience', '15,000+ Happy Patients', 'Same Day Appointments'].map(t => (
            <span key={t} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              {t}
            </span>
          ))}
        </div>
      </ScrollReveal>
    </div>

    {/* RIGHT IMAGE */}
    <ScrollReveal delay={200}>
      <div className="relative">
        <img
          src={Banner5}
          alt="Dental Clinic"
          className="rounded-2xl shadow-xl w-full object-cover"
        />

        {/* Optional floating card */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur rounded-xl px-4 py-3 shadow-md">
          <p className="text-sm font-medium text-foreground">
            ⭐ Rated 4.9 by 1000+ patients
          </p>
        </div>
      </div>
    </ScrollReveal>

  </div>

  {/* Decorative gradient (keep yours) */}
  <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
</section>

      <ServicesHero/>

      {/* Services */}
      <section className="section-padding bg-background">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our Services</h2>
              <p className="text-muted-foreground">Comprehensive dental care for the whole family</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <ScrollReveal key={s.id} delay={i * 80}>
                <div className="group bg-card rounded-xl border border-border/60 overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
                  {s.image_url ? (
                    <img src={s.image_url} alt={s.name} className="w-full h-100 object-cover" />
                  ) : (
                    <div className="w-full h-36 bg-gradient-to-br from-secondary to-primary/10 flex items-center justify-center">
                      <Heart className="w-8 h-8 text-primary/40" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground mb-1.5">{s.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{s.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-primary">₹{Number(s.price).toLocaleString('en-IN')}</span>
                      <span className="text-muted-foreground">{s.duration_minutes} min</span>
                    </div>
                    </div>
                    </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={200}>
            <div className="text-center mt-10">
              <Button asChild variant="outline">
                <Link to="/services">View All Services <ArrowRight className="w-4 h-4 ml-1" /></Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

            <VideoTestimonials/>
      {/* Why Choose Us */}
      <section className="section-padding bg-secondary/30">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Why SmileCare?</h2>
              <p className="text-muted-foreground">We combine expertise, technology, and compassion</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Sterilized & Safe', desc: 'International-grade sterilization protocols for every instrument' },
              { icon: Clock, title: 'Minimal Wait Time', desc: 'Efficient scheduling means you\'re seen within 10 minutes of arrival' },
              { icon: Users, title: 'Expert Team', desc: 'Specialists with 10+ years of experience across all dental disciplines' },
              { icon: Star, title: 'Painless Procedures', desc: 'Latest anesthesia techniques for truly comfortable treatments' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary/30">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Our Treatment Features
          </h2>
          <p className="text-muted-foreground">
            We provide comprehensive dental care with advanced features that ensure the best outcomes for our patients at our dental clinic in Worli.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Nearly Invisible",
              desc: "Custom-made clear aligners from our orthodontist Worli that are virtually undetectable when worn during the day.",
            },
            {
              icon: Heart,
              title: "Removable Comfort",
              desc: "Take out aligners for eating, drinking, and special occasions. No dietary restrictions with our Invisalign Worli treatment.",
            },
            {
              icon: CheckCircle,
              title: "Custom & Planned",
              desc: "Digitally planned treatment from our dental clinic Worli with predictable results using advanced 3D technology.",
            },
            {
              icon: Clock,
              title: "Digital Office Visits",
              desc: "Fewer office visits required with our advanced digital monitoring and progress tracking system.",
            },
            {
              icon: Smile,
              title: "Saves Restrictions",
              desc: "No food restrictions like traditional braces, allowing you to enjoy your favorite meals freely.",
            },
            {
              icon: Zap,
              title: "Effective Results",
              desc: "Proven treatment outcomes for various orthodontic cases with faster and more efficient alignment.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 text-center shadow-sm border hover:shadow-md transition"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>

              <h3 className="font-semibold text-foreground mb-2 text-lg">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* Doctors */}
      <section className="section-padding bg-background">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Meet Our Doctors</h2>
              <p className="text-muted-foreground">Experienced professionals dedicated to your oral health</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctors.map((d, i) => (
              <ScrollReveal key={d.id} delay={i * 100}>
                <div className="bg-card rounded-xl border border-border/60 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">{d.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-foreground text-lg">{d.name}</h3>
                    <p className="text-primary text-sm font-medium mb-2">{d.specialization}</p>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{d.bio}</p>
                    <p className="text-xs text-muted-foreground">{d.qualification}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

    
    <section className="section-padding bg-secondary/30">
      <div className="container">
        
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Our Achievements
          </h2>
          <p className="text-muted-foreground">
            We take pride in our commitment to excellence and the trust our patients place in us. 
            Here are some milestones that reflect our dedication to quality dental care.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Award,
              number: "15+",
              title: "Years of Excellence",
              desc: "Providing quality dental care",
            },
            {
              icon: Users,
              number: "10,000+",
              title: "Happy Patients",
              desc: "Trusted by thousands",
            },
            {
              icon: Calendar,
              number: "50,000+",
              title: "Successful Treatments",
              desc: "Procedures completed",
            },
            {
              icon: Star,
              number: "99%",
              title: "Patient Satisfaction",
              desc: "Outstanding service record",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#E9EDF3] rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-6 shadow">
                <item.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Number */}
              <h3 className="text-3xl font-bold text-primary mb-2">
                {item.number}
              </h3>

              {/* Title */}
              <p className="font-semibold text-foreground mb-1">
                {item.title}
              </p>

              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>


    <section className="section-padding bg-white">
      <div className="container">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            What Our Patients Say
          </h2>
          <p className="text-muted-foreground">
            Real experiences from our happy patients who trust us with their smiles.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((item, i) => (
            <div
              key={i}
              className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-secondary/20"
            >
              {/* Stars */}
              <div className="flex mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-5 h-5 text-yellow-500 fill-yellow-500"
                  />
                ))}
              </div>

              {/* Review */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                “{item.review}”
              </p>

              {/* Name */}
              <p className="font-semibold text-foreground">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

      {/* CTA */}
      <section className="section-padding bg-primary">
        <div className="container text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready for a Healthier Smile?</h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <p className="text-primary-foreground/80 max-w-md mx-auto mb-8">Book your appointment today and experience the SmileCare difference. New patients welcome!</p>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-base">
                <Link to="/book"><Calendar className="w-4 h-4 mr-2" /> Book Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-primary-foreground h-12 px-6 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href={`tel:${CLINIC_CONFIG.phone}`}><Phone className="w-4 h-4 mr-2" /> {CLINIC_CONFIG.phone}</a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <ContactPage/>
    </>
  );
}
