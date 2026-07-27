/** Public/acquisition shell — no bottom nav, no product chrome. Layout
 * width is decided per-page (landing is full-bleed editorial, entrada is a
 * narrow single column) per 03_DESIGN_SYSTEM_FINAL.md §7. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-mm-paper text-mm-ink">{children}</div>;
}
