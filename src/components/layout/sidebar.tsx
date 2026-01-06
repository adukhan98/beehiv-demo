"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  Megaphone,
  Image,
  BarChart3,
} from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
}

const creatorNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Issues",
    href: "/issues",
    icon: FileText,
  },
  {
    title: "Monetization",
    href: "/boundaries",
    icon: Settings,
  },
];

const adminNavItems = [
  {
    title: "Admin Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Advertisers",
    href: "/admin/advertisers",
    icon: Users,
  },
  {
    title: "Campaigns",
    href: "/admin/campaigns",
    icon: Megaphone,
  },
  {
    title: "Creatives",
    href: "/admin/creatives",
    icon: Image,
  },
];

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const pathname = usePathname();

  const navItems = isAdmin ? adminNavItems : creatorNavItems;

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background">
      <div className="flex flex-col gap-2 p-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>

        {!isAdmin && (
          <>
            <div className="my-4 border-t" />
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Admin
            </p>
            <nav className="flex flex-col gap-1">
              {adminNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>
    </aside>
  );
}
