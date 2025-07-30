import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  size = "md",
}) => {
  const { isDark, toggleTheme } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        p-2 rounded-lg 
        bg-gray-100 dark:bg-gray-800 
        text-gray-600 dark:text-gray-300 
        hover:bg-gray-200 dark:hover:bg-gray-700 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
        ${className}
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun className={iconSizes[size]} />
        ) : (
          <Moon className={iconSizes[size]} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
