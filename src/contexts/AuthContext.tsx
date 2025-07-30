import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, User } from "../types";
import { authAPI } from "../services/api";
import { config } from "../config/env";

// Google OAuth types
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(email, password);
      const { user: userData, token } = response;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      // Initialize Google OAuth
      const google = window.google;
      if (!google) {
        throw new Error("Google OAuth not available");
      }

      const response = await new Promise((resolve, reject) => {
        google.accounts.oauth2
          .initTokenClient({
            client_id: config.googleClientId,
            scope: "email profile",
            callback: async (tokenResponse: any) => {
              try {
                const authResponse = await authAPI.googleAuth(
                  tokenResponse.access_token
                );
                const { user: userData, token } = authResponse;

                setUser(userData);
                localStorage.setItem("user", JSON.stringify(userData));
                localStorage.setItem("token", token);
                resolve(true);
              } catch (error) {
                reject(error);
              }
            },
          })
          .requestAccessToken();
      });

      return response as boolean;
    } catch (error) {
      console.error("Google login error:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      const response = await authAPI.register(email, password, name);
      const { user: userData, token } = response;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      return true;
    } catch (error) {
      console.error("Register error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const upgradeToVip = async (): Promise<boolean> => {
    if (!user) return false;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const updatedUser = {
      ...user,
      isVip: true,
      subscriptionId: "sub_" + Date.now(),
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        register,
        logout,
        upgradeToVip,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
