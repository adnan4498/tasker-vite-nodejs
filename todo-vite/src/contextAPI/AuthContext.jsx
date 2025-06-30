import { createContext, useState, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState(null);

  return (
    <AuthContext.Provider value={{ loginInfo, setLoginInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

// Optional custom hook
export const useAuth = () => useContext(AuthContext);
