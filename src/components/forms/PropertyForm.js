/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { updateProperty } from "@/actions/propertyActions";

const PropertyForm = ({ modify = false, propertyData }) => {
  const [modifying, setModifying] = useState(modify);
  const [status, setStatus] = useState(propertyData?.active);

  return (
    <form className="w-full h-fit" action={updateProperty}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 p-10 justify-items-center gap-x-4">
        <input
          type="text"
          name="id"
          defaultValue={propertyData?.id}
          disabled={!modify}
          className="hidden"
        />
        <div className="w-full flex flex-col items-start col-span-2 mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Status du bien
          </label>
          <select
            className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="active"
            disabled={!modify}
            defaultValue={propertyData?.active}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactif</option>
          </select>
        </div>

        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Type du bien
          </label>
          <select
            className="select w-full text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="property_type"
            disabled={!modify}
            defaultValue={propertyData?.property_type}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={"maison"}>Maison</option>
            <option value={"bureau"}>Bureau</option>
            <option value={"magasin"}>Magasin</option>
            <option value={"syndique"}>Syndique</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Catégorie du bien
          </label>
          <select
            className="select w-full  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="property_category"
            disabled={!modify}
            defaultValue={propertyData?.property_category}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={"principal"}>Principal</option>
            <option value={"secondaire"}>Secondaire</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Numéro d'adresse
          </label>
          <input
            type="number"
            name="number"
            placeholder="105"
            defaultValue={propertyData?.number}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Rue
          </label>
          <input
            type="text"
            name="street"
            placeholder="Bd Zerkoutouni"
            defaultValue={propertyData?.street}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Quartier
          </label>
          <input
            type="text"
            name="neighborhood"
            placeholder="Maarif"
            defaultValue={propertyData?.neighborhood}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Ville
          </label>
          <input
            type="text"
            name="city"
            placeholder="Casablanca"
            defaultValue={propertyData?.city}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Région
          </label>
          <input
            type="text"
            name="region"
            placeholder="Casablanca-Settat"
            defaultValue={propertyData?.region}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="divider  border-blue-950 min-w-full col-span-2"></div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Indications
          </label>
          <textarea
            type="text"
            name="directions"
            placeholder="Indiquer comment accéder à la propriété du client"
            defaultValue={propertyData?.directions}
            className={
              "textarea textarea-bordered textarea-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
      </div>
      {modify && (
        <div className="w-full flex flex-col items-center justify-center mb-5">
          <button
            className="flex items-center bg-emerald-500 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer"
            type="submit"
          >
            Sauvegarder
          </button>
        </div>
      )}
    </form>
  );
};

export default PropertyForm;
