import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  Building2,
  LogOut,
  Moon,
  Sun,
  MonitorCog,
  Shield,
} from "lucide-react";
import { supabase } from "../lib/supabase";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const desktopNavItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
];

export default function AppNavbar({
  isDark,
  themePreference,
  onCycleTheme,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const themeLabel =
    themePreference === "auto"
      ? "Auto"
      : themePreference === "dark"
      ? "Dark"
      : "Light";

  const navClass = isDark
    ? "border-zinc-800 bg-zinc-950/90 text-zinc-100"
    : "border-zinc-200 bg-white/90 text-zinc-900";

  const mutedClass = isDark ? "text-zinc-400" : "text-zinc-600";

  const activeClass = isDark
    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
    : "bg-emerald-50 text-emerald-700 border border-emerald-200";

  const idleClass = isDark
    ? "hover:bg-zinc-900 text-zinc-300"
    : "hover:bg-zinc-100 text-zinc-700";

  const accountButtonClass = isDark
    ? "border-zinc-700 bg-zinc-900 text-zinc-100 hover:bg-zinc-800 hover:text-zinc-100"
    : "border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 hover:text-zinc-900";

  const renderDesktopLinks = () =>
    desktopNavItems.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.to;

      return (
        <Link
          key={item.to}
          to={item.to}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
            isActive ? activeClass : idleClass
          }`}
        >
          <Icon size={16} />
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur supports-[backdrop-filter]:bg-opacity-80 ${navClass}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl ${
              isDark
                ? "bg-emerald-500/15 text-emerald-300"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            <Shield size={18} />
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold">RenovaFleet Control</div>
            <div className={`text-xs ${mutedClass}`}>Painel operacional</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {renderDesktopLinks()}
        </nav>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className={`rounded-xl ${accountButtonClass}`}>
                Conta
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/usuario" className="flex items-center gap-2">
                  <Users size={16} />
                  Usuário
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/frota" className="flex items-center gap-2">
                  <Truck size={16} />
                  Frota
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/seguradoras" className="flex items-center gap-2">
                  <Building2 size={16} />
                  Seguradoras
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={onCycleTheme}
                className="flex items-center gap-2"
              >
                {themePreference === "dark" ? (
                  <Moon size={16} />
                ) : themePreference === "light" ? (
                  <Sun size={16} />
                ) : (
                  <MonitorCog size={16} />
                )}
                Alterar tema ({themeLabel})
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 focus:text-red-600"
              >
                <LogOut size={16} />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}