import { supabase } from '@/integrations/supabase/client';

const CLINIC_PHONE = '917498881947';

/**
 * Send WhatsApp message via Meta Cloud API (edge function)
 */
export async function sendWhatsAppMessage(params: {
  to: string;
  message?: string;
  template_name?: string;
  template_params?: string[];
  notification_id?: string;
}) {
  const { data, error } = await supabase.functions.invoke('send-whatsapp', {
    body: params,
  });
  return { data, error };
}

/**
 * Send booking confirmation via WhatsApp
 */
export async function sendBookingConfirmation(appointment: {
  id: string;
  patient_id: string;
  patientName: string;
  patientPhone: string;
  serviceName: string;
  doctorName: string;
  doctorPhone?: string;
  date: string;
  time: string;
}) {
  const patientMessage = `✅ Appointment Confirmed!\n\nHi ${appointment.patientName}, your appointment has been booked:\n\n📋 Service: ${appointment.serviceName}\n👨‍⚕️ Doctor: Dr. ${appointment.doctorName}\n📅 Date: ${appointment.date}\n🕐 Time: ${appointment.time}\n\nPlease arrive 10 minutes early. Reply CANCEL to cancel.\n\n- SmileCare Dental Clinic`;

  const doctorMessage = `📋 New Appointment Booked\n\nHi Dr. ${appointment.doctorName}, a new appointment has been scheduled:\n\n👤 Patient: ${appointment.patientName}\n📋 Service: ${appointment.serviceName}\n📅 Date: ${appointment.date}\n🕐 Time: ${appointment.time}\n\n- SmileCare Dental Clinic`;

  // Log & send patient notification
  const { data: patientNotif } = await supabase.from('notification_log').insert({
    appointment_id: appointment.id,
    patient_id: appointment.patient_id,
    type: 'whatsapp',
    purpose: 'confirmation',
    message: patientMessage,
    status: 'pending',
  }).select('id').single();

  const patientResult = sendWhatsAppMessage({
    to: appointment.patientPhone,
    message: patientMessage,
    notification_id: patientNotif?.id,
  });

  // Send doctor notification if phone available
  let doctorResult: Promise<any> | undefined;
  if (appointment.doctorPhone) {
    const { data: doctorNotif } = await supabase.from('notification_log').insert({
      appointment_id: appointment.id,
      patient_id: appointment.patient_id,
      type: 'whatsapp',
      purpose: 'doctor_notification',
      message: doctorMessage,
      status: 'pending',
    }).select('id').single();

    doctorResult = sendWhatsAppMessage({
      to: appointment.doctorPhone,
      message: doctorMessage,
      notification_id: doctorNotif?.id,
    });
  }

  const results = await Promise.all([patientResult, ...(doctorResult ? [doctorResult] : [])]);
  return results[0];
}

/**
 * Send Google review request via WhatsApp
 */
export async function sendReviewRequest(params: {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  googleReviewLink: string;
}) {
  const message = `Hi ${params.patientName}! 😊\n\nThank you for visiting SmileCare Dental Clinic. We hope you had a great experience!\n\nWould you mind leaving us a quick review? It really helps us serve you better:\n\n⭐ ${params.googleReviewLink}\n\nThank you!\n- SmileCare Dental`;

  const { data: notif } = await supabase.from('notification_log').insert({
    appointment_id: params.appointmentId,
    patient_id: params.patientId,
    type: 'whatsapp',
    purpose: 'review_request',
    message,
    status: 'pending',
  }).select('id').single();

  return sendWhatsAppMessage({
    to: params.patientPhone,
    message,
    notification_id: notif?.id,
  });
}

/**
 * Generate wa.me click-to-chat link (manual fallback)
 */
export function getWhatsAppChatLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
}

/**
 * Generate click-to-chat link from clinic number
 */
export function getClinicWhatsAppLink(message: string): string {
  return getWhatsAppChatLink(CLINIC_PHONE, message);
}
