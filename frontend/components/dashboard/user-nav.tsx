import { useState, useRef, useEffect } from "react";
import { useUser, logout } from "@/hooks/auth";
import Link from "next/link";

export function UserNav() {
  const { email, name } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {name ? name.substring(0, 2).toUpperCase() : "US"}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-[4px] border border-black/10 bg-card p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-[100]">
          <div className="px-3 py-2 border-b border-black/5">
            <p className="text-xs font-bold text-foreground truncate">{name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/dashboard/settings"
              className="group flex w-full items-center rounded-[2px] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Settings
            </Link>
            <Link
              href="/profile"
              className="group flex w-full items-center rounded-[2px] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Public Profile
            </Link>
          </div>
          <div className="py-1 border-t border-black/5">
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="group flex w-full items-center rounded-[2px] px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-red-500 hover:bg-red-50 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
