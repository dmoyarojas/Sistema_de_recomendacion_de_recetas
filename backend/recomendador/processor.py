def calculate_overlap_score(required_ingredients_names, user_inventory_names):
    """
    Calcula el puntaje de coincidencia (overlap) entre los ingredientes requeridos
    de una receta y el inventario del usuario.
    
    Args:
        required_ingredients_names (set): Nombres de ingredientes que requiere la receta.
        user_inventory_names (set): Nombres de ingredientes que el usuario tiene.
        
    Returns:
        float: Puntaje de coincidencia (0.0 a 1.0).
    """

    requerido= set(required_ingredients_names)
    inventario= set(user_inventory_names)

    if not requerido:
        return 0.0
    #calculo de intersección, osea lo que el usuario tiene y lo que la receta necesita
    ingredientes_comunes= requerido.intersection(inventario)
    #Proporción de ingredientes requeridos que el usuario tiene
    # Si una receta necesita 4 ingredientes y el usuario tiene 2 de ellos:
    # len(ingredientes_comunes) = 2
    # len(requerido) = 4
    # puntaje = 2/4 = 0.5 (50% de los ingredientes)
    puntaje= len(ingredientes_comunes) / len(requerido)

    return round(puntaje, 4)