/* eslint-disable react/no-unescaped-entities */
import Datacard from "@/components/ui/DataCard";
import Drawer from "@/components/ui/Drawer";
import { createClient } from "@/lib/supabase-server";
import {
  BsCircleFill,
  BsShop,
  BsFillBuildingFill,
  BsPeopleFill,
} from "react-icons/bs";

import Link from "next/link";
import { formatProper } from "@/lib/utils";
import { TeamFilter } from "@/components/forms/TeamFilter";
import CreateTeam from "@/components/forms/CreateTeam";

const teamColors = {
  normal: "purple",
  macro: "emerald",
  micro: "blue",
  nano: "amber",
  pico: "fushia",
};

const getTeamsData = async (params) => {
  const supabase = createClient();

  let query = supabase
    .from("teams")
    .select(`*, teams_members${params?.member ? "!inner" : ""}(*, users(*))`);

  if (params?.member) {
    query = query.eq("teams_members.user", params?.member);
  }
  if (params?.team) {
    query = query.eq("id", params?.team);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(
      `Error while fetching team Data : ${JSON.stringify(error)}`
    );
  }

  //console.log("got following teams data :", JSON.stringify(data));
  return data;
};
export default async function teams({ searchParams }) {
  const teams = await getTeamsData(searchParams);
  const create = searchParams?.create || false;
  return (
    <div>
      {create && (
        <Drawer title={"Créer une équipe"}>
          <CreateTeam />
        </Drawer>
      )}
      <div className="w-full flex items-start gap-x-4">
        <div className="w-1/4 flex flex-col items-center">
          <TeamFilter />
          <Datacard
            title={"Nombre d'équipes"}
            data={teams?.length}
            showCta={false}
          />
        </div>
        <div className="w-full flex flex-col gap-y-6">
          <div className="w-full mb-5 flex justify-end">
            <Link
              className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
              href="/dashboard/teams?create=true"
            >
              Créer une team
            </Link>
          </div>
          <div className="p-4 bg-white h-fit rounded-lg shadow-lg w-full">
            <div className="overflow-x-auto divide-gray-50">
              {teams.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr className="border-t-0">
                      <th></th>
                      <th className="text-blue-600 font-semibold">
                        Nom de l'équipe
                      </th>
                      <th className="text-blue-600 font-semibold">
                        Nombre de superviseur
                      </th>
                      <th className="text-blue-600 font-semibold">
                        Nombre de membres
                      </th>
                      <th className="text-blue-600 font-semibold">
                        Taille de l'équipe
                      </th>

                      <th className="text-blue-600 font-semibold">Crée le</th>
                      <th className="text-blue-600 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team) => (
                      <tr
                        className="border-t-2 border-b-0 border-t-blue-200"
                        key={team?.id}
                      >
                        <td
                          className={`w-12 ${
                            team?.active ? "text-green-300" : "text-yellow-300"
                          }`}
                        >
                          <BsCircleFill />
                        </td>
                        <td className="text-blue-950 font-semibold">
                          {formatProper(team?.name)}
                        </td>
                        <td className="text-blue-950 font-semibold">
                          <div
                            className="tooltip tooltip-info"
                            data-tip={team?.teams_members
                              ?.filter((el) => el.role == "supervisor")
                              ?.map((el) => el?.users?.username)
                              ?.join(" | ")}
                          >
                            {
                              team?.teams_members?.filter(
                                (el) => el.role == "supervisor"
                              )?.length
                            }
                          </div>
                        </td>
                        <td
                          className={`${
                            team?.teams_members?.length == team?.size
                              ? "text-blue-950"
                              : "text-amber-600"
                          } font-semibold text-center`}
                        >
                          {team?.teams_members?.length}
                        </td>
                        <td className="text-blue-950 font-semibold text-center">
                          {team?.size}
                        </td>
                        <td className="text-blue-950 font-semibold">
                          {new Intl.DateTimeFormat("fr-FR").format(
                            Date.parse(team?.created_at)
                          )}
                        </td>
                        <td className="flex items-center gap-x-2">
                          <Link
                            className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
                            href={`/dashboard/teams/${team?.id}`}
                          >
                            Modifier
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="w-full flex items-center justify-center text-purple-600 h-56">
                  <div>Aucune team ne correspond aux filtres sélectionnés</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
