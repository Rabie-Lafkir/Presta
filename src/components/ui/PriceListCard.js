/* eslint-disable react/no-unescaped-entities */
"use client";

// imports
import { createClient } from "@/lib/supabase-client";
import { BsPlus } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import { useState } from "react";
import { updatePriceList } from "@/actions/priceActions";

//Setting up supabase
const supabase = createClient();

const PriceListCard = ({ price_id, price_list = [], modify = false }) => {
  const [priceList, setPriceList] = useState([...price_list]);
  const [newLevels, setNewLevels] = useState([]);
  return (
    <div className="w-full h-fit">
      <div className="w-full bg-white rounded-lg shadow-lg p-6">
        <div className="w-full flex items-center justify-between mb-5">
          <div className="font-semibold text-2xl text-emerald-600">
            Gérer les paliers
          </div>
          <button
            className={`flex items-center bg-emerald-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg ${
              modify ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onClick={() => setNewLevels([...newLevels, newLevels.length])}
            disabled={!modify}
          >
            <BsPlus size={24} className="text-white mr-2" />
            Créer un palier
          </button>
        </div>
        <form action={updatePriceList}>
          <input
            type="text"
            name="price_id"
            defaultValue={price_id}
            disabled={!modify}
            className="hidden"
          />
          {!priceList ? (
            <div className="w-full h-44 flex justify-center items-center text-emerald-600">
              Ce tarif n'a pas de paliers de tarification et utilise le tarif
              par défaut
            </div>
          ) : (
            priceList.map((price, i) => (
              <div
                key={i}
                className="w-full p-2 flex items-center justify-between py-4 px-8 gap-4"
              >
                <div className="w-full flex flex-col items-start mb-5">
                  <label className="text-sm font-semibold text-blue-600 mb-2">
                    Critère Minimum
                  </label>
                  <input
                    type="number"
                    name="min_price"
                    defaultValue={JSON.parse(price)?.min}
                    className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
                    disabled={!modify}
                  />
                </div>
                <div className="w-full flex flex-col items-start mb-5">
                  <label className="text-sm font-semibold text-blue-600 mb-2">
                    Critère Maximum
                  </label>
                  <input
                    type="number"
                    name="max_price"
                    defaultValue={JSON.parse(price)?.max}
                    className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
                    disabled={!modify}
                  />
                </div>
                <div className="w-full flex flex-col items-start mb-5">
                  <label className="text-sm font-semibold text-blue-600 mb-2">
                    Tarif appliqué
                  </label>
                  <input
                    type="number"
                    name="price"
                    defaultValue={JSON.parse(price)?.price}
                    className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
                    disabled={!modify}
                    step="any"
                  />
                </div>
                {modify && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setPriceList(
                        priceList.filter((el) => priceList.indexOf(el) != i)
                      );
                    }}
                  >
                    <AiFillMinusCircle size="24" className="text-red-500" />
                  </button>
                )}
              </div>
            ))
          )}
          {newLevels.map((_, i) => (
            <div
              key={i}
              className="w-full p-2 flex items-center justify-between py-4 px-8 gap-4"
            >
              <div className="w-full flex flex-col items-start mb-5">
                <label className="text-sm font-semibold text-blue-600 mb-2">
                  Tarif Minimum
                </label>
                <input
                  type="number"
                  name="min_price"
                  className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
                  disabled={!modify}
                />
              </div>
              <div className="w-full flex flex-col items-start mb-5">
                <label className="text-sm font-semibold text-blue-600 mb-2">
                  Tarif Maximum
                </label>
                <input
                  type="number"
                  name="max_price"
                  className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
                  disabled={!modify}
                />
              </div>
              <div className="w-full flex flex-col items-start mb-5">
                <label className="text-sm font-semibold text-blue-600 mb-2">
                  Tarif appliqué
                </label>
                <input
                  type="number"
                  name="price"
                  className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
                  disabled={!modify}
                />
              </div>
              {modify && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setNewLevels(
                      newLevels.filter((el) => newLevels.indexOf(el) != i)
                    );
                  }}
                >
                  <AiFillMinusCircle size="24" className="text-red-500" />
                </button>
              )}
            </div>
          ))}
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
      </div>
    </div>
  );
};

export default PriceListCard;
