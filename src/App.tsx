import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HeroTextWithDepthShadow } from "./HeroTextWithDepthShadow";
import { GlowCapture } from "./GlowCapture";

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  canAttend: boolean;
};

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function PrimaryCTA({ onClick }: { onClick: () => void }) {
  return (
    <GlowCapture className="inline-block rounded-[999px]" glowSize={320}>
      <button
        onClick={onClick}
        className="h-16 rounded-[999px] bg-brand px-12 text-base font-semibold text-white shadow-btn hover:opacity-95 transition inline-flex items-center gap-3"
      >
        לקביעת שיחת התאמה
        <span className="text-xl">←</span>
      </button>
    </GlowCapture>
  );
}

function Modal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [s, setS] = useState<FormState>({
    fullName: "",
    phone: "",
    email: "",
    canAttend: false,
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const canSubmit =
    s.fullName.trim().length >= 2 &&
    s.phone.trim().length >= 8 &&
    /^\S+@\S+\.\S+$/.test(s.email.trim()) &&
    s.canAttend &&
    status !== "sending";

  async function submit() {
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("http://localhost:5175/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (!res.ok) throw new Error("bad");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            className="w-full max-w-lg rounded-xl2 bg-white shadow-soft overflow-hidden"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500">בקשת שיחת התאמה</div>
                  <div className="mt-1 text-xl font-bold text-slate-900">
                    HERSALON | Inner Circle
                  </div>
                </div>
                <button
                  className="text-slate-400 hover:text-slate-700"
                  onClick={onClose}
                  aria-label="close"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-3">
                <input
                  className="h-12 rounded-xl2 border border-slate-200 px-4 outline-none focus:border-brand"
                  placeholder="שם מלא"
                  value={s.fullName}
                  onChange={(e) => setS({ ...s, fullName: e.target.value })}
                />
                <input
                  className="h-12 rounded-xl2 border border-slate-200 px-4 outline-none focus:border-brand"
                  placeholder="טלפון"
                  value={s.phone}
                  onChange={(e) => setS({ ...s, phone: e.target.value })}
                />
                <input
                  className="h-12 rounded-xl2 border border-slate-200 px-4 outline-none focus:border-brand"
                  placeholder="מייל"
                  value={s.email}
                  onChange={(e) => setS({ ...s, email: e.target.value })}
                />

                <label className="mt-2 flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1 accent-brand"
                    checked={s.canAttend}
                    onChange={(e) =>
                      setS({ ...s, canAttend: e.target.checked })
                    }
                  />
                  <span>
                    יש לי אפשרות להגיע למפגש פיזי שבועי בין 19:00-22:00 בשכונת
                    בילויים ברמת גן
                  </span>
                </label>

                <button
                  onClick={submit}
                  disabled={!canSubmit}
                  className="mt-3 h-12 rounded-xl2 bg-brand text-white font-semibold shadow-btn disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95 transition"
                >
                  {status === "sending" ? "שולחת..." : "שליחה"}
                </button>

                {status === "sent" && (
                  <div className="text-sm text-emerald-700">
                    נשלח! אחזור אלייך לתיאום שיחה 💜
                  </div>
                )}
                {status === "error" && (
                  <div className="text-sm text-rose-700">
                    משהו השתבש. ודאי שהשרת רץ על 5175 או שלחי ידנית:
                    morry4@gmail.com
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const [open, setOpen] = useState(false);

  const includeCards = useMemo(
    () => [
      {
        icon: "📍",
        title: "8 מפגשים פיזיים",
        desc: "3-3.5 שעות כל אחד בסלון ברמת גן, בקבוצה קטנה מאוד (6-8 נשים).",
      },
      {
        icon: "🕒",
        title: "מסגרת עבודה ברורה",
        desc: "כל מפגש בנוי כך שיש פוקוס, זמן עבודה אמיתי, ותוצר מחייב בסוף.",
      },
      {
        icon: "⚡",
        title: "3-4 מפגשי Execution",
        desc: "מפגשים שבהם פשוט בונים: קוד / מוצר / תשתית / תוכן - כולן באותו חלל.",
      },
      {
        icon: "🧠",
        title: "מנטורים מהשורה הראשונה",
        desc: "יושבים איתך בזמן אמת: שואלים, מפצחים ומקדמים.",
      },
      {
        icon: "🤝",
        title: "קבוצה שמחזיקה אותך",
        desc: "נשים רציניות שבאו לבנות + קבוצת ווצאפ להתייעצות גם בין המפגשים.",
      },
    ],
    []
  );

  const outcomes = useMemo(
    () => [
      "כיוון ברור למיזם אחד",
      "החלטות שהפסיקו להידחות",
      "משהו קיים בעולם: מוצר, פיילוט, בטא, או התחלה של השקה",
      "משתמשות / לקוחות ראשונים או תהליך לקראתם",
      "תחושה (מבוססת מציאות) שאת מסוגלת להחזיק עשייה לאורך זמן",
    ],
    []
  );

  return (
    <div dir="rtl" className="min-h-screen bg-white text-slate-900">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <GlowCapture className="inline-block rounded-xl2" glowSize={240}>
            <button
              onClick={() => setOpen(true)}
              className="h-10 rounded-xl2 bg-brand px-5 text-sm font-semibold text-white shadow-btn hover:opacity-95 transition"
            >
              הצטרפי לInner Circle
            </button>
          </GlowCapture>

          <div className="text-xl font-bold">
            <span className="text-brand">HERSALON</span>{" "}
            <span className="text-slate-400">|</span>{" "}
            <span className="font-medium">Inner Circle</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-28 pb-24 text-center">
          <Reveal>
            <HeroTextWithDepthShadow
              text="HERSALON"
              className="text-6xl sm:text-7xl"
              shadowColorClass="text-brand"
            />
            <div className="mt-3">
              <HeroTextWithDepthShadow
                text="Inner Circle"
                className="text-5xl sm:text-6xl text-brand"
                shadowColorClass="text-brand"
                scrollRange={620}
              />
            </div>

            <p className="mt-10 text-lg text-slate-500 leading-relaxed max-w-3xl mx-auto">
              <div className="text-slate-500">
                אם הגעת לכאן את כנראה כבר מבינה דבר אחד
              </div>
              הרעיון שלך לא תקוע בגלל חוסר ידע
              <br />
              <div className="font-black text-black text-xl pt-3">
                הוא תקוע כי אין לו מרחב קבוע שבו הוא קורה
              </div>
              <br />
              {/* <span className="text-brand font-semibold">
                וזה בדיוק מה שאני נותנת
              </span> */}
            </p>

            <div className="mt-14 flex justify-center">
              <PrimaryCTA onClick={() => setOpen(true)} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <Reveal>
            <div className="text-4xl sm:text-5xl font-extrabold">
              מה התהליך כולל?
            </div>
            <div className="mt-4 text-slate-500">
              את מקבלת מעטפת מלאה לעשייה בפועל
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
            {includeCards.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <GlowCapture
                  className="rounded-xl2 bg-white border border-slate-100 shadow-soft p-8"
                  glowColor="rgba(91,79,228,0.45)"
                  glowSize={260}
                >
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 rounded-xl2 bg-brand/10 flex items-center justify-center text-brand text-xl">
                      ✦
                    </div>
                    <div className="text-xl font-bold">{c.title}</div>
                  </div>
                  <div className="mt-3 text-slate-500 leading-relaxed">
                    {c.desc}
                  </div>
                </GlowCapture>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* DARK OUTCOMES */}
      <section className="bg-[#0b1023] text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <div className="overflow-hidden shadow-soft">
                <img
                  src="/hero4.png"
                  alt=""
                  className="w-full min-h-[512px] sm:h-[420px] mt-3 object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="text-4xl sm:text-5xl font-extrabold leading-tight">
                מה את מקבלת בסוף התהליך?
              </div>
              <div className="mt-4 text-white/70">
                כל אחת מגדירה לעצמה את נקודת הסיום הנחשקת
              </div>

              <div className="mt-10 space-y-5">
                {outcomes.map((t, i) => (
                  <motion.div
                    key={t}
                    className="flex items-start gap-4"
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 0.55,
                      ease: [0.22, 1, 0.36, 1],
                      delay: i * 0.06,
                    }}
                  >
                    <div className="h-6 w-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand font-bold">
                      ✦
                    </div>
                    <div className="h-9 text-brand/85 font-semibold">{t}</div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 rounded-lg bg-brand/15 py-3 px-6 text-white font-black">
                לא כולן יוצאות באותו שלב אבל אף אחת לא נשארת תקועה
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-slate-50 m-auto">
        <div className="flex justify-center items-center max-w-6xl px-6 py-24">
          <Reveal>
            <div className="rounded-xl2 max-w-[800px] px-20 bg-white shadow-soft border border-slate-100 p-10 md:p-14 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold">
                מחיר והרשמה
              </div>

              <div className="mt-10 px-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="text-slate-400">הרשמה מוקדמת</div>
                  <div className="mt-2 text-5xl font-extrabold text-brand">
                    ₪7,000
                  </div>
                </div>

                <div className="md:border-r md:border-slate-100">
                  <div className="text-slate-400">הרשמה מאוחרת</div>
                  <div className="mt-2 text-5xl font-extrabold">₪8,888</div>
                </div>
              </div>

              <div className="mt-10 mx-20 rounded-xl2 bg-brand/5 border border-brand/10 p-6 text-slate-600 flex items-center justify-center gap-3">
                <span className="text-brand">✦</span>
                יש לקבוע שיחת התאמה שכן איכות האנשים והקבוצה והתאמה מדויקת היא
                קריטית לשם תהליך אפקטיבי.
              </div>

              <div className="mt-10 flex justify-center">
                <GlowCapture
                  className="inline-block rounded-xl2"
                  glowSize={320}
                >
                  <button
                    onClick={() => setOpen(true)}
                    className="h-16 rounded-xl2 bg-brand px-12 text-white font-semibold shadow-btn hover:opacity-95 transition"
                  >
                    לבקשת שיחת התאמה
                  </button>
                </GlowCapture>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-slate-500">
          © HERSALON | Inner Circle {new Date().getFullYear()} · כל הזכויות
          שמורות.
        </div>
      </footer>

      <Modal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
