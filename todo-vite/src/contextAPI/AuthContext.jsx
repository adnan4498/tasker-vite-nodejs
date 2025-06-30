// AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState(() => {
    const saved = localStorage.getItem("loginInfo");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (loginInfo) {
      localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    } else {
      localStorage.removeItem("loginInfo");
    }
  }, [loginInfo]);

  return (
    <AuthContext.Provider value={{ loginInfo, setLoginInfo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
