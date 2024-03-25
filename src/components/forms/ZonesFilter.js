/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
import cities from "../../lib/helpers/moroccanCities.json";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchDropdown from "../ui/SearchDropdown";
import { createClient } from "@/lib/supabase-client";

export const ZoneFilter = () => {
  // Setting up dynamic routing
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //Handle Dynamic Params
  let currentParams = new URLSearchParams(Array.from(searchParams.entries()));

  useEffect(() => {
    currentParams = new URLSearchParams(Array.from(searchParams.entries()));
  }, [pathname, searchParams]);

  //State variables


  console.log("Number of applie filters : ", currentParams?.size)
  const [type, setType] = useState();
  const [userCity, setUserCity] = useState();
  const [zone, setZone] = useState();
  const [zoneList, setZoneList] = useState([]);
  const typeSelect = useRef();

  const addFilters = () => {
    type && currentParams.set("type", type);
    userCity && currentParams.set("city", userCity);
    zone && currentParams.set("zone", zone);
    console.log(`rEDIRECTING TO : ${pathname}?${currentParams.toString()}`);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const updateUserZone = async (query) => {
    setZone(query);
    if (query.length < 3) {
      return;
    }
    const filteredZones = await supabase
      .from("zones")
      .select("*")
      .textSearch("name", `${query}`);

    console.log(`Found following users for query :`, filteredZones);
    setZoneList(
      filteredZones?.data ? filteredZones?.data.map((el) => el.name) : []
    );
    return filteredZones;
  };

  //Main Functions
  const updateUserCity = (city) => {
    setUserCity(city);
  };

  const updateUserRegion = (region) => {
    setUserRegion(region);
  };

  const updateType = (zone) => {
    setType(zone);
  };

  const clearSelection = () => {
    typeSelect.current.value = "";
    setType("");
    setUserCity();
    setZone();
    setZoneList([]);
    router.push(pathname);
  };

  return (
    <div className="w-full px-4 py-8 rounded-lg bg-white shadow-lg flex flex-col items-center mb-5">
      <div className="text-amber-500 text-2xl font-semibold w-full mb-5">
        Filtrez les zones
      </div>
      <div className="text-emerald-500 text-sm font-semibold w-full mb-5">
      Nombre de filtres appliqués : {currentParams?.size}
      </div>
      <div className="w-full flex flex-col items-start col-span-2 mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Filter par type
        </label>
        <select
          className="select w-full max-w-md  text-gray-500 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
          name="typeFilter"
          ref={typeSelect}
          onChange={() => updateType(typeSelect.current.value)}
        >
          <option value="">Veuillez choisir un type de zone ...</option>
          <option value={"normal"}>Globale</option>
          <option value={"mini"}>Mini</option>
          <option value={"micro"}>Micro</option>
          <option value={"nano"}>Nano</option>
          <option value={"pico"}>pico</option>
        </select>
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
        values={[...zoneList]}
        label={"Filtrer par zone"}
        placeholder={"Veuillez choisir un client ..."}
        defaultInputValue={currentParams.get("zone")}
        inputFn={updateUserZone}
      />
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
