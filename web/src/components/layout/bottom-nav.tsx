"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, ChatCircleDots, ChartBar } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";
import { SafeArea } from "./safe-area";

const HUB_ROUTES = [
  { href: "/home", label: "Início", icon: House, match: (p: string) => p === "/home" },
  { href: "/tutor", label: "Tutor", icon: ChatCircleDots, match: (p: string) => p === "/tutor" },
  {
    href: "/exam/exam-1/progress",
    label: "Progresso",
    icon: ChartBar,
    match: (p: string) => p.endsWith("/progress"),
  },
];

/** Bottom navigation shown only on hub screens (home, tutor entry,
 * progress) — sessions, reviews and conversations get the full viewport.
 * Deliberately three plain destinations: no center creation button, which
 * is a recognizable TikTok asset rather than a borrowed principle, and
 * "nova prova" already lives as the primary action on the home screen. */
export function BottomNav() {
  const pathname = usePathname();
  const isHub = HUB_ROUTES.some((r) => r.match(pathname));
  if (!isHub) return null;

  return (
    <SafeArea edges={["bottom"]} className="sticky bottom-0 z-10 border-t border-mm-border bg-mm-canvas">
      <nav className="flex items-center px-2 pt-1.5 pb-1">
        {HUB_ROUTES.map((route) => (
          <NavItem key={route.href} route={route} active={route.match(pathname)} />
        ))}
      </nav>
    </SafeArea>
  );
}

function NavItem({
  route,
  active,
}: {
  route: (typeof HUB_ROUTES)[number];
  active: boolean;
}) {
  const Icon = route.icon;
  return (
    <Link
      href={route.href}
      className={cn(
        "flex flex-1 flex-col items-center gap-0.5 py-1.5 font-heading font-bold text-[11px] transition-colors",
        active ? "text-mm-ink" : "text-mm-mut",
      )}
    >
      <Icon size={24} weight={active ? "fill" : "regular"} />
      {route.label}
    </Link>
  );
}
