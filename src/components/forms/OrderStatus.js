"use client";
import { createClient } from "@/lib/supabase-client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const statusStyle = {
  planned: { color: "blue-600", text: "Planifiée" },
  started: { color: "emerald-500", text: "En cours" },
  finished: { color: "blue-950", text: "Terminée" },
  canceled: { color: "red-300", text: "Annulée" },
  pending: { color: "amber-500", text: "En attente" },
};

const OrderStatus = ({ order_id, status }) => {
  const router = useRouter();
  const [modify, setModify] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState();

  const updateOrder = async (id, status) => {
    console.log("Order id : ", id);
    console.log("Order status : ", status);
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);
    if (error) {
      console.log(
        "Error while updating order",
        console.log(JSON.stringify(error))
      );
    }
    setModify(false);
    router.push(`/dashboard/transactions/${order_id}?updated=${new Date().getTime()}`);
  };

  return (
    <div className="w-full flex items-center justify-end gap-x-4">
      {modify ? (
        <div className="w-full flex items-center justify-end gap-x-4">
          <div className="text-blue-500">
            Êtes-vous sûr de vouloir modifier le statut de cette commande ?
          </div>
          <button
            onClick={() => setModify(false)}
            className="p-2 bg-amber-400 text-white font-semibold rounded-lg shadow shadow-amber-100"
          >
            Non
          </button>
          <button
            className="p-2 bg-emerald-500 text-white font-semibold rounded-lg shadow shadow-emerald-100"
            onClick={() => updateOrder(order_id, updatedStatus)}
          >
            Oui
          </button>
        </div>
      ) : (
        <details className="dropdown">
          <summary className="m-1 btn border-0 bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer">
            Modifier
          </summary>
          <ul className="p-2 shadow menu dropdown-content z-[1] bg-white rounded-box w-fit">
            {Object.keys(statusStyle)
              ?.filter((el) => el != status)
              .map((key, i) => (
                <li key={i}>
                  <button
                    className={`text-${statusStyle[key].color}`}
                    onClick={() => {
                      setUpdatedStatus(key);
                      setModify(true);
                    }}
                  >
                    {statusStyle[key].text}
                  </button>
                </li>
              ))}
          </ul>
        </details>
      )}
    </div>
  );
};

export default OrderStatus;
