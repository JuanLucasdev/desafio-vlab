import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.get(`http://localhost:3000/users`, {
        params: { email, password },
      });

      if (data.length > 0) {
        const loggedUser = data[0];
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return { success: true };
      } else {
        return { success: false, message: "Credenciais inválidas." };
      }
    } catch (err) {
      return { success: false, message: "Erro ao conectar ao servidor." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
