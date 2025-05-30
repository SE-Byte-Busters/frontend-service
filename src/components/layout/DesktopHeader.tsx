import Link from "next/link";
import Image from "next/image";

import { LucideIconName, Icon } from "@/components/Icon";
import { NavLink } from "./DesktopHeaderNavLink";

export default function DesktopHeader({
  navItems,
}: {
  navItems: Array<{
    name: string;
    href: string;
    logo: LucideIconName;
  }>;
}) {
  return (
    <div className="flex items-center justify-between w-full sm:w-auto py-2 sm:py-0">
      {/* Authentication */}
      <div dir="rtl" className="block">
        <Link
          href="/auth/sign-up"
          className="flex items-center bg-accent rounded-lg px-3 py-2
          text-white hover:text-black transition-colors duration-300"
        >
          <Icon name="User" />
          <span className="text-sm hidden md:inline px-2">ورود / ثبت نام</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav dir="rtl" className="flex bg-light rounded-lg p-1 sm:p-2">
        {navItems.map((item) => (
          <NavLink key={item.name} item={item}/>
        ))}
      </nav>

      {/* Logo */}
      <div className="flex items-center space-x-2 sm:space-x-6">
        <span className="text-lg sm:text-xl font-semibold text-black ml-2">
          CleanCity
        </span>
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={64}
            height={64}
            alt="CleanCity Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 bg-light rounded-lg my-2"
            priority
          />
        </Link>
      </div>
    </div>
  );
}
