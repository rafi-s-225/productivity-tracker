import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const login = (id, name) => {
    localStorage.setItem('userId', id);
    localStorage.setItem('username', name);
    setUserId(id);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    setUserId(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ userId, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}