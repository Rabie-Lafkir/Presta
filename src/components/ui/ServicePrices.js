/* eslint-disable react/no-unescaped-entities */
"use client";

// imports
import { createClient } from "@/lib/supabase-client";
import { BsPlus } from "react-icons/bs";
import { useEffect, useState } from "react";
import Drawer from "./Drawer";
import CreatePrice from "../forms/CreatePrice";
import Link from "next/link";
import {
  BsCircleFill,
  BsShop,
  BsFillBuildingFill,
  BsPeopleFill,
} from "react-icons/bs";

//Setting up supabase
const supabase = createClient();

export default function ServicePrices({ serviceId, optionId, prices }) {
  //Managing state
  const [create, setCreate] = useState(false);

  return (
    <div>
      {create && (
        <Drawer title={"Créer un tarif"}>
          <CreatePrice service_id={serviceId} option_id={optionId} />
        </Drawer>
      )}

      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <div className="w-full flex items-center justify-between mb-5">
          <div className="font-semibold text-2xl text-emerald-600">
            Gérer les tarifs
          </div>
          <button
            className="flex items-center bg-emerald-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer"
            onClick={() => setCreate(true)}
          >
            <BsPlus size={24} className="text-white mr-2" />
            Créer un tarif
          </button>
        </div>
        {!prices ? (
          <div className="w-full h-44 flex justify-center items-center text-emerald-600">
            Ce service n'a pas de tarifs
          </div>
        ) : (
          prices.map((price) => (
            <div
              key={price?.id}
              className="w-full p-2 flex items-center justify-between shadow-lg rounded-lg py-4 px-8"
            >
              <div className="flex items-center gap-x-2 ">
                <div
                  className={`w-12 ${
                    price?.active ? "text-green-300" : "text-yellow-300"
                  }`}
                >
                  <BsCircleFill />
                </div>
                <div className="font-base text-gray-500">
                  <span className="font-semibold text-blue-600">
                    {price?.name}
                  </span>
                </div>
              </div>
              <div className="font-base text-gray-500">
                Type de tarif :{" "}
                <span className="font-semibold text-blue-600">
                  {price?.is_fixed ? "Fixe" : "Variable"}
                </span>
              </div>
              <div className="font-base text-gray-500">
                Prix par defaut :{" "}
                <span className="font-semibold text-blue-600">
                  {price?.default_price}
                </span>
              </div>
              <div className="font-base text-gray-500">
                Nombre de paliers :
                <span className="font-semibold text-blue-600">
                  {price?.price_list.length}
                </span>
              </div>
              <Link
                className="px-4 py-2 rounded-full bg-amber-400 font-semibold text-white shadow hover:bg-amber-600 hover:shadow-xl"
                href={`/dashboard/prices/${price.id}`}
              >
                Gérer
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
