"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "buyer" | "university" | "admin";

export interface AuthUser {
  id?: string;
  email: string;
  name?: string;
  role: UserRole;
  phone?: string;
  organization?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole, name?: string, id?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 1. Check local session cache first
    try {
      const stored = localStorage.getItem("vista_user_session");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    // Public pages must become interactive before loading the auth SDK. The
    // cache above preserves the signed-in experience; live reconciliation is
    // deferred until the visitor actually interacts with the page.
    setIsLoading(false);
    let cancelled = false;
    const reconcileSession = async () => {
      let supabase: typeof import("@/lib/supabase/client").supabase;
      try {
        ({ supabase } = await import("@/lib/supabase/client"));
      } catch {
        return;
      }
      if (cancelled) return;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (cancelled) return;
        if (session?.user) {
          const role = (session.user.user_metadata?.role as UserRole) || "student";
          const currentUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || "",
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0],
            role: role,
          };
          setUser(currentUser);
          localStorage.setItem("vista_user_session", JSON.stringify(currentUser));
        }
      } catch {
        // A failed reconciliation must not disturb the cached public session.
      }
    };

    window.addEventListener("pointerdown", reconcileSession, { once: true, passive: true });
    window.addEventListener("keydown", reconcileSession, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", reconcileSession);
      window.removeEventListener("keydown", reconcileSession);
    };
  }, []);

  const login = (email: string, role: UserRole = "student", name?: string, id?: string) => {
    const newUser: AuthUser = {
      id,
      email,
      role,
      name: name || email.split("@")[0],
    };
    setUser(newUser);
    try {
      localStorage.setItem("vista_user_session", JSON.stringify(newUser));
    } catch {
      // ignore
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("vista_user_session");
    } catch {
      // ignore
    }
    import("@/lib/supabase/client")
      .then(({ supabase }) => supabase.auth.signOut())
      .catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isLoggedIn: false,
      isLoading: false,
      login: () => {},
      logout: () => {},
    };
  }
  return context;
}
