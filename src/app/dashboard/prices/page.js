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
import { PriceFilter } from "@/components/forms/PricesFilter";
import Drawer from "@/components/ui/Drawer";

const getPricesData = async (params) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prices")
    .select(
      `*, services${params?.service ? "!inner" : ""}(*), options${
        params?.option ? "!inner" : ""
      }(*, services(*))`
    )
    .filter(
      `${
        params?.type == "service"
          ? "service_id"
          : params?.type == "option"
          ? "option_id"
          : "id"
      }`,
      `gte`,
      0
    )
    .filter(
      "options.name",
      `${params?.option ? "eq" : "gte"}`,
      params?.option || ""
    )
    .filter(
      "services.name",
      `${params?.service ? "eq" : "gte"}`,
      params?.service || ""
    )
    .filter("services.active", `eq`, true)

    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `Error while fetching service Data : ${JSON.stringify(error)}`
    );
  }

  console.log("got following prices data :", JSON.stringify(data));
  return data;
};
export default async function Prices({ searchParams }) {
  const prices = await getPricesData(searchParams);
  const create = searchParams?.create;

  console.log("Create value is ", create);

  return (
    <div className="w-full">
      {create && (
        <Drawer title="Créer une nouveau tarif">
          <div className="w-full flex flex-col justify-center items-center gap-y-5">
            <div className="text-blue-600 text-center">
              Pour créer un nouveau tarif, vous devez d'abord choisir un service
              ou une option
            </div>
            <Link
              className="bg-blue-600 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
              href={`/dashboard/services/`}
            >
              Choisir un service
            </Link>
            <Link
              className="bg-blue-600 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
              href={`/dashboard/options/`}
            >
              Choisir une option
            </Link>
          </div>
        </Drawer>
      )}
      <div className="w-full flex items-start gap-x-4">
        <div className="w-1/4 flex flex-col items-center">
          <PriceFilter />
          <Datacard
            title={"Nombre de tarifs"}
            data={prices?.length}
            showCta={false}
          />
          <Datacard
            title={"Nombre de services"}
            data={
              Array.from(
                new Set(prices.map((el) => el.services_id && el.services.id))
              ).length
            }
            showCta={false}
          />
          <Datacard
            title={"Nombre de tarifs appliqués"}
            data={
              prices
                .map(
                  (el) => el.services?.active || el.options?.services?.active
                )
                .filter((el) => el == true).length
            }
            showCta={false}
          />
        </div>
        <div className="w-full flex flex-col gap-y-6">
          <div className="w-full mb-5 flex justify-end">
            <Link
              className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
              href="/dashboard/prices?create=true"
            >
              Créer un tarif
            </Link>
          </div>
          <div className="p-4 bg-white h-fit rounded-lg shadow-lg w-full">
            <div className="overflow-x-auto divide-gray-50">
              {prices.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr className="border-t-0">
                      <th></th>
                      <th className="text-blue-600 font-semibold">
                        En lien avec
                      </th>
                      <th className="text-blue-600 font-semibold">
                        Nom du tarif
                      </th>
                      <th className="text-blue-600 font-semibold">
                        Nom du service
                      </th>
                      <th className="text-blue-600 font-semibold">
                        Nom de l'option
                      </th>
                      <th className="text-blue-600 font-semibold">
                        Nombre de palier
                      </th>
                      <th className="text-blue-600 font-semibold">Créé le </th>
                      <th className="text-blue-600 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((price) => (
                      <tr
                        className="border-t-2 border-b-0 border-t-blue-200"
                        key={price?.id}
                      >
                        <th
                          className={`w-12 ${
                            price?.services?.active ||
                            price?.options?.services?.active
                              ? "text-green-300"
                              : "text-yellow-300"
                          }`}
                        >
                          <BsCircleFill />
                        </th>
                        <td className="text-blue-950 font-semibold">
                          {price?.service_id ? (
                            <div className="badge px-2 py-2 bg-purple-400 text-white text-xs w-xs border-0">
                              Service
                            </div>
                          ) : (
                            <div className="badge px-2 py-1 bg-emerald-400 text-white text-xs w-xs border-0">
                              Option
                            </div>
                          )}
                        </td>
                        <td className="text-blue-950 font-semibold">
                          {price?.name ? formatProper(price?.name) : "-"}
                        </td>
                        <td className="text-blue-950 font-semibold">
                          {price?.services?.name
                            ? formatProper(price?.services?.name)
                            : price?.options?.services?.name
                            ? formatProper(price?.options?.services?.name)
                            : "-"}
                        </td>

                        <td className="text-blue-950 font-semibold">
                          {price?.option_id
                            ? formatProper(price?.options?.name)
                            : "-"}
                        </td>
                        <td className="text-blue-950 font-semibold">
                          {price?.price_list.length}
                        </td>
                        <td className="text-blue-950 font-semibold">
                          {
                            new Date(price?.created_at)
                              .toLocaleDateString("fr-FR")
                              .split("T")[0]
                          }
                        </td>
                        <td className="flex items-center gap-x-2">
                          <Link
                            className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
                            href={`/dashboard/prices/${price?.id}`}
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
                  <div>Aucun bien ne correspond aux filtres sélectionnés</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
