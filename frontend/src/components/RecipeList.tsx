import { motion } from "motion/react";
import { Clock, Users, ChefHat, ArrowLeft, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface RecipeListProps {
  recipes: any[];
  selectedIngredients: string[];
  onViewRecipe: (recipeId: string) => void;
  onBack: () => void;
}

export function RecipeList({ recipes, selectedIngredients, onViewRecipe, onBack }: RecipeListProps) {
  const [sortBy, setSortBy] = useState<"match" | "time">("match");

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortBy === "match") {
      return b.matchPercentage - a.matchPercentage;
    } else {
      return parseInt(a.time) - parseInt(b.time);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] to-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="mb-4 text-gray-600 hover:text-[#e87c3e]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a ingredientes
          </Button>

          <div className="mb-6">
            <h1 className="mb-2 text-gray-900">Recetas disponibles</h1>
            <p className="text-lg text-gray-600">
              Encontramos {recipes.length} recetas con tus ingredientes
            </p>
          </div>

          {/* Selected Ingredients */}
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-600">Tus ingredientes:</p>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient) => (
                <Badge
                  key={ingredient}
                  variant="secondary"
                  className="rounded-full bg-gradient-to-r from-[#e87c3e] to-[#e76f51] px-3 py-1 text-white"
                >
                  {ingredient}
                </Badge>
              ))}
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={sortBy === "match" ? "default" : "outline"}
                onClick={() => setSortBy("match")}
                className={
                  sortBy === "match"
                    ? "rounded-full bg-[#e87c3e] hover:bg-[#d4682a]"
                    : "rounded-full border-gray-300"
                }
              >
                Mejor coincidencia
              </Button>
              <Button
                size="sm"
                variant={sortBy === "time" ? "default" : "outline"}
                onClick={() => setSortBy("time")}
                className={
                  sortBy === "time"
                    ? "rounded-full bg-[#e87c3e] hover:bg-[#d4682a]"
                    : "rounded-full border-gray-300"
                }
              >
                Tiempo de preparación
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Recipe Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedRecipes.map((recipe, index) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <RecipeCard recipe={recipe} onView={onViewRecipe} />
            </motion.div>
          ))}
        </div>

        {recipes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <ChefHat className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-gray-900">No encontramos recetas</h3>
            <p className="text-gray-600">
              Intenta con diferentes ingredientes
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function RecipeCard({ recipe, onView }: { recipe: any; onView: (id: string) => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl"
    >
      <button onClick={() => onView(recipe.id)} className="w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Match Badge */}
          <div className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-[#e87c3e] to-[#e76f51] px-3 py-1 text-white shadow-lg">
            <span className="text-sm">{recipe.matchPercentage}% match</span>
          </div>

          {/* Time Badge */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
            <Clock className="h-3 w-3 text-[#e87c3e]" />
            <span className="text-sm text-gray-700">{recipe.time}</span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="mb-2 text-gray-900">{recipe.name}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {recipe.description}
          </p>

          <div className="mb-3 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} porciones</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.slice(0, 3).map((ingredient: string, idx: number) => (
              <span
                key={idx}
                className="rounded-full bg-[#fef9f6] px-3 py-1 text-xs text-[#e87c3e]"
              >
                {ingredient}
              </span>
            ))}
            {recipe.ingredients.length > 3 && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                +{recipe.ingredients.length - 3} más
              </span>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
