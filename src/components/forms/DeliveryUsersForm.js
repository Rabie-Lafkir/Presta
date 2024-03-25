/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import SearchDropdown from "../ui/SearchDropdown";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

const DeliveryUsersForm = ({ delivery_id, team }) => {
  const supabase = createClient();
  const [user, setUser] = useState();
  const [userList, setUserList] = useState([]);
  const [members, setMembers] = useState([]);
  const [fMembers, setfMembers] = useState([...team]);
  const [removed, setRemoved] = useState([]);
  const router = useRouter();

  const updateDelivery = async (query) => {
    setUser(query);

    console.log("Searching for : ", query);
    if (query.length < 3) {
      return;
    }
    const filteredUsers = await supabase
      .from("users")
      .select("*")
      .textSearch("username", `'${query}'`)
      .neq("role", "client");

    if (filteredUsers?.data?.length > 0) {
      setMembers([
        {
          id: filteredUsers?.data?.[0].id,
          name: filteredUsers?.data?.[0].username,
        },
      ]);
    }

    console.log(`Found following users for query :`, filteredUsers);
    setUserList(
      filteredUsers?.data ? filteredUsers?.data.map((el) => el.username) : []
    );
    return filteredUsers;
  };

  const updateDeliveryMembers = async () => {
    console.log("Got following members", fMembers);
    console.log("Got following team ID :", delivery_id);

    const membersRequest = [];
    const removedRequest = [];

    removed.map((member, i) =>
      removedRequest.push({
        user_id: member?.id,
        delivery_id: delivery_id,
        role: "normal",
        active: false,
      })
    );
    fMembers.map((member, i) =>
      membersRequest.push({
        user_id: member?.id,
        delivery_id: delivery_id,
        role: "normal",
        active: true,
      })
    );

    console.log("About to start update !", membersRequest, removedRequest);
    const removedData = await supabase
      .from("deliveries_users")
      .upsert(removedRequest, {
        onConflict: "delivery_id,user_id",
        ignoreDuplicates: false,
      });

    if (removedData.error) {
      console.log(
        "Error while removing members to  team :",
        JSON.stringify(removedData.error)
      );
    }

    const membersData = await supabase
      .from("deliveries_users")
      .upsert(membersRequest, {
        onConflict: "delivery_id,user_id",
        ignoreDuplicates: false,
      });

    if (membersData.error) {
      console.log(
        "Error while adding members to  team :",
        JSON.stringify(membersData.error)
      );
      throw new Error(
        `Error while adding members to  team : ${JSON.stringify(
          membersData.error
        )}`
      );
    }

    console.log("Update is done");

    router.push(`/dashboard/deliveries/${delivery_id}`);
  };

  console.log("Delivery id is : ", delivery_id);

  return (
    <div className="w-full">
      <div className="w-full flex items-center gap-2 my-5">
        <input
          name="delivery_id"
          value={delivery_id}
          className="hidden"
          readOnly
        />
        <SearchDropdown
          values={[...userList]}
          label={"Choissisez un membre"}
          placeholder={"Veuillez choisir un membre ..."}
          inputFn={updateDelivery}
        />
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
        fMembers.map((member) => (
          <div key={member?.id} className="w-full flex flex-col mb-2">
            <input
              name="member"
              value={member?.id}
              className="hidden"
              readOnly
            />
            <div className="flex items-center mb-5 p-4 justify-between border borde-blue-600 rounded-lg shadow">
              <div className="text-blue-600 font-semibold grow">
                {member.name}
              </div>
              <AiFillMinusCircle
                size={32}
                className="text-amber-400 hover:text-amber-600 drop-shadow"
                onClick={() => {
                  setRemoved([
                    ...removed,
                    fMembers.filter((el) => el?.id == member?.id)[0],
                  ]);
                  setfMembers(fMembers.filter((el) => el?.id != member?.id));
                  console.log("Got following members : ", fMembers);
                }}
              />
            </div>
          </div>
        ))
      )}

      {removed.map((member, i) => (
        <input
          name="removed"
          value={member?.id}
          className="hidden"
          key={i}
          readOnly
        />
      ))}
      <div className="w-full flex flex-col items-center justify-center mb-5">
        <button
          className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:shadow-none"
          disabled={fMembers?.length == 0}
          onClick={() => updateDeliveryMembers()}
        >
          Mettre à jour l'équipe
        </button>
      </div>
    </div>
  );
};

export default DeliveryUsersForm;
