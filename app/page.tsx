"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

// ====== CHANGE THESE IF YOU WANT ======
const LOGO_SRC = "/logo-callsetterai.png"; // put your logo at /public/logo-callsetterai.png
const BUILD_ID = "waves-strong-v1"; // you'll see this bottom-right (proves you're on the latest deploy)
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

    // Particles
    const particles = Array.from({ length: 34 }).map((_, i) => ({
      x: (i * 97) % 1200,
      y: (i * 173) % 800,
      r: 1.2 + (i % 5) * 0.55,
      s: 0.22 + (i % 7) * 0.035,
      p: (i * 0.37) % (Math.PI * 2),
    }));

    // Hex grid
    const hexR = 14;
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

      // Deep background wash (so waves pop)
      ctx.fillStyle = INK;
      ctx.fillRect(0, 0, w, h);

      const wash = ctx.createRadialGradient(w * 0.5, h * 0.12, 0, w * 0.5, h * 0.25, Math.max(w, h));
      wash.addColorStop(0, "rgba(122,101,255,0.18)");
      wash.addColorStop(0.45, "rgba(90,70,246,0.08)");
      wash.addColorStop(1, "rgba(11,10,18,1)");
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, w, h);

      // Hex field drift (subtle)
      const driftX = Math.sin(t * 0.35) * 22;
      const driftY = Math.cos(t * 0.28) * 14;

      ctx.save();
      ctx.globalAlpha = 0.22 + 0.08 * Math.sin(t * 0.7);
      const xStep = hexR * 1.55;
      const yStep = hexH * 2.05;

      for (let row = -3; row < h / yStep + 4; row++) {
        for (let col = -3; col < w / xStep + 4; col++) {
          const x = col * xStep + (row % 2 ? xStep * 0.5 : 0) + driftX;
          const y = row * yStep + driftY;

          // mask focus near top center
          const nx = (x - w * 0.5) / (w * 0.52);
          const ny = (y - h * 0.18) / (h * 0.82);
          const falloff = Math.max(0, 1 - (nx * nx + ny * ny));
          drawHex(x, y, 0.34 * falloff);
        }
      }
      ctx.restore();

      // ======= VERY APPARENT "VIDEO-LIKE" WAVES =======
      const waveCount = 4;
      for (let i = 0; i < waveCount; i++) {
        const phase = t * (1.05 + i * 0.18);
        const baseY = h * (0.45 + i * 0.065);
        const amp = 46 + i * 12;
        const freq = 0.0072 + i * 0.00135;

        const colorMain = i % 2 === 0 ? PURPLE : PURPLE_2;

        // BIG GLOW UNDERLAY (screen blend = "video energy")
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.38;
        ctx.strokeStyle = colorMain;
        ctx.lineWidth = 26;
        ctx.shadowColor = "rgba(124,108,253,0.95)";
        ctx.shadowBlur = 52;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 7) {
          const n =
            Math.sin(phase + x * freq) * 0.95 +
            Math.sin(phase * 1.5 + x * freq * 0.65) * 0.55 +
            Math.sin(phase * 0.75 + x * freq * 1.9) * 0.28;
          const y = baseY + n * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();

        // SHARP CORE LINE
        ctx.save();
        ctx.globalAlpha = 0.98;
        ctx.strokeStyle = i === 1 ? "rgba(255,255,255,0.38)" : "rgba(175,165,255,0.98)";
        ctx.lineWidth = i === 1 ? 2.8 : 4.0;
        ctx.setLineDash(i === 1 ? [12, 12] : []);
        ctx.shadowColor = "rgba(90,70,246,0.65)";
        ctx.shadowBlur = 18;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 6) {
          const n =
            Math.sin(phase + x * freq) * 0.95 +
            Math.sin(phase * 1.5 + x * freq * 0.65) * 0.55 +
            Math.sin(phase * 0.75 + x * freq * 1.9) * 0.28;
          const y = baseY + n * amp;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      }

      // Particles (adds life)
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (const p of particles) {
        p.p += 0.01 * p.s;
        p.y -= p.s * 0.85;
        if (p.y < -24) p.y = h + 24;

        const tw = 0.35 + 0.35 * Math.sin(t * 2 + p.p);
        ctx.beginPath();
        ctx.fillStyle = `rgba(124,108,253,${0.22 + tw})`;
        ctx.arc((p.x / 1200) * w, (p.y / 800) * h + Math.sin(t + p.p) * 12, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Top fade so headline stays readable (but NOT too dark)
      const topFade = ctx.createLinearGradient(0, 0, 0, h);
      topFade.addColorStop(0, "rgba(11,10,18,0.22)");
      topFade.addColorStop(0.35, "rgba(11,10,18,0.06)");
      topFade.addColorStop(1, "rgba(11,10,18,0.90)");
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
        fontWeight: 700,
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
      {/* BUILD STAMP so you know you are on the latest version */}
      <div style={{ position: "fixed", right: 10, bottom: 10, fontSize: 11, opacity: 0.5, zIndex: 99999 }}>
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
          <h1 style={{ fontSize: "clamp(42px, 6vw, 68px)", lineHeight: 1.05, fontWeight: 900, letterSpacing: "-0.02em" }}>
            Increase Your Booked Appointments By 25% In 30 Days Guaranteed
          </h1>

          <p style={{ marginTop: 16, fontSize: 18, lineHeight: 1.4, opacity: 0.78, maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
            CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
          </p>

          <div style={{ marginTop: 26 }}>
            <Button label="Test The AI Setter Now!" />
          </div>

          <div style={{ marginTop: 40, opacity: 0.6, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 12 }}>Scroll</span>
            <ChevronDown size={16} />
          </div>
        </div>
      </section>

      {/* WHY SPEED-TO-LEAD */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 18px", textAlign: "center" }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>Why Speed-to-Lead Works</h2>
          <p style={{ marginTop: 10, opacity: 0.72 }}>The data is clear: the faster you respond, the more deals you close.</p>

          <div
            style={{
              marginTop: 34,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              textAlign: "left",
            }}
          >
            {[
              { num: "391%", title: "Higher Conversion", text: "Leads contacted within the first minute convert dramatically more often." },
              { num: "10x", title: "More Likely to Connect", text: "Calling within five minutes massively increases contact rates." },
              { num: "80%", title: "Drop After 5 Minutes", text: "Contact rates collapse when response is delayed." },
              { num: "24/7", title: "Instant Coverage", text: "Leads are called day, night, and weekends." },
            ].map((m, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 46, fontWeight: 900, color: PURPLE }}>{m.num}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 6 }}>{m.title}</div>
                <div style={{ marginTop: 6, opacity: 0.75, fontSize: 13, lineHeight: 1.35 }}>{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <section style={{ padding: "80px 0", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 18px" }}>
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.02em" }}>Calculate Your Lost Revenue</h2>
            <p style={{ marginTop: 10, opacity: 0.72 }}>See what slow follow-up costs you.</p>
          </div>

          <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 16, padding: 18 }}>
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
              <div style={{ fontSize: 54, fontWeight: 900, color: PURPLE }}>${monthlyLoss.toLocaleString()}</div>
              <div style={{ opacity: 0.75, marginTop: 10, marginBottom: 6 }}>Estimated Revenue Lost Per Year</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#C8C2FF" }}>${yearlyLoss.toLocaleString()}</div>

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
            <h3 style={{ fontSize: 22, fontWeight: 900 }}>Test The AI Setter</h3>
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

              <button type="submit" style={{ padding: 12, borderRadius: 10, border: "none", background: PURPLE, color: "white", fontWeight: 900, cursor: "pointer" }}>
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
