"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail, X } from "lucide-react";

type Props = {
  nextPath: string;
};

export default function SignInForm({ nextPath }: Props) {
  const router = useRouter();
  const [showLogin, setShowLogin] = useState(false);
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showLogin) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !loading) setShowLogin(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLogin, loading]);

  function openLogin() {
    setShowLogin(true);
    setError("");
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (step === "email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError("Enter a valid email address.");
        return;
      }
      setStep("password");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setError(result.error || "We couldn't sign in with those details. Check them and try again.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setError("Sign-in could not be completed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="shell flex items-center pt-8 sm:pt-10">
        <a href="/signin" className="inline-flex w-fit items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/yc-logo.svg" alt="Y Combinator" className="h-8 w-8 rounded-[6px]" />
          <span className="flex flex-col items-start gap-0.5">
            <span className="wordmark text-[23px] leading-none">Bookface</span>
            <span className="wordmark text-[10px] leading-none text-2">by Y Combinator</span>
          </span>
        </a>
      </header>

      <main className="mx-auto max-w-[860px] px-6 pb-20 pt-16 sm:pt-24 lg:pt-28">
        <div className="kicker mb-4">Y Combinator</div>
        <h1 className="text-[48px] leading-[1.02] sm:text-[62px]">Welcome to Bookface.</h1>

        <p className="mt-7 max-w-[720px] text-[18px] font-medium leading-relaxed text-[var(--color-ink)] sm:text-[20px]">
          Bookface is a private community for Y Combinator founders.
        </p>

        <button type="button" onClick={openLogin} className="btn btn-accent btn-lg mt-7">
          Login <ArrowRight size={15} />
        </button>

        <p className="mt-9 max-w-[760px] text-[14px] leading-[1.85] text-2 sm:text-[15px]">
          Bookface helps YC founders connect with one another — imagine a combination of Facebook,
          Quora, and LinkedIn. Bookface also offers tools for fundraising, hiring, meeting scheduling
          and other essential software that founders use during the program. To learn more about
          Y Combinator and how to apply,{" "}
          <a
            href="https://www.ycombinator.com/about"
            target="_blank"
            rel="noreferrer"
            className="link-underline font-medium text-[var(--color-ink)]"
          >
            click here.
          </a>
        </p>

        <div className="mt-14 border-t border-[var(--color-line)] pt-5">
          <p className="text-[12px] font-medium text-[var(--color-ink)]">
            Private by default. Built for founders.
          </p>
          <p className="mt-2 text-[11.5px] leading-relaxed text-3">
            Access is currently limited to approved accounts.
          </p>
        </div>
      </main>

      {showLogin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !loading) setShowLogin(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="bookface-login-title"
            className="relative my-auto w-full max-w-[420px] rounded-xl border border-[var(--color-line)] bg-white p-6 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={() => setShowLogin(false)}
              disabled={loading}
              aria-label="Close sign-in"
              className="absolute right-4 top-4 rounded-md p-1.5 text-3 transition-colors hover:bg-[var(--color-surface)] hover:text-[var(--color-ink)]"
            >
              <X size={17} />
            </button>

            <div className="mb-7 pr-7">
              <div className="kicker mb-2">Member access</div>
              <h2 id="bookface-login-title" className="text-[32px] leading-tight">
                Sign in to Bookface.
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-2">
                Use the email address associated with your Bookface account.
              </p>
            </div>

            <form onSubmit={submit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="bookface-email" className="mb-2 block text-[12px] font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
                  <input
                    id="bookface-email"
                    type="email"
                    autoComplete="username"
                    inputMode="email"
                    autoFocus
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    className="!pl-10 !py-3 !text-[13px]"
                    disabled={step === "password" || loading}
                    required
                  />
                </div>
                {step === "password" && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setPassword("");
                      setError("");
                    }}
                    className="mt-2 inline-flex items-center gap-1 text-[11.5px] text-2 hover:text-[var(--color-ink)]"
                  >
                    <ArrowLeft size={12} /> Change email
                  </button>
                )}
              </div>

              {step === "password" && (
                <div>
                  <label htmlFor="bookface-password" className="mb-2 block text-[12px] font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <LockKeyhole size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
                    <input
                      id="bookface-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="!pl-10 !pr-11 !py-3 !text-[13px]"
                      disabled={loading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
                  {error}
                </p>
              )}

              <button type="submit" className="btn btn-accent btn-lg w-full" disabled={loading}>
                {loading ? "Signing in…" : step === "email" ? "Continue" : "Sign in"}
                {!loading && <ArrowRight size={15} />}
              </button>

              <p className="text-[11.5px] leading-relaxed text-3">
                Bookface is only for YC founders and alumni. Access is currently limited to approved accounts.
              </p>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
