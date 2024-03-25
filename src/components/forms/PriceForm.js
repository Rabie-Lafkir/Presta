"use client";

import { useState } from "react";
import { updatePrice } from "@/actions/priceActions";

const PriceForm = ({ modify = false, priceData }) => {
  return (
    <form className="w-full h-fit" action={updatePrice}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 p-10 justify-items-center gap-x-4">
        <input
          type="text"
          name="id"
          defaultValue={priceData?.id}
          disabled={!modify}
          className="hidden"
        />
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Status du tarif
          </label>
          <select
            className="select w-full  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="active"
            disabled={!modify}
            defaultValue={priceData?.active}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactif</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Type de tarif
          </label>
          <select
            className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="is_fixed"
            disabled={!modify}
            defaultValue={priceData?.is_fixed}
          >
            <option value={true}>Fixe</option>
            <option value={false}>Variable</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Fréquence de facturation
          </label>
          <select
            className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="is_monthly"
            disabled={!modify}
            defaultValue={priceData?.is_monthly}
          >
            <option value={true}>Mensuelle</option>
            <option value={false}>Par passage</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Prix par default
          </label>
          <input
            type="number"
            name="default_price"
            placeholder="200"
            step="0.01"
            defaultValue={priceData?.default_price || 0}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Nom du tarif
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nom du tarif"
            defaultValue={priceData?.name}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
          />
        </div>
      </div>
      {modify && (
        <div className="w-full flex flex-col items-center justify-center mb-5">
          <button className="flex items-center bg-emerald-500 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer">
            Sauvegarder
          </button>
        </div>
      )}
    </form>
  );
};

export default PriceForm;
