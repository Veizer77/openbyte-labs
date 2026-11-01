import { cookies, draftMode, headers } from "next/headers";
import { getAuth } from "@/auth/server";
import { getEnv } from "@/env";
import { PREVIEW_COOKIE, verifyPreviewToken } from "@/lib/server/preview-token";
import { startDraftPreviewAction, exitDraftPreviewAction } from "@/actions/admin/preview";
import type { ReactNode } from "react";

export async function DraftPreviewGate({ kind, slug, children }: { kind: "pages" | "projects"; slug: string; children: ReactNode }) {
  const target = kind === "pages" ? `/admin/preview/${slug}` : `/admin/preview/proyek/${slug}`;
  const session = await getAuth().api.getSession({ headers: await headers(), query: { disableCookieCache: true } });
  const token = (await cookies()).get(PREVIEW_COOKIE)?.value ?? "";
  const enabled = (await draftMode()).isEnabled && session && verifyPreviewToken(token, target, session.session.id, getEnv().BETTER_AUTH_SECRET);
  if (!enabled) return <main id="konten" className="mx-auto max-w-xl px-5 py-20"><h1 className="text-2xl font-semibold">Pratinjau draft tersimpan</h1><p className="text-sm leading-7">Preview memerlukan sesi admin dengan MFA dan izin baca. Akses berlaku lima menit dan terikat pada sesi serta konten ini.</p><form action={startDraftPreviewAction}><input type="hidden" name="kind" value={kind} /><input type="hidden" name="slug" value={slug} /><button className="primary-button min-h-11" type="submit">Buka preview draft</button></form></main>;
  return <><form action={exitDraftPreviewAction} className="fixed bottom-4 right-4 z-[100] rounded-xl border border-amber-300 bg-amber-50 p-3 shadow-sm"><button type="submit" className="secondary-button min-h-11">Keluar Draft Mode</button></form>{children}</>;
}
