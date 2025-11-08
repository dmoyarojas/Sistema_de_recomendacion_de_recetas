from django.contrib import admin
#Importamos modelos que ya hicimos
from .models import Ingrediente, Receta, RecetaIngrediente
# Register your models here.

class RecetaIngredienteInline(admin.TabularInline):
    model= RecetaIngrediente
    extra=1

class RecetaAdmin(admin.ModelAdmin):
    inlines=[RecetaIngredienteInline]
    list_display= ('nombre',)

admin.site.register(Ingrediente)
admin.site.register(Receta, RecetaAdmin)