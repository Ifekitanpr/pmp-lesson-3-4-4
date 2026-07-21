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
  q: "A PM spends fifteen minutes after a tense meeting helping a team member improve how they handled one specific objection. Is this mentoring or coaching?",
  answers: [
    "Mentoring—any development counts",
    "Coaching—focused development of one specific skill",
    "Neither—this is only feedback",
    "Mentoring—because it followed a real event",
  ],
  correct: 1,
  yes: "Right—narrow, immediate, and tied to one skill is coaching.",
  no: "Look at the scope and timeframe: narrow and immediate points to coaching.",
};
const q2 = {
  q: "A PM has personally mediated the same disagreement six times. What does this most likely indicate?",
  answers: [
    "The stakeholders are difficult",
    "The PM is doing well by staying involved",
    "A development opportunity was missed, so capability never changed",
    "The project needs a less involved PM",
  ],
  correct: 2,
  yes: "Exactly—repetition is the signature of capability that was never developed.",
  no: "Focus on what stayed unchanged after all six interventions: nobody learned to resolve it.",
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
        {p === data.correct && (
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
    [done, setDone] = useState(false);
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
                      <p className="eyebrow">
                        LESSON 3.4.4 · ORGANIZE AND ACT ON MENTORING
                        OPPORTUNITIES
                      </p>
                      <h1>
                        Stop being the <em>only translator.</em>
                      </h1>
                      <p>
                        A translator who personally answers every question
                        becomes indispensable—and the bottleneck at the same
                        time. Teach two other people the language, and suddenly
                        the room can function without the translator standing in
                        it.
                      </p>
                      <button
                        className="primary compact-cta"
                        onClick={() =>
                          show(0, {
                            title: "Solve the next ten versions",
                            kicker: "THE LEADERSHIP SHIFT",
                            image: translatorReveal,
                            text: "Every earlier conversation in this task focused on something the PM does for the project: categorizing stakeholders, surfacing expectations, and facilitating alignment. This enabler asks a different question: what if, instead of solving every alignment problem yourself, you built someone else’s capability to solve it? A first-time product owner learning to prioritize, a junior liaison learning difficult conversations, or a functional manager learning why governance matters can become more capable through the PM’s leadership.",
                            note: "The choice is not merely whether to solve today’s problem. It is whether to build the capability that prevents the next ten versions of it.",
                          })
                        }
                      >
                        Reveal the multiplier <ArrowRight />
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
                      <p className="eyebrow">WHAT THIS ENABLER ASKS</p>
                      <h2>
                        Move from managing people to <em>developing them.</em>
                      </h2>
                      <p>
                        The fourth enabler of ECO People Task 5 asks the PM to
                        organize and act on mentoring opportunities. A project
                        manager is also a leader who builds capability—helping
                        stakeholders and team members engage effectively, make
                        better decisions, and eventually carry parts of the work
                        themselves.
                      </p>
                      <button
                        className="primary compact-cta"
                        onClick={() =>
                          show(1, {
                            title: "Empowered culture reduces dependence",
                            kicker: "PMBOK® 8",
                            image: empowered,
                            text: "This connects directly to PMBOK® 8’s empowered-culture principle. Leaders who develop others create teams that are more capable, more committed, and less dependent on the PM as a single point of coordination. The network becomes stronger because knowledge, judgment, and confidence no longer live in only one person.",
                            note: "Every stakeholder mentored into competence is a stakeholder who no longer needs the PM to broker every decision on their behalf.",
                          })
                        }
                      >
                        Reveal the leadership rule <ArrowRight />
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
                    <h2>
                      Both build capability. They work at different scales.
                    </h2>
                    <p className="lede">
                      Flip both cards to see the exam distinction.
                    </p>
                    <div className="flip-grid">
                      {[
                        {
                          name: "Mentoring",
                          icon: TrendingUp,
                          image: mentoringCard,
                          text: "The longer-term sharing of experience and perspective. It cultivates judgment, confidence, and overall capability by exposing someone to how an experienced practitioner thinks through ambiguous situations—not merely one isolated skill.",
                        },
                        {
                          name: "Coaching",
                          icon: Target,
                          image: coachingCard,
                          text: "Focused development of one specific skill—such as running a difficult conversation or structuring a prioritization decision—often in the moment or immediately after the event.",
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
                        Both build capability beyond the immediate task. Neither
                        does the work for the person. Opportunities often look
                        like ordinary problems: coaching a first-time product
                        owner on backlog prioritization, helping a junior
                        liaison run an alignment conversation, or guiding a
                        functional manager through governance and escalation.
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
                    <h2>Rescue creates a loop. Coaching creates reach.</h2>
                    <p className="lede">
                      Toggle between two versions of the same junior liaison.
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
                              ? "A liaison rescued whenever conflict arises learns exactly one lesson: escalation is the answer. The underlying skill never develops, so the next conflict—and the one after that—returns to the PM’s desk."
                              : "A liaison coached through their own alignment conversation learns they can resolve it. When a similar situation returns, the PM no longer needs to be in the room. Capability now exists independently—a multiplier, not a one-time fix."}
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
                      <p className="eyebrow">EXAM LENS · LASTING CAPABILITY</p>
                      <h2>Develop capability, not just today’s solution.</h2>
                      <p className="exam-intro">
                        Mentoring and coaching are not extras layered on
                        stakeholder management—they multiply engagement
                        capacity. Solving the problem personally changes today.
                        Developing someone to lead the conversation, structure
                        the decision, or navigate governance changes what the
                        project can handle tomorrow.
                      </p>
                      <button
                        className="primary compact-cta"
                        onClick={() => setDone(true)}
                      >
                        {done
                          ? "Capability distributed"
                          : "Reveal the exam rules"}
                        <Sparkles />
                      </button>
                      {done && (
                        <ul>
                          <li>
                            Mentoring builds judgment over time; coaching
                            develops a focused skill.
                          </li>
                          <li>
                            Both build capability and neither does the work for
                            the person.
                          </li>
                          <li>
                            Repeated problems often signal missed development
                            opportunities.
                          </li>
                          <li>
                            Developed stakeholders reduce dependence on the PM.
                          </li>
                          <li>
                            ECO People Task 5 closes the loop: categorize,
                            identify expectations, facilitate alignment, and
                            mentor for lasting capability.
                          </li>
                        </ul>
                      )}
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
