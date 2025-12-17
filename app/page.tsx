"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, CheckCircle, Zap, PhoneCall, Cpu, Bot } from "lucide-react";

const LOGO_SRC = "/logo-callsetterai.png";
const BUILD_ID = "app-router-v1"; // you should see this bottom-right

const PURPLE = "#5A46F6";
const PURPLE_2 = "#7C6CFD";
const INK = "#0B0A12";

function HeroWaveVideoBG() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    // particles
    const particles = Array.from({ length: 30 }).map((_, i) => ({
      x: (i * 97) % 1200,
      y: (i * 173) % 800,
      r: 1.2 + (i % 5) * 0.5,
      s: 0.18 + (i % 7) * 0.03,
      p: (i * 0.37) % Math.PI,
    }));

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

      // vignette
      const g = ctx.createRadialGradient(w * 0.5, h * 0.1, 0, w * 0.5, h * 0.2, Math.max(w, h));
      g.addColorStop(0, "rgba(122,101,255,0.22)");
      g.addColorStop(0.55, "rgba(0,0,0,0)");
      g.addColorStop(1, INK);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // hex grid
      const driftX = Math.sin(t * 0.35) * 18;
      const driftY = Math.cos(t * 0.28) * 12;
      ctx.save();
      ctx.globalAlpha = 0.22 + 0.06 * Math.sin(t * 0.7);
      const xStep = hexR * 1.52;
      const yStep = hexH * 2.0;
      for (let row = -3; row < h / yStep + 4; row++) {
        for (let col = -3; col < w / xStep + 4; col++) {
          const x = col * xStep + (row % 2 ? xStep * 0.5 : 0) + driftX;
          const y = row * yStep + driftY;
          const nx = (x - w * 0.5) / (w * 0.5);
          const ny = (y - h * 0.25) / (h * 0.75);
          const falloff = Math.max(0, 1 - (nx * nx + ny * ny));
          drawHex(x, y, 0.28 * falloff);
        }
      }
      ctx.restore();

      // waves
      const waveCount = 6;
      for (let i = 0; i < waveCount; i++) {
        const phase = t * (0.95 + i * 0.12);
        const baseY = h * (0.40 + i * 0.045);
        const amp = 28 + i * 7;
        const freq = 0.0085 + i * 0.0011;

        // glow
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.lineWidth = 11;
        ctx.strokeStyle = i % 2 === 0 ? PURPLE_2 : PURPLE;
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

        // crisp
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

      // particles
      ctx.save();
      for (const p of particles) {
        p.p += 0.01 * p.s;
        p.y -= p.s * 0.9;
        if (p.y < -24) p.y = h + 24;

        const tw = 0.35 + 0.25 * Math.sin(t * 2 + p.p);
        ctx.beginPath();
        ctx.fillStyle = `rgba(124,108,253,${0.20 + tw})`;
        ctx.arc((p.x / 1200) * w, (p.y / 800) * h + Math.sin(t + p.p) * 10, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      <canvas ref={canvasRef} className="w-full h-full" />
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
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setForm({ name: "", email: "", phone: "" });
    }, 1200);
  }

  const CTA = ({ label }: { label: string }) => (
    <button
      onClick={() => setShowForm(true)}
      className="inline-flex items-center justify-center font-semibold px-8 py-3 rounded-md text-white transition-colors"
      style={{ backgroundColor: PURPLE }}
      onMouseEnter={(e) => ((e.currentTarget.style.backgroundColor = PURPLE_2))}
      onMouseLeave={(e) => ((e.currentTarget.style.backgroundColor = PURPLE))}
    >
      <PhoneCall className="w-5 h-5 mr-2" />
      {label}
    </button>
  );

  const fadeUp = {
    initial: { y: 16, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: "easeOut" },
    viewport: { once: true, amount: 0.2 },
  } as const;

  return (
    <div className="relative min-h-screen bg-[#0B0A12] text-white">
      {/* BUILD STAMP to confirm latest deploy */}
      <div className="fixed bottom-2 right-2 text-[10px] text-white/40 z-[9999]">{BUILD_ID}</div>

      {/* NAV */}
      <header className={`fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all duration-300 ${scrolled ? "bg-[#0b0a12]/85 backdrop-blur-md py-2" : "bg-[#0b0a12]/60 py-4"}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="Call Setter AI" className="h-8 w-auto" />
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

        <motion.div initial={{ y: 0 }} animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6 text-white/60 flex items-center gap-2">
          <span className="text-xs">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>

        <div className="absolute top-28 left-6 hidden md:flex items-center gap-2 text-xs bg-white/5 border border-white/10 rounded-md px-3 py-1">
          <Sparkles className="w-3.5 h-3.5 text-[#7C6CFD]" /> Real-time lead calls
        </div>
      </section>

      {/* WHY */}
      <section className="py-20 text-center">
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
                <div className="text-5xl font-extrabold mb-3" style={{ color: PURPLE }}>{m.num}</div>
                <div className="text-lg font-semibold mb-1">{m.title}</div>
                <div className="text-sm text-white/70">{m.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* (rest of your sections can stay the same — this is enough to fix “white page” + background now) */}

      {/* MODAL */}
      {showForm && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative z-10 w-full max-w-md bg-[#11101a] border border-white/10 rounded-2xl p-6"
          >
            <button onClick={() => setShowForm(false)} className="absolute right-3 top-3 text-white/60 hover:text-white">✕</button>
            <h3 className="text-2xl font-bold mb-2">Test The AI Setter</h3>
            <p className="text-sm text-white/70 mb-6">Enter your details and we’ll connect you with a live AI voice demo.</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-md p-2" placeholder="Name" />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
              <div>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-md p-2" placeholder="Email" />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <input inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-black/60 border border-white/10 rounded-md p-2" placeholder="Phone" />
                {errors.phone && <p className="text-xs text-red-400 mt-1">{errors.phone}</p>}
              </div>
              <button type="submit" className="w-full font-semibold px-6 py-3 rounded-md text-white" style={{ backgroundColor: PURPLE }}>
                Submit
              </button>
              {submitted && <p className="text-center text-sm text-emerald-400">Success! We'll be in touch shortly.</p>}
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
