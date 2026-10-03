import { useEffect, useState } from "react";
import { MessageCircle, ArrowLeft } from "lucide-react";
import gsap from "gsap";

import MessageList from "../components/messages/MessageList";
import MessageInput from "../components/messages/MessageInput";

import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

import { useMessage } from "../context/MessageContext";

const Messages = () => {
  // ============================================================
  // MESSAGE CONTEXT
  // ============================================================

  const {
    messages,
    conversations,
    selectedConversation,
    loading,
    error,

    fetchConversations,
    fetchMessages,
    sendMessage,
    markMessagesAsRead,
    selectConversation,
  } = useMessage();

  // ============================================================
  // LOCAL STATE
  // ============================================================

  const [messageError, setMessageError] = useState("");

  // ============================================================
  // LOAD CONVERSATIONS
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const loadConversations = async () => {
      try {
        const result = await fetchConversations();

        if (
          mounted &&
          result &&
          !result.success
        ) {
          setMessageError(
            result.error ||
              "Failed to load conversations."
          );
        }
      } catch (err) {
        if (mounted) {
          setMessageError(
            err?.message ||
              "Failed to load conversations."
          );
        }
      }
    };

    loadConversations();

    return () => {
      mounted = false;
    };
  }, [fetchConversations]);

  // ============================================================
  // SELECTED CONVERSATION ID
  // ============================================================

  const selectedId =
    selectedConversation?._id ||
    selectedConversation?.id ||
    null;

  // ============================================================
  // LOAD MESSAGES WHEN CONVERSATION CHANGES
  // ============================================================

  useEffect(() => {
    if (!selectedId) {
      return;
    }

    let mounted = true;

    const loadMessages = async () => {
      try {
        setMessageError("");

        const result =
          await fetchMessages(selectedId);

        if (
          mounted &&
          result &&
          !result.success
        ) {
          setMessageError(
            result.error ||
              "Failed to load messages."
          );

          return;
        }

        // Mark messages as read after loading them.
        const readResult =
          await markMessagesAsRead(
            selectedId
          );

        if (
          mounted &&
          readResult &&
          !readResult.success
        ) {
          console.warn(
            "Failed to mark messages as read:",
            readResult.error
          );
        }
      } catch (err) {
        if (mounted) {
          setMessageError(
            err?.message ||
              "Failed to load messages."
          );
        }
      }
    };

    loadMessages();

    return () => {
      mounted = false;
    };
  }, [
    selectedId,
    fetchMessages,
    markMessagesAsRead,
  ]);

  // ============================================================
  // GSAP PAGE ANIMATION
  // ============================================================

  useEffect(() => {
    const animation =
      gsap.fromTo(
        ".messages-container",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        }
      );

    return () => {
      animation.kill();
    };
  }, []);

  // ============================================================
  // SELECT CONVERSATION
  // ============================================================

  const handleSelectConversation = (
    conversation
  ) => {
    if (!conversation) {
      return;
    }

    selectConversation(conversation);
    setMessageError("");
  };

  // ============================================================
  // SEND MESSAGE
  // ============================================================

  const handleSendMessage = async ({
    content,
    attachment,
  }) => {
    const conversationId =
      selectedConversation?._id ||
      selectedConversation?.id;

    // Don't send empty message
    if (
      !conversationId ||
      (!content?.trim() && !attachment)
    ) {
      return;
    }

    try {
      setMessageError("");

      const result =
        await sendMessage(
          conversationId,
          content,
          attachment
        );

      if (!result?.success) {
        setMessageError(
          result?.error ||
            "Failed to send message."
        );
      }
    } catch (err) {
      console.error(
        "SEND MESSAGE ERROR:",
        err
      );

      setMessageError(
        err?.message ||
          "Failed to send message."
      );
    }
  };

  // ============================================================
  // CONVERSATION NAME
  // ============================================================

  const getConversationName = (
    conversation
  ) => {
    if (!conversation) {
      return "Conversation";
    }

    if (conversation.name) {
      return conversation.name;
    }

    if (conversation.title) {
      return conversation.title;
    }

    if (
      conversation.participant?.name
    ) {
      return conversation.participant.name;
    }

    if (
      conversation.recipient?.name
    ) {
      return conversation.recipient.name;
    }

    if (conversation.user?.name) {
      return conversation.user.name;
    }

    return "Conversation";
  };

  // ============================================================
  // CONVERSATION ID
  // ============================================================

  const getConversationId = (
    conversation
  ) => {
    return (
      conversation?._id ||
      conversation?.id ||
      null
    );
  };

  // ============================================================
  // RETRY
  // ============================================================

  const handleRetry = async () => {
    try {
      setMessageError("");

      const result =
        await fetchConversations();

      if (!result?.success) {
        setMessageError(
          result?.error ||
            "Failed to load conversations."
        );
      }
    } catch (err) {
      setMessageError(
        err?.message ||
          "Failed to load conversations."
      );
    }
  };

  // ============================================================
  // INITIAL LOADING
  // ============================================================

  if (
    loading &&
    conversations.length === 0
  ) {
    return (
      <div className="min-h-screen bg-slate-950">
        <LoadingSpinner
          fullScreen
          message="Loading messages..."
        />
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="messages-container min-h-screen bg-slate-950 px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
            <MessageCircle size={14} />
            Communication
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Messages
          </h1>

          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            Communicate with scholarship
            administrators and support.
          </p>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {(error || messageError) && (
          <div className="mb-5">
            <ErrorMessage
              message={
                messageError || error
              }
              onRetry={handleRetry}
              showRetry
            />
          </div>
        )}

        {/* =====================================================
            MAIN MESSAGE LAYOUT
        ===================================================== */}

        <div className="grid min-h-[650px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] lg:grid-cols-[320px_1fr]">

          {/* ===================================================
              CONVERSATIONS
          =================================================== */}

          <aside
            className={`border-b border-white/10 bg-slate-950/50 lg:border-b-0 lg:border-r ${
              selectedConversation
                ? "hidden lg:block"
                : "block"
            }`}
          >

            {/* Conversation Header */}

            <div className="border-b border-white/10 p-5">
              <h2 className="font-semibold">
                Conversations
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {conversations.length}{" "}
                conversation
                {conversations.length ===
                1
                  ? ""
                  : "s"}
              </p>
            </div>

            {/* Conversation List */}

            <div className="max-h-[560px] overflow-y-auto">

              {conversations.length ===
              0 ? (
                <div className="p-6 text-center">

                  <MessageCircle
                    size={32}
                    className="mx-auto text-slate-600"
                  />

                  <p className="mt-3 text-sm text-slate-400">
                    No conversations yet.
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Your messages will
                    appear here.
                  </p>

                </div>
              ) : (
                conversations.map(
                  (conversation) => {
                    const id =
                      getConversationId(
                        conversation
                      );

                    if (!id) {
                      return null;
                    }

                    const isSelected =
                      getConversationId(
                        selectedConversation
                      ) === id;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() =>
                          handleSelectConversation(
                            conversation
                          )
                        }
                        className={`w-full border-b border-white/5 px-5 py-4 text-left transition ${
                          isSelected
                            ? "bg-blue-500/10"
                            : "hover:bg-white/[0.04]"
                        }`}
                      >

                        <div className="flex items-start gap-3">

                          {/* Avatar */}

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                            <MessageCircle
                              size={18}
                            />
                          </div>

                          {/* Content */}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-center justify-between gap-2">

                              <h3 className="truncate text-sm font-semibold text-slate-200">
                                {getConversationName(
                                  conversation
                                )}
                              </h3>

                              {conversation?.unreadCount >
                                0 && (
                                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold">
                                  {
                                    conversation.unreadCount
                                  }
                                </span>
                              )}

                            </div>

                            <p className="mt-1 truncate text-xs text-slate-500">
                              {conversation
                                ?.lastMessage
                                ?.content ||
                                conversation?.lastMessage ||
                                "No messages yet"}
                            </p>

                          </div>

                        </div>

                      </button>
                    );
                  }
                )
              )}

            </div>
          </aside>

          {/* ===================================================
              CHAT AREA
          =================================================== */}

          <section
            className={`flex min-h-[650px] flex-col ${
              selectedConversation
                ? "block"
                : "hidden lg:flex"
            }`}
          >

            {!selectedConversation ? (
              /* =================================================
                 NO CONVERSATION SELECTED
              ================================================= */

              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                  <MessageCircle
                    size={30}
                  />
                </div>

                <h2 className="mt-5 text-xl font-semibold">
                  Select a conversation
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Select a conversation
                  from the left to view
                  messages and start
                  chatting.
                </p>

              </div>
            ) : (
              <>
                {/* ==============================================
                    CHAT HEADER
                ============================================== */}

                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">

                  {/* Mobile Back */}

                  <button
                    type="button"
                    onClick={() =>
                      selectConversation(
                        null
                      )
                    }
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft
                      size={19}
                    />
                  </button>

                  {/* Avatar */}

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                    <MessageCircle
                      size={18}
                    />
                  </div>

                  {/* Name */}

                  <div>
                    <h2 className="font-semibold">
                      {getConversationName(
                        selectedConversation
                      )}
                    </h2>

                    <p className="text-xs text-slate-500">
                      Scholarship communication
                    </p>
                  </div>

                </div>

                {/* ==============================================
                    MESSAGES
                ============================================== */}

                <div className="flex-1 overflow-y-auto p-5">

                  <MessageList
                    messages={messages}
                    /*
                     * Authentication is handled by the backend.
                     * We intentionally do not use useAuth() here.
                     */
                    currentUserId={null}
                    loading={loading}
                  />

                </div>

                {/* ==============================================
                    MESSAGE INPUT
                ============================================== */}

                <div className="border-t border-white/10 p-4">

                  <MessageInput
                    onSend={
                      handleSendMessage
                    }
                    disabled={loading}
                    placeholder="Write a message..."
                  />

                </div>
              </>
            )}

          </section>
        </div>
      </div>
    </div>
  );
};

export default Messages;