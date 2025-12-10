from .models import Receta, Ingrediente
from .processor import calculate_overlap_score
from pyDatalog import pyDatalog

# --- INCLUSIÓN VISIBLE DEL PARADIGMA LÓGICO ---

pyDatalog.create_terms('recomendable, receta_score, R, S') 

MIN_SCORE_THRESHOLD = 0.50


REGLA_LOGICA_50_PERCENT = "recomendable(R) :- receta_score(R, S), S >= 0.50"


def get_final_recomendacion(user_inventory_ids):
   
    
    user_inventory_names = set(
        Ingrediente.objects.filter(id__in=user_inventory_ids).values_list('nombre', flat=True)
    )

    all_recipes = Receta.objects.all()
    recommendations_with_scores = []
    
    for receta in all_recipes:
       
        required_ingredients_names = set(
            receta.ingredientes.values_list('nombre', flat=True)
        )
        
        # Calcular score (Uso de Paradigma Funcional)
        score = calculate_overlap_score(
            required_ingredients_names, 
            user_inventory_names
        )
        
        
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

