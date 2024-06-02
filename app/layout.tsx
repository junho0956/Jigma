import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import {Room} from "@/app/Room";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: '--font-work-sans',
  weight: ['400', '600', '700']
});

export const metadata: Metadata = {
  title: "Jigma",
  description: "Jigma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${workSans.className} bg-primary-live`}>
        <Room>
          {children}
        </Room>
      </body>
    </html>
  );
}
