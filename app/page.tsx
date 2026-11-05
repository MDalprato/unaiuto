'use client';

import { useEffect, useRef, useState } from 'react';
import { clearProfile, readProfile, saveProfile, type Profile } from './profile';

const questions = ['Come ti chiami?', 'Quanti anni hai?'];
const fields = ['name', 'age'] as const;

function thoughts(name: string) {
  return [
    `${name}, sei qui.\nPer adesso, basta questo.`,
    'Appoggia i piedi a terra.\nQuesto momento è tuo.',
    'Non devi risolvere\ntutto adesso.',
    'Il tuo valore è più grande\ndella tua lista di cose da fare.',
    'Sei anche le persone che ami.\nLe cose che ti incuriosiscono.\nI posti in cui ti senti a casa.',
    'Una giornata difficile\nnon definisce chi sei.',
    'Guarda intorno a te.\nNota una cosa piccola,\nche prima non avevi visto.',
    'Il lavoro è una parte della tua vita.\nC’è spazio anche per il resto.',
    'Puoi chiedere una mano.\nNon devi portare tutto da solo.',
    'Pensa a qualcosa che ami\nfare senza dover dimostrare nulla.',
    'Concediti un piccolo gesto gentile.\nUn bicchiere d’acqua. Una pausa.\nUna voce amica.',
    'Un passo alla volta.\nAl tuo ritmo.',
  ];
}

export default function Home() {
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Profile>({ name: '', age: '' });
  const [answer, setAnswer] = useState('');
  const [leaving, setLeaving] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const about = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const busy = useRef(false);
  const reading = step === questions.length;
  const messages = thoughts(profile.name);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    function update() { setReduced(media.matches); if (media.matches) setPaused(true); }
    update();
    media.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); if (transitionTimer.current) clearTimeout(transitionTimer.current); };
  }, []);

  useEffect(() => {
    const saved = readProfile();
    if (saved) { setProfile(saved); setStep(questions.length); }
    setReady(true);
  }, []);

  useEffect(() => { if (ready && !reading) input.current?.focus(); }, [ready, step, reading]);

  function transition(change: () => void) {
    if (busy.current) return;
    busy.current = true;
    setLeaving(true);
    transitionTimer.current = setTimeout(() => {
      change(); setLeaving(false); busy.current = false;
    }, reduced ? 0 : 650);
  }

  useEffect(() => {
    if (!reading || paused || leaving || aboutOpen) return;
    const timer = setTimeout(() => transition(() => setIndex(i => (i + 1) % messages.length)), 11000);
    return () => clearTimeout(timer);
    // Each phrase gets a fresh reading interval, including after manual navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading, paused, index, leaving, reduced, messages.length, aboutOpen]);

  useEffect(() => {
    if (!reading || aboutOpen) return;
    function nextOnEnter(event: KeyboardEvent) {
      if (event.key !== 'Enter' || event.isComposing || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      // Keep native keyboard activation for buttons, links and editable fields.
      if (event.target instanceof Element && event.target.closest('button, a, input, textarea, select, [contenteditable]')) return;
      event.preventDefault();
      if (event.repeat) return;
      transition(() => setIndex(i => (i + 1) % messages.length));
    }
    window.addEventListener('keydown', nextOnEnter);
    return () => window.removeEventListener('keydown', nextOnEnter);
    // transition depends only on the reduced-motion preference and stable refs/setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reading, aboutOpen, reduced, messages.length]);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = answer.trim();
    if (!value || busy.current) return;
    if (step === 1 && (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 120)) return;
    const nextProfile = { ...profile, [fields[step]]: value };
    transition(() => {
      setProfile(nextProfile);
      if (step === questions.length - 1) saveProfile(nextProfile);
      setAnswer(''); setStep(s => s + 1);
    });
  }

  if (!ready) return <main className="canvas" aria-busy="true" aria-label="Caricamento"/>;

  return <main className="canvas">
    <div className={`center ${leaving ? 'leaving' : ''}`}>
      {!reading ? <form key={step} className="question" onSubmit={submit}>
        <label htmlFor="answer" className="question-label">{questions[step]}</label>
        <div className="answer-line">
          <input ref={input} id="answer" name={fields[step]} aria-label={questions[step]} autoFocus
            type={step === 1 ? 'number' : 'text'} inputMode={step === 1 ? 'numeric' : 'text'}
            min={step === 1 ? 1 : undefined} max={step === 1 ? 120 : undefined}
            step={step === 1 ? 1 : undefined} maxLength={step === 0 ? 50 : undefined}
            autoComplete="off" required value={answer} onChange={e => setAnswer(e.target.value)}
            readOnly={leaving} spellCheck={false}/>
        </div>
        <button type="submit" className="enter" disabled={leaving}>premi invio <span aria-hidden="true">↵</span></button>
      </form> : <section key={index} className="thought" aria-label="Un pensiero per te" aria-live={paused ? 'polite' : 'off'}>
        <h1>{messages[index]}</h1>
      </section>}
    </div>
    {!reading ? <div className="bottom onboarding-footer"><span>{String(step + 1).padStart(2, '0')} <span className="separator">/</span> {String(questions.length).padStart(2, '0')}</span><span>Nome ed età restano in un cookie per 6 mesi.</span></div> : <div className="bottom reading-footer">
      <button disabled={leaving} onClick={() => transition(() => {clearProfile();setStep(0); setProfile({name:'',age:''});setAnswer('');setIndex(0);setPaused(reduced);})}>ricomincia</button>
      <div className="reading-controls"><button onClick={() => setPaused(p => !p)} aria-label={paused ? 'Riprendi le frasi' : 'Metti in pausa le frasi'}>{paused ? 'riprendi' : 'pausa'}</button><span className="separator" aria-hidden="true">/</span><button aria-keyshortcuts="Enter" title="Un altro pensiero (Invio)" disabled={leaving} onClick={() => transition(() => setIndex(i => (i + 1) % messages.length))}>un altro pensiero <span aria-hidden="true">→</span></button></div>
    </div>}
    <nav className="footer-links" aria-label="Informazioni e supporto">
    <button className="about-trigger" aria-haspopup="dialog" onClick={() => {about.current?.showModal(); setAboutOpen(true);}}>Cos’è?</button>
    <span aria-hidden="true">/</span>
    <a href="https://www.psy.it/" target="_blank" rel="noopener noreferrer" title="Visita il sito del Consiglio Nazionale dell’Ordine degli Psicologi (si apre in una nuova scheda)">Supporto psicologico <span aria-hidden="true">↗</span></a>
    </nav>
    <dialog ref={about} className="about-dialog" aria-labelledby="about-title" onClose={() => setAboutOpen(false)}>
      <div className="about-content">
        <h2 id="about-title">Cos’è?</h2>
        <p>Questo progetto nasce da un mio momento di sconforto. Uno di quei momenti in cui tutto sembra pesare un po’ di più e si fa fatica a vedere oltre.</p>
        <p>L’ho sviluppato come un piccolo aiuto per chi si sente giù in un particolare momento della vita. Un posto in cui fermarsi, tornare al presente e ricordarsi che siamo molto più del nostro lavoro e delle difficoltà che stiamo attraversando.</p>
        <p>Forse qualche parola non cambia tutto. Ma può farti compagnia, anche solo per un momento.</p>
        <button className="about-close" autoFocus onClick={() => about.current?.close()}>torna al tuo momento <span aria-hidden="true">↵</span></button>
      </div>
    </dialog>
  </main>;
}
