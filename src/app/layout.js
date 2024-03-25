import "./globals.css";
import { Inter } from "next/font/google";
import SupabaseAuthProvider from "@/components/providers/SupabaseAuthProvider";
import SupabaseProvider from "@/components/providers/SupabaseProvider";
import { createClient } from "@/lib/supabase-server";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Presta Freedom Dashboard",
  description:
    "This the custom dashboard built to allow Presta Freedom to manage its users and services",
};

export default async function RootLayout({ children }) {
  const supabase = createClient();

  const { data: session } = await supabase?.auth?.getSession();
  return (
    <html lang="fr" style={{ height: "100%" }}>
      <body
        className={`${inter.className} min-h-screen antialiased h-full bg-blue-50`}
      >
        <SupabaseProvider>
          <SupabaseAuthProvider serverSession={session}>
            {children}
          </SupabaseAuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
