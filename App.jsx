import { useEffect, useRef, useState } from "react";
import {
  DISCORD_INVITE_URL, GUILD_NAME, GUILD_WORLD, MASCOT_IMAGE, MASCOT_NAME,
  TEXT, RULES, REWARDS, ABOUT_FACTS, NAV,
} from "./config.js";

const INVITE_READY = DISCORD_INVITE_URL.startsWith("http");

/* ---------- Small reusable pieces ---------- */

// Discord button/link. Uses the one invite URL from config.js.
function DiscordLink({ children, className = "btn btn-primary" }) {
  if (!INVITE_READY) {
    // Placeholder not replaced yet: scroll to the Join section instead of a dead link.
    return <a className={className} href="#join">{children}</a>;
  }
  return (
    <a className={className} href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

// Fades a section in once when it scrolls into view.
function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setShown(true); io.disconnect(); }
    }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${shown ? "in" : ""} ${className}`}>{children}</div>;
}

// Mascot image with a drawn fallback if the file is missing. Never stretched.
function Mascot() {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <svg className="mascot" viewBox="0 0 160 160" role="img"
        aria-label={`${MASCOT_NAME} placeholder. Add public/mascot.png to show the real mascot.`}
        shapeRendering="crispEdges">
        <path fill="#0d3b5c" d="M48 20h64v12h16v16h12v64h-12v16h-16v12H48v-12H32v-16H20V48h12V32h16z"/>
        <path fill="#1c7aa8" d="M56 28h48v12h16v12h8v48h-8v12h-16v12H56v-12H40v-12h-8V52h8V40h16z"/>
        <path fill="#1fb6c9" d="M64 36h32v12h16v12h-24v16H72V60H56V48h8z"/>
        <path fill="#bff3f0" d="M68 40h16v8H68zM100 84h12v8h-12z"/>
        <path fill="#04121f" d="M60 84h12v12H60zM88 84h12v12H88z"/>
        <path fill="#bff3f0" d="M64 88h4v4h-4zM92 88h4v4h-4z"/>
      </svg>
    );
  }
  return (
    <img className="mascot" src={MASCOT_IMAGE} alt={`${MASCOT_NAME}, the ${GUILD_NAME} guild mascot`}
      onError={() => setFailed(true)} />
  );
}

// Pixel diamond lock icon for the rewards.
function DiamondLock() {
  return (
    <svg className="dl-icon" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
      <path fill="#1c7aa8" d="M6 2h4v1h2v1h1v2h1v2h-1v1h-1v1h-1v1H9v1H7v-1H5v-1H4V9H3V7h1V5h1V4h1z"/>
      <path fill="#bff3f0" d="M6 3h4v1h1v1h1v2h-1v1h-1v1H9v1H7V9H6V8H5V6h1V5h1V4H6z"/>
      <path fill="#fff" d="M6 4h2v1H6zM5 6h1v1H5z"/>
    </svg>
  );
}

// Soft rain, a nod to the mascot's tears. Stays still if reduced motion is on.
function Rain() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w, h, raf, drops = [];
    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const n = Math.min(70, Math.round(w / 22));
      drops = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        l: 14 + Math.random() * 26, v: 1.2 + Math.random() * 1.6, a: 0.08 + Math.random() * 0.18,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 2;
      for (const d of drops) {
        if (!still) { d.y += d.v; if (d.y > h + 40) { d.y = -40; d.x = Math.random() * w; } }
        ctx.strokeStyle = `rgba(120,200,240,${d.a})`;
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x, d.y + d.l); ctx.stroke();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="rain" aria-hidden="true" />;
}

/* ---------- Page ---------- */

function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
    }, { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach((n) => { const el = document.getElementById(n.id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="header">
      <a className="brand" href="#home" onClick={() => setOpen(false)}>{GUILD_NAME}</a>
      <button className="burger" aria-expanded={open} aria-controls="menu"
        aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)}>
        <span /><span /><span />
      </button>
      <nav id="menu" className={`nav ${open ? "open" : ""}`} aria-label="Main">
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} onClick={() => setOpen(false)}
            className={active === n.id ? "active" : ""}
            aria-current={active === n.id ? "true" : undefined}>{n.label}</a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-art">
        <div className="halo" aria-hidden="true" />
        <Mascot />
      </div>
      <h1 className="wordmark">{GUILD_NAME}</h1>
      <p className="headline">{TEXT.heroHeadline}</p>
      <p className="lead">{TEXT.heroIntro}</p>
      <div className="actions">
        <a className="btn btn-primary" href="#join">Join Us</a>
        <a className="btn btn-ghost" href="#rules">Read the Rules</a>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <Reveal>
        <h2>{TEXT.aboutTitle}</h2>
        <div className="about-grid">
          <div>
            <p className="lead">{TEXT.aboutBody}</p>
            <p className="lead">{TEXT.aboutExtra}</p>
          </div>
          <dl className="facts">
            {ABOUT_FACTS.map((f) => (
              <div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>
            ))}
          </dl>
        </div>
      </Reveal>
    </section>
  );
}

function Rules() {
  return (
    <section id="rules" className="section">
      <Reveal>
        <h2>{TEXT.rulesTitle}</h2>
        <p className="sub">{TEXT.rulesIntro}</p>
        <ul className="rules">
          {RULES.map((r) => (<li key={r}><span className="drop" aria-hidden="true" />{r}</li>))}
        </ul>
      </Reveal>
    </section>
  );
}

function Rewards() {
  const [first, second, third] = REWARDS;
  const order = [
    { ...second, tier: "second" },
    { ...first, tier: "first" },
    { ...third, tier: "third" },
  ];
  return (
    <section id="rewards" className="section">
      <Reveal>
        <h2>{TEXT.rewardsTitle}</h2>
        <p className="sub">{TEXT.rewardsIntro}</p>
        <ol className="podium">
          {order.map((r) => (
            <li key={r.place} className={`step ${r.tier}`}>
              <DiamondLock />
              <span className="amount">{r.amount} <small>{r.unit}</small></span>
              <span className="place">{r.place}</span>
              <span className="desc">{r.description}</span>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}

function Join() {
  return (
    <section id="join" className="section">
      <Reveal className="join-card">
        <h2>{TEXT.joinTitle}</h2>
        <p className="lead">{TEXT.joinBody}</p>
        <DiscordLink className="btn btn-discord">Join Our Discord</DiscordLink>
        {!INVITE_READY && <p className="placeholder" role="status">{TEXT.joinPending}</p>}
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong className="brand">{GUILD_NAME}</strong>
        <p>{TEXT.footerLine}</p>
      </div>
      <a className="foot-world" href="#about">Guild world: {GUILD_WORLD}</a>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <div className="scene" aria-hidden="true"><div className="rays" /><div className="seabed" /></div>
      <Rain />
      <Header />
      <main>
        <Hero /><About /><Rules /><Rewards /><Join />
      </main>
      <Footer />
    </>
  );
}
