"use client";

import { use } from "react";
import { toast } from "sonner";
import { MmButton } from "@/components/ui/mm-button";

/** Public guardian page. Lives outside the (app)/(public) route groups:
 * fixed light theme, no navigation into the student area. */
export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  use(params);

  return (
    <div className="min-h-dvh bg-mm-paper text-mm-ink">
      <div className="mx-auto max-w-[480px] px-5 pt-6 pb-4">
        <div className="text-[11px] font-bold tracking-[.14em] uppercase mb-2 text-mm-mut">
          Convite privado
        </div>
        <h1 className="font-heading font-extrabold text-[26px] leading-tight text-mm-ink">
          Ana te convidou
          <br />
          pro Meu Modo 💚
        </h1>
      </div>

      <div className="mx-auto max-w-[480px] px-5 flex flex-col gap-4 pb-10">
        <div className="rounded-2xl border border-mm-border bg-mm-surface p-4 shadow-[0_2px_0_var(--mm-border)]">
          <div className="text-xs font-bold uppercase tracking-wide mb-2 text-mm-mut">Resumo da semana</div>
          <p className="text-[15px] leading-relaxed text-mm-ink-2">
            Ana estudou <b className="text-mm-ink">4 vezes</b> pra prova de Física, praticou{" "}
            <b className="text-mm-ink">3 temas</b> e fez <b className="text-mm-ink">12 revisões</b>. A prova é
            sexta-feira.
          </p>
        </div>

        <div className="rounded-2xl border border-mm-border bg-mm-surface p-4 grid grid-cols-2 gap-3 shadow-[0_2px_0_var(--mm-border)]">
          <div>
            <div className="text-xs font-bold uppercase tracking-wide mb-2 text-mm-brand-ink">Você vê</div>
            <div className="text-[13px] leading-relaxed text-mm-ink-2">
              Sessões
              <br />
              Temas praticados
              <br />
              Revisões feitas
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wide mb-2 text-mm-mut">Não vê</div>
            <div className="text-[13px] leading-relaxed text-mm-mut">
              Respostas e erros
              <br />
              Materiais
              <br />
              Diagnósticos
            </div>
          </div>
        </div>

        <div className="rounded-2xl border-[1.5px] border-mm-brand-ink bg-mm-surface p-4 shadow-[0_2px_0_var(--mm-border)]">
          <div className="flex items-baseline justify-between mb-1">
            <span className="font-heading font-extrabold text-[17px] text-mm-ink">Meu Modo Família</span>
            <span className="font-heading font-black text-xl text-mm-brand-ink">
              R$ 39,90
              <span className="text-xs font-bold text-mm-mut">/mês</span>
            </span>
          </div>
          <p className="text-[13px] leading-relaxed mb-4 text-mm-ink-2">
            Provas ilimitadas, prática gerada do material da escola e revisões na medida. Cancele quando
            quiser.
          </p>
          <MmButton
            variant="dark"
            size="block"
            onClick={() => toast("Tudo certo ✓ A Ana já pode criar a próxima prova.")}
          >
            Liberar pra Ana
          </MmButton>
          <div className="text-[11px] text-center mt-3 text-mm-mut">
            Pagamento seguro · Sem cobrança sem sua confirmação
          </div>
        </div>

        <p className="text-xs text-center leading-relaxed text-mm-mut">
          Este convite é privado e só mostra o resumo acima.
          <br />
          Dúvidas? Fala com a gente: oi@meumodo.app
        </p>
      </div>
    </div>
  );
}
