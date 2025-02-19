"use client"; // ✅ Ensure this is also marked as a client component

import { createContext, useContext, useState, ReactNode } from "react";

// Define types for the context
interface AuthContextType {
  isFaceVerified: boolean;
  setIsFaceVerified: (verified: boolean) => void;
  isOTPVerified: boolean;
  setIsOTPVerified: (verified: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
}

// Create the AuthContext with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// The AuthProvider component to wrap around the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isFaceVerified, setIsFaceVerified] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AuthContext.Provider
      value={{
        isFaceVerified,
        setIsFaceVerified,
        isOTPVerified,
        setIsOTPVerified,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
