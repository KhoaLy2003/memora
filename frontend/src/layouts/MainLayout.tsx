import { Outlet, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home, User, Settings, LogOut, Menu } from "lucide-react";
import { NotificationContainer } from "@/components/NotificationContainer";
import { useTranslation } from "react-i18next";
import { setAppLanguage } from "@/i18n";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export default function MainLayout() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { t, i18n } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLanguageChange = (lng: "vi" | "en") => {
    if (i18n.language === lng) return;
    setAppLanguage(lng);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3 md:gap-6">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <Link
                      to="/"
                      className="text-2xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t("app.name")}
                    </Link>
                  </div>
                  <nav className="flex-1 px-4 py-6 space-y-2">
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Home className="w-5 h-5 text-primary" />
                      {isAuthenticated ? t("nav.dashboard") : t("nav.home")}
                    </Link>
                    {isAuthenticated && (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl hover:bg-muted transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <User className="w-5 h-5 text-primary" />
                          {t("nav.profile")}
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl hover:bg-muted transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5 text-primary" />
                          {t("nav.settings")}
                        </Link>
                      </>
                    )}
                  </nav>
                  {isAuthenticated && (
                    <div className="p-4 border-t mt-auto">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 px-4 py-6 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-5 h-5" />
                        {t("auth.logout")}
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            <Link
              to="/"
              className="text-xl md:text-2xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              {t("app.name")}
            </Link>
            <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
              <Link
                to="/"
                className="hover:text-primary transition-colors flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                {isAuthenticated ? t("nav.dashboard") : t("nav.home")}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-xs font-medium">
              <Button
                variant={i18n.language.startsWith("vi") ? "default" : "ghost"}
                size="sm"
                onClick={() => handleLanguageChange("vi")}
              >
                VI
              </Button>
              <Button
                variant={i18n.language.startsWith("en") ? "default" : "ghost"}
                size="sm"
                onClick={() => handleLanguageChange("en")}
              >
                EN
              </Button>
            </div>

            {!isAuthenticated ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    {t("auth.login")}
                  </Button>
                </Link>
                {/* <Link to="/register">
                  <Button size="sm">
                    {t("auth.register")}
                  </Button>
                </Link> */}
              </>
            ) : (
              <div className="flex items-center gap-4 text-sm font-medium">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full ring-primary/20 hover:ring-4 transition-all overflow-hidden p-0"
                    >
                      <img
                        src={
                          user?.avatar ||
                          `https://avatar.vercel.sh/${user?.email}`
                        }
                        alt={user?.name}
                        className="h-full w-full object-cover"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 mt-1 rounded-xl shadow-xl"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user?.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {t("nav.profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        {t("nav.settings")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center gap-2"
                      onClick={() => logout()}
                    >
                      <LogOut className="w-4 h-4" />
                      {t("auth.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          {t("layout.footer", { year: currentYear })}
        </div>
      </footer>

      <NotificationContainer />
    </div>
  );
}
