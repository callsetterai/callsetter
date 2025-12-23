export default function TryNowCard({
  name,
  role,
  onTry,
}: {
  name: string;
  role: string;
  onTry: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="aspect-[16/10] bg-gradient-to-br from-white/10 to-indigo-500/10" />
      <div className="p-5">
        <div className="text-sm font-bold text-white">{name}</div>
        <div className="mt-1 text-xs text-white/70">{role}</div>
        <button onClick={onTry} className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-indigo-700">
          TRY NOW
        </button>
      </div>
    </div>
  );
}
