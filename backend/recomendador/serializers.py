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
    #  los ingredientes x sus cantidades
    recetaingrediente_set = RecetaIngredienteSerializer(many=True, read_only=True)
    instrucciones_list = serializers.SerializerMethodField()
    class Meta:
        model = Receta
        fields = ['id', 'nombre', 'descripcion','imagen', 'recetaingrediente_set', 'instrucciones_list']

    def get_instrucciones_list(self, obj):
        """
        Convierte el campo de texto 'instrucciones' en una lista.
        Cada línea es un paso.
        """
        if not obj.instrucciones:
            return []
        
        # Dividir por saltos de línea y limpiar espacios
        instrucciones = [line.strip() for line in obj.instrucciones.split('\n') if line.strip()]
        return instrucciones