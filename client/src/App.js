import React, { useEffect, useState } from 'react';
import socket from './socket';
import ChatBox from './components/ChatBox';
import MessageInput from './components/MessageInput';

function App() {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState('');
  const [isNicknameSet, setIsNicknameSet] = useState(false);
  const [typingUser, setTypingUser] = useState('');

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('typing', (user) => {
      setTypingUser(user);
    });

    socket.on('stop typing', () => {
      setTypingUser('');
    });

    return () => {
      socket.off('chat message');
      socket.off('typing');
      socket.off('stop typing');
    };
  }, []);

  const handleNicknameSubmit = (e) => {
    e.preventDefault();
    if (nickname.trim()) {
      socket.emit('set-nickname', nickname);
      setIsNicknameSet(true);
    }
  };

  const handleSendMessage = (message) => {
    socket.emit('chat message', message);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>React and Socket.IO Chat</h1>
      {!isNicknameSet ? (
        <form onSubmit={handleNicknameSubmit} style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Enter your nickname"
            required
          />
          <button type="submit">Join Chat</button>
        </form>
      ) : (
        <>
          <ChatBox messages={messages} />
          {typingUser && <p>{typingUser} is typing...</p>}
          <MessageInput onSendMessage={handleSendMessage} />
        </>
      )}
    </div>
  );
}

export default App;
