"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Phone,
  PhoneCall,
  Rocket,
  ShieldCheck,
  Timer,
  X,
  Zap,
} from "lucide-react";

/* ================= THEME ================= */

const BRAND = {
  purple: "#6D5EF3",
  nearBlack: "#0A0A0F",
  nearWhite: "#F3F4F6",
};

const LOGO_SRC = "/logo.png";

const formatMoney = (n: number): string =>
  Number.isFinite(n)
    ? n.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })
    : "$0";

/* ================= RAF ================= */

function useRaf(callback: () => void): void {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      callback();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [callback]);
}

/* ================= HEX BACKGROUND ================= */

function HexWaveBackground({
  intensity = 1,
  opacity = 0.9,
  mask = true,
}: {
  intensity?: number;
  opacity?: number;
  mask?: boolean;
}) {
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
    g.addColorStop(0, "rgba(109,94,243,0.28)");
    g.addColorStop(1, "rgba(109,94,243,0.03)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const size = 26 * dpr;
    const hexH = Math.sin(Math.PI / 3) * size;
    const hexW = size * 1.5;
    const t = performance.now() / 1100;

    ctx.lineWidth = 1 * dpr;

    for (let yy = -size; yy < h + size; yy += hexH * 2) {
      for (let xx = -size; xx < w + size; xx += hexW) {
        const offset = (Math.floor(yy / (hexH * 2)) % 2) * (hexW / 2);
        const cx = xx + offset;
        const cy = yy;

        const d = Math.hypot(cx - w / 2, cy - h / 2);
        const wave = Math.sin(d / (78 * intensity) - t) * 0.5 + 0.5;
        const a = 0.06 + wave * 0.34 * opacity;

        // Hex outline
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI / 3) * i + t * 0.06;
          const px = cx + size * Math.cos(ang);
          const py = cy + size * Math.sin(ang);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.5})`;
        ctx.stroke();

        // Node
        const r = 1.5 * dpr + wave * 2.6 * dpr;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109,94,243,${a})`;
        ctx.fill();
      }
    }

    // Sweep band
    const sweepY = (Math.sin(t * 0.9) * 0.5 + 0.5) * h;
    const sweep = ctx.createLinearGradient(
      0,
      sweepY - 120 * dpr,
      0,
      sweepY + 120 * dpr
    );
    sweep.addColorStop(0, "rgba(109,94,243,0)");
    sweep.addColorStop(0.5, "rgba(109,94,243,0.18)");
    sweep.addColorStop(1, "rgba(109,94,243,0)");
    ctx.fillStyle = sweep;
    ctx.fillRect(0, sweepY - 140 * dpr, w, 280 * dpr);
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
      style={{
        opacity,
        WebkitMaskImage: mask
          ? "radial-gradient(ellipse at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 86%)"
          : undefined,
        maskImage: mask
          ? "radial-gradient(ellipse at center, rgba(0,0,0,1) 62%, rgba(0,0,0,0) 86%)"
          : undefined,
      }}
      aria-hidden
    />
  );
}

/* ================= MODAL ================= */

function LeadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  const [secondsLeft, setSecondsLeft] = useState<number>(60);

  useEffect(() => {
    if (status !== "success") return;
    setSecondsLeft(60);
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [status]);

  async function submit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName,
          firstName,
          email,
          phone,
          source: "callsetter.vercel.app",
          timestamp: new Date().toISOString(),
        }),
      });

      const raw = await res.text();
      const data: unknown = raw ? JSON.parse(raw) : {};
      const ok =
        typeof data === "object" && data !== null && "ok" in data
          ? (data as any).ok
          : false;

      if (!res.ok || !ok) {
        const msg =
          typeof data === "object" && data !== null
            ? (data as any).error ||
              (data as any).details ||
              (data as any).response ||
              `Request failed (${res.status})`
            : `Request failed (${res.status})`;
        setErrorMsg(String(msg));
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Network error");
      setStatus("error");
    }
  }

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

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
                  <h3 className="text-2xl font-bold tracking-tight">
                    Test Call Setter AI Now
                  </h3>
                  <p className="mt-2 text-sm text-white/75">
                    Our AI voice agent will call you instantly to demo how instant qualification feels.
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
                    <label className="text-sm text-white/80">First Name</label>
                    <input
                      value={firstName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFirstName(e.target.value)
                      }
                      required
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-[var(--brand)]"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/80">Email</label>
                    <input
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(e.target.value)
                      }
                      required
                      type="email"
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 outline-none focus:border-[var(--brand)]"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white/80">Phone</label>
                    <input
                      value={phone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPhone(e.target.value)
                      }
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

                  <h4 className="mt-5 text-2xl md:text-3xl font-extrabold tracking-tight">
                    WAIT! {firstName ? `${firstName}, ` : ""}Emma (Our AI Sales Agent) Is About To Call You Any Second...
                  </h4>

                  <div className="mt-6 flex items-center justify-center gap-3">
                    <div className="min-w-[92px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="text-3xl font-black">{hours}</div>
                      <div className="text-xs uppercase tracking-wide text-white/60">
                        hours
                      </div>
                    </div>
                    <div className="min-w-[92px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="text-3xl font-black">{minutes}</div>
                      <div className="text-xs uppercase tracking-wide text-white/60">
                        minutes
                      </div>
                    </div>
                    <div className="min-w-[92px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <div className="text-3xl font-black text-[var(--brand)]">
                        {seconds.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs uppercase tracking-wide text-white/60">
                        seconds
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-left">
                    <div className="font-semibold">Here’s what’s about to happen:</div>
                    <div className="mt-3 space-y-3 text-sm text-white/80">
                      <div>
                        1️⃣ Your phone will ring in under 60 seconds (Make sure it’s not on Do Not Disturb or you’ll miss the magic!)
                      </div>
                      <div>
                        2️⃣ Emma will introduce herself and ask about your business (FYI: She’s very curious. Please be nice to her 😉)
                      </div>
                      <div>
                        3️⃣ She’ll get a sense of your current situation and offer to book a free demo call if it seems like the right fit for ya. No-strings-attached.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onClose}
                    className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white/90 hover:text-white"
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

/* ================= SECTIONS ================= */

function Nav({ onOpen }: { onOpen: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between gap-3">
        <a href="#top" className="flex items-center gap-3">
          <img src={LOGO_SRC} alt="CallSetter.ai" className="h-7 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#how" className="hover:text-white">How It Works</a>
          <a href="#get" className="hover:text-white">What You Get</a>
          <a href="#who" className="hover:text-white">Who It’s For</a>
          <a href="#faq" className="hover:text-white">FAQs</a>
          <button
            onClick={onOpen}
            className="rounded-2xl bg-[var(--brand)] px-4 py-2 font-semibold text-[#0B0B10]"
          >
            Test Now
          </button>
        </nav>
      </div>
    </header>
  );
}

