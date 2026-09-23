"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Bot, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

import { AICounsellorDrawer } from "@/components/ai/AICounsellorDrawer";
import { LeadModal } from "@/components/lead/LeadModal";
import { SearchDialog } from "@/components/search/SearchDialog";
import { AuthRequiredModal } from "@/components/auth/AuthRequiredModal";

interface AuthModalConfig {
  title?: string;
  description?: string;
}

interface HomeModalsContextType {
  openSearch: () => void;
  openAICounsellor: (initialQuery?: string) => void;
  openLeadModal: (countryOrProgram?: string) => void;
  openAuthModal: (config?: AuthModalConfig) => void;
}

const HomeModalsContext = createContext<HomeModalsContextType | null>(null);

export function useHomeModals() {
  const ctx = useContext(HomeModalsContext);
  if (!ctx) {
    return {
      openSearch: () => {},
      openAICounsellor: (_query?: string) => {},
      openLeadModal: () => {},
      openAuthModal: () => {},
    };
  }
  return ctx;
}

export function HomeModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isStudioOrAdmin = Boolean(
    pathname?.startsWith("/studio") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/portal"),
  );
  const { isLoggedIn } = useAuth();
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | undefined>();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<
    AuthModalConfig | undefined
  >();
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [selectedCountryName, setSelectedCountryName] = useState("Germany");

  const openAICounsellor = (initialQuery?: string) => {
    if (initialQuery) {
      setAiInitialQuery(initialQuery);
    }
    setAiDrawerOpen(true);
  };

  const openLeadModal = (countryOrProgram?: unknown) => {
    if (typeof countryOrProgram === "string") {
      setSelectedCountryName(countryOrProgram);
    } else {
      setSelectedCountryName("germany");
    }
    setLeadModalOpen(true);
  };

  const openSearch = () => setSearchDialogOpen(true);
  const openAuthModal = (config?: AuthModalConfig) => {
    setAuthModalConfig(config);
    setAuthModalOpen(true);
  };

  return (
    <HomeModalsContext.Provider
      value={{
        openSearch,
        openAICounsellor,
        openLeadModal,
        openAuthModal,
      }}
    >
      {children}

      {/* Sticky Mobile CTA Bar - Hidden on /studio, /admin, /portal */}
      {!isStudioOrAdmin && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white p-3 shadow-lg sm:hidden">
          <button
            onClick={() => openLeadModal()}
            className="w-full rounded-xl bg-[#EA5C2B] py-3 text-center text-xs font-bold text-white shadow-lg transition active:scale-98"
          >
            Get Free Counselling →
          </button>
        </div>
      )}

      {/* Floating AI Counsellor Button - Hidden on /studio, /admin, /portal */}
      {!isStudioOrAdmin && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => openAICounsellor()}
            aria-label="Talk to AI counsellor"
            className="group flex items-center gap-2 rounded-full bg-[#102C57] p-3 text-white shadow-2xl transition hover:scale-105 hover:bg-[#0c2242]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white">
              <Bot className="h-5 w-5 text-[#EA5C2B]" />
            </div>
            <span className="pr-2 text-xs font-bold hidden sm:inline flex items-center gap-1.5">
              Talk to AI Counsellor
              {!isLoggedIn && <Lock className="h-3 w-3 text-amber-300" />}
            </span>
            <span className="relative flex h-2.5 w-2.5 sm:hidden">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
          </button>
        </div>
      )}

      {/* Slide-over AI Counsellor Drawer */}
      {aiDrawerOpen && (
        <AICounsellorDrawer
          isOpen={aiDrawerOpen}
          onClose={() => setAiDrawerOpen(false)}
          onOpenLeadModal={() => setLeadModalOpen(true)}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          initialQuery={aiInitialQuery}
        />
      )}

      {/* Auth Required Modal */}
      {authModalOpen && (
        <AuthRequiredModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          title={authModalConfig?.title}
          description={authModalConfig?.description}
        />
      )}

      {/* Search Modal */}
      {searchDialogOpen && (
        <SearchDialog
          isOpen={searchDialogOpen}
          onClose={() => setSearchDialogOpen(false)}
        />
      )}

      {/* Lead Capture Modal */}
      {leadModalOpen && (
        <LeadModal
          isOpen={leadModalOpen}
          onClose={() => setLeadModalOpen(false)}
          defaultCountry={selectedCountryName}
        />
      )}
    </HomeModalsContext.Provider>
  );
}

export function LeadTriggerButton({
  children,
  country,
  className,
}: {
  children: ReactNode;
  country?: string;
  className?: string;
}) {
  const { openLeadModal } = useHomeModals();
  return (
    <button onClick={() => openLeadModal(country)} className={className}>
      {children}
    </button>
  );
}

export function AICounsellorTriggerButton({
  children,
  initialQuery,
  className,
}: {
  children: ReactNode;
  initialQuery?: string;
  className?: string;
}) {
  const { openAICounsellor } = useHomeModals();
  return (
    <button
      onClick={() => openAICounsellor(initialQuery)}
      className={className}
    >
      {children}
    </button>
  );
}
