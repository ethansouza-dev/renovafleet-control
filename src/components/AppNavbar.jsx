import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  LayoutDashboard,
  Users,
  Truck,
  LogOut,
  Moon,
  Sun,
  MonitorCog,
  Shield,
} from "lucide-react";
import { supabase } from "../lib/supabase";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const navItems = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Usuário",
    to: "/usuario",
    icon: Users,
  },
  {
    label: "Frota",
    to: "/frota",
    icon: Truck,
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
    ? "border-zinc-800 bg-zinc-950/80 text-zinc-100"
    : "border-zinc-200 bg-white/85 text-zinc-900";

  const mutedClass = isDark ? "text-zinc-400" : "text-zinc-600";
  const activeClass = isDark
    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
    : "bg-emerald-50 text-emerald-700 border border-emerald-200";
  const idleClass = isDark
    ? "hover:bg-zinc-900 text-zinc-300"
    : "hover:bg-zinc-100 text-zinc-700";

  const renderNavLinks = (mobile = false) =>
    navItems.map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.to;

      return (
        <Link
          key={item.to}
          to={item.to}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
            isActive ? activeClass : idleClass
          } ${mobile ? "w-full" : ""}`}
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
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={18} />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className={isDark ? "bg-zinc-950 text-zinc-100 border-zinc-800" : ""}>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Shield size={18} />
                  RenovaFleet Control
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-2">
                {renderNavLinks(true)}
                <Separator className="my-3" />
                <Button
                  variant="outline"
                  onClick={onCycleTheme}
                  className="justify-start gap-2 rounded-xl"
                >
                  {themePreference === "dark" ? (
                    <Moon size={16} />
                  ) : themePreference === "light" ? (
                    <Sun size={16} />
                  ) : (
                    <MonitorCog size={16} />
                  )}
                  Tema: {themeLabel}
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  className="justify-start gap-2 rounded-xl"
                >
                  <LogOut size={16} />
                  Sair
                </Button>
              </div>
            </SheetContent>
          </Sheet>

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
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={onCycleTheme}
            className="hidden rounded-xl md:inline-flex"
          >
            {themePreference === "dark" ? (
              <Moon size={16} />
            ) : themePreference === "light" ? (
              <Sun size={16} />
            ) : (
              <MonitorCog size={16} />
            )}
            <span className="ml-2">Tema: {themeLabel}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                Conta
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
              <DropdownMenuItem onClick={onCycleTheme} className="flex items-center gap-2">
                {themePreference === "dark" ? (
                  <Moon size={16} />
                ) : themePreference === "light" ? (
                  <Sun size={16} />
                ) : (
                  <MonitorCog size={16} />
                )}
                Alterar tema
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