import { BottomNav } from "@/components/layout/bottom-nav";

/** Shell for the student product: single-column, max 560px, one activity
 * per viewport (03_DESIGN_SYSTEM_FINAL.md §7). Light-first "paper" surface —
 * the neutral shell carries 80-90% of the viewport so content and the single
 * brand accent stay legible. Individual routes render their own AppHeader so
 * back/title/progress can vary per screen. */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mm-paper-grid mx-auto flex min-h-dvh w-full max-w-[560px] flex-col bg-mm-canvas">
      <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
      <BottomNav />
    </div>
  );
}
