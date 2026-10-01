import { useMemo, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  MessageCircle,
  Search,
  Send,
  User,
  X,
} from "lucide-react";

const demoConversations = [
  {
    id: 1,
    name: "ScholarNet Support",
    message: "Welcome to ScholarNet!",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Scholarship Updates",
    message: "A new scholarship is available.",
    time: "Yesterday",
    unread: 1,
    online: false,
  },
  {
    id: 3,
    name: "Application Support",
    message: "Your application status was updated.",
    time: "Mon",
    unread: 0,
    online: true,
  },
];

const demoMessages = {
  1: [
    {
      id: 1,
      sender: "other",
      text: "Hello! Welcome to ScholarNet.",
      time: "10:28 AM",
    },
    {
      id: 2,
      sender: "other",
      text: "How can we help you today?",
      time: "10:29 AM",
    },
    {
      id: 3,
      sender: "me",
      text: "I want to find scholarships that match my profile.",
      time: "10:30 AM",
    },
  ],

  2: [
    {
      id: 1,
      sender: "other",
      text: "A new scholarship matching engineering students is available.",
      time: "Yesterday",
    },
  ],

  3: [
    {
      id: 1,
      sender: "other",
      text: "Your application status has been updated.",
      time: "Mon",
    },
  ],
};

const demoNotifications = [
  {
    id: 1,
    title: "New scholarship match",
    message:
      "A scholarship matching your profile has been added.",
    time: "5 minutes ago",
    read: false,
    type: "scholarship",
  },
  {
    id: 2,
    title: "Deadline approaching",
    message:
      "Your saved scholarship deadline is approaching.",
    time: "2 hours ago",
    read: false,
    type: "deadline",
  },
  {
    id: 3,
    title: "Application update",
    message:
      "Your application tracking status was updated.",
    time: "Yesterday",
    read: true,
    type: "application",
  },
];

