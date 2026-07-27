import Link from "next/link";
import { LandingReveal } from "@/components/landing/landing-reveal";
import "./landing.css";

export const metadata = {
  title: "Meu Modo — Prova chegando? Cola aqui.",
  description:
    "Tira foto do slide, da lista, do caderno. Em 3 minutos, seu material vira estudo de verdade — focado no que vai cair na SUA prova.",
};

const PAIN = [
  { emoji: "😴", text: "Passou horas relendo slide... e na prova não caiu nada disso." },
  { emoji: "😵‍💫", text: "Abriu o caderno e travou sem saber por onde começar." },
  { emoji: "📱", text: "Tentou ver aula no YouTube e dormiu no meio." },
];

const CONTRAST = [
  { n: "100 mil", text: "A aula do YouTube é igual pra 100 mil pessoas." },
  { n: "40 alunos", text: "Seu professor precisa explicar pra 40 alunos de uma vez." },
  { n: "0 sentido", text: "E aquele slide, sozinho, não faz sentido pra ninguém." },
];

const STEPS = [
  { num: "1", emoji: "📸", title: "Tira a foto", text: "Do slide, da lista, do caderno. O que tiver na mão, manda pra cá." },
  { num: "2", emoji: "⚡", title: "Vira prática", text: "Em 3 minutos, seu material vira card com o que realmente cai." },
  { num: "3", emoji: "🎯", title: "Estuda em 10 min", text: "Sessão rápida, do seu jeito. Acertou? Sobe de nível. Errou? A IA te explica na hora." },
];

const SESS_POINTS = [
  { emoji: "💡", bold: "Travou numa questão?", text: "Pede pista ou abre o tutor — ele te explica do jeito que você entende." },
  { emoji: "📄", bold: "Toda resposta vem do seu material.", text: "Dá pra abrir a fonte exata de onde o card saiu." },
  { emoji: "🎤", bold: "Pode responder falando.", text: "Digitando ou por áudio, vale do seu jeito." },
];

const WHY = [
  { emoji: "📄", title: "É o SEU material", text: "Nada de resumo genérico da internet. É o slide do SEU professor, a lista que ELE passou — o que realmente cai na prova." },
  { emoji: "⏱️", title: "É no SEU ritmo", text: "10 minutos, sem estresse. O app ajusta a dificuldade conforme você acerta — nunca fácil demais, nunca impossível." },
  { emoji: "📈", title: "Você VÊ o progresso", text: "Cada conceito dominado aparece na sua barra. É você contra você de duas semanas atrás. Sem ranking, sem comparação.", bar: true },
];

function Wordmark() {
  return (
    <>
      <span className="lp-wm-badge">mm</span>
      <span className="lp-wm-word">meu modo</span>
    </>
  );
}

