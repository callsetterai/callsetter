"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, PhoneCall } from "lucide-react";

const LOGO_SRC = "/logo-callsetterai.png"; // keep your logo at /public/logo-callsetterai.png
const BUILD_ID = "waves-visible-v3"; // you should see this bottom-right

const PURPLE = "#5A46F6";
const PURPLE_2 = "#7C6CFD";
const INK = "#0B0A12";

function HeroAISoundWaves() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
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
    window.addEventListener("resize", resize, { passive: true });

    // Deterministic particles
    const particles = Array.from({ length: 40 }).map((_, i) => ({
      x: (i * 113) % 1600,
      y: (i * 197) % 900,
      r: 1.6 + (i % 6) * 0.55,
      s: 0.22 + (i % 8) * 0.03,
      p: (i * 0.41) % (Math.PI * 2),
    }));

    // Hex grid
    const hexR = 15;
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

      // ===== Base background (dark)
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, w, h);

      // ===== Purple wash (bright enough to show waves)
      const wash = ctx.createRadialGradient(w * 0.5, h * 0.15, 0, w * 0.5, h * 0.2, Math.max(w, h));
      wash.addColorStop(0, "rgba(122,101,255,0.22)");
      wash.addColorStop(0.55, "rgba(0,0,0,0)");
      wash.addColorStop(1, "rgba(11,10,18,1)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      // ===== Hex field (more visible in top half)
      const driftX = Math.sin(t * 0.35) * 24;
      const driftY = Math.cos(t * 0.28) * 16;

      ctx.save();
      ctx.globalAlpha = 0.28 + 0.10 * Math.sin(t * 0.6);
      const xStep = hexR * 1.58;
      const yStep = hexH * 2.06;

      for (let row = -3; row < h / yStep + 4; row++) {
        for (let col = -3; col < w / xStep + 4; col++) {
          const x = col * xStep + (row % 2 ? xStep * 0.5 : 0) + driftX;
          const y = row * yStep + driftY;

          const nx = (x - w * 0.5) / (w * 0.55);
          const ny = (y - h * 0.18) / (h * 0.85);
          const falloff = Math.max(0, 1 - (nx * nx + ny * ny));
          drawHex(x, y, 0.42 * falloff);
        }
      }
      ctx.restore();

      // ===== VERY OBVIOUS WAVES (higher + thicker)
      const waveCount = 3;
      for (let i = 0; i < waveCount; i++) {
        const phase = t * (1.2 + i * 0.22);
        const baseY = h * (0.30 + i * 0.10); // higher so they're behind headline
        const amp = 70 + i * 12;
        const freq = 0.0065 + i * 0.0012;

        const colorMain = i % 2 === 0 ? PURPLE : PURPLE_2;

        // Glow pass (screen blend)
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.55;
        ctx.strokeStyle = colorMain;
        ctx.lineWidth = 34; // THICK
        ctx.shadowColor = "rgba(124,108,253,1)";
        ctx.shadowBlur = 64;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const n =
            Math.sin(phase + x * freq) * 0.95 +
            Math.sin(phase * 1.5 + x * freq * 0.62) * 0.55 +
            Math.sin(phase * 0.75 + x * freq * 1.85) * 0.28;
          const y = baseY + n * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // Sharp core line
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = i === 1 ? "rgba(255,255,255,0.42)" : "rgba(190,180,255,0.98)";
        ctx.lineWidth = i === 1 ? 3.2 : 5.0;
        ctx.setLineDash(i === 1 ? [14, 12] : []);
        ctx.shadowColor = "rgba(90,70,246,0.9)";
        ctx.shadowBlur = 22;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 5) {
          const n =
            Math.sin(phase + x * freq) * 0.95 +
            Math.sin(phase * 1.5 + x * freq * 0.62) * 0.55 +
            Math.sin(phase * 0.75 + x * freq * 1.85) * 0.28;
          const y = baseY + n * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // ===== Particles (adds “life”)
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const p of particles) {
        p.p += 0.01 * p.s;
        p.y -= p.s * 0.85;
        if (p.y < -30) p.y = h + 30;

        const tw = 0.25 + 0.35 * Math.sin(t * 2 + p.p);
        ctx.beginPath();
        ctx.fillStyle = `rgba(124,108,253,${0.25 + tw})`;
        ctx.arc((p.x / 1600) * w, (p.y / 900) * h + Math.sin(t + p.p) * 12, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ===== Readability fade (light)
      const topFade = ctx.createLinearGradient(0, 0, 0, h);
      topFade.addColorStop(0, "rgba(11,10,18,0.10)");
      topFade.addColorStop(0.45, "rgba(11,10,18,0.04)");
      topFade.addColorStop(1, "rgba(11,10,18,0.88)");
      ctx.fillStyle = topFade;
      ctx.fillRect(0, 0, w, h);

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
      {/* Fallback SVG (visible even if canvas doesn't render) */}
      <svg
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}
      >
        <defs>
          <linearGradient id="p" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.8" />
            <stop offset="100%" stopColor={PURPLE_2} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path d="M0,170 C220,80 340,260 520,170 S820,80 1000,170" fill="none" stroke="url(#p)" strokeWidth="10" />
        <path d="M0,230 C220,140 340,320 520,230 S820,140 1000,230" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="4" strokeDasharray="14 12" />
        <path d="M0,300 C220,210 340,390 520,300 S820,210 1000,300" fill="none" stroke="url(#p)" strokeWidth="12" opacity="0.75" />
      </svg>

      {/* Canvas (the real animated “video-like” waves) */}
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export default function Page() {
  const [scrolled, setScrolled] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const [leads, setLeads] = useState(300);
  const [closeRate, setCloseRate] = useState(10);
  const [revenuePerCustomer, setRevenuePerCustomer] = useState(1500);

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

  const Button = ({ label }: { label: string }) => (
    <button
      onClick={() => setShowForm(true)}
      style={{
        background: PURPLE,
        color: "white",
        border: "none",
        padding: "14px 22px",
        borderRadius: 8,
        fontWeight: 800,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
      }}
      onMouseEnter={(e) => ((e.currentTarget.style.background = PURPLE_2))}
      onMouseLeave={(e) => ((e.currentTarget.style.background = PURPLE))}
    >
      <PhoneCall size={18} />
      {label}
    </button>
  );

  return (
    <div style={{ background: INK, color: "white", minHeight: "100vh" }}>
      {/* DEPLOY STAMP (so you know you are on latest) */}
      <div style={{ position: "fixed", right: 10, bottom: 10, fontSize: 11, opacity: 0.55, zIndex: 99999 }}>
        {BUILD_ID}
      </div>

      {/* NAV */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          borderBottom: "1px solid rgba(255,255,255,0.10)",
          backdropFilter: "blur(10px)",
          background: scrolled ? "rgba(11,10,18,0.85)" : "rgba(11,10,18,0.55)",
          padding: scrolled ? "10px 0" : "16px 0",
          transition: "all .25s ease",
        }}
      >
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src={LOGO_SRC} alt="Call Setter AI" style={{ height: 32, width: "auto" }} />
          </div>
          <Button label="Test The AI Setter Now" />
        </div>
      </div>

      {/* HERO */}
      <section id="top" style={{ position: "relative", minHeight: "100vh", paddingTop: 110, overflow: "hidden" }}>
        <HeroAISoundWaves />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 980, margin: "0 auto", padding: "0 18px", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(42px, 6vw, 68px)", lineHeight: 1.05, fontWeight: 950, letterSpacing: "-0.02em" }}>
            Increase Your Booked Appointments By 25% In 30 Days Guaranteed
          </h1>

          <p style={{ marginTop: 16, fontSize: 18, lineHeight: 1.4, opacity: 0.8, maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
            CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
          </p>

          <div style={{ marginTop: 26 }}>
            <Button label="Test The AI Setter Now!" />
          </div>

          {/* CENTERED BADGE (updated text) */}
          <div
            style={{
              marginTop: 18,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
              fontSize: 13,
              fontWeight: 700,
              opacity: 0.92,
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 999, background: PURPLE, boxShadow: "0 0 18px rgba(124,108,253,0.9)" }} />
            Call All Leads In Under 60 Seconds
          </div>

          <div style={{ marginTop: 42, opacity: 0.62, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>Scroll</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </section>

      {/* ROI (kept short here) */}
      <section style={{ padding: "60px 0", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 18px" }}>
          <h2 style={{ fontSize: 34, fontWeight: 900, textAlign: "center" }}>Calculate Your Lost Revenue</h2>
          <p style={{ marginTop: 10, opacity: 0.72, textAlign: "center" }}>See what slow follow-up costs you.</p>

          <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, padding: 18 }}>
            <div>
              <label style={{ fontSize: 12, opacity: 0.7 }}>Leads Per Month</label>
              <input value={leads} onChange={(e) => setLeads(Number(e.target.value))} type="number" style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.35)", color: "white" }} />
              <div style={{ height: 12 }} />
              <label style={{ fontSize: 12, opacity: 0.7 }}>Close Rate (%)</label>
              <input value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value))} type="number" style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.35)", color: "white" }} />
              <div style={{ height: 12 }} />
              <label style={{ fontSize: 12, opacity: 0.7 }}>Revenue Per Customer</label>
              <input value={revenuePerCustomer} onChange={(e) => setRevenuePerCustomer(Number(e.target.value))} type="number" style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 10, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.35)", color: "white" }} />
              <p style={{ marginTop: 10, fontSize: 11, opacity: 0.55 }}>Assumes a 20% lift from faster response time.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <div style={{ opacity: 0.75, marginBottom: 6 }}>Estimated Revenue Lost Per Month</div>
              <div style={{ fontSize: 54, fontWeight: 950, color: PURPLE }}>${monthlyLoss.toLocaleString()}</div>
              <div style={{ opacity: 0.75, marginTop: 10, marginBottom: 6 }}>Estimated Revenue Lost Per Year</div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#C8C2FF" }}>${yearlyLoss.toLocaleString()}</div>

              <div style={{ marginTop: 18 }}>
                <Button label="Test The AI Setter Now!" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL FORM */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={() => setShowForm(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }} />
          <div style={{ position: "relative", zIndex: 2, width: "100%", maxWidth: 420, background: "rgba(17,16,26,0.95)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: 18 }}>
            <button onClick={() => setShowForm(false)} style={{ position: "absolute", right: 12, top: 10, background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 18 }}>✕</button>
            <h3 style={{ fontSize: 22, fontWeight: 950 }}>Test The AI Setter</h3>
            <p style={{ marginTop: 6, opacity: 0.75, fontSize: 13 }}>Enter your details and we’ll connect you with a live AI voice demo.</p>

            <form onSubmit={onSubmit} style={{ marginTop: 14, display: "grid", gap: 10 }}>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ padding: 12, borderRadius: 10, border: errors.name ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.35)", color: "white" }}
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={{ padding: 12, borderRadius: 10, border: errors.email ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.35)", color: "white" }}
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={{ padding: 12, borderRadius: 10, border: errors.phone ? "1px solid #ef4444" : "1px solid rgba(255,255,255,0.12)", background: "rgba(0,0,0,0.35)", color: "white" }}
              />

              <button type="submit" style={{ padding: 12, borderRadius: 10, border: "none", background: PURPLE, color: "white", fontWeight: 950, cursor: "pointer" }}>
                Submit
              </button>

              {submitted && <div style={{ textAlign: "center", color: "#34d399", fontSize: 13 }}>Success! We'll be in touch shortly.</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
