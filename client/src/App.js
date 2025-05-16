import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
      localStorage.setItem('chatMessages', JSON.stringify([...messages, data]));
    });

    return () => socket.disconnect();
  }, []);

  const joinRoom = () => {
    if (room !== '') {
      socket.emit('joinRoom', room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message !== '') {
      socket.emit('sendMessage', { room, username, message });
      setMessage('');
    }
  };

  return (
    <div>
      {!joined ? (
        <div>
          <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Room" onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Room: {room}</h2>
          <div>
            {messages.map((msg, idx) => (
              <div key={idx}>
                <strong>{msg.username}</strong> [{msg.timestamp}]: {msg.message}
              </div>
            ))}
          </div>
          <input value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;

