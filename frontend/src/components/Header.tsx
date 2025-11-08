import { ChefHat, Home, BookOpen } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#e87c3e] to-[#e76f51]">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#e87c3e] to-[#e76f51] bg-clip-text text-transparent">
              RecetaFácil
            </span>
          </button>

          <nav className="flex items-center gap-2 sm:gap-4">
            <NavButton
              icon={<Home className="h-4 w-4" />}
              label="Inicio"
              isActive={currentView === "home"}
              onClick={() => onNavigate("home")}
            />
            <NavButton
              icon={<BookOpen className="h-4 w-4" />}
              label="Recetas"
              isActive={currentView === "ingredients" || currentView === "recipes" || currentView === "recipe-detail"}
              onClick={() => onNavigate("ingredients")}
            />
          </nav>
        </div>
      </div>
    </motion.header>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, isActive, onClick }: NavButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
        isActive
          ? "bg-[#fef9f6] text-[#e87c3e]"
          : "text-gray-600 hover:bg-[#fef9f6] hover:text-[#e87c3e]"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  );
}
