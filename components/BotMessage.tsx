import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface BotMessageProps {
  message: string;
  isGenerating?: boolean;
  skipTypingAnimation?: boolean;
  onTypingComplete?: () => void;
}

export interface BotMessageRef {
  stopTyping: () => void;
}

const TypingAnimation = () => {
  return (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-[#a9aaac] dark:bg-[#575757] rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-[#a9aaac] dark:bg-[#575757] rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-[#a9aaac] dark:bg-[#575757] rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );
};

const BotMessage = forwardRef<BotMessageRef, BotMessageProps>(
  (
    {
      message,
      isGenerating = false,
      skipTypingAnimation = false,
      onTypingComplete,
    },
    ref
  ) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [shouldExpandWidth, setShouldExpandWidth] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const messageRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const completedRef = useRef(false);

    const finish = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsTyping(false);
      if (!completedRef.current) {
        completedRef.current = true;
        onTypingComplete?.();
      }
    }, [onTypingComplete]);

    useImperativeHandle(ref, () => ({
      stopTyping: () => {
        setIsStopped(true);
        finish();
      },
    }));

    useEffect(() => {
      if (!messageRef.current) return;
      const messageWidth = messageRef.current.scrollWidth;
      const containerWidth = messageRef.current.parentElement?.clientWidth || 0;
      const widthRatio = messageWidth / (containerWidth * 0.8);
      setShouldExpandWidth(widthRatio > 0.9);
    }, [displayedText]);

    useEffect(() => {
      if (skipTypingAnimation) {
        setDisplayedText(message);
        setIsTyping(false);
        if (!completedRef.current) {
          completedRef.current = true;
          onTypingComplete?.();
        }
        return;
      }

      if (isGenerating || !message || isStopped) {
        return;
      }

      let index = 0;
      setIsTyping(true);
      setDisplayedText("");

      const textContent = message.replace(/<[^>]+>/g, "");
      const totalLength = textContent.length;

      intervalRef.current = setInterval(() => {
        if (isStopped) {
          finish();
          return;
        }

        if (index < totalLength) {
          const nextChar = textContent[index];
          setDisplayedText((prev) => prev + nextChar);
          index++;
        } else {
          setDisplayedText(message);
          finish();
        }
      }, 10);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }, [message, isGenerating, isStopped, skipTypingAnimation, finish, onTypingComplete]);

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex mb-4 justify-start"
      >
        <div
          ref={messageRef}
          className={clsx(
            "transition-all duration-200 min-w-[200px]",
            "backdrop-blur-md text-gray-900 dark:text-[#eaeaea]",
            shouldExpandWidth ? "w-full" : "max-w-[100%]"
          )}
        >
          {isGenerating || isTyping ? (
            <TypingAnimation />
          ) : (
            <div
              className="text-[15px] leading-relaxed whitespace-pre-wrap break-words"
              dangerouslySetInnerHTML={{ __html: displayedText }}
            />
          )}
        </div>
      </motion.div>
    );
  }
);

BotMessage.displayName = "BotMessage";

export default BotMessage;