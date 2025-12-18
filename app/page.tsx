"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Check, ChevronDown, Phone, PhoneCall, Rocket, Timer, Zap, X, Play, ShieldCheck } from "lucide-react";

/**
 * CallSetter.ai — Voice AI Agency Landing
 * IMPORTANT: This file is intentionally plain JS (no TypeScript annotations)
 * so it will build cleanly in BOTH JS and TS Next.js projects on Vercel.
 *
 * If your site was failing to deploy, the most common cause is pasting TS types
 * into a JS project. This version fixes that.
 */

// ---------- THEME ----------
const BRAND = {
  purple: "#6D5EF3",
  nearBlack: "#0A0A0F",
  nearWhite: "#F3F4F6",
};

// Put your logo file in: /public/callsetterai-logo.png
// If your file name differs, update this string to match EXACTLY.
const LOGO_SRC = "/callsetterai-logo.png";

// ---------- HELPERS ----------
const formatMoney = (n) =>
  Number.isFinite(n)
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "$0";

function useRaf(callback) {
  const rafRef = useRef(0);
  const cbRef = useRef(callback);
  useEffect(() => {
    cbRef.current = callback;
  }, [callback]);
  useEffect(() => {
    let t = performance.now();
    const loop = () => {
      const now = performance.now();
      const dt = (now - t) / 1000;
      t = now;
      cbRef.current?.(dt);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);
}

// ---------- GLOBAL STYLES ----------
const GlobalStyles = () => (
  <style>{`
    :root { --brand: ${BRAND.purple}; --paper: ${BRAND.nearBlack}; --ink: ${BRAND.nearWhite}; }
    html, body { height: 100%; background: var(--paper); color: var(--ink); overflow-x: hidden; }
    body { overflow-y: auto; }
    ::selection { background: rgba(109,94,243,.45); color: white; }

    .btn-primary { background: var(--brand); color: #0B0B10; transition: transform .2s ease, box-shadow .3s ease; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 14px 44px -10px var(--brand); }

    .h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.05; letter-spacing: -0.01em; }
    .h2 { font-size: clamp(1.8rem, 3.6vw, 2.8rem); line-height: 1.08; letter-spacing: -0.01em; }
    .h3 { font-size: clamp(1.25rem, 2.6vw, 1.75rem); line-height: 1.15; }

    .odometer { transition: all .35s cubic-bezier(.2,.6,.2,1); }
    details[open] summary svg { transform: rotate(180deg); }
  `}</style>
);

// ---------- LOGO (with fallback) ----------
const Logo = ({ className = "h-7 md:h-8" }) => {
  const [ok, setOk] = useState(true);
  if (!ok) return <span className="font-semibold tracking-tight">CallSetter.ai</span>;
  return (
    <img
      src={LOGO_SRC}
      alt="CallSetter.ai"
      className={className + " object-contain"}
      onError={() => setOk(false)}
    />
  );
};

// ---------- VISUAL: HEX / SOUND WAVE BACKGROUND ----------
const HexWaveBackground = ({ intensity = 1, opacity = 0.9 }) => {
  const canvasRef = useRef(null);
  useRaf(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const px = (typeof window !== "undefined" ? window.devicePixelRatio : 1) || 1;
    const w = canvas.clientWidth * px;
    const h = canvas.clientHeight * px;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    // soft purple glow
    const g = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, Math.max(w, h));
    g.addColorStop(0, "rgba(109,94,243,0.18)");
    g.addColorStop(1, "rgba(109,94,243,0.02)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const size = 24 * px;
    const hexH = Math.sin(Math.PI / 3) * size;
    const hexW = size * 1.5;
    const time = performance.now() / 1200;

    ctx.lineWidth = 1 * px;

    for (let y = -size; y < h + size; y += hexH * 2) {
      for (let x = -size; x < w + size; x += hexW) {
        const offset = (Math.floor(y / (hexH * 2)) % 2) * (hexW / 2);
        const cx = x + offset;
        const cy = y;
        const d = Math.hypot(cx - w / 2, cy - h / 2);
        const wave = Math.sin(d / (80 * intensity) - time) * 0.5 + 0.5;
        const a = 0.06 + wave * 0.35 * opacity;

        // hex outline
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI / 3) * i + time * 0.06;
          const px2 = cx + size * Math.cos(ang);
          const py2 = cy + size * Math.sin(ang);
          if (i === 0) ctx.moveTo(px2, py2);
          else ctx.lineTo(px2, py2);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.35})`;
        ctx.stroke();

        // pulsing node dot
        const r = 1.5 * px + wave * 2.5 * px;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109,94,243,${a})`;
        ctx.fill();
      }
    }

    // scanline sweep
    const sweepY = (Math.sin(time * 0.7) * 0.5 + 0.5) * h;
    const sweep = ctx.createLinearGradient(0, sweepY - 80 * px, 0, sweepY + 80 * px);
    sweep.addColorStop(0, "rgba(109,94,243,0)");
    sweep.addColorStop(0.5, "rgba(109,94,243,0.25)");
    sweep.addColorStop(1, "rgba(109,94,243,0)");
    ctx.fillStyle = sweep;
    ctx.fillRect(0, sweepY - 120 * px, w, 240 * px);
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-90 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_85%)]"
      aria-hidden
    />
  );
};

