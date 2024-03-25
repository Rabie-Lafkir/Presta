/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef } from "react";
import { updateChecklist } from "@/actions/checklistActions";

const ChecklistForm = ({ modify = false, ChecklistData }) => {
  console.log("Got ChecklistData ; ", JSON.stringify(ChecklistData));
  const [status, setStatus] = useState(ChecklistData?.active);
  return (
    <form className="w-full h-fit" action={updateChecklist}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 p-10 justify-items-center gap-x-4">
        <input
          type="text"
          name="id"
          defaultValue={ChecklistData?.id}
          disabled={!modify}
          className="hidden"
        />
        <div className="w-full flex flex-col items-start col-span-2 mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Status de l'affectation
          </label>
          <select
            className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="active"
            disabled={!modify}
            defaultValue={ChecklistData?.active}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
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

export default ChecklistForm;
