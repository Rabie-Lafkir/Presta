/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRef } from "react";
import { createZone } from "@/actions/zoneActions";
import SearchDropdown from "../ui/SearchDropdown";
import cities from "@/lib/helpers/moroccanCities.json";
import regions from "@/lib/helpers/moroccanRegions.json";
import { useAtom } from "jotai";
import { updateMarkersAtom } from "@/lib/atoms";

const NewZoneForm = () => {
  const [points, setPoints] = useAtom(updateMarkersAtom);

  console.log("Got following points", points);
  const cityRef = useRef("Casablanca");
  const regionRef = useRef("Casablanca-Settat");

  const updateCity = (city) => {
    cityRef.current.value = city;
  };
  const updateRegion = (region) => {
    regionRef.current.value = region;
  };

  return (
    <form
      className="w-full h-full max-w-md flex flex-col items-center"
      action={createZone}
    >
      <div className="w-full grid grid-cols-1 p-10 justify-items-center gap-x-4">
        <div className="text-3xl w-full text-center text-blue-600 font-semibold mt-12 mb-24">
          Créer une nouvelle zone
        </div>
        <input type="text" ref={cityRef} name="city" className="hidden" />
        <input type="text" ref={regionRef} name="region" className="hidden" />
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Type de zone
          </label>
          <select
            className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="type"
            defaultValue={"mini"}
          >
            <option value={"normal"}>Global</option>
            <option value={"mini"}>Mini</option>
            <option value={"micro"}>Micro</option>
            <option value={"nano"}>Nano</option>
            <option value={"pico"}>Pico</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Nom de la Zone
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nom de la zone"
            defaultValue={""}
            className={
              "input input-bordered input-primary w-full max-w-md  text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <SearchDropdown
            placeholder={"Ville"}
            label={"Ville"}
            values={cities.map((city) => city.ville)}
            defaultInputValue={cityRef.current.value}
            defaultValues={["Casablanca", "Rabat", "Marrakech"]}
            inputFn={updateCity}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <SearchDropdown
            placeholder={"Région"}
            label={"Région"}
            values={regions.map((region) => region.region)}
            defaultInputValue={regionRef.current.value}
            defaultValues={[
              "Casablanca-Settat",
              "Rabat-Sale-Kenitra",
              "Marrakech-Safi",
            ]}
            inputFn={updateRegion}
          />
        </div>
        {points.map((point, i) => (
          <div key={i}>
            <input
              name="point_lat"
              value={point.position.lat}
              className="hidden"
            />
            <input
              name="point_long"
              value={point.position.lng}
              className="hidden"
            />
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col items-center justify-center mb-5">
        <button className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer">
          Créer une nouvelle zone
        </button>
      </div>
    </form>
  );
};

export default NewZoneForm;
