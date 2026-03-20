import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Search, Filter, CheckCircle2, XCircle, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CLINIC_CONFIG } from '@/lib/clinic-config';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  const fetchAppointments = async () => {
    let q = supabase.from('appointments').select('*, patients(name, phone), doctors(name), services(name, price)').order('appointment_date', { ascending: false });
    if (statusFilter !== 'all') q = q.eq('status', statusFilter as any);
    const { data } = await q;
    setAppointments(data || []);
  };

  useEffect(() => { fetchAppointments(); }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    toast({ title: `Appointment ${status}` });
    fetchAppointments();
  };

  const triggerReviewRequest = async (apt: any) => {
    await supabase.from('notification_log').insert({
      appointment_id: apt.id,
      patient_id: apt.patient_id,
      type: 'whatsapp',
      purpose: 'review_request',
      message: `Hi ${apt.patients?.name}! Thank you for visiting SmileCare. We'd love your feedback! Please leave us a review: ${CLINIC_CONFIG.googleReviewLink}`,
      status: 'pending',
    });
    await supabase.from('appointments').update({ review_request_sent: true }).eq('id', apt.id);
    toast({ title: 'Review request sent!' });
    fetchAppointments();
  };

  const filtered = appointments.filter(a =>
    !search || a.patients?.name?.toLowerCase().includes(search.toLowerCase()) || a.patients?.phone?.includes(search)
  );

  const statusColors: Record<string, string> = {
    scheduled: 'bg-secondary text-secondary-foreground',
    confirmed: 'bg-primary/10 text-primary',
    completed: 'bg-success/10 text-success',
    cancelled: 'bg-destructive/10 text-destructive',
    no_show: 'bg-warning/10 text-warning',
    in_progress: 'bg-accent/10 text-accent',
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Appointments</h1>
            <p className="text-sm text-muted-foreground">{filtered.length} appointments</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by patient name or phone..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]"><Filter className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-card rounded-xl border border-border/60 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">Patient</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Service</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Doctor</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Time</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{a.patients?.name}</p>
                    <p className="text-xs text-muted-foreground">{a.patients?.phone}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{a.services?.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{a.doctors?.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{format(new Date(a.appointment_date), 'dd MMM yyyy')}</td>
                  <td className="px-5 py-3 text-muted-foreground">{a.start_time?.slice(0, 5)}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[a.status]}`}>{a.status.replace('_', ' ')}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      {a.status === 'scheduled' && (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, 'confirmed')} className="text-primary h-7 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Confirm</Button>
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, 'cancelled')} className="text-destructive h-7 text-xs"><XCircle className="w-3 h-3 mr-1" />Cancel</Button>
                        </>
                      )}
                      {(a.status === 'confirmed' || a.status === 'in_progress') && (
                        <Button size="sm" variant="ghost" onClick={() => updateStatus(a.id, 'completed')} className="text-success h-7 text-xs"><CheckCircle2 className="w-3 h-3 mr-1" />Complete</Button>
                      )}
                      {a.status === 'completed' && !a.review_request_sent && (
                        <Button size="sm" variant="ghost" onClick={() => triggerReviewRequest(a)} className="text-warning h-7 text-xs"><Star className="w-3 h-3 mr-1" />Request Review</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">No appointments found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
