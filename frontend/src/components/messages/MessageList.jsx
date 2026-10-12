import { useEffect, useRef } from "react";
import gsap from "gsap";
import MessageCard from "./MessageCard";

const MessageList = ({
  messages = [],
  currentUserId,
  loading = false,
}) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current || loading || messages.length === 0) return;

    const messageElements =
      listRef.current.querySelectorAll("[data-message]");

    gsap.fromTo(
      messageElements,
      {
        opacity: 0,
        y: 15,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.05,
        ease: "power3.out",
      }
    );
  }, [messages, loading]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center py-10">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
          Loading messages...
        </div>
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex h-full min-h-64 items-center justify-center px-6 py-10">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a10.7 10.7 0 01-4.19-.84L3 20l1.47-3.53A7.7 7.7 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-sm font-semibold text-gray-800">
            No messages yet
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            Start a conversation to see your messages here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="flex flex-col gap-3 overflow-y-auto px-4 py-5 sm:px-6"
    >
      {messages.map((message) => {
        const senderId =
          message.sender?._id ||
          message.sender?.id ||
          message.senderId;

        const isOwn =
          String(senderId) === String(currentUserId);

        return (
          <div
            key={message._id || message.id}
            data-message
          >
            <MessageCard
              message={message}
              isOwn={isOwn}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;