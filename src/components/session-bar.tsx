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

export function Brand() {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="FaMed Zahnmedizin – Startseite">
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground"
      >
        Z
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight">FaMed Zahnmedizin</span>
        <span className="block text-xs text-muted">Prüfungstraining</span>
      </span>
    </Link>
  );
}

/**
 * Kopfzeile mit Marke und Anmeldestatus. Prüft regelmäßig, ob die Sitzung noch gilt –
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

  const showSession = !onLoginPage && info && info.rolle !== "offen";

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Brand />
        {showSession && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="text-muted">
              {info.rolle === "master" ? (
                <>
                  Angemeldet mit <strong className="text-foreground">Master-Code</strong>
                </>
              ) : (
                <>
                  <strong className="text-foreground">{info.name}</strong> · gültig bis {formatDateTime(info.ablauf)}
                </>
              )}
            </span>
            {info.rolle === "master" && (
              <Link href="/admin" className="font-medium text-accent hover:underline">
                Verwaltung
              </Link>
            )}
            <button type="button" onClick={() => void logout()} className="text-muted hover:text-foreground">
              Abmelden
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
