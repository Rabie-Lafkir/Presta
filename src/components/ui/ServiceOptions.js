/* eslint-disable react/no-unescaped-entities */
"use client";

// imports
import { createClient } from "@/lib/supabase-client";
import { BsPlus } from "react-icons/bs";
import { useEffect, useState } from "react";
import Drawer from "./Drawer";
import CreateOption from "../forms/CreateOption";

//Setting up supabase
const supabase = createClient();

export default function ServiceOptions({ serviceId, options }) {
  //Managing state
  const [create, setCreate] = useState(false);

  console.log("Got following options : ", options);

  return (
    <div>
      {create && (
        <Drawer title={"Créer une option"}>
          <CreateOption service_id={serviceId} />
        </Drawer>
      )}

      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <div className="w-full flex items-center justify-between mb-5">
          <div className="font-semibold text-2xl text-purple-600">
            Gérer les options
          </div>
          <a
            className="flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-purple-600 hover:shadow-lg cursor-pointer"
            onClick={() => setCreate(true)}
          >
            <BsPlus size={24} className="text-white mr-2" />
            Créer une option
          </a>
        </div>
        {!options ? (
          <div className="w-full h-44 flex justify-center items-center text-purple-600">
            Ce service n'a pas d'options attachées
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 gap-2">
            {options.map((option, i) => (
              <div
                className="w-full p-2 flex items-center justify-between shadow-lg rounded-lg py-4 px-8"
                key={i}
              >
                <div className="font-semibold text-blue-600">
                  {option?.name}
                </div>
                <a
                  className="px-4 py-2 rounded-full bg-amber-400 font-semibold text-white shadow hover:bg-amber-600 hover:shadow-xl"
                  href={`/dashboard/options/${option.id}`}
                >
                  Gérer
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
