"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronDown,
  Phone,
  PhoneCall,
  Rocket,
  Timer,
  Zap,
  X,
  ShieldCheck,
} from "lucide-react";

const BRAND = {
  purple: "#6D5EF3",
};

const LOGO_SRC = "/logo.png";

function useRaf(cb: () => void) {
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const loop = () => {
      cb();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [cb]);
}

function HexWaveBackground({ opacity = 0.85 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useRaf(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    const g = ctx.createRadialGradient(
      w * 0.5,
      h * 0.45,
      0,
      w * 0.5,
      h * 0.45,
      Math.max(w, h)
    );
    g.addColorStop(0, "rgba(109,94,243,0.18)");
    g.addColorStop(1, "rgba(109,94,243,0.02)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const t = performance.now() / 1200;
    const size = 22 * dpr;
    const hexH = Math.sin(Math.PI / 3) * size;
    const hexW = size * 1.5;

    ctx.lineWidth = 1 * dpr;

    for (let y = -size; y < h + size; y += hexH * 2) {
      for (let x = -size; x < w + size; x += hexW) {
        const ox = (Math.floor(y / (hexH * 2)) % 2) * (hexW / 2);
        const cx = x + ox;
        const cy = y;

        const d = Math.hypot(cx - w / 2, cy - h / 2);
        const wave = Math.sin(d / 90 - t) * 0.5 + 0.5;
        const a = 0.05 + wave * 0.22;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI / 3) * i + t * 0.04;
          const px = cx + size * Math.cos(ang);
          const py = cy + size * Math.sin(ang);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,255,255,${a * opacity})`;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, (1.2 + wave * 2.0) * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109,94,243,${a * 1.2 * opacity})`;
        ctx.fill();
      }
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_85%)]"
      aria-hidden
    />
  );
}

function LeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          source: "callsetter.vercel.app",
          timestamp: new Date().toISOString(),
        }),
      });

      // Always read text first to avoid JSON parse crashes
      const raw = await res.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { ok: false, error: "Non-JSON response from server", response: raw };
      }

      if (!res.ok || !data?.ok) {
        const msg =
          data?.error ||
          data?.details ||
          data?.response ||
          `Request failed (${res.status})`;
        setErrorMsg(typeof msg === "string" ? msg : JSON.stringify(msg));
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch (err: any) {
      setErrorMsg(err?.message || "Network error");
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute inset-0 bg-black/70"
            onClick={onClose}
            aria-label="Close overlay"
          />
          <motion.div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0E0E16] shadow-2xl"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 14, opacity: 0, scale: 0.98 }}
          >
            <div
              className="absolute -inset-1 opacity-30 blur-2xl"
              style={{
                background: `radial-gradient(1200px_600px_at_50%_-20%, ${BRAND.purple}22, transparent 55%)`,
              }}
            />
            <div className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Test The AI Setter</h3>
                  <p className="mt-2 text-sm text-white/75">
                    Enter your info. Our AI voice agent will call you to demo how instant qualification feels.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/10 p-2 text-white/80 hover:text-white"
                >
                  <X />
                </button>
              </div>

              {status !== "success" ? (
                <form onSubmit={submit} className="mt-6 grid gap-4">
                  <div>
                    <label className="text-sm text-white/80">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-[var(--brand)]"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/80">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      type="email"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-[var(--brand)]"
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-white/80">Phone</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-[var(--brand)]"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <p className="text-xs text-white/55">
                    By submitting, you agree to receive a one-time automated call from our demo agent.
                  </p>

                  <button
                    disabled={status === "loading"}
                    className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] px-5 py-3 font-semibold text-[#0B0B10] transition hover:-translate-y-[1px]"
                  >
                    <Phone className="h-4 w-4" />
                    {status === "loading" ? "Connecting…" : "Call Me Now"}
                  </button>

                  {status === "error" && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                      <div className="font-semibold">Submission failed</div>
                      <div className="mt-1 break-words opacity-90">
                        {errorMsg || "Unknown error"}
                      </div>
                    </div>
                  )}
                </form>
              ) : (
                <div className="mt-10 text-center">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--brand)] text-[#0B0B10]">
                    <ShieldCheck />
                  </div>
                  <h4 className="mt-4 text-xl font-bold">You’re queued for a demo call.</h4>
                  <p className="mt-2 text-white/75">Keep your phone nearby — the AI will dial you shortly.</p>
                  <button
                    onClick={onClose}
                    className="mt-6 rounded-2xl bg-[var(--brand)] px-6 py-3 font-semibold text-[#0B0B10]"
                  >
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
}

export default function Page() {
  const [modal, setModal] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--brand", BRAND.purple);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F3F4F6]">
      <LeadModal open={modal} onClose={() => setModal(false)} />

      {/* NAV */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="CallSetter.ai" className="h-7 w-auto" />
          </div>
          <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
            <a href="#how" className="hover:text-white">How It Works</a>
            <a href="#get" className="hover:text-white">What You Get</a>
            <a href="#who" className="hover:text-white">Who It’s For</a>
            <a href="#faq" className="hover:text-white">FAQs</a>
            <button
              onClick={() => setModal(true)}
              className="rounded-2xl bg-[var(--brand)] px-4 py-2 font-semibold text-[#0B0B10]"
            >
              Test Now
            </button>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-24">
        <div className="absolute inset-0">
          <HexWaveBackground />
          <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(255,255,255,.14),transparent_60%)] mix-blend-overlay" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center">
          <img src={LOGO_SRC} alt="CallSetter.ai" className="mx-auto h-10 w-auto opacity-95" />
          <h1 className="mt-8 text-balance text-5xl font-extrabold tracking-tight md:text-7xl">
            Increase Your Booked Appointments{" "}
            <span className="text-[var(--brand)]">By 25%</span>{" "}
            In 30 Days{" "}
            <span className="text-[var(--brand)]">Guaranteed</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/80">
            CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
          </p>

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--brand)] px-7 py-4 font-semibold text-[#0B0B10] shadow-[0_14px_44px_-18px_var(--brand)] transition hover:-translate-y-[1px]"
            >
              <PhoneCall className="h-5 w-5" />
              Test The AI Setter Now!
            </button>
          </div>
        </div>
      </section>

      {/* Keep the rest of your sections as-is (unchanged styling) */}
      {/* ... */}
    </div>
  );
}
