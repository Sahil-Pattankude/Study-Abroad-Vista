import type { Metadata, Viewport } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { HomeModalProvider } from "@/components/home/HomeClientContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#102C57",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default:
      "StudyAbroad Vista | Authoritative International Education Discovery Portal",
    template: "%s | StudyAbroad Vista",
  },
  description:
    "Compare 19 global destinations and 8 career disciplines for Indian students. Discover tuition in INR, post-study visas, and verified university rankings.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <HomeModalProvider>{children}</HomeModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
