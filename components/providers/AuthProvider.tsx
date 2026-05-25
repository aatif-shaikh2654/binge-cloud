"use client";

import { getUser, logout as logoutService } from "@/app/services/auth.service";
import { User } from "@/app/types/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { getHistory, syncHistory } from "@/app/services/history.service";
import { getWatchlist, syncWatchlist } from "@/app/services/watchlist.service";
import { useHistoryStore } from "@/app/store/useHistoryStore";
import { useWatchlistStore } from "@/app/store/useWatchlistStore";

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
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const hasSyncedHistory = React.useRef(false);
  const hasSyncedWatchlist = React.useRef(false);

  // Read cookie on mount
  useEffect(() => {
    if (getCookie("token")) {
      setHasToken(true); // eslint-disable-line react-hooks/set-state-in-effect
    }
    setIsInitialized(true);
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
      hasSyncedHistory.current = false;
      hasSyncedWatchlist.current = false;
    }
  }, [isError, queryClient]);

  // Force a refetch if hasToken changes from false to true (after successful login)
  useEffect(() => {
    if (hasToken) {
      refetch();
    }
  }, [hasToken, refetch]);

  const syncHistoryMutation = useMutation({
    mutationFn: syncHistory,
    onSuccess: (data) => {
      useHistoryStore.getState().setHistory(data);
    },
  });

  const syncWatchlistMutation = useMutation({
    mutationFn: syncWatchlist,
    onSuccess: (data) => {
      useWatchlistStore.getState().setWatchlist(data);
    },
  });

  const { data: historyData } = useQuery({
    queryKey: ["history", user?.id],
    queryFn: async () => {
      const currentHistory = useHistoryStore.getState().history;
      if (!hasSyncedHistory.current && currentHistory.length > 0) {
        hasSyncedHistory.current = true;
        return syncHistoryMutation.mutateAsync(currentHistory);
      }
      hasSyncedHistory.current = true;
      return getHistory();
    },
    enabled: !!user,
  });

  const { data: watchlistData } = useQuery({
    queryKey: ["watchlist", user?.id],
    queryFn: async () => {
      const currentWatchlist = useWatchlistStore.getState().watchlist;
      if (!hasSyncedWatchlist.current && currentWatchlist.length > 0) {
        hasSyncedWatchlist.current = true;
        return syncWatchlistMutation.mutateAsync(currentWatchlist);
      }
      hasSyncedWatchlist.current = true;
      return getWatchlist();
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (historyData && !syncHistoryMutation.isPending) {
      useHistoryStore.getState().setHistory(historyData);
    }
  }, [historyData, syncHistoryMutation.isPending]);

  useEffect(() => {
    if (watchlistData && !syncWatchlistMutation.isPending) {
      useWatchlistStore.getState().setWatchlist(watchlistData);
    }
  }, [watchlistData, syncWatchlistMutation.isPending]);


  const logout = async () => {
    await logoutService();
    if (typeof window !== "undefined") {
      document.cookie = "token=; Max-Age=0; path=/;";
    }
    setHasToken(false);
    queryClient.setQueryData(["authUser"], null);
    hasSyncedHistory.current = false;
    hasSyncedWatchlist.current = false;
    useHistoryStore.getState().clearHistory();
    useWatchlistStore.getState().setWatchlist([]);
    toast.success("Logged out successfully!");
  };

  // We are loading if we haven't checked cookies on mount yet, or if the user has a token but the API query is still fetching
  const isLoading = !isInitialized || (hasToken && isQueryLoading);
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
