/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef, useEffect } from "react";
import { createChecklist } from "@/actions/checklistActions";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";

const CreateChecklist = () => {
  const supabase = createClient();
  const [service, setService] = useState();
  const [name, setName] = useState();
  const [serviceList, setServiceList] = useState([]);
  const serviceRef = useRef();

  const updateService = async (query) => {
    setService(query.value);

    console.log("got service : ", service);
  };
  const getServices = async (query) => {
    const filteredServices = await supabase.from("services").select("*");

    console.log(`Found following services for query :`, filteredServices);
    setServiceList(
      filteredServices?.data
        ? filteredServices?.data.map((el) => ({ value: el.id, label: el.name }))
        : []
    );
    return filteredServices;
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <form className="w-full" action={createChecklist}>
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
        }}
      />
      <input name="service_id" ref={serviceRef} className="hidden" />
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Nom de la Checklist
        </label>
        <input
          type="text"
          name="name"
          placeholder="Nom de la Checklist"
          className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          onChange={(e) => setName(e?.target?.value)}
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center my-5">
        <button
          className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:shadow-none"
          disabled={!name || !service}
        >
          Créer la Checklist
        </button>
      </div>
    </form>
  );
};

export default CreateChecklist;
