from .models import Receta, Ingrediente
from .processor import calculate_overlap_score
from pydatalog import pyDatalog
#import de pydatalog
#importacion de modelos y funcion de calculo de puntuacion



#definicion de terminos logicos para de inferencia
pyDatalog.create_terms('bloqueado, tiene_ingrediente, falta_ingrediente, R, I')
# Regla Logica de Inferencia:
# Una receta (R) está se BLOQUEA si requiere un ingrediente (I) y ese ingrediente (I) FALTA en el inventario del usuario.
bloqueado(R) <= tiene_ingrediente(R, I) & falta_ingrediente(I)

#regla de descarte
MIN_SCORE_THRESHOLD = 0.50



def get_final_recomendacion(user_inventory_ids):
    """
    Función principal que combina los paradigmas lógico y funcional
    para generar la recomendación final.

    Args:
        user_inventory_ids (list): IDs de los ingredientes que el usuario tiene.

    Returns:
        list: Una lista de diccionarios ordenados, con la receta y su puntaje.
    """
    pyDatalog.clear()

    #obtencion de nombres de ingredientes del usuario a partir de sus Ids
    user_inventory_names= set(
        Ingrediente.objects.filter(id__in=user_inventory_ids).values_list('nombre', flat=True)
    )

    all_recipes=Receta.objects.all()
    all_ingredients_in_db= set(Ingrediente.objects.values_list('nombre', flat=True))


    for ing_name in all_ingredients_in_db:
        if ing_name not in user_inventory_names:
            pyDatalog.assert_fact('falta_ingrediente', ing_name)

    recommendations_with_scores = []


    
    for receta in all_recipes:
        required_ingredients_names = set(
            receta.ingredientes.values_list('nombre', flat=True)
        )
        
       
        # Esto permite que la regla de BLOQUEO funcione
        for req_ing in required_ingredients_names:
            pyDatalog.assert_fact('tiene_ingrediente', receta.nombre_receta, req_ing)
            
        # consultar si la receta está bloqueada
        es_bloqueada = pyDatalog.ask('bloqueado("' + receta.nombre_receta + '")')
        
        if es_bloqueada:
            # Descartada por inferencia 
            continue
        
        
        score = calculate_overlap_score(
            required_ingredients_names, 
            user_inventory_names
        )
        
       #umbral de recomendacion
        if score >= MIN_SCORE_THRESHOLD:
            final_score_percentage = round(score * 100, 2)
            
            recommendations_with_scores.append({
                'id': receta.id,
                'nombre': receta.nombre_receta,
                'descripcion': receta.descripcion,
                'puntaje': final_score_percentage,
                'score_raw': score
            })
            
    
    # Ordenar por el puntaje más alto
    recommendations_with_scores.sort(key=lambda x: x['score_raw'], reverse=True)
    
    # Limpieza final antes de devolver
    for item in recommendations_with_scores:
        del item['score_raw']
        
    return recommendations_with_scores