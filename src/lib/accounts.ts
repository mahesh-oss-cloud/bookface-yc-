export type BookfaceAccount = {
  email: string;
  passwordHash: string;
  founderId?: string;
  name?: string;
  linkedinUrl?: string;
};

function normalizeAccount(value: unknown): BookfaceAccount | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Record<string, unknown>;
  const email =
    typeof candidate.email === "string" ? candidate.email.trim().toLowerCase() : "";
  const passwordHash =
    typeof candidate.passwordHash === "string" ? candidate.passwordHash : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !passwordHash) {
    return null;
  }

  return {
    email,
    passwordHash,
    founderId: typeof candidate.founderId === "string" ? candidate.founderId : undefined,
    name: typeof candidate.name === "string" ? candidate.name : undefined,
    linkedinUrl: typeof candidate.linkedinUrl === "string" ? candidate.linkedinUrl : undefined,
  };
}

/**
 * The JSON registry allows each approved member to have a separate email,
 * password hash and founder profile. Keep this variable server-side and mark
 * it sensitive in Vercel. Legacy single-account env vars remain supported so
 * the original account can continue signing in during onboarding.
 */
export function getBookfaceAccounts(): BookfaceAccount[] {
  const accounts = new Map<string, BookfaceAccount>();

  const legacyEmail = process.env.BOOKFACE_LOGIN_EMAIL?.trim().toLowerCase();
  const legacyHash = process.env.BOOKFACE_LOGIN_PASSWORD_HASH;
  if (legacyEmail && legacyHash) {
    accounts.set(legacyEmail, {
      email: legacyEmail,
      passwordHash: legacyHash,
      founderId: process.env.BOOKFACE_MEMBER_FOUNDER_ID?.trim() || "mahesh-bal",
      name: "Mahesh Bal",
      linkedinUrl: "https://in.linkedin.com/in/mahesh-bal",
    });
  }

  const rawRegistry = process.env.BOOKFACE_ACCOUNTS_JSON;
  if (rawRegistry) {
    try {
      const parsed: unknown = JSON.parse(rawRegistry);
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          const account = normalizeAccount(item);
          if (account) accounts.set(account.email, account);
        }
      }
    } catch {
      // Invalid registry entries are ignored; the legacy account remains available.
    }
  }

  return [...accounts.values()];
}

export function getBookfaceAccount(email: string): BookfaceAccount | null {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return null;
  return getBookfaceAccounts().find((account) => account.email === normalizedEmail) ?? null;
}
