"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, Loader2, MessageSquare, Plus, Search, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/ui";

export type Contact = {
  id: string;
  name: string;
  company: string;
  role: string;
  image: string | null;
};

type Msg = { id: string; body: string; at: number };
type Thread = { contact: Contact; messages: Msg[] };

const KEY = "bookface.threads.v1";

function loadThreads(): Thread[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveThreads(threads: Thread[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(threads));
  } catch {
    /* ignore quota errors */
  }
}

export default function Messenger({ initialContact }: { initialContact: Contact | null }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(initialContact?.id ?? null);
  const [hydrated, setHydrated] = useState(false);
  const [composeOpen, setComposeOpen] = useState(false);
  const [mobileThread, setMobileThread] = useState(Boolean(initialContact));

  useEffect(() => {
    const stored = loadThreads();
    setThreads(stored);
    setHydrated(true);
  }, []);

  // Seed a thread for the contact passed via ?to=
  useEffect(() => {
    if (!hydrated || !initialContact) return;
    setThreads((prev) => {
      if (prev.some((t) => t.contact.id === initialContact.id)) return prev;
      const next = [{ contact: initialContact, messages: [] }, ...prev];
      saveThreads(next);
      return next;
    });
  }, [hydrated, initialContact]);

  const active = useMemo(() => threads.find((t) => t.contact.id === activeId) ?? null, [threads, activeId]);

  const addThread = useCallback((contact: Contact) => {
    setThreads((prev) => {
      if (prev.some((t) => t.contact.id === contact.id)) return prev;
      const next = [{ contact, messages: [] }, ...prev];
      saveThreads(next);
      return next;
    });
    setActiveId(contact.id);
    setMobileThread(true);
    setComposeOpen(false);
  }, []);

  const send = useCallback(
    (body: string) => {
      if (!active || !body.trim()) return;
      const msg: Msg = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, body: body.trim(), at: Date.now() };
      setThreads((prev) => {
        const next = prev.map((t) =>
          t.contact.id === active.contact.id ? { ...t, messages: [...t.messages, msg] } : t
        );
        saveThreads(next);
        return next;
      });
      toast.success(`Message sent to ${active.contact.name.split(" ")[0]}`);
    },
    [active]
  );

  return (
    <div className="shell py-8 md:py-10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <div className="kicker mb-2">Private messages</div>
          <h1 className="text-[30px] md:text-[36px]">Messages</h1>
        </div>
        <button onClick={() => setComposeOpen(true)} className="btn btn-accent">
          <Plus size={15} /> New message
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="grid md:grid-cols-[320px_1fr] min-h-[560px]">
          {/* Thread list */}
          <div className={`border-r border-[var(--color-line)] ${mobileThread ? "hidden md:block" : "block"}`}>
            <div className="px-4 py-3 border-b border-[var(--color-line)] flex items-center justify-between">
              <span className="kicker">Conversations</span>
              <span className="chip">{threads.length}</span>
            </div>
            {!hydrated ? (
              <div className="p-6 flex items-center gap-2 text-[12.5px] text-2">
                <Loader2 size={14} className="animate-spin" /> Loading…
              </div>
            ) : threads.length === 0 ? (
              <div className="p-6">
                <div className="w-10 h-10 rounded-full surface hair flex items-center justify-center text-[var(--color-ink-3)]">
                  <MessageSquare size={18} />
                </div>
                <div className="text-[13px] font-medium mt-3">No conversations yet</div>
                <div className="text-[12px] text-2 mt-1 leading-relaxed">
                  Find a founder in the directory and send them a message.
                </div>
                <Link href="/founders" className="btn btn-sm mt-4">
                  Browse founders
                </Link>
              </div>
            ) : (
              <div className="max-h-[560px] overflow-y-auto">
                {threads.map((t) => {
                  const last = t.messages[t.messages.length - 1];
                  return (
                    <button
                      key={t.contact.id}
                      onClick={() => {
                        setActiveId(t.contact.id);
                        setMobileThread(true);
                      }}
                      className={`w-full text-left px-4 py-3 border-b border-[var(--color-line)] last:border-0 flex items-center gap-3 transition-colors ${
                        activeId === t.contact.id ? "bg-[var(--color-surface)]" : "hover:bg-[var(--color-surface)]"
                      }`}
                    >
                      <Avatar name={t.contact.name} image={t.contact.image} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-medium truncate">{t.contact.name}</div>
                        <div className="text-[11.5px] text-2 truncate">
                          {last ? last.body : `${t.contact.role} · ${t.contact.company}`}
                        </div>
                      </div>
                      {last && (
                        <span className="text-[10px] text-3 mono shrink-0">
                          {new Date(last.at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Conversation */}
          <div className={`flex flex-col ${mobileThread ? "flex" : "hidden md:flex"}`}>
            {active ? (
              <>
                <div className="px-4 py-3 border-b border-[var(--color-line)] flex items-center gap-3">
                  <button onClick={() => setMobileThread(false)} className="btn btn-sm btn-ghost md:hidden !px-1.5">
                    <ArrowLeft size={15} />
                  </button>
                  <Avatar name={active.contact.name} image={active.contact.image} size="sm" />
                  <div className="min-w-0 flex-1">
                    <Link href={`/founders/${active.contact.id}`} className="text-[13.5px] font-medium hover:underline">
                      {active.contact.name}
                    </Link>
                    <div className="text-[11.5px] text-2 truncate">
                      {active.contact.role}
                      {active.contact.company ? ` · ${active.contact.company}` : ""}
                    </div>
                  </div>
                  <Link href={`/founders/${active.contact.id}`} className="btn btn-sm">
                    Profile
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-surface)]/40">
                  {active.messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-16">
                      <Avatar name={active.contact.name} image={active.contact.image} size="lg" />
                      <div className="text-[14px] font-medium mt-3">{active.contact.name}</div>
                      <div className="text-[12.5px] text-2 mt-1 max-w-[260px]">
                        Start the conversation. Messages are delivered privately to their Bookface inbox.
                      </div>
                    </div>
                  ) : (
                    active.messages.map((m) => (
                      <div key={m.id} className="flex justify-end">
                        <div className="max-w-[78%]">
                          <div className="bg-[var(--color-ink)] text-white rounded-[10px] rounded-br-[3px] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap">
                            {m.body}
                          </div>
                          <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-3 mono">
                            {new Date(m.at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                            <Check size={11} />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Composer onSend={send} />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 rounded-full surface hair flex items-center justify-center text-[var(--color-ink-3)]">
                  <MessageSquare size={20} />
                </div>
                <div className="text-[14px] font-medium mt-4">Your messages</div>
                <div className="text-[12.5px] text-2 mt-1 max-w-[280px]">
                  Select a conversation, or start a new one with any founder in the directory.
                </div>
                <button onClick={() => setComposeOpen(true)} className="btn btn-accent btn-sm mt-4">
                  <Plus size={14} /> New message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {composeOpen && (
        <ComposeModal
          onClose={() => setComposeOpen(false)}
          onPick={addThread}
        />
      )}
    </div>
  );
}

function Composer({ onSend }: { onSend: (body: string) => void }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function submit() {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
    ref.current?.focus();
  }

  return (
    <div className="border-t border-[var(--color-line)] p-3 bg-white">
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              submit();
            }
          }}
          rows={2}
          placeholder="Write a message…  (⌘ + Enter to send)"
          className="resize-none !py-2.5 !text-[13px]"
        />
        <button onClick={submit} disabled={!value.trim()} className="btn btn-accent h-[42px] px-3.5 disabled:opacity-40">
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

function ComposeModal({ onClose, onPick }: { onClose: () => void; onPick: (c: Contact) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/founders?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        if (!cancelled) setResults(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 220);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg card shadow-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--color-line)] flex items-center gap-2">
          <Search size={15} className="text-[var(--color-ink-3)]" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search any YC founder by name or company…"
            className="!border-0 !p-1 !text-[13px] focus:!border-0"
          />
          <button onClick={onClose} className="btn btn-sm btn-ghost !px-1.5" aria-label="Close">
            <X size={15} />
          </button>
        </div>
        <div className="max-h-[380px] overflow-y-auto">
          {loading && results.length === 0 ? (
            <div className="px-4 py-6 text-[12.5px] text-2 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Searching…
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-[12.5px] text-2">
              {q ? "No founders match that search." : "Type a name or company to begin."}
            </div>
          ) : (
            results.map((c) => (
              <button
                key={c.id}
                onClick={() => onPick(c)}
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-[var(--color-surface)] border-b border-[var(--color-line)] last:border-0"
              >
                <Avatar name={c.name} image={c.image} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium truncate">{c.name}</div>
                  <div className="text-[11.5px] text-2 truncate">
                    {c.role}
                    {c.company ? ` · ${c.company}` : ""}
                  </div>
                </div>
                <Plus size={14} className="text-[var(--color-ink-3)]" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
