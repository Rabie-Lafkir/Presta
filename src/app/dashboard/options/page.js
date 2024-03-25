/* eslint-disable react/no-unescaped-entities */
import Datacard from "@/components/ui/DataCard";
import { createClient } from "@/lib/supabase-server";
import {
  BsCircleFill,
  BsShop,
  BsFillBuildingFill,
  BsPeopleFill,
} from "react-icons/bs";

import Link from "next/link";
import { formatProper } from "@/lib/utils";
import Drawer from "@/components/ui/Drawer";

const getOptionsData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("options")
    .select("*, services(*), prices(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Error while fetching service Data : ${JSON.stringify(error)}`
    );
  }

  console.log("got following options data :", data);
  return data;
};
export default async function Options({ params, searchParams }) {
  const options = await getOptionsData();
  const create = searchParams?.create;
  return (
    <div className="w-full">
      {create && (
        <Drawer title="Créer une nouvelle option">
          <div className="w-full flex flex-col justify-center items-center gap-y-5">
            <div className="text-blue-600 text-center">
              Pour créer une nouvelle option, vous devez d'abord choisir un
              service
            </div>
            <Link
              className="bg-blue-600 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
              href={`/dashboard/services/`}
            >
              Choisir un service
            </Link>
          </div>
        </Drawer>
      )}
      <div className="w-full flex items-start gap-x-4">
        <div className="w-1/4 flex flex-col items-center">
          <Datacard
            title={"Nombre d'options"}
            data={options?.length}
            showCta={false}
          />
          <Datacard
            title={"Nombre de services"}
            data={
              Array.from(new Set(options.map((el) => el.services.id))).length
            }
            showCta={false}
          />
          <Datacard
            title={"Nombre d'options active"}
            data={
              options.map((el) => el.services.active).filter((el) => el == true)
                .length
            }
            showCta={false}
          />
        </div>
        <div className="w-full flex flex-col gap-y-6">
          <div className="w-full mb-5 flex justify-end">
            <Link
              className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
              href="/dashboard/options/?create=true"
            >
              Créer une option
            </Link>
          </div>
          <div className="p-4 bg-white h-fit rounded-lg shadow-lg w-full">
            <div className="overflow-x-auto divide-gray-50">
              {options.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr className="border-t-0">
                      <th></th>
                      <th className="text-blue-600 font-semibold">
                        Nom de l'option
                      </th>
                      <th className="text-blue-600 font-semibold">
                        Nom du service
                      </th>
                      <th className="text-blue-600 font-semibold">
                        Nombre de Tarifs
                      </th>
                      <th className="text-blue-600 font-semibold">Créée le </th>
                      <th className="text-blue-600 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {options.map((option) => (
                      <tr
                        className="border-t-2 border-b-0 border-t-blue-200"
                        key={option?.id}
                      >
                        <th
                          className={`w-12 ${
                            option?.services?.active
                              ? "text-green-300"
                              : "text-yellow-300"
                          }`}
                        >
                          <BsCircleFill />
                        </th>
                        <td className="text-blue-950 font-semibold">
                          {formatProper(option?.name)}
                        </td>
                        <td className="text-blue-950 font-semibold">
                          {formatProper(option?.services?.name)}
                        </td>

                        <td className="text-blue-950 font-semibold text-center">
                          {option?.prices?.length}
                        </td>
                        <td className="text-blue-950 font-semibold">
                          {
                            new Date(option?.created_at)
                              .toLocaleDateString("fr-FR")
                              .split("T")[0]
                          }
                        </td>
                        <td className="flex items-center gap-x-2">
                          <Link
                            className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
                            href={`/dashboard/options/${option?.id}`}
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
                  <div>
                    Aucune option ne correspond aux filtres sélectionnés
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
