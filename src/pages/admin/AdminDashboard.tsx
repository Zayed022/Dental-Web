import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Users, TrendingUp, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalPatients: 0, todayAppointments: 0, completedToday: 0, pendingToday: 0 });
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    Promise.all([
      supabase.from('patients').select('id', { count: 'exact', head: true }),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', today),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', today).eq('status', 'completed'),
      supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('appointment_date', today).in('status', ['scheduled', 'confirmed']),
      supabase.from('appointments').select('*, patients(name, phone), doctors(name), services(name)').order('appointment_date', { ascending: false }).limit(10),
    ]).then(([p, ta, c, pe, ra]) => {
      setStats({
        totalPatients: p.count || 0,
        todayAppointments: ta.count || 0,
        completedToday: c.count || 0,
        pendingToday: pe.count || 0,
      });
      setRecentAppointments(ra.data || []);
    });
  }, []);

  const statCards = [
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, color: 'text-primary bg-primary/10' },
    { label: "Today's Appointments", value: stats.todayAppointments, icon: Calendar, color: 'text-accent bg-accent/10' },
    { label: 'Completed Today', value: stats.completedToday, icon: CheckCircle2, color: 'text-success bg-success/10' },
    { label: 'Pending Today', value: stats.pendingToday, icon: Clock, color: 'text-warning bg-warning/10' },
  ];

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
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your clinic today</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="bg-card rounded-xl border border-border/60 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.color}`}>
                    <s.icon className="w-4.5 h-4.5" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-border/60">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold text-foreground">Recent Appointments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 font-medium text-muted-foreground">Patient</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Doctor</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Service</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Date</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Time</th>
                  <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAppointments.map(a => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium text-foreground">{a.patients?.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{a.doctors?.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{a.services?.name}</td>
                    <td className="px-5 py-3 text-muted-foreground">{format(new Date(a.appointment_date), 'dd MMM yyyy')}</td>
                    <td className="px-5 py-3 text-muted-foreground">{a.start_time?.slice(0, 5)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[a.status] || ''}`}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentAppointments.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No appointments yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
