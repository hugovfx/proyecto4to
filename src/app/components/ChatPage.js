import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import '../App.css';

const ChatPage = ({ chat }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [selectingMessages, setSelectingMessages] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const roomId = chat;

  useEffect(() => {
    const q = query(
      collection(db, 'rooms', roomId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messageList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    try {
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: input,
        name: user.displayName,
        uid: user.uid,
        timestamp: serverTimestamp(),
      });
      setInput('');
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }
  };

  const deleteMessages = async () => {
    try {
      for (let messageId of selectedMessages) {
        const messageToDelete = messages.find(
          (message) => message.id === messageId
        );
        if (messageToDelete && messageToDelete.uid === user.uid) {
          await deleteDoc(doc(db, 'rooms', roomId, 'messages', messageId));
        }
      }
      setSelectedMessages([]);
      setSelectingMessages(false);
    } catch (error) {
      console.error('Error al eliminar los mensajes:', error);
    }
  };

  const handleCheckboxChange = (messageId) => {
    const message = messages.find((msg) => msg.id === messageId);
    if (message?.uid === user.uid) {
      setSelectedMessages((prevSelectedMessages) => {
        if (prevSelectedMessages.includes(messageId)) {
          return prevSelectedMessages.filter((id) => id !== messageId);
        } else {
          return [...prevSelectedMessages, messageId];
        }
      });
    }
  };

  return (
    <div style={{ padding: '0px', height: '100%', overflowY: 'auto' }}>
      {!user ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh',
          }}
        >
          <button
            onClick={handleLogin}
            style={{
              padding: '6px',
              marginBottom: '10px',
              backgroundColor: 'rgb(0,0,0,0.0)',
              border: 'solid 2px #424ea5',
              fontSize: '18px',
              color: '#424ea5',
            }}
          >
            Iniciar sesión con Google
          </button>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '90%',
              justifyContent: 'space-between',
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                padding: '6px',
                marginBottom: '10px',
                backgroundColor: 'rgb(0,0,0,0.0)',
                border: 'solid 2px #a54242',
                fontSize: '18px',
                color: '#a54242',
              }}
            >
              Cerrar sesión
            </button>
            <button
              onClick={() => setSelectingMessages(!selectingMessages)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                color: '#a54242',
              }}
            >
              <i className="fa fa-trash" />
            </button>
          </div>
          <div className="chat-div">
            <div className="messages-container">
              {messages.length === 0 ? (
                <div>No hay mensajes en esta sala.</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '10px',
                    }}
                  >
                    {selectingMessages && message.uid === user.uid && (
                      <input
                        type="checkbox"
                        checked={selectedMessages.includes(message.id)}
                        onChange={() => handleCheckboxChange(message.id)}
                        style={{ marginRight: '10px' }}
                      />
                    )}
                    <div
                      className="message-bubble"
                      style={{
                        backgroundColor:
                          message.uid === user.uid ? 'lightblue' : 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        width: '80%',
                      }}
                    >
                      <div className="message-name">
                        {message.name || 'Anónimo'}
                      </div>
                      <div className="message-text">{message.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectingMessages && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <button
                  onClick={deleteMessages}
                  style={{
                    padding: '6px',
                    marginBottom: '10px',
                    backgroundColor: 'rgb(0,0,0,0.0)',
                    border: 'solid 2px #a54242',
                    fontSize: '18px',
                    color: '#a54242',
                  }}
                >
                  Borrar mensajes
                </button>
              </div>
            )}

            <form
              onSubmit={sendMessage}
              style={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-around',
                position: 'absolute',
                bottom: '0px',
                width: '90%',
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje"
                style={{
                  width: '80%',
                  borderRadius: '8px',
                  border: '0px solid #ccc',
                  color: 'white',
                  fontSize: '18px',
                  backgroundColor: '#000318',
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#384390',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  display: 'flex',
                  padding: '15px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <i className="fa fa-paper-plane" style={{ fontSize: '18px' }}></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
