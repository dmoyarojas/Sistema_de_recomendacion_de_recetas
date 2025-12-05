import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HomePage } from "./components/HomePage";
import { IngredientsInput } from "./components/IngredientsInput";
import { RecipeList } from "./components/RecipeList";
import { RecipeDetail } from "./components/RecipeDetail";
import { Chatchef } from "./components/Chatchef";

// Tipos para la respuesta de la API
interface ApiReceta {
  id: number;
  nombre: string;
  descripcion: string;
  
  recetaingrediente_set: {
    ingrediente: {
      id: number;
      nombre: string;
    };
    cantidad_requerida: string;
  }[];
  // campos opcionales que la API pueda devolver
  imagen?: string;
  tiempo?: string;
  porciones?: number;
  dificultad?: string;
  instrucciones_list?: string[];
  tips?: string[];
}

// Tipo uniforme que usa la UI (mapea ApiReceta -> UIRecipe)
type UIRecipe = {
  id: string;
  name: string;
  description: string;  
  image?: string;
  time?: string;
  servings?: number;
  difficulty?: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
  // sin cálculo de porcentaje de coincidencia
};

type View = "home" | "ingredients" | "recipes" | "recipe-detail" | "chat";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<UIRecipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<UIRecipe | null>(null);

  const [apiRecetas, setApiRecetas] = useState<ApiReceta[] | null>(null);
  const [apiIngredientes, setApiIngredientes] = useState<any[] | null>(null);





  // Fetch ingredientes desde la API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/recetas/`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Ingredientes:", data);
        setApiIngredientes(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

const API_BASE_URL = import.meta.env.VITE_API_URL|| "http://localhost:8000";

  // Fetch recetas desde la API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/recetas/`)
      .then((res) => res.json())
      .then((data: ApiReceta[]) => {
        console.log("Recetas (API):", data);
        setApiRecetas(data);
      })
      .catch((error) => console.error("Error:", error));
  }, []);


  const obtenerRecomendacionesPorNombres = async (ingredientes: string[]) => {
    const response = await fetch(`${API_BASE_URL}/api/recetas/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredientes }),
    });

    if (!response.ok) {
      throw new Error('Error al obtener recomendaciones');
    }

    const data = await response.json();
    return data.recomendaciones;
  };


  
  // Mapea ApiReceta -> UIRecipe
  const mapApiRecetaToUI = (r: ApiReceta): UIRecipe => {
    return {
      id: String(r.id),
      name: r.nombre,
      description: r.descripcion || "",
      image: (r as any).imagen || undefined,
      time: (r as any).tiempo || undefined,
      servings: (r as any).porciones || undefined,
      difficulty: (r as any).dificultad || undefined,
      ingredients: r.recetaingrediente_set.map((ri) => ri.ingrediente.nombre),
      instructions: (r as any).instrucciones_list || [],
      tips: (r as any).tips || [],
    };
  };




  // Buscar recetas según ingredientes seleccionados (sin porcentaje)

const handleSearch = async (ingredientsOrRecommendations: string[] | ApiReceta[]) => {
  
  if (typeof ingredientsOrRecommendations[0] === 'string') {
    const ingredients = ingredientsOrRecommendations as string[];
    setSelectedIngredients(ingredients);

    try {
   
      const recomendaciones = await obtenerRecomendacionesPorNombres(ingredients);
      console.log('Recomendaciones recibidas:', recomendaciones);
      
      
      const uiRecipes = recomendaciones.map(mapApiRecetaToUI);
      setFilteredRecipes(uiRecipes);
      setCurrentView("recipes");
    } catch (error) {
      console.error('Error al obtener recomendaciones:', error);
      setFilteredRecipes([]);
      setCurrentView("recipes");
    }
  } 
 
  else {
    const recomendaciones = ingredientsOrRecommendations as ApiReceta[];
    const uiRecipes = recomendaciones.map(mapApiRecetaToUI);
    setFilteredRecipes(uiRecipes);
    setCurrentView("recipes");
  }
};




  const handleViewRecipe = (recipeId: string) => {
    // Primero intenta buscar en las recetas filtradas, luego en todas las recetas mapeadas
    const allUi = (apiRecetas || []).map(mapApiRecetaToUI);
    const recipe =
      filteredRecipes.find((r) => r.id === recipeId) ||
      allUi.find((r) => r.id === recipeId);

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
  } else if (view === "chat") {  
    setCurrentView("chat");
  }
};



  const popularRecipes = (apiRecetas || []).slice(0, 3).map(mapApiRecetaToUI);

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
        <IngredientsInput onSearch={handleSearch} initialIngredients={selectedIngredients} />
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
        <RecipeDetail recipe={selectedRecipe} onBack={() => setCurrentView("recipes")} />
      )}
      {currentView === "chat" && <Chatchef />}
    </div>
  );
}
