// src/components/Chat/TypingIndicator.tsx
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2">
      <div 
        className="w-2.5 h-2.5 bg-primary rounded-full"
        style={{
          animation: 'bounce 0.6s infinite ease-in-out',
          animationDelay: '0ms'
        }}
      ></div>
      <div 
        className="w-2.5 h-2.5 bg-primary rounded-full"
        style={{
          animation: 'bounce 0.6s infinite ease-in-out',
          animationDelay: '0.15s'
        }}
      ></div>
      <div 
        className="w-2.5 h-2.5 bg-primary rounded-full"
        style={{
          animation: 'bounce 0.6s infinite ease-in-out',
          animationDelay: '0.3s'
        }}
      ></div>
    </div>
  );
};

export default TypingIndicator;