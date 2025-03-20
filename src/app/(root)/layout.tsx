import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";

import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import "../globals.css";

export const metadata: Metadata = {
  title: "clean city",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
