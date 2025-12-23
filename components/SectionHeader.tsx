import { cn } from "@/lib/cn";
import Pill from "@/components/Pill";

export default function SectionHeader({
  kicker,
  title,
  subtitle,
  dark = false,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center">
      {kicker ? (
        <div className="mb-3 flex justify-center">
          <Pill>{kicker}</Pill>
        </div>
      ) : null}

      <h2 className={cn("h2", dark && "text-white")}>{title}</h2>

      {subtitle ? (
        <p className={cn("mt-3 text-sm sm:text-base", dark ? "text-white/70" : "text-zinc-600")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
