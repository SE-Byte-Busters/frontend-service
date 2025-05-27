import type { Metadata } from "next";
// import { Geist, Geist_Mono, Vazirmatn } from "next/font/google";

export const metadata: Metadata = {
  title: "نقشه هوشمند ایران | مکان‌یابی دقیق و سریع",
  description: "با نقشه هوشمند ما مکان‌های موردنظر خود را به‌سرعت جستجو و بررسی کنید.",
  keywords: ["نقشه", "مکان‌یابی", "نقشه ایران", "جستجوی مکان", "ایران مپ"],
  robots: "index, follow",
  authors: [{ name: "Amirhossein", url: "https://yourwebsite.com" }],
  openGraph: {
    title: "نقشه هوشمند ایران",
    description: "جستجوی سریع و دقیق روی نقشه ایران",
    url: "https://yourwebsite.com",
    siteName: "Iran Smart Map",
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <section>{children}</section>
    </main>
  );
}
