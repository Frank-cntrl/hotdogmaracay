import { useEffect, useState } from "react";

type Locale = "es" | "en";

interface Props {
  currentLocale: Locale;
}

export default function LangToggle({ currentLocale }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      localStorage.setItem("preferredLocale", currentLocale);
    } catch {
      // localStorage unavailable; ignore
    }
  }, [currentLocale]);

  const switchTo = (locale: Locale) => {
    const target = locale === "es" ? "/" : "/en/";
    const hash = window.location.hash || "";
    try {
      localStorage.setItem("preferredLocale", locale);
    } catch {
      // ignore
    }
    window.location.href = target + hash;
  };

  return (
    <div className="inline-flex items-center rounded-full border border-white/20 text-xs font-semibold" role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => switchTo("es")}
        aria-pressed={currentLocale === "es"}
        className={`px-3 py-1 rounded-full transition ${currentLocale === "es" ? "bg-accent-orange text-black" : "text-white/70"}`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={currentLocale === "en"}
        className={`px-3 py-1 rounded-full transition ${currentLocale === "en" ? "bg-accent-orange text-black" : "text-white/70"}`}
      >
        EN
      </button>
      {/* avoid hydration flash by deferring class swap until mounted */}
      <span className="sr-only">{mounted ? "" : "loading"}</span>
    </div>
  );
}
