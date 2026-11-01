"use server";

import { cookies, draftMode, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/auth/session";
import { getAuth } from "@/auth/server";
import { authorize } from "@/access/rules";
import { getEnv } from "@/env";
import { createPreviewToken, PREVIEW_COOKIE } from "@/lib/server/preview-token";

export async function startDraftPreviewAction(form: FormData) {
  const principal = await requireAdmin();
  const kind = z.enum(["pages", "projects"]).parse(form.get("kind"));
  const slug = z.string().min(1).max(150).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).parse(form.get("slug"));
  authorize(principal, kind, "read");
  const session = await getAuth().api.getSession({ headers: await headers(), query: { disableCookieCache: true } });
  if (!session) redirect("/admin/login");
  const target = kind === "pages" ? `/admin/preview/${slug}` : `/admin/preview/proyek/${slug}`;
  const env = getEnv();
  (await cookies()).set(PREVIEW_COOKIE, createPreviewToken(target, session.session.id, env.BETTER_AUTH_SECRET), { httpOnly: true, secure: env.NODE_ENV === "production", sameSite: "strict", path: "/admin/preview", maxAge: 300 });
  (await draftMode()).enable();
  redirect(target);
}

export async function exitDraftPreviewAction() {
  await requireAdmin();
  (await draftMode()).disable();
  (await cookies()).set(PREVIEW_COOKIE, "", { path: "/admin/preview", maxAge: 0 });
  redirect("/admin/pages");
}
