/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import SearchDropdown from "../ui/SearchDropdown";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Select from "react-select";

const DeliveryOptionsForm = ({ delivery_id, deliveryOptions }) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [roptions, setrOptions] = useState([]);
  const [options, setOptions] = useState([...deliveryOptions]);
  const [removed, setRemoved] = useState([]);
  const router = useRouter();

  const updateDelivery = async (query) => {
    setOptions([...options, { id: query.value, name: query.label }]);

    return options;
  };

  const updateDeliveryOptions = async () => {
    console.log("Got following options", options);
    console.log("Got following delivery ID :", delivery_id);

    const optionsRequest = [];
    const removedRequest = [];

    removed.map((option, i) =>
      removedRequest.push({
        option_id: option?.id,
        delivery_id: delivery_id,
      })
    );
    options.map((option, i) =>
      optionsRequest.push({
        option_id: option?.id,
        delivery_id: delivery_id,
      })
    );

    console.log("About to start update !", optionsRequest, removedRequest);
    const removedData = await supabase
      .from("deliveries_options")
      .upsert(removedRequest, {
        onConflict: "delivery_id,option_id",
        ignoreDuplicates: false,
      });

    if (removedData.error) {
      console.log(
        "Error while removing options from delivery :",
        JSON.stringify(removedData.error)
      );
    }

    const optionsData = await supabase
      .from("deliveries_options")
      .upsert(optionsRequest, {
        onConflict: "delivery_id,option_id",
        ignoreDuplicates: false,
      });

    if (optionsData.error) {
      console.log(
        "Error while adding option to  delivery :",
        JSON.stringify(optionsData.error)
      );
      throw new Error(
        `Error while adding option to  delivery : ${JSON.stringify(
          optionsData.error
        )}`
      );
    }

    console.log("Update is done");

    router.push(`/dashboard/deliveries/${delivery_id}`);
  };

  const getOptions = async (query) => {
    const filteredOpts = await supabase
      .from("options")
      .select("*, services(*)");

    console.log(`Found following options for query :`, filteredOpts);
    setrOptions(
      filteredOpts?.data
        ? filteredOpts?.data.map((el) => ({ value: el.id, label: el.name }))
        : []
    );
    return filteredOpts;
  };

  const getActOptions = async (query) => {
    const filteredOpts = await supabase
      .from("deliveries")
      .select("*, options(*)")
      .eq("id", delivery_id)
      .limit(1)
      .single();

    console.log(
      `Found following act options for query :`,
      filteredOpts?.data?.options.map((el) => ({
        value: el.id,
        label: el.name,
      }))
    );
    setOptions(
      filteredOpts?.data?.options
        ? filteredOpts?.data?.options.map((el) => ({
            id: el.id,
            name: el.name,
          }))
        : []
    );
    setLoading(false);
    return filteredOpts;
  };

  console.log("Delivery id is : ", delivery_id);

  useEffect(() => {
    getOptions();
    getActOptions();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {loading ? (
        <span className="loading loading-spinner loading-lg text-blue-950"></span>
      ) : (
        <div className="w-full">
          <div className="w-full flex items-center gap-2 my-5">
            <input
              name="delivery_id"
              value={delivery_id}
              className="hidden"
              readOnly
            />

            <label className="text-sm font-semibold text-blue-600 mb-2">
              Choissisez une option
            </label>
            <Select
              onChange={updateDelivery}
              options={roptions}
              name="options"
              placeholder="Choisir une option ..."
              unstyled={true}
              classNames={{
                control: (state) =>
                  "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
                option: (state) => "text-blue-600 px-5 py-2 bg-white",
                menu: (state) => "shadow",
                noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
                placeholder: (state) => "line-clamp-1",
                container: (state) => "w-full",
              }}
            />
            <AiFillPlusCircle
              size={32}
              className="text-emerald-400 hover:text-emerald-600 drop-shadow"
              onClick={() => {
                console.log("About to add", options);
                setOptions([
                  ...options,
                  ...options.filter(
                    (option) =>
                      !options.map((el) => el?.id).includes(option?.id)
                  ),
                ]);
              }}
            />
          </div>

          {options.length < 1 ? (
            <div className="w-full h-12 text-purple-600 flex items-center justify-center text-center mb-5">
              Vous n'avez toujours pas ajouté de options
            </div>
          ) : (
            options.map((option) => (
              <div key={option?.id} className="w-full flex flex-col mb-2">
                <input
                  name="option"
                  value={option?.id}
                  className="hidden"
                  readOnly
                />
                <div className="flex items-center mb-5 p-4 justify-between border borde-blue-600 rounded-lg shadow">
                  <div className="text-blue-600 font-semibold grow">
                    {option?.name}
                  </div>
                  <AiFillMinusCircle
                    size={32}
                    className="text-amber-400 hover:text-amber-600 drop-shadow"
                    onClick={() => {
                      setRemoved([
                        ...removed,
                        options.filter((el) => el?.id == option?.id)[0],
                      ]);
                      setOptions(options.filter((el) => el?.id != option?.id));
                      console.log("Got following options : ", options);
                    }}
                  />
                </div>
              </div>
            ))
          )}

          {removed.map((option, i) => (
            <input
              name="removed"
              value={option?.id}
              className="hidden"
              key={i}
              readOnly
            />
          ))}
          <div className="w-full flex flex-col items-center justify-center mb-5">
            <button
              className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:shadow-none"
              disabled={options?.length == 0}
              onClick={() => updateDeliveryOptions()}
            >
              Mettre à jour les options
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryOptionsForm;
