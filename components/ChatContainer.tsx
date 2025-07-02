// components/ChatContainer.tsx
import { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { AnimatePresence } from "framer-motion";
import UserMessage from "./UserMessage";
import BotMessage, { BotMessageRef } from "./BotMessage";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  isGenerating?: boolean;
  messageKey?: string;
}

interface ChatContainerProps {
  messages: Message[];
  onTypingComplete?: () => void;
}

export interface ChatContainerRef {
  stopCurrentTyping: () => void;
}

const ChatContainer = forwardRef<ChatContainerRef, ChatContainerProps>(
  ({ messages, onTypingComplete }, ref) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const botMessageRefs = useRef<Map<string, BotMessageRef>>(new Map());
    const messageCounter = useRef(0); // Counter to ensure uniqueness

    useImperativeHandle(ref, () => ({
      stopCurrentTyping: () => {
        const typingMessage = [...messages]
          .reverse()
          .find((msg) => !msg.isUser && !msg.isGenerating && msg.text);
        if (typingMessage) {
          const refKey = typingMessage.messageKey || typingMessage.id;
          const messageRef = botMessageRefs.current.get(refKey);
          if (messageRef) {
            messageRef.stopTyping();
          }
        }
      },
    }));

    useEffect(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

    useEffect(() => {
      return () => {
        botMessageRefs.current.clear();
      };
    }, []);

    return (
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
      >
        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const messageKey = `${message.id}-${index}-${messageCounter.current++}`; // Unique key with index and counter
            return message.isUser ? (
              <UserMessage
                key={messageKey}
                message={message.text}
                timestamp={message.timestamp}
              />
            ) : (
              <BotMessage
                key={messageKey}
                ref={(ref) => {
                  if (ref) {
                    botMessageRefs.current.set(messageKey, ref);
                  } else {
                    botMessageRefs.current.delete(messageKey);
                  }
                }}
                message={message.text}
                timestamp={message.timestamp}
                isGenerating={message.isGenerating}
                onTypingComplete={onTypingComplete}
              />
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    );
  }
);

ChatContainer.displayName = "ChatContainer";

export { ChatContainer as default };
export type { ChatContainerProps, BotMessageRef };