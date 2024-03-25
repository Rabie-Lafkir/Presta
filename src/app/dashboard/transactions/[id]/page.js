/* eslint-disable react/no-unescaped-entities */
// Imports
import { BsFillTelephoneFill, BsFillPencilFill } from "react-icons/bs";
import { MdMoney } from "react-icons/md";
import { BiMoney } from "react-icons/bi";
import { FaCcVisa, FaCcMastercard, FaRunning, FaList } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";
import { BsCircleFill, BsFillBuildingFill } from "react-icons/bs";
import { createClient } from "@/lib/supabase-server";
import ClientCard from "@/components/ui/ClientCard";
import OrderStatus from "@/components/forms/OrderStatus";
import Link from "next/link";
import dayjs from "dayjs";
import Drawer from "@/components/ui/Drawer";
import ModifyTx from "@/components/forms/ModifyTx";
import OrderSchedules from "@/components/forms/OrderSchedules";

//Global Functions

const typeStyle = {
  cash: { color: "amber-500", text: "En Cash" },
  card: { color: "blue-600", text: "Par Carte" },
  check: { color: "blue-950", text: "Par chèque" },
};

const getOrderData = async (id) => {
  const timestamp = new Date();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, services(*), properties(*), users(*), transactions(*), invoices(*), order_schedules(*)"
    )
    //.limit(3, { foreignTable: "transactions" })
    .eq("id", id)
    .eq("order_schedules.active", false)
    //.gt("invoices.billing_date", dayjs(timestamp).format("YYYY-MM-DD"))
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Error while fetching order Data : ${JSON.stringify(error)}`
    );
  }

  console.log("Got specific order data : ", JSON.stringify(data));
  return data;
};

export default async function OrderPage({ params, searchParams }) {
  const tx = searchParams?.tx || false;
  const order = await getOrderData(params?.id);
  return (
    <div className="w-full">
      {tx && (
        <Drawer title="Modifier la transaction">
          <ModifyTx tx_id={tx} order_id={order?.id} />
        </Drawer>
      )}

      <div className="w-full flex items-start gap-x-4">
        <div className="w-1/4 flex flex-col items-center pt-12">
          <ClientCard client={order?.users} />
        </div>

        <div className="w-full">
          <div className={`flex justify-between items-center  mb-5`}>
            <div className="flex justify-end items-center h-16 gap-x-2">
              <a
                className="flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-purple-600 hover:shadow-lg cursor-pointer"
                href={`/dashboard/properties/${order?.properties?.id}`}
              >
                <BsFillBuildingFill size={14} className="text-white mr-2" />
                Bien
              </a>
              <a
                className="flex items-center bg-blue-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-blue-600 hover:shadow-lg cursor-pointer"
                href={`/dashboard/services/${order?.services?.id}`}
              >
                <MdCleaningServices size={14} className="text-white mr-2" />
                Service
              </a>
              <a
                className="flex items-center bg-emerald-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer"
                href={`/dashboard/deliveries/?order_id=${order?.id}`}
              >
                <FaRunning size={14} className="text-white mr-2" />
                Affecations
              </a>
              <a
                className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
                href={`/dashboard/checklists/?service=${order?.services?.id}`}
              >
                <FaList size={14} className="text-white mr-2" />
                Checklists
              </a>
            </div>
            <OrderStatus order_id={order?.id} status={order?.status} />
          </div>
          <div className="w-full my-4 p-2 flex items-center gap-x-4 mb-5">
            <div className="text-xl text-gray-600 font-semibold">Service :</div>
            <div className="text-xl text-blue-600 font-semibold">
              {order?.services?.name}
            </div>
          </div>
          <div className="w-full my-4 p-2 flex items-center bg-gray-200 rounded-lg shadow gap-x-4">
            <div className="text-lg text-blue-600 font-semibold">
              Prochaine facture :
            </div>
            <div className="text-blue-950 font-semibold">
              {dayjs(order?.invoices?.[0]?.billing_date).format("DD/MM/YYYY")}
            </div>
          </div>
          <OrderSchedules
            schedules={order?.order_schedules}
            duration={order?.services?.duration}
          />
          <div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit my-5">
            <div className="p-4 bg-white h-fit rounded-lg shadow-lg w-full">
              <div className="overflow-x-auto divide-gray-50">
                {order?.transactions?.length > 0 ? (
                  <table className="table">
                    <thead>
                      <tr className="border-t-0">
                        <th></th>
                        <th className="text-blue-600 font-semibold">Id</th>
                        <th className="text-blue-600 font-semibold">type</th>
                        <th className="text-blue-600 font-semibold">Status</th>
                        <th className="text-blue-600 font-semibold">Valeur</th>
                        <th className="text-blue-600 font-semibold">
                          Créée le
                        </th>
                        <th className="text-blue-600 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order?.transactions.map((tx) => (
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
                              href={`/dashboard/transactions/${order?.id}/?tx=${tx?.id}`}
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
                      Aucune transaction n'a été effectuée sur cette commande
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
