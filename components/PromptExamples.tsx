import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import clsx from "clsx";

interface PromptExamplesProps {
  onExampleClick: (example: string) => void;
}

const examples = [
  "Analyze this report",
  "Explain the key findings",
  "Compare with industry standards",
  "Identify potential risks",
  "Summarize the methodology",
];

const PromptExamples = ({ onExampleClick }: PromptExamplesProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="flex flex-wrap gap-4 w-full justify-center"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {examples.map((example, index) => (
        <motion.button
          key={index}
          variants={item}
          onClick={() => onExampleClick(example)}
          className={clsx(
            "group relative flex items-center gap-3 cursor-pointer",
            "px-5 py-4 rounded-2xl",
            "bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10",
            "hover:border-gray-400 dark:hover:border-white/20 hover:bg-gray-200 dark:hover:bg-[#222]",
            "transition-all duration-200"
          )}
        >
          <div className="flex-shrink-0 p-2 rounded-xl bg-gray-200 dark:bg-white/5 group-hover:bg-gray-300 dark:group-hover:bg-white/10 transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-600 dark:text-white/70" />
          </div>
          <span className="text-[15px] text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white/90 transition-colors whitespace-nowrap">
            {example}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default PromptExamples;
