import { MessageCircle } from 'lucide-react';
import { CLINIC_CONFIG } from '@/lib/clinic-config';

export function FloatingCTA() {
  const whatsappUrl = `https://wa.me/${CLINIC_CONFIG.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hi! I would like to book an appointment at SmileCare Dental Clinic.')}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[hsl(142,70%,45%)] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] group"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-medium hidden sm:inline">Book via WhatsApp</span>
    </a>
  );
}
