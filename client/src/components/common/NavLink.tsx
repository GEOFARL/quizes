"use client";

import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { HTMLProps } from "react";

type Props = LinkProps & HTMLProps<HTMLAnchorElement>;

const NavLink: React.FC<Props> = ({ href, children, className, ...props }) => {
  const pathname = usePathname();
  const isActive = pathname.endsWith(href);
  return (
    <Link
      href={href}
      className={cn(
        isActive
          ? "text-blue-600 font-semibold border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400"
          : "text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
