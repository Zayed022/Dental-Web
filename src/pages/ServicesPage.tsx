import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout } from '@/components/PublicLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Heart, Calendar } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('services').select('*').eq('is_active', true).order('sort_order').then(({ data }) => data && setServices(data));
  }, []);

  const categories = [...new Set(services.map(s => s.category).filter(Boolean))];

  return (
    <PublicLayout>
      <section className="section-padding bg-gradient-to-br from-dental-50 via-background to-secondary/30">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Services</h1>
              <p className="text-lg text-muted-foreground">Comprehensive dental treatments tailored to your needs</p>
            </div>
          </ScrollReveal>

          {categories.map((cat, ci) => (
            <div key={cat} className="mb-12">
              <ScrollReveal delay={ci * 60}>
                <h2 className="text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  {cat}
                </h2>
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.filter(s => s.category === cat).map((s, i) => (
                  <ScrollReveal key={s.id} delay={i * 80}>
                    <div className="bg-card rounded-xl border border-border/60 p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                        <Heart className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{s.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary text-lg">₹{Number(s.price).toLocaleString('en-IN')}</span>
                        <span className="text-sm text-muted-foreground">{s.duration_minutes} min</span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          ))}

          <ScrollReveal>
            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link to="/book"><Calendar className="w-4 h-4 mr-2" /> Book an Appointment</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PublicLayout>
  );
}
