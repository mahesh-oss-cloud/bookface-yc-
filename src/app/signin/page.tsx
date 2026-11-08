import Link from "next/link";
import SignInForm from "@/components/SignInForm";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.startsWith("/signin")
      ? rawNext
      : "/";

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto grid min-h-screen max-w-[1240px] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
          <Link href="/signin" className="inline-flex w-fit items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/yc-logo.svg" alt="" className="h-8 w-8 rounded-[6px]" />
            <span className="wordmark text-[22px]">Bookface</span>
          </Link>

          <div className="max-w-[540px] py-14 lg:py-0">
            <div className="kicker mb-4">A private founder network</div>
            <h1 className="text-[42px] leading-[1.02] sm:text-[54px] lg:text-[62px]">
              Build with people who understand the journey.
            </h1>
            <p className="mt-6 max-w-[460px] text-[14px] leading-relaxed text-2 sm:text-[15px]">
              A focused space for founders and alumni to find one another, exchange practical advice,
              and learn from the people building companies.
            </p>

            <div className="mt-9 grid max-w-[460px] grid-cols-2 gap-3">
              <div className="card p-4">
                <div className="kicker">Directory</div>
                <div className="mt-2 text-[13px] font-medium">Companies and founders</div>
                <div className="mt-1 text-[11.5px] text-2">Search by batch, industry, and location.</div>
              </div>
              <div className="card p-4">
                <div className="kicker">Community</div>
                <div className="mt-2 text-[13px] font-medium">Advice from peers</div>
                <div className="mt-1 text-[11.5px] text-2">Conversations, messages, and resources.</div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-3">
            Private access · No public registration
          </p>
        </section>

        <section className="flex items-center justify-center border-t border-[var(--color-line)] bg-white px-6 py-12 sm:px-10 lg:border-l lg:border-t-0">
          <div className="w-full max-w-[390px]">
            <div className="mb-8">
              <div className="kicker mb-2">Member sign-in</div>
              <h2 className="text-[29px]">Welcome back.</h2>
              <p className="mt-2 text-[13px] text-2">
                Use the email address associated with your Bookface account.
              </p>
            </div>

            <div className="card p-5 sm:p-6">
              <SignInForm nextPath={nextPath} />
            </div>

            <div className="mt-5 rounded-lg border border-[var(--color-line)] bg-[var(--color-surface)] p-4">
              <div className="flex items-center gap-2">
                <span className="chip chip-accent">Email unverified</span>
                <span className="text-[11px] text-2">Account status</span>
              </div>
              <p className="mt-2 text-[11.5px] leading-relaxed text-2">
                This account has not completed email verification. Signing in does not, by itself,
                confirm YC founder or alumni status.
              </p>
              <a
                href="https://www.ycombinator.com/verify"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-2 inline-flex text-[11.5px] font-medium"
              >
                YC founder verification
              </a>
            </div>

            <p className="mt-6 text-center text-[11px] leading-relaxed text-3">
              Access is limited to approved accounts. Contact the administrator if your access
              should be enabled.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