function Metrics() {
  const items = [
    { kpi: "391%", label: "Higher Conversion", desc: "Leads contacted within the first minute convert dramatically more often." },
    { kpi: "10x", label: "More Likely to Connect", desc: "Calling within five minutes massively increases contact rates." },
    { kpi: "80%", label: "Drop After 5 Minutes", desc: "Contact rates collapse when response is delayed." },
    { kpi: "24/7", label: "Instant Coverage", desc: "Leads are called day, night, and weekends." },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why Speed-to-Lead Works</h2>
          <p className="opacity-80 mt-2">The data is clear: the faster you respond, the more deals you close</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <div key={it.kpi} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-5xl font-black tracking-tight text-[var(--brand)]">{it.kpi}</div>
              <div className="mt-2 font-semibold">{it.label}</div>
              <div className="mt-1 text-sm opacity-75">{it.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { title: "We Build It", desc: "We custom-build your AI appointment setter around your offer, qualification rules, and booking flow.", Icon: Rocket },
    { title: "We Connect Everything", desc: "We connect your CRM, lead forms, ad platforms, phone system, and calendar so every lead routes instantly.", Icon: Zap },
    { title: "Leads Get Booked", desc: "Every new lead is called automatically within 60 seconds, qualified, and booked directly on your calendar.", Icon: Timer },
  ];

  const included = [
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
  ];

  return (
    <section id="how" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 md:p-10">
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight">We Do Everything. You Get Bookings.</h3>
            <p className="opacity-80 mt-2">100% done for you. Installed inside your business. Nothing DIY. Nothing half-built.</p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map(({ title, desc, Icon }) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-[#0E0E16] p-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--brand)]/20 text-[var(--brand)] grid place-items-center">
                  <Icon />
                </div>
                <div className="mt-4 font-semibold text-xl">{title}</div>
                <div className="mt-2 opacity-80 text-sm">{desc}</div>
              </div>
            ))}
          </div>

          <div id="get" className="mt-12 pt-8 border-t border-white/10">
            <h4 className="text-2xl font-bold">What You Get</h4>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {included.map((line) => (
                <div key={line} className="flex items-start gap-3 py-2">
                  <div className="mt-1 w-5 h-5 rounded-full bg-[var(--brand)]/20 text-[var(--brand)] grid place-items-center flex-none">
                    <Check size={14} />
                  </div>
                  <div className="text-sm md:text-base">{line}</div>
                </div>
              ))}
            </div>
            <p className="text-xs opacity-60 mt-4">
              All setup is handled inside your business. Nothing is outsourced to templates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ROICalc({ onOpen }: { onOpen: () => void }) {
  const [leads, setLeads] = useState<number>(300);
  const [closeRate, setCloseRate] = useState<number>(10);
  const [revPer, setRevPer] = useState<number>(1500);
  const lift = 0.2;

  const lostMonthly = useMemo(
    () => Math.max(0, leads * (closeRate / 100) * revPer * lift),
    [leads, closeRate, revPer]
  );
  const lostYearly = lostMonthly * 12;
  const extraCustomers = useMemo(
    () => Math.max(0, leads * (closeRate / 100) * lift),
    [leads, closeRate]
  );

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-8">
          <h3 className="text-4xl md:text-5xl font-bold tracking-tight">Calculate Your Lost Revenue</h3>
          <p className="opacity-80 mt-2">See what slow follow-up costs you.</p>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-[#0E0E16]/70 p-6 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="grid gap-5">
            <div>
              <label className="text-sm opacity-80">Leads Per Month</label>
              <input
                type="number"
                value={leads}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLeads(Number(e.target.value))}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]"
              />
            </div>
            <div>
              <label className="text-sm opacity-80">Close Rate (%)</label>
              <div className="text-xs opacity-60">Percent of leads that become customers</div>
              <input
                type="number"
                value={closeRate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCloseRate(Number(e.target.value))}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]"
              />
            </div>
            <div>
              <label className="text-sm opacity-80">Revenue Per Customer</label>
              <input
                type="number"
                value={revPer}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRevPer(Number(e.target.value))}
                className="mt-1 w-full rounded-xl bg-white/5 border border-white/10 p-3 outline-none focus:border-[var(--brand)]"
              />
            </div>
            <div className="text-xs opacity-60">Assumes a 20% lift from faster response time.</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 grid place-items-center">
            <div className="w-full max-w-sm text-center">
              <div className="text-sm opacity-80">Estimated Revenue Lost Per Month</div>
              <div className="text-5xl md:text-6xl font-black tracking-tight text-[var(--brand)] mt-2">
                {formatMoney(lostMonthly)}
              </div>

              <div className="mt-6 text-sm opacity-80">Estimated Revenue Lost Per Year</div>
              <div className="text-4xl md:text-5xl font-extrabold tracking-tight mt-1">
                {formatMoney(lostYearly)}
              </div>

              <div className="mt-4 text-xs opacity-70">
                Estimated additional customers with faster response:{" "}
                <span className="font-semibold">{Math.round(extraCustomers)}</span>
              </div>

              <div className="mt-8">
                <button
                  onClick={onOpen}
                  className="w-full rounded-2xl bg-[var(--brand)] px-5 py-3 font-semibold text-[#0B0B10]"
                >
                  Test The AI Setter Now!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Will this sound robotic?", a: "No. The voice is natural and designed for real conversations." },
    { q: "How fast can we go live?", a: "Most clients are live within a few days." },
    { q: "Does this integrate with my CRM?", a: "Yes. We support GHL and non-GHL setups." },
    { q: "What happens if a lead does not answer?", a: "The system follows up automatically based on your rules." },
  ];

  return (
    <section id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-center">FAQ</h3>
        <div className="mt-8 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-white/10 bg-[#0E0E16] p-4">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                <div className="font-semibold">{f.q}</div>
                <ChevronDown className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-3 opacity-80 text-sm">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ onOpen }: { onOpen: () => void }) {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HexWaveBackground intensity={1.2} opacity={0.85} mask />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 520px at 50% 0%, rgba(109,94,243,0.22), transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <h3 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          Try Call Setter AI Now!
        </h3>
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={onOpen}
            className="rounded-2xl bg-[var(--brand)] px-6 py-4 font-semibold text-[#0B0B10] inline-flex items-center gap-2"
          >
            <PhoneCall className="w-5 h-5" />
            Try Now!
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <HexWaveBackground intensity={1.0} opacity={0.35} mask={false} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 500px at 50% 0%, rgba(109,94,243,0.18), transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={LOGO_SRC} alt="CallSetter.ai" className="h-7 w-auto opacity-90" />
        <div className="text-sm opacity-70">
          © {new Date().getFullYear()} CallSetter.ai — All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ================= PAGE ================= */

export default function Page() {
  const [modal, setModal] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--brand", BRAND.purple);
  }, []);

  return (
    <div
      id="top"
      className="min-h-screen overflow-x-hidden"
      style={{ background: BRAND.nearBlack, color: BRAND.nearWhite }}
    >
      <style>{`
        :root { --brand: ${BRAND.purple}; }
        html, body { height: 100%; overflow-x: hidden; }
        body { overflow-y: auto; }
      `}</style>

      <Nav onOpen={() => setModal(true)} />
      <LeadModal open={modal} onClose={() => setModal(false)} />

      <main className="pt-16">
        <section className="relative overflow-hidden pt-10 md:pt-16 min-h-[78vh]">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <HexWaveBackground intensity={1.1} opacity={0.95} mask />
            <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_50%_0%,rgba(255,255,255,.14),transparent_60%)] mix-blend-overlay" />
          </div>

          <div className="relative z-10">
            <div className="mx-auto max-w-6xl px-4 text-center py-14 md:py-20">
              <div className="flex items-center justify-center gap-3 opacity-95">
                <img src={LOGO_SRC} alt="CallSetter.ai" className="h-10 w-auto" />
              </div>

              <h1 className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight text-balance">
                Increase Your Booked Appointments{" "}
                <span className="text-[var(--brand)]">By 25%</span> In 30 Days{" "}
                <span className="text-[var(--brand)]">Guaranteed</span>
              </h1>

              <p className="mt-5 text-lg opacity-80 max-w-3xl mx-auto">
                CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
              </p>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => setModal(true)}
                  className="rounded-2xl bg-[var(--brand)] px-7 py-4 font-semibold text-[#0B0B10] inline-flex items-center gap-2 shadow-[0_14px_44px_-18px_var(--brand)] transition hover:-translate-y-[1px]"
                >
                  <PhoneCall className="w-5 h-5" />
                  Test The AI Setter Now!
                </button>
              </div>

              <div className="mt-10 flex items-end justify-center gap-1 h-12" aria-hidden>
                {Array.from({ length: 26 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="w-1 rounded-full bg-[var(--brand)]/90"
                    initial={{ height: 6 }}
                    animate={{ height: [6, 30, 12, 26, 10, 34, 6] }}
                    transition={{
                      duration: 2.1,
                      repeat: Infinity,
                      delay: i * 0.05,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <Metrics />
        <HowItWorks />
        <ROICalc onOpen={() => setModal(true)} />
        <FAQ />
        <FinalCTA onOpen={() => setModal(true)} />
      </main>

      <Footer />
    </div>
  );
}
