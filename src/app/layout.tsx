import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "شهر پاک - Clean City",
  description: "یک برنامه برای مدیریت و نظارت بر پاکیزگی و محیط زیست شهر. با نقشه و اطلاعات لحظه‌ای.",
  keywords: "شهر پاک, نقشه شهر, محیط زیست, مدیریت شهری, پاکیزگی, نظارت بر محیط زیست, برنامه شهری",
  // authors: [{ name: "Next.js Team", url: "https://nextjs.org" }],
  openGraph: {
    type: "website",
    url: "https://shahriar.thetechverse.ir",
    title: "شهر پاک - Clean City",
    description: "یک برنامه برای مدیریت و نظارت بر پاکیزگی و محیط زیست شهر. با نقشه و اطلاعات لحظه‌ای.",
    images: [
      {
        url: "https://shahriar.thetechverse.ir/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Clean City Open Graph Image",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // "All layouts pass through this layout."
    <html lang="fa" dir="rtl" >
      <body>
        {children}
      </body>
    </html >
  );
}
