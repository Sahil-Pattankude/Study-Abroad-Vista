import { Metadata } from "next";

export const metadata: Metadata = {
  title: "University Partner Portal | StudyAbroad Vista",
  description:
    "Official university partner portal on StudyAbroad Vista. Manage verified program listings, track student inquiries, and view impression performance analytics.",
};

export default function UniversityPortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
