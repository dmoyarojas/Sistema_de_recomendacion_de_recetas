import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { IngredientsInput } from "./components/IngredientsInput";
import { RecipeList } from "./components/RecipeList";
import { RecipeDetail } from "./components/RecipeDetail";

// Mock data for recipes
const MOCK_RECIPES = [
  {
    id: "1",
    name: "Pasta Primavera",
    description: "Una deliciosa pasta con vegetales frescos de temporada, perfecta para una comida rápida y saludable.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2h8ZW58MXx8fHwxNzYxOTAyNDg1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    time: "25 min",
    servings: 4,
    difficulty: "Fácil",
    ingredients: ["Pasta", "Tomate", "Cebolla", "Ajo", "Aceite de oliva", "Zanahoria", "Queso", "Sal", "Pimienta"],
    instructions: [
      "Cocina la pasta en agua hirviendo con sal según las instrucciones del paquete.",
      "Mientras tanto, corta todos los vegetales en trozos pequeños.",
      "En una sartén grande, calienta el aceite de oliva y sofríe el ajo y la cebolla hasta que estén dorados.",
      "Agrega los tomates y las zanahorias, cocina por 5-7 minutos.",
      "Escurre la pasta y mézclala con los vegetales.",
      "Sirve caliente con queso rallado por encima."
    ],
    tips: [
      "Puedes usar cualquier tipo de pasta que tengas disponible",
      "Agrega otras verduras de temporada según tu preferencia",
      "Un toque de albahaca fresca eleva el sabor"
    ],
    matchPercentage: 95
  },
  {
    id: "2",
    name: "Ensalada Mediterránea",
    description: "Ensalada fresca y colorida con ingredientes del mediterráneo, ideal para el verano.",
    image: "https://images.unsplash.com/photo-1620019989479-d52fcedd99fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNhbGFkJTIwYm93bHxlbnwxfHx8fDE3NjE4NDY3NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    time: "15 min",
    servings: 2,
    difficulty: "Muy Fácil",
    ingredients: ["Tomate", "Cebolla", "Aceite de oliva", "Limón", "Queso", "Sal", "Pimienta"],
    instructions: [
      "Corta los tomates en cubos medianos.",
      "Pica finamente la cebolla.",
      "Mezcla todos los ingredientes en un bowl grande.",
      "Aliña con aceite de oliva, jugo de limón, sal y pimienta.",
      "Desmenuza el queso por encima.",
      "Deja reposar 5 minutos antes de servir para que los sabores se integren."
    ],
    tips: [
      "Usa tomates bien maduros para mejor sabor",
      "Puedes agregar aceitunas si las tienes",
      "Sirve con pan tostado"
    ],
    matchPercentage: 90
  },
  {
    id: "3",
    name: "Sopa de Vegetales",
    description: "Una sopa reconfortante llena de nutrientes y sabor casero.",
    image: "https://images.unsplash.com/photo-1701109876066-7fc0c08da447?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3VwJTIwYm93bHxlbnwxfHx8fDE3NjE5Mzc0Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    time: "40 min",
    servings: 6,
    difficulty: "Fácil",
    ingredients: ["Zanahoria", "Cebolla", "Ajo", "Tomate", "Papas", "Aceite de oliva", "Sal", "Pimienta"],
    instructions: [
      "Pela y corta todas las verduras en cubos.",
      "En una olla grande, calienta el aceite y sofríe el ajo y la cebolla.",
      "Agrega las zanahorias y las papas, cocina por 5 minutos.",
      "Añade los tomates y cubre con agua o caldo.",
      "Cocina a fuego medio durante 30 minutos hasta que las verduras estén tiernas.",
      "Sazona con sal y pimienta al gusto. Sirve caliente."
    ],
    tips: [
      "Puedes hacer puré de la mitad para una textura más cremosa",
      "Congela en porciones individuales para comidas futuras",
      "Acompaña con pan crujiente"
    ],
    matchPercentage: 85
  },
  {
    id: "4",
    name: "Pollo al Limón",
    description: "Pechuga de pollo jugosa con un toque cítrico refrescante.",
    image: "https://images.unsplash.com/photo-1712579733874-c3a79f0f9d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwY2hpY2tlbnxlbnwxfHx8fDE3NjE5MzA2NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    time: "30 min",
    servings: 4,
    difficulty: "Fácil",
    ingredients: ["Pollo", "Limón", "Ajo", "Aceite de oliva", "Sal", "Pimienta"],
    instructions: [
      "Sazona el pollo con sal, pimienta y ajo picado.",
      "Calienta el aceite en una sartén grande a fuego medio-alto.",
      "Cocina el pollo por 6-7 minutos de cada lado hasta que esté dorado.",
      "Exprime el jugo de limón sobre el pollo.",
      "Reduce el fuego y cocina 2 minutos más.",
      "Sirve caliente con rodajas de limón."
    ],
    tips: [
      "No sobrecocines el pollo para mantenerlo jugoso",
      "Marina el pollo con limón 30 minutos antes para más sabor",
      "Perfecto con arroz o ensalada"
    ],
    matchPercentage: 80
  },
  {
    id: "5",
    name: "Tortilla de Papas",
    description: "Clásica tortilla española con papas y cebolla.",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHJlY2lwZXxlbnwxfHx8fDE3NjE5NjM0MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    time: "35 min",
    servings: 4,
    difficulty: "Media",
    ingredients: ["Papas", "Huevos", "Cebolla", "Aceite de oliva", "Sal"],
    instructions: [
      "Pela y corta las papas en rodajas finas.",
      "Fríe las papas con la cebolla en aceite de oliva hasta que estén tiernas.",
      "Escurre el exceso de aceite y deja enfriar ligeramente.",
      "Bate los huevos con sal en un bowl grande.",
      "Mezcla las papas con los huevos batidos.",
      "Cocina en una sartén antiadherente, volteando para cocinar ambos lados.",
      "Sirve caliente o a temperatura ambiente."
    ],
    tips: [
      "Usa una sartén pequeña para una tortilla más gruesa",
      "El truco está en encontrar el punto perfecto: jugosa por dentro",
      "Ideal para llevar en picnic o merienda"
    ],
    matchPercentage: 88
  },
  {
    id: "6",
    name: "Arroz con Vegetales",
    description: "Arroz aromático salteado con vegetales frescos y coloridos.",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwZm9vZCUyMHJlY2lwZXxlbnwxfHx8fDE3NjE5NjM0MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    time: "30 min",
    servings: 4,
    difficulty: "Fácil",
    ingredients: ["Arroz", "Zanahoria", "Cebolla", "Ajo", "Aceite de oliva", "Sal", "Pimienta"],
    instructions: [
      "Cocina el arroz según las instrucciones del paquete.",
      "Mientras tanto, pica todos los vegetales en cubos pequeños.",
      "En una sartén grande, calienta el aceite y sofríe el ajo.",
      "Agrega las cebollas y zanahorias, cocina hasta que estén tiernas.",
      "Incorpora el arroz cocido y mezcla bien.",
      "Sazona con sal y pimienta. Sirve caliente."
    ],
    tips: [
      "Usa arroz del día anterior para mejor textura",
      "Agrega un huevo batido para hacerlo estilo frito",
      "Puedes añadir salsa de soja para un toque asiático"
    ],
    matchPercentage: 92
  }
];

