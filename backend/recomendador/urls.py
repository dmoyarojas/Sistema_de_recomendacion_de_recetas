from django.urls import path
from . import views

urlpatterns = [
    path('ingredientes/', views.obtener_ingredientes, name='obtener_ingredientes'),
    path('recetas/', views.obtener_recetas, name='obtener_recetas'),
    path('recomendaciones/nombres/', views.obtener_recomendaciones_por_nombres, name='obtener_recomendaciones_nombres'),
]