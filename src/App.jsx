import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Gamepad2, Code2, Sparkles, ArrowUpRight, MousePointer2 } from "lucide-react";

const roles = ["Game Designer", "Software Developer", "Interactive Dreamer"];

function useMouseGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 80, damping: 24, mass: 0.3 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 24, mass: 0.3 });

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return { smoothX, smoothY };
}

function FloatingOrb({ className, delay = 0, duration = 10 }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={{
        y: [0, -28, 18, 0],
        x: [0, 18, -16, 0],
        scale: [1, 1.12, 0.94, 1],
        opacity: [0.45, 0.72, 0.5, 0.45],
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.045] mix-blend-soft-light"
      style={{
        backgroundImage:
          "url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')",
      }}
    />
  );
}

function Pill({ children, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-4 py-2 text-sm text-stone-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl"
    >
      {Icon && <Icon className="h-4 w-4 text-cyan-200/80 transition group-hover:text-cyan-100" />}
      {children}
    </motion.div>
  );
}

function VisualCard({ index, title, subtitle, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -10, rotateX: 4, rotateY: -4 }}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.025] p-6 shadow-2xl shadow-black/30 backdrop-blur-2xl"
    >
      <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="absolute -bottom-16 left-6 h-32 w-32 rounded-full bg-violet-300/10 blur-3xl" />
      <div className="relative z-10">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <Icon className="h-5 w-5 text-cyan-100" />
        </div>
        <p className="mb-2 text-lg font-medium tracking-wide text-white">{title}</p>
        <p className="text-sm leading-6 text-stone-400">{subtitle}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-200/40 to-transparent" />
    </motion.div>
  );
}

