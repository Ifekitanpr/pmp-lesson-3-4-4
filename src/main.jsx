import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Check,
  ChevronDown,
  GitBranch,
  Menu,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import "./styles.css";
import SynthesisModal from "./SynthesisModal";
import translator from "./assets/illustrations/translator-capability.png";
import network from "./assets/illustrations/hub-to-network.png";
import compare from "./assets/illustrations/mentoring-vs-coaching.png";
import rescue from "./assets/illustrations/rescued-vs-coached.png";
import distributed from "./assets/illustrations/distributed-capability.png";
import translatorReveal from "./assets/illustrations/translator-reveal.png";
import empowered from "./assets/illustrations/empowered-culture.png";
import mentoringCard from "./assets/illustrations/mentoring-card.png";
import coachingCard from "./assets/illustrations/coaching-card.png";
const screens = [
  "Build capability",
  "What it asks",
  "Mentor or coach",
  "Multiply capacity",
  "Exam lens",
];
const q1 = {
  q: "Scenario: A project manager spends fifteen minutes right after a tense meeting helping a team member figure out exactly what went wrong in how they handled one specific objection. Is this mentoring or coaching?",
  answers: [
    "Mentoring — any development moment counts as mentoring",
    "Coaching — focused, in-the-moment development of one specific skill",
    "Neither — this is just normal feedback, not development",
    "Mentoring — because it happened after a real event, not in a training session",
  ],
  correct: 1,
  yes: "Right — narrow, immediate, tied to one specific skill in one specific moment. That's the coaching pattern. Mentoring would look more like an ongoing relationship built over months, not a fifteen-minute debrief.",
  no: "Look at the scope and timeframe again — narrow and immediate points to one of the two terms specifically.",
};
const q2 = {
  q: "Scenario: A PM has personally mediated the same type of stakeholder disagreement six times over the course of a project. What does this most likely indicate?",
  answers: [
    "The stakeholders involved are simply difficult people",
    "The PM is doing their job well by staying closely involved every time",
    "A coaching or mentoring opportunity has been missed — the underlying capability was never developed, so the same problem keeps returning",
    "The project needs a different, less involved project manager",
  ],
  correct: 2,
  yes: "Exactly — six repeats of the same problem is the signature of a missed development opportunity, not bad luck or difficult people. Solving it personally each time never changed anyone's underlying capability.",
  no: "Think about what stays constant across all six instances — it isn't the people, it's the fact that nobody's capability changed after the first one.",
};
function Modal({ d, close, read }) {
  useEffect(() => {
    const f = (e) => e.key === "Escape" && close();
    addEventListener("keydown", f);
    return () => removeEventListener("keydown", f);
  }, [close]);
  return createPortal(
    <motion.div
      className="modal-backdrop focused-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={close}
    >
      <motion.section
        className="detail-sheet detail-modal"
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="drawer-close" onClick={close}>
          <X />
        </button>
        <img className="drawer-illustration" src={d.image} alt="" />
        <p className="mini-label">{d.kicker}</p>
        <h3>{d.title}</h3>
        <p>{d.text}</p>
        {d.note && (
          <div className="sheet-note">
            <Target />
            <span>{d.note}</span>
          </div>
        )}
        <button className="modal-close-bottom" onClick={read}>
          <Check /> Mark as read
        </button>
      </motion.section>
    </motion.div>,
    document.body,
  );
}
function Quiz({ data, finish }) {
  const [p, setP] = useState(null);
  return createPortal(
    <div className="knowledge-modal-backdrop">
      <motion.section
        className="quiz knowledge-modal"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="quiz-label">
          <Target /> MICRO KNOWLEDGE CHECK
        </div>
        <h3>{data.q}</h3>
        <div className="answers">
          {data.answers.map((a, i) => (
            <button
              key={a}
              className={
                p === i ? (i === data.correct ? "correct" : "wrong") : ""
              }
              onClick={() => setP(i)}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {a}
            </button>
          ))}
        </div>
        {p !== null && (
          <p className={`feedback ${p === data.correct ? "good" : "bad"}`}>
            {p === data.correct ? data.yes : data.no}
          </p>
        )}
        {p !== null && (
          <button className="finish-check" onClick={finish}>
            Finish check <ArrowRight />
          </button>
        )}
      </motion.section>
    </div>,
    document.body,
  );
}
const Art = ({ src, alt, className = "" }) => (
  <img className={`custom-lesson-art ${className}`} src={src} alt={alt} />
);
function App() {
  const [page, setPage] = useState(0),
    [sound, setSound] = useState(true),
    [menu, setMenu] = useState(false),
    [detail, setDetail] = useState(null),
    [revealed, setRevealed] = useState([false, false]),
    [flips, setFlips] = useState([]),
    [qOne, setQOne] = useState(false),
    [mode, setMode] = useState(null),
    [qTwo, setQTwo] = useState(false),
    [quiz, setQuiz] = useState(null),
    [done, setDone] = useState(false),
    [synthesisOpen, setSynthesisOpen] = useState(false);
  const can = [
    revealed[0],
    revealed[1],
    flips.length === 2 && qOne,
    mode === "coached" && qTwo,
    done,
  ][page];
  const show = (i, d) => {
    setRevealed((v) => v.map((x, n) => (n === i ? true : x)));
    setDetail(d);
  };
  const next = () => {
    if (can && page < 4) {
      setPage(page + 1);
      scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="course-select">
          <Award />
          <span>PMP Project Management Professional</span>
          <ChevronDown />
        </button>
        <div className="module-progress">
          <div>
            {Array.from({ length: 10 }, (_, i) => (
              <span
                key={i}
                className={`progress-dot ${i < 9 ? "done" : i === 9 ? "active" : ""}`}
              >
                {i < 9 ? <Check size={10} /> : <span />}
              </span>
            ))}
          </div>
        </div>
        <div className="top-actions">
          <button className="ghost-button" onClick={() => setSound(!sound)}>
            {sound ? <Volume2 /> : <VolumeX />}
            <span>{sound ? "Sound on" : "Sound off"}</span>
          </button>
          <button className="ghost-button">
            <X />
            <span>Quit</span>
          </button>
        </div>
      </header>
      <main className="workspace">
        <section className="lesson-stage">
          <div className="outline">
            <button className="menu-button" onClick={() => setMenu(!menu)}>
              <Menu />
            </button>
            {menu && (
              <div className="outline-panel">
                <div className="outline-summary">
                  <b>Lesson 3.4.4</b>
                </div>
                <div className="lesson-list">
                  {screens.map((s, i) => (
                    <button
                      key={s}
                      className={`lesson ${i === page ? "current" : ""}`}
                      disabled={i > page}
                      onClick={() => setPage(i)}
                    >
                      <span
                        className={`progress-dot ${i < page ? "done" : ""}`}
                      >
                        {i < page ? <Check size={10} /> : <span />}
                      </span>
                      <span>{s}</span>
                      <small>{i + 1}</small>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <article className="lesson-card">
            <nav className="section-tabs">
              <p className="section-tabs-count">Section {page + 1} of 5</p>
              <div className="section-tabs-row">
                {screens.map((s, i) => (
                  <button
                    key={s}
                    className={`section-tab ${i === page ? "active" : i < page ? "done" : "locked"}`}
                    disabled={i > page}
                    onClick={() => setPage(i)}
                  >
                    {i < page && <Check />}
                    <span>{s}</span>
                  </button>
                ))}
              </div>
            </nav>
            <AnimatePresence mode="wait">
              <motion.section
                key={page}
                className="lesson-content comm-page mentoring-page"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                {page === 0 && (
                  <div className="comm-hero">
                    <div>
                      <p className="eyebrow">LESSON 3.4.4</p>
                      <h1>Organize and Act on Mentoring Opportunities</h1>
                      <p>
                        A translator who personally answers every question in the room becomes indispensable — and becomes the bottleneck at the exact same time. Teach two other people in that room to speak the language, and suddenly the room can function without the translator standing in it.
                      </p>
                      <button
                        className="primary compact-cta"
                        onClick={() =>
                          show(0, {
                            title: "Build the capability that prevents the next ten versions",
                            kicker: "CLICK-TO-REVEAL",
                            image: translatorReveal,
                            text: "Every conversation so far in this task has been about something the project manager does for the project — categorizing stakeholders, surfacing expectations, facilitating alignment. This final enabler asks a different question entirely: what if, instead of solving every alignment problem yourself, you built the capability for someone else to solve it? A first-time product owner who doesn't know how to prioritize a backlog. A junior franchise liaison who freezes in difficult conversations. A functional manager who doesn't yet understand why governance matters. Each is a moment where the PM can either solve the immediate problem — or build the capability that prevents the next ten versions of it.",
                          })
                        }
                      >
                        Reveal the development opportunity <ArrowRight />
                      </button>
                    </div>
                    <Art
                      src={translator}
                      alt="A single translator becomes a room with several capable communicators"
                    />
                  </div>
                )}
                {page === 1 && (
                  <div className="calibration">
                    <div>
                      <p className="eyebrow">WHAT THIS ENABLER ACTUALLY ASKS FOR</p>
                      <h2>From managing stakeholders to developing them</h2>
                      <p>
                        Every enabler up to this point has widened the project manager's toolkit for managing stakeholders. This one widens the lens entirely — from managing them to developing them.
                      </p>
                      <button
                        className="primary compact-cta"
                        onClick={() =>
                          show(1, {
                            title: "What the fourth enabler asks",
                            kicker: "CLICK-TO-REVEAL",
                            image: empowered,
                            text: "The fourth enabler of ECO People Task 5 asks the project manager to organize and act on mentoring opportunities. A project manager is also a leader who builds capability — mentoring and coaching stakeholders and team members so they can engage more effectively, make better decisions, and eventually carry parts of the work themselves. This connects directly to PMBOK® 8's empowered-culture principle: leaders who develop others create teams that are more capable, more committed, and less dependent on the project manager as a single point of coordination. Every stakeholder you mentor into competence is a stakeholder who no longer needs you to broker every decision on their behalf.",
                          })
                        }
                      >
                        Reveal what the enabler asks <ArrowRight />
                      </button>
                    </div>
                    <Art
                      src={network}
                      alt="A central hub transforms into a directly connected stakeholder network"
                    />
                  </div>
                )}
                {page === 2 && (
                  <div className="wide">
                    <p className="eyebrow">MENTORING VS. COACHING</p>
                    <h2>Mentoring vs. Coaching</h2>
                    <p className="lede">
                      These two words get used almost interchangeably in everyday conversation — but they describe genuinely different kinds of development, and the exam draws the distinction deliberately. Flip both cards to see it.
                    </p>
                    <div className="flip-grid">
                      {[
                        {
                          name: "Mentoring",
                          icon: TrendingUp,
                          image: mentoringCard,
                          text: "The longer-term sharing of experience and perspective — helping someone build judgment over time by exposing them to how an experienced practitioner thinks through ambiguous situations. Less about a single skill, more about cultivating overall capability and confidence.",
                        },
                        {
                          name: "Coaching",
                          icon: Target,
                          image: coachingCard,
                          text: "The focused development of a specific skill — helping someone get better at one particular thing, like running a difficult conversation or structuring a prioritization decision, often in the moment or shortly after it happens.",
                        },
                      ].map((f, i) => {
                        const I = f.icon;
                        return (
                          <div className="illustrated-flip" key={f.name}>
                          <img className="flip-card-art" src={f.image} alt="" />
                          <button
                            className={`flip ${flips.includes(i) ? "flipped" : ""}`}
                            onClick={() =>
                              setFlips((v) => (v.includes(i) ? v : [...v, i]))
                            }
                          >
                            <div className="flip-inner">
                              <div className="flip-front">
                                <small>CLICK TO FLIP</small>
                                <h3>{f.name}</h3>
                              </div>
                              <div className="flip-back">
                                <small>DEVELOPMENT MODE</small>
                                <h3>{f.name}</h3>
                                <p>{f.text}</p>
                              </div>
                            </div>
                          </button>
                          </div>
                        );
                      })}
                    </div>
                    {flips.length === 2 && (
                      <div className="backing">
                        Both build capability beyond the immediate task. Neither is about doing the work for the person — both are about helping them become someone who can do it themselves. Mentoring opportunities show up constantly in stakeholder work, often disguised as ordinary problems rather than development moments: coaching a first-time product owner on backlog prioritization, helping a junior franchise liaison learn to run their own alignment conversations, guiding a functional manager new to projects through why governance and escalation actually matter.
                      </div>
                    )}
                    {flips.length === 2 && !qOne && (
                      <button
                        className="knowledge-check-cta"
                        onClick={() => setQuiz(q1)}
                      >
                        <Target /> Start knowledge check <ArrowRight />
                      </button>
                    )}
                  </div>
                )}
                {page === 3 && (
                  <div className="wide capacity">
                    <p className="eyebrow">WHY THIS MULTIPLIES CAPACITY</p>
                    <h2>Why This Multiplies Your Capacity</h2>
                    <p className="lede">
                      Here's the part that separates this enabler from ordinary problem-solving. Every stakeholder conversation a PM personally handles is one conversation. Toggle between two versions of the same junior liaison to see the difference mentoring actually makes.
                    </p>
                    <div className="mode-tabs">
                      <button
                        className={mode === "rescued" ? "active" : ""}
                        onClick={() => setMode("rescued")}
                      >
                        <RefreshCw /> Rescued
                      </button>
                      <button
                        className={mode === "coached" ? "active" : ""}
                        onClick={() => setMode("coached")}
                      >
                        <GitBranch /> Coached
                      </button>
                    </div>
                    {mode && (
                      <motion.div
                        className={`mode-panel ${mode}`}
                        key={mode}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <Art
                          src={rescue}
                          alt="Repeated rescue loops back to the PM while coaching branches capability outward"
                        />
                        <div>
                          <small>
                            {mode === "rescued"
                              ? "DEPENDENCE REPEATS"
                              : "CAPABILITY MULTIPLIES"}
                          </small>
                          <h3>
                            {mode === "rescued"
                              ? "Every conflict returns to the PM."
                              : "The liaison resolves the next one."}
                          </h3>
                          <p>
                            {mode === "rescued"
                              ? "A junior franchise liaison who is rescued by the project manager every time a conflict arises learns exactly one lesson: escalation is the answer. The underlying skill never develops. The next conflict still lands back on the project manager's desk — and the one after that, and the one after that."
                              : "A junior franchise liaison who is coached through running their own alignment conversation learns something different: that they are capable of resolving it themselves. The next time a similar situation arises, they don't need the project manager in the room at all. The capability now exists independent of the PM's direct involvement — a genuine multiplier, not just a one-time fix."}
                          </p>
                        </div>
                      </motion.div>
                    )}
                    {mode === "coached" && !qTwo && (
                      <button
                        className="knowledge-check-cta"
                        onClick={() => setQuiz(q2)}
                      >
                        <Target /> Start knowledge check <ArrowRight />
                      </button>
                    )}
                  </div>
                )}
                {page === 4 && (
                  <div className="exam">
                    <Art
                      src={distributed}
                      alt="A fully distributed network with no dominant central node"
                    />
                    <div>
                      <p className="eyebrow">SCREEN 5 · SYNTHESIS (EXAM LENS)</p>
                      <h2>This closes out all four enablers of ECO People Task 5</h2>
                      <p className="exam-intro">
                        This closes out all four enablers of ECO People Task 5 — and the idea underneath this last one is worth carrying forward into everything the earlier three set up.
                      </p>
                      <button
                        className="primary compact-cta"
                        disabled={done}
                        onClick={() => setSynthesisOpen(true)}
                      >
                        {done ? "Synthesis reviewed" : "Reveal the synthesis"}
                        <Sparkles />
                      </button>
                    </div>
                  </div>
                )}
              </motion.section>
            </AnimatePresence>
            {can && (
              <div className="anchor">
                <Check /> Interaction complete — continue when ready.
              </div>
            )}
            <footer className="nav-footer">
              <button
                className="secondary-button"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <ArrowLeft /> Previous
              </button>
              <button
                className={`primary-button ${can ? "unlocked" : ""}`}
                disabled={!can}
                onClick={next}
              >
                {page === 4 ? "Complete" : "Continue"}
                <ArrowRight />
              </button>
            </footer>
          </article>
        </section>
      </main>
      <AnimatePresence>
        {detail && (
          <Modal
            d={detail}
            close={() => setDetail(null)}
            read={() => setDetail(null)}
          />
        )}
        {synthesisOpen && (
          <SynthesisModal
            title="Develop capability, not dependence"
            onClose={() => setSynthesisOpen(false)}
            onReviewed={() => {
              setDone(true);
              setSynthesisOpen(false);
            }}
          >
            <p>Mentoring and coaching aren't extras layered on top of stakeholder management — they multiply engagement capacity. Every time a project manager resolves a stakeholder's problem instead of developing their capability to resolve it themselves, that same problem is likely to return, because nothing about the stakeholder's competence has actually changed. Develop a stakeholder to lead their own alignment conversations, structure their own prioritization decisions, or navigate their own governance questions — and you've built capability, not just solved today's problem.</p>
            <h4>Exam-relevant enablers to remember:</h4>
            <ul>
              <li>Mentoring = longer-term judgment-building; Coaching = focused, in-the-moment skill development — both build capability, neither does the work for the person</li>
              <li>The empowered-culture principle: developed stakeholders reduce dependence on the PM as a single point of coordination</li>
              <li>A repeated problem is often a missed development opportunity, not bad luck</li>
              <li>This completes ECO People Task 5's four enablers: categorize, identify expectations, facilitate alignment, and mentor for lasting capability</li>
            </ul>
          </SynthesisModal>
        )}
      </AnimatePresence>
      {quiz && (
        <Quiz
          data={quiz}
          finish={() => {
            if (quiz === q1) setQOne(true);
            else setQTwo(true);
            setQuiz(null);
          }}
        />
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
