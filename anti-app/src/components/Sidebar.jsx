import React, { useState } from "react";
import {
  PanelLeftClose,
  PanelLeft,
  Plus,
  Layers,
  Component,
  Code2,
  Briefcase,
  LogOut,
} from "lucide-react";
import { supabase } from "../supabaseClient";

const NAV_ITEMS = [
  { id: "progetti", label: "Progetti", icon: Layers },
  { id: "artifact", label: "Artifact", icon: Component },
  { id: "codice", label: "Codice", icon: Code2, badge: "Aggiorna" },
  { id: "personalizza", label: "Personalizza", icon: Briefcase },
];

export default function Sidebar({
  activeItem = null,
  onNavigate = () => {},
  onNew = () => {},
  userEmail = "",
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`h-screen bg-[#111113] text-[#ECECEC] flex flex-col
        border-r border-white/5 transition-all duration-300 ease-out
        ${collapsed ? "w-[64px]" : "w-[260px]"}`}
    >
      <div className="flex items-center justify-between px-4 h-14 shrink-0">
        {!collapsed && (
          <span className="font-serif text-lg tracking-tight select-none">
            Anti
          </span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1.5 rounded-md text-[#9B9B9B] hover:text-white hover:bg-white/8 transition-colors duration-150"
          aria-label={collapsed ? "Espandi sidebar" : "Comprimi sidebar"}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <div className="px-3 mb-2">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 rounded-lg bg-white/10 hover:bg-white/15 transition-colors duration-150 px-3 py-2 text-sm font-medium"
        >
          <Plus size={16} />
          {!collapsed && <span>Nuovo</span>}
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon, badge }) => {
          const isActive = activeItem === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 group
                ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-[#C7C7C7] hover:bg-white/6 hover:text-white"
                }`}
            >
              <Icon
                size={17}
                className="text-[#9B9B9B] group-hover:text-white transition-colors duration-150 shrink-0"
              />
              {!collapsed && (
                <>
                  <span className="truncate">{label}</span>
                  {badge && (
                    <span className="ml-auto text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                      {badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#C7C7C7] hover:bg-white/6 hover:text-white transition-colors duration-150"
        >
          <LogOut size={17} className="text-[#9B9B9B] shrink-0" />
          {!collapsed && <span className="truncate">{userEmail}</span>}
        </button>
      </div>
    </aside>
  );
}
