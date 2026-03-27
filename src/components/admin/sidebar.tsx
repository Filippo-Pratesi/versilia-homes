"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Users,
  MessageSquare,
  LogOut,
  Waves,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Proprietà",
    href: "/admin/properties",
    icon: Home,
  },
  {
    label: "Proprietari",
    href: "/admin/owners",
    icon: Users,
  },
  {
    label: "Richieste",
    href: "/admin/requests",
    icon: MessageSquare,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Errore durante il logout.");
        return;
      }
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Errore durante il logout.");
    }
  }

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 min-h-screen bg-[#FAFAF8] border-r border-[#E8DCC8] flex flex-col fixed left-0 top-0 bottom-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#E8DCC8]">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Waves className="w-5 h-5 text-[#4A90A4]" />
          <span className="font-display text-xl font-semibold text-[#2D3436]">
            Versilia Homes
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[#4A90A4] text-white"
                  : "text-[#2D3436] hover:bg-[#E8DCC8]/60"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#E8DCC8]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#2D3436] hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Esci
        </button>
      </div>
    </aside>
  );
}
