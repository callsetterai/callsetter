"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, CheckCircle, Zap, PhoneCall, Cpu, Bot, Sparkles } from "lucide-react";

const LOGO_SRC = "/logo-callsetterai.png";

// CHANGE THIS each time you want to confirm you see the newest deploy
const BUILD_ID = "waves-v12";

const PURPLE = "#5A46F6";
const PURPLE_2 = "#7C6CFD";
const INK = "#0B0A12";

/**
 * Canvas hero background:
 * - Always-on (no scroll dependency)
 * - “Video-like” waves + hex field + particles
 * - Visible immediately on load
 */
function HeroWaveVideoBG() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize, { passive: true });

    // Deterministic particles
    const particles = Array.from({ length: 34 }).map((_, i) => {
      const seed = (i + 1) * 997;
      const rand = (n: number) => {
        const x = Math.sin(seed * n) * 10000;
        return x - Math.floor(x);
      };
      return {
        x: rand(1) * 1600,
        y: rand(2) * 900,
        r: 1.3 + rand(3) * 2.6,
        sp: 0.18 + rand(4) * 0.55,
        ph: rand(5) * Math.PI * 2,
      };
    });

    const hexR = 13;
    const hexH = Math.sin(Math.PI / 3) * hexR;

    const drawHex = (x: number, y: number, a: number) => {
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const ang = (Math.PI / 3) * k + Math.PI / 6;
        const px = x + Math.cos(ang) * hexR;
        const py = y + Math.sin(ang) * hexR;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(122,101,255,${a})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const draw = (tms: number) => {
      const t = tms * 0.001;

      ctx.clearRect(0, 0, w, h);

      // Background wash/vignette
      const grad = ctx.createRadialGradient(w * 0.5, h * 0.08, 0, w * 0.5, h * 0.2, Math.max(w, h));
      grad.addColorStop(0, "rgba(122,101,255,0.22)");
      grad.addColorStop(0.55, "rgba(0,0,0,0)");
      grad.addColorStop(1, INK);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Hex field drift
      const driftX = Math.sin(t * 0.35) * 18;
      const driftY = Math.cos(t * 0.28) * 12;

      ctx.save();
      ctx.globalAlpha = 0.22 + 0.08 * Math.sin(t * 0.7);
      const xStep = hexR * 1.52;
      const yStep = hexH * 2.0;

      for (let row = -3; row < h / yStep + 4; row++) {
        for (let col = -3; col < w / xStep + 4; col++) {
          const x = col * xStep + (row % 2 ? xStep * 0.5 : 0) + driftX;
          const y = row * yStep + driftY;

          // mask for a callers.ai-ish focus near top-center
          const nx = (x - w * 0.5) / (w * 0.5);
          const ny = (y - h * 0.25) / (h * 0.75);
          const falloff = Math.max(0, 1 - (nx * nx + ny * ny));
          drawHex(x, y, 0.26 * falloff);
        }
      }
      ctx.restore();

      // Wave energy bands (more “AI-ish” layering)
      const waveCount = 6;
      for (let i = 0; i < waveCount; i++) {
        const phase = t * (0.95 + i * 0.12);
        const baseY = h * (0.40 + i * 0.045);
        const amp = 28 + i * 7;
        const freq = 0.0085 + i * 0.0011;

        // Glow underlay
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.strokeStyle = i % 2 === 0 ? PURPLE_2 : PURPLE;
        ctx.lineWidth = 11;
        ctx.shadowColor = i % 2 === 0 ? "rgba(124,108,253,0.55)" : "rgba(90,70,246,0.55)";
        ctx.shadowBlur = 26;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 10) {
          const n =
            Math.sin(phase + x * freq) * 0.9 +
            Math.sin(phase * 1.3 + x * freq * 0.62) * 0.55 +
            Math.sin(phase * 0.7 + x * freq * 1.8) * 0.25;
          const y = baseY + n * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Crisp line
        ctx.save();
        ctx.globalAlpha = 0.72 - i * 0.07;
        ctx.lineWidth = i === 2 ? 2.6 : 2.0;
        ctx.strokeStyle = i === 2 ? "rgba(255,255,255,0.22)" : `rgba(122,101,255,${0.70 - i * 0.08})`;
        if (i === 2) ctx.setLineDash([10, 12]);
        else ctx.setLineDash([]);

        ctx.beginPath();
        for (let x = 0; x <= w; x += 8) {
          const n =
            Math.sin(phase + x * freq) * 0.9 +
            Math.sin(phase * 1.3 + x * freq * 0.62) * 0.55 +
            Math.sin(phase * 0.7 + x * freq * 1.8) * 0.25;
          const y = baseY + n * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Particles
      ctx.save();
      for (const p of particles) {
        p.ph += 0.01 * p.sp;
        p.y -= p.sp * 0.9;
        if (p.y < -24) p.y = h + 24;

        const tw = 0.35 + 0.25 * Math.sin(t * 2 + p.ph);
        ctx.beginPath();
        ctx.fillStyle = `rgba(124,108,253,${0.20 + tw})`;
        ctx.arc((p.x / 1600) * w, (p.y / 900) * h + Math.sin(t + p.ph) * 10, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-20">
      <canvas ref={canvasRef} className="w-full h-full" />
      {/* Extra blending overlays (adds depth) */}
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(122,101,255,0.18),transparent_60%),radial-gradient(900px_460px_at_90%_10%,rgba(90,70,246,0.16),transparent_70%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0B0A12]" />
    </div>
  );
}

export default function Page() {
  const [leads, setLeads] = useState(300);
  const [closeRate, setCloseRate] = useState(10);
  const [revenuePerCustomer, setRevenuePerCustomer] = useState(1500);
  const [scrolled, setScrolled] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitted, setSubmitted] = useState(false);

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

    // Hook your voice agent here if needed:
    // await fetch("YOUR_WEBHOOK_URL", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(form) });

    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "" });
    }, 1200);
  }

  const CTA = ({ label, big }: { label: string; big?: boolean }) => (
    <button
      onClick={() => setShowForm(true)}
      className={`inline-flex items-center justify-center text-white rounded-md transition-colors duration-200 ${
        big ? "font-bold px-10 py-4 text-lg" : "font-semibold px-8 py-3"
      }`}
      style={{ backgroundColor: PURPLE }}
      onMouseEnter={(e) => ((e.currentTarget.style.backgroundColor = PURPLE_2))}
      onMouseLeave={(e) => ((e.currentTarget.style.backgroundColor = PURPLE))}
    >
      <PhoneCall className={`${big ? "w-6 h-6" : "w-5 h-5"} mr-2`} />
      {label}
    </button>
  );

  return (
    <div className="relative bg-[#0B0A12] text-white">
      {/* BUILD STAMP (so you know you're on latest deploy) */}
      <div className="fixed bottom-2 right-2 text-[10px] text-white/40 z-[9999]">
        {BUILD_ID}
      </div>

      {/* NAV */}
      <header className={`fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all duration-300 ${scrolled ? "bg-[#0b0a12]/85 backdrop-blur-md py-2" : "bg-[#0b0a12]/60 py-4"}`}>
        <div className="container-xl flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="Call Setter AI" className="h-8 w-auto" />
            <span className="sr-only">Call Setter AI</span>
          </a>
          <CTA label="Test The AI Setter Now" />
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex flex-col justify-center items-center text-center overflow-hidden pt-28">
        <HeroWaveVideoBG />

        <motion.h1 {...fadeUp} className="text-5xl md:text-6xl font-extrabold max-w-4xl leading-tight tracking-tight">
          Increase Your Booked Appointments By 25% In 30 Days Guaranteed
        </motion.h1>

        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="text-lg text-white/70 max-w-2xl mt-4">
          CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
        </motion.p>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="mt-8">
          <CTA label="Test The AI Setter Now!" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="absolute top-28 left-6 hidden md:flex items-center gap-2 text-xs bg-white/5 border border-white/10 rounded-md px-3 py-1">
          <Sparkles className="w-3.5 h-3.5 text-[#7C6CFD]" /> Real-time lead calls
        </motion.div>

        <motion.div initial={{ y: 0 }} animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6 text-white/60 flex items-center gap-2">
          <span className="text-xs">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* WHY */}
      <section id="why" className="py-20 text-center">
        <div className="container-xl">
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
              <motion.div key={i} initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, delay: i * 0.05 }} viewport={{ once: true }} className="card p-6 text-left">
                <div className="text-5xl font-extrabold mb-3" style={{ color: PURPLE }}>{m.num}</div>
                <div className="text-lg font-semibold mb-1">{m.title}</div>
                <div className="text-sm text-white/70">{m.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOME */}
      <section className="py-24 bg-[#0f0e18]">
        <div className="container-xl text-center">
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

      {/* HOW + WHAT YOU GET */}
      <section id="how" className="py-24">
        <div className="container-xl">
          <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-12">We Do Everything. You Get Bookings.</motion.h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              { icon: <Bot className="w-10 h-10 text-[#7C6CFD]" />, title: "We Build It", text: "We custom-build your AI appointment setter around your offer, qualification rules, and booking flow." },
              { icon: <Cpu className="w-10 h-10 text-[#7C6CFD]" />, title: "We Connect Everything", text: "We connect your CRM, lead forms, ad platforms, phone system, and calendar so every lead routes instantly." },
              { icon: <Zap className="w-10 h-10 text-[#7C6CFD]" />, title: "Leads Get Booked", text: "Every new lead is called automatically within 60 seconds, qualified, and booked directly on your calendar." },
            ].map((s, i) => (
              <motion.div key={i} initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }} className="card p-6">
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
                  <CheckCircle className="w-4 h-4 mt-1" style={{ color: PURPLE }} />
                  <p className="text-gray-200">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
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
                <Bot className="w-6 h-6 text-[#7C6CFD]" /> {s}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section id="roi" className="py-24">
        <div className="container-xl">
          <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-4">Calculate Your Lost Revenue</motion.h2>
          <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-center text-white/70 mb-10">
            See what slow follow-up costs you.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-6 card p-8">
            <div className="space-y-4">
              <label className="block text-sm text-white/70">Leads Per Month</label>
              <input type="number" value={leads} onChange={(e) => setLeads(Number(e.target.value))} className="w-full bg-black/60 border border-white/10 rounded-md p-2" />
              <label className="block text-sm text-white/70 mt-4">Close Rate (%)</label>
              <input type="number" value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value))} className="w-full bg-black/60 border border-white/10 rounded-md p-2" />
              <label className="block text-sm text-white/70 mt-4">Revenue Per Customer</label>
              <input type="number" value={revenuePerCustomer} onChange={(e) => setRevenuePerCustomer(Number(e.target.value))} className="w-full bg-black/60 border border-white/10 rounded-md p-2" />
              <p className="text-xs text-white/50">Assumes a 20% lift from faster response time.</p>
            </div>

            <div className="flex flex-col justify-center items-center text-center">
              <div className="text-white/70 mb-2">Estimated Revenue Lost Per Month</div>
              <div className="text-5xl font-extrabold mb-6" style={{ color: PURPLE }}>${monthlyLoss.toLocaleString()}</div>
              <div className="text-white/70 mb-2">Estimated Revenue Lost Per Year</div>
              <div className="text-3xl font-bold mb-8 text-[#C8C2FF]">${yearlyLoss.toLocaleString()}</div>
              <CTA label="Test The AI Setter Now!" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
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
                <p className="text-white/70 mt-2 text-sm">{faq.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="cta" className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_320px_at_50%_0%,rgba(122,101,255,0.22),transparent_70%)]" />
        <motion.h2 {...fadeUp} className="text-5xl font-bold mb-6">Try Call Setter AI Now!</motion.h2>
        <div className="flex items-center justify-center">
          <CTA label="Try Now!" big />
        </div>
      </section>

      {/* MODAL FORM */}
      {showForm && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <motion.div initial={{ y: 20, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="relative z-10 w-full max-w-md card p-6" role="dialog" aria-modal="true" aria-label="Test the AI Setter">
            <button onClick={() => setShowForm(false)} className="absolute right-3 top-3 text-white/60 hover:text-white" aria-label="Close">✕</button>
            <h3 className="text-2xl font-bold mb-2">Test The AI Setter</h3>
            <p className="text-sm text-white/70 mb-6">Enter your details and we’ll connect you with a live AI voice demo.</p>

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