const MessageCenter = ({
  isOpen = true,
  onClose,
}) => {
  const [activeTab, setActiveTab] =
    useState("messages");

  const [conversations, setConversations] =
    useState(demoConversations);

  const [messages, setMessages] =
    useState(demoMessages);

  const [notifications, setNotifications] =
    useState(demoNotifications);

  const [selectedConversation, setSelectedConversation] =
    useState(demoConversations[0]);

  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");

  const [mobileChatOpen, setMobileChatOpen] =
    useState(false);

  const unreadNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.read
      ).length,
    [notifications]
  );

  const unreadMessages = useMemo(
    () =>
      conversations.reduce(
        (total, conversation) =>
          total + conversation.unread,
        0
      ),
    [conversations]
  );

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter(
      (conversation) =>
        conversation.name
          .toLowerCase()
          .includes(query) ||
        conversation.message
          .toLowerCase()
          .includes(query)
    );
  }, [conversations, search]);

  const activeMessages =
    messages[selectedConversation?.id] || [];

  const handleSelectConversation = (
    conversation
  ) => {
    setSelectedConversation(conversation);

    setConversations((current) =>
      current.map((item) =>
        item.id === conversation.id
          ? {
              ...item,
              unread: 0,
            }
          : item
      )
    );

    setMobileChatOpen(true);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    const text = message.trim();

    if (!text || !selectedConversation) {
      return;
    }

    const newMessage = {
      id: Date.now(),
      sender: "me",
      text,
      time: new Date().toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };

    setMessages((current) => ({
      ...current,
      [selectedConversation.id]: [
        ...(current[selectedConversation.id] || []),
        newMessage,
      ],
    }));

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id ===
        selectedConversation.id
          ? {
              ...conversation,
              message: text,
              time: "Now",
            }
          : conversation
      )
    );

    setMessage("");
  };

  const markNotificationRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              read: true,
            }
          : notification
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-3 backdrop-blur-sm sm:p-5">
      <div className="flex h-[90vh] w-full max-w-6xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Sidebar */}
        <aside
          className={`w-full shrink-0 border-r border-slate-200 bg-white md:w-80 ${
            mobileChatOpen
              ? "hidden md:block"
              : "block"
          }`}
        >
          {/* Header */}
          <div className="border-b border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Message Center
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Messages and notifications
                </p>
              </div>

              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close message center"
                >
                  <X size={19} />
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="mt-4 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() =>
                  setActiveTab("messages")
                }
                className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                  activeTab === "messages"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle size={15} />
                  Messages

                  {unreadMessages > 0 && (
                    <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] text-white">
                      {unreadMessages}
                    </span>
                  )}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveTab("notifications")
                }
                className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                  activeTab === "notifications"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <Bell size={15} />
                  Alerts

                  {unreadNotifications > 0 && (
                    <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                      {unreadNotifications}
                    </span>
                  )}
                </span>
              </button>
            </div>
          </div>

          {activeTab === "messages" ? (
            <>
              {/* Search */}
              <div className="border-b border-slate-100 p-3">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search conversations..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="h-[calc(90vh-165px)] overflow-y-auto">
                {filteredConversations.length ===
                0 ? (
                  <div className="p-6 text-center">
                    <MessageCircle
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-bold text-slate-600">
                      No conversations found
                    </p>
                  </div>
                ) : (
                  filteredConversations.map(
                    (conversation) => (
                      <button
                        key={conversation.id}
                        type="button"
                        onClick={() =>
                          handleSelectConversation(
                            conversation
                          )
                        }
                        className={`flex w-full gap-3 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                          selectedConversation?.id ===
                          conversation.id
                            ? "bg-indigo-50/70"
                            : ""
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                            <User size={19} />
                          </div>

                          {conversation.online && (
                            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-bold text-slate-900">
                              {conversation.name}
                            </p>

                            <span className="shrink-0 text-[10px] text-slate-400">
                              {conversation.time}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center justify-between gap-2">
                            <p className="truncate text-xs text-slate-500">
                              {conversation.message}
                            </p>

                            {conversation.unread >
                              0 && (
                              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    )
                  )
                )}
              </div>
            </>
          ) : (
            /* Notifications */
            <div className="h-[calc(90vh-165px)] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <p className="text-xs font-bold text-slate-500">
                  Notifications
                </p>

                {unreadNotifications > 0 && (
                  <button
                    type="button"
                    onClick={
                      markAllNotificationsRead
                    }
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {notifications.map(
                (notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      markNotificationRead(
                        notification.id
                      )
                    }
                    className={`w-full border-b border-slate-100 p-4 text-left transition hover:bg-slate-50 ${
                      !notification.read
                        ? "bg-indigo-50/40"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <Bell size={17} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-bold text-slate-900">
                            {notification.title}
                          </p>

                          {!notification.read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                          )}
                        </div>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-[10px] text-slate-400">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          )}
        </aside>

        {/* Chat */}
        <section
          className={`flex min-w-0 flex-1 flex-col bg-slate-50 ${
            mobileChatOpen
              ? "flex"
              : "hidden md:flex"
          }`}
        >
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={() =>
                setMobileChatOpen(false)
              }
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
              aria-label="Back to conversations"
            >
              ←
            </button>

            {selectedConversation ? (
              <>
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                    <User size={18} />
                  </div>

                  {selectedConversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-black text-slate-900">
                    {selectedConversation.name}
                  </h3>

                  <p className="text-xs text-slate-500">
                    {selectedConversation.online
                      ? "Online"
                      : "Offline"}
                  </p>
                </div>
              </>
            ) : (
              <p className="font-bold text-slate-700">
                Select a conversation
              </p>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeMessages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-center">
                <div>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500">
                    <MessageCircle size={28} />
                  </div>

                  <h3 className="mt-4 font-black text-slate-900">
                    Start a conversation
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Send a message to get started.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex max-w-3xl flex-col gap-3">
                {activeMessages.map(
                  (item) => (
                    <div
                      key={item.id}
                      className={`flex ${
                        item.sender === "me"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[65%] ${
                          item.sender === "me"
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                            item.sender === "me"
                              ? "rounded-br-md bg-indigo-600 text-white"
                              : "rounded-bl-md bg-white text-slate-700 shadow-sm"
                          }`}
                        >
                          {item.text}
                        </div>

                        <div
                          className={`mt-1 flex items-center gap-1 text-[10px] text-slate-400 ${
                            item.sender === "me"
                              ? "justify-end"
                              : ""
                          }`}
                        >
                          {item.time}

                          {item.sender === "me" && (
                            <CheckCheck
                              size={13}
                              className="text-indigo-500"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Message input */}
          <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
            <form
              onSubmit={handleSendMessage}
              className="mx-auto flex max-w-3xl items-end gap-2"
            >
              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Type your message..."
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <button
                type="submit"
                disabled={!message.trim()}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MessageCenter;