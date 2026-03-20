import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [editService, setEditService] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const fetch = async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order');
    setServices(data || []);
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get('name') as string,
      description: form.get('description') as string,
      duration_minutes: parseInt(form.get('duration') as string),
      price: parseFloat(form.get('price') as string),
      category: form.get('category') as string,
    };

    if (editService) {
      await supabase.from('services').update(data).eq('id', editService.id);
      toast({ title: 'Service updated' });
    } else {
      await supabase.from('services').insert(data);
      toast({ title: 'Service added' });
    }
    setShowForm(false);
    setEditService(null);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('services').update({ is_active: false }).eq('id', id);
    toast({ title: 'Service deactivated' });
    fetch();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Services</h1>
            <p className="text-sm text-muted-foreground">{services.length} services</p>
          </div>
          <Button onClick={() => { setEditService(null); setShowForm(true); }}><Plus className="w-4 h-4 mr-2" />Add Service</Button>
        </div>

        <div className="bg-card rounded-xl border border-border/60 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 font-medium text-muted-foreground">Service</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Category</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Duration</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Price</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Status</th>
                <th className="px-5 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.id} className={`border-b border-border/50 hover:bg-muted/30 ${!s.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{s.category}</td>
                  <td className="px-5 py-3 text-muted-foreground">{s.duration_minutes} min</td>
                  <td className="px-5 py-3 font-semibold text-foreground">₹{Number(s.price).toLocaleString('en-IN')}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {s.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => { setEditService(s); setShowForm(true); }}><Pencil className="w-3.5 h-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(s.id)} className="text-destructive"><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editService ? 'Edit Service' : 'Add Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <Input name="name" placeholder="Service Name" defaultValue={editService?.name || ''} required />
              <Textarea name="description" placeholder="Description" defaultValue={editService?.description || ''} rows={2} />
              <Input name="category" placeholder="Category (e.g. Preventive, Cosmetic)" defaultValue={editService?.category || ''} />
              <div className="grid grid-cols-2 gap-4">
                <Input name="duration" type="number" placeholder="Duration (min)" defaultValue={editService?.duration_minutes || 30} required />
                <Input name="price" type="number" step="0.01" placeholder="Price (₹)" defaultValue={editService?.price || ''} required />
              </div>
              <Button type="submit" className="w-full">{editService ? 'Update' : 'Add'} Service</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
