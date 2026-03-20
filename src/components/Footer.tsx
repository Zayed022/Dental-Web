import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { CLINIC_CONFIG } from '@/lib/clinic-config';

export function Footer() {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-lg text-background">Smile<span className="text-primary">Care</span></span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">{CLINIC_CONFIG.tagline}. Advanced dental care with a gentle touch, serving Mumbai since 2015.</p>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-2">
              {[
                { to: '/services', label: 'Our Services' },
                { to: '/about', label: 'About Us' },
                { to: '/book', label: 'Book Appointment' },
                { to: '/contact', label: 'Contact' },
              ].map(l => (
                <Link key={l.to} to={l.to} className="block text-sm text-background/60 hover:text-primary transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Services</h4>
            <div className="space-y-2 text-sm text-background/60">
              <p>Dental Cleaning</p><p>Root Canal</p><p>Teeth Whitening</p><p>Dental Implants</p><p>Braces & Aligners</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3 text-sm text-background/60">
              <a href={`tel:${CLINIC_CONFIG.phone}`} className="flex items-start gap-2 hover:text-primary transition-colors">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />{CLINIC_CONFIG.phone}
              </a>
              <a href={`mailto:${CLINIC_CONFIG.email}`} className="flex items-start gap-2 hover:text-primary transition-colors">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />{CLINIC_CONFIG.email}
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />{CLINIC_CONFIG.address}
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />{CLINIC_CONFIG.workingDays}, {CLINIC_CONFIG.openingTime} – {CLINIC_CONFIG.closingTime}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 mt-10 pt-6 text-center text-xs text-background/40">
          © {new Date().getFullYear()} {CLINIC_CONFIG.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
