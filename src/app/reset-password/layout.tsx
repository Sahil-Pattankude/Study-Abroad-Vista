import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set New Password | StudyAbroad Vista",
  description:
    "Set a new secure password for your StudyAbroad Vista account. Protect your application shortlists, AI counsellor history, and portal dashboard access.",
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
