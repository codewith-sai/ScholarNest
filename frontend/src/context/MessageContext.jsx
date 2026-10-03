import { createContext, useCallback, useContext, useState } from "react";
import api from "../services/api";

const MessageContext = createContext(null);

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/messages/conversations");

      const data = response?.data?.data ?? response?.data;

      const conversationList = Array.isArray(data)
        ? data
        : data?.conversations || [];

      setConversations(conversationList);

      return {
        success: true,
        data: conversationList,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch conversations.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages of a conversation
  const fetchMessages = useCallback(async (conversationId) => {
    try {
      setLoading(true);
      setError(null);

      if (!conversationId) {
        throw new Error("Conversation ID is required.");
      }

      const response = await api.get(
        `/messages/conversations/${conversationId}`
      );

      const data = response?.data?.data ?? response?.data;

      const messageList = Array.isArray(data)
        ? data
        : data?.messages || [];

      setMessages(messageList);

      

      return {
        success: true,
        data: messageList,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch messages.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Send message
  const sendMessage = async (
    conversationId,
    content,
    attachment = null
  ) => {
    try {
      setError(null);

      if (!conversationId) {
        throw new Error("Conversation ID is required.");
      }

      if (!content?.trim() && !attachment) {
        throw new Error("Message cannot be empty.");
      }

      const formData = new FormData();

      if (content?.trim()) {
        formData.append("content", content.trim());
      }

      if (attachment) {
        formData.append("attachment", attachment);
      }

      const response = await api.post(
        `/messages/conversations/${conversationId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newMessage =
        response?.data?.data ?? response?.data;

      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }

      return {
        success: true,
        data: newMessage,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send message.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    }
  };

  // Start a new conversation
  const createConversation = async (participantId, initialMessage = "") => {
    try {
      setLoading(true);
      setError(null);

      if (!participantId) {
        throw new Error("Participant ID is required.");
      }

      const response = await api.post("/messages/conversations", {
        participantId,
        message: initialMessage,
      });

      const conversation =
        response?.data?.data ?? response?.data;

      if (conversation) {
        setConversations((prev) => {
          const conversationId =
            conversation?._id || conversation?.id;

          const exists = prev.some(
            (item) =>
              String(item?._id || item?.id) ===
              String(conversationId)
          );

          return exists ? prev : [conversation, ...prev];
        });
      }

      return {
        success: true,
        data: conversation,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create conversation.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setLoading(false);
    }
  };

  // Mark conversation messages as read
  const markMessagesAsRead = useCallback(async (conversationId) => {
  try {
    setError(null);

    if (!conversationId) {
      throw new Error("Conversation ID is required.");
    }

    const response = await api.patch(
      `/messages/conversations/${conversationId}/read`
    );

    setMessages((prev) =>
      prev.map((message) => ({ ...message, isRead: true, read: true }))
    );

    setConversations((prev) =>
      prev.map((conversation) => {
        const id = conversation?._id || conversation?.id;
        return String(id) === String(conversationId)
          ? { ...conversation, unreadCount: 0 }
          : conversation;
      })
    );

    return { success: true, data: response?.data?.data ?? response?.data };
  } catch (err) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to mark messages as read.";
    setError(message);
    return { success: false, error: message };
  }
}, []);

  // Delete a message
  const deleteMessage = async (messageId) => {
    try {
      setError(null);

      if (!messageId) {
        throw new Error("Message ID is required.");
      }

      await api.delete(`/messages/${messageId}`);

      setMessages((prev) =>
        prev.filter((message) => {
          const id = message?._id || message?.id;

          return String(id) !== String(messageId);
        })
      );

      return {
        success: true,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete message.";

      setError(message);

      return {
        success: false,
        error: message,
      };
    }
  };

  // Select conversation
 const selectConversation = useCallback((conversation) => {
  setSelectedConversation(conversation);
  setMessages([]);
}, []);

  // Clear selected conversation
  const clearSelectedConversation = () => {
    setSelectedConversation(null);
    setMessages([]);
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  const value = {
    messages,
    conversations,
    selectedConversation,
    loading,
    error,

    fetchConversations,
    fetchMessages,
    sendMessage,
    createConversation,
    markMessagesAsRead,
    deleteMessage,

    selectConversation,
    clearSelectedConversation,
    clearMessages,
    clearError,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error(
      "useMessage must be used inside a MessageProvider"
    );
  }

  return context;
};

export default MessageContext;