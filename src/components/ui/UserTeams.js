/* eslint-disable react/no-unescaped-entities */
"use client";

import { HiUserGroup } from "react-icons/hi";
import { FaCheck } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";
import { useRouter } from "next/navigation";

export default function UserTeams({ userData }) {
  const router = useRouter();
  const [selected, setSelected] = useState([]);
  const [user, setUser] = useState();
  const [admins, setAdmins] = useState([]);

  const supabase = createClient();

  const updateUser = async (query) => {
    setUser(query?.value);
    return query?.value;
  };

  const toggleSelect = (id) => {
    if (selected?.includes(id)) {
      setSelected([...selected?.filter((el) => el != id)]);
      return selected;
    }

    setSelected([...selected, id]);
  };

  const getAdmins = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("role", "client");

    if (error) {
      console.log(
        "Error while fetching admins in user teams : ",
        JSON.stringify(error)
      );
    }

    console.log("Got user teams admins : ", admins);

    setAdmins(
      data?.map((user) => ({ value: user?.id, label: user?.username }))
    );
  };

  const transferTeam = async () => {
    const req = selected?.map((el) => ({
      team: el,
      user,
      role: userData.teams_members.filter(
        (join) => join?.team == el && join?.user == userData?.id
      )[0].role,
      id: userData.teams_members.filter(
        (join) => join?.team == el && join?.user == userData?.id
      )[0].id,
    }));

    console.log("About to transfer teams : ", req);

    
    const { data, error } = await supabase
      .from("teams_members")
      .upsert(req, {onConflict : 'id', ignoreDuplicates:false})
      .select();

    if (error) {
      console.log(
        "Error while fetching admins in user teams : ",
        JSON.stringify(error)
      );
    }

    console.log("Transfered teams !", data);
    setSelected([])

    router.refresh();
    
  };

  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <div className="w-full">
      <div className="flex h-fit flex-center items-center mb-5 gap-y-2">
        <div className="w-full bg-white shadow-xl mb-5 p-6 rounded-lg flex flex-col items-center h-full">
          <div className="text-3xl text-blue-600 font-semibold mb-5 w-full">
            Liste des équipes
          </div>

          {selected?.length > 0 && (
            <div className="w-full p-2 mb-5 flex items-center justify-between bg-amber-400 rounded shadow flex-wrap">
              <div className="text-white font-semibold">
                Vous souhaitez transférer l'équipe à un autre collaborateur ?
              </div>
              <div className="w-fit flex items-center gap-2">
                <Select
                  onChange={updateUser}
                  options={admins}
                  name="user_id"
                  placeholder="Choisissez un utilisateur"
                  classNames={{
                    control: (state) =>
                      "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 ",
                    option: (state) => "text-primaryBlue",
                  }}
                />
                <button
                  className="rounded text-amber-400 bg-white shadow px-4 py-2 font-semibold disabled:bg-slate-100 disabled:cursor-not-allowed"
                  disabled={!user}
                  onClick={() => {
                    transferTeam();
                  }}
                >
                  Confirmer
                </button>
              </div>
            </div>
          )}
          {userData?.teams && userData?.teams?.length == 0 ? (
            <div className="h-56 w-full flex justify-center items-center text-purple-600 transition-all duration-500">
              {`${userData?.username} n'est toujours pas membre d'une équipe`}
            </div>
          ) : (
            userData?.teams?.map((team) => (
              <div
                className="flex items-center justify-between max-w-2xl w-full bg-blue-600 shadow-xl mb-5 p-4 rounded-lg"
                key={team?.id}
              >
                <button
                  className={`h-16 w-16 ${
                    selected?.includes(team?.id) ? "bg-emerald-600" : "bg-white"
                  } text-blue-400 rounded-full flex justify-center items-center shadow`}
                  onClick={() => toggleSelect(team?.id)}
                >
                  {selected?.includes(team?.id) ? (
                    <FaCheck size={24} className="text-white" />
                  ) : (
                    <HiUserGroup size={24} />
                  )}
                </button>
                <div>
                  <div className=" items-center text-2xl text-white">
                    {team?.name}
                  </div>
                  <div className=" items-center text-sm text-white">
                    {new Intl.DateTimeFormat("fr-FR").format(
                      Date.parse(team?.created_at)
                    )}
                  </div>
                </div>
                <div className=" items-center text-sm text-white">
                  Taille de l'équipe :{" "}
                  <span className="font-bold">{team?.size}</span>
                </div>
                <div className=" items-center text-sm text-blue-950 badge bg-white border-0 py-2">
                  {userData.teams_members.filter(
                    (join) => join?.team == team?.id
                  )[0].role == "supervisor"
                    ? "Superviseur"
                    : "Member"}
                </div>
                <Link
                  className="bg-white text-blue-600 text-base font-semibold rounded-2xl py-2 px-4 shadow"
                  href={`/dashboard/teams/${team?.id}`}
                >
                  Gérer
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
