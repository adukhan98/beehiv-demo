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
    <aside className="hidden md:flex w-64 flex-col border-r border-border/40 bg-background/50 backdrop-blur-xl sticky top-14 h-[calc(100vh-3.5rem)]">
      <div className="flex flex-col gap-2 p-4 h-full">
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "stroke-[2px]" : "stroke-[1.5px]")} />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {!isAdmin && (
          <>
            <div className="my-4 border-t border-border/40" />
            <p className="px-3 text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-1">
              Admin Access
            </p>
            <nav className="flex flex-col gap-1.5">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", isActive ? "stroke-[2px]" : "stroke-[1.5px]")} />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </>
        )}

        <div className="mt-auto px-3 py-4">
          <div className="rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/5 p-4">
            <p className="text-xs font-medium text-primary mb-1">Pro Tip</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Check your campaigns daily to optimize ad performance.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
