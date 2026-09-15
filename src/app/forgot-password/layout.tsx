import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Account Password | StudyAbroad Vista",
  description:
    "Reset your StudyAbroad Vista account password. Secure recovery link sent instantly to registered Indian student, consultant, or university partner email.",
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