function TimelineStripe() {
  return (
    <div className="relative mx-auto mt-20 h-28 max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 backdrop-blur-xl sm:h-36">
      <motion.div
        className="absolute inset-y-0 left-0 flex items-center gap-5 whitespace-nowrap"
        animate={{ x: [0, -780] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(2)].map((_, loop) => (
          <React.Fragment key={loop}>
            {["LEVEL DESIGN", "PROTOTYPE", "GAME FEEL", "TOOLS", "SYSTEMS", "INTERACTION", "WORLD", "CODE"].map((item) => (
              <span
                key={`${loop}-${item}`}
                className="mx-2 bg-gradient-to-r from-stone-500 via-stone-100 to-cyan-200 bg-clip-text text-5xl font-black tracking-[-0.06em] text-transparent opacity-70 sm:text-7xl"
              >
                {item}
              </span>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#07090d] to-transparent" />
      <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#07090d] to-transparent" />
    </div>
  );
}

export default function App() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const { smoothX, smoothY } = useMouseGlow();
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setRoleIndex((v) => (v + 1) % roles.length), 2200);
    return () => clearInterval(timer);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        delay: (i % 9) * 0.3,
        size: 2 + (i % 4),
      })),
    []
  );

  return (
    <main ref={containerRef} className="min-h-screen overflow-hidden bg-[#07090d] text-stone-100 selection:bg-cyan-200/20 selection:text-cyan-50">
      <Grain />

      <motion.div
        className="pointer-events-none fixed z-40 hidden h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/10 blur-3xl lg:block"
        style={{ x: smoothX, y: smoothY }}
      />

      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(77,153,161,0.16),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(102,65,165,0.18),transparent_32%),linear-gradient(145deg,#07090d_0%,#0b0d13_48%,#101014_100%)]" />
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <section className="relative min-h-screen px-5 py-6 sm:px-8 lg:px-12">
        <FloatingOrb className="left-[8%] top-[18%] h-52 w-52 bg-cyan-300/14" />
        <FloatingOrb className="right-[10%] top-[24%] h-72 w-72 bg-violet-400/14" delay={1.3} duration={12} />
        <FloatingOrb className="bottom-[10%] left-[38%] h-64 w-64 bg-emerald-300/8" delay={0.6} duration={14} />

        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="absolute rounded-full bg-cyan-100/35"
            style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
            animate={{ opacity: [0.15, 0.7, 0.15], y: [0, -22, 0] }}
            transition={{ duration: 4 + (p.id % 5), repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/10 bg-white/[0.035] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl sm:px-6">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-200/80 via-slate-500/50 to-violet-500/70 p-px">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-[#090b10] text-xs font-bold text-cyan-50">cq</div>
            </div>
            <span className="text-sm font-medium tracking-[0.22em] text-stone-300">chenyoqwq</span>
          </motion.div>
          <motion.a
            href="mailto:hello@example.com"
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            className="hidden items-center gap-2 rounded-full border border-cyan-100/15 bg-cyan-100/[0.06] px-4 py-2 text-sm text-cyan-50 sm:flex"
          >
            Contact <ArrowUpRight className="h-4 w-4" />
          </motion.a>
        </nav>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-96px)] max-w-7xl items-center gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pt-0">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-7 flex flex-wrap gap-3"
            >
              <Pill icon={Gamepad2}>Game Designer</Pill>
              <Pill icon={Code2}>Software Developer</Pill>
              <Pill icon={Sparkles}>Visual-first Portfolio</Pill>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.95, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl text-[clamp(4rem,15vw,12rem)] font-black leading-[0.78] tracking-[-0.11em]"
            >
              <span className="block bg-gradient-to-br from-white via-stone-300 to-stone-600 bg-clip-text text-transparent">chenyo</span>
              <span className="block bg-gradient-to-r from-cyan-100 via-slate-300 to-violet-300 bg-clip-text text-transparent">qwq</span>
            </motion.h1>

            <div className="mt-8 h-10 overflow-hidden">
              <motion.p
                key={roleIndex}
                initial={{ y: 36, opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: -36, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="text-xl font-light tracking-[0.18em] text-cyan-50/80 sm:text-2xl"
              >
                {roles[roleIndex]}
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34 }}
              className="mt-7 max-w-xl text-base leading-8 text-stone-400 sm:text-lg"
            >
              Designing quiet worlds, responsive systems, and sharp interactive moments. This page is intentionally minimal — more atmosphere than explanation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <a className="group relative overflow-hidden rounded-full bg-stone-100 px-7 py-4 text-center text-sm font-semibold tracking-wide text-[#07090d] shadow-2xl shadow-cyan-950/40" href="#work">
                <span className="relative z-10 flex items-center justify-center gap-2">View Atmosphere <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" /></span>
                <motion.span className="absolute inset-0 bg-gradient-to-r from-cyan-100 via-white to-violet-100" whileHover={{ scale: 1.08 }} />
              </a>
              <a className="rounded-full border border-white/10 bg-white/[0.045] px-7 py-4 text-center text-sm font-medium tracking-wide text-stone-200 backdrop-blur-xl transition hover:bg-white/[0.08]" href="#about">
                Minimal About
              </a>
            </motion.div>
          </div>

          <motion.div style={{ y: y1 }} className="relative mx-auto aspect-square w-full max-w-[560px] lg:max-w-none">
            <motion.div
              style={{ rotate }}
              className="absolute inset-[8%] rounded-[3rem] border border-white/10 bg-gradient-to-br from-white/[0.12] via-white/[0.035] to-transparent shadow-[0_0_80px_rgba(82,165,172,0.13)] backdrop-blur-2xl"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[16%] rounded-full border border-dashed border-cyan-100/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
              className="absolute inset-[24%] rounded-full border border-violet-100/15"
            />
            <div className="absolute inset-[26%] rounded-[2.5rem] bg-gradient-to-br from-cyan-100/18 via-slate-300/8 to-violet-400/16 blur-sm" />
            <motion.div
              animate={{ y: [0, -12, 0], scale: [1, 1.02, 1] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-[30%] flex items-center justify-center rounded-[2rem] border border-white/10 bg-[#090b10]/80 p-6 text-center shadow-2xl shadow-black/50 backdrop-blur-xl"
            >
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-cyan-100/10">
                  <MousePointer2 className="h-7 w-7 text-cyan-100" />
                </div>
                <p className="text-sm uppercase tracking-[0.45em] text-stone-500">Interactive</p>
                <p className="mt-2 text-3xl font-black tracking-[-0.08em] text-white">FEEL</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="work" className="relative px-5 py-24 sm:px-8 lg:px-12">
        <motion.div style={{ y: y2 }} className="absolute right-[-8rem] top-10 h-96 w-96 rounded-full bg-cyan-300/8 blur-3xl" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <p className="mb-4 text-sm uppercase tracking-[0.42em] text-cyan-100/60">Selected Signals</p>
            <h2 className="text-4xl font-black tracking-[-0.08em] text-white sm:text-6xl">Less text. More sensation.</h2>
          </motion.div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <VisualCard index={0} icon={Gamepad2} title="Game Systems" subtitle="Mechanics, loops, progression, and moments that make interaction feel alive." />
            <VisualCard index={1} icon={Sparkles} title="Atmosphere" subtitle="Low-brightness palettes, cinematic contrast, ambient motion, and tactile UI." />
            <VisualCard index={2} icon={Code2} title="Development" subtitle="Fast prototypes, creative tools, frontend interfaces, and playable experiments." />
          </div>

          <TimelineStripe />
        </div>
      </section>

      <section id="about" className="relative px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, x: -26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75 }}
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl"
          >
            <p className="text-sm uppercase tracking-[0.42em] text-violet-100/50">About</p>
            <h3 className="mt-5 text-4xl font-black tracking-[-0.08em] text-white">chenyoqwq</h3>
            <p className="mt-6 leading-8 text-stone-400">
              Game designer and software developer. Currently shaping small but memorable interactive things.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.75, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-100/[0.08] via-white/[0.035] to-violet-300/[0.08] p-8 backdrop-blur-2xl"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-200/12 blur-3xl" />
            <div className="relative grid gap-4 sm:grid-cols-3">
              {["DESIGN", "CODE", "FEEL"].map((word, i) => (
                <motion.div
                  key={word}
                  whileHover={{ scale: 1.04, y: -6 }}
                  className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6 text-center"
                >
                  <p className="text-4xl font-black tracking-[-0.1em] text-white">{String(i + 1).padStart(2, "0")}</p>
                  <p className="mt-8 text-xs tracking-[0.38em] text-stone-400">{word}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative px-5 pb-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.035] px-6 py-5 text-sm text-stone-500 backdrop-blur-xl sm:flex-row">
          <span>© {new Date().getFullYear()} chenyoqwq</span>
          <span className="tracking-[0.28em]">GAME DESIGN · SOFTWARE DEV</span>
        </div>
      </footer>
    </main>
  );
}
