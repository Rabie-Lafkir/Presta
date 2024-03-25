"use client";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import { HiHome, HiOutlineLogout } from "react-icons/hi";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  BsFillBuildingFill,
  BsFillPersonFill,
  BsPeopleFill,
  BsFillBriefcaseFill,
  BsStack,
} from "react-icons/bs";
import {
  FaExchangeAlt,
  FaMoneyBillWave,
  FaMapMarkedAlt,
  FaRunning,
  FaList,
} from "react-icons/fa";
import { MdCurrencyExchange } from "react-icons/md";

import { HiUserGroup } from "react-icons/hi";
import SidebarItem from "./SidebarItem";
import { useAuth } from "../providers/SupabaseAuthProvider";
import { createClient } from "@/lib/supabase-client";
import Navbar from "./Navbar";

const Sidebar = ({ children }) => {
  const pathname = usePathname();
  const [userData, setUserData] = useState();
  const supabase = createClient();
  // const { signOut, getUser, user } = useAuth();

  const setUser = async () => {
    const { data: user } = await supabase?.auth?.getUser();
    console.log("Side bar user : ", user);
    setUserData(user?.user);
  };
  useEffect(() => {
    setUser();
  }, []);

  const routes = useMemo(
    () => [
      {
        icon: HiHome,
        label: "Home",
        active: pathname == "/dashboard",
        href: "/dashboard",
      },
      {
        icon: FaRunning,
        label: "Affectation",
        active: pathname.includes("/dashboard/deliveries"),
        href: "/dashboard/deliveries",
      },
      {
        icon: BsFillBuildingFill,
        label: "Biens",
        active: pathname.includes("/dashboard/properties"),
        href: "/dashboard/properties",
      },
      {
        icon: FaMapMarkerAlt,
        label: 'Localisation globale',
        active: pathname.includes('/dashboard/properties_locations'),
        href: '/dashboard/properties_locations',
      },
      {
        icon: BsFillPersonFill,
        label: "Utilisateurs",
        active: pathname.includes("/dashboard/clients"),
        href: "/dashboard/clients",
      },
      {
        icon: FaExchangeAlt,
        label: "Commandes",
        active: pathname.includes("/dashboard/transactions"),
        href: "/dashboard/transactions",
      },
      {
        icon: MdCurrencyExchange,
        label: "Transactions",
        active: pathname.includes("/dashboard/detailedtxs"),
        href: "/dashboard/detailedtxs",
      },

      {
        icon: BsFillBriefcaseFill,
        label: "Services",
        active: pathname.includes("/dashboard/services"),
        href: "/dashboard/services",
      },
      {
        icon: BsStack,
        label: "Options",
        active: pathname.includes("/dashboard/options"),
        href: "/dashboard/options",
      },
      {
        icon: FaMoneyBillWave,
        label: "Tarifs",
        active: pathname.includes("/dashboard/prices"),
        href: "/dashboard/prices",
      },
      {
        icon: FaList,
        label: "Checklists",
        active: pathname.includes("/dashboard/checklists"),
        href: "/dashboard/checklists",
      },
      {
        icon: FaMapMarkedAlt,
        label: "Zones",
        active: pathname.includes("/dashboard/zones"),
        href: "/dashboard/zones",
      },
      {
        icon: HiUserGroup,
        label: "Équipes",
        active: pathname.includes("/dashboard/teams"),
        href: "/dashboard/teams",
      },
      {
        icon: BsPeopleFill,
        label: "Collaborateurs",
        active: pathname.includes("/dashboard/users"),
        href: "/dashboard/users",
      },
    ],
    [pathname]
  );
  return (
    <>
      <div className="flex h-full min-h-screen gap-x-4 p-4">
        <div className="hidden md:flex flex-col min-h-full py-4 bg-blue-800 rounded-lg shadow  h-fit items-center">
          <div className="w-full mb-12 flex justify-center">
            <Image
              src="/PrestaLogoWhite.svg"
              width={100}
              height={100}
              alt="Presta Freedom Logo"
            />
          </div>
          <div className="w-full flex flex-col items-center gap-y-2 grow">
            {routes.map((item) => (
              <SidebarItem key={item.label} {...item} />
            ))}
          </div>
          {userData && (
            <div className="w-full flex flex-col items-center self-end px-4">
              <div className="flex h-auto items-center w-full gap-x-4 text-md cursor-pointer py-2 text-white overflow-ellipsis overflow-hidden mb-2">
                <div className="avatar placeholder">
                  <div className="bg-white text-blue-600 rounded-full w-10">
                    <span className="text-lg font-bold">{`${
                      userData?.user_metadata?.first_name.split("")[0]
                    }${userData?.user_metadata?.last_name.split("")[0]}`}</span>
                  </div>
                </div>
                <span className="w-full">
                  {userData?.user_metadata?.username}
                </span>
              </div>
              <div>
                <form action="/signout" method="post" className="w-full">
                  <button className="flex h-auto items-center w-full gap-x-4 text-md cursor-pointer py-2 px-2 bg-white rounded-lg text-blue-600 shadow-lg">
                    <HiOutlineLogout size={26} />
                    <span className="font-semibold">Se déconnecter</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        <main className="overflow-y-auto min-h-full w-full  p-4 pt-0">
          <Navbar />
          {children}
        </main>
      </div>
    </>
  );
};

export default Sidebar;
