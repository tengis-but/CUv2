// components/InputBox.tsx
import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, ArrowUpCircle, X, Paperclip, Square } from "lucide-react";
import clsx from "clsx";
import { uploadFile, checkProgress } from "../src/lib/api";
import { useRouter } from "next/navigation";

interface FilePreview {
  name: string;
  size: number;
}

interface InputBoxProps {
  onSend: (message: string) => void;
  message: string;
  onMessageChange: (message: string) => void;
  disabled?: boolean;
  onStop?: () => void;
}

interface AnalysisData {
  detected_language?: string;
  extracted_text?: string;
  explanation?: string;
  numerical_data?: string;
}

const InputBox = ({
  onSend,
  message,
  onMessageChange,
  disabled = false,
  onStop,
}: InputBoxProps) => {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [message]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    disabled,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setFiles([{ name: file.name, size: file.size }]);
      setUploadProgress("Uploading...");
      try {
        const data = await uploadFile(file);
        if (data.session_id) {
          // For PDFs, track progress
          const interval = setInterval(async () => {
            try {
              const progressData = await checkProgress(data.session_id);
              setUploadProgress(`Processing: ${progressData.progress}%`);
              if (progressData.progress >= 100 || progressData.error) {
                clearInterval(interval);
                setUploadProgress(progressData.error ? "Error occurred" : "Upload complete");
                setTimeout(() => setFiles([]), 2000);
              }
            } catch (error) {
              setUploadProgress(`Error: ${(error as Error).message}`);
              clearInterval(interval);
              setTimeout(() => setFiles([]), 2000);
            }
          }, 1000);
        } else if (data.analysis) {
          // For images, show modal with analysis
          setAnalysis(data.analysis);
          setUploadProgress("Image uploaded, editing metadata...");
          setIsModalOpen(true);
          setTimeout(() => setFiles([]), 2000); // Clear file after modal interaction
        } else {
          setUploadProgress("Image uploaded and analyzed");
          setTimeout(() => setFiles([]), 2000);
        }
      } catch (error) {
        setUploadProgress(`Error: ${(error as Error).message}`);
        setTimeout(() => setFiles([]), 2000);
      }
    },
  });

  const removeFile = (index: number) => {
    if (disabled) return;
    setFiles(files.filter((_, i) => i !== index));
    setUploadProgress(null);
    setIsModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || (!message.trim() && files.length === 0)) return;
    if (message.trim()) {
      onSend(message);
      onMessageChange("");
    }
  };

  const handleStop = () => {
    if (onStop) onStop();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const saveMetadata = async () => {
    try {
      const response = await fetch("/api/embed_analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: files[0]?.name, analysis }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to save metadata");
      const data = await response.json();
      setIsModalOpen(false);
      setUploadProgress("Metadata saved successfully");
    } catch (error) {
      setUploadProgress(`Error: ${(error as Error).message}`);
    }
  };

  const hasContent = message.trim().length > 0 || files.length > 0;
  const canSubmit = hasContent && !disabled;

  return (
    <div className="w-full">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2 text-sm group"
            >
              <FileText className="w-4 h-4 text-gray-600 dark:text-white/70" />
              <span className="truncate max-w-[150px] font-medium text-gray-900 dark:text-white">
                {file.name}
              </span>
              <span className="text-gray-500 dark:text-[#eaeaea]/40">
                ({formatFileSize(file.size)})
              </span>
              {uploadProgress && (
                <span className="text-gray-500 dark:text-[#eaeaea]/40 ml-2">
                  {uploadProgress}
                </span>
              )}
              <button
                onClick={() => removeFile(index)}
                disabled={disabled}
                className={clsx(
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  disabled
                    ? "cursor-not-allowed text-gray-400 dark:text-white/30"
                    : "hover:text-gray-700 dark:hover:text-white/90"
                )}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 bg-white dark:bg-[#0e0e0e] rounded-lg shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600 dark:text-[#eaeaea] hover:text-gray-900 dark:hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-[#eaeaea]">Image Metadata</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-[#eaeaea]/70 mb-2">Detected Language</label>
                <input
                  type="text"
                  value={analysis.detected_language || ""}
                  onChange={(e) => setAnalysis({ ...analysis, detected_language: e.target.value })}
                  className="w-full p-2 rounded border border-gray-300 dark:border-white/10 bg-transparent text-gray-900 dark:text-[#eaeaea]"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-[#eaeaea]/70 mb-2">Extracted Text</label>
                <textarea
                  value={analysis.extracted_text || ""}
                  onChange={(e) => setAnalysis({ ...analysis, extracted_text: e.target.value })}
                  className="w-full p-2 rounded border border-gray-300 dark:border-white/10 bg-transparent text-gray-900 dark:text-[#eaeaea] h-24"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-[#eaeaea]/70 mb-2">Explanation</label>
                <textarea
                  value={analysis.explanation || ""}
                  onChange={(e) => setAnalysis({ ...analysis, explanation: e.target.value })}
                  className="w-full p-2 rounded border border-gray-300 dark:border-white/10 bg-transparent text-gray-900 dark:text-[#eaeaea] h-24"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-[#eaeaea]/70 mb-2">Numerical Data</label>
                <textarea
                  value={analysis.numerical_data || ""}
                  onChange={(e) => setAnalysis({ ...analysis, numerical_data: e.target.value })}
                  className="w-full p-2 rounded border border-gray-300 dark:border-white/10 bg-transparent text-gray-900 dark:text-[#eaeaea] h-24"
                />
              </div>
              <button
                onClick={saveMetadata}
                className="w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors mt-4"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="relative flex items-end group">
          <div
            className={clsx(
              "relative flex w-full items-center bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl border border-gray-300 dark:border-white/10 transition-colors duration-200",
              disabled
                ? "opacity-60 cursor-not-allowed"
                : "hover:border-gray-400 dark:hover:border-white/20"
            )}
          >
            <button
              type="button"
              {...getRootProps()}
              disabled={disabled}
              className={clsx(
                "flex items-center justify-center p-2 mx-2 transition-colors",
                disabled
                  ? "text-gray-400 dark:text-[#eaeaea]/20 cursor-not-allowed"
                  : clsx(
                      "text-gray-500 dark:text-[#eaeaea]/40 hover:text-gray-700 dark:hover:text-[#eaeaea] cursor-pointer",
                      isDragActive && "text-gray-700 dark:text-[#eaeaea]"
                    )
              )}
            >
              <input {...getInputProps()} />
              <Paperclip className="w-5 h-5" />
            </button>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => !disabled && onMessageChange(e.target.value)}
              placeholder={
                disabled ? "Хариулт боловсруулж байна..." : "Асуулт..."
              }
              rows={1}
              disabled={disabled}
              className={clsx(
                "flex-1 py-[18px] resize-none overflow-hidden bg-transparent",
                "text-[15px] leading-normal focus:outline-none focus:ring-0 transition-colors duration-200",
                disabled
                  ? "text-gray-400 dark:text-[#eaeaea]/40 placeholder:text-gray-400 dark:placeholder:text-[#eaeaea]/30 cursor-not-allowed"
                  : "text-gray-900 dark:text-[#eaeaea] placeholder:text-gray-500 dark:placeholder:text-[#eaeaea]/40"
              )}
              onKeyDown={(e) => {
                if (disabled) return;
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />

            {disabled ? (
              <button
                type="button"
                onClick={handleStop}
                className="flex items-center justify-center p-2 mx-2 text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Stop generation"
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!canSubmit}
                className={clsx(
                  "flex items-center justify-center p-2 mx-2 transition-colors",
                  canSubmit
                    ? "text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                    : "text-gray-300 dark:text-[#eaeaea]/20 cursor-not-allowed"
                )}
              >
                <ArrowUpCircle className="w-7 h-7" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputBox;