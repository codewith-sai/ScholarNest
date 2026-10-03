import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Check, CheckCheck } from "lucide-react";

const MessageCard = ({
  message,
  isOwn = false,
  showSender = true,
}) => {
  const messageRef = useRef(null);

  useEffect(() => {
    if (!messageRef.current) return;

    gsap.fromTo(
      messageRef.current,
      {
        opacity: 0,
        y: 12,
        scale: 0.98,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
      }
    );
  }, []);

  const formatTime = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (!message) return null;

  return (
    <div
      ref={messageRef}
      className={`flex w-full ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[85%] items-end gap-2 sm:max-w-[70%] ${
          isOwn ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        {!isOwn && (
          <div className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
            {message.sender?.profileImage ? (
              <img
                src={message.sender.profileImage}
                alt={message.sender?.name || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              message.sender?.name?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
        )}

        {/* Message */}
        <div>
          {showSender && !isOwn && message.sender?.name && (
            <p className="mb-1 px-1 text-xs font-medium text-gray-500">
              {message.sender.name}
            </p>
          )}

          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isOwn
                ? "rounded-br-md bg-indigo-600 text-white"
                : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
            }`}
          >
            {/* Text */}
            {message.content && (
              <p className="whitespace-pre-wrap break-words text-sm leading-6">
                {message.content}
              </p>
            )}

            {/* Attachment */}
            {message.attachment?.url && (
              <a
                href={message.attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-2 block rounded-lg p-2 text-xs underline ${
                  isOwn
                    ? "bg-indigo-500 text-white"
                    : "bg-gray-50 text-indigo-600"
                }`}
              >
                {message.attachment.name || "View attachment"}
              </a>
            )}

            {/* Time + Read Status */}
            <div
              className={`mt-1 flex items-center justify-end gap-1 ${
                isOwn ? "text-indigo-100" : "text-gray-400"
              }`}
            >
              <span className="text-[10px]">
                {formatTime(message.createdAt || message.timestamp)}
              </span>

              {isOwn &&
                (message.read ? (
                  <CheckCheck size={14} />
                ) : (
                  <Check size={14} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;