type View = "home" | "ingredients" | "recipes" | "recipe-detail";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [ingredientes, setIngredientes] = useState(null);
  const [recetas, setRecetas] = useState(null);
  //datos de API

  const [datos, setDatos] = useState(null);
  //conexión API Django
    useEffect(() => {
    fetch('http://localhost:8000/api/ingredientes/')
      .then(res => res.json())
      .then(data => {
        console.log('Ingredientes:', data);
        setIngredientes(data);
      })
      .catch(error => console.error('Error:', error));
  }, []);
    useEffect(() => {
    fetch('http://localhost:8000/api/recetas/')
      .then(res => res.json())
      .then(data => {
        console.log('Recetas:', data);
        setRecetas(data);  
      })
      .catch(error => console.error('Error:', error));
  }, []);


  
  const handleSearch = (ingredients: string[]) => {
    setSelectedIngredients(ingredients);
    
    // Filter recipes based on ingredients
    const filtered = MOCK_RECIPES.map(recipe => {
      const matchingIngredients = recipe.ingredients.filter(ing =>
        ingredients.some(selectedIng => 
          ing.toLowerCase().includes(selectedIng.toLowerCase()) ||
          selectedIng.toLowerCase().includes(ing.toLowerCase())
        )
      );
      
      const matchPercentage = Math.round((matchingIngredients.length / ingredients.length) * 100);
      
      return {
        ...recipe,
        matchPercentage: matchPercentage > 100 ? 100 : matchPercentage
      };
    }).filter(recipe => recipe.matchPercentage > 0);

    setFilteredRecipes(filtered);
    setCurrentView("recipes");
  };

  const handleViewRecipe = (recipeId: string) => {
    const recipe = MOCK_RECIPES.find(r => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
      setCurrentView("recipe-detail");
    }
  };

  const handleNavigate = (view: string) => {
    if (view === "home") {
      setCurrentView("home");
      setSelectedIngredients([]);
      setFilteredRecipes([]);
    } else if (view === "ingredients") {
      setCurrentView("ingredients");
    }
  };

  const popularRecipes = MOCK_RECIPES.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Header currentView={currentView} onNavigate={handleNavigate} />
      
      {currentView === "home" && (
        <HomePage
          onGetStarted={() => setCurrentView("ingredients")}
          onViewRecipe={handleViewRecipe}
          popularRecipes={popularRecipes}
        />
      )}

      {currentView === "ingredients" && (
        <IngredientsInput
          onSearch={handleSearch}
          initialIngredients={selectedIngredients}
        />
      )}

      {currentView === "recipes" && (
        <RecipeList
          recipes={filteredRecipes}
          selectedIngredients={selectedIngredients}
          onViewRecipe={handleViewRecipe}
          onBack={() => setCurrentView("ingredients")}
        />
      )}

      {currentView === "recipe-detail" && selectedRecipe && (
        <RecipeDetail
          recipe={selectedRecipe}
          onBack={() => setCurrentView("recipes")}
        />
      )}
      
    </div>
  );
}
