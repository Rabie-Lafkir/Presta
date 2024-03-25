import { Inter } from "next/font/google";
import Sidebar from "@/components/ui/Sidebar";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Presta Freedom Dashboard",
  description:
    "This the custom dashboard built to allow Presta Freedom to manage its users and services",
};

export default async function RootLayout({ children }) {
  const supabase = createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  } else {
  }
  return (
    <main
      className={`${inter.className} antialiased h-fit bg-blue-50 min-h-screen`}
    >
      <Sidebar>{children}</Sidebar>
    </main>
  );
}
