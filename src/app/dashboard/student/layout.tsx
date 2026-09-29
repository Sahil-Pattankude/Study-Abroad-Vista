import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard & Application Tracker | Abroadroute",
  description:
    "Personalized student dashboard on Abroadroute. Track saved university shortlists, application status, AI counsellor chats, and intake deadlines.",
};

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
