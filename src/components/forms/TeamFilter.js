/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import SearchDropdown from "../ui/SearchDropdown";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";

export const TeamFilter = () => {
  // Setting up dynamic routing
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let currentParams = new URLSearchParams(Array.from(searchParams.entries()));

  //State variables

  const [supervisor, setSupervisor] = useState(currentParams?.get("member"));
  const [supervisorList, setSupervisorList] = useState([]);
  const [team, setTeam] = useState();
  const [teamList, setTeamList] = useState([]);
  const teamRef = useRef()

  const addFilters = () => {
    supervisor && currentParams.set("member", supervisor);
    team && currentParams.set("team", team);
    console.log(`rEDIRECTING TO : ${pathname}?${currentParams.toString()}`);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const getTeams = async () => {
    const { data, error } = await supabase.from("teams").select("*");

    console.log(`Found following teams for query :`, data);
    setTeamList(
      data
        ? data.map((el) => ({
            value: el.id,
            label: el.name,
          }))
        : []
    );
  };

  const getUsers = async () => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("role", "client");

    console.log(`Found following teams for query :`, data);
    setSupervisorList(
      data
        ? data.map((el) => ({
            value: el.id,
            label: el.username,
          }))
        : []
    );
  };

  const updateSupervisor = async (query) => {
    setSupervisor(query?.value);
    console.log("Searching for : ", query);

    return query;
  };

  const updateTeamName = async (query) => {
    setTeam(query?.value);

    return query;
  };

  //Main Functions

  const clearSelection = () => {
    setSupervisor();
    setTeam();
    router.push(pathname);
  };

  //Handle Dynamic Params

  useEffect(() => {
    currentParams = new URLSearchParams(Array.from(searchParams.entries()));
  }, [pathname, searchParams]);

  useEffect(() => {
    getTeams();
    getUsers();
  }, []);

  return (
    <div className="w-full px-4 py-8 rounded-lg bg-white shadow-lg flex flex-col items-center mb-5">
      <div className="text-amber-500 text-2xl font-semibold w-full mb-5">
        Filtrez les équipes
      </div>
      <label className="text-sm font-semibold text-blue-600 w-full">
        Filtrer par collaborateur
      </label>
      <Select
        onChange={updateSupervisor}
        options={supervisorList}
        name="member"
        placeholder="Veuillez choisir un collaborateur ..."
        unstyled={true}
        classNames={{
          control: (state) =>
            "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 my-5",
          option: (state) => "text-blue-600 px-5 py-2 bg-white",
          menu: (state) => "shadow",
          noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
          placeholder: (state) => "line-clamp-1",
          container: (state) => "w-full",
        }}
      />
      <label className="text-sm font-semibold text-blue-600 w-full">
        Filtrer par nom d'équipe
      </label>
      <Select
        onChange={updateTeamName}
        options={teamList}
        name="team"
        ref={teamRef}
        placeholder="Veuillez choisir une équipe..."
        unstyled={true}
        defaultValue={teamList?.filter(team => team?.value == currentParams?.get("team"))}
        classNames={{
          control: (state) =>
            "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 my-5",
          option: (state) => "text-blue-600 px-5 py-2 bg-white",
          menu: (state) => "shadow",
          noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
          placeholder: (state) => "line-clamp-1",
          container: (state) => "w-full",
        }}
      />
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
