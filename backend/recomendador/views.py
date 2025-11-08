from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ingrediente, Receta
from .serializers import IngredienteSerializer, RecetaSerializer



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


@api_view(['GET'])
def obtener_receta_detalle(request, receta_id):
    """Obtiene una receta específica con sus ingredientes"""
    try:
        receta = Receta.objects.get(id=receta_id)
        serializer = RecetaSerializer(receta)
        return Response(serializer.data)
    except Receta.DoesNotExist:
        return Response({'error': 'Receta no encontrada'}, status=404)