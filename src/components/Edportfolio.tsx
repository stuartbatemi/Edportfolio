// src/components/Edportfolio.tsx
// Premium portfolio — John Doe / Edgar
// Design: Man City sky blue · Light · Geometric · Bold
// Fonts: Bebas Neue (display) + Outfit (body) + Space Mono (code)
// ============================================================

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import {
  PROFILE, SKILLS, PROJECTS, EDUCATION, STATS, CATEGORY_COLORS,
} from "../data/edportfolio";
import type { Skill, Project, Education } from "../data/edportfolio";

// ============================================================
// DESIGN TOKENS — Man City inspired
// ============================================================
const BLUE    = "#6CABDD";
const NAVY    = "#1C2C5B";
const GOLD    = "#C5A028";
const BG      = "#F0F6FF";
const WHITE   = "#FFFFFF";
const TEXT    = "#0D1B2A";
const MUTED   = "#64748B";
const BORDER  = "rgba(108,171,221,0.2)";

const FONT_DISPLAY = "'Bebas Neue', 'Impact', sans-serif";
const FONT_BODY    = "'Outfit', 'Segoe UI', sans-serif";
const FONT_MONO    = "'Space Mono', 'Courier New', monospace";

// ============================================================
// GLOBAL STYLES
// ============================================================
function GlobalStyles() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap";
    document.head.appendChild(link);

    const s = document.createElement("style");
    s.innerHTML = `
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html { scroll-behavior: smooth; font-size: 16px; color-scheme: light; }
      body {
        background: ${BG} !important;
        color: ${TEXT} !important;
        font-family: ${FONT_BODY};
        -webkit-font-smoothing: antialiased;
        overflow-x: hidden;
      }
      ::selection { background: ${BLUE}; color: ${WHITE}; }
      ::-webkit-scrollbar { width: 3px; }
      ::-webkit-scrollbar-track { background: ${BG}; }
      ::-webkit-scrollbar-thumb { background: ${BLUE}; border-radius: 99px; }
      a { color: inherit; text-decoration: none; }
      section { position: relative; }

      .ed-hover-blue { transition: color 0.2s; }
      .ed-hover-blue:hover { color: ${BLUE}; }

      .ed-tag {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 5px 12px;
        border: 1px solid ${BORDER};
        border-radius: 2px;
        font-family: ${FONT_MONO};
        font-size: 11px;
        color: ${TEXT};
        background: ${WHITE};
        transition: all 0.18s;
        cursor: default;
      }
      .ed-tag:hover { background: ${BLUE}; color: ${WHITE}; border-color: ${BLUE}; }

      .ed-project {
        border-bottom: 1px solid ${BORDER};
        transition: background 0.2s;
        cursor: pointer;
      }
      .ed-project:hover { background: rgba(108,171,221,0.06); }

      .ed-reveal {
        opacity: 0;
        transform: translateY(28px);
        transition: opacity 0.7s ease, transform 0.7s ease;
      }
      .ed-reveal.in { opacity: 1; transform: translateY(0); }

      .ed-nav-link {
        font-family: ${FONT_MONO};
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: ${MUTED};
        transition: color 0.18s;
      }
      .ed-nav-link:hover { color: ${BLUE}; }

      .ed-marquee-track {
        display: flex;
        gap: 48px;
        white-space: nowrap;
        animation: marquee 22s linear infinite;
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      .ed-dot-filled { color: ${BLUE}; }
      .ed-dot-empty  { color: rgba(108,171,221,0.2); }

      .ed-geo-bg {
        background-image:
          linear-gradient(rgba(108,171,221,0.07) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108,171,221,0.07) 1px, transparent 1px);
        background-size: 48px 48px;
      }

      .ed-mobile-menu {
        position: fixed; inset: 0; z-index: 200;
        background: ${NAVY};
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 36px;
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(16px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(s);
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(s);
    };
  }, []);
  return null;
}

// ============================================================
// SCROLL REVEAL HOOK
// ============================================================
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".ed-reveal");
    const io  = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

// ============================================================
// RESPONSIVE HOOK
// ============================================================
function useWindowWidth(): number {
  const [w, setW] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

// ============================================================
// COUNT-UP COMPONENT
// ============================================================
function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started) {
          setStarted(true);
          const duration = 1800;
          const step     = 16;
          const inc      = value / (duration / step);
          let   cur      = 0;
          const t        = setInterval(() => {
            cur += inc;
            if (cur >= value) { setCount(value); clearInterval(t); }
            else setCount(Math.floor(cur));
          }, step);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [value, started]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};
const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.07 } },
};

// ============================================================
// PHOTO FRAME — reusable for both mobile and desktop
// ============================================================
function PhotoFrame({
  photoLoaded, setPhotoLoaded, photoError, setPhotoError, size,
}: {
  photoLoaded: boolean;
  setPhotoLoaded: (v: boolean) => void;
  photoError: boolean;
  setPhotoError: (v: boolean) => void;
  size: "mobile" | "tablet" | "desktop";
}) {
  const frameW  = size === "mobile" ? 140 : size === "tablet" ? 220 : 340;
  const fontSz  = size === "mobile" ? 40  : size === "tablet" ? 60  : 80;
  const inset1  = size === "mobile" ? -8  : -12;
  const inset2  = size === "mobile" ? -4  : -6;

  return (
    <div style={{ position: "relative", width: frameW, flexShrink: 0 }}>
      {/* Outer rotated box */}
      <div style={{
        position: "absolute", inset: inset1,
        background: `${BLUE}15`,
        border: `1.5px solid ${BLUE}30`,
        transform: "rotate(3deg)",
        borderRadius: 4, zIndex: 0,
      }} />
      {/* Inner accent ring */}
      <div style={{
        position: "absolute", inset: inset2,
        border: `1.5px solid ${GOLD}40`,
        transform: "rotate(-1.5deg)",
        borderRadius: 4, zIndex: 1,
      }} />

      {/* Photo container — 3:4 ratio */}
      <div style={{
        position: "relative", zIndex: 2,
        width: "100%", paddingBottom: "133%",
        borderRadius: 4, overflow: "hidden",
        background: `${NAVY}15`,
        border: `2px solid ${BLUE}40`,
      }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Photo */}
          {PROFILE.avatar && !photoError ? (
            <img
              src={PROFILE.avatar}
              alt={PROFILE.name}
              style={{
                width: "100%", height: "100%",
                objectFit: "cover" as const,
                display: "block",
                opacity: photoLoaded ? 1 : 0,
                transition: "opacity 0.4s",
              }}
              onLoad={() => setPhotoLoaded(true)}
              onError={() => setPhotoError(true)}
            />
          ) : null}

          {/* Initials fallback */}
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column" as const,
            alignItems: "center", justifyContent: "center",
            background: `linear-gradient(135deg, ${NAVY}, ${BLUE}44)`,
            zIndex: photoLoaded && !photoError ? -1 : 0,
          }}>
            <span style={{
              fontFamily: FONT_DISPLAY, fontSize: fontSz,
              color: `${WHITE}25`, letterSpacing: "0.06em",
            }}>
              {PROFILE.initials}
            </span>
          </div>

          {/* Bottom info bar */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: size === "mobile" ? "7px 10px" : "10px 14px",
            background: NAVY,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontFamily: FONT_MONO, fontSize: size === "mobile" ? 7 : 9, color: `${WHITE}80`, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              Dar es Salaam
            </span>
            <span style={{ fontFamily: FONT_MONO, fontSize: size === "mobile" ? 7 : 9, color: BLUE, letterSpacing: "0.06em" }}>
              Data Scientist
            </span>
          </div>
        </div>
      </div>

      {/* Sticker — only on desktop */}
      {size === "desktop" && (
        <div style={{
          position: "absolute", top: -16, right: -16, zIndex: 10,
          background: BLUE, color: WHITE,
          padding: "8px 12px",
          fontFamily: FONT_MONO, fontSize: 8, letterSpacing: "0.12em",
          textTransform: "uppercase" as const,
          transform: "rotate(3deg)",
          boxShadow: `3px 3px 0 ${NAVY}44`,
          borderRadius: 2,
        }}>
          Man City<br />Fan ⚽
        </div>
      )}
    </div>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const ww        = useWindowWidth();
  const isMobile  = ww < 768;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const links = [
    { label: "Work",    href: "#work"    },
    { label: "Skills",  href: "#skills"  },
    { label: "About",   href: "#about"   },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position:        "fixed",
          top: 0, left: 0, right: 0, zIndex: 100,
          height:          60,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
          padding:         isMobile ? "0 20px" : "0 52px",
          backgroundColor: scrolled ? "rgba(240,246,255,0.95)" : "transparent",
          borderBottom:    scrolled ? `1px solid ${BORDER}` : "none",
          backdropFilter:  scrolled ? "blur(16px)" : "none",
          transition:      "all 0.3s ease",
        }}
      >
        <a href="#top" style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: "0.08em", color: NAVY }}>
          CANTINO<span style={{ color: BLUE, marginLeft: 1 }}>.</span>
        </a>

        {!isMobile && (
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {links.map((l) => (
              <a key={l.label} href={l.href} className="ed-nav-link">{l.label}</a>
            ))}
            <a
              href={`mailto:${PROFILE.email}`}
              style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.08em", padding: "8px 20px", background: BLUE, color: WHITE, borderRadius: 2, transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = NAVY}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = BLUE}
            >
              HIRE ME
            </a>
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: 5, padding: 4 }}
            aria-label="Menu"
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={{ display: "block", width: 22, height: 2, background: NAVY, borderRadius: 99 }}
                animate={{
                  rotate:  menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                  y:       menuOpen && i === 0 ? 7  : menuOpen && i === 2 ? -7  : 0,
                  opacity: menuOpen && i === 1 ? 0  : 1,
                }}
              />
            ))}
          </button>
        )}
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="ed-mobile-menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ fontFamily: FONT_DISPLAY, fontSize: 52, color: WHITE, letterSpacing: "0.06em" }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                {l.label.toUpperCase()}
              </motion.a>
            ))}
            <motion.a
              href={`mailto:${PROFILE.email}`}
              onClick={() => setMenuOpen(false)}
              style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.1em", padding: "12px 28px", background: BLUE, color: WHITE, textTransform: "uppercase" as const, marginTop: 8 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
            >
              HIRE ME
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================================
// HERO SECTION
// ============================================================
function Hero() {
  const ww       = useWindowWidth();
  const isMobile = ww < 768;
  const isTablet = ww >= 768 && ww < 1100;

  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [photoError,  setPhotoError]  = useState(false);
  const [tick,        setTick]        = useState(0);
  const words = ["Precision.", "Clarity.", "Impact.", "Results."];

  useEffect(() => {
    const t = setInterval(() => setTick((n) => (n + 1) % 4), 2600);
    return () => clearInterval(t);
  }, []);

  const photoSize = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

  return (
    <section
      id="top"
      className="ed-geo-bg"
      style={{
        minHeight: "100vh",
        display:   "flex",
        alignItems: "center",
        padding:   isMobile ? "80px 20px 52px" : isTablet ? "80px 32px 52px" : "80px 52px",
        position:  "relative",
        overflow:  "hidden",
      }}
    >
      {/* Left blue bar */}
      <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 4, background: `linear-gradient(${BLUE}, ${NAVY})`, borderRadius: "0 2px 2px 0" }} />

      <div style={{
        display:        "flex",
        flexDirection:  isMobile ? "column" : "row",
        alignItems:     isMobile ? "center" : "center",
        justifyContent: "space-between",
        width:          "100%",
        maxWidth:       1280,
        margin:         "0 auto",
        gap:            isMobile ? 32 : isTablet ? 48 : 80,
      }}>

        {/* ── MOBILE: Photo on top centered ─────────────────── */}
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <PhotoFrame
              photoLoaded={photoLoaded}
              setPhotoLoaded={setPhotoLoaded}
              photoError={photoError}
              setPhotoError={setPhotoError}
              size="mobile"
            />
          </div>
        )}

        {/* ── LEFT — text content ───────────────────────────── */}
        <motion.div
          style={{ flex: 1, width: "100%" }}
          variants={stagger} initial="hidden" animate="visible"
        >
          {/* Available badge */}
          <motion.div variants={fadeUp} style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: isMobile ? 20 : 32, padding: "6px 14px", background: `${BLUE}15`, border: `1px solid ${BLUE}40`, borderRadius: 2 }}>
            <motion.span
              style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "block" }}
              animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
            />
            <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#22c55e", letterSpacing: "0.1em" }}>
              EASTC/BDTS/24/1607
            </span>
          </motion.div>

          {/* Name */}
          <motion.div variants={fadeUp}>
            <h1 style={{
              fontFamily:    FONT_DISPLAY,
              fontSize:      isMobile ? "clamp(52px,13vw,72px)" : isTablet ? "clamp(72px,10vw,108px)" : "clamp(88px,9vw,140px)",
              lineHeight:    0.9,
              letterSpacing: "0.04em",
              color:         NAVY,
              marginBottom:  8,
              textAlign:     isMobile ? "center" : "left",
            }}>
              EDGAR<br />
              <span style={{ color: BLUE }}>SATIEL MATERU</span>
            </h1>
          </motion.div>

          {/* Role */}
          <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: isMobile ? 14 : 20, marginTop: 8, justifyContent: isMobile ? "center" : "flex-start" }}>
            <div style={{ width: 28, height: 3, background: GOLD, borderRadius: 99, flexShrink: 0 }} />
            <p style={{ fontFamily: FONT_MONO, fontSize: isMobile ? 9 : 12, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
              Data Science · Full-Stack Dev
            </p>
          </motion.div>

          {/* Animated tagline */}
          <motion.div variants={fadeUp} style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: isMobile ? 14 : 20, flexWrap: "wrap" as const, justifyContent: isMobile ? "center" : "flex-start" }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: isMobile ? 14 : 20, color: MUTED, fontStyle: "italic" }}>
              Data that drives
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tick}
                style={{ fontFamily: FONT_BODY, fontSize: isMobile ? 14 : 20, fontWeight: 700, color: BLUE }}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
              >
                {words[tick]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Bio — hidden on mobile */}
          {!isMobile && (
            <motion.p variants={fadeUp} style={{ fontSize: 14, color: MUTED, lineHeight: 1.8, maxWidth: 480, marginBottom: 32 }}>
              {PROFILE.bio}
            </motion.p>
          )}

          {/* CTAs */}
          <motion.div variants={fadeUp} style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, justifyContent: isMobile ? "center" : "flex-start" }}>
            <motion.a
              href="#work"
              style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.1em", padding: isMobile ? "10px 22px" : "13px 32px", background: BLUE, color: WHITE, textTransform: "uppercase" as const, borderRadius: 2, display: "inline-block" }}
              whileHover={{ scale: 1.03, background: NAVY }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              VIEW WORK
            </motion.a>
            <motion.a
              href={`mailto:${PROFILE.email}`}
              style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.1em", padding: isMobile ? "10px 22px" : "13px 32px", border: `1.5px solid ${BLUE}`, color: BLUE, textTransform: "uppercase" as const, borderRadius: 2, display: "inline-block" }}
              whileHover={{ background: BLUE, color: WHITE }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
            >
              GET IN TOUCH
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} style={{ display: "flex", gap: isMobile ? 16 : 40, marginTop: isMobile ? 28 : 48, paddingTop: isMobile ? 18 : 28, borderTop: `1px solid ${BORDER}`, flexWrap: "wrap" as const, justifyContent: isMobile ? "center" : "flex-start" }}>
            {STATS.map(({ value, suffix, label }) => (
              <div key={label} style={{ textAlign: isMobile ? "center" : "left" }}>
                <p style={{ fontFamily: FONT_DISPLAY, fontSize: isMobile ? 32 : 48, color: BLUE, lineHeight: 1, letterSpacing: "0.04em" }}>
                  <CountUp value={value} suffix={suffix} />
                </p>
                <p style={{ fontFamily: FONT_MONO, fontSize: 8, color: MUTED, letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" as const }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT — photo (tablet + desktop only) ─────────── */}
        {!isMobile && (
          <motion.div
            style={{ flexShrink: 0 }}
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <PhotoFrame
              photoLoaded={photoLoaded}
              setPhotoLoaded={setPhotoLoaded}
              photoError={photoError}
              setPhotoError={setPhotoError}
              size={photoSize}
            />
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: 6 }}
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
      >
        <span style={{ fontFamily: FONT_MONO, fontSize: 8, color: MUTED, letterSpacing: "0.12em" }}>SCROLL</span>
        <div style={{ width: 1, height: 28, background: `linear-gradient(${BLUE}, transparent)` }} />
      </motion.div>
    </section>
  );
}

// ============================================================
// MARQUEE BAND
// ============================================================
function MarqueeBand() {
  const items   = ["Python", "R", "SQL", "React", "Laravel", "Scikit-learn", "Pandas", "MySQL", "NumPy", "JavaScript", "XGBoost", "Node.js"];
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", background: NAVY, padding: "13px 0" }}>
      <div className="ed-marquee-track">
        {doubled.map((item, i) => (
          <span key={i} style={{ fontFamily: FONT_MONO, fontSize: 11, color: `${WHITE}60`, letterSpacing: "0.14em", textTransform: "uppercase" as const, flexShrink: 0 }}>
            {item}
            <span style={{ color: BLUE, margin: "0 24px" }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// WORK / PROJECTS
// ============================================================
function Work() {
  const [open,   setOpen]   = useState<string | null>(null);
  const ww       = useWindowWidth();
  const isMobile = ww < 768;

  return (
    <section id="work" style={{ padding: isMobile ? "72px 20px" : "100px 52px", background: WHITE }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="ed-reveal" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40, paddingBottom: 16, borderBottom: `3px solid ${NAVY}` }}>
          <div>
            <p style={{ fontFamily: FONT_MONO, fontSize: 10, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 6 }}>Selected work</p>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: isMobile ? "clamp(40px,10vw,56px)" : "clamp(52px,7vw,80px)", color: NAVY, letterSpacing: "0.04em" }}>
              PROJECTS
            </h2>
          </div>
          <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: MUTED }}>{PROJECTS.length} projects</span>
        </div>

        {PROJECTS.map((p: Project) => (
          <div key={p.id} className="ed-project ed-reveal"
            onClick={() => setOpen(open === p.id ? null : p.id)}
            style={{ padding: isMobile ? "20px 0" : "28px 0" }}
          >
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "32px 1fr 24px" : "64px 1fr auto", gap: isMobile ? 12 : 24, alignItems: "start" }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: isMobile ? 18 : 22, color: BLUE, paddingTop: 2, letterSpacing: "0.04em" }}>{p.id}</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" as const }}>
                  <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: isMobile ? 18 : "clamp(22px,2.5vw,32px)", color: NAVY, letterSpacing: "0.04em" }}>{p.title.toUpperCase()}</h3>
                  {!isMobile && (
                    <span style={{ fontFamily: FONT_MONO, fontSize: 9, padding: "3px 9px", background: `${BLUE}15`, color: BLUE, borderRadius: 2, letterSpacing: "0.08em" }}>
                      {p.category}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {open === p.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ paddingTop: 12 }}>
                        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.75, maxWidth: 620, marginBottom: 16 }}>{p.description}</p>
                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const, marginBottom: 16 }}>
                          {p.stack.map((s: string) => (
                            <span key={s} className="ed-tag">{s}</span>
                          ))}
                        </div>
                        <a href={p.link} target="_blank" rel="noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: FONT_MONO, fontSize: 10, color: BLUE, letterSpacing: "0.1em", textTransform: "uppercase" as const, borderBottom: `1px solid ${BLUE}`, paddingBottom: 2 }}>
                          View on GitHub →
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 4, flexShrink: 0 }}>
                {!isMobile && <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: MUTED }}>{p.year}</span>}
                <motion.span
                  style={{ fontFamily: FONT_MONO, fontSize: 20, color: BLUE, display: "inline-block" }}
                  animate={{ rotate: open === p.id ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  +
                </motion.span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// SKILLS
// ============================================================
function Skills() {
  const ww       = useWindowWidth();
  const isMobile = ww < 768;
  const isTablet = ww >= 768 && ww < 1100;
  const stacked  = isMobile || isTablet;
  const groups   = ["Data", "Web", "Tools"] as const;

  return (
    <section id="skills" style={{ padding: isMobile ? "72px 20px" : "100px 52px", background: BG }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: stacked ? "1fr" : "320px 1fr", gap: stacked ? 0 : 80, alignItems: "start" }}>
          <div className="ed-reveal" style={{ position: stacked ? "static" : "sticky", top: 80, marginBottom: stacked ? 40 : 0 }}>
            <p style={{ fontFamily: FONT_MONO, fontSize: 10, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>Arsenal of knowledge</p>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(40px,7vw,72px)", color: NAVY, letterSpacing: "0.04em", lineHeight: 0.92, marginBottom: 20 }}>
              SKILLS<br /><span style={{ color: BLUE }}>&amp; TOOLS</span>
            </h2>
            <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.75, maxWidth: 280 }}>
              {SKILLS.length} skills across data science, web development, and developer tooling.
            </p>
            <div style={{ marginTop: 28, display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 16px", background: NAVY, borderRadius: 2 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: BLUE }} />
              <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: `${WHITE}80`, letterSpacing: "0.12em" }}>MCFC · EST. 1880</span>
            </div>
          </div>

          <div>
            {groups.map((group) => {
              const col = CATEGORY_COLORS[group] ?? BLUE;
              return (
                <div key={group} className="ed-reveal" style={{ marginBottom: 44 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 10, borderBottom: `2px solid ${col}30` }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: col, flexShrink: 0 }} />
                    <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: col, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>{group}</span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
                    {SKILLS.filter((s: Skill) => s.category === group).map((skill: Skill) => (
                      <span key={skill.name} className="ed-tag">
                        {skill.name}
                        <span style={{ marginLeft: 4 }}>
                          <span className="ed-dot-filled">{"◆".repeat(skill.level)}</span>
                          <span className="ed-dot-empty">{"◆".repeat(5 - skill.level)}</span>
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT + EDUCATION
// ============================================================
function About() {
  const ww       = useWindowWidth();
  const isMobile = ww < 768;
  const isTablet = ww >= 768 && ww < 1100;
  const stacked  = isMobile || isTablet;

  return (
    <section id="about" style={{ padding: isMobile ? "72px 20px" : "100px 52px", background: NAVY }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: stacked ? "1fr" : "1fr 1fr", gap: stacked ? 56 : 80 }}>
          <div className="ed-reveal">
            <p style={{ fontFamily: FONT_MONO, fontSize: 10, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>About me</p>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(36px,6vw,60px)", color: WHITE, letterSpacing: "0.04em", lineHeight: 0.92, marginBottom: 28 }}>
              THE MAN<br /><span style={{ color: BLUE }}>BEHIND THE DATA</span>
            </h2>
            <p style={{ fontSize: 14, color: `${WHITE}80`, lineHeight: 1.8, marginBottom: 16 }}>{PROFILE.bio}</p>
            <p style={{ fontSize: 13, color: `${WHITE}55`, lineHeight: 1.8, marginBottom: 32 }}>
              Great data science goes beyond technical accuracy — it tells a story that stakeholders can act on. I build solutions that are accurate, interpretable, and deployable.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 0 }}>
              {[
                { label: "Email",    value: PROFILE.email,                    href: `mailto:${PROFILE.email}` },
                { label: "GitHub",   value: "github.com/materuedgar",         href: PROFILE.github   },
                { label: "LinkedIn", value: "linkedin.com/in/materuedgar",    href: PROFILE.linkedin },
                { label: "Location", value: PROFILE.location,                 href: null },
              ].map(({ label, value, href }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: `1px solid ${WHITE}10` }}>
                  <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: BLUE, letterSpacing: "0.1em", textTransform: "uppercase" as const, width: 64, flexShrink: 0 }}>{label}</span>
                  {href
                    ? <a href={href} style={{ fontFamily: FONT_MONO, fontSize: 11, color: `${WHITE}70`, transition: "color 0.18s" }} onMouseEnter={(e) => (e.currentTarget.style.color = BLUE)} onMouseLeave={(e) => (e.currentTarget.style.color = `${WHITE}70`)}>{value}</a>
                    : <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: `${WHITE}70` }}>{value}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="ed-reveal">
            <p style={{ fontFamily: FONT_MONO, fontSize: 10, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 8 }}>Academic background</p>
            <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: "clamp(36px,6vw,60px)", color: WHITE, letterSpacing: "0.04em", lineHeight: 0.92, marginBottom: 36 }}>
              EDUCATION<br /><span style={{ color: BLUE }}>&amp; TRAINING</span>
            </h2>
            {EDUCATION.map((e: Education, i: number) => (
              <div key={i} style={{ marginBottom: 32, paddingLeft: 20, borderLeft: `3px solid ${i === 0 ? BLUE : `${WHITE}20`}` }}>
                <p style={{ fontFamily: FONT_MONO, fontSize: 9, color: BLUE, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 8 }}>{e.period}</p>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: isMobile ? 20 : 24, color: WHITE, letterSpacing: "0.04em", marginBottom: 4 }}>{e.degree.toUpperCase()}</h3>
                <p style={{ fontSize: 12, color: `${WHITE}55`, marginBottom: 8 }}>{e.school}</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: `${WHITE}45`, lineHeight: 1.65 }}>{e.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// CONTACT FOOTER
// ============================================================
function Contact() {
  const ww       = useWindowWidth();
  const isMobile = ww < 768;
  const [hov,    setHov]    = useState(false);

  return (
    <footer id="contact" style={{ background: BG, borderTop: `3px solid ${BLUE}`, padding: isMobile ? "72px 20px 48px" : "100px 52px 56px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="ed-reveal">
          <p style={{ fontFamily: FONT_MONO, fontSize: 10, color: BLUE, letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 16 }}>Get in touch</p>
          <motion.a
            href={`mailto:${PROFILE.email}`}
            style={{ display: "block", fontFamily: FONT_DISPLAY, fontSize: isMobile ? "clamp(40px,11vw,60px)" : "clamp(64px,8vw,108px)", color: hov ? BLUE : NAVY, letterSpacing: "0.04em", lineHeight: 0.88, marginBottom: 52, transition: "color 0.2s" }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
          >
            LET'S BUILD<br />
            <span style={{ color: BLUE }}>SOMETHING</span><br />
            GREAT.
          </motion.a>
        </div>

        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 16 }}>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: NAVY, letterSpacing: "0.06em" }}>
            Cantino creates<span style={{ color: BLUE }}>.</span>
          </p>
          <div style={{ display: "flex", gap: isMobile ? 20 : 28 }}>
            {[
              { l: "GitHub",   h: PROFILE.github   },
              { l: "LinkedIn", h: PROFILE.linkedin  },
              { l: "Email",    h: `mailto:${PROFILE.email}` },
            ].map(({ l, h }) => (
              <a key={l} href={h} target="_blank" rel="noreferrer"
                style={{ fontFamily: FONT_MONO, fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase" as const, transition: "color 0.18s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = BLUE)}
                onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}>
                {l}
              </a>
            ))}
          </div>
          <p style={{ fontFamily: FONT_MONO, fontSize: 10, color: MUTED }}>
            © {new Date().getFullYear()} · Man City Blue 🔵
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// ROOT COMPONENT
// ============================================================
export default function Edportfolio() {
  useReveal();
  return (
    <>
      <GlobalStyles />
      <Navbar />
      <main>
        <Hero />
        <MarqueeBand />
        <Work />
        <Skills />
        <About />
      </main>
      <Contact />
    </>
  );
}