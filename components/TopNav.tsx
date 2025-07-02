import { Moon, Sun, Info, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface TopNavProps {
  onResetChat: () => void;
  onInfoClick: () => void;
}

const TopNav = ({ onResetChat, onInfoClick }: TopNavProps) => {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const html = document.documentElement;
    const savedTheme = localStorage.getItem("theme");
    const hasClass = html.classList.contains("dark");

    if (savedTheme === "light" || (!savedTheme && !hasClass)) {
      setIsDark(false);
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      setIsDark(true);
      html.classList.add("dark");
      html.classList.remove("light");
    }
  }, []);

  const handleThemeToggle = () => {
    const html = document.documentElement;
    const newTheme = !isDark;

    if (newTheme) {
      html.classList.add("dark");
      html.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem("theme", "light");
    }

    requestAnimationFrame(() => {
      setIsDark(newTheme);
    });
  };

  const handleLogoClick = () => {
    onResetChat();
  };

  if (!mounted) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
      <div className="w-full px-[100px] py-5">
        <div className="flex justify-between items-center">
          <button
            onClick={handleLogoClick}
            className="text-gray-900 dark:text-[#eaeaea] text-xl font-semibold tracking-tight hover:text-gray-700 dark:hover:text-[#eaeaea]/80 transition-colors cursor-pointer"
          >
            CU Assistant
          </button>
          <div className="flex items-center gap-6">
            <button
              onClick={handleThemeToggle}
              className="p-1.5 text-gray-600 dark:text-[#eaeaea]/60 hover:text-gray-900 dark:hover:text-[#eaeaea] transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun key="sun-icon" className="w-[18px] h-[18px]" />
              ) : (
                <Moon key="moon-icon" className="w-[18px] h-[18px]" />
              )}
            </button>
            <button
              onClick={onInfoClick}
              className="p-1.5 text-gray-600 dark:text-[#eaeaea]/60 hover:text-gray-900 dark:hover:text-[#eaeaea] transition-colors cursor-pointer"
            >
              <Info className="w-[18px] h-[18px]" />
            </button>
            <button className="p-1.5 text-gray-600 dark:text-[#eaeaea]/60 hover:text-gray-900 dark:hover:text-[#eaeaea] transition-colors cursor-pointer">
              <Menu className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
