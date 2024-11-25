"use client";

import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";  // Importamos todo lo necesario
import { auth } from "../../firebase";  // Asegúrate de que auth esté importado
import "./Navbar.css";

function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);  // Inicia sesión con Google
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);  // Cierra sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="Nav">
      <div className="divNav">
        <img
          src="/spider-white.png"
          alt="logo exploitdb"
          style={{ width: "30%", height: "auto", alignSelf: "center" }}
        />
      </div>

      <div className="divNav">
        <Button size="large" href="/">
          Home
        </Button>
      </div>
      <div className="divNav">
        <Button size="large" href="/">
          Home
        </Button>
      </div>
      <div className="divNav">
        <Button size="large" href="/">
          Home
        </Button>
      </div>
      <div className="divNav">
        {!user ? (
          <Button size="large" color="error" onClick={handleLogin}>
            Iniciar sesión
          </Button>
        ) : (
          <Button size="large" color="error" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        )}
      </div>
    </div>
  );
}

export default Nav;
