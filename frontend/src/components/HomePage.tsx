import { motion } from "motion/react";
import { ChefHat, Sparkles, Clock, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onGetStarted: () => void;
  onViewRecipe: (recipeId: string) => void;
  popularRecipes: any[];
}

export function HomePage({ onGetStarted, onViewRecipe, popularRecipes }: HomePageProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fef9f6] to-[#faf5f0]">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <div className="mb-4 inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 shadow-sm">
                <Sparkles className="h-4 w-4 text-[#e87c3e]" />
                <span className="text-sm text-gray-600">Encuentra tu próxima comida</span>
              </div>
              
              <h1 className="mb-6 bg-gradient-to-r from-[#e87c3e] to-[#e76f51] bg-clip-text text-transparent">
                Cocina con lo que tienes en casa
              </h1>
              
              <p className="mb-8 text-lg text-gray-600">
                Ingresa los ingredientes que tienes disponibles y descubre recetas deliciosas 
                que puedes preparar ahora mismo. Sin complicaciones, sin desperdicios.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={onGetStarted}
                  className="bg-gradient-to-r from-[#e87c3e] to-[#e76f51] px-8 py-6 text-white shadow-lg transition-all hover:shadow-xl"
                >
                  <ChefHat className="mr-2 h-5 w-5" />
                  Comenzar ahora
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    document.getElementById('popular-recipes')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="border-[#e87c3e] px-8 py-6 text-[#e87c3e] hover:bg-[#fef9f6]"
                >
                  Ver recetas populares
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <FeatureStat icon={<ChefHat />} number="500+" label="Recetas" />
                <FeatureStat icon={<Clock />} number="10 min" label="Promedio" />
                <FeatureStat icon={<Heart />} number="100%" label="Gratis" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1590759485285-0e5c13ebba50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwaW5ncmVkaWVudHMlMjBraXRjaGVufGVufDF8fHx8MTc2MTk2MzQxNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Ingredientes frescos de cocina"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -bottom-4 -left-4 rounded-2xl bg-white p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#e87c3e] to-[#e76f51]">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Recetas encontradas</p>
                    <p className="text-[#e87c3e]">+250 opciones</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section id="popular-recipes" className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-gray-900">Recetas Populares</h2>
            <p className="text-lg text-gray-600">
              Las favoritas de nuestra comunidad
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularRecipes.map((recipe, index) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <RecipeCard recipe={recipe} onView={onViewRecipe} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#e87c3e] to-[#e76f51] py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-white">¿Listo para cocinar?</h2>
            <p className="mb-8 text-lg text-white/90">
              Comienza a descubrir recetas increíbles con tus ingredientes
            </p>
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-white px-8 py-6 text-[#e87c3e] shadow-lg hover:bg-gray-50"
            >
              <ChefHat className="mr-2 h-5 w-5" />
              Buscar recetas ahora
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureStat({ icon, number, label }: { icon: React.ReactNode; number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="mb-2 flex justify-center text-[#e87c3e]">
        {icon}
      </div>
      <p className="text-gray-900">{number}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

function RecipeCard({ recipe, onView }: { recipe: any; onView: (id: string) => void }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl"
    >
      <button onClick={() => onView(recipe.id)} className="w-full text-left">
        <div className="relative aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={recipe.image}
            alt={recipe.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 backdrop-blur-sm">
            <span className="text-sm text-[#e87c3e]">{recipe.time}</span>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="mb-2 text-gray-900">{recipe.name}</h3>
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">{recipe.description}</p>
          
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
                +{recipe.ingredients.length - 3}
              </span>
            )}
          </div>
        </div>
      </button>
    </motion.div>
  );
}
