"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { clearSession } from "@/lib/services";

const navItems = [
  { href: "/team", label: "Nhóm Sinh viên" },
  { href: "/lecturer", label: "Giảng viên" },
  { href: "/schedule", label: "Lịch Bảo vệ" },
  { href: "/moderator", label: "Quản trị viên" },
];

const ROLE_LABEL: Record<string, string> = {
  Moderator: "Quản trị",
  Lecturer: "Giảng viên",
  Student: "Sinh viên",
};

const ROLE_COLOR: Record<string, string> = {
  Moderator: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  Lecturer: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  Student: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Re-read cookies on every navigation (picks up session after login)
  useEffect(() => {
    setUserName(getCookie("auth_name"));
    setUserRole(getCookie("auth_role"));
  }, [pathname]);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  return (
    <div className="relative min-h-screen pb-10">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2 group">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                <path d="M2 4C2 2.9 2.9 2 4 2h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M5 8h6M5 5.5h4M5 10.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              Capstone Review Hub
            </span>
          </Link>

          {/* Nav links */}
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User info + logout */}
          {userName && (
            <div className="flex shrink-0 items-center gap-2.5">
              <div className="flex flex-col items-end leading-none">
                <span className="text-sm font-medium text-foreground">{userName}</span>
                {userRole && (
                  <span
                    className={cn(
                      "mt-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                      ROLE_COLOR[userRole] ?? "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {ROLE_LABEL[userRole] ?? userRole}
                  </span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container py-8">{children}</main>
    </div>
  );
}
