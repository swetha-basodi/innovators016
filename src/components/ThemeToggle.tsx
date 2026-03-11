import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg hover:bg-sidebar-muted transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-sidebar-foreground" />
      ) : (
        <Moon className="w-4 h-4 text-sidebar-foreground" />
      )}
    </button>
  );
};

export default ThemeToggle;
