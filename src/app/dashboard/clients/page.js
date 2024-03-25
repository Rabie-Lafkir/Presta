/* eslint-disable @next/next/no-img-element */
import { createClient } from "@/lib/supabase-server";
import { BsCircleFill } from "react-icons/bs";
import Drawer from "@/components/ui/Drawer";
import CreateNewClient from "@/components/forms/CreateNewClient";
import Link from "next/link";
import { SearchClients } from "@/components/search/SearchClients";
import dayjs from "dayjs";

const getClients = async (searchParams) => {
  const supabase = createClient();
  if (searchParams?.keyword) {
    const { data, error } = await supabase.rpc("search_users_with_count", {
      keyword: searchParams?.keyword,
    });
    if (error) {
      console.log(
        "There was an error while searching for  clients",
        JSON.stringify(error)
      );
      throw new Error(
        `There was an error while searching for  clients : ${JSON.stringify(
          error
        )}`
      );
    }
    console.log("Got search Data : ", data);
    const parsedData = data.map((el) => ({
      ...el,
      properties: [{ count: el?.property_count }],
    }));
    return parsedData;
  }

  const { data, error } = await supabase
    .from("users")
    .select("*, properties(count)")
    .eq("role", "client")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("There was an error while fetching clients");
  }

  return data;
};

const getClientCount = async () => {
  const supabase = createClient();

  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "client");

  if (error) {
    throw new Error("There was an error while fetching clients' count");
  }

  return count;
};

const getNewClients = async () => {
  const supabase = createClient();
  const lastMonth = dayjs(new Date()).subtract(30, "day").toISOString();
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "client")
    .gte("created_at", lastMonth);

  if (error) {
    console.log(
      `There was an error while fetching new clients' count ${JSON.stringify(
        error
      )}`
    );
    throw new Error(
      `There was an error while fetching new clients' count ${JSON.stringify(
        error
      )}`
    );
  }

  return count;
};

const getInactive = async () => {
  const supabase = createClient();
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "client")
    .eq("active", false);

  if (error) {
    throw new Error("There was an error while fetching inactive clients count");
  }

  return count;
};

export default async function Clients({ searchParams }) {
  console.log("Got following search params : ", searchParams);
  const create = searchParams?.create;
  const data = await getClients(searchParams);
  const columns = [
    {
      accessoryKey: "status",
      header: "",
    },
    {
      accessoryKey: "profile_picture",
      header: "",
    },
    {
      accessoryKey: "f_name",
      header: "Prénom",
    },
    {
      accessoryKey: "l_name",
      header: "Nom",
    },
    {
      accessoryKey: "email",
      header: "Email",
    },
    {
      accessoryKey: "properties",
      header: "Nombre de biens",
    },
    {
      accessoryKey: "created_at",
      header: "Créé le",
    },
    {
      accessoryKey: "actions",
      header: "actions",
    },
  ];
  const totalClientCount = await getClientCount();
  const lastMonthCount = await getNewClients();
  const inactiveCount = await getInactive();
  return (
    <div className="w-full">
      {create && (
        <Drawer title="Créer un nouveau utilisateur">
          <CreateNewClient />
        </Drawer>
      )}
      <div className="w-full flex items-start gap-x-4">
        <div className="w-1/4 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-lg shadow-lg w-full h-24 mb-5">
            <div className="text-sm mb-2">Total des clients :</div>
            <div className="text-2xl font-bold">{totalClientCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-lg shadow-lg w-full h-24 mb-5">
            <div className="text-sm mb-2">Clients en 30 jours :</div>
            <div className="text-2xl font-bold">{lastMonthCount}</div>
          </div>
          <div className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-lg shadow-lg w-full h-24 mb-5">
            <div className="text-sm mb-2">Clients non confirmés :</div>
            <div className="text-2xl font-bold">{inactiveCount}</div>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full mb-5 flex justify-end gap-x-4 items-center">
            <SearchClients defaultValue={searchParams?.keyword} />
            <a
              className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
              href="/dashboard/clients?create=true"
            >
              Créer un client
            </a>
          </div>
          <div className="p-4 bg-white h-fit rounded-lg shadow-lg min-w-full">
            <div className="overflow-x-auto divide-gray-50 min-w-full">
              <table className="min-w-full table">
                <thead className="w-full">
                  <tr className="border-t-0">
                    <th className="w-4"></th>
                    <th className="w-4"></th>
                    <th className="text-blue-600 font-semibold">Prénom</th>
                    <th className="text-blue-600 font-semibold">Nom</th>
                    <th className="text-blue-600 font-semibold">email</th>
                    <th className="text-blue-600 font-semibold">
                      Nombre de biens
                    </th>
                    <th className="text-blue-600 font-semibold">Wallet</th>
                    <th className="text-blue-600 font-semibold">Téléphone</th>
                    <th className="text-blue-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="min-w-full">
                  {data.map((client, i) => (
                    <tr
                      className="border-t-2 border-b-0 border-t-blue-200 w-full"
                      key={i}
                    >
                      <th
                        className={`w-4 ${
                          client.active ? "text-green-300" : "text-yellow-300"
                        }`}
                      >
                        <BsCircleFill />
                      </th>
                      <th className="w-4">
                        {client?.profile_picture_url ? (
                          <div className="avatar ">
                            <div className="w-8 h-8 rounded-full">
                              <img
                                src={client?.profile_picture_url}
                                alt={` Profile picture for ${
                                  client?.first_name.split("")[0]
                                }${client?.last_name.split("")[0]}`}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-blue-600 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center">
                            <span className="text-sm font-bold">{`${
                              client?.first_name.split("")[0]
                            }${client?.last_name.split("")[0]}`}</span>
                          </div>
                        )}
                      </th>
                      <td className="text-blue-950 font-semibold">
                        {client?.first_name}
                      </td>
                      <td className="text-blue-950 font-semibold">
                        {client?.last_name}
                      </td>
                      <td className="text-blue-950 font-semibold">
                        {client?.email}
                      </td>
                      <td className="text-blue-950 font-semibold">
                        {client?.properties[0]?.count}
                      </td>
                      <td className="text-blue-950 font-semibold">
                        {`${client?.wallet ?? 0} Dhs`}
                      </td>
                      <td className="text-blue-950 font-semibold">
                        {client?.phone}
                      </td>
                      <td className="flex items-center gap-x-2">
                        <Link
                          className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
                          href={`/dashboard/clients/${client?.id}`}
                        >
                          Modifier
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
