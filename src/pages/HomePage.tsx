import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PublicLayout } from '@/components/PublicLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CLINIC_CONFIG } from '@/lib/clinic-config';
import { Calendar, Shield, Star, Clock, Users, Heart, ArrowRight, Phone, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function HomePage() {
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('services').select('*').eq('is_active', true).order('sort_order').limit(6).then(({ data }) => data && setServices(data));
    supabase.from('doctors').select('*').eq('is_active', true).then(({ data }) => data && setDoctors(data));
  }, []);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dental-50 via-background to-secondary/30">
        <div className="container py-20 md:py-32">
          <div className="max-w-2xl">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium mb-6">
                <Star className="w-3.5 h-3.5 fill-current" /> Rated 4.9/5 by 500+ patients
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
                  <Link to="/book"><Calendar className="w-4 h-4 mr-2" /> Book Appointment</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-6 text-base">
                  <a href={`tel:${CLINIC_CONFIG.phone}`}><Phone className="w-4 h-4 mr-2" /> Call Now</a>
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <div className="flex flex-wrap gap-6 mt-10 text-sm text-muted-foreground">
                {['10+ Years Experience', '15,000+ Happy Patients', 'Same Day Appointments'].map(t => (
                  <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent" />{t}</span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      </section>

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
                <div className="group bg-card rounded-xl border border-border/60 p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5">{s.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{s.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-primary">₹{Number(s.price).toLocaleString('en-IN')}</span>
                    <span className="text-muted-foreground">{s.duration_minutes} min</span>
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
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href={`tel:${CLINIC_CONFIG.phone}`}><Phone className="w-4 h-4 mr-2" /> {CLINIC_CONFIG.phone}</a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
}
