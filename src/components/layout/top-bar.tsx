"use client";

import { useState } from "react";
import { Bell, Menu, X, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/mock-data";

const navItems = ["Feed", "Tracker", "Settings"] as const;

export function TopBar() {
  const [activeNav, setActiveNav] = useState<string>("Feed");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const initials = mockUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <header className="h-14 border-b border-border bg-[var(--autoapply-bg)] flex items-center px-4 gap-4 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-md bg-[var(--autoapply-primary)] flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sm text-foreground">AutoApply</span>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-1 ml-4">
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => setActiveNav(item)}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm transition-colors",
              activeNav === item
                ? "bg-[var(--autoapply-primary)] text-white font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Search */}
      <div className="flex-1 max-w-sm hidden md:block ml-auto">
        <Input
          placeholder="Search jobs..."
          className="h-8 bg-muted border-border text-sm"
        />
      </div>

      {/* Right side */}
      <div className="ml-auto md:ml-0 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <Bell className="w-4 h-4" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-[var(--autoapply-primary)] text-white text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Mobile menu toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 md:hidden"
          onClick={() => setMobileMenuOpen((o) => !o)}
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-[var(--autoapply-bg)] border-b border-border px-4 py-3 flex flex-col gap-1 md:hidden">
          <Input placeholder="Search jobs..." className="h-8 bg-muted border-border text-sm mb-2" />
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => { setActiveNav(item); setMobileMenuOpen(false); }}
              className={cn(
                "px-3 py-2 rounded-md text-sm text-left transition-colors",
                activeNav === item
                  ? "bg-[var(--autoapply-primary)] text-white font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
