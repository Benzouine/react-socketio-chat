// src/components/MessageInput.js
import React, { useState } from 'react';
import socket from '../socket';

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit('typing');
    }

    // Stop typing after a delay
    clearTimeout(window.typingTimeout);
    window.typingTimeout = setTimeout(() => {
      setTyping(false);
      socket.emit('stop typing');
    }, 1000); // 1 second delay
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage('');
    setTyping(false);
    socket.emit('stop typing'); // Emit stop typing when message is sent
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '10px' }}>
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type a message..."
        required
        style={{ flex: 1, marginRight: '10px' }}
      />
      <button type="submit">Send</button>
    </form>
  );
}

export default MessageInput;
