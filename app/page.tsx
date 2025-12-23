"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck, Timer } from "lucide-react";

import Navbar from "../components/Navbar";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";
import ComparisonTable from "../components/ComparisonTable";
import FeatureCard from "../components/FeatureCard";
import Calculator from "../components/Calculator";
import FAQ from "../components/FAQ";
import TryNowCard from "../components/TryNowCard";
import Footer from "../components/Footer";
import TryAgentModal from "../components/TryAgentModal";

export default function Page() {
  const [tryOpen, setTryOpen] = useState(false);

  const faqs = [
    {
      q: "How fast do you call new leads?",
      a: "We can trigger outreach within 60 seconds of opt in and follow up based on your rules.",
    },
    {
      q: "Do you work with my CRM?",
      a: "If your CRM can receive webhooks or has Zapier, it is usually compatible. GHL is the easiest.",
    },
    {
      q: "Does this replace my setters?",
      a: "It replaces missed leads and inconsistent follow up, and supports your team by booking qualified calls.",
    },
    {
      q: "What does the guarantee mean?",
      a: "Define it precisely: baseline, tracking window, setup requirements, and what counts as a booked appointment.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-white" />

        <div className="containerX relative py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Increase Your Booked Appointments By <span className="text-indigo-600">25%</span> In 30 Days Guaranteed
            </h1>

            <p className="muted mx-auto mt-4 max-w-2xl text-base sm:text-lg">
              We contact every inbound lead within 60 seconds, qualify them, and book appointments automatically, 24/7.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button className="btnPrimary px-6 py-3 text-base">
                BOOK A DEMO <ArrowRight className="ml-2 h-4 w-4" />
              </button>

              <button onClick={() => setTryOpen(true)} className="btnGhost px-6 py-3 text-base">
                TRY THE LIVE AGENT
              </button>
            </div>

            <div className="mt-6 text-xs text-zinc-500">
              Put your real guarantee terms on the page, baseline and tracking, or do not claim it.
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 sm:py-20">
        <div className="containerX">
          <SectionHeader
            kicker="Why Speed-to-Lead Works"
            title="Speed wins because attention expires fast"
            subtitle="If you call late, you are not competing."
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard top="Higher conversion" mid="391%" bot="More likely to reach leads when you respond quickly." />
            <StatCard top="More likely to connect" mid="10x" bot="Intent is highest right after they opt in." />
            <StatCard top="Less wasted spend" mid="80%" bot="Fewer leads fall through the cracks." />
            <StatCard top="More likely to qualify" mid="21x" bot="You talk to them before competitors do." />
          </div>

          <div className="mt-14">
            <ComparisonTable />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="containerX">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="h2">Respond to all leads within 60 seconds and take leads 24/7</h2>
              <p className="muted mt-3">
                You do not need more leads. You need to stop leaking the ones you already paid for.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FeatureCard
                  title="New lead follow up"
                  bullets={[
                    "Calls or texts within 60 seconds of opt in",
                    "Qualifies using your rules",
                    "Books directly on your calendar",
                  ]}
                />
                <FeatureCard
                  title="Dead lead revival"
                  bullets={[
                    "Re-contacts old leads automatically",
                    "Finds who is ready now",
                    "Turns old ad spend into revenue",
                  ]}
                />
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Timer className="h-4 w-4 text-indigo-600" />
                <span>Live Demo Preview</span>
              </div>
              <div className="mt-3 aspect-[16/10] rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-indigo-50" />
              <div className="mt-4 text-xs text-zinc-600">Replace with your real product screenshot.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-zinc-950">
        <div className="containerX">
          <SectionHeader
            kicker="How It Works"
            title="We do everything, you get bookings"
            subtitle="Simple process, no drama."
            dark
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            <FeatureCard
              dark
              title="1. We build"
              bullets={["Connect your forms, inbox, and CRM", "Define rules and routing", "Set consent flows"]}
            />
            <FeatureCard
              dark
              title="2. We connect everything"
              bullets={["Webhook triggers", "Calendar booking and reminders", "CRM notes and pipeline movement"]}
            />
            <FeatureCard
              dark
              title="3. Leads get booked"
              bullets={["Instant outreach", "Dead lead revival", "No show reduction confirmations"]}
            />
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-white font-bold">What you get</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">Voice agent</div>
                <div className="mt-1 text-sm text-white/70">Human sounding calls that qualify and book.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">SMS follow up</div>
                <div className="mt-1 text-sm text-white/70">Fast confirmations and reminders.</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold text-white">CRM automation</div>
                <div className="mt-1 text-sm text-white/70">Notes, tags, and pipeline movement.</div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-start justify-center gap-2 text-xs text-white/60">
            <ShieldCheck className="h-4 w-4 text-indigo-300" />
            <span>If you cannot measure baseline, your guarantee language is marketing fluff.</span>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="containerX">
          <SectionHeader
            kicker="Everything handled"
            title="Everything CallSetterAI handles for you"
            subtitle="You should not be doing manual follow up in 2025."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard title="New leads" bullets={["Instant outreach", "Qualification rules", "Calendar booking"]} />
            <FeatureCard title="Old leads" bullets={["Revival campaigns", "Intent detection", "Rebooking flows"]} />
            <FeatureCard title="No shows" bullets={["Confirmations", "Reminders", "Reschedule recovery"]} />
          </div>
        </div>
      </section>

      <section id="roi" className="py-16 sm:py-20 bg-zinc-50">
        <div className="containerX">
          <Calculator />
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-zinc-50" id="faqs">
        <div className="containerX">
          <SectionHeader kicker="FAQ" title="Frequently Asked Questions" subtitle="Stuff people ask before they buy." />
          <div className="mt-10">
            <FAQ items={faqs} />
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="containerX">
          <div className="card p-8 text-center">
            <div className="text-3xl font-extrabold tracking-tight text-indigo-600">110% Money Back Guarantee</div>
            <p className="muted mx-auto mt-3 max-w-2xl">
              Put the real terms here, baseline, tracking, requirements, and what counts as a booked appointment.
            </p>
            <div className="mt-6">
              <button className="btnPrimary px-6 py-3 text-base">BOOK A DEMO</button>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-16 sm:py-20 bg-zinc-950">
        <div className="containerX">
          <SectionHeader
            kicker="Try it"
            title="Try Call Setter AI Now"
            subtitle="Let prospects test the agent, then push them to book."
            dark
          />

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <TryNowCard name="Emma" role="Appointment setting specialist" onTry={() => setTryOpen(true)} />
            <TryNowCard name="Jules" role="Inbound qualifier" onTry={() => setTryOpen(true)} />
          </div>

          <Footer />
        </div>
      </section>

      <TryAgentModal open={tryOpen} onClose={() => setTryOpen(false)} />
    </div>
  );
}
