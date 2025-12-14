"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Home,
  CheckSquare,
  Tag,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Tags", href: "/tags", icon: Tag },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col sticky top-16 h-screen backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className=" flex items-center justify-between w-full p-2 ">
          {collapsed ? (
            <></>
          ) : (
            <span className="text-wrap italic bold">Kono Dio Da</span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-md hover:bg-accent/5 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="mt-5 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-accent/10 text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "shrink-0 h-5 w-5",
                      collapsed ? "mx-auto" : "mr-3"
                    )}
                  />
                  {!collapsed && item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
