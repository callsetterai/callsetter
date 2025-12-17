import { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, CheckCircle, Zap, PhoneCall, Cpu, Bot } from 'lucide-react';

/**
 * Call Setter AI — Single-file Next.js/React + Tailwind site
 * - Fixed top navbar with logo (uses "/logo.png" from public root)
 * - Fullscreen hero with animated visuals
 * - Animated sections, ROI calculator, modal form
 * - Ready for Vercel deploy
 */

const LOGO_SRC = "/logo.png"; // ✅ your logo path

export default function CallSetterAI() {
  const [leads, setLeads] = useState(300);
  const [closeRate, setCloseRate] = useState(10);
  const [revenuePerCustomer, setRevenuePerCustomer] = useState(1500);
  const [scrolled, setScrolled] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const { scrollY } = useScroll();
  const phoneYOffset = useTransform(scrollY, [0, 400], [0, -40]);
  const glowOpacity = useTransform(scrollY, [0, 600], [0.6, 0.2]);

  const monthlyLoss = useMemo(
    () => Math.round(leads * (closeRate / 100) * revenuePerCustomer * 0.2),
    [leads, closeRate, revenuePerCustomer]
  );
  const yearlyLoss = useMemo(() => monthlyLoss * 12, [monthlyLoss]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showForm ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showForm]);

  // Close modal on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowForm(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fadeUp = {
    initial: { y: 16, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: 'easeOut' },
    viewport: { once: true, amount: 0.2 },
  } as const;

  function validate() {
    const next: typeof errors = {};
    if (!form.name.trim()) next.name = 'Required';
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!/^\\+?[0-9\\-()\\s]{7,}$/.test(form.phone)) next.phone = 'Enter a valid phone';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    // TODO: Add your webhook URL here:
    // await fetch("https://your-webhook-url.com", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });
    console.log("Lead submitted", form);
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setForm({ name: '', email: '', phone: '' });
    }, 1200);
  }

  return (
    <div className="bg-[#0a0a0a] text-white font-sans">
      {/* ============================ NAVBAR ============================ */}
      <header className={`fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-2' : 'bg-black/40 py-4'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <img src={LOGO_SRC} alt="Call Setter AI" className="h-8 w-auto" />
          <button onClick={() => setShowForm(true)} className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
            <PhoneCall className="w-4 h-4" /> Test The AI Setter Now
          </button>
        </div>
      </header>

      {/* ============================ HERO ============================ */}
      <section id="top" className="min-h-screen flex flex-col justify-center items-center text-center pt-32 px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold max-w-3xl">Increase Your Booked Appointments By 25% In 30 Days</h1>
        <p className="text-lg text-gray-300 mt-4 max-w-2xl">
          CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads.
        </p>
        <button onClick={() => setShowForm(true)} className="mt-8 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200">
          <PhoneCall className="w-5 h-5 inline-block mr-2" /> Test The AI Setter Now
        </button>
      </section>

      {/* ============================ ROI CALCULATOR ============================ */}
      <section className="py-24 px-6 bg-black text-center">
        <h2 className="text-4xl font-bold mb-6">Calculate Your Lost Revenue</h2>
        <div className="max-w-4xl mx-auto bg-[#111] p-8 rounded-2xl border border-gray-800">
          <div className="mb-6 space-y-3">
            <input type="number" value={leads} onChange={(e) => setLeads(Number(e.target.value))} placeholder="Leads per month" className="w-full bg-black border border-gray-700 rounded-md p-2 text-center" />
            <input type="number" value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value))} placeholder="Close rate %" className="w-full bg-black border border-gray-700 rounded-md p-2 text-center" />
            <input type="number" value={revenuePerCustomer} onChange={(e) => setRevenuePerCustomer(Number(e.target.value))} placeholder="Revenue per customer" className="w-full bg-black border border-gray-700 rounded-md p-2 text-center" />
          </div>
          <p className="text-cyan-400 text-3xl font-bold">${monthlyLoss.toLocaleString()} / month</p>
          <p className="text-cyan-300 text-xl mt-1">${yearlyLoss.toLocaleString()} / year</p>
          <button onClick={() => setShowForm(true)} className="mt-8 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200">
            <PhoneCall className="w-4 h-4 inline-block mr-2" /> Book a Demo
          </button>
        </div>
      </section>

      {/* ============================ MODAL FORM ============================ */}
      {showForm && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f0f10] p-6 rounded-2xl max-w-md w-full relative border border-white/10">
            <button onClick={() => setShowForm(false)} className="absolute right-3 top-3 text-gray-400 hover:text-white">✕</button>
            <h3 className="text-2xl font-bold mb-4">Test The AI Setter</h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-black border border-gray-700 rounded-md p-2" />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-black border border-gray-700 rounded-md p-2" />
              <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-black border border-gray-700 rounded-md p-2" />
              <button type="submit" className="w-full bg-white text-black py-2 rounded-md font-semibold hover:bg-gray-200">Submit</button>
              {submitted && <p className="text-green-400 text-sm text-center mt-2">Success! We'll be in touch soon.</p>}
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
}
