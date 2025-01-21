"use client";
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { SendHorizonal } from "lucide-react";

interface ResponseData {
  text: string;
  response: string | { resposta: string; url?: string; exercicio?: string };
}

export default function Chat() {
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await axios.post("https://www.atendezap.chat/detectar", { text: message });

      // Garantimos que a resposta seja um objeto antes de salvar
      const responseData = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

      setResponses([...responses, { text: message, response: responseData }]);
      setMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-900 text-white">
      {/* Barra Lateral */}
      <aside className="w-1/4 bg-gray-800 p-6 hidden md:flex flex-col justify-between border-r border-gray-700">
        <div>
          <h2 className="text-xl font-bold text-primary">Tranquilize AI</h2>
          <p className="text-gray-400 mt-2">Uma IA para suporte emocional.</p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Configurações futuras</p>
          <p className="text-sm text-gray-400">Modelos de IA</p>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex flex-col w-full md:w-3/4 px-6 py-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col h-full max-w-4xl mx-auto"
        >
          {/* AVISO LEGAL */}
          <div className="mb-4 p-4 bg-red-600 text-white text-center rounded-lg shadow-md">
            <p className="text-sm font-semibold">
              ⚠️ O Tranquilize AI é um assistente experimental. Ele **não substitui profissionais de saúde mental**.  
              Ele ajuda com técnicas de alívio mental comprovadas, Se você estiver enfrentando dificuldades emocionais severas, procure ajuda profissional. 💙  
            </p>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-center text-primary mb-6">Tranquilize AI</h1>

          {/* Caixa de Respostas */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-800 rounded-lg space-y-4 border border-gray-700">
            {responses.length === 0 ? (
              <p className="text-gray-400 text-center">Digite o que está sentindo abaixo e receba uma ajuda.</p>
            ) : (
              responses.map((item, index) => {
                let responseData;

                try {
                  // Verifica se response é um objeto ou string e converte se necessário
                  responseData =
                    typeof item.response === "string"
                      ? JSON.parse(item.response)
                      : item.response;

                  // Se responseData ainda for um objeto contendo "mensagem", pegamos apenas a resposta
                  if (responseData && responseData.mensagem) {
                    responseData = responseData.resposta; // Extraímos a resposta correta
                  }
                } catch (error) {
                  console.error("Erro ao processar response:", error);
                  responseData = "Erro ao carregar a resposta.";
                }

                return (
                  <Card key={index} className="p-4 bg-gray-700 rounded-lg border border-gray-600">
                    <p className="text-sm text-gray-400">Você:</p>
                    <p className="text-lg font-medium">{item.text}</p>

                    <p className="mt-2 text-sm text-gray-400">Resposta:</p>
                    <p className="text-lg text-primary">
                      {typeof responseData === "string" ? responseData : responseData.resposta}
                    </p>

                    {/* Exibir URL se existir */}
                    {responseData.url && (
                      <p className="mt-2 text-sm text-blue-400">
                        <a href={responseData.url} target="_blank" rel="noopener noreferrer">
                          Leia mais sobre essa técnica
                        </a>
                      </p>
                    )}

                    {/* Exibir exercício se existir */}
                    {responseData.exercicio && (
                      <p className="mt-2 text-sm text-green-400">{responseData.exercicio}</p>
                    )}
                  </Card>
                );
              })
            )}
          </div>

          {/* Caixa de Entrada com Botão Interno */}
          <div className="mt-6 flex items-center bg-gray-800 border border-gray-600 rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-transparent text-white border-none focus:outline-none p-2 resize-none"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={loading}
              className="p-3 bg-primary text-white rounded-lg font-semibold hover:bg-indigo-500 transition-all flex items-center gap-2"
            >
              {loading ? "Enviando..." : <SendHorizonal size={18} />}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
