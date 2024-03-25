/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
import cities from "../../lib/helpers/moroccanCities.json";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchDropdown from "../ui/SearchDropdown";
import { createClient } from "@/lib/supabase-client";

export const PriceFilter = () => {
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

  const [type, setType] = useState();
  const [service, setService] = useState();
  const [serviceList, setServiceList] = useState([]);
  const [option, setOption] = useState();
  const [optionList, setOptionList] = useState([]);
  const [zone, setZone] = useState();
  const [zoneList, setZoneList] = useState([]);
  const typeSelect = useRef();

  const addFilters = () => {
    type && currentParams.set("type", type);
    service && currentParams.set("service", service);
    option && currentParams.set("option", option);
    zone && currentParams.set("zone", zone);
    console.log(`rEDIRECTING TO : ${pathname}?${currentParams.toString()}`);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  //Main Functions

  const updateService = async (query) => {
    setService(query);
    if (query.length < 3) {
      return;
    }
    const filteredServices = await supabase
      .from("services")
      .select("*")
      .textSearch("name", `${query}`);

    console.log(`Found following services for query :`, filteredServices);
    setServiceList(
      filteredServices?.data ? filteredServices?.data.map((el) => el.name) : []
    );
    return filteredServices;
  };

  const updateOption = async (query) => {
    setOption(query);
    if (query.length < 3) {
      return;
    }
    const filteredOptions = await supabase
      .from("options")
      .select("*")
      .textSearch("name", `${query}`);

    console.log(`Found following options for query :`, filteredOptions);
    setOptionList(
      filteredOptions?.data ? filteredOptions?.data.map((el) => el.name) : []
    );
    return filteredOptions;
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

    console.log(`Found following zones for query :`, filteredZones);
    setZoneList(
      filteredZones?.data ? filteredZones?.data.map((el) => el.name) : []
    );
    return filteredZones;
  };

  const updateType = (zone) => {
    setType(zone);
  };

  const clearSelection = () => {
    typeSelect.current.value = "";
    setType("");
    setService();
    setServiceList([]);
    setOption();
    setOptionList([]);
    setZone();
    setZoneList([]);
    router.push(pathname);
  };

  return (
    <div className="w-full px-4 py-8 rounded-lg bg-white shadow-lg flex flex-col items-center mb-5">
      <div className="text-amber-500 text-2xl font-semibold w-full mb-5">
        Filtrez les Tarifs
      </div>
      <div className="w-full flex flex-col items-start col-span-2 mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Filter par type
        </label>
        <select
          className="select w-full max-w-md  placeholder-gray-500 text-blue-600 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
          name="typeFilter"
          ref={typeSelect}
          onChange={() => updateType(typeSelect.current.value)}
        >
          <option value="">Veuillez choisir un type de tarifs ...</option>
          <option value={"service"}>Lié à un service </option>
          <option value={"option"}>Lié à une option</option>
        </select>
      </div>
      <SearchDropdown
        values={[...serviceList]}
        label={"Filtrer par service"}
        placeholder={"Veuillez choisir un service ..."}
        defaultInputValue={currentParams.get("service")}
        inputFn={updateService}
      />
      <SearchDropdown
        values={[...optionList]}
        label={"Filtrer par option"}
        placeholder={"Veuillez choisir une option ..."}
        defaultInputValue={currentParams.get("option")}
        inputFn={updateOption}
      />
      <SearchDropdown
        values={[...zoneList]}
        label={"Filtrer par zone"}
        placeholder={"Veuillez choisir une zone ..."}
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
