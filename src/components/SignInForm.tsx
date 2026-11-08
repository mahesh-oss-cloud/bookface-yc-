"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

type Props = {
  nextPath: string;
};

export default function SignInForm({ nextPath }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <form onSubmit={submit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="bookface-email" className="block text-[12px] font-medium mb-2">
          Email address
        </label>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-3)]" />
          <input
            id="bookface-email"
            type="email"
            autoComplete="username"
            inputMode="email"
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
            className="text-[11.5px] text-2 mt-2 inline-flex items-center gap-1 hover:text-[var(--color-ink)]"
          >
            <ArrowLeft size={12} /> Change email
          </button>
        )}
      </div>

      {step === "password" && (
        <div>
          <label htmlFor="bookface-password" className="block text-[12px] font-medium mb-2">
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

      <p className="text-[11.5px] text-3 leading-relaxed">
        Access is invite-only. There is no public sign-up or self-service account creation.
      </p>
    </form>
  );
}
