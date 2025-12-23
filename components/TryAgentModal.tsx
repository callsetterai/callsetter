"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, Phone, User, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export default function TryAgentModal({ open, onClose }: Props) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const p = normalizePhone(phone);
    return firstName.trim().length >= 1 && isValidEmail(email) && p.length >= 10;
  }, [firstName, email, phone]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setToast(null);
  }, [open]);

  async function onSubmit() {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setToast(null);

    try {
      const payload = {
        firstName: firstName.trim(),
        email: email.trim(),
        phone: normalizePhone(phone),
        source: "try-modal",
        ts: new Date().toISOString(),
      };

      const webhook = process.env.NEXT_PUBLIC_TRY_WEBHOOK_URL;

      if (!webhook) {
        setToast("Saved locally. Add NEXT_PUBLIC_TRY_WEBHOOK_URL to send this to your system.");
        setSubmitting(false);
        return;
      }

      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Webhook failed");

      setToast("Submitted. You should receive a call shortly.");
      setFirstName("");
      setEmail("");
      setPhone("");

      setTimeout(() => onClose(), 900);
    } catch {
      setToast("Something failed. Double check your webhook and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          <button
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-label="Close modal overlay"
            type="button"
          />

          <motion.div
            initial={{ y: 18, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-[520px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0D0A2A]"
          >
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.25),transparent_50%),radial-gradient(circle_at_60%_90%,rgba(99,102,241,0.22),transparent_55%)]" />
            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:18px_18px]" />

            <div className="relative px-6 pb-7 pt-7 sm:px-8">
              <button
                onClick={onClose}
                type="button"
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/30 text-white hover:bg-indigo-600/40"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-center text-3xl font-extrabold tracking-tight text-white">
                See How Fast Your{" "}
                <span className="text-indigo-400">Leads Get Contacted</span>
              </h3>

              <p className="mx-auto mt-3 max-w-[420px] text-center text-sm text-white/70">
                Enter your details and we’ll show you exactly how Call Setter AI responds to new leads in real time.
              </p>

              <div className="mt-8 space-y-5">
                <Field
                  label="First Name"
                  required
                  icon={<User className="h-5 w-5" />}
                  value={firstName}
                  onChange={setFirstName}
                  placeholder="First Name"
                  type="text"
                />

                <Field
                  label="Email"
                  required
                  icon={<Mail className="h-5 w-5" />}
                  value={email}
                  onChange={setEmail}
                  placeholder="Your best email"
                  type="email"
                />

                <Field
                  label="Phone Number"
                  required
                  icon={<Phone className="h-5 w-5" />}
                  value={phone}
                  onChange={setPhone}
                  placeholder="+1 Phone Number"
                  type="tel"
                />

                <button
                  type="button"
                  onClick={onSubmit}
                  disabled={!canSubmit || submitting}
                  className={cn(
                    "mt-2 w-full rounded-xl px-4 py-3 text-sm font-extrabold tracking-wide text-white transition",
                    "bg-indigo-600 hover:bg-indigo-700",
                    (!canSubmit || submitting) && "cursor-not-allowed opacity-60 hover:bg-indigo-600"
                  )}
                >
                  {submitting ? "SUBMITTING..." : "TRY CALL SETTER AI NOW"}
                </button>

                {toast ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
                    {toast}
                  </div>
                ) : null}

                <p className="text-xs leading-5 text-white/60">
                  By submitting, you agree to receive calls and texts from Call Setter AI at the number provided,
                  including messages sent using automated or AI technology. Consent is not required to purchase.
                  Msg and data rates may apply. Reply STOP to opt out.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Field(props: {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type: string;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-white/85">
        {props.label} {props.required ? <span className="text-indigo-300">*</span> : null}
      </div>
      <div className="relative">
        <input
          type={props.type}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-indigo-400/60 focus:bg-white/7"
        />
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300/90">
          {props.icon}
        </div>
      </div>
    </label>
  );
}
