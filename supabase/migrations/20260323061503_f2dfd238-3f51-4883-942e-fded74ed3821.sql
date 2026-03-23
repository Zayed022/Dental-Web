-- Add image_url column to services
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url text;

-- Create a public storage bucket for service images
INSERT INTO storage.buckets (id, name, public) VALUES ('service-images', 'service-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read service images
CREATE POLICY "Anyone can read service images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'service-images');

-- Allow authenticated users to upload service images
CREATE POLICY "Authenticated can upload service images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'service-images');

-- Allow authenticated users to update service images
CREATE POLICY "Authenticated can update service images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'service-images');

-- Allow authenticated users to delete service images
CREATE POLICY "Authenticated can delete service images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'service-images');