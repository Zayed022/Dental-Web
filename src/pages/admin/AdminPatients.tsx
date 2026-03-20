import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, Phone, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function AdminPatients() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [treatments, setTreatments] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchPatients = async () => {
    const { data } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
    setPatients(data || []);
  };

  useEffect(() => { fetchPatients(); }, []);

  const viewPatient = async (patient: any) => {
    setSelectedPatient(patient);
    const [t, a] = await Promise.all([
      supabase.from('treatment_records').select('*, doctors(name)').eq('patient_id', patient.id).order('created_at', { ascending: false }),
      supabase.from('appointments').select('*, doctors(name), services(name)').eq('patient_id', patient.id).order('appointment_date', { ascending: false }),
    ]);
    setTreatments(t.data || []);
    setAppointments(a.data || []);
  };

  const filtered = patients.filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Patients</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} patients</p>
        </div>

        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-card rounded-xl border border-border/60 p-5 hover:shadow-md transition-shadow cursor-pointer" onClick={() => viewPatient(p)}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.gender && `${p.gender} · `}Added {format(new Date(p.created_at), 'dd MMM yyyy')}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{p.phone}</p>
                {p.email && <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{p.email}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Patient Detail Modal */}
        {selectedPatient && (
          <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedPatient.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Phone:</span> <span className="font-medium">{selectedPatient.phone}</span></div>
                  <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selectedPatient.email || '—'}</span></div>
                  <div><span className="text-muted-foreground">Gender:</span> <span className="font-medium capitalize">{selectedPatient.gender || '—'}</span></div>
                  <div><span className="text-muted-foreground">DOB:</span> <span className="font-medium">{selectedPatient.date_of_birth ? format(new Date(selectedPatient.date_of_birth), 'dd MMM yyyy') : '—'}</span></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Address:</span> <span className="font-medium">{selectedPatient.address || '—'}</span></div>
                  {selectedPatient.allergies && <div className="col-span-2"><span className="text-muted-foreground">Allergies:</span> <span className="font-medium text-destructive">{selectedPatient.allergies}</span></div>}
                  {selectedPatient.medical_history && <div className="col-span-2"><span className="text-muted-foreground">Medical History:</span> <span className="font-medium">{selectedPatient.medical_history}</span></div>}
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Appointment History</h3>
                  {appointments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No appointments found</p>
                  ) : (
                    <div className="space-y-2">
                      {appointments.map(a => (
                        <div key={a.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                          <div>
                            <p className="font-medium">{a.services?.name || 'General'}</p>
                            <p className="text-xs text-muted-foreground">{a.doctors?.name} · {format(new Date(a.appointment_date), 'dd MMM yyyy')} at {a.start_time?.slice(0, 5)}</p>
                          </div>
                          <span className="text-xs capitalize px-2 py-0.5 rounded-full bg-card border">{a.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Treatment Records</h3>
                  {treatments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No treatment records found</p>
                  ) : (
                    <div className="space-y-2">
                      {treatments.map(t => (
                        <div key={t.id} className="p-3 bg-muted/50 rounded-lg text-sm">
                          <div className="flex justify-between mb-1">
                            <p className="font-medium">{t.treatment}</p>
                            {t.cost && <span className="font-semibold text-primary">₹{Number(t.cost).toLocaleString('en-IN')}</span>}
                          </div>
                          <p className="text-xs text-muted-foreground">{t.doctors?.name} · {format(new Date(t.created_at), 'dd MMM yyyy')}</p>
                          {t.diagnosis && <p className="text-xs mt-1"><span className="text-muted-foreground">Diagnosis:</span> {t.diagnosis}</p>}
                          {t.prescription && <p className="text-xs mt-1"><span className="text-muted-foreground">Rx:</span> {t.prescription}</p>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
}
