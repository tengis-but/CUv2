"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import TopNav from "../components/TopNav";
import InputBox from "../components/InputBox";
import ChatContainer, { ChatContainerRef } from "../components/ChatContainer";
import PromptExamples from "../components/PromptExamples";
import InfoModal from "../components/InfoModal";
import { askQuestion, fetchChatHistory } from "../src/lib/api";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  isGenerating?: boolean;
  skipAnimation?: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<ChatContainerRef>(null);
  const router = useRouter();

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const data = await fetchChatHistory();
        const historyMessages = data.chat_history
          .map((entry: any) => [
            {
              id: `${entry.question}-${Date.now()}`,
              text: entry.question,
              isUser: true,
              timestamp: Date.now(),
            },
            {
              id: `${entry.answer}-${Date.now()}`,
              text: entry.answer,
              isUser: false,
              timestamp: Date.now(),
              skipAnimation: true,
            },
          ])
          .flat();
        setHistoryMessages(historyMessages);
      } catch (error) {
        console.error("Failed to load chat history:", error);
        setError("Failed to load chat history. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      console.log("Sending question:", text);
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        isUser: true,
        timestamp: Date.now(),
      };

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "",
        isUser: false,
        timestamp: Date.now(),
        isGenerating: true,
      };

      setMessages((prev) => {
        const baseMessages = historyVisible
          ? prev
          : [...historyMessages, ...prev];
        const uniqueBase = baseMessages.filter(
          (msg) => msg.id !== newMessage.id && msg.id !== botMessage.id
        );
        const updatedBase = uniqueBase.map((msg) => {
          if (!msg.isUser && !msg.skipAnimation && !msg.isGenerating) {
            return { ...msg, skipAnimation: true };
          }
          return msg;
        });
        return [...updatedBase, newMessage, botMessage];
      });
      setIsGenerating(true);
      if (!historyVisible) setHistoryVisible(true);

      try {
        console.log("Calling askQuestion...");
        const data = await askQuestion(text);
        console.log("Received response data:", data);
        setMessages((prev) => {
          const updatedMessages = prev.map((msg) => {
            if (msg.id === botMessage.id) {
              return {
                ...msg,
                text: data.response || "No response from server",
                isGenerating: false,
                skipAnimation: false,
              };
            } else if (!msg.isUser && !msg.skipAnimation && !msg.isGenerating) {
              return { ...msg, skipAnimation: true };
            }
            return msg;
          });
          console.log("Updated messages state:", updatedMessages);
          return updatedMessages;
        });
        setIsTyping(true);
      } catch (error) {
        console.error("Error asking question:", error);
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === botMessage.id) {
              return {
                ...msg,
                text: `Error: ${(error as Error).message}`,
                isGenerating: false,
                skipAnimation: false,
              };
            } else if (!msg.isUser && !msg.skipAnimation && !msg.isGenerating) {
              return { ...msg, skipAnimation: true };
            }
            return msg;
          })
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [historyMessages, historyVisible]
  );

  const handleStopGeneration = useCallback(() => {
    if (isTyping && chatContainerRef.current) {
      chatContainerRef.current.stopCurrentTyping();
    } else {
      setMessages((prev) => prev.filter((msg) => !msg.isGenerating));
    }
    setIsGenerating(false);
    setIsTyping(false);
  }, [isTyping]);

  const handleResetChat = useCallback(() => {
    setMessages([]);
    setInputMessage("");
    setIsGenerating(false);
    setIsTyping(false);
    setHistoryVisible(false);
  }, []);

  const handleTypingComplete = useCallback(() => {
    setIsTyping(false);
  }, []);

  const shouldDisableInput = isGenerating || isTyping;

  // Move early returns after all hooks
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#171717]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#171717] text-gray-900 dark:text-[#eaeaea]">
      <TopNav
        onResetChat={handleResetChat}
        onInfoClick={() => setIsInfoOpen(true)}
      />
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 relative">
          <div className="max-w-[90rem] mx-auto px-8">
            <AnimatePresence mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  key="greeting"
                  initial={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="min-h-screen flex flex-col items-center justify-center"
                >
                  <div className="w-full max-w-[860px] mx-auto space-y-12">
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-[32px] font-medium tracking-tight text-center"
                    >
                      How can I help you today?
                    </motion.h1>
                    <PromptExamples onExampleClick={setInputMessage} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="pt-24 pb-32"
                >
                  <div className="w-full max-w-[860px] mx-auto">
                    <ChatContainer
                      ref={chatContainerRef}
                      messages={messages}
                      onTypingComplete={handleTypingComplete}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-[#0e0e0e] via-white dark:via-[#0e0e0e] to-transparent pt-10">
            <div className="max-w-[90rem] mx-auto px-8 mb-10">
              <div className="max-w-[860px] mx-auto">
                <InputBox
                  onSend={handleSendMessage}
                  message={inputMessage}
                  onMessageChange={setInputMessage}
                  disabled={shouldDisableInput}
                  onStop={handleStopGeneration}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isInfoOpen && (
        <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      )}
    </main>
  );
}