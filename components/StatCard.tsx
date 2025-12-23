export default function StatCard({
  top,
  mid,
  bot,
}: {
  top: string;
  mid: string;
  bot: string;
}) {
  return (
    <div className="card p-5">
      <div className="text-xs font-semibold text-indigo-600">{top}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight">{mid}</div>
      <div className="mt-2 text-sm text-zinc-600">{bot}</div>
    </div>
  );
}
