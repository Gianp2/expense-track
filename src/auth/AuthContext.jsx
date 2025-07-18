import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const getStoredUser = () => JSON.parse(localStorage.getItem("user"));
const getAllUsers = () => JSON.parse(localStorage.getItem("users")) || [];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = getAllUsers();
    const existing = users.find(u => u.email === email && u.password === password);
    if (existing) {
      localStorage.setItem("user", JSON.stringify(existing));
      setUser(existing);
      return { success: true };
    }
    return { success: false, message: "Usuario o contraseña incorrectos" };
  };

  const register = (name, email, password, role) => {
    const users = getAllUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, message: "El usuario ya existe" };
    }
    const newUser = { name, email, password, role };
    const updated = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updated));
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
