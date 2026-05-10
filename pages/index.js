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

// ─── Failings data ────────────────────────────────────────────────────────
const FAILINGS = [
  {
    Icon: FiDollarSign,
    title: '\u00a3450 Million Spent , Nothing to Show',
    detail:
      'A colossal \u00a3450m+ transfer outlay and Liverpool still crumbled across every competition in 2025/26.',
  },
  {
    Icon: FiXCircle,
    title: 'Knocked Out of Champions League , Twice',
    detail:
      'Humiliating back-to-back Champions League exits under Slot\'s watch, dashing all European glory.',
  },
  {
    Icon: FiTrendingDown,
    title: 'Handed Newcastle the Carabao Cup',
    detail:
      'A shocking capitulation gifted Newcastle United the Carabao Cup , a trophy Liverpool should have owned.',
  },
  {
    Icon: FiShield,
    title: 'Crystal Palace Won the FA Cup on His Watch',
    detail:
      'Liverpool\'s FA Cup campaign imploded, handing Crystal Palace their moment of glory at our expense.',
  },
  {
    Icon: FiAward,
    title: 'Premier League Title? That Was Klopp\'s Squad',
    detail:
      'The title was won on the back of Klopp\'s meticulously built roster and Salah\'s brilliance , not Slot\'s ideas.',
  },
  {
    Icon: FiActivity,
    title: '11 Defeats & 48 Goals Conceded in 2025/26',
    detail:
      'Liverpool suffered 11 Premier League defeats and conceded 48 goals , crashing from champions to barely scraping top four.',
  },
  {
    Icon: FiAlertTriangle,
    title: 'Record Set-Piece Goals Conceded',
    detail:
      '18 set-piece goals in 2025/26 , the worst record in Liverpool\'s entire Premier League history. Defensive coaching has been woeful.',
  },
  {
    Icon: FiVolume2,
    title: 'Booed Off by Anfield , Relationship in Tatters',
    detail:
      'Fans booed Slot live at Anfield in May 2026 over substitution decisions. His bond with the Kop is broken.',
  },
  {
    Icon: FiUsers,
    title: 'Lost Mo Salah , No Succession Plan',
    detail:
      'The all-time great left without a credible replacement lined up, leaving a gaping hole in attack.',
  },
  {
    Icon: FiMic,
    title: '"Slot Ball" , Dull, Toothless Football',
    detail:
      'Fans coined "Slot Ball" for the sideways, low-energy style that has nothing to do with the high-press Klopp identity.',
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
            ? 'SACK SLOT , Your vote is recorded!'
            : 'KEEP SLOT , Your vote is recorded!'
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
        <meta name="description" content="Liverpool FC global fan petition , Keep or Sack Arne Slot?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* TOP BAR */}
      <header className="top-bar">
        <span className="top-bar__text">SLOT</span>
        <span className="top-bar__out">OUT</span>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero__img-wrap">
          <img src="/slot.jpeg" alt="Arne Slot" className="hero__img" />
          <div className="hero__gradient" />
        </div>

        <div className="hero__content">
          <div className="hero__stamp-group">
            <div className="hero__stamp">SACK HIM</div>
            <p className="hero__stamp-sub">Slot Out , Liverpool Fan Petition 2026</p>
            <div className="hero__stamp hero__stamp--sm">SLOT OUT</div>
          </div>
        </div>
      </section>

      {/* PETITION INTRO */}
      <div className="petition-text">
        Liverpool fans , make your voice heard. If you believe change is needed,
        don\'t stay silent. Vote now and stand for what is best for our club\'s future.
      </div>

      {/* VOTE SECTION */}
      <section className="vote-section">
        {!loading && (
          <div className="vote-bars">
            <div className="bar-row">
              <div className="bar-meta">
                <span className="bar-label bar-label--keep">KEEP</span>
                <span className="bar-count">{votes.keep} &middot; {keepPct}%</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill bar-fill--keep" style={{ width: `${keepPct}%` }} />
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-meta">
                <span className="bar-label bar-label--sack">SACK</span>
                <span className="bar-count">{votes.sack} &middot; {sackPct}%</span>
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

      {/* FAILINGS */}
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

      {/* QUOTE */}
      <div className="quote-strip">
        <blockquote>
          &ldquo;Enough of the excuses now. Injuries don\'t help, but every team has injuries.
          This is enough , Slot cannot be the manager next season.
          This style of football is not Liverpool.&rdquo;
        </blockquote>
        <cite>, Jermaine Pennant, Former Liverpool Winger &middot; May 2026</cite>
      </div>

      {/* FOOTER */}
      <footer className="site-footer">
        <p className="footer-ynwa">YOU\'LL NEVER WALK ALONE</p>
        <p className="footer-dev">
          From <span>Liverpool Fans</span>, For Liverpool Fans Worldwide
        </p>
        <p className="footer-disclaimer">
          Independent fan petition. Not affiliated with Liverpool FC or any official club entity.
        </p>
      </footer>

      {/* TOAST */}
      <div className={`toast${toast.show ? ' toast--show' : ''}`} role="alert">
        {toast.msg}
      </div>
    </>
  );
}
