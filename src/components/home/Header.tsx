import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";
import { LucideIconName, Icon } from "@/components/Icon";

const navItems: Array<{
  name: string;
  href: string;
  logo: LucideIconName;
}> = [
  { name: "صفحه اصلی", href: "/", logo: "Home" },
  { name: "گزارشات اخیر", href: "/reports", logo: "ScrollText" },
  { name: "نقشه", href: "/map", logo: "MapPin" },
  { name: "تابلوی بهترین‌ها", href: "/leaderboard", logo: "Medal" },
];

export default function Header() {
  return (
    <header className="bg-white/60 shadow-md fixed top-0 left-0 w-full z-20 backdrop-blur">
      <div className="flex flex-col sm:flex-row justify-between items-center container mx-auto px-4 sm:px-6 gap-2 sm:gap-0">
        {/* Desktop view */}
        <div className="hidden sm:block w-full">
          <DesktopHeader navItems={navItems} />
        </div>

        {/* Mobile view */}
        <div className="sm:hidden w-full">
          <Suspense fallback={<MobileHeaderFallback />}>
            <MobileHeader navItems={navItems} />
          </Suspense>
        </div>
      </div>
    </header>
  );
}

function MobileHeaderFallback() {
  return (
    <div className="flex items-center justify-between w-full py-1">
      <button className="p-2 rounded-lg text-gray-300">
        <Icon name="Menu" className="text-2xl" />
      </button>
      <Link href="/" className="flex items-center">
        <Image
          src="/images/logo.png"
          width={64}
          height={64}
          alt="CleanCity Logo"
          className="h-12 w-12 bg-light rounded-lg"
          priority
        />
      </Link>
      <Link
        href="/auth/sign-up"
        className="p-2 bg-accent rounded-lg"
      >
        <Icon name="User" className="text-2xl" />
      </Link>
    </div>
  );
}
