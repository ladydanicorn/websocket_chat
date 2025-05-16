import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [room, setRoom] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  
  const [filterUsername, setFilterUsername] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState('');

  useEffect(() => {
    if (filterUsername) {
      setFilteredMessages(messages.filter(msg => 
        msg.username.toLowerCase().includes(filterUsername.toLowerCase())
      ));
    } else {
      setFilteredMessages(messages);
    }
  }, [messages, filterUsername]);

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessages((prev) => {
        const updatedMessages = [...prev, data];
        localStorage.setItem(`chatRoom_${room}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    socket.on('messageEdited', ({ messageIdx, newMessage }) => {
      setMessages(prev => {
        const updatedMessages = [...prev];
        if (updatedMessages[messageIdx]) {
          updatedMessages[messageIdx].message = newMessage;
          updatedMessages[messageIdx].edited = true;
          localStorage.setItem(`chatRoom_${room}`, JSON.stringify(updatedMessages));
        }
        return updatedMessages;
      });
    });

    socket.on('messageDeleted', ({ messageIdx }) => {
      setMessages(prev => {
        const updatedMessages = prev.filter((_, i) => i !== messageIdx);
        localStorage.setItem(`chatRoom_${room}`, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('messageEdited');
      socket.off('messageDeleted');
    };
  }, [room]);

  const joinRoom = () => {
    if (room !== '' && username !== '') {
      socket.emit('joinRoom', room);
      setJoined(true);
      
      const savedMessages = localStorage.getItem(`chatRoom_${room}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  };

  const sendMessage = () => {
    if (message !== '') {
      socket.emit('sendMessage', { room, username, message });
      setMessage('');
    }
  };

  const startEditing = (idx, text) => {
    setEditingId(idx);
    setEditMessage(text);
  };

  const saveEdit = (idx) => {
    const updatedMessages = [...messages];
    updatedMessages[idx].message = editMessage;
    updatedMessages[idx].edited = true;
    
    setMessages(updatedMessages);
    localStorage.setItem(`chatRoom_${room}`, JSON.stringify(updatedMessages));
    
    socket.emit('editMessage', { room, messageIdx: idx, newMessage: editMessage });
    
    setEditingId(null);
    setEditMessage('');
  };

  const deleteMessage = (idx) => {
    const updatedMessages = messages.filter((_, i) => i !== idx);
    
    setMessages(updatedMessages);
    localStorage.setItem(`chatRoom_${room}`, JSON.stringify(updatedMessages));
    
    socket.emit('deleteMessage', { room, messageIdx: idx });
  };

  return (
    <div className="chat-container">
      {!joined ? (
        <div className="join-container">
          <h2>Join a Chat Room</h2>
          <div className="join-inputs">
            <input 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
              placeholder="Room" 
              value={room}
              onChange={(e) => setRoom(e.target.value)} 
            />
            <button 
              className="join-button" 
              onClick={joinRoom}
              disabled={!username || !room}
            >
              Join
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-room">
          <h2>Room: {room}</h2>
          
          {/* Message filtering input */}
          <div className="filter-container">
            <input 
              placeholder="Filter by username" 
              value={filterUsername}
              onChange={(e) => setFilterUsername(e.target.value)} 
              className="filter-input"
            />
          </div>
          
          <div className="messages-container">
            {filteredMessages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.username === username ? 'my-message' : 'other-message'}`}>
                <div className="message-header">
                  <strong>{msg.username}</strong> 
                  <span className="timestamp">[{msg.timestamp}]</span>
                  {msg.edited && <span className="edited-tag">(edited)</span>}
                </div>
                
                {editingId === idx ? (
                  <div className="edit-container">
                    <input 
                      value={editMessage} 
                      onChange={(e) => setEditMessage(e.target.value)} 
                      className="edit-input"
                    />
                    <button onClick={() => saveEdit(idx)} className="edit-button">Save</button>
                    <button onClick={() => setEditingId(null)} className="cancel-button">Cancel</button>
                  </div>
                ) : (
                  <div className="message-content">
                    <p>{msg.message}</p>
                    {msg.username === username && (
                      <div className="message-actions">
                        <button onClick={() => startEditing(idx, msg.message)} className="action-button">Edit</button>
                        <button onClick={() => deleteMessage(idx)} className="action-button">Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="message-input-container">
            <input 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="message-input"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="send-button">Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;