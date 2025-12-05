import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Send, ChefHat } from "lucide-react";
import { API_BASE_URL } from "../config";
interface Mensaje {
  role: 'user' | 'assistant';
  content: string;
}

export function Chatchef() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [inputMensaje, setInputMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const enviarMensaje = async () => {
    if (!inputMensaje.trim()) return;

    const nuevoMensajeUsuario: Mensaje = {
      role: 'user',
      content: inputMensaje
    };

    setMensajes(prev => [...prev, nuevoMensajeUsuario]);
    setInputMensaje("");
    setLoading(true);

    try {
      // Construir historial para la API
      const historial = mensajes.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`${API_BASE_URL}/api/recetas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mensaje: inputMensaje,
          historial: historial.length > 0 ? historial : undefined
        })
      });

      const data = await response.json();

      const respuestaChef: Mensaje = {
        role: 'assistant',
        content: data.respuesta
      };

      setMensajes(prev => [...prev, respuestaChef]);

    } catch (error) {
      console.error('Error:', error);
      const errorMsg: Mensaje = {
        role: 'assistant',
        content: 'Lo siento, hubo un error. Por favor intenta de nuevo.'
      };
      setMensajes(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef9f6] to-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
            <ChefHat className="h-5 w-5 text-[#e87c3e]" />
            <span className="text-sm text-gray-600">Chef Virtual IA</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pregúntale al Chef
          </h1>
          <p className="text-lg text-gray-600">
            Hazle cualquier pregunta sobre cocina, recetas y preparación de alimentos
          </p>
        </div>

        {/* Chat Container */}
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          {/* Mensajes */}
          <div className="h-[500px] overflow-y-auto mb-4 space-y-4">
            {mensajes.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ChefHat className="h-16 w-16 mb-4" />
                <p>¡Hola! Soy tu chef virtual. Pregúntame sobre cocina.</p>
              </div>
            ) : (
              mensajes.map((mensaje, idx) => (
                <div
                  key={idx}
                  className={`flex ${mensaje.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      mensaje.role === 'user'
                        ? 'bg-gradient-to-r from-[#e87c3e] to-[#e76f51] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{mensaje.content}</p>
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Escribe tu pregunta sobre cocina..."
              value={inputMensaje}
              onChange={(e) => setInputMensaje(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && enviarMensaje()}
              className="flex-1 rounded-xl border-gray-200 px-4 py-3"
              disabled={loading}
            />
            <Button
              onClick={enviarMensaje}
              disabled={!inputMensaje.trim() || loading}
              className="rounded-xl bg-gradient-to-r from-[#e87c3e] to-[#e76f51] px-6"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
