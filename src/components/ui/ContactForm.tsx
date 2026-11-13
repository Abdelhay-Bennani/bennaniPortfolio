"use client";

import { useState, type FormEvent } from "react";
import { Check, Mail } from "lucide-react";
import { useLocale } from "@/i18n/LocaleProvider";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "./Icons";

export default function ContactForm() {
  const { t, locale } = useLocale();
  const form = t.contact.form;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [services, setServices] = useState<number[]>([]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const toggleService = (index: number) =>
    setServices((current) =>
      current.includes(index)
        ? current.filter((i) => i !== index)
        : [...current, index].sort((a, b) => a - b),
    );

  const body = () => {
    const details = [
      `${form.name}: ${name}`,
      `${form.email}: ${email}`,
      phone && `${form.phone}: ${phone}`,
      company && `${form.company}: ${company}`,
      services.length > 0 &&
        `${form.services}: ${services.map((i) => form.serviceOptions[i]).join(", ")}`,
    ].filter(Boolean);
    return `${details.join("\n")}\n\n${message}`;
  };

  const sendEmail = async (event: FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          services,
          message,
          website,
          locale,
          subject: form.subject,
        }),
      });
      if (!response.ok) throw new Error("send failed");
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
      setServices([]);
      setMessage("");
    } catch {
      setStatus("error");
    }
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
  const label = "flex flex-col gap-2 text-sm font-medium";

  return (
    <form onSubmit={sendEmail} className="card flex flex-col gap-4 p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          {form.name}
          <input
            className={field}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </label>
        <label className={label}>
          {form.email}
          <input
            className={field}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>
        <label className={label}>
          {form.phone}
          <input
            className={field}
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="+212 6 00 00 00 00"
          />
        </label>
        <label className={label}>
          {form.company}
          <input
            className={field}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            autoComplete="organization"
          />
        </label>
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium">{form.services}</legend>
        <div className="flex flex-wrap gap-2">
          {form.serviceOptions.map((option, index) => {
            const active = services.includes(index);
            return (
              <button
                key={option}
                type="button"
                aria-pressed={active}
                onClick={() => toggleService(index)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition ${
                  active
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-card/70 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                }`}
              >
                {active && <Check size={14} />}
                {option}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className={label}>
        {form.message}
        <textarea
          className={`${field} min-h-36 resize-y`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={form.placeholder}
          required
        />
      </label>
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      {status !== "idle" && status !== "sending" && (
        <p
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm ${status === "success" ? "border-primary text-primary" : "border-red-500/60 text-red-500"}`}
        >
          {status === "success" ? form.success : form.error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn btn-primary disabled:opacity-60"
        >
          <Mail size={16} /> {status === "sending" ? form.sending : form.send}
        </button>
        <button type="button" onClick={sendWhatsApp} className="btn btn-outline">
          <WhatsAppIcon className="h-4 w-4" /> {form.whatsapp}
        </button>
      </div>
    </form>
  );
}
