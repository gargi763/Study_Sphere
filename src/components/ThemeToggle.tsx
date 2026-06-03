import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-lg transition-all duration-300 flex items-center justify-center group"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />

      {theme === 'dark' ? (
        <div className="relative">
          <Sun
            size={18}
            className="text-yellow-400 animate-spin-slow"
            style={{
              animation: 'fadeInScale 0.3s ease-out',
            }}
          />
        </div>
      ) : (
        <div className="relative">
          <Moon
            size={18}
            className="text-blue-300"
            style={{
              animation: 'fadeInScale 0.3s ease-out',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.5) rotate(-180deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </button>
  );
}
