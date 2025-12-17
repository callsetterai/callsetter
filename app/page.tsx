"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Phone,
  PhoneCall,
  Check,
  ChevronDown,
  Rocket,
  Zap,
  Timer,
  Play,
  X,
} from "lucide-react";

/* ================= BRAND ================= */
const BRAND = {
  purple: "#6D5EF3",
  bg: "#0A0A0F",
  text: "#F3F4F6",
};

const LOGO_SRC = "/logo.png";

/* ================= RAF HOOK ================= */
function useRaf(cb: () => void) {
  const ref = useRef<number | null>(null);
  useEffect(() => {
    const loop = () => {
      cb();
      ref.current = requestAnimationFrame(loop);
    };
    ref.current = requestAnimationFrame(loop);
    return () => ref.current && cancelAnimationFrame(ref.current);
  }, [cb]);
}

/* ================= HEX WAVE BG ================= */
function HexWave() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useRaf(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth * dpr;
    const h = c.clientHeight * dpr;
    if (c.width !== w || c.height !== h) {
      c.width = w;
      c.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    const t = performance.now() / 1200;
    const size = 22 * dpr;
    const hexH = Math.sin(Math.PI / 3) * size;
    const hexW = size * 1.5;

    for (let y = -size; y < h + size; y += hexH * 2) {
      for (let x = -size; x < w + size; x += hexW) {
        const ox = (Math.floor(y / (hexH * 2)) % 2) * (hexW / 2);
        const cx = x + ox;
        const cy = y;

        const d = Math.hypot(cx - w / 2, cy - h / 2);
        const wave = Math.sin(d / 80 - t) * 0.5 + 0.5;
        const a = 0.05 + wave * 0.25;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI / 3) * i;
          const px = cx + size * Math.cos(ang);
          const py = cy + size * Math.sin(ang);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(109,94,243,${a})`;
        ctx.stroke();
      }
    }
  });

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full opacity-80"
    />
  );
}

/* ================= LEAD MODAL ================= */
function LeadModal({ open, onClose }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: any) {
    e.preventDefault();
    setLoading(true);
    await fetch(
      "https://hook.us2.make.com/685m5t1n8mbrsw27es0jar8s1tqb2ns7",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      }
    );
    setLoading(false);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={submit}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-[#0E0E16] p-6 rounded-2xl w-full max-w-md border border-white/10"
          >
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">Test The AI Setter</h3>
              <button onClick={onClose}>
                <X />
              </button>
            </div>

            <input
              required
              placeholder="Name"
              className="w-full p-3 mb-3 bg-black/40 border border-white/10 rounded"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              required
              placeholder="Email"
              className="w-full p-3 mb-3 bg-black/40 border border-white/10 rounded"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              required
              placeholder="Phone"
              className="w-full p-3 mb-4 bg-black/40 border border-white/10 rounded"
              onChange={(e) => setPhone(e.target.value)}
            />

            <button
              disabled={loading}
              className="w-full bg-[#6D5EF3] text-black font-bold py-3 rounded"
            >
              {loading ? "Calling…" : "Call Me Now"}
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ================= PAGE ================= */
export default function Page() {
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <div className="relative overflow-hidden">
      <LeadModal open={open} onClose={() => setOpen(false)} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center text-center">
        <HexWave />
        <motion.div style={{ y }} className="relative z-10 max-w-3xl px-6">
          <img src={LOGO_SRC} className="mx-auto h-10 mb-6" />
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Increase Your Booked Appointments{" "}
            <span className="text-[#6D5EF3]">By 25%</span> In 30 Days Guaranteed
          </h1>
          <p className="mt-6 text-lg opacity-80">
            AI voice agents that instantly call, qualify, and book inbound leads
            before competitors do.
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-10 px-8 py-4 bg-[#6D5EF3] text-black font-bold rounded-xl flex items-center gap-2 mx-auto"
          >
            <PhoneCall /> Test The AI Setter Now
          </button>
        </motion.div>
      </section>
    </div>
  );
}
