/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import Select from "react-select";

export const TxFilter = () => {
  // Setting up dynamic routing
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  //Handle Dynamic Params

  const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
  console.log("Search params are : ", currentParams.get("userString"));
  console.log("Search params are : ", currentParams.get("property_id"));

  const addFilters = () => {
    userString && currentParams.set("userString", userString);
    property_id && currentParams.set("property_id", property_id);
    service_id && currentParams.set("service_id", service_id);
    console.log(`rEDIRECTING TO : ${pathname}?${currentParams.toString()}`);
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  //Configuring Supabase
  const supabase = createClient();
  const [userString, setUserString] = useState();
  const [clients, setClients] = useState([]);
  const [property_id, setPropertyId] = useState();
  const [service_id, setServiceId] = useState();
  const [properties, setProperties] = useState({});
  const [services, setServices] = useState({});
  const [loading, setLoading] = useState(true);

  const updateUserString = async (query) => {
    console.log("Got this from child", query);
    setUserString(query.value);
    return query;
  };

  const updateProperty = async (query) => {
    console.log("Got this from child", query);
    setPropertyId(query.value);
    return query;
  };
  const updateService = async (query) => {
    console.log("Got this from child", query);
    setServiceId(query.value);
    return query;
  };

  const clearSelection = () => {
    router.push(pathname);
  };

  const getUsers = async () => {
    const filteredUsers = await supabase
      .from("users")
      .select("*")
      .eq("role", "client");

    setClients(
      filteredUsers?.data
        ? filteredUsers?.data.map((el) => ({
            value: el.id,
            label: el.username,
          }))
        : []
    );

    console.log("Found following users : ", clients);
    return filteredUsers;
  };

  const getProperties = async () => {
    const filteredProps = await supabase
      .from("properties")
      .select("*")
      .eq("active", true);

    setProperties(
      filteredProps?.data
        ? filteredProps?.data.map((el) => ({
            value: el.id,
            label: el.property_name,
          }))
        : []
    );

    console.log("Found following properties : ", clients);
    return filteredProps;
  };
  const getServices = async () => {
    const filteredServices = await supabase
      .from("services")
      .select("*")
      .eq("active", "true");

    setServices(
      filteredServices?.data
        ? filteredServices?.data.map((el) => ({
            value: el.id,
            label: el.name,
          }))
        : []
    );

    setLoading(false);

    console.log("Found following services : ", services);
    return filteredServices;
  };

  useEffect(() => {
    getUsers();
    getProperties();
    getServices();
  }, []);

  return (
    <div className="w-full px-4 py-8 rounded-lg bg-white shadow-lg flex flex-col items-center">
      <div className="text-amber-500 text-2xl font-semibold w-full mb-5">
        Filtrez les transactions
      </div>

      {loading ? (
        <div className="w-fill my-5 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="w-full flex flex-col gap-y-4">
          {clients?.length > 0 && (
            <div className="w-full flex flex-col items-start col-span-2">
              <label className="text-sm font-semibold text-blue-600 mb-2">
                Filtrer par client
              </label>
              <Select
                onChange={updateUserString}
                options={clients}
                name="client_id"
                placeholder="Veuillez choisir un client ..."
                defaultValue={
                  clients?.filter(
                    (client) => client?.value == currentParams.get("userString")
                  )?.[0]
                }
                unstyled={true}
                classNames={{
                  control: (state) =>
                    "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
                  option: (state) => "text-blue-600 px-5 py-2 bg-white",
                  menu: (state) => "shadow",
                  noOptionsMessage: (state) =>
                    "text-blue-600 px-5 py-2 bg-white",
                  container: (state) => "w-full",
                }}
              />
            </div>
          )}
          {properties?.length > 0 && (
            <div className="w-full flex flex-col items-start col-span-2">
              <label className="text-sm font-semibold text-blue-600 mb-2">
                Filtrer par bien
              </label>
              <Select
                onChange={updateProperty}
                options={properties}
                name="property_id"
                placeholder="Veuillez choisir un bien ..."
                unstyled={true}
                defaultValue={
                  properties?.filter(
                    (prop) => prop?.value == currentParams.get("property_id")
                  )?.[0]
                }
                classNames={{
                  control: (state) =>
                    "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
                  option: (state) => "text-blue-600 px-5 py-2 bg-white",
                  menu: (state) => "shadow",
                  noOptionsMessage: (state) =>
                    "text-blue-600 px-5 py-2 bg-white",
                  container: (state) => "w-full",
                }}
              />
            </div>
          )}
          {services?.length > 0 && (
            <div className="w-full flex flex-col items-start col-span-2">
              <label className="text-sm font-semibold text-blue-600 mb-2">
                Filtrer par service
              </label>
              <Select
                onChange={updateService}
                options={services}
                name="service_id"
                placeholder="Veuillez choisir un service ..."
                unstyled={true}
                defaultValue={
                  services?.filter(
                    (service) =>
                      service?.value == currentParams.get("service_id")
                  )?.[0]
                }
                classNames={{
                  control: (state) =>
                    "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
                  option: (state) => "text-blue-600 px-5 py-2 bg-white",
                  menu: (state) => "shadow",
                  noOptionsMessage: (state) =>
                    "text-blue-600 px-5 py-2 bg-white",
                  container: (state) => "w-full",
                }}
              />
            </div>
          )}
        </div>
      )}

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
