import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Set New Password | Abroadroute",
  description:
    "Set a new secure password for your Abroadroute account. Protect your application shortlists, ✦ Route AI counsellor history, and portal dashboard access.",
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
