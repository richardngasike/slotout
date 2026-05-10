import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import {
  FiThumbsUp,
  FiThumbsDown,
  FiAlertTriangle,
  FiTrendingDown,
  FiDollarSign,
  FiXCircle,
  FiShield,
  FiUsers,
  FiMic,
  FiAward,
  FiActivity,
  FiVolume2,
} from 'react-icons/fi';

// ─── Arne Slot Era Failings (Updated 10/05/2026) ──────────────────────────
const FAILINGS = [
  {
    Icon: FiDollarSign,
    title: '£450M+ Spent — Liverpool Got Worse',
    detail:
      'Liverpool spent over £450 million rebuilding the squad under Arne Slot, yet performances collapsed across all competitions. Massive investment produced regression instead of progress.',
  },

  {
    Icon: FiAward,
    title: 'Premier League Success Was Klopp’s Foundation',
    detail:
      "Any early success came from Jurgen Klopp’s established squad structure, mentality, and years of tactical groundwork. Fans increasingly believe Slot inherited a winning machine rather than building one.",
  },

  {
    Icon: FiTrendingDown,
    title: 'From Champions to Top-Four Scramble',
    detail:
      'Liverpool went from league champions to fighting just to secure Champions League qualification. Consistency vanished and the team lost its fear factor.',
  },

  {
    Icon: FiXCircle,
    title: 'Champions League Disaster',
    detail:
      'Liverpool crashed out of Europe in humiliating fashion, including a heavy aggregate defeat to PSG. European ambitions completely collapsed under Slot’s management.',
  },

  {
    Icon: FiShield,
    title: 'Domestic Cups Completely Failed',
    detail:
      'Liverpool failed in both domestic cups, missing huge opportunities for silverware despite having one of the most expensive squads in Europe.',
  },

  {
    Icon: FiTrendingDown,
    title: 'Handed Newcastle the Carabao Cup',
    detail:
      'Liverpool surrendered the Carabao Cup through passive football, poor game management, and lack of intensity — allowing Newcastle to celebrate while Liverpool folded under pressure.',
  },

  {
    Icon: FiShield,
    title: 'FA Cup Collapse',
    detail:
      "Liverpool’s FA Cup run imploded embarrassingly despite favorable expectations. Fans viewed the campaign as another example of the team lacking mentality in decisive moments.",
  },

  {
    Icon: FiActivity,
    title: 'Defensive Structure Fell Apart',
    detail:
      'Liverpool conceded goals at an alarming rate throughout 2025/26. The aggressive, disciplined defensive identity Klopp built disappeared under Slot.',
  },

  {
    Icon: FiAlertTriangle,
    title: 'Set-Piece Defending Became a National Joke',
    detail:
      'Liverpool conceded 18 set-piece goals in 2025/26 — among the worst records in the league. Defensive coaching and organization were repeatedly questioned.',
  },

  {
    Icon: FiUsers,
    title: 'Sold Luis Díaz — Then Created a Striker Crisis',
    detail:
      'Luis Díaz was sold while Liverpool already lacked attacking depth and reliable finishing. The club failed to replace his energy, dribbling, and goals, leaving the attack blunt and predictable.',
  },

  {
    Icon: FiUsers,
    title: 'No Proper Salah Succession Plan',
    detail:
      'Mohamed Salah’s decline and eventual exit concerns exposed Liverpool’s lack of long-term planning. No elite replacement was prepared despite years of warnings.',
  },

  {
    Icon: FiActivity,
    title: 'Attack Lost Its Identity',
    detail:
      'Liverpool became slow, predictable, and toothless in attack. The fast transitions and aggressive pressing football fans loved under Klopp disappeared almost entirely.',
  },

  {
    Icon: FiMic,
    title: '"Slot Ball" Became an Insult',
    detail:
      'Supporters began mocking the sideways passing and low-tempo football as “Slot Ball” — a style many fans considered boring, passive, and anti-Liverpool.',
  },

  {
    Icon: FiVolume2,
    title: 'Anfield Started Booing the Team',
    detail:
      'For one of the first times in years, Anfield openly booed performances and substitutions under Slot. Fan frustration moved from social media directly into the stadium.',
  },

  {
    Icon: FiVolume2,
    title: 'Booed Over Rio Ngumoha Substitution',
    detail:
      'Slot was loudly booed after substituting youngster Rio Ngumoha against Chelsea in May 2026. The reaction symbolized how damaged the relationship between manager and supporters had become.',
  },

  {
    Icon: FiUsers,
    title: 'Lost the Trust of the Fanbase',
    detail:
      'Many supporters no longer believe in Slot’s long-term vision. Confidence in his tactics, substitutions, recruitment influence, and leadership has sharply declined.',
  },

  {
    Icon: FiTrendingDown,
    title: 'Anfield Fear Factor Disappeared',
    detail:
      'Opposition teams no longer fear coming to Anfield. Liverpool dropped points regularly at home, and teams openly played with confidence against Slot’s side.',
  },

  {
    Icon: FiAlertTriangle,
    title: 'Failed Against Smaller Teams',
    detail:
      'Liverpool repeatedly dropped points against relegation-threatened and newly promoted teams, including embarrassing home performances that sparked fan outrage.',
  },

  {
    Icon: FiActivity,
    title: 'No Tactical Flexibility',
    detail:
      'Slot was heavily criticized for refusing to adapt tactically during matches. Liverpool often looked slow to react when games turned against them.',
  },

  {
    Icon: FiShield,
    title: 'Game Management Was Poor',
    detail:
      'Liverpool repeatedly lost leads, conceded late goals, and looked mentally fragile in important moments throughout the season.',
  },

  {
    Icon: FiTrendingDown,
    title: 'Players Regressed Under His Coaching',
    detail:
      'Several players looked worse compared to previous seasons, with fans questioning whether Slot’s coaching methods were improving anyone at all.',
  },

  {
    Icon: FiActivity,
    title: 'Pressing Identity Completely Vanished',
    detail:
      'Klopp’s famous high-intensity pressing system disappeared and was replaced by a passive mid-block that many supporters felt betrayed Liverpool’s identity.',
  },

  {
    Icon: FiUsers,
    title: 'Disconnect Between Manager and Supporters',
    detail:
      'Slot’s interviews and optimistic tone during poor results frustrated many fans, who felt he underestimated the scale of Liverpool’s decline.',
  },

  {
    Icon: FiAlertTriangle,
    title: '“Survival Mode” Comments Angered Fans',
    detail:
      'Slot describing Liverpool as being in “survival mode” during key matches outraged supporters who expect Liverpool to dominate games, not merely survive them.',
  },

  {
    Icon: FiTrendingDown,
    title: 'Massive Spending — No Clear System',
    detail:
      'Despite huge recruitment investment, Liverpool still lacked chemistry, balance, and a recognizable football structure deep into Slot’s tenure.',
  },

  {
    Icon: FiMic,
    title: 'Sack Discussions Became Mainstream',
    detail:
      'By 2026, serious discussions around replacing Slot had become widespread across fan channels, media outlets, and football communities online.',
  },

  {
    Icon: FiUsers,
    title: 'Compared Unfavorably to Klopp Constantly',
    detail:
      'Every weak performance intensified comparisons to Jurgen Klopp, making it increasingly difficult for Slot to establish his own legacy at Liverpool.',
  },

  {
    Icon: FiXCircle,
    title: 'Season Defined by Underachievement',
    detail:
      'The 2025/26 season became associated with wasted spending, tactical confusion, poor football, broken momentum, and growing supporter anger.',
  },
];

