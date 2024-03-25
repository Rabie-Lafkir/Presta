/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { createPrice } from "@/actions/priceActions";

const CreatePrice = ({ service_id, option_id }) => {
  const [pRanges, SetpRanges] = useState(1);
  return (
    <form className="w-full" action={createPrice}>
      <input
        type="text"
        name="service_id"
        value={service_id}
        className={"input hidden"}
      />
      <input
        type="text"
        name="option_id"
        value={option_id}
        className={"input hidden"}
      />
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Nom du tarif
        </label>
        <input
          type="text"
          name="price_name"
          placeholder="Entrez le nom du tarif"
          className={
            "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          }
        />
      </div>
      <div className="w-full flex flex-col items-start col-span-2 mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Type de tarification
        </label>
        <select
          className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
          name="is_fixed"
        >
          <option value={true}>Fixe</option>
          <option value={false}>Variable</option>
        </select>
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Tarif par défaut
        </label>
        <input
          type="number"
          name="default_price"
          placeholder="200"
          step="0.01"
          className={
            "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          }
        />
      </div>
      <div className="divider  border-blue-950 min-w-full col-span-2"></div>
      <div className="text-2xl text-blue-600 w-full my-5 font-semibold flex items-center justify-between">
        Palier de prix
        <div className="flex items-center">
          <AiFillMinusCircle
            size={32}
            className="text-amber-400 hover:text-amber-600 drop-shadow"
            onClick={() => SetpRanges(pRanges - 1)}
          />
          <AiFillPlusCircle
            size={32}
            className="text-emerald-400 hover:text-emerald-600 drop-shadow"
            onClick={() => SetpRanges(pRanges + 1)}
          />
        </div>
      </div>
      {pRanges < 1 ? (
        <div className="w-full h-12 text-purple-600 flex items-center justify-center text-center">
          {" "}
          Cette tarification n'utilisera que le prix par défaut
        </div>
      ) : (
        Array.from({ length: pRanges }).map((level, i) => (
          <div key={i} className="w-full grid grid-cols-3 gap-2">
            <div className="flex flex-col items-start mb-5">
              <label className="text-sm font-semibold text-blue-600 mb-2">
                Min
              </label>
              <input
                type="number"
                name="min_price"
                step="0.01"
                placeholder="0"
                className={
                  "input input-bordered input-primary w-full max-w-xs text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400 w-"
                }
              />
            </div>
            <div className="flex flex-col items-start mb-5">
              <label className="text-sm font-semibold text-blue-600 mb-2">
                Max
              </label>
              <input
                type="number"
                name="max_price"
                step="0.01"
                placeholder="0"
                className={
                  "input input-bordered input-primary w-full max-w-xs text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
                }
              />
            </div>
            <div className="flex flex-col items-start mb-5">
              <label className="text-sm font-semibold text-blue-600 mb-2">
                Prix
              </label>
              <input
                type="number"
                name="price"
                placeholder="0"
                step="0.01"
                className={
                  "input input-bordered input-primary w-full max-w-xs text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
                }
              />
            </div>
          </div>
        ))
      )}
      <div className="w-full flex flex-col items-center justify-center mb-5">
        <button className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer">
          Créer le tarif
        </button>
      </div>
    </form>
  );
};

export default CreatePrice;
