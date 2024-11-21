import React, { useEffect, useState } from 'react';
import { db, auth } from '../../firebase'; // Asegúrate de que `auth` esté exportado desde tu configuración de Firebase
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from 'firebase/firestore';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import '../App.css';

const ChatPage = ({chat}) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const roomId = chat; // Sala por defecto "nmap"

  // Obtener mensajes de Firestore
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

  // Monitorear el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Manejar inicio de sesión con Google
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  // Manejar cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Enviar un mensaje
  const sendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    try {
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: input,
        name: user.displayName,
        uid: user.uid,  // Guardar el UID del usuario
        timestamp: serverTimestamp(),
      });      
      setInput('');
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <div style={{ padding: '0px', height: '100%', overflowY: 'auto'}}>
      {!user ? (
        <button onClick={handleLogin} style={{ padding: '10px', marginBottom: '20px' }}>
          Iniciar sesión con Google
        </button>
      ) : (
        <div>
            <button onClick={handleLogout} style={{ padding: '10px', marginBottom: '10px' }}>
              Cerrar sesión
            </button>
          <div className='chat-div'>
          {messages.length === 0 ? (
            <div>No hay mensajes en esta sala.</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className="message-bubble"
                style={{
                  backgroundColor: message.uid === user.uid ? 'lightblue' : 'white',  // Resaltar el mensaje del usuario actual
                }}
              >
                <div className="message-name">{message.name || 'Anónimo'}</div>
                <div className="message-text">{message.text}</div>
              </div>
            ))
          )}
          </div>

          <form onSubmit={sendMessage} style={{ display: "flex", alignItems: "center", flexDirection:"row", justifyContent: "space-around", position:"absolute", bottom:"0px"}}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje"
              style={{
                width: "80%",
                borderRadius: "8px",
                border: "0px solid #ccc",
                color: "white",
                fontSize: "18px",  
                backgroundColor:"black",
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: "green",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <i className="fa fa-paper-plane" style={{ fontSize: "18px" }}></i>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
