"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, CheckCircle, Zap, PhoneCall, Cpu, Bot, Sparkles } from "lucide-react";

/**
 * Call Setter AI — Futuristic Hex Waves (Purple)
 * - Inline SVG background: animated hex grid + multi-layer neon waves + particles
 * - Brand purple throughout; rectangular CTAs
 * - Removed all “Book a Demo” buttons (single primary CTA)
 * - Extra visuals/animations section with animated gradient frames
 */

const LOGO_SRC = "/logo-callsetterai.png"; // keep your logo at public/logo-callsetterai.png

/* ==================== HERO BACKGROUND: HEX + WAVES + PARTICLES ==================== */

function NeoHexWavesBG() {
  // Predefined particle positions (no randomness for SSR determinism)
  const particles = [
    { x: 8, y: 22, s: 1.6, d: 6.5, o: 0.45 },
    { x: 30, y: 36, s: 2.4, d: 7.5, o: 0.35 },
    { x: 72, y: 18, s: 2.2, d: 8.2, o: 0.4 },
    { x: 54, y: 28, s: 1.8, d: 7.2, o: 0.5 },
    { x: 18, y: 12, s: 2.8, d: 9.2, o: 0.35 },
    { x: 86, y: 30, s: 1.7, d: 6.8, o: 0.45 },
  ];

  return (
    <div className="absolute inset-0 -z-20 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* BRAND PURPLES */}
          <linearGradient id="purp" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5A46F6" />
            <stop offset="100%" stopColor="#7C6CFD" />
          </linearGradient>
          <linearGradient id="purpSoft" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(122,101,255,0.55)" />
            <stop offset="100%" stopColor="rgba(90,70,246,0.55)" />
          </linearGradient>

          {/* HEX PATTERN */}
          <path id="hx" d="M12 0 L24 6.93 L24 20.79 L12 27.72 L0 20.79 L0 6.93 Z" />
          <pattern id="hexp" width="36" height="32" patternUnits="userSpaceOnUse">
            <use href="#hx" fill="none" stroke="rgba(122,101,255,0.45)" strokeWidth="1" x="0" y="0" />
            <use href="#hx" fill="none" stroke="rgba(90,70,246,0.32)" strokeWidth="1" x="36" y="0" />
            <use href="#hx" fill="none" stroke="rgba(122,101,255,0.28)" strokeWidth="1" x="18" y="16" />
            <use href="#hx" fill="none" stroke="rgba(90,70,246,0.26)" strokeWidth="1" x="54" y="16" />
          </pattern>

          {/* BLUR GLOWS */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* VIGNETTE */}
          <radialGradient id="fade" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#000" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0B0A12" stopOpacity="1" />
          </radialGradient>

          <style>
            {`
              @keyframes driftL { 0% { transform: translateX(0); } 50% { transform: translateX(-40px); } 100% { transform: translateX(0); } }
              @keyframes driftR { 0% { transform: translateX(0); } 50% { transform: translateX(40px); } 100% { transform: translateX(0); } }
              @keyframes shimmer { 0% { opacity:.28; } 50% { opacity:.5; } 100% { opacity:.28; } }
              @keyframes updown { 0% { transform: translateY(0); } 50% { transform: translateY(-8px); } 100% { transform: translateY(0); } }
              .hexLayer { animation: shimmer 12s ease-in-out infinite; }
              .waveL { animation: driftL 9.2s ease-in-out infinite; }
              .waveR { animation: driftR 10.2s ease-in-out infinite; }
            `}
          </style>
        </defs>

        {/* PURPLE WASH */}
        <rect x="0" y="0" width="1600" height="900" fill="url(#fade)" />

        {/* HEX BACKDROP */}
        <g className="hexLayer" opacity="0.22">
          <rect x="-80" y="-40" width="1760" height="980" fill="url(#hexp)" />
        </g>

        {/* NEON WAVES (multiple layers for depth) */}
        <g filter="url(#softGlow)">
          {/* Middle */}
          <g className="waveL">
            <path
              d="M0 460 C 200 360, 460 560, 760 460 S 1320 360, 1600 460"
              fill="none"
              stroke="url(#purpSoft)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          {/* Upper accent */}
          <g className="waveR" opacity="0.9">
            <path
              d="M0 380 C 240 320, 520 480, 820 380 S 1340 320, 1600 380"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 8"
            />
          </g>
          {/* Lower thick */}
          <g className="waveL">
            <path
              d="M0 560 C 240 500, 520 640, 820 560 S 1340 500, 1600 560"
              fill="none"
              stroke="url(#purp)"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.75"
            />
          </g>
          {/* Faint far wave */}
          <g className="waveR" opacity="0.5">
            <path
              d="M0 620 C 200 580, 460 700, 760 620 S 1320 580, 1600 620"
              fill="none"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </g>

        {/* PARTICLES */}
        {particles.map((p, i) => (
          <motion.circle
            key={i}
            cx={(p.x / 100) * 1600}
            cy={(p.y / 100) * 900}
            r={p.s * 2.2}
            fill="#7C6CFD"
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, p.o, 0.15], cy: [(p.y / 100) * 900, (p.y / 100) * 900 - 12, (p.y / 100) * 900] }}
            transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          />
        ))}
      </svg>
      {/* Subtle extra gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(122,101,255,0.22),transparent_60%),radial-gradient(900px_460px_at_90%_10%,rgba(90,70,246,0.20),transparent_70%)]" />
    </div>
  );
}

/* =============================================================================== */

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
  const heroFade = useTransform(scrollY, [0, 240], [1, 0.9]);

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
    // Optional: connect your voice agent webhook:
    // await fetch("https://YOUR_WEBHOOK_URL", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) });
    setSubmitted(true);
    setTimeout(() => { setShowForm(false); setSubmitted(false); setForm({ name: "", email: "", phone: "" }); }, 1200);
  }

  return (
    <div className="relative">
      {/* ============================ NAVBAR ============================ */}
      <header className={`fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all duration-300 ${scrolled ? "bg-[#0b0a12]/85 backdrop-blur-md py-2" : "bg-[#0b0a12]/60 py-4"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="Call Setter AI" className="h-8 w-auto" />
            <span className="sr-only">Call Setter AI</span>
          </a>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-md transition-colors duration-200 bg-[#5A46F6] hover:bg-[#7C6CFD] text-white">
            <PhoneCall className="w-4 h-4 mr-2" /> Test The AI Setter Now
          </button>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <motion.section id="top" style={{ opacity: heroFade }} className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-28">
        <NeoHexWavesBG />
        <motion.h1 {...fadeUp} className="text-5xl md:text-6xl font-extrabold max-w-4xl leading-tight tracking-tight">
          Increase Your Booked Appointments By 25% In 30 Days Guaranteed
        </motion.h1>
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="text-lg text-white/70 max-w-2xl mt-4">
          CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
        </motion.p>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="flex gap-3 mt-8">
          <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center font-semibold px-8 py-3 rounded-md transition-colors duration-200 bg-[#5A46F6] hover:bg-[#7C6CFD] text-white">
            <PhoneCall className="w-5 h-5 mr-2" /> Test The AI Setter Now!
          </button>
        </motion.div>

        {/* Small badges for life */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="absolute top-28 left-6 hidden md:flex items-center gap-2 text-xs bg-white/5 border border-white/10 rounded-md px-3 py-1">
          <Sparkles className="w-3.5 h-3.5 text-[#7C6CFD]" /> Real-time lead calls
        </motion.div>

        <motion.div initial={{ y: 0 }} animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6 text-white/60 flex items-center gap-2">
          <span className="text-xs">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.section>

      {/* ============================ WHY ============================ */}
      <section id="why" className="py-20 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 {...fadeUp} className="text-4xl font-bold mb-4">Why Speed-to-Lead Works</motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-white/70 mb-12">
            The data is clear: the faster you respond, the more deals you close.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: "391%", title: "Higher Conversion", text: "Leads contacted within the first minute convert dramatically more often." },
              { num: "10x", title: "More Likely to Connect", text: "Calling within five minutes massively increases contact rates." },
              { num: "80%", title: "Drop After 5 Minutes", text: "Contact rates collapse when response is delayed." },
              { num: "24/7", title: "Instant Coverage", text: "Leads are called day, night, and weekends." },
            ].map((m, i) => (
              <motion.div key={i} initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: i * 0.05 }} viewport={{ once: true }} className="bg-[#11101a] border border-white/10 rounded-xl p-6 text-left">
                <div className="text-5xl font-extrabold text-[#5A46F6] mb-3">{m.num}</div>
                <div className="text-lg font-semibold mb-1">{m.title}</div>
                <div className="text-sm text-white/70">{m.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ OUTCOME ============================ */}
      <section className="py-24 bg-[#0f0e18]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h2 {...fadeUp} className="text-4xl font-bold mb-6 max-w-3xl mx-auto">
            Respond To All Leads Within 60 Seconds And Take Leads 24/7
          </motion.h2>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-white/70 max-w-2xl mx-auto text-lg space-y-2">
            <p>By calling new leads in under 60 seconds and following up consistently, businesses typically see a 15–25% increase in booked appointments within the first 30 days.</p>
            <p>No changes to ads.</p>
            <p>No new hires.</p>
            <p>Just faster, consistent execution.</p>
          </motion.div>
        </div>
      </section>

      {/* ============================ SHOWCASE VISUALS (animated frames) ============================ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h3 {...fadeUp} className="text-3xl font-bold text-center mb-10">Inside the Experience</motion.h3>
          <div className="grid md:grid-cols-3 gap-6">
            {["Voice Agent Live", "Instant Lead Response", "Calendar Auto-Booking"].map((t, i) => (
              <motion.div
                key={i}
                initial={{ y: 12, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#1a1730] to-[#0e0c1a]"
              >
                <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(150px 60px at 20% 20%, rgba(122,101,255,0.22), transparent 70%), radial-gradient(120px 50px at 80% 60%, rgba(90,70,246,0.18), transparent 70%)" }} />
                {/* animated gradient ring */}
                <motion.div className="absolute -inset-[1px] rounded-xl" style={{ background: "conic-gradient(from 0deg, rgba(122,101,255,0.35), rgba(255,255,255,0.08), rgba(90,70,246,0.35), rgba(255,255,255,0.08), rgba(122,101,255,0.35))" }} animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
                <div className="relative p-4">
                  <div className="text-sm text-white/70 mb-3">{t}</div>
                  {/* placeholder visual panel */}
                  <div className="h-44 rounded-md bg-black/40 border border-white/10 overflow-hidden">
                    <motion.div className="h-full w-1/2 bg-gradient-to-r from-[#5A46F6]/20 to-transparent" initial={{ x: "-50%" }} animate={{ x: ["-50%", "150%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ HOW + WHAT YOU GET ============================ */}
      <section id="how" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-12">We Do Everything. You Get Bookings.</motion.h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { icon: <Bot className="w-10 h-10 text-[#7C6CFD]" />, title: "We Build It", text: "We custom-build your AI appointment setter around your offer, qualification rules, and booking flow." },
              { icon: <Cpu className="w-10 h-10 text-[#7C6CFD]" />, title: "We Connect Everything", text: "We connect your CRM, lead forms, ad platforms, phone system, and calendar so every lead routes instantly." },
              { icon: <Zap className="w-10 h-10 text-[#7C6CFD]" />, title: "Leads Get Booked", text: "Every new lead is called automatically within 60 seconds, qualified, and booked directly on your calendar." },
            ].map((s, i) => (
              <motion.div key={i} initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="bg-[#11101a] border border-white/10 rounded-2xl p-6">
                <div className="mb-3">{s.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-white/70">{s.text}</p>
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
                  <CheckCircle className="w-4 h-4 text-[#5A46F6] mt-1" />
                  <p className="text-gray-200">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ SERVICES ============================ */}
      <section id="services" className="py-24 bg-[#0f0e18]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 {...fadeUp} className="text-4xl font-bold mb-12 text-center">Everything CallSetter.ai Handles For You</motion.h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-200">
            {[
              "24/7 AI receptionist answering inbound calls",
              "Calling every new web lead within 60 seconds",
              "Reviving old and dead leads automatically",
              "Confirming booked appointments to reduce no-shows",
            ].map((s, i) => (
              <motion.div key={i} initial={{ y: 8, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.06 }} className="bg-[#11101a] border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <Bot className="w-6 h-6 text-[#7C6CFD]" /> {s}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ ROI ============================ */}
      <section id="roi" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-4">Calculate Your Lost Revenue</motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-center text-white/70 mb-10">
            See what slow follow-up costs you.
          </motion.p>
          <div className="grid md:grid-cols-2 gap-6 bg-[#11101a] border border-white/10 rounded-2xl p-8">
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
              <div className="text-5xl font-extrabold mb-6 text-[#5A46F6]">${monthlyLoss.toLocaleString()}</div>
              <div className="text-white/70 mb-2">Estimated Revenue Lost Per Year</div>
              <div className="text-3xl font-bold mb-8 text-[#C8C2FF]">${yearlyLoss.toLocaleString()}</div>
              <div className="flex gap-3">
                <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center font-semibold px-6 py-3 rounded-md transition-colors duration-200 bg-[#5A46F6] hover:bg-[#7C6CFD] text-white">
                  <PhoneCall className="w-4 h-4 mr-2" /> Test The AI Setter Now!
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section id="faq" className="py-24 bg-[#0f0e18]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2 {...fadeUp} className="text-4xl font-bold mb-12 text-center">FAQ</motion.h2>
          <div className="space-y-4 max-w-5xl mx-auto">
            {[
              { q: "Will this sound robotic?", a: "No. The voice is natural and designed for real conversations." },
              { q: "How fast can we go live?", a: "Most clients are live within a few days." },
              { q: "Does this integrate with my CRM?", a: "Yes. We support GHL and non-GHL setups." },
              { q: "What happens if a lead does not answer?", a: "The system follows up automatically based on your rules." },
            ].map((faq, i) => (
              <motion.details key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-[#11101a] border border-white/10 rounded-lg p-4">
                <summary className="cursor-pointer flex justify-between items-center font-semibold text-lg">
                  {faq.q} <ChevronDown className="w-5 h-5" />
                </summary>
                <p className="text-white/70 mt-2 text-sm">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section id="cta" className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_320px_at_50%_0%,rgba(122,101,255,0.22),transparent_70%)]" />
        <motion.h2 {...fadeUp} className="text-5xl font-bold mb-6">Try Call Setter AI Now!</motion.h2>
        <div className="flex items-center justify-center">
          <button onClick={() => setShowForm(true)} className="inline-flex items-center justify-center font-bold px-10 py-4 rounded-md transition-colors duration-200 bg-[#5A46F6] hover:bg-[#7C6CFD] text-white text-lg">
            <Bot className="w-6 h-6 mr-2" /> Try Now!
          </button>
        </div>
      </section>

      {/* ============================ MODAL FORM ============================ */}
      {showForm && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <motion.div initial={{ y: 20, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="relative z-10 w-full max-w-md bg-[#11101a] border border-white/10 rounded-2xl p-6" role="dialog" aria-modal="true" aria-label="Test the AI Setter">
            <button onClick={() => setShowForm(false)} className="absolute right-3 top-3 text-white/60 hover:text-white" aria-label="Close">✕</button>
            <h3 className="text-2xl font-bold mb-2">Test The AI Setter</h3>
            <p className="text-sm text-white/70 mb-6">Enter your details and we’ll connect you with a live AI voice demo.</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={`w-full bg-black/60 border rounded-md p-2 focus:outline-none focus:ring-2 ${errors.name ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[#5A46F6]"}`} placeholder="Name" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={`w-full bg-black/60 border rounded-md p-2 focus:outline-none focus:ring-2 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[#5A46F6]"}`} placeholder="Email" />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <input inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={`w-full bg-black/60 border rounded-md p-2 focus:outline-none focus:ring-2 ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-white/10 focus:ring-[#5A46F6]"}`} placeholder="Phone" />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>
              <button type="submit" className="w-full inline-flex items-center justify-center font-semibold px-6 py-3 rounded-md transition-colors duration-200 bg-[#5A46F6] hover:bg-[#7C6CFD] text-white">
                Submit
              </button>
              {submitted && <p className="text-center text-sm text-emerald-400">Success! We'll be in touch shortly.</p>}
            </form>

            <p className="text-[11px] text-white/50 mt-4">By submitting, you agree to be contacted by Call Setter AI for a demo.</p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