// ---------- MODAL LEAD FORM ----------
const LeadFormModal = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle");

  const webhook = "https://hook.us2.make.com/685m5t1n8mbrsw27es0jar8s1tqb2ns7";

  const submit = async (e) => {
    e?.preventDefault?.();
    setStatus("loading");
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, source: "callsetter.ai-landing", timestamp: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Network error");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0E0E16] border border-white/10 shadow-2xl">
            <div className="absolute -inset-1 rounded-3xl opacity-30 blur-2xl" style={{ background: `radial-gradient(1200px_600px_at_50%_-20%, ${BRAND.purple}22, transparent 50%)` }} />
            <div className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="h3 font-semibold">Test The AI Setter</h3>
                  <p className="text-sm opacity-80 mt-1 max-w-md">Enter your details. Our AI voice agent will call you within moments to demo how we qualify and book leads automatically.</p>
                </div>
                <button onClick={onClose} className="opacity-70 hover:opacity-100"><X /></button>
              </div>

              {status !== "success" ? (
                <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm opacity-80">Name</label>
                    <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]" placeholder="Jane Doe" />
                  </div>
                  <div>
                    <label className="text-sm opacity-80">Email</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]" placeholder="jane@company.com" />
                  </div>
                  <div>
                    <label className="text-sm opacity-80">Phone</label>
                    <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]" placeholder="+1 (555) 123-4567" />
                  </div>
                  <p className="text-xs opacity-60">By submitting, you agree to receive a one-time automated call from our demo agent.</p>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={status === "loading"} className="btn-primary flex-1 rounded-2xl px-5 py-3 font-semibold flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" /> {status === "loading" ? "Connecting…" : "Call Me Now"}
                    </button>
                  </div>
                  {status === "error" && <div className="text-sm text-red-300">Something went wrong. Please try again.</div>}
                </form>
              ) : (
                <div className="mt-8 text-center space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-2xl grid place-items-center bg-[var(--brand)] text-[#0A0A10]"><ShieldCheck /></div>
                  <h4 className="text-xl font-semibold">You’re queued for a demo call.</h4>
                  <p className="opacity-80">Keep your phone nearby. Our AI setter will dial you shortly to show how instant qualification feels.</p>
                  <button onClick={onClose} className="btn-primary rounded-2xl px-5 py-3 font-semibold">Close</button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------- NAVBAR ----------
const Nav = ({ onOpen }) => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3 backdrop-blur bg-[rgba(10,10,15,.55)] border-b border-white/10">
        <a href="#top" className="flex items-center gap-3">
          <Logo />
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm opacity-85">
          <a href="#how" className="hover:text-white">How It Works</a>
          <a href="#get" className="hover:text-white">What You Get</a>
          <a href="#who" className="hover:text-white">Who It’s For</a>
          <a href="#faq" className="hover:text-white">FAQs</a>
          <button onClick={onOpen} className="btn-primary rounded-2xl px-4 py-2 font-semibold">Test Now</button>
        </nav>
        <button className="md:hidden rounded-xl border border-white/10 px-3 py-2" onClick={() => setOpen((v) => !v)}>
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden bg-[#0E0E16] border-b border-white/10">
            <div className="px-4 py-3 grid gap-2">
              <a onClick={() => setOpen(false)} href="#how" className="py-2">How It Works</a>
              <a onClick={() => setOpen(false)} href="#get" className="py-2">What You Get</a>
              <a onClick={() => setOpen(false)} href="#who" className="py-2">Who It’s For</a>
              <a onClick={() => setOpen(false)} href="#faq" className="py-2">FAQs</a>
              <button onClick={() => { setOpen(false); onOpen(); }} className="btn-primary rounded-2xl px-4 py-2 font-semibold">Test Now</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ---------- HERO ----------
const Hero = ({ onOpen }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section className="relative overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(109,94,243,.10)]/10 via-transparent to-transparent" />
        <HexWaveBackground />
        <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(255,255,255,.14),transparent_60%)] mix-blend-overlay" />
      </div>

      <motion.div style={{ y }} className="relative z-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto text-center max-w-3xl">
            <div className="flex items-center justify-center gap-3 opacity-90">
              <Logo className="h-8 md:h-10" />
            </div>

            <h1 className="h1 font-extrabold mt-6">
              Increase Your Booked Appointments <span className="text-[var(--brand)]">By 25%</span> In 30 Days <span className="text-[var(--brand)]">Guaranteed</span>
            </h1>
            <p className="mt-4 text-lg opacity-80">CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.</p>

            <div className="mt-8 flex items-center justify-center">
              <button onClick={onOpen} className="btn-primary rounded-2xl px-6 py-4 font-semibold text-base flex items-center gap-2">
                <PhoneCall className="w-5 h-5" /> Test The AI Setter Now
              </button>
            </div>

            <div className="mt-10 flex items-end justify-center gap-1 h-10" aria-hidden>
              {[...Array(24)].map((_, i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-[var(--brand)]/80"
                  initial={{ height: 6 }}
                  animate={{ height: [6, 28, 12, 22, 10, 30, 6] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.05, ease: "easeInOut" }}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-10 mt-14">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur p-3">
            <div className="rounded-2xl bg-[#0E0E16] p-4 md:p-6 flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="h3 font-semibold">Instant AI Caller</h3>
                <p className="opacity-80 max-w-xl mt-1">See it live: our demo agent dials new leads in under 60 seconds and books directly on the calendar.</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onOpen} className="btn-primary rounded-2xl px-5 py-3 font-semibold flex items-center gap-2"><Play size={18} /> Try Now</button>
                <a href="#how" className="rounded-2xl px-5 py-3 font-semibold border border-white/10">How it works</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------- DATA SECTION ----------
const Metrics = () => {
  const items = [
    { kpi: "391%", label: "Higher Conversion", desc: "Leads contacted within the first minute convert dramatically more often." },
    { kpi: "10x", label: "More Likely to Connect", desc: "Calling within five minutes massively increases contact rates." },
    { kpi: "80%", label: "Drop After 5 Minutes", desc: "Contact rates collapse when response is delayed." },
    { kpi: "24/7", label: "Instant Coverage", desc: "Leads are called day, night, and weekends." },
  ];

  return (
    <section id="why" className="relative py-16 md:py-24">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 left-0 right-0 mx-auto h-64 w-[90%] rounded-[36px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(109,94,243,.15),transparent)] blur-2xl" />
      </div>
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="h2 font-bold">Why Speed‑to‑Lead Works</h2>
          <p className="opacity-80 mt-2">The data is clear: the faster you respond, the more deals you close.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-white/10 bg-[#0E0E16]/60 p-6">
              <div className="text-5xl font-black tracking-tight text-[var(--brand)]">{it.kpi}</div>
              <div className="mt-2 font-semibold">{it.label}</div>
              <div className="mt-1 text-sm opacity-75">{it.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- OUTCOME (with visuals) ----------
const Outcome = () => (
  <section className="relative py-16 md:py-24 overflow-hidden">
    <div className="absolute inset-0 -z-0">
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(109,94,243,.14),transparent_60%)]" />
      <HexWaveBackground intensity={1.1} opacity={0.6} />
      <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden>
        {[...Array(6)].map((_, i) => (
          <circle key={i} cx="600" cy="280" r={(i + 1) * 80} fill="none" stroke="rgba(109,94,243,0.25)" strokeWidth="1" />
        ))}
      </svg>
    </div>
    <div className="mx-auto max-w-5xl px-4 text-center relative z-10">
      <h2 className="h2 font-bold max-w-4xl mx-auto">Respond To All Leads Within 60 Seconds And Take Leads 24/7</h2>
      <p className="mt-6 text-lg opacity-85 max-w-3xl mx-auto">By calling new leads in under 60 seconds and following up consistently, businesses typically see a 15 to 25 percent increase in booked appointments within the first 30 days.</p>
      <div className="mt-6 grid gap-2 font-semibold">
        <div>No changes to ads.</div>
        <div>No new hires.</div>
        <div>Just faster, consistent execution.</div>
      </div>
    </div>
  </section>
);

// ---------- HOW IT WORKS + WHAT YOU GET ----------
const HowItWorks = () => (
  <section id="how" className="relative py-16 md:py-24">
    <div className="mx-auto max-w-6xl px-4">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-10">
        <div className="text-center">
          <h3 className="h2 font-bold">We Do Everything. You Get Bookings.</h3>
          <p className="opacity-80 mt-2">100% done for you. Installed inside your business. Nothing DIY. Nothing half‑built.</p>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "We Build It", desc: "We custom-build your AI appointment setter around your offer, qualification rules, and booking flow.", icon: Rocket },
            { title: "We Connect Everything", desc: "We connect your CRM, lead forms, ad platforms, phone system, and calendar so every lead routes instantly.", icon: Zap },
            { title: "Leads Get Booked", desc: "Every new lead is called automatically within 60 seconds, qualified, and booked directly on your calendar.", icon: Timer },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="rounded-2xl border border-white/10 bg-[#0E0E16] p-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/20 text-[var(--brand)] grid place-items-center">{React.createElement(s.icon)}</div>
              <div className="mt-4 font-semibold text-xl">{s.title}</div>
              <div className="mt-2 opacity-80 text-sm">{s.desc}</div>
            </motion.div>
          ))}
        </div>

        <div id="get" className="mt-12 pt-8 border-t border-white/10">
          <h4 className="h3 font-bold">What You Get</h4>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
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
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-3 py-2">
                <div className="mt-1 w-5 h-5 rounded-full bg-[var(--brand)]/20 text-[var(--brand)] grid place-items-center flex-none"><Check size={14} /></div>
                <div className="text-sm md:text-base">{line}</div>
              </div>
            ))}
          </div>
          <p className="text-xs opacity-60 mt-4">All setup is handled inside your business. Nothing is outsourced to templates.</p>
        </div>
      </div>
    </div>
  </section>
);

