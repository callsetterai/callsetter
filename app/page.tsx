"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

/**
 * CallSetter.ai — App Router Page
 * - Tailwind styled
 * - Single CTA opens modal (name/email/phone -> /api/lead)
 * - Futuristic hex-wave canvas background in hero + outcome
 * - Logo uses /public/logo.png
 */

const BRAND = {
  purple: "#6D5EF3",
  bg: "#0A0A0F",
  ink: "#F3F4F6",
};

const LOGO_SRC = "/logo.png"; // public/logo.png

function formatMoney(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/* ================= RAF ================= */
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

/* ================= HEX BACKGROUND ================= */
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

    // Glow
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

        // Hex outline
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

        // Node
        ctx.beginPath();
        ctx.arc(cx, cy, (1.2 + wave * 2.0) * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109,94,243,${a * 1.2 * opacity})`;
        ctx.fill();
      }
    }

    // Sweep
    const sweepY = (Math.sin(t * 0.9) * 0.5 + 0.5) * h;
    const sweep = ctx.createLinearGradient(0, sweepY - 80 * dpr, 0, sweepY + 80 * dpr);
    sweep.addColorStop(0, "rgba(109,94,243,0)");
    sweep.addColorStop(0.5, "rgba(109,94,243,0.25)");
    sweep.addColorStop(1, "rgba(109,94,243,0)");
    ctx.fillStyle = sweep;
    ctx.fillRect(0, sweepY - 120 * dpr, w, 240 * dpr);
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full opacity-90 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_85%)]"
      aria-hidden
    />
  );
}

/* ================= MODAL ================= */
function LeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // IMPORTANT: call our server route (avoids CORS)
  const endpoint = "/api/lead";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
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

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) throw new Error("Request failed");

      setStatus("success");
    } catch {
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
                      Something went wrong sending your request. Please try again.
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

/* ================= MAIN PAGE ================= */
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

      {/* DATA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Why Speed-to-Lead Works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/75">
              The data is clear: the faster you respond, the more deals you close
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["391%", "Higher Conversion", "Leads contacted within the first minute convert dramatically more often."],
              ["10x", "More Likely to Connect", "Calling within five minutes massively increases contact rates."],
              ["80%", "Drop After 5 Minutes", "Contact rates collapse when response is delayed."],
              ["24/7", "Instant Coverage", "Leads are called day, night, and weekends."],
            ].map(([kpi, label, desc]) => (
              <div key={kpi} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="text-5xl font-black tracking-tight text-[var(--brand)]">{kpi}</div>
                <div className="mt-2 font-semibold">{label}</div>
                <div className="mt-1 text-sm text-white/70">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUTCOME (graphics added) */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
          <HexWaveBackground opacity={0.55} />
          <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 1200 600" preserveAspectRatio="none">
            {Array.from({ length: 6 }).map((_, i) => (
              <circle
                key={i}
                cx="600"
                cy="280"
                r={(i + 1) * 80}
                fill="none"
                stroke="rgba(109,94,243,0.25)"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Respond To All Leads Within 60 Seconds And Take Leads 24/7
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-white/80">
            By calling new leads in under 60 seconds and following up consistently, businesses typically see a 15 to 25 percent increase in booked appointments within the first 30 days.
          </p>
          <div className="mx-auto mt-6 grid max-w-xl gap-2 font-semibold text-white/90">
            <div>No changes to ads.</div>
            <div>No new hires.</div>
            <div>Just faster, consistent execution.</div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS + WHAT YOU GET */}
      <section id="how" className="py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-10">
            <div className="text-center">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">We Do Everything. You Get Bookings.</h2>
              <p className="mx-auto mt-3 max-w-2xl text-white/75">
                100% done for you. Installed inside your business. Nothing DIY. Nothing half-built.
              </p>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                { title: "We Build It", desc: "We custom-build your AI appointment setter around your offer, qualification rules, and booking flow.", icon: Rocket },
                { title: "We Connect Everything", desc: "We connect your CRM, lead forms, ad platforms, phone system, and calendar so every lead routes instantly.", icon: Zap },
                { title: "Leads Get Booked", desc: "Every new lead is called automatically within 60 seconds, qualified, and booked directly on your calendar.", icon: Timer },
              ].map((s) => (
                <div key={s.title} className="rounded-2xl border border-white/10 bg-[#0E0E16] p-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--brand)]/20 text-[var(--brand)]">
                    <s.icon />
                  </div>
                  <div className="mt-4 text-xl font-semibold">{s.title}</div>
                  <div className="mt-2 text-sm text-white/75">{s.desc}</div>
                </div>
              ))}
            </div>

            <div id="get" className="mt-12 border-t border-white/10 pt-8">
              <h3 className="text-2xl font-bold">What You Get</h3>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
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
                ].map((line) => (
                  <div key={line} className="flex items-start gap-3 py-2">
                    <div className="mt-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--brand)]/20 text-[var(--brand)]">
                      <Check size={14} />
                    </div>
                    <div className="text-white/90">{line}</div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-white/55">
                All setup is handled inside your business. Nothing is outsourced to templates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO */}
      <section id="who" className="py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Built for Businesses That Book Appointments for Revenue
            </h2>
            <p className="mt-5 text-white/80">
              CallSetter.ai is designed for businesses where booked appointments directly drive sales.
              If you generate leads, rely on scheduled calls, or spend over five thousand per month on ads,
              faster response time is not optional. It is the difference between winning and losing the deal.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Lead generation agencies",
              "Local and national service businesses",
              "High-ticket sales teams",
              "Advertisers buying inbound leads at scale",
            ].map((x) => (
              <div key={x} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="h-2 w-2 rounded-full bg-[var(--brand)]" />
                <div className="font-medium">{x}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-4xl font-bold tracking-tight md:text-5xl">FAQ</h2>
          <div className="mt-10 space-y-3">
            {[
              { q: "Will this sound robotic?", a: "No. The voice is natural and designed for real conversations." },
              { q: "How fast can we go live?", a: "Most clients are live within a few days." },
              { q: "Does this integrate with my CRM?", a: "Yes. We support GHL and non-GHL setups." },
              { q: "What happens if a lead does not answer?", a: "The system follows up automatically based on your rules." },
            ].map((f) => (
              <details key={f.q} className="group rounded-2xl border border-white/10 bg-[#0E0E16] p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <div className="font-semibold">{f.q}</div>
                  <ChevronDown className="transition-transform group-open:rotate-180" />
                </summary>
                <div className="mt-3 text-sm text-white/75">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <HexWaveBackground opacity={0.85} />
        </div>
        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-5xl font-extrabold tracking-tight md:text-6xl">Try Call Setter AI Now!</h2>
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-[var(--brand)] px-8 py-4 font-semibold text-[#0B0B10]"
            >
              <PhoneCall className="h-5 w-5" />
              Try Now!
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4">
          <img src={LOGO_SRC} alt="CallSetter.ai" className="h-7 w-auto opacity-90" />
          <div className="text-sm text-white/60">© {new Date().getFullYear()} CallSetter.ai</div>
        </div>
      </footer>
    </div>
  );
}
