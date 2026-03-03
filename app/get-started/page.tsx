import { redirect } from "next/navigation";

type GetStartedPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

function sanitizeRedirectPath(path: string | null | undefined) {
  if (!path) {
    return "/";
  }

  if (!path.startsWith("/") || path.startsWith("//")) {
    return "/";
  }

  return path;
}

export default async function GetStartedPage({
  searchParams,
}: GetStartedPageProps) {
  const params = await searchParams;
  const redirectPath = sanitizeRedirectPath(params.redirect);
  redirect(`/auth?mode=signin&redirect=${encodeURIComponent(redirectPath)}`);
}
