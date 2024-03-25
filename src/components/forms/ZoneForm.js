/* eslint-disable react/no-unescaped-entities */
"use client";

import { useRef } from "react";
import { updateZone } from "@/actions/zoneActions";
import SearchDropdown from "../ui/SearchDropdown";
import cities from "@/lib/helpers/moroccanCities.json";
import regions from "@/lib/helpers/moroccanRegions.json";
import { useAtom } from "jotai";
import { updateMarkersAtom } from "@/lib/atoms";

const ZoneForm = ({ modify = false, zoneData }) => {
  const [points, setPoints] = useAtom(updateMarkersAtom);

  console.log("Got following points", points);
  const cityRef = useRef(zoneData?.city);
  const regionRef = useRef(zoneData?.region);

  const updateCity = (city) => {
    cityRef.current.value = city;
  };
  const updateRegion = (region) => {
    regionRef.current.value = region;
  };

  console.log("got zone form : ", zoneData);

  return (
    <form className="w-full h-fit" action={updateZone}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 p-10 justify-items-center gap-x-4">
        <input
          type="text"
          name="id"
          defaultValue={zoneData?.id}
          disabled={!modify}
          className="hidden"
        />
        <input
          type="text"
          ref={cityRef}
          name="city"
          defaultValue={zoneData?.city}
          disabled={!modify}
          className="hidden"
        />
        <input
          type="text"
          ref={regionRef}
          name="region"
          defaultValue={zoneData?.region}
          disabled={!modify}
          className="hidden"
        />
        <div className="w-full flex flex-col items-start col-span-2 mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Type de zone
          </label>
          <select
            className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="type"
            disabled={!modify}
            defaultValue={zoneData?.type}
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
            defaultValue={zoneData?.name}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <SearchDropdown
            placeholder={"Ville"}
            label={"Ville"}
            values={cities.map((city) => city.ville)}
            defaultInputValue={zoneData?.city}
            defaultValues={["Casablanca", "Rabat", "Marrakech"]}
            inputFn={updateCity}
            disableInput={!modify}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <SearchDropdown
            placeholder={"Région"}
            label={"Région"}
            values={regions.map((region) => region.region)}
            defaultInputValue={zoneData?.region}
            defaultValues={[
              "Casablanca-Settat",
              "Rabat-Sale-Kenitra",
              "Marrakech-Safi",
            ]}
            inputFn={updateRegion}
            disableInput={!modify}
          />
        </div>
        {points.map((point, i) => (
          <div key={i}>
            <input
              name="point_lat"
              value={point.position.lat}
              readOnly
              className="hidden"
            />
            <input
              name="point_long"
              value={point.position.lng}
              readOnly
              className="hidden"
            />
          </div>
        ))}
      </div>

      {modify && (
        <div className="w-full flex flex-col items-center justify-center mb-5">
          <button
            className="flex items-center bg-emerald-500 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer"
            disabled={!modify}
          >
            Sauvegarder
          </button>
        </div>
      )}
    </form>
  );
};

export default ZoneForm;
