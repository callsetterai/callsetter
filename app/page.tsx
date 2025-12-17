"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, CheckCircle, Zap, PhoneCall, Cpu, Bot } from "lucide-react";

/**
 * Call Setter AI — Purple Edition
 * - Brand-wide purple theme to match your logo
 * - Modern hero with ANIMATED sound waves + hex field (no phone outlines)
 * - Rectangular CTAs (rounded-md), high contrast
 * - Modal form (name, email, phone) on all CTAs
 * - Sections per your brief, with tighter spacing and stronger hierarchy
 */

const LOGO_SRC = "/logo-callsetterai.png"; // upload your logo file to public/logo-callsetterai.png

/* ---------- Backgrounds: Hex Field + Sound Waves (purple) ---------- */

function HexField() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 -z-20 w-full h-full opacity-[0.18]"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
    >
      <defs>
        <path id="hx" d="M15 0 L30 8.66 L30 25.98 L15 34.64 L0 25.98 L0 8.66 Z" />
        <pattern id="hexp" width="45" height="39" patternUnits="userSpaceOnUse">
          <use href="#hx" fill="none" stroke="rgba(122,101,255,0.45)" strokeWidth="1" x="0" y="0" />
          <use href="#hx" fill="none" stroke="rgba(90,70,246,0.35)" strokeWidth="1" x="45" y="0" />
          <use href="#hx" fill="none" stroke="rgba(122,101,255,0.3)" strokeWidth="1" x="22.5" y="19.5" />
          <use href="#hx" fill="none" stroke="rgba(90,70,246,0.28)" strokeWidth="1" x="67.5" y="19.5" />
        </pattern>
      </defs>

      <motion.rect
        initial={{ opacity: 0.4, y: 12 }}
        animate={{ opacity: [0.4, 0.6, 0.4], y: [12, 0, 12] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        width="120%"
        height="120%"
        x="-10%"
        y="-10%"
        fill="url(#hexp)"
      />
    </svg>
  );
}

