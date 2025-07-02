import { motion } from "framer-motion";
import clsx from "clsx";
import { formatMessageTimestamp } from "../utils/dateUtils";

interface UserMessageProps {
  message: string;
  timestamp?: number;
}

const UserMessage = ({ message, timestamp }: UserMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex mb-4 justify-end"
    >
      <div
        className={clsx(
          "px-5 py-3 rounded-xl transition-all duration-200 min-w-[200px]",
          "bg-gray-100 dark:bg-white/5 backdrop-blur-md border border-gray-300 dark:border-white/10 text-gray-900 dark:text-[#eaeaea]",
          "max-w-[80%]"
        )}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
          {message}
        </p>
        {timestamp && (
          <span className="block mt-1.5 text-xs opacity-60">
            {formatMessageTimestamp(timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default UserMessage;
