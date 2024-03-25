/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
import cities from "../../lib/helpers/moroccanCities.json";
import regions from "../../lib/helpers/moroccanRegions.json";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase-client";
import { formatProper } from "@/lib/utils";
import Select from "react-select";

export const QuestionstFilter = ({ questions }) => {
  // Setting up dynamic routing
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //Handle Dynamic Params
  let currentParams = new URLSearchParams(Array.from(searchParams.entries()));

  useEffect(() => {
    currentParams = new URLSearchParams(Array.from(searchParams.entries()));
  }, [pathname, searchParams]);

  //State variables

  const [question, setQuestion] = useState();

  const addFilters = () => {
    question && currentParams.set("question", question);
    console.log(`rEDIRECTING TO : ${pathname}?${currentParams.toString()}`);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  //Main Functions
  const updateChecklist = (question) => {
    console.log("Picked : ", question?.value);
    setQuestion(question?.value);
  };

  const clearSelection = () => {
    setChecklist();
    router.push(pathname);
  };

  return (
    <div className="w-full px-4 py-8 rounded-lg bg-white shadow-lg flex flex-col items-center">
      <div className="text-amber-500 text-2xl font-semibold w-full mb-5">
        Filtrez les réponses
      </div>
      <div className="w-full flex flex-col items-start">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Choissisez une question
        </label>
        <Select
          onChange={updateChecklist}
          options={questions}
          name="Choissisez une question"
          placeholder="Veuillez choisir une question ..."
          unstyled={true}
          classNames={{
            control: (state) =>
              "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
            option: (state) => "text-blue-600 px-5 py-2 bg-white",
            menu: (state) => "shadow",
            noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
            container: (state) => "w-full",
            placeholder: (state) => "line-clamp-1",
          }}
        />
      </div>
      <div className="w-full flex items-center justify-between gap-x-2">
        <button
          className="bg-emerald-400 rounded px-4 py-2 font-semibold text-white shadow hover:shadow-lg hover:bg-emerald-600"
          onClick={addFilters}
        >
          Appliquer
        </button>
        <button
          className="bg-amber-400 rounded px-4 py-2 font-semibold text-white shadow hover:shadow-lg hover:bg-amber-600 flex items-center"
          onClick={clearSelection}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
};
