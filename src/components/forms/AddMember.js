/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { updateTeam } from "@/actions/teamActions";
import SearchDropdown from "../ui/SearchDropdown";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";
import { useRouter, invalidateAll } from "next/navigation";

const AddMember = ({ team_id }) => {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();
  const [userList, setUserList] = useState([]);
  const [members, setMembers] = useState([]);
  const [fMembers, setfMembers] = useState([]);

  const updateTeam = async (query) => {
    setUser(query?.value);
    console.log(`Found following users for query :`, user);
    setfMembers([
      ...fMembers,
      { id: query.value, name: query.label, role: "normal" },
    ]);
    console.log("New memebers : ", fMembers);
    return query?.value;
  };

  const applyUpdate = async () => {
    console.log("About to add : ", fMembers);
    setLoading(true);
    let req = fMembers?.map((member) => ({
      team: team_id,
      user: member?.id,
      role: member?.role,
    }));
    const { data, error } = await supabase.from("teams_members").upsert(req);

    if (error) {
      console.log(
        "Error while updating team members :",
        JSON.stringify(team_id)
      );
    }

    console.log("Added members !", data);
    setLoading(false);
    router.refresh();
  };

  console.log("Team id in Add member : ", team_id);
  const getUsers = async () => {
    const filteredUsers = await supabase
      .from("users")
      .select("*")
      .neq("role", "client");

    setUserList(
      filteredUsers?.data
        ? filteredUsers?.data.map((el) => ({
            value: el.id,
            label: el.username,
          }))
        : []
    );

    console.log("Found following users : ", userList);
    return filteredUsers;
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <form className="w-full" action={updateTeam}>
      <div className="w-full flex items-center gap-2 my-5">
        <input name="team_id" value={team_id} className="hidden" readOnly />

        <div className="w-full flex flex-col">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Choissisez un utilisateur
          </label>
          <Select
            onChange={updateTeam}
            options={userList}
            name="user_id"
            placeholder="Choisissez un utilisateur"
            classNames={{
              control: (state) =>
                "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
              option: (state) => "text-primaryBlue",
            }}
          />
        </div>

        <AiFillPlusCircle
          size={32}
          className="text-emerald-400 hover:text-emerald-600 drop-shadow"
          onClick={() => {
            console.log("About to add", members);
            setfMembers([
              ...fMembers,
              ...members.filter(
                (member) => !fMembers.map((el) => el?.id).includes(member?.id)
              ),
            ]);
          }}
        />
      </div>

      {fMembers.length < 1 ? (
        <div className="w-full h-12 text-purple-600 flex items-center justify-center text-center mb-5">
          Vous n'avez toujours pas ajouté de members
        </div>
      ) : (
        fMembers.map((member, i) => (
          <div key={i} className="w-full flex flex-col mb-2">
            <input
              name="member"
              value={member?.id}
              className="hidden"
              readOnly
            />
            <div className="flex flex-col gap-y-2 items-center mb-5 p-4 justify-between border borde-blue-600 rounded-lg shadow">
              <div className="w-full flex items-center justify-between">
                <div className="text-blue-600 font-semibold">{member.name}</div>
                <AiFillMinusCircle
                  size={32}
                  className="text-amber-400 hover:text-amber-600 drop-shadow"
                  onClick={() =>
                    setfMembers(fMembers.filter((el) => el?.id != member?.id))
                  }
                />
              </div>
              <select
                className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
                name="active"
                onChange={(e) => {
                  fMembers.filter((el) => el?.id == member?.id)[0].role =
                    e.target.value;

                  console.log("Upodated roles : ", fMembers);
                }}
              >
                <option value={"normal"}>Membre</option>
                <option value={"supervisor"}>Superviseur</option>
              </select>
            </div>
          </div>
        ))
      )}

      <div className="w-full flex flex-col items-center justify-center mb-5">
        <button
          className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:shadow-none"
          disabled={fMembers?.length == 0 || loading}
          onClick={async (e) => {
            e.preventDefault();
            await applyUpdate();
          }}
        >
          Mettre à jour l'équipe
        </button>
      </div>
    </form>
  );
};

export default AddMember;
