"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { LOGGED_OUT_EVENT, formatDateTime } from "@/lib/access/client-events";

type SessionInfo =
  | { rolle: "nutzer"; name: string; ablauf: string }
  | { rolle: "master" }
  | { rolle: "offen" };

const CHECK_INTERVAL_MS = 60_000;

/**
 * Kopfzeile mit Anmeldestatus. Prüft regelmäßig, ob die Sitzung noch gilt –
 * so wird ein Gerät auch ohne Klick abgemeldet, wenn der Code woanders benutzt wurde.
 */
export function SessionBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [info, setInfo] = useState<SessionInfo | null>(null);
  const onLoginPage = pathname.startsWith("/zugang");

  const goToLogin = useCallback(
    (grund: string) => {
      setInfo(null);
      router.replace(`/zugang?grund=${encodeURIComponent(grund)}`);
    },
    [router],
  );

  const check = useCallback(async () => {
    try {
      const res = await fetch("/api/sitzung", { cache: "no-store" });
      if (res.status === 401) {
        const data = (await res.json().catch(() => ({}))) as { grund?: string };
        goToLogin(data.grund ?? "keine-anmeldung");
        return;
      }
      if (res.ok) setInfo((await res.json()) as SessionInfo);
    } catch {
      // Netzwerkfehler: beim nächsten Mal erneut prüfen
    }
  }, [goToLogin]);

  useEffect(() => {
    if (onLoginPage) return;
    const first = setTimeout(() => void check(), 0);
    const interval = setInterval(() => void check(), CHECK_INTERVAL_MS);
    const onFocus = () => void check();
    const onLoggedOut = (e: Event) => goToLogin(String((e as CustomEvent).detail));
    window.addEventListener("focus", onFocus);
    window.addEventListener(LOGGED_OUT_EVENT, onLoggedOut);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener(LOGGED_OUT_EVENT, onLoggedOut);
    };
  }, [onLoginPage, check, goToLogin]);

  async function logout() {
    await fetch("/api/zugang", { method: "DELETE" }).catch(() => undefined);
    goToLogin("abgemeldet");
  }

  if (onLoginPage || !info || info.rolle === "offen") return null;

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-sm">
        <span className="text-muted">
          {info.rolle === "master" ? (
            <>
              Angemeldet mit <strong className="text-foreground">Master-Code</strong>
            </>
          ) : (
            <>
              Angemeldet als <strong className="text-foreground">{info.name}</strong> · gültig bis{" "}
              {formatDateTime(info.ablauf)}
            </>
          )}
        </span>
        <span className="flex items-center gap-4">
          {info.rolle === "master" && (
            <>
              <Link href="/" className="hover:text-accent">
                Training
              </Link>
              <Link href="/admin" className="font-medium text-accent hover:underline">
                Verwaltung
              </Link>
            </>
          )}
          <button type="button" onClick={() => void logout()} className="text-muted hover:text-foreground">
            Abmelden
          </button>
        </span>
      </div>
    </div>
  );
}
