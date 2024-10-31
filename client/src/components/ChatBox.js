// src/components/ChatBox.js
import React from 'react';

function ChatBox({ messages }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', height: '300px', overflowY: 'scroll' }}>
      {messages.map((msg, index) => (
        <div key={index} style={{ color: msg.color }}>
         <span style={{ fontSize: '0.8em', color: '#888' }}>{msg.timestamp}</span> <strong>{msg.displayName}</strong> : {msg.message}
        </div>
      ))}
    </div>
  );
}

export default ChatBox;
