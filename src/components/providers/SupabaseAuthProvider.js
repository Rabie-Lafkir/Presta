"use client";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import { useSupabase } from "./SupabaseProvider";
import { useSWR } from "swr";

const Context = createContext({
  user: null,
  error: null,
  isLoading: false,
  mutate: null,
  signOut: async () => {},
  signInWithEmail: async (email, password) => null,
});

export default function SupabaseAuthProvider({ serverSession, children }) {
  const { supabase } = useSupabase();
  const router = useRouter();

  const getUser = async () => {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", serverSession?.session?.user?.id);

    if (error) {
      console.log(error);
      throw new Error("User not found in db!");
    } else {
      return user;
    }
  };

  //SignOut function

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const signInWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return error.message;
    }

    return null;
  };

  useEffect(() => {
    const data = supabase?.auth?.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.session?.access_token) {
        router.refresh();
      }
    });

    return () => {
      data.data.subscription.unsubscribe();
    };
  }, [router, supabase, serverSession?.session?.access_token]);

  const exposed = {
    user: serverSession?.session?.user,
    getUser,
    signOut,
    signInWithEmail,
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
}

export const useAuth = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used inside of SupabaseAuthProvider");
  } else {
    return context;
  }
};
