import { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/PublicLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, CheckCircle2, Clock, User } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { sendBookingConfirmation } from '@/lib/whatsapp';

type Step = 'service' | 'doctor' | 'datetime' | 'details' | 'confirm';

export default function BookAppointmentPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const [selectedService, setSelectedService] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    supabase.from('services').select('*').eq('is_active', true).order('sort_order').then(({ data }) => data && setServices(data));
    supabase.from('doctors').select('*').eq('is_active', true).then(({ data }) => data && setDoctors(data));
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      supabase.from('appointments').select('start_time, end_time')
        .eq('doctor_id', selectedDoctor)
        .eq('appointment_date', selectedDate)
        .neq('status', 'cancelled')
        .then(({ data }) => data && setExistingAppointments(data));
    }
  }, [selectedDoctor, selectedDate]);

  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));
  const service = services.find(s => s.id === selectedService);
  const duration = service?.duration_minutes || 30;

  const timeSlots = (() => {
    const slots: string[] = [];
    for (let h = 9; h < 20; h++) {
      for (let m = 0; m < 60; m += 30) {
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        const endMinutes = h * 60 + m + duration;
        if (endMinutes <= 20 * 60) {
          const isBooked = existingAppointments.some(a => {
            const aStart = a.start_time.slice(0, 5);
            const aEnd = a.end_time.slice(0, 5);
            const slotEnd = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;
            return time < aEnd && slotEnd > aStart;
          });
          if (!isBooked) slots.push(time);
        }
      }
    }
    return slots;
  })();

  const handleSubmit = async () => {
    if (!patientName || !patientPhone) {
      toast({ title: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }
    setLoading(true);

    // Create or find patient
    const { data: existingPatient } = await supabase.from('patients').select('id').eq('phone', patientPhone).limit(1).single();

    let patientId: string;
    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      const { data: newPatient, error } = await supabase.from('patients').insert({
        name: patientName,
        phone: patientPhone,
        email: patientEmail || null,
      }).select('id').single();
      if (error || !newPatient) {
        toast({ title: 'Error creating patient record', variant: 'destructive' });
        setLoading(false);
        return;
      }
      patientId = newPatient.id;
    }

    const endMinutes = parseInt(selectedTime.split(':')[0]) * 60 + parseInt(selectedTime.split(':')[1]) + duration;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    const { data: aptData, error } = await supabase.from('appointments').insert({
      patient_id: patientId,
      doctor_id: selectedDoctor,
      service_id: selectedService,
      appointment_date: selectedDate,
      start_time: selectedTime,
      end_time: endTime,
      notes: notes || null,
    }).select('id').single();

    setLoading(false);
    if (error) {
      toast({ title: 'Error booking appointment', description: 'Please try again.', variant: 'destructive' });
    } else {
      setConfirmed(true);
      // Send WhatsApp confirmation (fire-and-forget)
      const doctor = doctors.find(d => d.id === selectedDoctor);
      sendBookingConfirmation({
        id: aptData?.id || '',
        patient_id: patientId,
        patientName,
        patientPhone,
        serviceName: service?.name || '',
        doctorName: doctor?.name || '',
        date: format(new Date(selectedDate), 'dd MMM yyyy'),
        time: selectedTime,
      }).catch(console.error);
    }
  };

  if (confirmed) {
    const doctor = doctors.find(d => d.id === selectedDoctor);
    return (
      <PublicLayout>
        <section className="section-padding">
          <div className="container max-w-lg">
            <ScrollReveal>
              <div className="text-center bg-card rounded-2xl border border-border/60 p-10">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-accent" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Appointment Booked!</h1>
                <p className="text-muted-foreground mb-6">We'll send you a confirmation shortly.</p>
                <div className="text-left bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span className="font-medium">{service?.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-medium">{doctor?.name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-medium">{format(new Date(selectedDate), 'dd MMM yyyy')}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-medium">{selectedTime}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Patient</span><span className="font-medium">{patientName}</span></div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </PublicLayout>
    );
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'service', label: 'Service' },
    { key: 'doctor', label: 'Doctor' },
    { key: 'datetime', label: 'Date & Time' },
    { key: 'details', label: 'Your Details' },
  ];

  return (
    <PublicLayout>
      <section className="section-padding bg-gradient-to-br from-dental-50 via-background to-secondary/30">
        <div className="container max-w-2xl">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Book an Appointment</h1>
              <p className="text-muted-foreground">Select your preferred service, doctor, and time</p>
            </div>
          </ScrollReveal>

          {/* Steps indicator */}
          <ScrollReveal delay={80}>
            <div className="flex items-center justify-center gap-2 mb-8">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center">
                  <button
                    onClick={() => {
                      const stepIndex = steps.findIndex(st => st.key === step);
                      if (i <= stepIndex) setStep(s.key);
                    }}
                    className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                      step === s.key ? 'bg-primary text-primary-foreground' :
                      steps.findIndex(st => st.key === step) > i ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {i + 1}
                  </button>
                  {i < steps.length - 1 && <div className="w-8 h-0.5 bg-border mx-1" />}
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="bg-card rounded-xl border border-border/60 p-6 md:p-8">
            {/* Step 1: Service */}
            {step === 'service' && (
              <div className="space-y-3">
                <h2 className="font-semibold text-lg mb-4">Select a Service</h2>
                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s.id); setStep('doctor'); }}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedService === s.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.duration_minutes} min</p>
                      </div>
                      <span className="font-semibold text-primary">₹{Number(s.price).toLocaleString('en-IN')}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Doctor */}
            {step === 'doctor' && (
              <div className="space-y-3">
                <h2 className="font-semibold text-lg mb-4">Choose a Doctor</h2>
                {doctors.map(d => (
                  <button
                    key={d.id}
                    onClick={() => { setSelectedDoctor(d.id); setStep('datetime'); }}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedDoctor === d.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-bold text-primary">{d.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{d.name}</p>
                        <p className="text-sm text-muted-foreground">{d.specialization}</p>
                      </div>
                    </div>
                  </button>
                ))}
                <Button variant="outline" onClick={() => setStep('service')} className="mt-4">Back</Button>
              </div>
            )}

            {/* Step 3: Date & Time */}
            {step === 'datetime' && (
              <div>
                <h2 className="font-semibold text-lg mb-4">Select Date & Time</h2>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Choose a date</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {dates.map(d => {
                      const dateStr = format(d, 'yyyy-MM-dd');
                      const dayOfWeek = d.getDay();
                      if (dayOfWeek === 0) return null; // Skip Sunday
                      return (
                        <button
                          key={dateStr}
                          onClick={() => { setSelectedDate(dateStr); setSelectedTime(''); }}
                          className={`shrink-0 p-3 rounded-lg border text-center min-w-[70px] transition-all ${
                            selectedDate === dateStr ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <p className="text-xs text-muted-foreground">{format(d, 'EEE')}</p>
                          <p className="text-lg font-bold text-foreground">{format(d, 'd')}</p>
                          <p className="text-xs text-muted-foreground">{format(d, 'MMM')}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {selectedDate && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Available time slots</p>
                    {timeSlots.length === 0 ? (
                      <p className="text-sm text-destructive">No slots available for this date.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map(t => (
                          <button
                            key={t}
                            onClick={() => setSelectedTime(t)}
                            className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                              selectedTime === t ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:border-primary/50 text-foreground'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 mt-6">
                  <Button variant="outline" onClick={() => setStep('doctor')}>Back</Button>
                  <Button onClick={() => setStep('details')} disabled={!selectedDate || !selectedTime}>Continue</Button>
                </div>
              </div>
            )}

            {/* Step 4: Details */}
            {step === 'details' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-lg mb-4">Your Details</h2>
                <Input placeholder="Full Name *" value={patientName} onChange={e => setPatientName(e.target.value)} required />
                <Input placeholder="Phone Number *" value={patientPhone} onChange={e => setPatientPhone(e.target.value)} required />
                <Input placeholder="Email (optional)" type="email" value={patientEmail} onChange={e => setPatientEmail(e.target.value)} />
                <Textarea placeholder="Any notes or concerns..." value={notes} onChange={e => setNotes(e.target.value)} rows={3} />

                <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-1">
                  <p><span className="text-muted-foreground">Service:</span> <span className="font-medium">{service?.name}</span></p>
                  <p><span className="text-muted-foreground">Doctor:</span> <span className="font-medium">{doctors.find(d => d.id === selectedDoctor)?.name}</span></p>
                  <p><span className="text-muted-foreground">Date:</span> <span className="font-medium">{format(new Date(selectedDate), 'dd MMM yyyy')}</span></p>
                  <p><span className="text-muted-foreground">Time:</span> <span className="font-medium">{selectedTime}</span></p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep('datetime')}>Back</Button>
                  <Button onClick={handleSubmit} disabled={loading || !patientName || !patientPhone}>
                    {loading ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
