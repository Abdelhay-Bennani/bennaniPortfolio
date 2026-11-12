"use client";

import { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

export default function ContactForm() {
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const body = () =>
    `${t.contact.form.name}: ${name}\n${t.contact.form.email}: ${email}\n\n${message}`;

  const sendEmail = (event: FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(t.contact.form.subject);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${encodeURIComponent(body())}`;
  };

  const sendWhatsApp = () => {
    window.open(
      `${site.whatsapp}?text=${encodeURIComponent(body())}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const field =
    "w-full rounded-xl border border-border bg-card/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 transition focus:border-primary focus:outline-none";

  return (
    <form onSubmit={sendEmail} className="card flex flex-col gap-4 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          {t.contact.form.name}
          <input
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          {t.contact.form.email}
          <input
            className={field}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
      </div>
      <label className="flex flex-col gap-2 text-sm font-medium">
        {t.contact.form.message}
        <textarea
          className={`${field} min-h-36 resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.contact.form.placeholder}
          required
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn btn-primary">
          <Mail size={16} /> {t.contact.form.send}
        </button>
        <button
          type="button"
          onClick={sendWhatsApp}
          className="btn btn-outline"
        >
          <WhatsAppIcon className="h-4 w-4" /> {t.contact.form.whatsapp}
        </button>
      </div>
    </form>
  );
}
