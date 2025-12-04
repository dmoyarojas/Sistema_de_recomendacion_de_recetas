import { motion } from "motion/react";
import { ArrowLeft, Clock, Users, ChefHat, Check, Printer } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Separator } from "./ui/separator";

interface RecipeDetailProps {
  recipe: any;
  onBack: () => void;
}

export function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  const handlePrint = () => {
    // Crear una nueva ventana con solo el contenido imprimible
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${recipe.name}</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 40px auto;
              padding: 20px;
              color: #1f2937;
            }
            h1 {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 20px;
              color: #e87c3e;
            }
            h2 {
              font-size: 24px;
              font-weight: bold;
              margin-top: 30px;
              margin-bottom: 15px;
              color: #374151;
            }
            .meta {
              display: flex;
              gap: 20px;
              margin-bottom: 20px;
              padding: 15px;
              background: #fef9f6;
              border-radius: 8px;
            }
            .meta-item {
              font-size: 14px;
            }
            .ingredients {
              list-style: none;
              padding: 0;
            }
            .ingredients li {
              padding: 8px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .instructions {
              counter-reset: step-counter;
            }
            .instruction {
              counter-increment: step-counter;
              margin-bottom: 20px;
              padding-left: 40px;
              position: relative;
            }
            .instruction::before {
              content: counter(step-counter);
              position: absolute;
              left: 0;
              top: 0;
              width: 30px;
              height: 30px;
              background: linear-gradient(to bottom right, #e87c3e, #e76f51);
              color: white;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <h1>${recipe.name}</h1>
          
          <div class="meta">
            <div class="meta-item">⏱️ ${recipe.time || "N/A"}</div>
            <div class="meta-item">👥 ${
              recipe.servings || "N/A"
            } porciones</div>
            <div class="meta-item">👨‍🍳 ${recipe.difficulty || "N/A"}</div>
          </div>

          <h2>Ingredientes</h2>
          <ul class="ingredients">
            ${recipe.ingredients
              .map((ing: string) => `<li>✓ ${ing}</li>`)
              .join("")}
          </ul>

          <h2>Preparación</h2>
          <div class="instructions">
            ${recipe.instructions
              .map(
                (inst: string) => `
              <div class="instruction">${inst}</div>
            `
              )
              .join("")}
          </div>

          ${
            recipe.tips && recipe.tips.length > 0
              ? `
            <h2>Consejos del chef</h2>
            <ul>
              ${recipe.tips.map((tip: string) => `<li>${tip}</li>`).join("")}
            </ul>
          `
              : ""
          }
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
    };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <ImageWithFallback
          src={recipe.image}
          alt={recipe.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Botones superiores - Contenedor flex */}
        <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-4 sm:p-8">
          {/* Back Button - Izquierda */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={onBack}
              variant="secondary"
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </motion.div>

          {/* Print Button - Derecha */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button
              onClick={handlePrint}
              className="rounded-full bg-gradient-to-r from-[#e87c3e] to-[#e76f51] text-white hover:shadow-lg"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
          </motion.div>
        </div>

        {/* Title Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="absolute bottom-0 left-0 right-0 p-6 sm:p-8"
        >
          <div className="container mx-auto max-w-4xl">
            <h1 className="mb-4 text-white">{recipe.name}</h1>
            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full bg-white/90 px-4 py-2 text-gray-900 backdrop-blur-sm">
                <Clock className="mr-2 h-4 w-4" />
                {recipe.time}
              </Badge>
              <Badge className="rounded-full bg-white/90 px-4 py-2 text-gray-900 backdrop-blur-sm">
                <Users className="mr-2 h-4 w-4" />
                {recipe.servings} porciones
              </Badge>
              <Badge className="rounded-full bg-gradient-to-r from-[#e87c3e] to-[#e76f51] px-4 py-2 text-white">
                <ChefHat className="mr-2 h-4 w-4" />
                {recipe.difficulty}
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="text-lg text-gray-600">{recipe.description}</p>
        </motion.div>

        <Separator className="my-8" />

        {/* Ingredients */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="mb-6 text-gray-900">Ingredientes</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {recipe.ingredients.map((ingredient: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="flex items-start gap-3 rounded-xl bg-[#fef9f6] p-4"
              >
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e87c3e] to-[#e76f51]">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-gray-700">{ingredient}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Separator className="my-8" />

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="mb-6 text-gray-900">Preparación</h2>
          <div className="space-y-6">
            {recipe.instructions.map((instruction: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e87c3e] to-[#e76f51] text-white">
                  {index + 1}
                </div>
                <div className="flex-1 pt-2">
                  <p className="text-gray-700">{instruction}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips */}
        {recipe.tips && recipe.tips.length > 0 && (
          <>
            <Separator className="my-8" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="rounded-2xl bg-gradient-to-br from-[#fef9f6] to-[#faf5f0] p-6"
            >
              <h3 className="mb-4 flex items-center gap-2 text-gray-900">
                <ChefHat className="h-5 w-5 text-[#e87c3e]" />
                Consejos del chef
              </h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-700"
                  >
                    <span className="text-[#e87c3e]">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
