"use client";

import { getUser, logout as logoutService } from "@/app/services/auth.service";
import { User } from "@/app/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState<boolean>(false);

  // Read cookie on mount
  useEffect(() => {
    if (getCookie("token")) {
      setTimeout(() => setHasToken(true), 0);
    }
  }, []);

  const checkAuth = () => {
    setHasToken(!!getCookie("token"));
  };

  const {
    data: user = null,
    isLoading: isQueryLoading,
    isError,
    refetch,
  } = useQuery<User | null>({
    queryKey: ["authUser"],
    queryFn: getUser,
    enabled: hasToken,
    retry: false,
    staleTime: 1000 * 60 * 10, // Keep data fresh for 10 minutes to reduce API spam
  });

  // Clear session if user fetch fails (e.g. invalid/expired token)
  useEffect(() => {
    if (isError) {
      if (typeof window !== "undefined") {
        document.cookie = "token=; Max-Age=0; path=/;";
      }
      setTimeout(() => {
        setHasToken(false);
      }, 0);
      queryClient.setQueryData(["authUser"], null);
    }
  }, [isError, queryClient]);

  // Force a refetch if hasToken changes from false to true (after successful login)
  useEffect(() => {
    if (hasToken) {
      refetch();
    }
  }, [hasToken, refetch]);

  const logout = async () => {
    await logoutService();
    if (typeof window !== "undefined") {
      document.cookie = "token=; Max-Age=0; path=/;";
    }
    setHasToken(false);
    queryClient.setQueryData(["authUser"], null);
    toast.success("Logged out successfully!");
  };

  // We are loading if the user has a token but the API query is still fetching
  const isLoading = hasToken && isQueryLoading;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
