// src/components/Chat/ChatMessage.tsx
import React from 'react';

interface Props {
  role: 'user' | 'assistant';
  content: string;
}

const ChatMessage: React.FC<Props> = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-md ${
          isUser
            ? 'bg-gradient-to-r from-primary to-primary-dark text-white rounded-br-md'
            : 'bg-card-secondary text-primary-text rounded-bl-md border border-border-color'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;