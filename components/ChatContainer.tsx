// components/ChatContainer.tsx
import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  memo,
} from "react";
import UserMessage from "./UserMessage";
import BotMessage, { BotMessageRef } from "./BotMessage";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
  isGenerating?: boolean;
  messageKey?: string;
  skipAnimation?: boolean;
}

interface ChatContainerProps {
  messages: Message[];
  onTypingComplete?: () => void;
}

export interface ChatContainerRef {
  stopCurrentTyping: () => void;
}

const ChatContainerComponent = forwardRef<ChatContainerRef, ChatContainerProps>(
  ({ messages, onTypingComplete }, ref) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const botMessageRefs = useRef<Map<string, BotMessageRef>>(new Map());
    const messageCounter = useRef(0); // Counter to ensure uniqueness
    const userScrolledUpRef = useRef(false);

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

    // Function to scroll to bottom (only if user hasn't scrolled up)
    const scrollToBottom = () => {
      if (!userScrolledUpRef.current && bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Check if user is near the bottom (within 100px threshold)
    const isNearBottom = () => {
      const container = containerRef.current;
      if (!container) return true;

      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      return distanceFromBottom <= 100; // 100px threshold as requested
    };

    // Set up scroll event listener to track user scroll behavior
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);

        // Update userScrolledUp based on position relative to bottom
        if (distanceFromBottom <= 100) {
          // User is near bottom - resume auto-scrolling
          userScrolledUpRef.current = false;
        } else {
          // User has scrolled up - disable auto-scrolling
          userScrolledUpRef.current = true;
        }
      };

      container.addEventListener("scroll", handleScroll);

      // Initial check
      handleScroll();

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }, []);

    // Auto-scroll when messages change (only if user hasn't scrolled up)
    useEffect(() => {
      scrollToBottom();
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
        {messages.map((message, index) => {
          const messageKey = `${message.id}-${index}-${messageCounter.current++}`;
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
              skipTypingAnimation={message.skipAnimation}
              onTypingComplete={onTypingComplete}
            />
          );
        })}
        <div ref={bottomRef} />
      </div>
    );
  }
);

ChatContainerComponent.displayName = "ChatContainer";

const ChatContainer = memo(ChatContainerComponent);

export { ChatContainer as default };
export type { ChatContainerProps, BotMessageRef };
