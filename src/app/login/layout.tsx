import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authorized Sign In | StudyAbroad Vista",
  description:
    "Secure sign-in for StudyAbroad Vista portals. Access student shortlists, B2B lead marketplace, university listings dashboard, and AI counsellor history.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