// ─── Voter helpers ────────────────────────────────────────────────────────
function getOrCreateVoterId() {
  const key = 'lfc_petition_voter_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = 'voter_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem(key, id);
  }
  return id;
}
function getStoredVote() { return localStorage.getItem('lfc_petition_voted'); }
function storeVote(choice) { localStorage.setItem('lfc_petition_voted', choice); }

// ─── Component ────────────────────────────────────────────────────────────
export default function Home() {
  const [votes, setVotes] = useState({ keep: 0, sack: 0 });
  const [voted, setVoted] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });
  const toastTimer = useRef(null);

  useEffect(() => {
    const prev = getStoredVote();
    if (prev) setVoted(prev);
    fetch('/api/vote')
      .then((r) => r.json())
      .then((d) => setVotes({ keep: d.keep, sack: d.sack }))
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg) {
    setToast({ show: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ show: false, msg: '' }), 3200);
  }

  async function handleVote(choice) {
    if (voted || voting) return;
    setVoting(true);
    const voterId = getOrCreateVoterId();
    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice, voterId }),
      });
      const data = await res.json();
      if (res.status === 409 || res.ok) {
        storeVote(choice);
        setVoted(choice);
        setVotes({ keep: data.keep, sack: data.sack });
        showToast(
          choice === 'sack'
            ? 'SACK SLOT — Your vote is recorded!'
            : 'KEEP SLOT — Your vote is recorded!'
        );
      } else {
        showToast('Something went wrong. Try again.');
      }
    } catch {
      showToast('Network error. Please try again.');
    } finally {
      setVoting(false);
    }
  }

  const total = votes.keep + votes.sack;
  const keepPct = total > 0 ? Math.round((votes.keep / total) * 100) : 50;
  const sackPct = total > 0 ? Math.round((votes.sack / total) * 100) : 50;

  return (
    <>
      <Head>
        <title>Slot Out? | Liverpool FC Fan Petition</title>
        <meta name="description" content="Liverpool FC global fan petition — Keep or Sack Arne Slot?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* ══ TOP BAR ══════════════════════════════════════════════════ */}
      <header className="top-bar">
        <span className="top-bar__text">SLOT</span>
        <span className="top-bar__out">OUT</span>
      </header>

      {/* ══ HERO — Full bleed image ═══════════════════════════════════ */}
      <section className="hero">
        <div className="hero__img-wrap">
          <img src="/slot.jpeg" alt="Arne Slot" className="hero__img" />
          <div className="hero__gradient" />
        </div>

        <div className="hero__content">
          <div className="hero__stamp-group">
            <div className="hero__stamp">SACK HIM</div>
            <p className="hero__stamp-sub">Slot Out — Liverpool Fan Petition 2026</p>
            <div className="hero__stamp hero__stamp--sm">SLOT OUT</div>
          </div>
        </div>
      </section>

      {/* ══ PETITION INTRO ════════════════════════════════════════════ */}
      <div className="petition-text">
        Liverpool fans — make your voice heard. If you believe change is needed,
        don't stay silent. Vote now and stand for what is best for our club's future.
      </div>

      {/* ══ VOTE SECTION — immediately after hero ════════════════════ */}
      <section className="vote-section">
        {!loading && (
          <div className="vote-bars">
            <div className="bar-row">
              <div className="bar-meta">
                <span className="bar-label bar-label--keep">KEEP</span>
                <span className="bar-count">{votes.keep} · {keepPct}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bar-fill--keep" style={{ width: `${keepPct}%` }} />
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-meta">
                <span className="bar-label bar-label--sack">SACK</span>
                <span className="bar-count">{votes.sack} · {sackPct}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bar-fill--sack" style={{ width: `${sackPct}%` }} />
              </div>
            </div>
            <p className="total-votes">{total.toLocaleString()} votes cast worldwide</p>
          </div>
        )}

        {voted && (
          <div className="voted-msg">
            {voted === 'sack' ? 'You voted: SACK SLOT' : 'You voted: KEEP SLOT'}
            <small>Your voice has been heard. Thank you.</small>
          </div>
        )}

        <div className="vote-btns">
          <button
            className="btn-vote btn-keep"
            onClick={() => handleVote('keep')}
            disabled={!!voted || voting}
            aria-label="Vote to Keep Arne Slot"
          >
            <FiThumbsUp className="btn-icon" />
            <span className="btn-label">KEEP SLOT</span>
            <span className="btn-desc">Give him more time</span>
          </button>

          <button
            className="btn-vote btn-sack"
            onClick={() => handleVote('sack')}
            disabled={!!voted || voting}
            aria-label="Vote to Sack Arne Slot"
          >
            <FiThumbsDown className="btn-icon" />
            <span className="btn-label">SACK SLOT</span>
            <span className="btn-desc">Enough is enough</span>
          </button>
        </div>
      </section>

      {/* ══ FAILINGS ══════════════════════════════════════════════════ */}
      <section className="failings-section">
        <div className="section-eyebrow">The Evidence</div>
        <h2 className="section-headline">WHY FANS HAVE HAD ENOUGH</h2>

        <div className="failings-list">
          {FAILINGS.map(({ Icon, title, detail }, i) => (
            <div className="failing-item" key={i}>
              <div className="failing-icon-wrap">
                <Icon className="failing-icon" />
              </div>
              <div className="failing-body">
                <strong>{title}</strong>
                <span>{detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ QUOTE ════════════════════════════════════════════════════ */}
      <div className="quote-strip">
        <blockquote>
          "Enough of the excuses now. Injuries don't help, but every team has injuries.
          This is enough — Slot cannot be the manager next season.
          This style of football is not Liverpool."
        </blockquote>
        <cite>— Jermaine Pennant, Former Liverpool Winger · May 2026</cite>
      </div>

      {/* ══ FOOTER ═══════════════════════════════════════════════════ */}
      <footer className="site-footer">
        <p className="footer-ynwa">YOU'LL NEVER WALK ALONE</p>
        <p className="footer-dev">
          Developed by <span>Richard Ngasike</span> · From Liverpool Fans, For Liverpool Fans
        </p>
        <p className="footer-disclaimer">
          Independent fan petition. Not affiliated with Liverpool FC or any official club entity.
        </p>
      </footer>

      {/* ══ TOAST ════════════════════════════════════════════════════ */}
      <div className={`toast${toast.show ? ' toast--show' : ''}`} role="alert">
        {toast.msg}
      </div>
    </>
  );
}
