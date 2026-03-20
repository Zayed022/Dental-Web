import { useState } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CLINIC_CONFIG } from '@/lib/clinic-config';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.from('leads').insert({
      name: form.get('name') as string,
      phone: form.get('phone') as string,
      email: form.get('email') as string,
      message: form.get('message') as string,
      source: 'contact_page',
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: 'Something went wrong. Please try again.', variant: 'destructive' });
    } else {
      toast({ title: 'Message Sent!', description: 'We\'ll get back to you soon.' });
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <PublicLayout>
      <section className="section-padding bg-gradient-to-br from-dental-50 via-background to-secondary/30">
        <div className="container">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
              <p className="text-lg text-muted-foreground">Have a question? We'd love to hear from you.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <ScrollReveal delay={80}>
              <div className="space-y-6">
                {[
                  { icon: Phone, label: 'Phone', value: CLINIC_CONFIG.phone, href: `tel:${CLINIC_CONFIG.phone}` },
                  { icon: Mail, label: 'Email', value: CLINIC_CONFIG.email, href: `mailto:${CLINIC_CONFIG.email}` },
                  { icon: MapPin, label: 'Address', value: CLINIC_CONFIG.address },
                  { icon: Clock, label: 'Hours', value: `${CLINIC_CONFIG.workingDays}, ${CLINIC_CONFIG.openingTime} – ${CLINIC_CONFIG.closingTime}` },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-card rounded-xl border border-border/60">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium text-foreground hover:text-primary transition-colors">{item.value}</a>
                      ) : (
                        <p className="font-medium text-foreground">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={160}>
              <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border/60 p-6 space-y-4">
                <h2 className="font-semibold text-lg text-foreground mb-2">Send us a message</h2>
                <Input name="name" placeholder="Your Name" required />
                <Input name="phone" placeholder="Phone Number" required />
                <Input name="email" type="email" placeholder="Email (optional)" />
                <Textarea name="message" placeholder="Your Message" rows={4} required />
                <Button type="submit" disabled={loading} className="w-full">
                  <Send className="w-4 h-4 mr-2" />{loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
