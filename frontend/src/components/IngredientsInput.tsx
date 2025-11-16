import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Search, Sparkles } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface IngredientsInputProps {
  onSearch: (ingredients: string[]) => void;
  initialIngredients?: string[];
}

interface Ingrediente {
  id: number;
  nombre: string;
}

const SUGGESTED_INGREDIENTS = [
  "Pollo",
  "Arroz",
  "Tomate",
  "Cebolla",
  "Ajo",
  "Pasta",
  "Queso",
  "Huevos",
  "Papas",
  "Zanahoria",
  "Limón",
  "Aceite de oliva",
  "Sal",
  "Pimienta",
];

export function IngredientsInput({
  onSearch,
  initialIngredients = [],
}: IngredientsInputProps) {
  const [ingredients, setIngredients] = useState<string[]>(initialIngredients);
  const [inputValue, setInputValue] = useState("");
  const [todosIngredientes, setTodosIngredientes] = useState<Ingrediente[]>([]);
  const [ingredientesFiltrados, setIngredientesFiltrados] = useState<
    Ingrediente[]
  >([]);
  const [loading, setLoading] = useState(false);
  //carga de ingredientes de la API
  useEffect(() => {
    fetch("http://localhost:8000/api/ingredientes/")
      .then((res) => res.json())
      .then((data) => setTodosIngredientes(data))
      .catch((error) => console.error("Error:", error));
  }, []);
  //filtro de ingredientes de la API
  useEffect(() => {
    if (inputValue.trim()) {
      const filtrados = todosIngredientes.filter(
        (ing) =>
          ing.nombre.toLowerCase().includes(inputValue.toLowerCase()) &&
          !ingredients.includes(ing.nombre)
      );
      setIngredientesFiltrados(filtrados);
    } else {
      setIngredientesFiltrados([]);
    }
  }, [inputValue, todosIngredientes, ingredients]);

  const obtenerRecomendacionesPorNombres = async (ingredientes: string[]) => {
    const response = await fetch(
      "http://localhost:8000/api/recomendaciones/nombres/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredientes }),
      }
    );
    if (!response.ok) throw new Error("Error al obtener recomendaciones");
    const data = await response.json();
    return data.recomendaciones;
  };

  const addIngredient = (ingredient: string) => {
    const trimmed = ingredient.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      const newIngredients = [...ingredients, trimmed];
      setIngredients(newIngredients);
      setInputValue("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (ingredientesFiltrados.length > 0) {
        addIngredient(ingredientesFiltrados[0].nombre);
      } else {
        addIngredient(inputValue);
      }
    }
  };


  const handleSearch = async () => {
    if (ingredients.length === 0) return;
    setLoading(true);
    try {
      const recomendaciones = await obtenerRecomendacionesPorNombres(
        ingredients
      );
      onSearch(recomendaciones);
    } catch (error) {
      console.error("Error al obtener las recomendaciones:", error);
      alert("Error al buscar recetas. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };
  //ingredientes sugeridos desde la API
  const ingredientesSugeridos = todosIngredientes
    .filter((ing) => !ingredients.includes(ing.nombre))
    .slice(0, 14);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] to-white py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <Sparkles className="h-4 w-4 text-[#e87c3e]" />
            <span className="text-sm text-gray-600">
              Paso 1: Ingresa tus ingredientes
            </span>
          </div>
          <h1 className="mb-4 text-gray-900">¿Qué tienes en tu cocina?</h1>
          <p className="text-lg text-gray-600">
            Agrega los ingredientes que tienes disponibles y te mostraremos
            recetas perfectas para ti
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-white p-6 shadow-xl sm:p-8"
        >
          {/* Input Section */}
          <div className="mb-6 relative">
            <label className="mb-2 block text-sm text-gray-600">
              Agregar ingrediente
            </label>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Ej: Pollo, tomate, arroz..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full rounded-xl border-gray-200 px-4 py-6 focus:border-[#e87c3e] focus:ring-[#e87c3e]"
                />

                {/* Dropdown de sugerencias */}
                {inputValue && ingredientesFiltrados.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                  >
                    {ingredientesFiltrados.map((ing) => (
                      <button
                        key={ing.id}
                        onClick={() => addIngredient(ing.nombre)}
                        className="w-full text-left px-4 py-3 hover:bg-[#fef9f6] hover:text-[#e87c3e] transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {ing.nombre}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
              <Button
                onClick={() => addIngredient(inputValue)}
                disabled={!inputValue.trim()}
                className="rounded-xl bg-gradient-to-r from-[#e87c3e] to-[#e76f51] px-6 text-white hover:shadow-lg"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Selected Ingredients */}
          {ingredients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-6"
            >
              <label className="mb-3 block text-sm text-gray-600">
                Ingredientes seleccionados ({ingredients.length})
              </label>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {ingredients.map((ingredient) => (
                    <motion.div
                      key={ingredient}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Badge
                        variant="secondary"
                        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-[#e87c3e] to-[#e76f51] px-4 py-2 text-white"
                      >
                        <span>{ingredient}</span>
                        <button
                          onClick={() => removeIngredient(ingredient)}
                          className="rounded-full transition-transform hover:scale-110"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Suggested Ingredients */}
          <div className="mb-6">
            <label className="mb-3 block text-sm text-gray-600">
              Ingredientes sugeridos
            </label>
            <div className="flex flex-wrap gap-2">
              {ingredientesSugeridos.map((ing) => (
                <motion.button
                  key={ing.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => addIngredient(ing.nombre)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition-colors hover:border-[#e87c3e] hover:bg-[#fef9f6] hover:text-[#e87c3e]"
                >
                  {ing.nombre}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={ingredients.length === 0}
            className="w-full rounded-xl bg-gradient-to-r from-[#e87c3e] to-[#e76f51] py-6 text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            <Search className="mr-2 h-5 w-5" />
            Buscar recetas ({ingredients.length}{" "}
            {ingredients.length === 1 ? "ingrediente" : "ingredientes"})
          </Button>
          <Button
            onClick={handleSearch}
            disabled={ingredients.length === 0 || loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#e87c3e] to-[#e76f51] py-6 text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Buscando recetas...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Buscar recetas ({ingredients.length}{" "}
                {ingredients.length === 1 ? "ingrediente" : "ingredientes"})
              </>
            )}
          </Button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-gray-500">
            💡 Tip: Cuantos más ingredientes agregues, más opciones de recetas
            encontrarás
          </p>
        </motion.div>
      </div>
    </div>
  );
}
