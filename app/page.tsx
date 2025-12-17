"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Check, ChevronDown, Phone, PhoneCall, Rocket, Timer, Zap, X, Play, ShieldCheck } from "lucide-react";

/**
 * CallSetter.ai — Voice AI Agency Landing (Client Build)
 * - Single CTA only. No pricing. No sticky bar.
 * - Navbar: How It Works, What You Get, Who It’s For, FAQs.
 * - Hex/sound-wave visuals and concentric rings behind outcome section.
 * - Modal posts name/email/phone to your Make webhook.
 */

// THEME
const BRAND = {
  purple: "#6D5EF3",
  nearBlack: "#0A0A0F",
  nearWhite: "#F3F4F6"
};

// Path to your uploaded logo in /public
const LOGO_SRC = "/callsetterai-logo.png";

// HELPERS
const formatMoney = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function useRaf(callback: (dt: number) => void) {
  const rafRef = useRef<number>(0);
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

// GLOBAL STYLES (inline for brand vars + micro styles)
const GlobalStyles = () => (
  <style>{`
    :root { --brand: ${BRAND.purple}; --paper: ${BRAND.nearBlack}; --ink: ${BRAND.nearWhite}; }
    html, body, #root { height: 100%; background: var(--paper); color: var(--ink); }
    ::selection { background: color-mix(in oklab, var(--brand) 60%, black); color: white; }

    .btn-primary { background: var(--brand); color: #0B0B10; transition: transform .2s ease, box-shadow .3s ease; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 14px 44px -10px var(--brand); }

    .h1 { font-size: clamp(2.5rem, 5vw, 4.5rem); line-height: 1.05; letter-spacing: -0.01em; }
    .h2 { font-size: clamp(1.8rem, 3.6vw, 2.8rem); line-height: 1.08; letter-spacing: -0.01em; }
    .h3 { font-size: clamp(1.25rem, 2.6vw, 1.75rem); line-height: 1.15; }

    .odometer { transition: all .35s cubic-bezier(.2,.6,.2,1); }
    details[open] summary svg { transform: rotate(180deg); }
  `}</style>
);

// HEX / SOUND WAVE BG
const HexWaveBackground: React.FC<{ intensity?: number; opacity?: number }> = ({ intensity = 1, opacity = 0.9 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
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

        const r = 1.5 * px + wave * 2.5 * px;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109,94,243,${a})`;
        ctx.fill();
      }
    }

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
      className="absolute inset-0 w-full h-full opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_85%)]"
      aria-hidden
    />
  );
};

// MODAL
const LeadFormModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const webhook = "https://hook.us2.make.com/685m5t1n8mbrsw27es0jar8s1tqb2ns7";

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          source: "callsetter.ai-landing",
          timestamp: new Date().toISOString()
        })
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
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/60" onClick={onClose} />
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-[#0E0E16] border border-white/10 shadow-2xl"
          >
            <div
              className="absolute -inset-1 rounded-3xl opacity-30 blur-2xl"
              style={{ background: `radial-gradient(1200px_600px_at_50%_-20%, ${BRAND.purple}22, transparent 50%)` }}
            />
            <div className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="h3 font-semibold">Test The AI Setter</h3>
                  <p className="text-sm opacity-80 mt-1 max-w-md">
                    Enter your details. Our AI voice agent will call you within moments to demo how we qualify and book leads automatically.
                  </p>
                </div>
                <button onClick={onClose} className="opacity-70 hover:opacity-100">
                  <X />
                </button>
              </div>

              {status !== "success" ? (
                <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm opacity-80">Name</label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm opacity-80">Email</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]"
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm opacity-80">Phone</label>
                    <input
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <p className="text-xs opacity-60">
                    By submitting, you agree to receive a one-time automated call from our demo agent.
                  </p>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="btn-primary flex-1 rounded-2xl px-5 py-3 font-semibold flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" /> {status === "loading" ? "Connecting…" : "Call Me Now"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-8 text-center space-y-4">
                  <div className="mx-auto w-14 h-14 rounded-2xl grid place-items-center bg-[var(--brand)] text-[#0A0A10]">
                    <ShieldCheck />
                  </div>
                  <h4 className="text-xl font-semibold">You’re queued for a demo call.</h4>
                  <p className="opacity-80">
                    Keep your phone nearby. Our AI setter will dial you shortly to show how instant qualification feels.
                  </p>
                  <button onClick={onClose} className="btn-primary rounded-2xl px-5 py-3 font-semibold">
                    Close
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// NAV
const Nav: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3 backdrop-blur bg-[rgba(10,10,15,.55)] border-b border-white/10">
        <a href="#top" className="flex items-center gap-3">
          <img src={LOGO_SRC} alt="CallSetter.ai" className="h-7 md:h-8 object-contain" />
          <span className="sr-only">CallSetter.ai</span>
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
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#0E0E16] border-b border-white/10"
          >
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

// HERO
const Hero: React.FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section className="relative overflow-hidden pt-16 md:pt-20">
      <div className="absolute inset-0 -z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(109,94,243,.10)]/10 via-transparent to-transparent" />
        <HexWaveBackground />
        <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(255,255,255,.14),transparent_60%)] mix-blend-overlay" />
      </div>

      <motion.div style={{ y }} className="relative z-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto text-center max-w-3xl">
            <div className="flex items-center justify-center gap-3 opacity-90">
              <img src={LOGO_SRC} alt="CallSetter.ai" className="h-8 md:h-10 object-contain" />
            </div>

            <h1 className="h1 font-extrabold mt-6">
              Increase Your Booked Appointments <span className="text-[var(--brand)]">By 25%</span> In 30 Days <span className="text-[var(--brand)]">Guaranteed</span>
            </h1>
            <p className="mt-4 text-lg opacity-80">
              CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
            </p>

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
                <p className="opacity-80 max-w-xl mt-1">
                  See it live: our demo agent dials new leads in under 60 seconds and books directly on the calendar.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onOpen} className="btn-primary rounded-2xl px-5 py-3 font-semibold flex items-center gap-2">
                  <Play size={18} /> Try Now
                </button>
                <a href="#how" className="rounded-2xl px-5 py-3 font-semibold border border-white/10">
                  How it works
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// DATA
const Metrics: React.FC = () => {
  const items = [
    { kpi: "391%", label: "Higher Conversion", desc: "Leads contacted within the first minute convert dramatically more often." },
    { kpi: "10x", label: "More Likely to Connect", desc: "Calling within five minutes massively increases contact rates." },
    { kpi: "80%", label: "Drop After 5 Minutes", desc: "Contact rates collapse when response is delayed." },
    { kpi: "24/7", label: "Instant Coverage", desc: "Leads are called day, night, and weekends." }
  ];

  return (
    <section id="why" className="relative py-16 md:py-24">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 left-0 right-0 mx-auto h-64 w-[90%] rounded-[36px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(109,94,243,.15),transparent)] blur-2xl" />
      </div>
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="h2 font-bold">Why Speed-to-Lead Works</h2>
          <p className="opacity-80 mt-2">The data is clear: the faster you respond, the more deals you close.</p>
        </div>
        <div className="grid grid-cols-1
