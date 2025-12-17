"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown, CheckCircle, Zap, PhoneCall, Cpu, Bot } from "lucide-react";

/**
 * Call Setter AI — Landing Page
 * - Uses your logo at /public/logo-callsetterai.png
 * - Animated Hexagon grid + Soundwave lines behind hero headline
 * - Modal form (name, email, phone) on all CTAs
 */

const LOGO_SRC = "/logo-callsetterai.png"; // <= place your uploaded file at /public/logo-callsetterai.png

/* ------------------------------ Visual BGs ------------------------------ */

// Subtle animated hexagon grid (SVG pattern + parallax fade)
function HexGridBG() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 -z-10 w-full h-full opacity-[0.15]"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Hexagon path */}
        <path id="hex" d="M15 0 L30 8.66 L30 25.98 L15 34.64 L0 25.98 L0 8.66 Z" />
        {/* Pattern tiling the hexagon */}
        <pattern id="hexes" width="45" height="39" patternUnits="userSpaceOnUse" patternTransform="translate(0,0)">
          {/* row A */}
          <use href="#hex" fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="1" x="0" y="0" />
          <use href="#hex" fill="none" stroke="rgba(34,211,238,0.28)" strokeWidth="1" x="45" y="0" />
          <use href="#hex" fill="none" stroke="rgba(59,130,246,0.34)" strokeWidth="1" x="90" y="0" />
          {/* row B (offset) */}
          <use href="#hex" fill="none" stroke="rgba(34,211,238,0.32)" strokeWidth="1" x="22.5" y="19.5" />
          <use href="#hex" fill="none" stroke="rgba(59,130,246,0.28)" strokeWidth="1" x="67.5" y="19.5" />
          <use href="#hex" fill="none" stroke="rgba(34,211,238,0.24)" strokeWidth="1" x="112.5" y="19.5" />
        </pattern>

        {/* Soft vignette to keep edges dark */}
        <radialGradient id="fade" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="70%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Tiled hex grid */}
      <motion.rect
        initial={{ opacity: 0.35, y: 12 }}
        animate={{ opacity: [0.35, 0.55, 0.35], y: [12, 0, 12] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        width="120%"
        height="120%"
        x="-10%"
        y="-10%"
        fill="url(#hexes)"
      />
      {/* Vignette mask */}
      <rect width="100%" height="100%" fill="url(#fade)" />
    </svg>
  );
}

