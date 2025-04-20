"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, LucideIconName } from "@/components/Icon";

export function NavLink({
  item,
}: {
  item: {
    name: string;
    href: string;
    logo: LucideIconName;
  };
}) {
  const pathname = usePathname();

  return (
    <Link
    key={item.name}
    href={item.href}
    className={`flex items-center rounded-lg px-2 sm:pl-3 py-1 mx-1
      transition-colors duration-300 hover:text-black active:text-black
      ${pathname === item.href
        ? "bg-primary text-white"
        : "text-gray-500"
      }`}
  >
    <Icon name={item.logo} className="mx-1" />
    <span className="text-xs sm:text-sm">{item.name}</span>
  </Link>
  );
}
