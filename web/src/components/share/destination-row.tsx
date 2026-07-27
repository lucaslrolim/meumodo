"use client";

import {
  WhatsappLogo,
  InstagramLogo,
  TiktokLogo,
  DownloadSimple,
  LinkSimple,
} from "@phosphor-icons/react/ssr";

const DESTINATIONS = [
  { key: "whatsapp", label: "WhatsApp", icon: WhatsappLogo, whatsapp: true },
  { key: "stories", label: "Stories", icon: InstagramLogo, whatsapp: false },
  { key: "tiktok", label: "TikTok", icon: TiktokLogo, whatsapp: false },
  { key: "save", label: "Salvar", icon: DownloadSimple, whatsapp: false },
  { key: "link", label: "Link", icon: LinkSimple, whatsapp: false },
] as const;

/** Every destination is an export out of the app — no in-app feed, no
 * follower graph, no like counts live here. */
export function DestinationRow({ onSelect }: { onSelect: (destination: string) => void }) {
  return (
    <div className="flex items-start justify-between gap-1">
      {DESTINATIONS.map(({ key, label, icon: Icon, whatsapp }) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(label)}
          className="flex flex-col items-center gap-1.5 font-heading font-bold text-[11px] text-mm-ink-2"
        >
          <span
            className={`flex size-[54px] items-center justify-center rounded-full border-[1.5px] transition-transform active:scale-90 ${
              whatsapp
                ? "border-[#25D366] bg-[#25D366] text-[#06210f]"
                : "border-mm-border bg-mm-surface-alt text-mm-ink"
            }`}
          >
            <Icon size={26} weight="bold" />
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}
