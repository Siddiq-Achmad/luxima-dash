import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { baseUrl } from "@/lib/constants";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const PlusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template:
      "%s - LUXIMA.ID | Creative Studio, Studio Photography, Web Dev & Digital Marketing",
    default:
      "LUXIMA.ID | Wedding Industry, Photography, Pengembangan Teknologi & Bisnis Digital",
  },
  description:
    "LUXIMA.ID | Wedding Industry, Photography, Pengembangan Teknologi & Bisnis Digital. Mulai Bangun Bisnis Wedding yang Lebih Profesional",
  metadataBase: baseUrl,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${PlusJakartaSans.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
