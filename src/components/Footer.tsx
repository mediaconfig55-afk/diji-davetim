import { MapPin } from "lucide-react";
import { eventConfig } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="relative px-6 pb-16 pt-10 text-center">
      <a
        href={eventConfig.venue.mapUrl}
        target="_blank"
        rel="noreferrer"
        className="mx-auto flex w-fit items-center gap-2 text-sm text-[color:var(--color-text)]/60 transition hover:text-[color:var(--color-primary)]"
      >
        <MapPin size={15} />
        {eventConfig.venue.name} · {eventConfig.venue.address}
      </a>
      <p className="mt-6 font-display gold-text text-lg">
        {eventConfig.couple.bride} & {eventConfig.couple.groom}
      </p>
      <p className="mt-1 text-xs text-[color:var(--color-text)]/35">Sizi aramızda görmek dileğiyle</p>
    </footer>
  );
}
