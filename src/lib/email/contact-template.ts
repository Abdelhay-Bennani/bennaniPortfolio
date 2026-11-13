import { site } from "@/lib/site";

export type ContactEmailData = {
  name: string;
  email: string;
  phone: string;
  company: string;
  services: string[];
  message: string;
  locale?: string;
};

const GOLD = "#d4af37";
const GOLD_SOFT = "#f1d77a";
const INK = "#0a0805";
const PAPER = "#f7f1e1";
const CARD = "#ffffff";
const LINE = "#ece3c8";
const MUTED = "#7a7059";
const TEXT = "#14110a";
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Numero au format international pour wa.me (ex. 0612... -> 212612...). */
const whatsappNumber = (phone: string) => {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.length === 10 && digits.startsWith("0")) digits = `212${digits.slice(1)}`;
  return digits.length >= 8 ? digits : "";
};

const languageLabel: Record<string, string> = {
  fr: "Français",
  en: "Anglais",
  ar: "Arabe",
};

const button = (href: string, label: string, primary: boolean) => `
  <td style="padding:4px;">
    <a href="${escapeHtml(href)}" target="_blank"
      style="display:inline-block;padding:12px 22px;border-radius:999px;font-family:${FONT};font-size:14px;font-weight:600;text-decoration:none;${
        primary
          ? `background:${GOLD};color:${INK};border:1px solid ${GOLD};`
          : `background:${CARD};color:${TEXT};border:1px solid ${LINE};`
      }">${label}</a>
  </td>`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:12px 0;border-bottom:1px solid ${LINE};font-family:${FONT};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};width:130px;vertical-align:top;">${label}</td>
    <td style="padding:12px 0;border-bottom:1px solid ${LINE};font-family:${FONT};font-size:15px;color:${TEXT};vertical-align:top;">${value}</td>
  </tr>`;

export function renderContactEmail(data: ContactEmailData, subject: string) {
  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const phone = escapeHtml(data.phone);
  const company = escapeHtml(data.company);
  const wa = data.phone ? whatsappNumber(data.phone) : "";
  const initial = escapeHtml(data.name.charAt(0).toUpperCase() || "?");
  const date = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Africa/Casablanca",
  }).format(new Date());

  const rows = [
    row("Email", `<a href="mailto:${email}" style="color:${TEXT};text-decoration:underline;">${email}</a>`),
    data.phone &&
      row("Téléphone", `<a href="tel:${escapeHtml(data.phone.replace(/[^\d+]/g, ""))}" style="color:${TEXT};text-decoration:underline;">${phone}</a>`),
    data.locale && languageLabel[data.locale] && row("Langue", languageLabel[data.locale]),
  ]
    .filter(Boolean)
    .join("");

  const services = data.services.length
    ? `
      <tr><td style="padding:28px 32px 0;">
        <p style="margin:0 0 12px;font-family:${FONT};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Services souhaités</p>
        ${data.services
          .map(
            (s) =>
              `<span style="display:inline-block;margin:0 6px 8px 0;padding:7px 14px;border-radius:999px;background:#fbf3d6;border:1px solid ${GOLD};font-family:${FONT};font-size:13px;font-weight:600;color:#6b520b;">${escapeHtml(s)}</span>`,
          )
          .join("")}
      </td></tr>`
    : "";

  const replySubject = encodeURIComponent(`Re: ${subject}`);
  const buttons = [
    button(`mailto:${data.email}?subject=${replySubject}`, "Répondre par email", true),
    wa && button(`https://wa.me/${wa}`, "WhatsApp", false),
    data.phone && button(`tel:${data.phone.replace(/[^\d+]/g, "")}`, "Appeler", false),
  ]
    .filter(Boolean)
    .join("");

  const preheader = `${data.name}${data.company ? ` (${data.company})` : ""} : ${data.message.slice(0, 90)}`;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};">
  <tr><td align="center" style="padding:32px 12px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${CARD};border-radius:20px;overflow:hidden;border:1px solid ${LINE};">

      <!-- En-tete -->
      <tr><td style="background:${INK};padding:28px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font-family:${FONT};font-size:18px;font-weight:700;color:${GOLD};letter-spacing:.02em;">${escapeHtml(site.name)}</td>
          <td align="right" style="font-family:${FONT};font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:${GOLD_SOFT};">Portfolio</td>
        </tr></table>
        <p style="margin:22px 0 4px;font-family:${FONT};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${GOLD_SOFT};">Nouvelle demande</p>
        <h1 style="margin:0;font-family:${FONT};font-size:26px;line-height:1.25;font-weight:700;color:#faf6ea;">Un nouveau projet vous attend</h1>
      </td></tr>
      <tr><td style="height:4px;background:${GOLD};background-image:linear-gradient(90deg,${GOLD},${GOLD_SOFT},${GOLD});font-size:0;line-height:0;">&nbsp;</td></tr>

      <!-- Contact -->
      <tr><td style="padding:28px 32px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="width:52px;height:52px;border-radius:50%;background:${INK};color:${GOLD};font-family:${FONT};font-size:22px;font-weight:700;text-align:center;vertical-align:middle;">${initial}</td>
          <td style="padding-left:14px;">
            <p style="margin:0;font-family:${FONT};font-size:19px;font-weight:700;color:${TEXT};">${name}</p>
            <p style="margin:2px 0 0;font-family:${FONT};font-size:13px;color:${MUTED};">${data.company ? company : "Particulier"}</p>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="padding:16px 32px 0;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td></tr>

      ${services}

      <!-- Projet -->
      <tr><td style="padding:28px 32px 0;">
        <p style="margin:0 0 12px;font-family:${FONT};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${MUTED};">Le projet</p>
        <div style="padding:18px 20px;border-left:4px solid ${GOLD};background:#fcf8ec;border-radius:0 12px 12px 0;font-family:${FONT};font-size:15px;line-height:1.65;color:${TEXT};white-space:pre-wrap;">${escapeHtml(data.message)}</div>
      </td></tr>

      <!-- Actions -->
      <tr><td style="padding:28px 28px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>${buttons}</tr></table>
      </td></tr>

      <!-- Pied -->
      <tr><td style="padding:18px 32px;background:#faf6ea;border-top:1px solid ${LINE};font-family:${FONT};font-size:12px;line-height:1.6;color:${MUTED};">
        Reçu le ${date} via le formulaire de
        <a href="${site.url}" style="color:#8a6a12;text-decoration:none;font-weight:600;">${site.url.replace(/^https?:\/\//, "")}</a>.<br>
        Répondez directement à cet email pour écrire à ${name}.
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

export function renderContactText(data: ContactEmailData) {
  const lines = [
    "NOUVELLE DEMANDE DE PROJET",
    "",
    `Nom : ${data.name}`,
    `Email : ${data.email}`,
    data.phone ? `Téléphone : ${data.phone}` : null,
    data.company ? `Entreprise : ${data.company}` : null,
    data.services.length > 0 ? `Services : ${data.services.join(", ")}` : null,
    "",
    "Projet :",
    data.message,
  ];
  return lines.filter((l) => l !== null).join("\n");
}
