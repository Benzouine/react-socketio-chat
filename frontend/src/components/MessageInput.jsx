// src/components/MessageInput.js
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import socket from '../socket';

function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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
    }, 1000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage('');
    setTyping(false);
    socket.emit('stop typing');
  };

  // Toggle emoji picker visibility
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Add emoji to the message
  const addEmoji = (emojiObject) => {
    if (emojiObject && emojiObject.emoji) {
      setMessage((prev) => prev + emojiObject.emoji); // Add emoji to the message
    }
    setShowEmojiPicker(false); // Close emoji picker after selection
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div style={{ position: 'absolute', bottom: '50px', right: '0px' }}>
          <EmojiPicker onEmojiClick={addEmoji} />
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '10px' }}>
        {/* Emoji Toggle Button */}
        <button type="button" onClick={toggleEmojiPicker} style={{ marginRight: '5px' }}>
          😀
        </button>

        {/* Message Input */}
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
          required
          style={{ flex: 1, marginRight: '10px' }}
        />

        {/* Send Button */}
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default MessageInput;
