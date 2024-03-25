/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import cities from "../../lib/helpers/moroccanCities.json";
import regions from "../../lib/helpers/moroccanRegions.json";
import SearchDropdown from "../ui/SearchDropdown";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import Select from "react-select";

export const PropertyFilter = () => {
  // Setting up dynamic routing
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //Handle Dynamic Params

  const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
  console.log("Search params are : ", currentParams.get("city"));

  const addFilters = () => {
    userCity && currentParams.set("city", userCity);
    userRegion && currentParams.set("region", userRegion);
    userString && currentParams.set("userString", userString);
    console.log(`rEDIRECTING TO : ${pathname}?${currentParams.toString()}`);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  //Configuring Supabase
  const supabase = createClient();
  const [userString, setUserString] = useState(currentParams.get("userString"));
  const [userCity, setUserCity] = useState();
  const [userRegion, setUserRegion] = useState();
  const [clients, setClients] = useState([]);

  const updateUserString = async (query) => {
    console.log("Got this from child", query);
    setUserString(query.value);
    return query;
  };
  const updateUserCity = (city) => {
    setUserCity(city);
  };

  const updateUserRegion = (region) => {
    setUserRegion(region);
  };

  const clearSelection = () => {
    setUserString("");
    router.push(pathname);
  };

  const getUsers = async () => {
    const filteredUsers = await supabase
      .from("users")
      .select("*")
      .eq("role", "client");

    setClients(
      filteredUsers?.data
        ? filteredUsers?.data.map((el) => ({
            value: el.id,
            label: el.username,
          }))
        : []
    );

    console.log("Found following users : ", clients);
    return filteredUsers;
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="w-full px-4 py-8 rounded-lg bg-white shadow-lg flex flex-col items-center">
      <div className="text-amber-500 text-2xl font-semibold w-full mb-5">
        Filtrez les biens
      </div>
      <SearchDropdown
        values={cities.map((city) => city.ville)}
        label={"Filtrer par ville"}
        placeholder={"Veuillez choisir une ville ..."}
        defaultValues={["Casablanca", "Rabat", "Marrakech"]}
        defaultInputValue={currentParams.get("city")}
        inputFn={updateUserCity}
      />
      <SearchDropdown
        values={regions.map((region) => region.region)}
        label={"Filtrer par région"}
        placeholder={"Veuillez choisir une région ..."}
        defaultValues={[
          "Casablanca-Settat",
          "Rabat-Sale-Kenitra",
          "Marrakech-Safi",
        ]}
        defaultInputValue={currentParams.get("region")}
        inputFn={updateUserRegion}
      />
      <div className="w-full flex flex-col items-start col-span-2 mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Filtrer par client
        </label>
        <Select
          onChange={updateUserString}
          options={clients}
          name="client_id"
          placeholder="Veuillez choisir un client ..."
          unstyled={true}
          defaultInputValue={userString}
          classNames={{
            control: (state) =>
              "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
            option: (state) => "text-blue-600 px-5 py-2 bg-white",
            menu: (state) => "shadow",
            noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
            container: (state) => "w-full",
          }}
        />
      </div>
      <div className="w-full flex items-center justify-between gap-x-2">
        <button
          className="bg-emerald-400 rounded px-4 py-2 font-semibold text-white shadow hover:shadow-lg hover:bg-emerald-600"
          onClick={addFilters}
        >
          Appliquer
        </button>
        <button
          className="bg-amber-400 rounded px-4 py-2 font-semibold text-white shadow hover:shadow-lg hover:bg-amber-600 flex items-center"
          onClick={clearSelection}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};
