import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student & Partner Registration | Abroadroute",
  description:
    "Register free on Abroadroute. Access ✦ Route AI university shortlisting, real-time admission tracking, scholarship matching, and expert counseling support.",
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
