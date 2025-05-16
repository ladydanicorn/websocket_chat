WebSocket Chat Application
A real-time chat application built with React, Node.js, Express, and Socket.IO.
Features

Real-time messaging using WebSocket technology (Socket.IO)
Chat rooms for organized conversations
Message persistence using localStorage to maintain chat history
Username filtering to view messages from specific users
Message editing and deletion with real-time updates for all users
Timestamps for each message
Visual indicators for your messages vs. others' messages
Responsive design for both desktop and mobile

Tech Stack

Frontend: React.js
Backend: Node.js, Express
WebSockets: Socket.IO
Data Storage: Browser localStorage
Styling: CSS

Project Structure
websocket-chat/
│
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── App.js          # Main application component
│   │   ├── App.css         # Application styles
│   │   ├── index.js        # React entry point
│   │   └── ...             # Other React files
│   └── package.json        # Frontend dependencies
│
└── server/                 # Node.js backend
    ├── index.js            # Express server & Socket.IO setup
    └── package.json        # Backend dependencies
Installation
Prerequisites

Node.js (>= 14.x)
npm (>= 6.x)

Setup Instructions

Clone the repository

git clone https://github.com/yourusername/websocket-chat.git
cd websocket-chat

Install and start the server

cd server
npm install
node index.js
The server will run on http://localhost:3001.

Install and start the client

In a new terminal window:
cd client
npm install
npm start
The React app will start on http://localhost:3000.
Usage

Open http://localhost:3000 in your browser
Enter a username and room name
Click "Join" to enter the chat room
Type messages in the input field and click "Send" or press Enter
Use the filter input to see only messages from specific users
Hover over your own messages to edit or delete them

WebSocket Events
The application uses the following Socket.IO events:

connection: Triggered when a user connects to the WebSocket server
joinRoom: Emitted when a user joins a chat room
sendMessage: Emitted when a user sends a message
receiveMessage: Received when there's a new message in the room
editMessage: Emitted when a user edits their message
messageEdited: Received when a message has been edited
deleteMessage: Emitted when a user deletes their message
messageDeleted: Received when a message has been deleted
disconnect: Triggered when a user disconnects from the server

LocalStorage
The application uses browser localStorage to persist chat messages. Each room's messages are stored with a unique key in the format chatRoom_${roomName}. This allows users to see previous messages when rejoining a room, even after closing the browser.
Future Enhancements
Potential improvements for future development:

User authentication
Server-side message persistence with a database
File and image sharing
Typing indicators
Read receipts
User presence indicators (online/offline)
Message reactions/emojis
Private messaging
Push notifications

License
This project is licensed under the MIT License - see the LICENSE file for details.
Acknowledgments

This project was created as part of a web development course.
WebSockets implementation powered by Socket.IO.