// ---------- SERVICES ----------
const Services = () => (
  <section className="relative py-16 md:py-24">
    <div className="mx-auto max-w-6xl px-4">
      <h3 className="h2 font-bold max-w-3xl">Everything CallSetter.ai Handles For You</h3>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "24/7 AI receptionist answering inbound calls",
          "Calling every new web lead within 60 seconds",
          "Reviving old and dead leads automatically",
          "Confirming booked appointments to reduce no-shows",
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="font-semibold">{s}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ---------- ROI CALCULATOR ----------
const ROICalc = ({ onOpen }) => {
  const [leads, setLeads] = useState(300);
  const [closeRate, setCloseRate] = useState(10);
  const [revPer, setRevPer] = useState(1500);
  const lift = 0.2;

  const lostMonthly = useMemo(() => Math.max(0, leads * (closeRate / 100) * revPer * lift), [leads, closeRate, revPer]);
  const lostYearly = lostMonthly * 12;
  const extraCustomers = useMemo(() => Math.max(0, leads * (closeRate / 100) * lift), [leads, closeRate]);

  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <h3 className="h2 font-bold">Calculate Your Lost Revenue</h3>
          <p className="opacity-80 mt-2">See what slow follow‑up costs you.</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#0E0E16]/70 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="text-sm opacity-80">Leads Per Month</label>
                <input type="number" value={leads} onChange={(e) => setLeads(Number(e.target.value))} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]" placeholder="300" />
              </div>
              <div>
                <label className="text-sm opacity-80">Close Rate (%)</label>
                <div className="text-xs opacity-60">Percent of leads that become customers</div>
                <input type="number" value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value))} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]" placeholder="10" />
              </div>
              <div>
                <label className="text-sm opacity-80">Revenue Per Customer</label>
                <input type="number" value={revPer} onChange={(e) => setRevPer(Number(e.target.value))} className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]" placeholder="1500" />
              </div>
              <div className="text-xs opacity-60">Assumes a 20% lift from faster response time.</div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 grid place-items-center">
            <div className="w-full max-w-sm text-center">
              <div className="text-sm opacity-80">Estimated Revenue Lost Per Month</div>
              <div className="odometer text-5xl md:text-6xl font-black tracking-tight text-[var(--brand)] mt-2">{formatMoney(lostMonthly)}</div>

              <div className="mt-6 text-sm opacity-80">Estimated Revenue Lost Per Year</div>
              <div className="odometer text-4xl md:text-5xl font-extrabold tracking-tight mt-1">{formatMoney(lostYearly)}</div>

              <div className="mt-4 text-xs opacity-70">Estimated additional customers with faster response: <span className="font-semibold">{Math.round(extraCustomers)}</span></div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={onOpen} className="btn-primary rounded-2xl px-5 py-3 font-semibold flex-1">Test The AI Setter Now!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------- WHO THIS IS FOR ----------
