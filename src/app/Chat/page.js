"use client";

import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from 'firebase/firestore';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const roomId = "nmap";  // Sala por defecto

  // Obtener mensajes de la sala "nmap"
  useEffect(() => {
    const q = query(collection(db, 'rooms', roomId, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messageList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messageList);
    }, (error) => {
      console.error("Error al cargar los documentos:", error);
    });

    return () => unsubscribe();
  }, [roomId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '' || name.trim() === '') return;

    try {
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: input,
        name: name,
        timestamp: serverTimestamp(),
      });
      setInput('');
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', paddingTop: '30px', height: '80vh' }}>
        <div style={{ width: '40%', padding: '0px', borderRadius: '10px', background: '#dcc7dc' }}>
          <h1 style={{ fontSize: '20px', width: '100%', background: '#c5a1c5', paddingLeft: '15px', color: '#5a3e5a', borderRadius: '10px 10px 0px 0px' }}>Sala {roomId}</h1>
          <div style={{ margin: '15px' }}>
            {messages.length === 0 ? (
              <div>No hay mensajes en esta sala.</div>
            ) : (
              messages.map(message => (
                <div key={message.id}>
                  <strong>{message.name || 'Anónimo'}: </strong>
                  {message.text}
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={sendMessage} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', paddingTop: '30px', height: '80vh' }}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            required
            style={styles.input}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            required
            style={styles.input}
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  input: {
    color: 'black',
    textAlign: 'center',
    alignItems: 'center'
  }
};

export default ChatPage;
