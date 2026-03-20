import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminDoctors() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [editDoctor, setEditDoctor] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const fetchDoctors = async () => {
    const { data } = await supabase.from('doctors').select('*').order('created_at');
    setDoctors(data || []);
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name') as string,
      specialization: form.get('specialization') as string,
      qualification: form.get('qualification') as string,
      bio: form.get('bio') as string,
      phone: form.get('phone') as string,
      email: form.get('email') as string,
    };

    if (editDoctor) {
      await supabase.from('doctors').update(data).eq('id', editDoctor.id);
      toast({ title: 'Doctor updated' });
    } else {
      await supabase.from('doctors').insert(data);
      toast({ title: 'Doctor added' });
    }
    setShowForm(false);
    setEditDoctor(null);
    fetchDoctors();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('doctors').update({ is_active: false }).eq('id', id);
    toast({ title: 'Doctor deactivated' });
    fetchDoctors();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Doctors</h1>
            <p className="text-sm text-muted-foreground">{doctors.length} doctors</p>
          </div>
          <Button onClick={() => { setEditDoctor(null); setShowForm(true); }}><Plus className="w-4 h-4 mr-2" />Add Doctor</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map(d => (
            <div key={d.id} className={`bg-card rounded-xl border border-border/60 p-5 ${!d.is_active ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="font-bold text-primary">{d.name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{d.name}</p>
                    <p className="text-sm text-primary">{d.specialization}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => { setEditDoctor(d); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(d.id)} className="text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{d.qualification}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{d.bio}</p>
            </div>
          ))}
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editDoctor ? 'Edit Doctor' : 'Add Doctor'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <Input name="name" placeholder="Full Name" defaultValue={editDoctor?.name || ''} required />
              <Input name="specialization" placeholder="Specialization" defaultValue={editDoctor?.specialization || ''} />
              <Input name="qualification" placeholder="Qualification" defaultValue={editDoctor?.qualification || ''} />
              <Input name="phone" placeholder="Phone" defaultValue={editDoctor?.phone || ''} />
              <Input name="email" placeholder="Email" defaultValue={editDoctor?.email || ''} />
              <Textarea name="bio" placeholder="Short bio..." defaultValue={editDoctor?.bio || ''} rows={3} />
              <Button type="submit" className="w-full">{editDoctor ? 'Update' : 'Add'} Doctor</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
