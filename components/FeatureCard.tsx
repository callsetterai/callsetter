import { cn } from "@/lib/cn";

export default function FeatureCard({
  title,
  bullets,
  dark = false,
}: {
  title: string;
  bullets: string[];
  dark?: boolean;
}) {
  return (
    <div className={cn(dark ? "cardDark p-6" : "card p-6")}>
      <div className={cn("text-base font-bold", dark ? "text-white" : "text-zinc-900")}>
        {title}
      </div>

      <ul className={cn("mt-3 space-y-2 text-sm", dark ? "text-white/70" : "text-zinc-600")}>
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className={cn("mt-1 h-1.5 w-1.5 rounded-full", dark ? "bg-indigo-300" : "bg-indigo-600")} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
