import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from('clinic_settings').select('*').limit(1).single().then(({ data }) => setSettings(data));
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!settings) return;
    setLoading(true);
    const form = new FormData(e.currentTarget);
    const { error } = await supabase.from('clinic_settings').update({
      clinic_name: form.get('clinic_name') as string,
      tagline: form.get('tagline') as string,
      phone: form.get('phone') as string,
      email: form.get('email') as string,
      address: form.get('address') as string,
      whatsapp_number: form.get('whatsapp_number') as string,
      google_review_link: form.get('google_review_link') as string,
    }).eq('id', settings.id);
    setLoading(false);
    if (error) toast({ title: 'Error saving', variant: 'destructive' });
    else toast({ title: 'Settings saved!' });
  };

  if (!settings) return <AdminLayout><div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clinic Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your clinic's information</p>
        </div>

        <form onSubmit={handleSave} className="bg-card rounded-xl border border-border/60 p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Clinic Name</label>
            <Input name="clinic_name" defaultValue={settings.clinic_name} required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Tagline</label>
            <Input name="tagline" defaultValue={settings.tagline} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Phone</label>
              <Input name="phone" defaultValue={settings.phone} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
              <Input name="email" defaultValue={settings.email} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Address</label>
            <Textarea name="address" defaultValue={settings.address} rows={2} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">WhatsApp Number</label>
            <Input name="whatsapp_number" defaultValue={settings.whatsapp_number} />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Google Review Link</label>
            <Input name="google_review_link" defaultValue={settings.google_review_link} />
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Settings'}</Button>
        </form>
      </div>
    </AdminLayout>
  );
}
