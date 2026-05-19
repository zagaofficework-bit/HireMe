import { useTheme } from "./ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`
        relative w-12 h-6 rounded-full border transition-all duration-300
        focus:outline-none focus:ring-2
        ${
          isDark
            ? "bg-[#061c1e] border-[#29c8d6]/30"
            : "bg-slate-200 border-slate-400"
        }
      `}
    >
      <div
        className={`
          absolute top-0.5 w-5 h-5 rounded-full
          transition-all duration-300
          flex items-center justify-center text-[10px] shadow-md
          ${
            isDark
              ? "left-0.5 bg-[#105056]"
              : "left-[calc(100%-22px)] bg-[#29c8d6]"
          }
        `}
      >
        {isDark ? "🌙" : "☀️"}
      </div>
    </button>
  );
};

export default ThemeToggle;