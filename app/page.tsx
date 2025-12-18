"use client";

import React, {
  useEffect,
  useRef,
  useState,
  FormEvent,
  ChangeEvent,
} from "react";
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

/* ================= CONFIG ================= */

const BRAND = {
  purple: "#6D5EF3",
};

const LOGO_SRC = "/logo.png";

/* ================= RAF ================= */

function useRaf(cb: () => void): void {
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const loop = () => {
      cb();
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
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

    const glow = ctx.createRadialGradient(
      w / 2,
      h / 2,
      0,
      w / 2,
      h / 2,
      Math.max(w, h)
    );
    glow.addColorStop(0, "rgba(109,94,243,0.18)");
    glow.addColorStop(1, "rgba(109,94,243,0.02)");
    ctx.fillStyle = glow;
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
        ctx.arc(cx, cy, (1.2 + wave * 2) * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109,94,243,${a * opacity})`;
        ctx.fill();
      }
    }
  });

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full pointer-events-none opacity-90
      [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_85%)]"
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

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
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

  async function submit(e: FormEvent<HTMLFormElement>) {
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

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok || !data?.ok) {
        setErrorMsg(data?.error || "Submission failed");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setErrorMsg("Network error");
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
          />

          <motion.div
            className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0E0E16] p-6 md:p-8"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 14, opacity: 0 }}
          >
            {status !== "success" ? (
              <form onSubmit={submit} className="grid gap-4">
                <h3 className="text-2xl font-bold">
                  Test Call Setter AI Now
                </h3>
                <p className="text-sm text-white/75">
                  Our AI voice agent will call you instantly to demo how
                  instant qualification feels.
                </p>

                <input
                  value={firstName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFirstName(e.target.value)
                  }
                  placeholder="John"
                  required
                  className="rounded-xl bg-white/5 p-3"
                />
                <input
                  value={email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="john@company.com"
                  required
                  className="rounded-xl bg-white/5 p-3"
                />
                <input
                  value={phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPhone(e.target.value)
                  }
                  placeholder="+1 (555) 123-4567"
                  required
                  className="rounded-xl bg-white/5 p-3"
                />

                <button className="rounded-2xl bg-[var(--brand)] py-3 font-bold text-black">
                  {status === "loading" ? "Connecting…" : "Call Me Now"}
                </button>

                {status === "error" && (
                  <p className="text-sm text-red-400">{errorMsg}</p>
                )}
              </form>
            ) : (
              <div className="text-center">
                <ShieldCheck className="mx-auto mb-4" />
                <h4 className="text-2xl font-bold">
                  WAIT! {firstName}, Emma Is About To Call You…
                </h4>

                <div className="mt-4 flex justify-center gap-3">
                  <div>{hours}h</div>
                  <div>{minutes}m</div>
                  <div className="text-[var(--brand)]">
                    {seconds.toString().padStart(2, "0")}s
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= PAGE ================= */

export default function Page() {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--brand", BRAND.purple);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      <LeadModal open={open} onClose={() => setOpen(false)} />

      <section className="relative overflow-hidden pt-24">
        <HexWaveBackground />
        <div className="relative mx-auto max-w-6xl px-4 text-center">
          <img src={LOGO_SRC} className="mx-auto h-10" />
          <h1 className="mt-8 text-5xl md:text-7xl font-extrabold">
            Increase Your Booked Appointments{" "}
            <span className="text-[var(--brand)]">By 25%</span>
          </h1>
          <button
            onClick={() => setOpen(true)}
            className="mt-10 rounded-2xl bg-[var(--brand)] px-8 py-4 font-bold text-black"
          >
            <PhoneCall className="inline mr-2" />
            Test The AI Setter Now!
          </button>
        </div>
      </section>
    </div>
  );
}
