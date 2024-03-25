/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
import cities from "../../lib/helpers/moroccanCities.json";
import regions from "../../lib/helpers/moroccanRegions.json";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { formatProper } from "@/lib/utils";
import Select from "react-select";

export const ChecklistFilter = () => {
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

  const [service, setService] = useState();
  const [serviceList, setServiceList] = useState();

  const addFilters = () => {
    service && currentParams.set("service", service);
    console.log(`rEDIRECTING TO : ${pathname}?${currentParams.toString()}`);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  //Main Functions
  const updateService = (service) => {
    console.log("Picked : ", service?.value);
    setService(service?.value);
  };

  const getServices = async () => {
    const filteredServices = await supabase.from("services").select("*");

    setServiceList(
      filteredServices?.data
        ? filteredServices?.data.map((el) => ({
            value: el.id,
            label: el.name,
          }))
        : []
    );

    console.log("Found following services : ", serviceList);
    return filteredServices;
  };

  const clearSelection = () => {
    setService();
    router.push(pathname);
  };

  useEffect(() => {
    getServices();
  }, []);
  return (
    <div className="w-full px-4 py-8 rounded-lg bg-white shadow-lg flex flex-col items-center">
      <div className="text-amber-500 text-2xl font-semibold w-full mb-5">
        Filtrez les checklists
      </div>
      <div className="w-full flex flex-col items-start">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Choissisez un service
        </label>
        <Select
          onChange={updateService}
          options={serviceList}
          name="service"
          placeholder="Veuillez choisir un service ..."
          unstyled={true}
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
