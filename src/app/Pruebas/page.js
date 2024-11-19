"use client";

import React, { useState } from 'react';
import ChatPage from '../components/ChatPage';  // Asegúrate de importar tu componente de chat
import '../App.css';  // Importamos los estilos

const Home = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(prevState => !prevState);
  };

  return (
    <div style={{ height: '100vh', background: '#f0f0f0' }}>

      {/* Botón flotante de chat */}
      <div className="chat-button" onClick={toggleChat}>
        <i className="chat-icon fa fa-comments"></i>
      </div>
      {/* El chat solo se muestra si isChatOpen es verdadero */}
      {isChatOpen && (
        <div className="chat-container">
          <ChatPage />
        </div>
      )}
      {/* FontAwesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />
    </div>
  );
};

export default Home;
