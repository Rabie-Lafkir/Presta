/* eslint-disable react/no-unescaped-entities */
import { createClient } from "@/lib/supabase-server";
import { BsCircleFill } from "react-icons/bs";
import { MdMoney } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";

import Link from "next/link";
import { formatProper } from "@/lib/utils";
import Drawer from "@/components/ui/Drawer";
import { SearchDetailedTxs } from "@/components/search/SearchDetailedTxs";
import { TxFilter } from "@/components/forms/TxFilter";
import ModifyTx from "@/components/forms/ModifyTx";

const statusStyle = {
  planned: { color: "blue-600", text: "Planifiée" },
  started: { color: "emerald-500", text: "En cours" },
  finished: { color: "blue-950", text: "Terminée" },
  canceled: { color: "red-300", text: "Annulée" },
  pending: { color: "amber-500", text: "En attente" },
};

const typeStyle = {
  cash: { color: "amber-500", text: "En Cash" },
  card: { color: "blue-600", text: "Par Carte" },
  check: { color: "blue-950", text: "Par chèque" },
};

const getTxData = async (searchParams) => {
  const supabase = createClient();

  let query = supabase
    .from("transactions")
    .select(
      "*, orders!inner(*,services!inner(*)), properties!inner(*), users!inner(*))"
    );

  if (searchParams?.userString) {
    query = query.eq("users.id", searchParams?.userString);
  }
  if (searchParams?.property_id) {
    query = query.eq("properties.id", searchParams?.property_id);
  }
  if (searchParams?.service_id) {
    query = query.eq("orders.services.id", searchParams?.service_id);
  }
  if (searchParams?.keyword) {
    query = query.ilike("users.username", `%${searchParams?.keyword}%`);
  }

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error while fetching tx Data : ${JSON.stringify(error)}`);
  }

  console.log("got following yx data :", JSON.stringify(data));
  return data;
};
export default async function DetailedTransactions({ params, searchParams }) {
  const txs = await getTxData(searchParams);
  const tx = searchParams?.tx || false;
  const order_id = searchParams?.order_id || false;
  const keyword = searchParams?.keyword;
  return (
    <div className="w-full">
      {tx && (
        <Drawer title="Modifier la transaction">
          <ModifyTx tx_id={tx} order_id={order_id} />
        </Drawer>
      )}
      <div className="w-full flex items-start gap-x-4">
        <div className="w-1/4 flex flex-col items-center">
          <TxFilter />
        </div>
        <div className="w-full flex flex-col gap-y-6">
          <div className="w-full mb-5 flex justify-end">
            <SearchDetailedTxs defaultValue={keyword} />
          </div>
          <div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit my-5">
            <div className="p-4 bg-white h-fit rounded-lg shadow-lg w-full">
              <div className="overflow-x-auto divide-gray-50">
                {txs?.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr className="border-t-0">
                        <th></th>
                        <th className="text-blue-600 font-semibold">Id</th>
                        <th className="text-blue-600 font-semibold">type</th>
                        <th className="text-blue-600 font-semibold">client</th>
                        <th className="text-blue-600 font-semibold">service</th>
                        <th className="text-blue-600 font-semibold">Status</th>
                        <th className="text-blue-600 font-semibold">Valeur</th>
                        <th className="text-blue-600 font-semibold">
                          Créée le
                        </th>
                        <th className="text-blue-600 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {txs?.map((tx) => (
                        <tr
                          className="border-t-2 border-b-0 border-t-blue-200"
                          key={tx?.id}
                        >
                          <th
                            className={`w-12 ${
                              tx?.success ? "text-green-300" : "text-yellow-300"
                            }`}
                          >
                            <BsCircleFill />
                          </th>
                          <td className="text-blue-950 font-semibold">
                            {tx?.id}
                          </td>

                          <td
                            className={`text-${
                              typeStyle?.[tx?.type]?.color
                            } font-semibold`}
                          >
                            <div className="w-fit flex items-center gap-x-2">
                              {tx?.type == "cash" && <BiMoney size={24} />}
                              {tx?.type == "check" && <MdMoney size={24} />}
                              {tx?.type == "card" &&
                                tx?.card_type.toLowerCase() == "visa" && (
                                  <FaCcVisa size={24} />
                                )}
                              {tx?.type == "card" &&
                                tx?.card_type.toLowerCase() == "mastercard" && (
                                  <FaCcMastercard size={24} />
                                )}
                              <span>{typeStyle?.[tx?.type]?.text}</span>
                            </div>
                          </td>
                          <td className="text-blue-950 font-semibold">
                            {tx?.users?.username}
                          </td>
                          <td className="text-blue-950 font-semibold">
                            {tx?.orders?.services?.name}
                          </td>

                          <td
                            className={`w-fit font-semibold ${
                              tx?.success ? "text-green-300" : "text-amber-500"
                            }`}
                          >
                            {tx?.success
                              ? "Valide"
                              : tx?.type != "card"
                              ? "En attente"
                              : "Échouée"}
                          </td>
                          <td className="text-blue-950 font-semibold">
                            {`${tx?.value?.toFixed(2)} Dhs`}
                          </td>
                          <td className="text-blue-950 font-semibold">
                            {
                              new Date(tx?.created_at)
                                .toLocaleDateString("fr-FR")
                                .split("T")[0]
                            }
                          </td>
                          <td className="flex items-center gap-x-2">
                            <Link
                              className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
                              href={`/dashboard/detailedtxs/?tx=${tx?.id}&order_id=${tx?.orders?.id}`}
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
                      Aucune transaction ne correspond aux filtres sélectionnés
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
