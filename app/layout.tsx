import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"; // Removed unused fonts
import "./globals.css";
import { baseUrl } from "@/lib/constants";
import { Toaster } from "@/components/ui/sonner"; // Added Sonner toaster

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Luxima Dashboard",
    default: "Luxima Dashboard - Manage Your Business",
  },
  description: "Comprehensive dashboard for managing bookings, invoices, team, and organization settings.",
  metadataBase: baseUrl,
  robots: "noindex, nofollow", // Default to private
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