export default function LandingPage() {
  return (
    <div className="lp-root">
      {/* ============ NAV ============ */}
      <nav className="lp-nav">
        <div className="lp-wrap lp-nav-in">
          <Link className="lp-wm" href="/" aria-label="Meu Modo">
            <Wordmark />
          </Link>
          <Link className="lp-btn lp-btn-p lp-btn-sm" href="/entry">
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* ============ HERO ============ */}
      <header className="lp-hero" id="top">
        <div className="lp-wrap lp-hero-in">
          <span className="lp-eyebrow lp-rv">⚡ pra quem tem prova chegando</span>
          <h1 className="lp-rv lp-d1">
            Prova chegando?
            <br />
            <span className="lp-mark">Cola aqui.</span>
          </h1>
          <p className="lp-lead lp-rv lp-d2">
            Tira foto do slide, da lista, do caderno. Em 3 minutos, seu material vira estudo de verdade — focado no
            que vai cair na <b>SUA</b> prova.
          </p>
          <div className="lp-hero-cta lp-rv lp-d3">
            <Link className="lp-btn lp-btn-p" href="/entry">
              Começar grátis
            </Link>
            <span className="lp-micro">Grátis pra sua primeira prova. Sem cartão, sem pegadinha.</span>
          </div>

          <div className="lp-stack lp-rv lp-d4" aria-hidden="true">
            <div className="lp-scard lp-scard-back">
              <div className="lp-tag">
                <span>FÍSICA · CINEMÁTICA</span>
                <span>3/12</span>
              </div>
              <div className="lp-q">Um carro a 20 m/s freia até parar em 4 s. Qual a aceleração média?</div>
              <div className="lp-sopt">
                <span className="lp-k">A</span> 5 m/s²
              </div>
              <div className="lp-sopt">
                <span className="lp-k">B</span> −5 m/s²
              </div>
            </div>
            <div className="lp-scard lp-scard-front">
              <div className="lp-tag">
                <span>FÍSICA · CINEMÁTICA</span>
                <span>3/12</span>
              </div>
              <div className="lp-q">Um carro a 20 m/s freia até parar em 4 s. Qual a aceleração média?</div>
              <div className="lp-sopt">
                <span className="lp-k">A</span> 5 m/s²
              </div>
              <div className="lp-sopt lp-ok">
                <span className="lp-k">B</span> −5 m/s² ✓
              </div>
            </div>
            <div className="lp-chip-float lp-cf1">📸 foto da lista</div>
            <div className="lp-chip-float lp-cf2">🔥 6 dias seguidos</div>
            <div className="lp-chip-float lp-cf3">🎯 3 de 12 acertos</div>
          </div>
        </div>
      </header>

      {/* ============ PAIN ============ */}
      <section className="lp-section" id="dor">
        <div className="lp-wrap">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow lp-rv">se você já tentou de tudo</span>
            <h2 className="lp-h2 lp-rv lp-d1" style={{ marginTop: 22 }}>
              Já tentou de tudo
              <br />e nada colou?
            </h2>
          </div>
          <div className="lp-pain-cards">
            {PAIN.map((p, i) => (
              <div key={p.text} className={`lp-pcard lp-rv lp-d${i + 1}`}>
                <div className="lp-emo">{p.emoji}</div>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <p className="lp-punch lp-rv">
            Não é você.
            <br />
            <span className="lp-mark">É o método.</span>
          </p>
          <p className="lp-lead lp-punch-sub lp-rv lp-d1">
            Você não estuda por estudar. Você estuda porque precisa passar naquela prova. E estudo genérico não passa
            em prova específica.
          </p>
        </div>
      </section>

      {/* ============ CONTRAST ============ */}
      <section className="lp-section lp-contrast">
        <div className="lp-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <span className="lp-eyebrow lp-rv">ensino 100% focado</span>
            <h2 className="lp-h2 lp-rv lp-d1" style={{ marginTop: 22 }}>
              Feito pra <span className="lp-mark">1 pessoa</span>: você.
            </h2>
          </div>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            {CONTRAST.map((c, i) => (
              <div key={c.n} className={`lp-crow lp-rv lp-d${i + 1}`}>
                <span className="lp-n">{c.n}</span>
                <p>{c.text}</p>
              </div>
            ))}
            <div className="lp-vs lp-rv">· · ·</div>
            <div className="lp-crow lp-hero1 lp-rv lp-d3">
              <span className="lp-n">você</span>
              <p>
                No Meu Modo, cada card nasce do <b>SEU</b> material. Da lista que o <b>SEU</b> professor passou. Do
                que vai cair na <b>SUA</b> prova — seja a do colégio, seja o ENEM.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ COMO FUNCIONA ============ */}
      <section className="lp-section" id="como">
        <div className="lp-wrap">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow lp-rv">3 passos e pronto</span>
            <h2 className="lp-h2 lp-rv lp-d1" style={{ marginTop: 22 }}>
              Como funciona
            </h2>
          </div>
          <div className="lp-steps">
            {STEPS.map((s, i) => (
              <div key={s.num} className={`lp-step lp-rv lp-d${i + 1}`}>
                <span className="lp-num">{s.num}</span>
                <div className="lp-emo">{s.emoji}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SESSION (dark · scroll) ============ */}
      <section className="lp-section lp-session">
        <div className="lp-wrap lp-sess-grid">
          <div>
            <span className="lp-eyebrow lp-rv">viciante igual feed</span>
            <h2 className="lp-h2 lp-rv lp-d1" style={{ marginTop: 22 }}>
              Aprender
              <br />
              dando <span className="lp-mark">scroll</span>.
            </h2>
            <p className="lp-lead lp-rv lp-d2" style={{ marginTop: 20 }}>
              Um card por vez, igual ao feed que você já rola o dia todo. Só que aqui, cada scroll te deixa mais
              perto de gabaritar a prova.
            </p>
            <div className="lp-sess-points">
              {SESS_POINTS.map((sp, i) => (
                <div key={sp.bold} className={`lp-sp lp-rv lp-d${i + 2}`}>
                  <span className="lp-dot">{sp.emoji}</span>
                  <p>
                    <b>{sp.bold}</b> {sp.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="lp-rv lp-d2">
            <div className="lp-phone" aria-hidden="true">
              <div className="lp-p-top">
                <span className="lp-p-x">✕</span>
                <span className="lp-p-count">FÍSICA · 3 DE 12</span>
                <span style={{ width: 26 }}></span>
              </div>
              <div className="lp-segp">
                <i className="lp-on"></i>
                <i className="lp-on"></i>
                <i className="lp-on"></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <div className="lp-p-q">Um carro a 20 m/s freia até parar em 4 s. Qual a aceleração média?</div>
              <div className="lp-p-inp">
                <span>Digita ou fala sua resposta...</span>
                <span className="lp-p-mic">🎤</span>
              </div>
              <div className="lp-p-btns">
                <span className="lp-p-btn lp-g">Não sei</span>
                <span className="lp-p-btn lp-p">Responder</span>
              </div>
              <div className="lp-p-src">fonte: lista de cinemática · questão 4</div>
            </div>
            <div className="lp-swipe-hint">
              <span className="lp-arr">↓</span> próxima atividade <span className="lp-arr">↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHY ============ */}
      <section className="lp-section" id="porque">
        <div className="lp-wrap">
          <div style={{ textAlign: "center" }}>
            <span className="lp-eyebrow lp-rv">por que funciona</span>
            <h2 className="lp-h2 lp-rv lp-d1" style={{ marginTop: 22 }}>
              Feito do seu jeito.
              <br />
              Por isso cola.
            </h2>
          </div>
          <div className="lp-why-cards">
            {WHY.map((w, i) => (
              <div key={w.title} className={`lp-wcard lp-rv lp-d${i + 1}`}>
                <div className="lp-wico">{w.emoji}</div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
                {w.bar ? (
                  <div className="lp-pbar">
                    <i></i>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ QUOTE ============ */}
      <section className="lp-section" style={{ paddingTop: 0 }}>
        <div className="lp-wrap">
          <div className="lp-quote lp-rv">
            <span className="lp-qmark">💬</span>
            <blockquote>
              “Nunca tinha conseguido estudar pra prova de física. Tirei foto da lista, em cinco minutos já tava
              respondendo os cards. Acertei umas três questões que com certeza teria errado.”
            </blockquote>
            <cite>— Bia, 16 anos</cite>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="lp-section lp-final" id="comecar">
        <div className="lp-wrap">
          <h2 className="lp-h2 lp-rv">Prova chegando aí?</h2>
          <p className="lp-lead lp-rv lp-d1">Cola aqui. Manda a foto. Estuda em 10 minutos.</p>
          <div className="lp-final-cta lp-rv lp-d2">
            <Link className="lp-btn lp-btn-p" href="/entry" style={{ fontSize: 17, padding: "16px 36px" }}>
              Começar grátis agora
            </Link>
            <span className="lp-micro">Só paga se quiser estudar pra segunda prova.</span>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="lp-footer">
        <div className="lp-wrap lp-foot-in">
          <Link className="lp-wm" href="/">
            <Wordmark />
          </Link>
          <span className="lp-foot-note">feito pra quem aprende do próprio jeito 💚</span>
          <a className="lp-foot-mail" href="mailto:oi@meumodo.app">
            oi@meumodo.app
          </a>
        </div>
      </footer>

      <LandingReveal />
    </div>
  );
}
