import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const CHART_COLORS = ['hsl(199, 89%, 48%)', 'hsl(166, 72%, 44%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)', 'hsl(215, 20%, 65%)'];

export default function AdminAnalytics() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [revenueEstimate, setRevenueEstimate] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const start = startOfMonth(new Date());
      const end = endOfMonth(new Date());

      // Monthly appointments by day
      const { data: apts } = await supabase.from('appointments')
        .select('appointment_date, status, services(price)')
        .gte('appointment_date', format(start, 'yyyy-MM-dd'))
        .lte('appointment_date', format(end, 'yyyy-MM-dd'));

      if (apts) {
        const days = eachDayOfInterval({ start, end: new Date() > end ? end : new Date() });
        const byDay = days.map(d => {
          const dateStr = format(d, 'yyyy-MM-dd');
          const dayApts = apts.filter(a => a.appointment_date === dateStr);
          return {
            date: format(d, 'dd MMM'),
            appointments: dayApts.length,
            completed: dayApts.filter(a => a.status === 'completed').length,
          };
        });
        setMonthlyData(byDay);

        // Status breakdown
        const statusCounts: Record<string, number> = {};
        apts.forEach(a => { statusCounts[a.status] = (statusCounts[a.status] || 0) + 1; });
        setStatusData(Object.entries(statusCounts).map(([name, value]) => ({ name, value })));

        // Revenue
        const completedApts = apts.filter(a => a.status === 'completed');
        const revenue = completedApts.reduce((sum, a) => sum + (Number((a as any).services?.price) || 0), 0);
        setRevenueEstimate(revenue);

        setTotalBookings(apts.length);
        setCompletionRate(apts.length > 0 ? Math.round((completedApts.length / apts.length) * 100) : 0);
      }
    };
    loadData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">This month's performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Bookings', value: totalBookings },
            { label: 'Revenue Estimate', value: `₹${revenueEstimate.toLocaleString('en-IN')}` },
            { label: 'Completion Rate', value: `${completionRate}%` },
          ].map((s, i) => (
            <ScrollReveal key={i} delay={i * 60}>
              <div className="bg-card rounded-xl border border-border/60 p-5">
                <p className="text-sm text-muted-foreground mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ScrollReveal className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border/60 p-5">
              <h2 className="font-semibold text-foreground mb-4">Daily Appointments</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="appointments" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} name="Total" />
                  <Bar dataKey="completed" fill="hsl(166, 72%, 44%)" radius={[4, 4, 0, 0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="bg-card rounded-xl border border-border/60 p-5">
              <h2 className="font-semibold text-foreground mb-4">Status Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {statusData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </AdminLayout>
  );
}
