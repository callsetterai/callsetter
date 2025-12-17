"use client";

import { useEffect, useMemo, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, CheckCircle, Zap, PhoneCall, Cpu, Bot } from 'lucide-react';

/**
 * Call Setter AI — Single-file Next.js/React + Tailwind site
 * - Fixed top navbar with logo (uses "/logo.png" from public root)
 * - Fullscreen hero with animated iPhone/AI visuals
 * - Section in-view animations & subtle parallax
 * - ROI calculator with live updates
 * - Scroll-aware navbar compression + shadow
 * - Minimal, conversion-first, dark/futuristic aesthetic per brief
 */

const LOGO_SRC = "/logo.png"; // real logo path
const FALLBACK_LOGO = "/logo.svg"; // placeholder if you haven't added logo.png yet

export default function Page() {
  const [leads, setLeads] = useState(300);
  const [closeRate, setCloseRate] = useState(10);
  const [revenuePerCustomer, setRevenuePerCustomer] = useState(1500);
  const [scrolled, setScrolled] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(true);

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

  // ROI test cases (unchanged + added)
  useEffect(() => {
    const calc = (L: number, R: number, V: number) => Math.round(L * (R / 100) * V * 0.2);
    console.assert(calc(300, 10, 1500) === 9000, 'TestCase#1 failed: expected 9000');
    console.assert(calc(100, 20, 1000) === 4000, 'TestCase#2 failed: expected 4000');
    console.assert(calc(0, 10, 1500) === 0, 'TestCase#3 failed: expected 0 for zero leads');
    console.assert(calc(500, 0, 2000) === 0, 'TestCase#4 failed: expected 0 for zero close rate');
    console.assert(calc(250, 12.5, 800) === Math.round(250 * 0.125 * 800 * 0.2), 'TestCase#5 failed: decimal rate');
    console.assert(calc(10000, 5, 3000) === Math.round(10000 * 0.05 * 3000 * 0.2), 'TestCase#6 failed: large numbers');
  }, []);

  const fadeUp = {
    initial: { y: 16, opacity: 0 },
    whileInView: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: 'easeOut' },
    viewport: { once: true, amount: 0.2 }
  } as const;

  return (
    <div className="bg-[#0a0a0a] text-white font-sans overflow-x-hidden relative selection:bg-cyan-500/30 selection:text-white">
      {/* NAVBAR */}
      <header
        className={[
          "fixed top-0 left-0 w-full z-50 border-b border-white/10 transition-all duration-300",
          scrolled ? "bg-black/80 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] py-2" : "bg-black/40 backdrop-blur-sm py-4"
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-3 group">
            <img
              src={logoLoaded ? LOGO_SRC : FALLBACK_LOGO}
              alt="Call Setter AI"
              className="h-8 w-auto drop-shadow-[0_0_20px_rgba(34,211,238,0.25)]"
              onError={() => setLogoLoaded(false)}
            />
            <span className="sr-only">Call Setter AI</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-300">
            <a href="#why" className="hover:text-white transition-colors">Why</a>
            <a href="#how" className="hover:text-white transition-colors">How</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#roi" className="hover:text-white transition-colors">ROI</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>
          <a href="#cta" className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition-all flex items-center gap-2">
            <PhoneCall className="w-4 h-4" /> Test The AI Setter Now
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 overflow-hidden pt-32">
        <motion.div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage: `
              radial-gradient(70rem 40rem at 50% -10%, rgba(34,211,238,0.10), transparent 60%),
              radial-gradient(50rem 30rem at 100% 10%, rgba(59,130,246,0.10), transparent 70%),
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
          }}
        />
        <motion.div
          style={{ y: phoneYOffset, opacity: glowOpacity }}
          className="pointer-events-none absolute w-[320px] h-[640px] md:w-[420px] md:h-[780px] bg-gradient-to-b from-cyan-400/20 to-transparent rounded-[2.2rem] border border-cyan-400/30 backdrop-blur-xl rotate-6 right-[8%] top-[18%] shadow-[0_0_80px_rgba(34,211,238,0.25)]"
        />
        <motion.div
          style={{ y: phoneYOffset, opacity: glowOpacity }}
          className="pointer-events-none absolute w-[260px] h-[560px] bg-gradient-to-b from-blue-400/20 to-transparent rounded-[2rem] border border-blue-400/30 backdrop-blur-xl -rotate-6 left-[8%] top-[24%] shadow-[0_0_80px_rgba(59,130,246,0.25)]"
        />

        <motion.h1 {...fadeUp} className="text-5xl md:text-6xl font-extrabold max-w-4xl leading-tight tracking-tight">
          Increase Your Booked Appointments By 25% In 30 Days Guaranteed
        </motion.h1>
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="text-lg text-gray-300 max-w-2xl mt-4">
          CallSetter.ai builds AI voice agents that instantly call, qualify, and book inbound leads so high-spending advertisers capture demand before competitors do.
        </motion.p>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.15 }} className="flex gap-4 mt-8">
          <a href="#cta" className="bg-white text-black px-8 py-3 font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2">
            <PhoneCall className="w-5 h-5" /> Test The AI Setter Now!
          </a>
        </motion.div>

        <motion.div initial={{ y: 0 }} animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6 text-gray-400 flex items-center gap-2">
          <span className="text-xs">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* WHY */}
      <section id="why" className="py-20 text-center px-6 relative">
        <motion.h2 {...fadeUp} className="text-4xl font-bold mb-4">Why Speed-to-Lead Works</motion.h2>
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-gray-400 mb-12">
          The data is clear: the faster you respond, the more deals you close.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { num: '391%', title: 'Higher Conversion', text: 'Leads contacted within the first minute convert dramatically more often.' },
            { num: '10x', title: 'More Likely to Connect', text: 'Calling within five minutes massively increases contact rates.' },
            { num: '80%', title: 'Drop After 5 Minutes', text: 'Contact rates collapse when response is delayed.' },
            { num: '24/7', title: 'Instant Coverage', text: 'Leads are called day, night, and weekends.' },
          ].map((m, i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex flex-col items-center bg-[#111] p-6 rounded-xl border border-gray-800 shadow-lg shadow-cyan-500/5"
            >
              <h3 className="text-5xl font-extrabold text-cyan-400 mb-2">{m.num}</h3>
              <p className="text-lg font-semibold mb-2">{m.title}</p>
              <p className="text-gray-500 text-sm max-w-[220px]">{m.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OUTCOME */}
      <section className="py-24 bg-[#111] text-center px-6">
        <motion.h2 {...fadeUp} className="text-4xl font-bold mb-6 max-w-3xl mx-auto">
          Respond To All Leads Within 60 Seconds And Take Leads 24/7
        </motion.h2>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-gray-400 max-w-2xl mx-auto text-lg space-y-2">
          <p>By calling new leads in under 60 seconds and following up consistently, businesses typically see a 15–25% increase in booked appointments within the first 30 days.</p>
          <p>No changes to ads.</p>
          <p>No new hires.</p>
          <p>Just faster, consistent execution.</p>
        </motion.div>
      </section>

      {/* HOW + WHAT YOU GET */}
      <section id="how" className="py-24 px-6 bg-[#0d0d0d]">
        <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-12">We Do Everything. You Get Bookings.</motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          {[
            { icon: <Bot className='w-10 h-10 text-cyan-400 mb-3' />, title: 'We Build It', text: 'We custom-build your AI appointment setter around your offer, qualification rules, and booking flow.' },
            { icon: <Cpu className='w-10 h-10 text-cyan-400 mb-3' />, title: 'We Connect Everything', text: 'We connect your CRM, lead forms, ad platforms, phone system, and calendar so every lead routes instantly.' },
            { icon: <Zap className='w-10 h-10 text-cyan-400 mb-3' />, title: 'Leads Get Booked', text: 'Every new lead is called automatically within 60 seconds, qualified, and booked directly on your calendar.' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="p-6 bg-[#1a1a1a] rounded-2xl border border-gray-800 shadow-lg hover:shadow-cyan-500/10 transition-shadow"
            >
              {s.icon}
              <h3 className="text-2xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm">{s.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="max-w-5xl mx-auto mt-24">
          <motion.h3 {...fadeUp} className="text-3xl font-bold mb-6 text-center">What You Get</motion.h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300 text-sm">
            {[
              'Done-for-you AI voice appointment setter',
              'Custom scripting and call logic built for your business',
              'Automatic calling of every new lead within 60 seconds',
              'Full CRM, lead source, and calendar integration',
              'Real-time bookings sent directly to your calendar',
              'Call recordings and transcriptions',
              'Voice customization including tone, pace, and language',
              'Automatic follow-up for unanswered leads',
              'Human transfer to your team when needed',
              'Ongoing monitoring, updates, and support',
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.02 }} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-400 mt-1" />
                <p>{item}</p>
              </motion.div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6 text-center">All setup is handled inside your business. Nothing is outsourced to templates.</p>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 px-6 bg-black">
        <motion.h2 {...fadeUp} className="text-4xl font-bold mb-12 text-center">Everything CallSetter.ai Handles For You</motion.h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-gray-300">
          {[
            '24/7 AI receptionist answering inbound calls',
            'Calling every new web lead within 60 seconds',
            'Reviving old and dead leads automatically',
            'Confirming booked appointments to reduce no-shows',
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ y: 8, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="p-4 bg-[#151515] rounded-xl border border-gray-800 flex items-center gap-3 hover:border-cyan-400/30 transition-colors"
            >
              <Bot className="w-6 h-6 text-cyan-400" /> {s}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ROI */}
      <section id="roi" className="py-24 px-6 bg-[#0a0a0a]">
        <motion.h2 {...fadeUp} className="text-4xl font-bold text-center mb-4">Calculate Your Lost Revenue</motion.h2>
        <motion.p {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.06 }} className="text-center text-gray-400 mb-12">
          See what slow follow-up costs you.
        </motion.p>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-lg">
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Leads Per Month</label>
                <input type="number" value={leads} onChange={(e) => setLeads(Number(e.target.value))} className="w-full bg-black border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="300" />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Close Rate (%)</label>
                <input type="number" value={closeRate} onChange={(e) => setCloseRate(Number(e.target.value))} className="w-full bg-black border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="10" />
                <p className="text-xs text-gray-500 mt-1">Percent of leads that become customers</p>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Revenue Per Customer</label>
                <input type="number" value={revenuePerCustomer} onChange={(e) => setRevenuePerCustomer(Number(e.target.value))} className="w-full bg-black border border-gray-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" placeholder="1500" />
              </div>
              <p className="text-xs text-gray-500">Assumes a 20% lift from faster response time.</p>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="flex flex-col justify-center items-center text-center">
            <div className="text-gray-400 mb-2">Estimated Revenue Lost Per Month</div>
            <motion.div key={monthlyLoss} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="text-5xl font-extrabold mb-6 text-cyan-400">
              ${monthlyLoss.toLocaleString()}
            </motion.div>
            <div className="text-gray-400 mb-2">Estimated Revenue Lost Per Year</div>
            <motion.div key={yearlyLoss} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="text-3xl font-bold mb-8 text-cyan-300">
              ${yearlyLoss.toLocaleString()}
            </motion.div>
            <div className="flex gap-4">
              <a href="#cta" className="bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 flex items-center gap-2">
                <PhoneCall className="w-4 h-4" /> Test The AI Setter Now!
              </a>
              <a href="#cta" className="border border-gray-600 px-6 py-3 rounded-full hover:bg-gray-800">Book a Demo</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHO */}
      <section className="py-24 px-6 bg-[#111] grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
        <motion.div {...fadeUp}>
          <h2 className="text-4xl font-bold mb-6">Built for Businesses That Book Appointments for Revenue</h2>
          <p className="text-gray-400 mb-6">CallSetter.ai is designed for businesses where booked appointments directly drive sales. If you generate leads, rely on scheduled calls, or spend over five thousand per month on ads, faster response time is not optional. It is the difference between winning and losing the deal.</p>
        </motion.div>
        <ul className="text-gray-300 space-y-3">
          {['Lead generation agencies','Local and national service businesses','High-ticket sales teams','Advertisers buying inbound leads at scale'].map((item, i) => (
            <motion.li key={i} initial={{ x: 8, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }} className="bg-[#1a1a1a] border border-gray-800 rounded-md p-4 flex items-center gap-3">
              <Zap className="w-5 h-5 text-cyan-400" /> {item}
            </motion.li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-black max-w-5xl mx-auto">
        <motion.h2 {...fadeUp} className="text-4xl font-bold mb-12 text-center">FAQ</motion.h2>
        <div className="space-y-4">
          {[
            { q: 'Will this sound robotic?', a: 'No. The voice is natural and designed for real conversations.' },
            { q: 'How fast can we go live?', a: 'Most clients are live within a few days.' },
            { q: 'Does this integrate with my CRM?', a: 'Yes. We support GHL and non-GHL setups.' },
            { q: 'What happens if a lead does not answer?', a: 'The system follows up automatically based on your rules.' },
          ].map((faq, i) => (
            <motion.details key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-[#151515] border border-gray-800 rounded-lg p-4">
              <summary className="cursor-pointer flex justify-between items-center font-semibold text-lg">
                {faq.q} <ChevronDown className="w-5 h-5" />
              </summary>
              <p className="text-gray-400 mt-2 text-sm">{faq.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="cta" className="py-24 text-center bg-gradient-to-b from-[#0a0a0a] to-black relative overflow-hidden">
        <motion.div aria-hidden className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent blur-3xl" initial={{ opacity: 0.3 }} animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ repeat: Infinity, duration: 6 }} />
        <motion.h2 {...fadeUp} className="text-5xl font-bold mb-6 relative z-10">Try Call Setter AI Now!</motion.h2>
        <motion.a whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }} href="#top" className="bg-white text-black px-10 py-4 font-bold rounded-full text-lg hover:bg-gray-200 transition-all relative z-10 flex items-center gap-2 mx-auto">
          <Bot className="w-6 h-6" /> Try Now!
        </motion.a>
      </section>

      {/* GLOBAL helpers for hero grid mask */}
      <style jsx global>{`
        html { scroll-behavior: smooth; }
        section#top::before {
          content: "";
          position: absolute; inset: 0; pointer-events: none; z-index: -1;
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 45%, transparent 70%);
        }
      `}</style>
    </div>
  );
}
