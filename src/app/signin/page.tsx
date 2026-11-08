import SignInForm from "@/components/SignInForm";

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const rawNext = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath =
    rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") && !rawNext.startsWith("/signin")
      ? rawNext
      : "/profile";

  return <SignInForm nextPath={nextPath} />;
}
