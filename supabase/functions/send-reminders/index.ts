import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get tomorrow's date in IST (UTC+5:30)
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);
    const tomorrow = new Date(istNow);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    // Find appointments for tomorrow that haven't been reminded
    const { data: appointments, error } = await supabase
      .from("appointments")
      .select("*, patients(name, phone), doctors(name), services(name)")
      .eq("appointment_date", tomorrowStr)
      .eq("reminder_sent", false)
      .in("status", ["scheduled", "confirmed"]);

    if (error) throw error;

    const results: { id: string; status: string }[] = [];

    for (const apt of appointments || []) {
      if (!apt.patients?.phone) continue;

      const message = `Hi ${apt.patients.name}! This is a reminder for your appointment tomorrow at ${apt.start_time?.slice(0, 5)} with Dr. ${apt.doctors?.name} for ${apt.services?.name}. Please reply YES to confirm or call us to reschedule. - SmileCare Dental`;

      // Log the notification
      const { data: notif } = await supabase
        .from("notification_log")
        .insert({
          appointment_id: apt.id,
          patient_id: apt.patient_id,
          type: "whatsapp",
          purpose: "reminder",
          message,
          status: "pending",
        })
        .select("id")
        .single();

      // Send via WhatsApp edge function
      try {
        const whatsappResponse = await fetch(
          `${supabaseUrl}/functions/v1/send-whatsapp`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              to: apt.patients.phone,
              message,
              notification_id: notif?.id,
            }),
          }
        );

        const whatsappData = await whatsappResponse.json();

        if (whatsappResponse.ok) {
          await supabase
            .from("appointments")
            .update({ reminder_sent: true })
            .eq("id", apt.id);
          results.push({ id: apt.id, status: "sent" });
        } else {
          results.push({ id: apt.id, status: `failed: ${JSON.stringify(whatsappData)}` });
        }
      } catch (e) {
        results.push({ id: apt.id, status: `error: ${e.message}` });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        date: tomorrowStr,
        processed: results.length,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
