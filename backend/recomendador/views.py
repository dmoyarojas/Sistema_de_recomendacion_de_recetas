from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ingrediente, Receta
from .serializers import IngredienteSerializer, RecetaSerializer
from .logic_rules import get_final_recomendacion
from .ai_service import chat_con_chef, sugerir_receta_con_ingredientes


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


@api_view(['POST'])
def obtener_recomendaciones_por_nombres(request):
    """
    Recibe nombres de ingredientes y devuelve recomendaciones.
    """
    try:
        ingredientes_nombres = request.data.get('ingredientes', [])
        
        if not ingredientes_nombres:
            return Response({
                'error': 'Debes proporcionar al menos un ingrediente'
            }, status=400)
        
        ingredientes_ids = list(
            Ingrediente.objects.filter(
                nombre__in=ingredientes_nombres
            ).values_list('id', flat=True)
        )
        
        if not ingredientes_ids:
            return Response({
                'error': 'No se encontraron ingredientes válidos'
            }, status=404)
        
        recomendaciones = get_final_recomendacion(ingredientes_ids)
        
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


@api_view(['POST'])
def chat_chef(request):
    """
    Endpoint de chat conversacional con el chef IA.
    """
    try:
        mensaje = request.data.get('mensaje', '')
        historial = request.data.get('historial', None)
        
        if not mensaje:
            return Response({
                'error': 'Debes enviar un mensaje'
            }, status=400)
        
        resultado = chat_con_chef(mensaje, historial)
        
        if resultado['exito']:
            return Response({
                'respuesta': resultado['respuesta'],
                'mensaje_usuario': resultado['mensaje_usuario']
            })
        else:
            return Response({
                'error': resultado['error']
            }, status=500)
            
    except Exception as e:
        return Response({
            'error': f'Error: {str(e)}'
        }, status=500)


@api_view(['POST'])
def sugerir_receta_ia(request):
    """
    Endpoint para sugerir receta con IA basada en ingredientes.
    """
    try:
        ingredientes = request.data.get('ingredientes', [])
        
        if not ingredientes:
            return Response({
                'error': 'Debes proporcionar ingredientes'
            }, status=400)
        
        resultado = sugerir_receta_con_ingredientes(ingredientes)
        
        if resultado['exito']:
            return Response({
                'sugerencia': resultado['respuesta']
            })
        else:
            return Response({
                'error': resultado['error']
            }, status=500)
            
    except Exception as e:
        return Response({
            'error': f'Error: {str(e)}'
        }, status=500)