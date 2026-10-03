import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Paperclip, Send, X } from "lucide-react";

const MessageInput = ({
  onSend,
  disabled = false,
  placeholder = "Type a message...",
}) => {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState(null);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power3.out",
      }
    );
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage && !attachment) {
      return;
    }

    if (disabled) {
      return;
    }

    try {
      await onSend?.({
        content: trimmedMessage,
        attachment,
      });

      setMessage("");
      setAttachment(null);

      inputRef.current?.focus();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setAttachment(file);
  };

  const removeAttachment = () => {
    setAttachment(null);
  };

  return (
    <div
      ref={containerRef}
      className="border-t border-gray-200 bg-white p-3 sm:p-4"
    >
      {/* Attachment Preview */}
      {attachment && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-gray-700">
              {attachment.name}
            </p>

            <p className="text-[11px] text-gray-400">
              {(attachment.size / 1024).toFixed(1)} KB
            </p>
          </div>

          <button
            type="button"
            onClick={removeAttachment}
            className="ml-3 rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
            aria-label="Remove attachment"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2"
      >
        {/* Attachment */}
        <label
          className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-indigo-600 ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
          aria-label="Attach file"
        >
          <Paperclip size={19} />

          <input
            type="file"
            className="hidden"
            onChange={handleAttachment}
            disabled={disabled}
          />
        </label>

        {/* Message Input */}
        <textarea
          ref={inputRef}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={
            disabled ||
            (!message.trim() && !attachment)
          }
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>

      <p className="mt-2 hidden text-[11px] text-gray-400 sm:block">
        Press Enter to send · Shift + Enter for a new line
      </p>
    </div>
  );
};

export default MessageInput;