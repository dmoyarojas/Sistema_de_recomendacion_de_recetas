from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ingrediente, Receta
from .serializers import IngredienteSerializer, RecetaSerializer
from .logic_rules import get_final_recomendacion



@api_view(['GET'])
def obtener_ingredientes(request):
    """Obtiene todos los ingredientes"""
    ingredientes = Ingrediente.objects.all()
    serializer = IngredienteSerializer(ingredientes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def obtener_recetas(request):
    """Obtiene todas las recetas con sus ingredientes"""
    recetas = Receta.objects.all()
    serializer = RecetaSerializer(recetas, many=True)
    return Response(serializer.data)


#pydatalog endpoint
@api_view(['POST'])
def obtener_recomendaciones(request):
    """
    Endpoint principal que usa PyDatalog para recomendar recetas.
    
    Da un JSON con la lista de IDs de ingredientes del usuario:
    {
        "ingredientes_ids": [1, 3, 5, 7]
    }
    """
    try:
        # Obtener los IDs de ingredientes del usuario
        ingredientes_ids = request.data.get('ingredientes_ids', [])
        
        if not ingredientes_ids:
            return Response({
                'error': 'Debes proporcionar al menos un ingrediente'
            }, status=400)
        
        #  logica de PyDatalog
        recomendaciones = get_final_recomendacion(ingredientes_ids)
        
        # Enriquecer con datos completos de las recetas
        recetas_enriquecidas = []
        for rec in recomendaciones:
            try:
                receta = Receta.objects.get(id=rec['id'])
                serializer = RecetaSerializer(receta)
                
                # Combinar datos de PyDatalog con datos del serializer
                receta_completa = serializer.data
                receta_completa['puntaje'] = rec['puntaje']  # Añadir el puntaje calculado
                
                recetas_enriquecidas.append(receta_completa)
            except Receta.DoesNotExist:
                continue
        
        return Response({
            'total': len(recetas_enriquecidas),
            'recomendaciones': recetas_enriquecidas
        })
        
    except Exception as e:
        return Response({
            'error': f'Error al procesar recomendaciones: {str(e)}'
        }, status=500)
    


@api_view(['POST'])
def obtener_recomendaciones_por_nombres(request):
    """
    Alternativa que recibe nombres de ingredientes en lugar de IDs.
    
    Espera un JSON:
    {
        "ingredientes": ["Pollo", "Arroz", "Tomate"]
    }
    """
    try:
        ingredientes_nombres = request.data.get('ingredientes', [])
        
        if not ingredientes_nombres:
            return Response({
                'error': 'Debes proporcionar al menos un ingrediente'
            }, status=400)
        
        # Convertir nombres a IDs
        ingredientes_ids = list(
            Ingrediente.objects.filter(
                nombre__in=ingredientes_nombres
            ).values_list('id', flat=True)
        )
        
        if not ingredientes_ids:
            return Response({
                'error': 'No se encontraron ingredientes válidos'
            }, status=404)
        
        # Ejecutar la lógica de PyDatalog
        recomendaciones = get_final_recomendacion(ingredientes_ids)
        
        # Enriquecer con datos completos
        recetas_enriquecidas = []
        for rec in recomendaciones:
            try:
                receta = Receta.objects.get(id=rec['id'])
                serializer = RecetaSerializer(receta)
                
                receta_completa = serializer.data
                receta_completa['puntaje'] = rec['puntaje']
                
                recetas_enriquecidas.append(receta_completa)
            except Receta.DoesNotExist:
                continue
        
        return Response({
            'total': len(recetas_enriquecidas),
            'ingredientes_procesados': ingredientes_nombres,
            'recomendaciones': recetas_enriquecidas
        })
        
    except Exception as e:
        return Response({
            'error': f'Error al procesar recomendaciones: {str(e)}'
        }, status=500)



@api_view(['GET'])
def obtener_receta_detalle(request, receta_id):
    """Obtiene una receta específica con sus ingredientes"""
    try:
        receta = Receta.objects.get(id=receta_id)
        serializer = RecetaSerializer(receta)
        return Response(serializer.data)
    except Receta.DoesNotExist:
        return Response({'error': 'Receta no encontrada'}, status=404)