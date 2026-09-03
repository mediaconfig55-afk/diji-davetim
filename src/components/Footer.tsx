import { MapPin } from "lucide-react";
import { defaultResolvedConfig, type ResolvedEventConfig } from "@/lib/event-config";

export default function Footer({
  config = defaultResolvedConfig,
}: {
  config?: ResolvedEventConfig;
}) {
  return (
    <footer className="relative px-6 pb-16 pt-10 text-center">
      <a
        href={config.venue.mapUrl}
        target="_blank"
        rel="noreferrer"
        className="mx-auto flex w-fit items-center gap-2 text-sm text-[color:var(--color-text)]/60 transition hover:text-[color:var(--color-primary)]"
      >
        <MapPin size={15} />
        {config.venue.name} · {config.venue.address}
      </a>
      <p className="mt-6 font-display gold-text text-lg">
        {config.bride} & {config.groom}
      </p>
      <p className="mt-1 text-xs text-[color:var(--color-text)]/35">Sizi aramızda görmek dileğiyle</p>
    </footer>
  );
}
