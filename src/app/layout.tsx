import type { Metadata } from "next";
import { Geist, Lora } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Child & Adolescent Psychiatry Research Dashboard",
  description:
    "Latest research papers from leading journals in child and adolescent psychiatry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${lora.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