// Animated soundwave lines (three layered paths drifting horizontally)
function SoundWavesBG() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      <motion.svg
        className="absolute left-1/2 top-[20%] -translate-x-1/2 w-[1400px] h-[360px]"
        viewBox="0 0 1400 360"
        fill="none"
      >
        <motion.path
          d="M0 180 C 200 120, 400 240, 600 180 S 1000 120, 1400 180"
          stroke="rgba(34,211,238,0.45)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0.8, opacity: 0.7, x: -40 }}
          animate={{ pathLength: [0.8, 1, 0.8], opacity: [0.7, 0.9, 0.7], x: [ -40, 40, -40 ] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 210 C 220 160, 420 260, 640 210 S 1040 160, 1400 210"
          stroke="rgba(59,130,246,0.35)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0.7, opacity: 0.6, x: 30 }}
          animate={{ pathLength: [0.7, 0.95, 0.7], opacity: [0.6, 0.85, 0.6], x: [30, -30, 30] }}
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M0 150 C 240 100, 440 200, 660 150 S 1080 100, 1400 150"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0.6, opacity: 0.5, x: 0 }}
          animate={{ pathLength: [0.6, 0.9, 0.6], opacity: [0.45, 0.7, 0.45], x: [0, 20, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.svg>
    </div>
  );
}

/* ---------------------------------------------------------------------- */

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
  const phoneYOffset = useTransform(scrollY, [0, 400], [0, -40]);
  const glowOpacity = useTransform(scrollY, [0, 600], [0.6, 0.2]);

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [showForm]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowForm(false);
    };
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
    // Optional: POST to your voice-agent webhook:
    // await fetch("https://YOUR_WEBHOOK_URL", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });

    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "" });
    }, 1200);
  }

  return (
    <div className="bg-[#0a0a0a] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30">
      {/* ============================ NAVBAR ============================ */}
      <header
        className={`fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md py-2" : "bg-black/40 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="Call Setter AI" className="h-8 w-auto" />
            <span className="sr-only">Call Setter AI</span>
          </a>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" /> Test The AI Setter Now
          </button>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <section
        id="top"
        className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden pt-32"
      >
        {/* New animated BGs */}
        <HexGridBG />
        <SoundWavesBG />

        {/* Parallax “phones” glows for depth */}
        <motion.div
          style={{ y: phoneYOffset, opacity: glowOpacity }}
          className="pointer-events-none absolute w-[320px] h-[640px] md:w-[420px] md:h-[780px] bg-gradient-to-b from-cyan-400/18 to-transparent rounded-[2.2rem] border border-cyan-400/30 backdrop-blur-xl rotate-6 right-[8%] top-[18%]"
        />
        <motion.div
          style={{ y: phoneYOffset, opacity: glowOpacity }}
          className="pointer-events-none absolute w-[260px] h-[560px] bg-gradient-to-b from-blue-400/18 to-transparent rounded-[2rem] border border-blue-400/30 backdrop-blur-xl -rotate-6 left-[8%] top-[24%]"
        />

        {/* Headline & subheadline */}
        <motion.h1
          {...fadeUp}
          className="text-5xl md:text-6xl font-extrabold max-w-4xl leading-tight tracking-tight"
        >
          Increase Your Booked Appointments By 25% In 30 Days Guaranteed
        </motion.h1>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.08 }}
          className="text-lg text-gray-300 max-w-2xl mt-4"
        >
          CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so
          high-spending advertisers capture demand before competitors do.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="flex gap-4 mt-8"
        >
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-black px-8 py-3 font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-5 h-5" /> Test The AI Setter Now!
          </button>
        </motion.div>

        <motion.div
          initial={{ y: 0 }}
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 text-gray-400 flex items-center gap-2"
        >
          <span className="text-xs">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ============================ WHY ============================ */}
      <section id="why" className="py-20 text-center px-6">
        <motion.h2 {...fadeUp} className="text-4xl font-bold mb-4">
          Why Speed-to-Lead Works
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.06 }}
          className="text-gray-400 mb-12"
        >
          The data is clear: the faster you respond, the more deals you close.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              num: "391%",
              title: "Higher Conversion",
              text: "Leads contacted within the first minute convert dramatically more often.",
            },
            {
              num: "10x",
              title: "More Likely to Connect",
              text: "Calling within five minutes massively increases contact rates.",
            },
            {
              num: "80%",
              title: "Drop After 5 Minutes",
              text: "Contact rates collapse when response is delayed.",
            },
            { num: "24/7", title: "Instant Coverage", text: "Leads are called day, night, and weekends." },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center bg-[#111] p-6 rounded-xl border border-gray-800"
            >
              <h3 className="text-5xl font-extrabold text-cyan-400 mb-2">{m.num}</h3>
              <p className="text-lg font-semibold mb-2">{m.title}</p>
              <p className="text-gray-500 text-sm max-w-[220px]">{m.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================ HOW + WHAT YOU GET ============================ */}
      <section id="how" className="py-24 px-6 bg-[#0d0d0d]">
        <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-12">
          We Do Everything. You Get Bookings.
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          {[
            {
              icon: <Bot className="w-10 h-10 text-cyan-400 mb-3" />,
              title: "We Build It",
              text: "We custom-build your AI appointment setter around your offer, qualification rules, and booking flow.",
            },
            {
              icon: <Cpu className="w-10 h-10 text-cyan-400 mb-3" />,
              title: "We Connect Everything",
              text: "We connect your CRM, lead forms, ad platforms, phone system, and calendar so every lead routes instantly.",
            },
            {
              icon: <Zap className="w-10 h-10 text-cyan-400 mb-3" />,
              title: "Leads Get Booked",
              text: "Every new lead is called automatically within 60 seconds and booked directly on your calendar.",
            },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 bg-[#1a1a1a] rounded-2xl border border-gray-800"
            >
              {s.icon}
              <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm">{s.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-24">
          <motion.h3 {...fadeUp} className="text-3xl font-bold mb-6 text-center">
            What You Get
          </motion.h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
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
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="flex items-start gap-2"
              >
                <CheckCircle className="w-4 h-4 text-cyan-400 mt-1" />
                <p>{item}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ SERVICES ============================ */}
      <section id="services" className="py-24 px-6 bg-black">
        <motion.h2 {...fadeUp} className="text-4xl font-bold mb-12 text-center">
          Everything CallSetter.ai Handles For You
        </motion.h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-gray-300">
          {[
            "24/7 AI receptionist answering inbound calls",
            "Calling every new web lead within 60 seconds",
            "Reviving old and dead leads automatically",
            "Confirming booked appointments to reduce no-shows",
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ y: 8, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="p-4 bg-[#151515] rounded-xl border border-gray-800 flex items-center gap-3"
            >
              <Bot className="w-6 h-6 text-cyan-400" /> {s}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================ ROI ============================ */}
      <section id="roi" className="py-24 px-6 bg-[#0a0a0a]">
        <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-4">
          Calculate Your Lost Revenue
        </motion.h2>
        <motion.p
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.06 }}
          className="text-center text-gray-400 mb-12"
        >
          See what slow follow-up costs you.
        </motion.p>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 bg-[#111] p-8 rounded-2xl border border-gray-800">
          <div className="space-y-4">
            <input
              type="number"
              value={leads}
              onChange={(e) => setLeads(Number(e.target.value))}
              placeholder="Leads per month"
              className="w-full bg-black border border-gray-700 rounded-md p-2"
            />
            <input
              type="number"
              value={closeRate}
              onChange={(e) => setCloseRate(Number(e.target.value))}
              placeholder="Close rate (%)"
              className="w-full bg-black border border-gray-700 rounded-md p-2"
            />
            <input
              type="number"
              value={revenuePerCustomer}
              onChange={(e) => setRevenuePerCustomer(Number(e.target.value))}
              placeholder="Revenue per customer"
              className="w-full bg-black border border-gray-700 rounded-md p-2"
            />
            <p className="text-xs text-gray-500">Assumes a 20% lift from faster response time.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center items-center text-center"
          >
            <div className="text-gray-400 mb-2">Estimated Revenue Lost Per Month</div>
            <motion.div
              key={monthlyLoss}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-5xl font-extrabold mb-6 text-cyan-400"
            >
              ${monthlyLoss.toLocaleString()}
            </motion.div>
            <div className="text-gray-400 mb-2">Estimated Revenue Lost Per Year</div>
            <motion.div
              key={yearlyLoss}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold mb-8 text-cyan-300"
            >
              ${yearlyLoss.toLocaleString()}
            </motion.div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(true)}
                className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200"
              >
                <PhoneCall className="w-4 h-4 inline-block mr-2" /> Test The AI Setter Now!
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="border border-gray-600 px-6 py-3 rounded-full hover:bg-gray-800"
              >
                Book a Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================ FAQ ============================ */}
      <section id="faq" className="py-24 px-6 bg-black max-w-5xl mx-auto">
        <motion.h2 {...fadeUp} className="text-4xl font-bold mb-12 text-center">
          FAQ
        </motion.h2>
        <div className="space-y-4">
          {[
            { q: "Will this sound robotic?", a: "No. The voice is natural and designed for real conversations." },
            { q: "How fast can we go live?", a: "Most clients are live within a few days." },
            { q: "Does this integrate with my CRM?", a: "Yes. We support GHL and non-GHL setups." },
            { q: "What happens if a lead does not answer?", a: "The system follows up automatically based on your rules." },
          ].map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="bg-[#151515] border border-gray-800 rounded-lg p-4"
            >
              <summary className="cursor-pointer flex justify-between items-center font-semibold text-lg">
                {faq.q} <ChevronDown className="w-5 h-5" />
              </summary>
              <p className="text-gray-400 mt-2 text-sm">{faq.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* ============================ FINAL CTA ============================ */}
      <section id="cta" className="py-24 text-center bg-gradient-to-b from-[#0a0a0a] to-black relative overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent blur-3xl"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ repeat: Infinity, duration: 6 }}
        />
        <motion.h2 {...fadeUp} className="text-5xl font-bold mb-6 relative z-10">
          Try Call Setter AI Now!
        </motion.h2>
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(true)}
          className="bg-white text-black px-10 py-4 font-bold rounded-full text-lg hover:bg-gray-200 transition-all relative z-10 flex items-center gap-2 mx-auto"
        >
          <Bot className="w-6 h-6" /> Try Now!
        </motion.button>
      </section>

      {/* ============================ MODAL FORM ============================ */}
      {showForm && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#0f0f10] p-6 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Test the AI Setter"
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-2">Test The AI Setter</h3>
            <p className="text-sm text-gray-400 mb-6">
              Enter your details and we’ll connect you with a live AI voice demo.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full bg-black border rounded-md p-2 focus:outline-none focus:ring-2 ${
                    errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-cyan-500"
                  }`}
                  placeholder="Name"
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full bg-black border rounded-md p-2 focus:outline-none focus:ring-2 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-cyan-500"
                  }`}
                  placeholder="Email"
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  inputMode="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className={`w-full bg-black border rounded-md p-2 focus:outline-none focus:ring-2 ${
                    errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-cyan-500"
                  }`}
                  placeholder="Phone"
                />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>
              <button type="submit" className="w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200">
                Submit
              </button>
              {submitted && <p className="text-center text-sm text-green-400">Success! We'll be in touch shortly.</p>}
            </form>

            <p className="text-[11px] text-gray-500 mt-4">
              By submitting, you agree to be contacted by Call Setter AI for a demo.
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
