import { useEffect, useState, useRef } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [editService, setEditService] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order');
    setServices(data || []);
  };

  useEffect(() => { fetchServices(); }, []);
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Please select an image file', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image must be under 5MB', variant: 'destructive' });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };
  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from('service-images').upload(fileName, file, { contentType: file.type });
    if (error) {
      toast({ title: 'Image upload failed', description: error.message, variant: 'destructive' });
      return null;
    }
    const { data: urlData } = supabase.storage.from('service-images').getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    const form = new FormData(e.currentTarget);
    let image_url = editService?.image_url || null;
    if (imageFile) {
      const url = await uploadImage(imageFile);
      if (url) image_url = url;
    }
    const data: any = {
      name: form.get('name') as string,
      description: form.get('description') as string,
      duration_minutes: parseInt(form.get('duration') as string),
      price: parseFloat(form.get('price') as string),
      category: form.get('category') as string,
      image_url,
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
    setImageFile(null);
    setImagePreview(null);
    setUploading(false);
    fetchServices();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    await supabase.from('services').update({ is_active: false }).eq('id', id);
    toast({ title: 'Service deactivated' });
    fetchServices();
  };

  const openForm = (service?: any) => {
    setEditService(service || null);
    setImageFile(null);
    setImagePreview(service?.image_url || null);
    setShowForm(true);
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Services</h1>
            <p className="text-sm text-muted-foreground">{services.length} services</p>
          </div>
          <Button onClick={() => openForm()}><Plus className="w-4 h-4 mr-2" />Add Service</Button>
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
                  <div className="flex items-center gap-3">
                      {s.image_url ? (
                        <img src={s.image_url} alt={s.name} className="w-10 h-10 rounded-lg object-cover border border-border/60" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{s.description}</p>
                      </div>
                    </div>
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
                    <Button size="sm" variant="ghost" onClick={() => openForm(s)}><Pencil className="w-3.5 h-3.5" /></Button>
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
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Service Image</label>
                <div
                  className="border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                      <p className="text-xs text-muted-foreground mt-2">Click to change</p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Click to upload an image</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
              </div>
              <Input name="name" placeholder="Service Name" defaultValue={editService?.name || ''} required />
              <Textarea name="description" placeholder="Description" defaultValue={editService?.description || ''} rows={2} />
              <Input name="category" placeholder="Category (e.g. Preventive, Cosmetic)" defaultValue={editService?.category || ''} />
              <div className="grid grid-cols-2 gap-4">
                <Input name="duration" type="number" placeholder="Duration (min)" defaultValue={editService?.duration_minutes || 30} required />
                <Input name="price" type="number" step="0.01" placeholder="Price (₹)" defaultValue={editService?.price || ''} required />
              </div>
              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? 'Saving...' : editService ? 'Update' : 'Add'} Service
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
