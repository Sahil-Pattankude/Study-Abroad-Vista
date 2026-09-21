/**
 * Cookie and Supabase Backend persistence for saved university shortlists.
 * Cookie Name: `vista_saved_shortlist`.
 */

const COOKIE_NAME = "vista_saved_shortlist";
const MAX_AGE_SECONDS = 365 * 24 * 60 * 60; // 1 year

/**
 * Parses all browser cookies into a key-value record.
 */
function parseCookies(): Record<string, string> {
  if (typeof document === "undefined") return {};
  const cookies: Record<string, string> = {};
  const cookieStr = document.cookie || "";

  cookieStr.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (name) {
      const trimmedName = name.trim();
      const value = rest.join("=").trim();
      cookies[trimmedName] = decodeURIComponent(value);
    }
  });

  return cookies;
}

/**
 * Reads the list of shortlisted university slugs from cookies.
 * Automatically migrates legacy localStorage data into cookies if present.
 */
export function getSavedShortlist(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const cookies = parseCookies();
    let cookieVal = cookies[COOKIE_NAME];

    // If cookie exists and is valid JSON array
    if (cookieVal) {
      const parsed = JSON.parse(cookieVal);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    // Legacy migration check: check if user had items in localStorage
    const legacyStorage = localStorage.getItem("vista_saved_shortlist");
    if (legacyStorage) {
      const parsed = JSON.parse(legacyStorage);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setSavedShortlist(parsed, { silent: true });
        localStorage.removeItem("vista_saved_shortlist");
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Failed to parse shortlist cookie:", err);
  }

  return [];
}

/**
 * Writes the list of university slugs to the `vista_saved_shortlist` cookie.
 * Options: { silent?: boolean } - if true, suppresses dispatching the update event.
 */
export function setSavedShortlist(
  slugs: string[],
  options?: { silent?: boolean },
): void {
  if (typeof document === "undefined") return;

  try {
    const uniqueSlugs = Array.from(new Set(slugs.filter(Boolean)));
    const previousSlugs = getSavedShortlist();

    // Check if content actually changed
    const hasChanged =
      uniqueSlugs.length !== previousSlugs.length ||
      uniqueSlugs.some((s) => !previousSlugs.includes(s));

    const jsonStr = encodeURIComponent(JSON.stringify(uniqueSlugs));
    const isSecure = window.location.protocol === "https:";

    document.cookie = `${COOKIE_NAME}=${jsonStr}; path=/; max-age=${MAX_AGE_SECONDS}; SameSite=Lax${
      isSecure ? "; Secure" : ""
    }`;

    // Clean up any legacy localStorage entry
    try {
      localStorage.removeItem("vista_saved_shortlist");
    } catch {
      // ignore
    }

    // Dispatch global event only if explicitly not silent and data has changed
    if (!options?.silent && hasChanged) {
      window.dispatchEvent(
        new CustomEvent("vista_shortlist_updated", { detail: uniqueSlugs }),
      );
    }
  } catch (err) {
    console.warn("Failed to set shortlist cookie:", err);
  }
}

/**
 * Adds a university slug to the cookie shortlist and syncs to Supabase backend if user is logged in.
 */
export function addToShortlist(
  slug: string,
  user?: { id?: string; email?: string } | null,
): string[] {
  if (!slug) return getSavedShortlist();
  const current = getSavedShortlist();
  let updated = current;
  if (!current.includes(slug)) {
    updated = [...current, slug];
    setSavedShortlist(updated);
  }

  // If user is authenticated, persist to Supabase backend
  if (user && (user.id || user.email)) {
    fetch("/api/shortlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        slug,
      }),
    }).catch((err) => console.warn("Backend shortlist add error:", err));
  }

  return updated;
}

/**
 * Removes a university slug from the cookie shortlist and removes from Supabase backend if user is logged in.
 */
export function removeFromShortlist(
  slug: string,
  user?: { id?: string; email?: string } | null,
): string[] {
  if (!slug) return getSavedShortlist();
  const current = getSavedShortlist();
  const updated = current.filter((s) => s !== slug);
  setSavedShortlist(updated);

  // If user is authenticated, remove from Supabase backend
  if (user && (user.id || user.email)) {
    fetch("/api/shortlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        slug,
      }),
    }).catch((err) => console.warn("Backend shortlist remove error:", err));
  }

  return updated;
}

/**
 * Checks whether a given university slug is shortlisted in cookies.
 */
export function isUniversityShortlisted(slug: string): boolean {
  if (!slug) return false;
  const current = getSavedShortlist();
  return current.includes(slug);
}

/**
 * Syncs guest cookie shortlists with the Supabase backend upon signup or login.
 * Merges backend + cookie lists and updates both silently without triggering loops.
 */
export async function syncShortlistWithBackend(user: {
  id?: string;
  email?: string;
}): Promise<string[]> {
  if (!user || (!user.id && !user.email)) return getSavedShortlist();

  const cookieSlugs = getSavedShortlist();

  try {
    const res = await fetch("/api/shortlist/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        slugs: cookieSlugs,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.shortlists)) {
        setSavedShortlist(data.shortlists, { silent: true });
        return data.shortlists;
      }
    }
  } catch (err) {
    console.warn("Shortlist sync with backend failed:", err);
  }

  return cookieSlugs;
}

/**
 * Fetches user shortlists directly from Supabase backend and updates cookies silently without triggering loops.
 */
export async function fetchBackendShortlist(user: {
  id?: string;
  email?: string;
}): Promise<string[]> {
  if (!user || (!user.id && !user.email)) return getSavedShortlist();

  try {
    const query = user.id
      ? `userId=${user.id}`
      : `email=${encodeURIComponent(user.email || "")}`;
    const res = await fetch(`/api/shortlist?${query}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.shortlists)) {
        setSavedShortlist(data.shortlists, { silent: true });
        return data.shortlists;
      }
    }
  } catch (err) {
    console.warn("Fetch backend shortlist failed:", err);
  }

  return getSavedShortlist();
}
