
-- Clinic configuration table (multi-tenant ready)
CREATE TABLE public.clinic_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_name TEXT NOT NULL DEFAULT 'SmileCare Dental Clinic',
  tagline TEXT DEFAULT 'Your Smile, Our Priority',
  phone TEXT DEFAULT '+91 7498881947',
  email TEXT DEFAULT 'info@smilecare.in',
  address TEXT DEFAULT '302, Crystal Plaza, Andheri West, Mumbai 400053',
  logo_url TEXT,
  primary_color TEXT DEFAULT '#0ea5e9',
  google_review_link TEXT DEFAULT 'https://g.page/smilecare-mumbai/review',
  whatsapp_number TEXT DEFAULT '+919876543210',
  opening_time TIME DEFAULT '09:00',
  closing_time TIME DEFAULT '20:00',
  slot_duration_minutes INT DEFAULT 30,
  working_days INT[] DEFAULT ARRAY[1,2,3,4,5,6],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read clinic settings" ON public.clinic_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update clinic settings" ON public.clinic_settings FOR UPDATE TO authenticated USING (true);

-- Insert default clinic data
INSERT INTO public.clinic_settings (clinic_name) VALUES ('SmileCare Dental Clinic');

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 30,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Doctors table
CREATE TABLE public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  specialization TEXT,
  qualification TEXT,
  bio TEXT,
  photo_url TEXT,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage doctors" ON public.doctors FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Doctor availability (weekly schedule)
CREATE TABLE public.doctor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  UNIQUE(doctor_id, day_of_week)
);
ALTER TABLE public.doctor_availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read availability" ON public.doctor_availability FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage availability" ON public.doctor_availability FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  address TEXT,
  medical_history TEXT,
  allergies TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read patients" ON public.patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can manage patients" ON public.patients FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update patients" ON public.patients FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Public can create patients via booking" ON public.patients FOR INSERT WITH CHECK (true);

-- Appointments table
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  review_request_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read appointments" ON public.appointments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create appointments" ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete appointments" ON public.appointments FOR DELETE TO authenticated USING (true);

-- Treatment records
CREATE TABLE public.treatment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  diagnosis TEXT,
  treatment TEXT NOT NULL,
  prescription TEXT,
  notes TEXT,
  cost DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.treatment_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read treatment records" ON public.treatment_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can manage treatment records" ON public.treatment_records FOR ALL TO authenticated USING (true) WITH CHECK (true);

DROP POLICY "Public can create patients via booking" ON public.patients;

CREATE POLICY "Public can create patients via booking"
ON public.patients
FOR INSERT
TO anon
WITH CHECK (true);
-- Patient files (prescriptions, x-rays, etc.)


CREATE TABLE public.patient_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  treatment_id UUID REFERENCES public.treatment_records(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read files" ON public.patient_files FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can manage files" ON public.patient_files FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Notification log
CREATE TABLE public.notification_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('sms', 'whatsapp', 'email')),
  purpose TEXT NOT NULL CHECK (purpose IN ('confirmation', 'reminder', 'follow_up', 'review_request')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered')),
  message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read notifications" ON public.notification_log FOR SELECT TO authenticated USING (true);
CREATE POLICY "System can create notifications" ON public.notification_log FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update notifications" ON public.notification_log FOR UPDATE TO authenticated USING (true);

-- Lead capture
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  message TEXT,
  source TEXT DEFAULT 'website',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read leads" ON public.leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can update leads" ON public.leads FOR UPDATE TO authenticated USING (true);

-- User roles for admin
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'receptionist');
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_clinic_settings_updated_at BEFORE UPDATE ON public.clinic_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy data
INSERT INTO public.services (name, description, duration_minutes, price, category, sort_order) VALUES
  ('Dental Cleaning', 'Professional teeth cleaning and polishing', 30, 1500, 'Preventive', 1),
  ('Root Canal Treatment', 'Endodontic treatment for infected teeth', 60, 8000, 'Restorative', 2),
  ('Dental Filling', 'Composite or amalgam filling for cavities', 30, 2000, 'Restorative', 3),
  ('Teeth Whitening', 'Professional in-office teeth whitening', 45, 5000, 'Cosmetic', 4),
  ('Dental Crown', 'Porcelain or ceramic crown placement', 45, 6000, 'Restorative', 5),
  ('Braces Consultation', 'Orthodontic evaluation and treatment planning', 30, 500, 'Orthodontics', 6),
  ('Wisdom Tooth Extraction', 'Surgical or simple extraction of wisdom teeth', 45, 4000, 'Surgical', 7),
  ('Dental Implant', 'Single tooth implant placement', 90, 25000, 'Surgical', 8),
  ('Veneer Placement', 'Porcelain veneer for cosmetic improvement', 60, 12000, 'Cosmetic', 9),
  ('Gum Treatment', 'Periodontal scaling and root planing', 45, 3000, 'Preventive', 10);

