// src/components/Chat/ChatWidget.tsx
import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { useChat } from "../hooks/useChat";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, sendMessage, isLoading, error, clearChat } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleChat = () => {
    if (isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;
    const message = inputValue;
    setInputValue("");
    // reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 group"
        aria-label="Open chat"
      >
        <i className="fa-regular fa-comment-dots text-2xl group-hover:scale-110 transition-transform"></i>
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] bg-card rounded-2xl shadow-2xl border border-border-color flex flex-col overflow-hidden ${
            isClosing ? "animate-slideOutBottom" : "animate-slideInBottom"
          }`}
          style={{ height: "560px", maxHeight: "75vh" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary-dark px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-full">
                <i className="fa-solid fa-robot text-white text-sm"></i>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">
                  AI Assistant
                </h3>
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-white/80 text-xs">Online</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
                title="Clear chat"
              >
                <i className="fa-regular fa-trash-can text-sm"></i>
              </button>
              <button
                onClick={toggleChat}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20"
                title="Close"
              >
                <i className="fa-regular fa-times text-sm"></i>
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-card to-card/95">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-tertiary-text">
                <div className="bg-primary/10 p-4 rounded-full mb-3">
                  <i className="fa-regular fa-message text-3xl text-primary"></i>
                </div>
                <p className="text-sm font-medium">Ask me anything!</p>
                <p className="text-xs mt-1">
                  About my portfolio, skills, or experience.
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}
            {isLoading &&
              (() => {
                return (
                  <div className="flex justify-start">
                    <div className="bg-card-secondary rounded-2xl rounded-bl-none px-4 py-2 shadow-sm">
                      <TypingIndicator />
                    </div>
                  </div>
                );
              })()}
            {error && (
              <div className="text-center text-danger text-xs mt-2 bg-danger/10 rounded-lg py-2 px-3">
                <i className="fa-regular fa-circle-exclamation mr-1"></i>
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-border-color bg-card-secondary">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full resize-none rounded-xl border border-border-color bg-card text-primary-text px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  disabled={isLoading}
                  style={{ maxHeight: "120px" }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                className="bg-primary text-white rounded-xl px-4 py-2 hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <i className="fa-regular fa-paper-plane"></i>
              </button>
            </div>
            <p className="text-xs text-tertiary-text mt-2 text-center">
              Press{" "}
              <kbd className="px-1 py-0.5 bg-card rounded text-xs">Enter</kbd>{" "}
              to send
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
