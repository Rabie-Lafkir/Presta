/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-unescaped-entities */
import { createClient } from "@/lib/supabase-server";
import { BsFillPencilFill, BsBackspaceFill } from "react-icons/bs";

import { HiUserGroup } from "react-icons/hi";
import Link from "next/link";
import UserForm from "@/components/forms/UserForm";
import UserCard from "@/components/ui/UserCard";
import UserTeams from "@/components/ui/UserTeams";

const getUserData = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*, teams(*), teams_members(*)")
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log("Error while getting the user :", error);
  }

  console.log("User Data is ", data);
  return data;
};

export default async function UserPage({ params, searchParams }) {
  const userData = await getUserData(params?.id);
  const modify = searchParams?.modify || false;
  return (
    <div className="w-full flex items-start gap-x-4">
      <div className="w-1/4 flex flex-col items-center pt-12">
        <UserCard user={userData} />
      </div>
      <div className="w-full h-full">
        {!modify && (
          <div className={`flex justify-end mb-5`}>
            <div>
              <a
                className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
                href={`/dashboard/users/${userData?.id}?modify=true`}
              >
                <BsFillPencilFill size={14} className="text-white mr-2" />
                Modifier
              </a>
            </div>
          </div>
        )}
        {modify && (
          <div className="flex justify-end items-center h-16 mb-5 gap-x-2">
            <div>
              <a
                className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
                href={`/dashboard/users/${userData?.id}`}
              >
                <BsBackspaceFill size={14} className="text-white mr-2" />
                Annuler
              </a>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit mb-5">
          {userData?.profile_picture_url ? (
            <div className={`avatar -m-14 `}>
              <div
                className={`w-28 rounded-full ${
                  userData?.active
                    ? "border-4 border-green-400"
                    : "border-4 border-amber-400"
                }`}
              >
                <img src={userData?.profile_picture_url} />
              </div>
            </div>
          ) : (
            <div
              className={`bg-blue-600 text-white rounded-full p-2 w-28 h-28 flex items-center justify-center -m-14 ${
                userData?.active
                  ? "border-4 border-green-400"
                  : "border-4 border-amber-400"
              }`}
            >
              <span className="text-3xl font-bold">{`${
                userData?.first_name.split("")[0]
              }${userData?.last_name.split("")[0]}`}</span>
            </div>
          )}
          <div className={`text-4xl text-blue-600 font-semibold mt-16 mb-1`}>
            {userData?.username}
          </div>
          <div className={`text-sm text-gray-500 font-semibold mb-5`}>
            {`Créé le ${userData?.created_at && new Intl.DateTimeFormat("fr-FR")?.format(
              Date.parse(userData?.created_at)
            )}`}
          </div>
          <UserForm modify={modify} userData={userData} />
        </div>
        <UserTeams userData={userData} />
      </div>
    </div>
  );
}
