import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (userId, username) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    setUser({ userId, username });
  };

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
