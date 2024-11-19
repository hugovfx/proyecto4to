"use client";

import React, { useState } from 'react';
import ChatPage from '../components/ChatPage';  // Asegúrate de importar tu componente de chat
import '../App.css';  // Importamos los estilos

const ButtonChat = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  return (
    <div style={{ height: '100vh', background: '#f0f0f0' }}>

      <div className="chat-button" onClick={toggleChat}>
        <i className="chat-icon fa fa-comments"></i>
      </div>
      {isChatOpen && (
        <div className="chat-container">
          <ChatPage />
        </div>
      )}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </div>
  );
};

export default ButtonChat;
