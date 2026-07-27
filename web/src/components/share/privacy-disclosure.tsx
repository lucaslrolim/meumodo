const INCLUDED = ["Tempo, temas e quantidade", "Seu primeiro nome, se você quiser"];
const EXCLUDED = ["Suas respostas e erros", "O conteúdo do seu material", "Sua escola e sua nota"];

/** Same "what goes / what doesn't" transparency pattern used for the
 * guardian link — a Modo Card never carries material content, answers,
 * errors, school or grade. */
export function PrivacyDisclosure() {
  return (
    <div className="rounded-2xl border border-mm-border bg-mm-surface p-4 flex flex-col gap-2.5">
      <div className="text-xs font-bold uppercase tracking-wider text-mm-mut">No card</div>
      {INCLUDED.map((t) => (
        <div key={t} className="flex items-center gap-2.5 text-[13.5px]">
          <span className="font-black text-mm-brand-ink">✓</span>
          <span className="text-mm-ink">{t}</span>
        </div>
      ))}
      <div className="my-1 h-px bg-mm-border" />
      {EXCLUDED.map((t) => (
        <div key={t} className="flex items-center gap-2.5 text-[13.5px]">
          <span className="font-black text-mm-mut">✗</span>
          <span className="text-mm-ink-2">{t}</span>
        </div>
      ))}
    </div>
  );
}
