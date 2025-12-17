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
        className="relative min
