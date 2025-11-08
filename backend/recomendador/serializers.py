# serializers.py
from rest_framework import serializers
from .models import Ingrediente, Receta, RecetaIngrediente

class IngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model= Ingrediente
        fields= ['id', 'nombre']


class RecetaIngredienteSerializer(serializers.ModelSerializer):
    ingrediente = IngredienteSerializer(read_only=True)
    
    class Meta:
        model = RecetaIngrediente
        fields = ['ingrediente', 'cantidad_requerida']

class RecetaSerializer(serializers.ModelSerializer):
    # Esto mostrará los ingredientes con sus cantidades
    recetaingrediente_set = RecetaIngredienteSerializer(many=True, read_only=True)
    
    class Meta:
        model = Receta
        fields = ['id', 'nombre', 'descripcion', 'recetaingrediente_set']