function SoundWaves() {
  // three layered sine paths drifting horizontally, purple hues
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <motion.svg
        className="absolute left-1/2 top-[18%] -translate-x-1/2 w-[1600px] h-[420px]"
        viewBox="0 0 1600 420"
        fill="none"
      >
        <motion.path
          d="M0 210 C 200 120, 450 300, 700 210 S 1200 120, 1600 210"
          stroke="rgba(122,101,255,0.55)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0.85, opacity: 0.8, x: -60 }}
          animate={{ pathLength: [0.85, 1, 0.85], opacity: [0.8, 1, 0.8], x: [-60, 60, -60] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 260 C 240 170, 520 330, 760 260 S 1240 170, 1600 260"
          stroke="rgba(90,70,246,0.55)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0.75, opacity: 0.7, x: 40 }}
          animate={{ pathLength: [0.75, 0.95, 0.75], opacity: [0.7, 0.9, 0.7], x: [40, -40, 40] }}
          transition={{ duration: 9.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 160 C 260 90, 520 230, 780 160 S 1300 90, 1600 160"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0.65, opacity: 0.5, x: 0 }}
          animate={{ pathLength: [0.65, 0.92, 0.65], opacity: [0.5, 0.75, 0.5], x: [0, 30, 0] }}
          transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}

/* ----------------------------- Page Component ----------------------------- */

export default function Page() {
  const [leads, setLeads] = useState(300);
  const [closeRate, setCloseRate] = useState(10);
  const [revenuePerCustomer, setRevenuePerCustomer] = useState(1500);
  const [scrolled, setScrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const { scrollY } = useScroll();
  const heroFade = useTransform(scrollY, [0, 200], [1, 0.92]);

  const monthlyLoss = useMemo(
    () => Math.round(leads * (closeRate / 100) * revenuePerCustomer * 0.2),
    [leads, closeRate, revenuePerCustomer]
  );
  const yearlyLoss = monthlyLoss * 12;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showForm ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showForm]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowForm(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const fadeUp = {
    initial: { y: 16, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true, amount: 0.2 },
  } as const;

  function validate() {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (!/^\+?[0-9\-()\s]{7,}$/.test(form.phone)) next.phone = "Enter a valid phone";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // Optional: POST to your voice-agent webhook
    // await fetch("https://YOUR_WEBHOOK_URL", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setForm({ name: "", email: "", phone: "" }); }, 1200);
  }

  return (
    <div className="relative">
      {/* ============================ NAVBAR ============================ */}
      <header className={`fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all duration-300 ${scrolled ? "bg-[#0b0a12]/85 backdrop-blur-md py-2" : "bg-[#0b0a12]/60 py-4"}`}>
        <div className="container-xl flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="Call Setter AI" className="h-8 w-auto" />
            <span className="sr-only">Call Setter AI</span>
          </a>
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <PhoneCall className="w-4 h-4 mr-2" /> Test The AI Setter Now
          </button>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <motion.section id="top" style={{ opacity: heroFade }} className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-28">
        {/* Purple gradient wash */}
        <div className="absolute inset-0 -z-30 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(122,101,255,0.18),transparent_60%),radial-gradient(900px_460px_at_90%_10%,rgba(90,70,246,0.16),transparent_70%)]" />
        <HexField />
        <SoundWaves />

        <motion.h1 {...fadeUp} className="text-5xl md:text-6xl font-extrabold max-w-4xl leading-tight tracking-tight">
          Increase Your Booked Appointments By 25% In 30 Days Guaranteed
        </motion.h1>
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="text-lg text-muted max-w-2xl mt-4">
          CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
        </motion.p>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="flex gap-3 mt-8">
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <PhoneCall className="w-5 h-5 mr-2" /> Test The AI Setter Now!
          </button>
          <button onClick={() => setShowForm(true)} className="btn btn-ghost">Book a Demo</button>
        </motion.div>

        <motion.div initial={{ y: 0 }} animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6 text-white/60 flex items-center gap-2">
          <span className="text-xs">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.section>

      {/* ============================ WHY ============================ */}
      <section id="why" className="py-20 text-center">
        <div className="container-xl">
          <motion.h2 {...fadeUp} className="text-4xl font-bold mb-4">Why Speed-to-Lead Works</motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-muted mb-12">
            The data is clear: the faster you respond, the more deals you close.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "391%", title: "Higher Conversion", text: "Leads contacted within the first minute convert dramatically more often." },
              { num: "10x", title: "More Likely to Connect", text: "Calling within five minutes massively increases contact rates." },
              { num: "80%", title: "Drop After 5 Minutes", text: "Contact rates collapse when response is delayed." },
              { num: "24/7", title: "Instant Coverage", text: "Leads are called day, night, and weekends." },
            ].map((m, i) => (
              <motion.div key={i} initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: i * 0.05 }} viewport={{ once: true }} className="card p-6 text-left">
                <div className="text-5xl font-extrabold text-[var(--brand-purple)] mb-3">{m.num}</div>
                <div className="text-lg font-semibold mb-1">{m.title}</div>
                <div className="text-sm text-muted">{m.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ OUTCOME ============================ */}
      <section className="py-24 bg-[#0f0e18]">
        <div className="container-xl text-center">
          <motion.h2 {...fadeUp} className="text-4xl font-bold mb-6 max-w-3xl mx-auto">
            Respond To All Leads Within 60 Seconds And Take Leads 24/7
          </motion.h2>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-muted max-w-2xl mx-auto text-lg space-y-2">
            <p>By calling new leads in under 60 seconds and following up consistently, businesses typically see a 15–25% increase in booked appointments within the first 30 days.</p>
            <p>No changes to ads.</p>
            <p>No new hires.</p>
            <p>Just faster, consistent execution.</p>
          </motion.div>
        </div>
      </section>

      {/* ============================ HOW + WHAT YOU GET ============================ */}
      <section id="how" className="py-24">
        <div className="container-xl">
          <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-12">We Do Everything. You Get Bookings.</motion.h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { icon: <Bot className="w-10 h-10 text-[var(--brand-purple)]" />, title: "We Build It", text: "We custom-build your AI appointment setter around your offer, qualification rules, and booking flow." },
              { icon: <Cpu className="w-10 h-10 text-[var(--brand-purple)]" />, title: "We Connect Everything", text: "We connect your CRM, lead forms, ad platforms, phone system, and calendar so every lead routes instantly." },
              { icon: <Zap className="w-10 h-10 text-[var(--brand-purple)]" />, title: "Leads Get Booked", text: "Every new lead is called automatically within 60 seconds, qualified, and booked directly on your calendar." },
            ].map((s, i) => (
              <motion.div key={i} initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="card p-6">
                <div className="mb-3">{s.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted">{s.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="max-w-5xl mx-auto mt-16">
            <motion.h3 {...fadeUp} className="text-3xl font-bold mb-6 text-center">What You Get</motion.h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              {[
                "Done-for-you AI voice appointment setter",
                "Custom scripting and call logic built for your business",
                "Automatic calling of every new lead within 60 seconds",
                "Full CRM, lead source, and calendar integration",
                "Real-time bookings sent directly to your calendar",
                "Call recordings and transcriptions",
                "Voice customization including tone, pace, and language",
                "Automatic follow-up for unanswered leads",
                "Human transfer to your team when needed",
                "Ongoing monitoring, updates, and support",
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--brand-purple)] mt-1" />
                  <p className="text-gray-200">{item}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-[12px] text-white/50 text-center mt-4">All setup is handled inside your business. Nothing is outsourced to templates.</p>
          </div>
        </div>
      </section>

      {/* ============================ SERVICES ============================ */}
      <section id="services" className="py-24 bg-[#0f0e18]">
        <div className="container-xl">
          <motion.h2 {...fadeUp} className="text-4xl font-bold mb-12 text-center">Everything CallSetter.ai Handles For You</motion.h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-200">
            {[
              "24/7 AI receptionist answering inbound calls",
              "Calling every new web lead within 60 seconds",
              "Reviving old and dead leads automatically",
              "Confirming booked appointments to reduce no-shows",
            ].map((s, i) => (
              <motion.div key={i} initial={{ y: 8, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }} className="card p-4 flex items-center gap-3">
                <Bot className="w-6 h-6 text-[var(--brand-purple)]" /> {s}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ ROI ============================ */}
      <section id="roi" className="py-24">
        <div className="container-xl">
          <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-4">Calculate Your Lost Revenue</motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-center text-muted mb-10">
            See what slow follow-up costs you.
          </motion.p>
          <div className="grid md:grid-cols-2 gap-6 card p-8">
            <div className="space-y-4">
              <label className="block text-sm text-white/70">Leads Per Month</label>
              <input type="number" value={leads} onChange={(e) => setLeads(Number(e.target.value))} placeholder="300" className="w-full bg-black/60 border border-white/10 rounded-md p-2" />
              <label className="block text-sm text-white/70 mt-4">Close Rate (%)</label>
              <input type="number" value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value))} placeholder="10" className="w-full bg-black/60 border border-white/10 rounded-md p-2" />
              <label className="block text-sm text-white/70 mt-4">Revenue Per Customer</label>
              <input type="number" value={revenuePerCustomer} onChange={(e) => setRevenuePerCustomer(Number(e.target.value))} placeholder="1500" className="w-full bg-black/60 border border-white/10 rounded-md p-2" />
              <p className="text-xs text-white/50">Assumes a 20% lift from faster response time.</p>
            </div>

            <div className="flex flex-col justify-center items-center text-center">
              <div className="text-white/70 mb-2">Estimated Revenue Lost Per Month</div>
              <div className="text-5xl font-extrabold mb-6 text-[var(--brand-purple)]">${monthlyLoss.toLocaleString()}</div>
              <div className="text-white/70 mb-2">Estimated Revenue Lost Per Year</div>
              <div className="text-3xl font-bold mb-8 text-[#C8C2FF]">${yearlyLoss.toLocaleString()}</div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(true)} className="btn btn-primary">
                  <PhoneCall className="w-4 h-4 mr-2" /> Test The AI Setter Now!
                </button>
                <button onClick={() => setShowForm(true)} className="btn btn-ghost">Book a Demo</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section id="faq" className="py-24 bg-[#0f0e18]">
        <div className="container-xl">
          <motion.h2 {...fadeUp} className="text-4xl font-bold mb-12 text-center">FAQ</motion.h2>
          <div className="space-y-4 max-w-5xl mx-auto">
            {[
              { q: "Will this sound robotic?", a: "No. The voice is natural and designed for real conversations." },
              { q: "How fast can we go live?", a: "Most clients are live within a few days." },
              { q: "Does this integrate with my CRM?", a: "Yes. We support GHL and non-GHL setups." },
              { q: "What happens if a lead does not answer?", a: "The system follows up automatically based on your rules." },
            ].map((faq, i) => (
              <motion.details key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="card p-4">
                <summary className="cursor-pointer flex justify-between items-center font-semibold text-lg">
                  {faq.q} <ChevronDown className="w-5 h-5" />
                </summary>
                <p className="text-muted mt-2 text-sm">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section id="cta" className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_320px_at_50%_0%,rgba(122,101,255,0.2),transparent_70%)]" />
        <motion.h2 {...fadeUp} className="text-5xl font-bold mb-6">Try Call Setter AI Now!</motion.h2>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setShowForm(true)} className="btn btn-primary px-10 py-4 text-lg">
            <Bot className="w-6 h-6 mr-2" /> Try Now!
          </button>
          <button onClick={() => setShowForm(true)} className="btn btn-ghost px-10 py-4 text-lg">
            Book a Demo
          </button>
        </div>
      </section>

      {/* ============================ MODAL FORM ============================ */}
      {showForm && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <motion.div initial={{ y: 20, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="relative z-10 w-full max-w-md card p-6" role="dialog" aria-modal="true" aria-label="Test the AI Setter">
            <button onClick={() => setShowForm(false)} className="absolute right-3 top-3 text-white/60 hover:text-white" aria-label="Close">✕</button>
            <h3 className="text-2xl font-bold mb-2">Test The AI Setter</h3>
            <p className="text-sm text-muted mb-6">Enter your details and we’ll connect you with a live AI voice demo.</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full bg-black/60 border rounded-md p-2 focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[var(--brand-purple)]"}`} placeholder="Name" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full bg-black/60 border rounded-md p-2 focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[var(--brand-purple)]"}`} placeholder="Email" />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <input inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`w-full bg-black/60 border rounded-md p-2 focus:outline-none focus:ring-2 ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[var(--brand-purple)]"}`} placeholder="Phone" />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>
              <button type="submit" className="btn btn-primary w-full">Submit</button>
              {submitted && <p className="text-center text-sm text-emerald-400">Success! We'll be in touch shortly.</p>}
            </form>

            <p className="text-[11px] text-white/50 mt-4">By submitting, you agree to be contacted by Call Setter AI for a demo.</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
