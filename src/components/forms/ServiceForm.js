/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { updateService } from "@/actions/serviceActions";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";

const ServiceForm = ({ modify = false, serviceData }) => {
  const [status, setStatus] = useState(serviceData?.active);
  const [assetTypes, setAssetTypes] = useState();
  const [asset, setAsset] = useState({value : serviceData?.asset_type, label : serviceData?.asset_types.name});

  const supabase = createClient();

  const getAssetTypes = async () => {
    const { data, error } = await supabase.from("asset_types").select("*");

    if (error) {
      console.log("Error while getting asset types : ", JSON.stringify(error));
    }

    setAssetTypes(
      data
        ? data.map((el) => ({
            value: el.id,
            label: el.name,
          }))
        : []
    );

    console.log("Found following asset types : ", data);
    return data;
  };

  const updateAsset = async (query) => {
    setAsset(query?.value);
    return query?.value;
  };

  useEffect(() => {
    getAssetTypes();
  });

  return (
    <form className="w-full h-fit" action={updateService}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 p-10 justify-items-center gap-x-4">
        <input
          type="number"
          name="id"
          defaultValue={serviceData?.id}
          disabled={!modify}
          className="hidden"
        />
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Status du service
          </label>
          <select
            className="select w-full  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="active"
            disabled={!modify}
            defaultValue={serviceData?.active}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactif</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Type du service
          </label>
          <select
            className="select w-full  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="is_subscription"
            disabled={!modify}
            defaultValue={serviceData?.is_subscription}
          >
            <option value={true}>Abonnement</option>
            <option value={false}>Ponctuel</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Service gratuit ?
          </label>
          <select
            className="select w-full  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="is_free"
            disabled={!modify}
            defaultValue={serviceData?.is_free}
          >
            <option value={true}>Oui</option>
            <option value={false}>Non</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Nom du service
          </label>
          <input
            type="text"
            name="name"
            placeholder="E.g. Ménage"
            defaultValue={serviceData?.name}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Choissisez un utilisateur
          </label>
          <Select
            onChange={updateAsset}
            options={assetTypes}
            name="asset_type"
            defaultValue={asset}
            placeholder="Type d'actif"
            classNames={{
              control: (state) =>
                "select w-full border-purple-400 text-blue-950 bg-white disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
              option: (state) => "text-blue-950",
            }}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Prix minimum (en Dhs)
          </label>
          <input
            type="number"
            name="min_price"
            placeholder="100"
            defaultValue={serviceData?.min_price}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Prix maximum (en Dhs)
          </label>
          <input
            type="number"
            name="max_price"
            placeholder="100"
            defaultValue={serviceData?.max_price}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Durée d'un passage (en minutes)
          </label>
          <input
            type="number"
            name="duration"
            placeholder="45"
            defaultValue={serviceData?.duration}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setStatus(e.target.value)}
          />
        </div>
        <div className="divider  border-blue-950 min-w-full col-span-2"></div>
        <div className="w-full flex flex-col items-start mb-5  col-span-2">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Description
          </label>
          <textarea
            type="text"
            name="description"
            placeholder="Donner une description au service"
            rows={6}
            defaultValue={serviceData?.description}
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

export default ServiceForm;
