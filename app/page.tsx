"use client";

import React, { useEffect, useMemo, useState } from "react";
import { PhoneCall, ChevronDown, CheckCircle, Bot, Cpu, Zap } from "lucide-react";

const LOGO_SRC = "/logo-callsetterai.png"; // ensure this exists in /public
const BUILD_ID = "tailwind-svg-waves-v4";

function HeroWaves() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gBrand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5A46F6" stopOpacity="1" />
            <stop offset="100%" stopColor="#7C6CFD" stopOpacity="1" />
          </linearGradient>

          <radialGradient id="wash" cx="50%" cy="10%" r="80%">
            <stop offset="0%" stopColor="#7C6CFD" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#0B0A12" stopOpacity="1" />
          </radialGradient>

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Hex pattern */}
          <path id="hx" d="M14 0 L28 8.1 L28 24.3 L14 32.4 L0 24.3 L0 8.1 Z" />
          <pattern id="hex" width="42" height="38" patternUnits="userSpaceOnUse">
            <use href="#hx" fill="none" stroke="rgba(122,101,255,0.22)" strokeWidth="1" x="0" y="0" />
            <use href="#hx" fill="none" stroke="rgba(90,70,246,0.18)" strokeWidth="1" x="21" y="19" />
          </pattern>

          <style>{`
            .driftA { animation: driftA 10s ease-in-out infinite; }
            .driftB { animation: driftB 12s ease-in-out infinite; }
            .driftC { animation: driftC 14s ease-in-out infinite; }
            @keyframes driftA { 0%{transform:translateX(0)} 50%{transform:translateX(-60px)} 100%{transform:translateX(0)} }
            @keyframes driftB { 0%{transform:translateX(0)} 50%{transform:translateX(70px)} 100%{transform:translateX(0)} }
            @keyframes driftC { 0%{transform:translateX(0)} 50%{transform:translateX(-40px)} 100%{transform:translateX(0)} }
          `}</style>
        </defs>

        {/* Base wash */}
        <rect width="1600" height="900" fill="url(#wash)" />

        {/* Hex layer */}
        <g opacity="0.55">
          <rect x="-80" y="-60" width="1760" height="1020" fill="url(#hex)" />
        </g>

        {/* VERY OBVIOUS WAVES (glow + animated path) */}
        <g filter="url(#glow)">
          {/* Wave 1 */}
          <g className="driftA">
            <path
              fill="none"
              stroke="url(#gBrand)"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.65"
              d="M-50 260 C 220 120, 480 380, 760 260 S 1320 120, 1650 260"
            >
              <animate
                attributeName="d"
                dur="5.2s"
                repeatCount="indefinite"
                values="
                  M-50 260 C 220 120, 480 380, 760 260 S 1320 120, 1650 260;
                  M-50 260 C 220 180, 480 320, 760 260 S 1320 180, 1650 260;
                  M-50 260 C 220 120, 480 380, 760 260 S 1320 120, 1650 260
                "
              />
            </path>

            <path
              fill="none"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="16 14"
              d="M-50 260 C 220 120, 480 380, 760 260 S 1320 120, 1650 260"
            >
              <animate
                attributeName="d"
                dur="5.2s"
                repeatCount="indefinite"
                values="
                  M-50 260 C 220 120, 480 380, 760 260 S 1320 120, 1650 260;
                  M-50 260 C 220 180, 480 320, 760 260 S 1320 180, 1650 260;
                  M-50 260 C 220 120, 480 380, 760 260 S 1320 120, 1650 260
                "
              />
            </path>
          </g>

          {/* Wave 2 */}
          <g className="driftB">
            <path
              fill="none"
              stroke="url(#gBrand)"
              strokeWidth="14"
              strokeLinecap="round"
              opacity="0.55"
              d="M-50 340 C 260 240, 500 470, 820 340 S 1340 210, 1650 340"
            >
              <animate
                attributeName="d"
                dur="6.0s"
                repeatCount="indefinite"
                values="
                  M-50 340 C 260 240, 500 470, 820 340 S 1340 210, 1650 340;
                  M-50 340 C 260 290, 500 420, 820 340 S 1340 260, 1650 340;
                  M-50 340 C 260 240, 500 470, 820 340 S 1340 210, 1650 340
                "
              />
            </path>
          </g>

          {/* Wave 3 */}
          <g className="driftC" opacity="0.65">
            <path
              fill="none"
              stroke="rgba(124,108,253,0.65)"
              strokeWidth="10"
              strokeLinecap="round"
              d="M-50 430 C 220 360, 520 540, 820 430 S 1380 330, 1650 430"
            >
              <animate
                attributeName="d"
                dur="6.6s"
                repeatCount="indefinite"
                values="
                  M-50 430 C 220 360, 520 540, 820 430 S 1380 330, 1650 430;
                  M-50 430 C 220 400, 520 500, 820 430 S 1380 370, 1650 430;
                  M-50 430 C 220 360, 520 540, 820 430 S 1380 330, 1650 430
                "
              />
            </path>
          </g>
        </g>

        {/* Depth overlay */}
        <rect width="1600" height="900" fill="url(#wash)" opacity="0.55" />
      </svg>

      {/* Keep overlays LIGHT so waves stay visible */}
      <div className="absolute inset-0 bg-[radial-gradient(900px_520px_at_50%_10%,rgba(122,101,255,0.18),transparent_62%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/5 to-[#0B0A12]" />
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

  const CTA = ({ label }: { label: string }) => (
    <button
      onClick={() => setShowForm(true)}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-bold bg-brand hover:bg-brand2 transition-colors"
    >
      <PhoneCall className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="bg-ink text-white">
      {/* VERSION STAMP (proves latest deploy) */}
      <div className="fixed bottom-2 right-2 z-[9999] text-[10px] text-white/50">
        {BUILD_ID}
      </div>

      {/* NAV */}
      <header
        className={`fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all ${
          scrolled ? "bg-[#0b0a12]/85 backdrop-blur-md py-2" : "bg-[#0b0a12]/60 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="Call Setter AI" className="h-8 w-auto" />
          </div>
          <CTA label="Test The AI Setter Now" />
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen pt-28 overflow-hidden flex items-center">
        <HeroWaves />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.03]">
            Increase Your Booked Appointments By 25% In 30 Days Guaranteed
          </h1>

          <p className="mt-5 text-lg text-white/75 max-w-3xl mx-auto">
            CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
          </p>

          <div className="mt-7 flex justify-center">
            <CTA label="Test The AI Setter Now!" />
          </div>

          {/* CENTERED BADGE (updated text) */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full bg-brand shadow-[0_0_18px_rgba(124,108,253,0.9)]" />
              <span className="text-sm font-semibold">
                Call All Leads In Under 60 Seconds
              </span>
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-white/60">
            <span className="text-xs">Scroll</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* WHY SPEED-TO-LEAD */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold">Why Speed-to-Lead Works</h2>
          <p className="mt-3 text-white/70">The data is clear: the faster you respond, the more deals you close</p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {[
              { num: "391%", title: "Higher Conversion", text: "Leads contacted within the first minute convert dramatically more often." },
              { num: "10x", title: "More Likely to Connect", text: "Calling within five minutes massively increases contact rates." },
              { num: "80%", title: "Drop After 5 Minutes", text: "Contact rates collapse when response is delayed." },
              { num: "24/7", title: "Instant Coverage", text: "Leads are called day, night, and weekends." },
            ].map((m, i) => (
              <div key={i} className="bg-panel border border-white/10 rounded-xl p-6">
                <div className="text-5xl font-black text-brand">{m.num}</div>
                <div className="mt-2 text-lg font-bold">{m.title}</div>
                <div className="mt-2 text-sm text-white/70">{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white/2">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center">We Do Everything. You Get Bookings.</h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Bot className="h-10 w-10 text-brand2" />, title: "We Build It", text: "We custom-build your AI appointment setter around your offer, qualification rules, and booking flow." },
              { icon: <Cpu className="h-10 w-10 text-brand2" />, title: "We Connect Everything", text: "We connect your CRM, lead forms, ad platforms, phone system, and calendar so every lead routes instantly." },
              { icon: <Zap className="h-10 w-10 text-brand2" />, title: "Leads Get Booked", text: "Every new lead is called automatically within 60 seconds, qualified, and booked directly on your calendar." },
            ].map((s, i) => (
              <div key={i} className="bg-panel border border-white/10 rounded-2xl p-6">
                <div>{s.icon}</div>
                <div className="mt-4 text-2xl font-bold">{s.title}</div>
                <div className="mt-2 text-sm text-white/70">{s.text}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 max-w-5xl mx-auto">
            <h3 className="text-3xl font-extrabold text-center">What You Get</h3>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
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
              ].map((x, i) => (
                <div key={i} className="flex items-start gap-2 text-white/90">
                  <CheckCircle className="h-4 w-4 mt-1 text-brand" />
                  <span className="text-sm">{x}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-xs text-white/55">
              All setup is handled inside your business. Nothing is outsourced to templates.
            </p>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center">Calculate Your Lost Revenue</h2>
          <p className="mt-3 text-center text-white/70">See what slow follow-up costs you.</p>

          <div className="mt-10 bg-panel border border-white/10 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70">Leads Per Month</label>
                <input
                  className="mt-2 w-full rounded-md bg-black/40 border border-white/10 p-3 outline-none"
                  type="number"
                  value={leads}
                  onChange={(e) => setLeads(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Close Rate (%)</label>
                <input
                  className="mt-2 w-full rounded-md bg-black/40 border border-white/10 p-3 outline-none"
                  type="number"
                  value={closeRate}
                  onChange={(e) => setCloseRate(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="text-sm text-white/70">Revenue Per Customer</label>
                <input
                  className="mt-2 w-full rounded-md bg-black/40 border border-white/10 p-3 outline-none"
                  type="number"
                  value={revenuePerCustomer}
                  onChange={(e) => setRevenuePerCustomer(Number(e.target.value))}
                />
              </div>
              <p className="text-xs text-white/55">Assumes a 20% lift from faster response time.</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-white/70">Estimated Revenue Lost Per Month</div>
              <div className="mt-2 text-5xl font-black text-brand">
                ${monthlyLoss.toLocaleString()}
              </div>
              <div className="mt-6 text-white/70">Estimated Revenue Lost Per Year</div>
              <div className="mt-2 text-3xl font-extrabold text-white/85">
                ${yearlyLoss.toLocaleString()}
              </div>
              <div className="mt-8">
                <CTA label="Test The AI Setter Now!" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black">Try Call Setter AI Now!</h2>
          <div className="mt-8 flex justify-center">
            <CTA label="Try Now!" />
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative z-10 w-full max-w-md bg-panel border border-white/10 rounded-2xl p-6">
            <button className="absolute right-3 top-3 text-white/60 hover:text-white" onClick={() => setShowForm(false)}>
              ✕
            </button>

            <h3 className="text-2xl font-extrabold">Test The AI Setter</h3>
            <p className="mt-2 text-sm text-white/70">Enter your details and we’ll connect you with a live AI voice demo.</p>

            <form className="mt-5 space-y-3" onSubmit={onSubmit}>
              <div>
                <input
                  className={`w-full rounded-md bg-black/40 border p-3 outline-none ${errors.name ? "border-red-500" : "border-white/10"}`}
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <div className="mt-1 text-xs text-red-400">{errors.name}</div>}
              </div>

              <div>
                <input
                  className={`w-full rounded-md bg-black/40 border p-3 outline-none ${errors.email ? "border-red-500" : "border-white/10"}`}
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <div className="mt-1 text-xs text-red-400">{errors.email}</div>}
              </div>

              <div>
                <input
                  className={`w-full rounded-md bg-black/40 border p-3 outline-none ${errors.phone ? "border-red-500" : "border-white/10"}`}
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                {errors.phone && <div className="mt-1 text-xs text-red-400">{errors.phone}</div>}
              </div>

              <button className="w-full rounded-md bg-brand hover:bg-brand2 transition-colors font-extrabold py-3">
                Submit
              </button>

              {submitted && <div className="text-center text-sm text-emerald-400">Success! We'll be in touch shortly.</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
