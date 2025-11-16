from django.urls import path
from . import views

urlpatterns = [
    path('ingredientes/', views.obtener_ingredientes, name='obtener_ingredientes'),
    path('recetas/', views.obtener_recetas, name='obtener_recetas'),
   
]