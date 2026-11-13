import fr from "@/i18n/messages/fr";
import { renderContactEmail, renderContactText } from "@/lib/email/contact-template";
import { site } from "@/lib/site";

const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Champ piege anti-spam : un humain ne le remplit jamais.
  if (typeof data.website === "string" && data.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const phone = clean(data.phone, 40);
  const company = clean(data.company, 150);
  const message = clean(data.message, 5000);
  const subject = clean(data.subject || "Nouveau message via le portfolio", 150);

  // Les services arrivent sous forme d'index : on les traduit en francais
  // pour que l'email reste lisible quelle que soit la langue du visiteur.
  const options = fr.contact.form.serviceOptions;
  const services = Array.isArray(data.services)
    ? [...new Set(data.services)]
        .filter((i): i is number => Number.isInteger(i) && i >= 0 && i < options.length)
        .map((i) => options[i])
    : [];

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const mail = {
    name,
    email,
    phone,
    company,
    services,
    message,
    locale: clean(data.locale, 5),
  };
  const fullSubject = `${subject} - ${name}${company ? ` (${company})` : ""}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO ?? site.email],
      reply_to: email,
      subject: fullSubject,
      text: renderContactText(mail),
      html: renderContactEmail(mail, fullSubject),
    }),
  });

  if (!response.ok) {
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
