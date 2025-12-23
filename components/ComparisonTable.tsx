export default function ComparisonTable() {
  const rows = [
    { label: "Calls new leads within 60 seconds", a: true, b: false },
    { label: "Works 24/7 including nights and weekends", a: true, b: false },
    { label: "Qualifies leads and filters time wasters", a: true, b: true },
    { label: "Books appointments automatically", a: true, b: true },
    { label: "Revives old and dead leads", a: true, b: false },
    { label: "Captures notes and pushes to your CRM", a: true, b: true },
    { label: "Consistent follow up, no missed leads", a: true, b: false },
  ];

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-zinc-200 bg-zinc-50 px-5 py-4">
        <div className="text-sm font-semibold">CallSetterAI vs Manual Appointment Setters</div>
        <div className="mt-1 text-xs text-zinc-600">Speed beats busy.</div>
      </div>

      <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-zinc-500">
        <div className="col-span-7">Feature</div>
        <div className="col-span-3 text-center">CallSetterAI</div>
        <div className="col-span-2 text-center">Manual</div>
      </div>

      <div className="divide-y divide-zinc-200">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-12 items-center px-5 py-3">
            <div className="col-span-7 text-sm text-zinc-800">{r.label}</div>

            <div className="col-span-3 text-center">
              <span
                className={[
                  "inline-flex rounded-full px-2 py-1 text-xs font-semibold border",
                  r.a
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-zinc-50 text-zinc-500 border-zinc-200",
                ].join(" ")}
              >
                {r.a ? "Yes" : "No"}
              </span>
            </div>

            <div className="col-span-2 text-center">
              <span
                className={[
                  "inline-flex rounded-full px-2 py-1 text-xs font-semibold border",
                  r.b
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-zinc-50 text-zinc-500 border-zinc-200",
                ].join(" ")}
              >
                {r.b ? "Yes" : "No"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
