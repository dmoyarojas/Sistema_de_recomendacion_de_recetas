from django.urls import path
from . import views

urlpatterns = [
    path('ingredientes/', views.obtener_ingredientes, name='obtener_ingredientes'),
    path('recetas/', views.obtener_recetas, name='obtener_recetas'),
    path('recomendaciones/nombres/', views.obtener_recomendaciones_por_nombres, name='obtener_recomendaciones_nombres'),
    path('chat-chef/', views.chat_chef, name='chat_chef'),
    path('sugerir-receta-ia/', views.sugerir_receta_ia, name='sugerir_receta_ia'),
]