const ForWho = () => (
  <section id="who" className="relative py-16 md:py-24">
    <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="h2 font-bold">Built for Businesses That Book Appointments for Revenue</h3>
        <p className="mt-4 opacity-85">CallSetter.ai is designed for businesses where booked appointments directly drive sales. If you generate leads, rely on scheduled calls, or spend over five thousand per month on ads, faster response time is not optional. It is the difference between winning and losing the deal.</p>
      </div>
      <div>
        <ul className="space-y-3">
          {[
            "Lead generation agencies",
            "Local and national service businesses",
            "High-ticket sales teams",
            "Advertisers buying inbound leads at scale",
          ].map((x, i) => (
            <li key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--brand)]" />
              <span className="font-medium">{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

// ---------- FAQ ----------
const FAQ = () => (
  <section id="faq" className="relative py-16 md:py-24">
    <div className="mx-auto max-w-4xl px-4">
      <h3 className="h2 font-bold text-center">FAQ</h3>
      <div className="mt-8 space-y-3">
        {[
          { q: "Will this sound robotic?", a: "No. The voice is natural and designed for real conversations." },
          { q: "How fast can we go live?", a: "Most clients are live within a few days." },
          { q: "Does this integrate with my CRM?", a: "Yes. We support GHL and non-GHL setups." },
          { q: "What happens if a lead does not answer?", a: "The system follows up automatically based on your rules." },
        ].map((f, i) => (
          <details key={i} className="group rounded-2xl border border-white/10 bg-[#0E0E16] p-4">
            <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
              <div className="font-semibold">{f.q}</div>
              <ChevronDown className="transition-transform" />
            </summary>
            <div className="mt-3 opacity-80 text-sm">{f.a}</div>
          </details>
        ))}
      </div>
    </div>
  </section>
);

// ---------- FINAL CTA ----------
const FinalCTA = ({ onOpen }) => (
  <section className="relative py-20 md:py-28 overflow-hidden">
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0" style={{ background: `radial-gradient(1200px_600px_at_50%_10%, ${BRAND.purple}22, transparent 60%)` }} />
      <HexWaveBackground intensity={1.2} opacity={0.8} />
    </div>
    <div className="mx-auto max-w-5xl px-4 text-center">
      <h3 className="h2 font-extrabold">Try Call Setter AI Now!</h3>
      <p className="mt-3 opacity-80">Highest-contrast section on the page — this is the close.</p>
      <div className="mt-8 flex items-center justify-center">
        <button onClick={onOpen} className="btn-primary rounded-2xl px-6 py-4 font-semibold text-base flex items-center gap-2"><PhoneCall className="w-5 h-5" /> Try Now!</button>
      </div>
    </div>
  </section>
);

// ---------- FOOTER ----------
const Footer = () => (
  <footer className="border-t border-white/10 py-10">
    <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Logo />
      </div>
      <div className="text-sm opacity-70">© {new Date().getFullYear()} CallSetter.ai — All rights reserved.</div>
    </div>
  </footer>
);

// ---------- PAGE ----------
export default function CallSetterAI() {
  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--brand", BRAND.purple);
    }
  }, []);

  return (
    <div id="top" className="min-h-screen flex flex-col" style={{ background: BRAND.nearBlack, color: BRAND.nearWhite }}>
      <GlobalStyles />
      <Nav onOpen={() => setModal(true)} />

      <main className="flex-1">
        <Hero onOpen={() => setModal(true)} />
        <Metrics />
        <Outcome />
        <HowItWorks />
        <Services />
        <ROICalc onOpen={() => setModal(true)} />
        <ForWho />
        <FAQ />
        <FinalCTA onOpen={() => setModal(true)} />
      </main>

      <Footer />
      <LeadFormModal open={modal} onClose={() => setModal(false)} />
    </div>
  );
}
