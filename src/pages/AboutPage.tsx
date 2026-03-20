import { PublicLayout } from '@/components/PublicLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CLINIC_CONFIG } from '@/lib/clinic-config';
import { Shield, Award, Heart, Users } from 'lucide-react';

export default function AboutPage() {
  return (
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
  );
}
