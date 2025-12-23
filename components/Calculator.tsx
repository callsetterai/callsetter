"use client";

import { useMemo, useState } from "react";

export default function Calculator() {
  const [leads, setLeads] = useState(1000);
  const [closeRate, setCloseRate] = useState(10);
  const [ticket, setTicket] = useState(1500);
  const [recoveryRate, setRecoveryRate] = useState(1);

  const res = useMemo(() => {
    const recoveredLeads = Math.max(0, leads) * (Math.max(0, recoveryRate) / 100);
    const customers = recoveredLeads * (Math.max(0, closeRate) / 100);
    const revenue = customers * Math.max(0, ticket);
    return { recoveredLeads, customers, revenue };
  }, [leads, closeRate, ticket, recoveryRate]);

  return (
    <div className="card p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-bold">Calculate Your Lost Revenue</div>
          <div className="mt-1 text-xs text-zinc-600">Simple estimator. Replace with real numbers.</div>
        </div>
        <div className="text-xs text-zinc-500">Monthly</div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-4">
        <label className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Leads sitting in CRM</div>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="number"
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value))}
            min={0}
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Close rate percent</div>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="number"
            value={closeRate}
            onChange={(e) => setCloseRate(Number(e.target.value))}
            min={0}
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Avg ticket value</div>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="number"
            value={ticket}
            onChange={(e) => setTicket(Number(e.target.value))}
            min={0}
          />
        </label>

        <label className="space-y-1">
          <div className="text-xs font-semibold text-zinc-600">Recovery percent</div>
          <input
            className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            type="number"
            value={recoveryRate}
            onChange={(e) => setRecoveryRate(Number(e.target.value))}
            min={0}
            step={0.25}
          />
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs font-semibold text-zinc-600">Recovered leads</div>
          <div className="mt-1 text-2xl font-extrabold">{res.recoveredLeads.toFixed(0)}</div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <div className="text-xs font-semibold text-zinc-600">New customers</div>
          <div className="mt-1 text-2xl font-extrabold">{res.customers.toFixed(1)}</div>
        </div>

        <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
          <div className="text-xs font-semibold text-indigo-700">Recovered revenue</div>
          <div className="mt-1 text-2xl font-extrabold">
            {res.revenue.toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
