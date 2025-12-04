from groq import Groq
import json
from django.conf import settings

GROQ_API_KEY = settings.GROQ_API_KEY  
client = Groq(api_key=GROQ_API_KEY)

# Sistema de directivas del chef
CHEF_SYSTEM_PROMPT = """Eres un chef profesional experto con años de experiencia en cocina internacional. 

TU ÚNICA FUNCIÓN es hablar sobre:
- Recetas y preparación de alimentos
- Ingredientes y sus usos culinarios
- Técnicas de cocina
- Sugerencias de platos
- Consejos de cocina
- Maridajes y combinaciones de sabores

REGLAS ESTRICTAS:
1. SOLO responde preguntas relacionadas con cocina, recetas y alimentación
2. Si te preguntan sobre otros temas (política, deportes, tecnología no relacionada con cocina, etc.), responde amablemente: "Soy un chef especializado y solo puedo ayudarte con temas de cocina y recetas. ¿Tienes alguna pregunta sobre preparación de alimentos?"
3. Siempre sé amable, educado y profesional
4. Da respuestas prácticas y útiles
5. Si sugieren ingredientes, intenta dar recetas creativas

Mantén un tono conversacional, como si estuvieras en una cocina enseñando.
"""


def chat_con_chef(mensaje_usuario, historial_conversacion=None):
    """
    Chatbot de chef que solo responde sobre cocina.
    
    Args:
        mensaje_usuario (str): Mensaje/pregunta del usuario
        historial_conversacion (list): Historial de mensajes previos
        
    Returns:
        dict: Respuesta del chef
    """
    try:
        # construccion de mensajes
        messages = [
            {
                "role": "system",
                "content": CHEF_SYSTEM_PROMPT
            }
        ]
        
        # Agregar historial si existe, en est caso aun no
        if historial_conversacion:
            messages.extend(historial_conversacion)
        
        # Agregar mensaje actual del usuario
        messages.append({
            "role": "user",
            "content": mensaje_usuario
        })
        
        # Llamado a modelo de IA en este caso Llama 3.1
        chat_completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=1500,
        )
        
        respuesta = chat_completion.choices[0].message.content
        
        return {
            'respuesta': respuesta,
            'mensaje_usuario': mensaje_usuario,
            'exito': True
        }
        
    except Exception as e:
        print(f"Error con IA: {e}")
        return {
            'error': str(e),
            'exito': False
        }


def sugerir_receta_con_ingredientes(ingredientes_lista):
    """
    Función especializada para sugerir recetas basadas en ingredientes.
    
    Args:
        ingredientes_lista (list): Lista de ingredientes disponibles
        
    Returns:
        dict: Sugerencia de receta estructurada
    """
    ingredientes_str = ", ".join(ingredientes_lista)
    
    prompt = f"""Tengo estos ingredientes disponibles: {ingredientes_str}

¿Qué plato delicioso me sugieres preparar?

Por favor responde con:
1. Nombre del plato
2. Breve descripción
3. Ingredientes necesarios (incluyendo cantidades aproximadas)
4. Pasos de preparación numerados
5. Tiempo estimado de preparación
6. Nivel de dificultad (Fácil/Media/Difícil)
7. Un consejo especial del chef"""

    resultado = chat_con_chef(prompt)
    return resultado