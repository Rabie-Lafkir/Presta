/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef, useEffect } from "react";
import { updateTx } from "@/actions/txActions";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";

import DatePicker, { setDefaultLocale } from "react-datepicker";
setDefaultLocale("fr");

import "@/lib/styles/datepicker.css";

const ModifyTx = ({ tx_id, order_id }) => {
  const supabase = createClient();
  const [tx, setTx] = useState();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState();
  const [updated, setUpdated] = useState();

  const updatedValueRef = useRef();

  const typeStyle = {
    cash: { color: "amber-500", text: "En Cash" },
    card: { color: "blue-600", text: "Par Carte" },
    check: { color: "blue-950", text: "Par chèque" },
  };

  const getTx = async () => {
    const { data, error } = await supabase
      .from("transactions")
      .select("*, orders(*, services(*)) , users(*)")
      .eq("id", tx_id)
      .limit(1)
      .maybeSingle(1);

    if (error) {
      console.log(`Error while fetching Tx Data : ${JSON.stringify(error)}`);
      throw new Error(
        `Error while fetching Tx Data : ${JSON.stringify(error)}`
      );
    }
    setTx(data);
    setLoading(false);
    setSuccess(data?.success);
    setUpdated(data?.updated_value);
    console.log("Found following tx : ", data);
    return data;
  };

  useEffect(() => {
    getTx();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {!loading && (
        <div className="w-full flex flex-col items-stretch gap-y-5">
          <div
            className={`w-full flex flex-col items-stretch gap-y-4 ${
              tx?.type != "card" && "border-b border-pStdBlue/25"
            } py-5`}
          >
            <div className="text-pStdBlue text-xl font-semibold">
              Information de la transaction :
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="text-base text-pDarkBlue">Nom du client :</div>
              <div className="text-base text-pBlue">{tx?.users?.username}</div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="text-base text-pDarkBlue">Service:</div>
              <div className="text-base text-pBlue">
                {tx?.orders?.services?.name}
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="text-base text-pDarkBlue">Commande :</div>
              <div className="text-base text-pBlue">
                {tx?.orders?.id?.split("-")?.[0]}
              </div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="text-base text-pDarkBlue">Valeur :</div>
              <div className="text-base text-pBlue">{`${tx?.value?.toFixed(
                2
              )} Dhs`}</div>
            </div>
            <div className="w-full flex items-center justify-between">
              <div className="text-base text-pDarkBlue">Méthode :</div>
              <div className={`text-base text-${typeStyle[tx?.type]?.color}`}>
                {typeStyle[tx?.type]?.text}
              </div>
            </div>
          </div>
          {tx?.type != "card" && (
            <form className="w-full" action={updateTx}>
              <div className="w-full flex flex-col items-start col-span-2 mb-5">
                <label className="text-sm font-semibold text-blue-600 mb-2">
                  Status de la transaction
                </label>
                <select
                  className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
                  name="success"
                  onChange={(e) => {
                    setSuccess(e?.target?.value);
                    console.log("Success is ", e?.target?.value);
                  }}
                  defaultValue={success}
                >
                  <option value={false}>
                    {tx?.type == "card" ? "Échouée" : "En Attente"}
                  </option>
                  <option value={true}>Valide</option>
                </select>
              </div>

              {success && (
                <div className="w-full flex flex-col items-start col-span-2 mb-5">
                  <label className="text-sm font-semibold text-blue-600 mb-2">
                    Montant reçu
                  </label>
                  <input
                    className="input w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
                    name="updated_value"
                    defaultValue={tx?.updated_value}
                    onInput={(e) => setUpdated(e?.target?.value)}
                    placeholder="Montant reçu"
                  ></input>
                </div>
              )}
              <div className="w-full flex flex-col items-start col-span-2 mb-5">
                <label className="text-sm font-semibold text-blue-600 mb-2">
                  Commentaire
                </label>
                <textarea
                  className="textarea w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
                  name="comment"
                  defaultValue={tx?.comment}
                  placeholder="Ajoutez un commentaire à la transaction"
                ></textarea>
              </div>

              <input name="tx_id" defaultValue={tx_id} className="hidden" />
              <input
                name="order_id"
                defaultValue={order_id}
                className="hidden"
              />
              <div className="w-full flex flex-col items-center justify-center my-5">
                <button
                  className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:shadow-none"
                  disabled={success && !updated}
                >
                  Mettre à jour la transaction
                </button>
              </div>
            </form>
          )}
        </div>
      )}
      {loading && (
        <div className="w-full text-pStdBlue flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
    </div>
  );
};

export default ModifyTx;
