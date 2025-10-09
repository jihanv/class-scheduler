import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import InformationDisplay from "@/components/new/information-display";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Class Schedule",
  description: "Manage You Class Schedule",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-scroll`}
      >
        <main className="flex flex-row w-full">

          <div className="flex-[0.75] sticky top-0 h-screen overflow-auto">
            <InformationDisplay />
          </div>
          <div className="flex-2 flex-col m-5 gap-5 p-10">{children}</div>


        </main>
      </body>
    </html>
  );
}
