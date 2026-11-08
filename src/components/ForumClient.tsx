"use client";

import { useMemo, useState } from "react";
import { ArrowBigUp, MessageSquare, Plus, Reply, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui";

type ReplyItem = { id: string; author: string; company: string; body: string; votes: number };

type Thread = {
  id: string;
  title: string;
  body: string;
  author: string;
  company: string;
  batch: string;
  tag: string;
  votes: number;
  at: number;
  replies: ReplyItem[];
};

const TAGS = ["All", "Fundraising", "Product", "GTM", "Hiring", "Legal", "Technical", "Founder life"];

const SEED: Thread[] = [
  {
    id: "t1",
    title: "How do you actually price a usage-based product without killing expansion revenue?",
    body: "We're moving from seats to consumption. Early customers love the flexibility but our expansion revenue is getting harder to forecast, and two enterprise buyers pushed back on uncapped overages. How are you structuring commit + overage without scaring procurement?",
    author: "Maya Patel",
    company: "Lattice",
    batch: "S18",
    tag: "Product",
    votes: 84,
    at: Date.now() - 1000 * 60 * 42,
    replies: [
      { id: "r1", author: "Daniel Ortiz", company: "Ramp", body: "Anchor on a committed spend band, then discount the overage rate at higher bands. Procurement needs a ceiling they can budget, not a perfect forecast.", votes: 31 },
      { id: "r2", author: "Priya Nair", company: "ServiceTitan", body: "We publish a soft cap with a 20% buffer and a quarterly true-up. Churn dropped once finance could model it.", votes: 18 },
    ],
  },
  {
    id: "t2",
    title: "Series A in 2026: what metrics are funds really underwriting right now?",
    body: "Raising our A in the next quarter. We're at ~$1.1M ARR, 118% NDR, 14 months of runway. Everyone says the bar moved. What are the funds you've spoken to actually anchoring on — growth rate, payback, or logo quality?",
    author: "Daniel Ortiz",
    company: "Ramp",
    batch: "W19",
    tag: "Fundraising",
    votes: 156,
    at: Date.now() - 1000 * 60 * 60 * 5,
    replies: [
      { id: "r3", author: "Sara Kim", company: "Vanta", body: "Payback under 18 months and a believable path to $10M ARR. Growth rate gets you the meeting; retention gets you the term sheet.", votes: 44 },
      { id: "r4", author: "Tom Becker", company: "Retool", body: "Logo quality matters more than people admit. Three recognizable logos in a vertical changes the conversation.", votes: 22 },
    ],
  },
  {
    id: "t3",
    title: "First enterprise hire — when do you move off founder-led sales?",
    body: "We just closed our first $80k ACV deal, all founder-led. Do we hire an AE now or a solutions engineer first? I keep hearing conflicting advice about sequencing.",
    author: "Priya Nair",
    company: "ServiceTitan",
    batch: "W14",
    tag: "GTM",
    votes: 61,
    at: Date.now() - 1000 * 60 * 60 * 12,
    replies: [
      { id: "r5", author: "Alex Chen", company: "Scale AI", body: "Hire the AE once you have a repeatable motion you can document. If every deal needs founder context, you're not ready.", votes: 27 },
    ],
  },
  {
    id: "t4",
    title: "What does your first 90-day onboarding look like for a senior engineer?",
    body: "We're scaling from 8 to 20 engineers this year. Our onboarding is basically 'read the repo'. Looking for a lightweight structure that doesn't turn into process theater.",
    author: "Sara Kim",
    company: "Vanta",
    batch: "S18",
    tag: "Hiring",
    votes: 39,
    at: Date.now() - 1000 * 60 * 60 * 20,
    replies: [
      { id: "r6", author: "Marcus Reed", company: "Rippling", body: "One shipped change to production in week one, one owned area by day 30, one cross-team project by day 60. Simple and it works.", votes: 19 },
    ],
  },
  {
    id: "t5",
    title: "GDPR + AI features: are you logging prompts in production?",
    body: "Adding an AI assistant that touches customer data. Legal wants retention limits, product wants full logs for debugging. How are other EU-facing startups resolving this?",
    author: "Tom Becker",
    company: "Retool",
    batch: "W17",
    tag: "Legal",
    votes: 47,
    at: Date.now() - 1000 * 60 * 60 * 26,
    replies: [
      { id: "r7", author: "Lena Fischer", company: "Personio", body: "Hash identifiers before logging, 30-day retention, and a documented DPIA. We kept prompts but stripped PII at the edge.", votes: 24 },
    ],
  },
  {
    id: "t6",
    title: "Postgres is hitting a wall at 4TB. When did you move off a single primary?",
    body: "Read replicas are fine but write throughput is the bottleneck. We're on RDS. Do we shard, move to Aurora, or start splitting services? Trying to avoid a rewrite.",
    author: "Marcus Reed",
    company: "Rippling",
    batch: "W17",
    tag: "Technical",
    votes: 73,
    at: Date.now() - 1000 * 60 * 60 * 34,
    replies: [
      { id: "r8", author: "Dev Shah", company: "GitLab", body: "Aurora got us another 18 months before we had to think about partitioning. Do the cheap thing first.", votes: 30 },
    ],
  },
  {
    id: "t7",
    title: "How are you protecting deep work while still being a present founder?",
    body: "Two kids, a 30-person team, and a fundraising process starting next month. I'm context-switching every 11 minutes and it shows. What actually works for you?",
    author: "Lena Fischer",
    company: "Personio",
    batch: "W18",
    tag: "Founder life",
    votes: 112,
    at: Date.now() - 1000 * 60 * 60 * 48,
    replies: [
      { id: "r9", author: "Maya Patel", company: "Lattice", body: "Two no-meeting blocks a week, defended like a board meeting. And a chief of staff changed my life.", votes: 41 },
      { id: "r10", author: "Daniel Ortiz", company: "Ramp", body: "Batch your 1:1s into two days. The rest of the week belongs to the company's hardest problem.", votes: 26 },
    ],
  },
  {
    id: "t8",
    title: "Warm intro or cold email for seed investors — does it still matter?",
    body: "Building a list of 60 funds for our seed. I have warm paths to maybe 15. Is it worth spending three weeks farming intros, or just send a tight cold email?",
    author: "Alex Chen",
    company: "Scale AI",
    batch: "S16",
    tag: "Fundraising",
    votes: 58,
    at: Date.now() - 1000 * 60 * 60 * 60,
    replies: [
      { id: "r11", author: "Sara Kim", company: "Vanta", body: "Warm intro doubles reply rate, but a great cold email from a founder with traction beats a weak warm intro every time.", votes: 33 },
    ],
  },
];

function ago(at: number) {
  const mins = Math.max(1, Math.round((Date.now() - at) / 60000));
  if (mins < 60) return `${mins}m`;
  const hrs = Math.round(mins / 60);
  if (hrs < 48) return `${hrs}h`;
  return `${Math.round(hrs / 24)}d`;
}

export default function ForumClient() {
  const [threads, setThreads] = useState<Thread[]>(SEED);
  const [tag, setTag] = useState("All");
  const [sort, setSort] = useState<"latest" | "top">("latest");
  const [openId, setOpenId] = useState<string | null>(null);
  const [composer, setComposer] = useState(false);
  const [voted, setVoted] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const list = useMemo(() => {
    const filtered = tag === "All" ? threads : threads.filter((t) => t.tag === tag);
    return [...filtered].sort((a, b) => (sort === "latest" ? b.at - a.at : b.votes - a.votes));
  }, [threads, tag, sort]);

  function vote(id: string) {
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, votes: t.votes + (voted[id] ? -1 : 1) } : t))
    );
    setVoted((v) => ({ ...v, [id]: !v[id] }));
  }

  function addReply(id: string) {
    const text = (replyText[id] || "").trim();
    if (!text) return;
    setThreads((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              replies: [
                ...t.replies,
                { id: `r-${Date.now()}`, author: "You", company: "Blackbird", body: text, votes: 0 },
              ],
            }
          : t
      )
    );
    setReplyText((r) => ({ ...r, [id]: "" }));
    toast.success("Reply posted");
  }

  function createThread(title: string, body: string, newTag: string) {
    const t: Thread = {
      id: `t-${Date.now()}`,
      title,
      body,
      author: "You",
      company: "Blackbird",
      batch: "S26",
      tag: newTag,
      votes: 0,
      at: Date.now(),
      replies: [],
    };
    setThreads((prev) => [t, ...prev]);
    setComposer(false);
    setOpenId(t.id);
    toast.success("Discussion posted");
  }

  return (
    <div className="shell py-10 md:py-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
        <div>
          <div className="kicker mb-2">The collective brain</div>
          <h1 className="text-[32px] md:text-[40px]">Forum</h1>
          <p className="text-[14px] text-2 mt-2 max-w-[600px]">
            Questions and answers from founders who have already solved it. High signal, no spectators.
          </p>
        </div>
        <button onClick={() => setComposer(true)} className="btn btn-accent shrink-0">
          <Plus size={15} /> New discussion
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-2.5 py-1.5 rounded-md text-[12px] font-medium whitespace-nowrap transition-colors ${
                tag === t
                  ? "bg-[var(--color-ink)] text-white"
                  : "text-[var(--color-ink-2)] hover:bg-[var(--color-surface)]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[12px] shrink-0">
          {(["latest", "top"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-2 py-1 rounded ${
                sort === s ? "font-medium text-[var(--color-ink)] bg-[var(--color-surface)]" : "text-2 hover:text-[var(--color-ink)]"
              }`}
            >
              {s === "latest" ? "Latest" : "Top"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {list.map((t) => {
          const open = openId === t.id;
          return (
            <div key={t.id} className="card overflow-hidden">
              <div className="flex items-start gap-3 px-4 py-3.5">
                <button
                  onClick={() => vote(t.id)}
                  className={`flex flex-col items-center justify-center w-10 h-12 rounded-md border shrink-0 transition-colors ${
                    voted[t.id]
                      ? "border-[var(--color-accent)] bg-[#fff7f0] text-[var(--color-accent-ink)]"
                      : "border-[var(--color-line)] text-2 hover:border-[var(--color-line-strong)]"
                  }`}
                  aria-label="Upvote"
                >
                  <ArrowBigUp size={16} />
                  <span className="text-[11px] mono font-medium">{t.votes}</span>
                </button>

                <button onClick={() => setOpenId(open ? null : t.id)} className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="chip chip-accent">{t.tag}</span>
                    <span className="text-[11px] text-3 mono">{ago(t.at)}</span>
                  </div>
                  <div className="text-[14.5px] font-medium leading-snug">{t.title}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Avatar name={t.author} size="sm" />
                    <span className="text-[11.5px] text-2 mono">
                      {t.author} · {t.company} · {t.batch}
                    </span>
                    <span className="text-[11.5px] text-3 mono ml-auto flex items-center gap-1">
                      <MessageSquare size={12} /> {t.replies.length}
                    </span>
                  </div>
                </button>
              </div>

              {open && (
                <div className="border-t border-[var(--color-line)] px-4 py-4 bg-[var(--color-surface)]/50">
                  <p className="text-[13.5px] leading-relaxed text-[var(--color-ink-2)] max-w-[780px]">{t.body}</p>

                  <div className="mt-5 space-y-3 max-w-[780px]">
                    {t.replies.map((r) => (
                      <div key={r.id} className="flex gap-3">
                        <Avatar name={r.author} size="sm" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[12px]">
                            <span className="font-medium">{r.author}</span>
                            <span className="text-3 mono"> · {r.company}</span>
                          </div>
                          <div className="text-[13px] text-[var(--color-ink-2)] leading-relaxed mt-0.5">{r.body}</div>
                        </div>
                        <span className="text-[10.5px] text-3 mono shrink-0">{r.votes} pts</span>
                      </div>
                    ))}
                    {t.replies.length === 0 && (
                      <div className="text-[12.5px] text-2">No replies yet. Be the first to help.</div>
                    )}
                  </div>

                  <div className="flex items-start gap-2 mt-4 max-w-[780px]">
                    <input
                      value={replyText[t.id] || ""}
                      onChange={(e) => setReplyText((r) => ({ ...r, [t.id]: e.target.value }))}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addReply(t.id);
                        }
                      }}
                      placeholder="Write a reply…"
                      className="!py-2 !text-[13px]"
                    />
                    <button onClick={() => addReply(t.id)} className="btn btn-accent btn-sm h-[36px] shrink-0">
                      <Reply size={13} /> Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {composer && <Composer onClose={() => setComposer(false)} onCreate={createThread} />}
    </div>
  );
}

function Composer({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (title: string, body: string, tag: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState("Fundraising");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[8vh]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-xl card shadow-xl">
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-line)]">
          <div className="text-[14px] font-medium">New discussion</div>
          <button onClick={onClose} className="btn btn-sm btn-ghost !px-1.5" aria-label="Close">
            <X size={15} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <div className="kicker mb-1.5">Title</div>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What do you need help with?" />
          </div>
          <div>
            <div className="kicker mb-1.5">Category</div>
            <select value={tag} onChange={(e) => setTag(e.target.value)} className="select">
              {TAGS.filter((t) => t !== "All").map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="kicker mb-1.5">Context</div>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} placeholder="Share the specifics — stage, numbers, what you've tried." />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button onClick={onClose} className="btn btn-sm">Cancel</button>
            <button
              onClick={() => title.trim() && body.trim() && onCreate(title.trim(), body.trim(), tag)}
              disabled={!title.trim() || !body.trim()}
              className="btn btn-accent btn-sm disabled:opacity-40"
            >
              Post discussion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
