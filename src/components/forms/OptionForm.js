/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { updateOption } from "@/actions/optionActions";

const OptionForm = ({ modify = false, optionData }) => {
  return (
    <form className="w-full h-fit" action={updateOption}>
      <div className="w-full grid grid-cols-1 p-10 justify-items-center gap-x-4">
        <input
          type="number"
          name="id"
          defaultValue={optionData?.id}
          disabled={!modify}
          className="hidden"
        />
        <div className="w-full flex flex-col items-start col-span-2 mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Status de l'option
          </label>
          <select
            className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="active"
            disabled={!modify}
            defaultValue={optionData?.active}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactif</option>
          </select>
        </div>

        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Nom de l'option
          </label>
          <input
            type="text"
            name="name"
            placeholder="Nom de l'option"
            defaultValue={optionData?.name}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
          />
        </div>
        <div className="divider  border-blue-950 min-w-full col-span-2"></div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Description
          </label>
          <textarea
            type="text"
            name="description"
            placeholder="Donner une description au service"
            defaultValue={optionData?.description}
            className={
              "textarea textarea-bordered textarea-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
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

export default OptionForm;
