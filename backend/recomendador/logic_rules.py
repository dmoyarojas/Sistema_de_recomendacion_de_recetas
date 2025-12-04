from .models import Receta, Ingrediente
from .processor import calculate_overlap_score
from pyDatalog import pyDatalog

# Definición de términos lógicos
pyDatalog.create_terms('bloqueado, tiene_ingrediente, falta_ingrediente, R, I')

# Regla Lógica
bloqueado(R) <= tiene_ingrediente(R, I) & falta_ingrediente(I)

MIN_SCORE_THRESHOLD = 0.50


def get_final_recomendacion(user_inventory_ids):
    pyDatalog.clear()

    user_inventory_names = set(
        Ingrediente.objects.filter(id__in=user_inventory_ids).values_list('nombre', flat=True)
    )

    all_recipes = Receta.objects.all()
    recommendations_with_scores = []

    for receta in all_recipes:
        required_ingredients_names = set(
            receta.ingredientes.values_list('nombre', flat=True)
        )
        
        # Calcular score
        score = calculate_overlap_score(
            required_ingredients_names, 
            user_inventory_names
        )
        
        # recetas incluidas solo si supera el 50% d ingredientes
        if score >= MIN_SCORE_THRESHOLD:
            final_score_percentage = round(score * 100, 2)
            
            recommendations_with_scores.append({
                'id': receta.id,
                'nombre': receta.nombre,
                'descripcion': receta.descripcion,
                'puntaje': final_score_percentage,
                'score_raw': score
            })
    
    recommendations_with_scores.sort(key=lambda x: x['score_raw'], reverse=True)
    
    for item in recommendations_with_scores:
        del item['score_raw']
        
    return recommendations_with_scores