INSERT INTO public.doctors (name, specialization, qualification, bio, phone, email) VALUES
  ('Dr. Priya Sharma', 'General Dentistry', 'BDS, MDS (Conservative Dentistry)', 'With over 12 years of experience, Dr. Priya specializes in restorative dentistry and is passionate about creating beautiful smiles.', '+91 98765 11111', 'priya@smilecare.in'),
  ('Dr. Arjun Mehta', 'Orthodontics', 'BDS, MDS (Orthodontics)', 'Dr. Arjun is an expert in braces and aligners with 8 years of clinical experience. He has transformed over 2000 smiles.', '+91 98765 22222', 'arjun@smilecare.in'),
  ('Dr. Neha Patel', 'Oral Surgery', 'BDS, MDS (Oral & Maxillofacial Surgery)', 'Dr. Neha specializes in implants and surgical extractions. Her gentle approach puts even anxious patients at ease.', '+91 98765 33333', 'neha@smilecare.in');

-- Insert availability for all doctors (Mon-Sat, 9am-8pm)
INSERT INTO public.doctor_availability (doctor_id, day_of_week, start_time, end_time)
SELECT d.id, dow.d, '09:00'::TIME, '20:00'::TIME
FROM public.doctors d
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6)) AS dow(d);

-- Insert sample patients
INSERT INTO public.patients (name, phone, email, gender, date_of_birth, address) VALUES
  ('Rahul Verma', '+91 99887 76655', 'rahul.v@gmail.com', 'male', '1990-03-15', 'Bandra West, Mumbai'),
  ('Sneha Iyer', '+91 88776 65544', 'sneha.i@gmail.com', 'female', '1985-07-22', 'Juhu, Mumbai'),
  ('Amit Kulkarni', '+91 77665 54433', 'amit.k@yahoo.com', 'male', '1978-11-08', 'Andheri East, Mumbai'),
  ('Pooja Desai', '+91 66554 43322', 'pooja.d@hotmail.com', 'female', '1995-01-30', 'Powai, Mumbai'),
  ('Vikram Singh', '+91 55443 32211', 'vikram.s@gmail.com', 'male', '1982-09-14', 'Goregaon West, Mumbai');

-- Insert sample appointments
INSERT INTO public.appointments (patient_id, doctor_id, service_id, appointment_date, start_time, end_time, status)
SELECT
  p.id, d.id, s.id,
  CURRENT_DATE + (row_number() OVER ())::int,
  '10:00'::TIME, '10:30'::TIME, 'scheduled'
FROM public.patients p
CROSS JOIN LATERAL (SELECT id FROM public.doctors ORDER BY random() LIMIT 1) d
CROSS JOIN LATERAL (SELECT id FROM public.services ORDER BY random() LIMIT 1) s
LIMIT 5;

-- Storage bucket for patient files
INSERT INTO storage.buckets (id, name, public) VALUES ('patient-files', 'patient-files', false);
CREATE POLICY "Authenticated can upload patient files" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'patient-files');
CREATE POLICY "Authenticated can read patient files" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'patient-files');
CREATE POLICY "Authenticated can delete patient files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'patient-files');
