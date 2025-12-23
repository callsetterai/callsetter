"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  Phone,
  ShieldCheck,
  Timer,
  User,
  X,
} from "lucide-react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
      {children}
    </span>
  );
}

function SectionHeader({
  kicker,
  title,
  subtitle,
  dark = false,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center">
      {kicker ? (
        <div className="mb-3 flex justify-center">
          <Pill>{kicker}</Pill>
        </div>
      ) : null}
      <h2 className={cn("text-2xl sm:text-3xl font-bold tracking-tight", dark && "text-white")}>
        {title}
      </h2>
      {subtitle ? (
        <p className={cn("mt-3 text-sm sm:text-base", dark ? "text-white/70" : "text-zinc-600")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold text-indigo-600">{title}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-zinc-900">{value}</div>
      <div className="mt-2 text-sm text-zinc-600">{subtitle}</div>
    </div>
  );
}

function FeatureCard({
  title,
  bullets,
  dark = false,
}: {
  title: string;
  bullets: string[];
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 shadow-sm",
        dark ? "border-white/10 bg-zinc-950/70" : "border-zinc-200 bg-white"
      )}
    >
      <div className={cn("text-base font-bold", dark ? "text-white" : "text-zinc-900")}>
        {title}
      </div>
      <ul className={cn("mt-3 space-y-2 text-sm", dark ? "text-white/70" : "text-zinc-600")}>
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className={cn("mt-1 h-1.5 w-1.5 rounded-full", dark ? "bg-indigo-300" : "bg-indigo-600")} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    { label: "Calls new leads within 60 seconds", a: true, b: false },
    { label: "Works 24/7, nights and weekends", a: true, b: false },
    { label: "Qualifies leads and filters time wasters", a: true, b: true },
    { label: "Books appointments automatically", a: true, b: true },
    { label: "Revives old and dead leads", a: true, b: false },
    { label: "Notes pushed to CRM, no guesswork", a: true, b: true },
    { label: "Consistent follow up, no missed leads", a: true, b: false },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
        <div className="text-sm font-semibold text-zinc-900">CallSetterAI vs Manual Appointment Setters</div>
        <div className="mt-1 text-xs text-zinc-600">Speed beats busy.</div>
      </div>

      <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-zinc-500">
        <div className="col-span-7">Feature</div>
        <div className="col-span-3 text-center">CallSetterAI</div>
        <div className="col-span-2 text-center">Manual</div>
      </div>

      <div className="divide-y divide-zinc-200">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-12 items-center px-5 py-3">
            <div className="col-span-7 text-sm text-zinc-800">{r.label}</div>
            <div className="col-span-3 text-center">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-1 text-xs font-semibold border",
                  r.a ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-50 text-zinc-500 border-zinc-200"
                )}
              >
                {r.a ? "Yes" : "No"}
              </span>
            </div>
            <div className="col-span-2 text-center">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-1 text-xs font-semibold border",
                  r.b ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-50 text-zinc-500 border-zinc-200"
                )}
              >
                {r.b ? "Yes" : "No"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Calculator() {
  const [leads, setLeads] = useState(1000);
  const [closeRate, setCloseRate] = useState(10);
  const [ticket, setTicket] = useState(1500);
  const [recoveryRate, setRecoveryRate] = useState(1);

  const res = useMemo(() => {
    const recoveredLeads = Math.max(0, leads) * (Math.max(0, recoveryRate) / 100);
    const customers = recoveredLeads * (Math.max(0, closeRate) / 100);
    const revenue = customers * Math.max(0, ticket);
    return { recoveredLeads, customers, revenue };
  }, [leads, closeRate, ticket, recoveryRate]);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-bold text-zinc-900">Calculate Your Lost Revenue</div>
          <div className="mt-1 text-xs text-zinc-600">Simple estimator. Replace with real numbers.</div>
        </div>
        <div className="text-xs text-zinc-500">Monthly</div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-4">
        <label className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Leads sitting in CRM</div>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="number"
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value))}
            min={0}
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Close rate percent</div>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="number"
            value={closeRate}
            onChange={(e) => setCloseRate(Number(e.target.value))}
            min={0}
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Avg ticket value</div>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="number"
            value={ticket}
            onChange={(e) => setTicket(Number(e.target.value))}
            min={0}
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Recovery percent</div>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="number"
            value={recoveryRate}
            onChange={(e) => setRecoveryRate(Number(e.target.value))}
            min={0}
            step={0.25}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs font-semibold text-zinc-600">Recovered revenue</div>
          <div className="mt-1 text-2xl font-extrabold text-zinc-900">
            {res.revenue.toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </div>
          <div className="mt-1 text-xs text-zinc-600">
            {res.recoveredLeads.toFixed(0)} recovered leads, {res.customers.toFixed(1)} new customers
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700">
            <ShieldCheck className="h-4 w-4" />
            <span>Make this real by tracking booked rate and show rate</span>
          </div>
          <div className="mt-2 text-xs text-indigo-700/80">
            If you are not measuring a baseline, any guarantee language is marketing fluff.
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const items = [
    {
      q: "How fast do you contact new leads?",
      a: "We can trigger calls and texts within 60 seconds of opt in and follow up based on your rules.",
    },
    {
      q: "Do you work with my CRM?",
      a: "If your CRM can receive webhooks or has Zapier, it is usually compatible. GHL is the easiest.",
    },
    {
      q: "Does this replace my setters?",
      a: "It replaces missed leads and inconsistent follow up, and supports your team by booking qualified calls.",
    },
    {
      q: "What does the guarantee mean?",
      a: "Define it precisely: baseline, tracking window, setup requirements, and what counts as a booked appointment.",
    },
  ];

  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-zinc-200 last:border-b-0">
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              type="button"
            >
              <div className="text-sm font-semibold text-zinc-900">{it.q}</div>
              <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition", isOpen && "rotate-180")} />
            </button>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="px-5 pb-5 text-sm text-zinc-600">{it.a}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

function TryAgentModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    const p = phone.replace(/[^\d+]/g, "").trim();
    const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    return firstName.trim().length >= 1 && okEmail && p.replace(/\D/g, "").length >= 10;
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
        phone: phone.replace(/[^\d+]/g, "").trim(),
        source: "try-modal",
        ts: new Date().toISOString(),
      };

      const webhook = process.env.NEXT_PUBLIC_TRY_WEBHOOK_URL;

      if (!webhook) {
        setToast("Form captured. Add NEXT_PUBLIC_TRY_WEBHOOK_URL to send this into your system.");
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
            className="relative w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/10 bg-[#0D0A2A]"
          >
            <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(168,85,247,0.25),transparent_50%),radial-gradient(circle_at_60%_90%,rgba(99,102,241,0.22),transparent_55%)]" />
            <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:18px_18px]" />

            <div className="relative px-6 pb-7 pt-7 sm:px-10 sm:pb-10">
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

              <p className="mx-auto mt-3 max-w-[460px] text-center text-sm text-white/70">
                Enter your details and we’ll show you exactly how Call Setter AI responds to new leads in real time.
              </p>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <div className="mb-2 text-sm font-semibold text-white/85">
                    First Name <span className="text-indigo-300">*</span>
                  </div>
                  <div className="relative">
                    <input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-indigo-400/60"
                    />
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300/90">
                      <User className="h-5 w-5" />
                    </div>
                  </div>
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-semibold text-white/85">
                    Email <span className="text-indigo-300">*</span>
                  </div>
                  <div className="relative">
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your best email"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-indigo-400/60"
                    />
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300/90">
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>
                </label>

                <label className="block">
                  <div className="mb-2 text-sm font-semibold text-white/85">
                    Phone Number <span className="text-indigo-300">*</span>
                  </div>
                  <div className="relative">
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 Phone Number"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white placeholder:text-white/45 outline-none transition focus:border-indigo-400/60"
                    />
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-indigo-300/90">
                      <Phone className="h-5 w-5" />
                    </div>
                  </div>
                </label>

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
                  including messages sent using automated or AI technology. Consent is not required to purchase. Msg and
                  data rates may apply. Reply STOP to opt out.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default function Page() {
  const [tryOpen, setTryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-indigo-600" />
            <div className="text-sm font-extrabold tracking-tight text-zinc-900">CallSetterAI</div>
          </div>

          <nav className="hidden items-center gap-6 text-sm text-zinc-600 sm:flex">
            <a href="#home" className="hover:text-zinc-900">Home</a>
            <a href="#services" className="hover:text-zinc-900">Services</a>
            <a href="#roi" className="hover:text-zinc-900">ROI Calculator</a>
            <a href="#faqs" className="hover:text-zinc-900">FAQ’s</a>
            <a href="#contact" className="hover:text-zinc-900">Contact</a>
          </nav>

          <button className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
            BOOK A DEMO
          </button>
        </div>
      </header>

      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(99,102,241,0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-white" />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl text-zinc-900">
              Increase Your Booked Appointments By{" "}
              <span className="text-indigo-600">25%</span> In 30 Days Guaranteed
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-zinc-600">
              We contact every inbound lead within 60 seconds, qualify them, and book appointments automatically, 24/7.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700">
                BOOK A DEMO <ArrowRight className="ml-2 h-4 w-4" />
              </button>

              <button
                onClick={() => setTryOpen(true)}
                className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-base font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                TRY THE LIVE AGENT
              </button>
            </div>

            <div className="mt-6 text-xs text-zinc-500">
              Put your real guarantee terms on the page. If you cannot define baseline and tracking, this is just hype.
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeader
            kicker="Why Speed-to-Lead Works"
            title="Speed wins because attention expires fast"
            subtitle="If you call late, you are not competing, you are begging."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Higher conversion" value="391%" subtitle="More likely to reach leads when you respond quickly." />
            <StatCard title="More likely to connect" value="10x" subtitle="Intent is highest right after they opt in." />
            <StatCard title="Less wasted spend" value="80%" subtitle="Fewer leads fall through the cracks." />
            <StatCard title="More likely to qualify" value="21x" subtitle="You talk to them before competitors do." />
          </div>

          <div className="mt-14">
            <ComparisonTable />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
                Respond to all leads within 60 seconds and take leads 24/7
              </h2>
              <p className="mt-3 text-zinc-600">
                You do not need more leads. You need to stop leaking the ones you already paid for.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FeatureCard
                  title="New lead follow up"
                  bullets={[
                    "Calls or texts within 60 seconds of opt in",
                    "Qualifies using your rules",
                    "Books directly on your calendar",
                  ]}
                />
                <FeatureCard
                  title="Dead lead revival"
                  bullets={[
                    "Re-contacts old leads automatically",
                    "Finds who is ready now",
                    "Turns old ad spend into revenue",
                  ]}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-bold text-zinc-900">
                <Timer className="h-4 w-4 text-indigo-600" />
                <span>Live Demo Preview</span>
              </div>
              <div className="mt-3 aspect-[16/10] rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-indigo-50" />
              <div className="mt-4 text-xs text-zinc-600">
                Replace this with your real product screenshot or embedded widget.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-zinc-950">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeader
            kicker="How It Works"
            title="We do everything, you get bookings"
            subtitle="Simple process, no drama."
            dark
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <FeatureCard
              dark
              title="1. We build"
              bullets={[
                "Connect your forms, inbox, and CRM",
                "Define qualification rules and routing",
                "Set compliance and consent flows",
              ]}
            />
            <FeatureCard
              dark
              title="2. We connect everything"
              bullets={[
                "Webhook based triggers",
                "Calendar booking and reminders",
                "CRM notes and pipeline movement",
              ]}
            />
            <FeatureCard
              dark
              title="3. Leads get booked"
              bullets={[
                "Instant outreach",
                "Dead lead revival sequences",
                "No show reduction confirmations",
              ]}
            />
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-white font-bold">What you get</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Voice agent</div>
                <div className="mt-1 text-sm text-white/70">Human sounding calls that qualify and book.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">SMS follow up</div>
                <div className="mt-1 text-sm text-white/70">Fast confirmations and reminders.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">CRM automation</div>
                <div className="mt-1 text-sm text-white/70">Notes, tags, and pipeline movement.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeader
            kicker="Everything handled"
            title="Everything CallSetterAI handles for you"
            subtitle="You should not be doing manual follow up in 2025."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard title="New leads" bullets={["Instant outreach", "Qualification rules", "Calendar booking"]} />
            <FeatureCard title="Old leads" bullets={["Revival campaigns", "Intent detection", "Rebooking flows"]} />
            <FeatureCard title="No shows" bullets={["Confirmations", "Reminders", "Reschedule recovery"]} />
          </div>
        </div>
      </section>

      <section id="roi" className="py-16 sm:py-20 bg-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-4">
          <Calculator />
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeader
            kicker="Built for"
            title="Built for businesses that book appointments for revenue"
            subtitle="If a booked call is not valuable, this is not for you."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-zinc-900">Who this is for</div>
              <ul className="mt-4 space-y-2 text-sm text-zinc-600">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-indigo-600" />
                  <span>High intent inbound leads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-indigo-600" />
                  <span>Offer requires a call, consult, or demo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-indigo-600" />
                  <span>Meaningful ad spend and expensive leads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-indigo-600" />
                  <span>CRM has hundreds to thousands of leads sitting</span>
                </li>
              </ul>

              <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-600">
                If you are not tracking booked rate, show rate, and close rate, fix that first. Then automate.
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-bold text-zinc-900">Sample dashboard</div>
              <div className="mt-3 aspect-[16/10] rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-indigo-50" />
              <div className="mt-4 text-xs text-zinc-600">
                Replace with your real analytics screenshot.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faqs" className="py-16 sm:py-20 bg-zinc-50">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeader kicker="FAQ" title="Frequently Asked Questions" subtitle="Stuff people ask before they buy." />
          <div className="mt-10">
            <FAQ />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <div className="text-3xl font-extrabold tracking-tight text-indigo-600">110% Money Back Guarantee</div>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-600">
              Put the real terms here. Baseline, tracking, requirements, and what counts as a booked appointment.
            </p>
            <div className="mt-6">
              <button className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700">
                BOOK A DEMO
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-20 bg-zinc-950">
        <div className="mx-auto w-full max-w-6xl px-4">
          <SectionHeader
            kicker="Try it"
            title="Try Call Setter AI Now"
            subtitle="Let prospects test the agent, then push them to book."
            dark
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="aspect-[16/10] bg-gradient-to-br from-white/10 to-indigo-500/10" />
              <div className="p-5">
                <div className="text-sm font-bold text-white">Emma</div>
                <div className="mt-1 text-xs text-white/70">Appointment setting specialist</div>
                <button
                  onClick={() => setTryOpen(true)}
                  className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-indigo-700"
                >
                  TRY NOW
                </button>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="aspect-[16/10] bg-gradient-to-br from-white/10 to-indigo-500/10" />
              <div className="p-5">
                <div className="text-sm font-bold text-white">Jules</div>
                <div className="mt-1 text-xs text-white/70">Inbound qualifier</div>
                <button
                  onClick={() => setTryOpen(true)}
                  className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-indigo-700"
                >
                  TRY NOW
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8 text-center text-xs text-white/50">
            © {new Date().getFullYear()} CallSetterAI. All rights reserved.
          </div>
        </div>
      </section>

      <TryAgentModal open={tryOpen} onClose={() => setTryOpen(false)} />
    </div>
  );
}
