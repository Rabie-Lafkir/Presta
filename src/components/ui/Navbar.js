"use client";
import { createClient } from "@/lib/supabase-client";
import { HiMenuAlt3 } from "react-icons/hi";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [username, setUsername] = useState();
  const supabase = createClient();

  const setUserName = async () => {
    const { data: user } = await supabase?.auth?.getUser();
    setUsername(user?.user?.user_metadata?.username);
  };

  useEffect(() => {
    setUserName();
    console.log("Got Nav User : ", username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full bg-white shadow-lg rounded flex justify-between items-center p-8 text-blue-950 mb-5">
      <div className="text-xl font-bold">
        Bonjour,
        <span className="text-blue-400">{` ${username} !`}</span>
      </div>
      <HiMenuAlt3 size={26} />
    </div>
  );
};

export default Navbar;
