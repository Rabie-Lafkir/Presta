import { createClient } from "@/lib/supabase-server";
import Datacard from "@/components/ui/DataCard";
import {
  BsFillTelephoneFill,
  BsFillPencilFill,
  BsBackspaceFill,
  BsFillHouseDoorFill,
} from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";
import ClientForm from "@/components/forms/ClientForm";
import Link from "next/link";

const getClientData = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*, properties(count), contacts(count), orders(count)")
    .eq("id", id)
    .single();

  //console.log("CLient Data is ", data);
  return data;
};

const getClientProperties = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("owner", id);
  return data;
};

const getClientInteractions = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("interactions")
    .select("*, properties(property_name)")
    .eq("owner", id)
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(
      `Error while fetching interactions: ${JSON.stringify(error)}`
    );
  }
  return data;
};
export default async function ClientPage({ params, searchParams }) {
  const clientData = await getClientData(params?.id);
  const propertiesData = await getClientProperties(params?.id);
  const interactionsData = await getClientInteractions(params?.id);

  console.log("Got following interactions : ", interactionsData);

  const modify = searchParams?.modify || false;
  return (
    <div className="w-full flex items-start gap-x-4">
      <div className="w-1/4 flex flex-col items-center">
        <Datacard
          title={"Nombre de biens"}
          cta={"Gérer"}
          data={clientData?.properties[0]?.count}
          url={"/"}
        />
        <Datacard
          title={"Nombre de services"}
          cta={"Gérer"}
          data={clientData?.orders[0]?.count}
          url={"/"}
        />
        <Datacard
          title={"Nombre de contacts"}
          cta={"Gérer"}
          data={clientData?.contacts[0]?.count}
          url={"/"}
        />
      </div>
      <div className="w-full h-full">
        {!modify && (
          <div className={`flex justify-between`}>
            <div className="flex justify-end items-center h-16 mb-5 gap-x-2">
              <a
                className="flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-purple-600 hover:shadow-lg cursor-pointer"
                href={`mailto:${clientData?.email}`}
              >
                <AiFillMail size={14} className="text-white mr-2" />
                Envoyer un mail
              </a>
              <a
                className="flex items-center bg-blue-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-blue-600 hover:shadow-lg cursor-pointer"
                href={`tel:${clientData?.phone}`}
              >
                <BsFillTelephoneFill size={14} className="text-white mr-2" />
                Appeler
              </a>
            </div>
            <div>
              <a
                className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
                href={`/dashboard/clients/${clientData?.id}?modify=true`}
              >
                <BsFillPencilFill size={14} className="text-white mr-2" />
                Modifier
              </a>
            </div>
          </div>
        )}
        {modify && (
          <div className="flex justify-end items-center h-16 mb-5 gap-x-2">
            <div>
              <a
                className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
                href={`/dashboard/clients/${clientData?.id}`}
              >
                <BsBackspaceFill size={14} className="text-white mr-2" />
                Annuler
              </a>
            </div>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit mb-5">
          {clientData?.profile_picture_url ? (
            <div className={`avatar -m-14 `}>
              <div
                className={`w-28 rounded-full ${
                  clientData?.active
                    ? "border-4 border-green-400"
                    : "border-4 border-amber-400"
                }`}
              >
                <img src={clientData?.profile_picture_url} />
              </div>
            </div>
          ) : (
            <div
              className={`bg-blue-600 text-white rounded-full p-2 w-28 h-28 flex items-center justify-center -m-14 ${
                clientData?.active
                  ? "border-4 border-green-400"
                  : "border-4 border-amber-400"
              }`}
            >
              <span className="text-3xl font-bold">{`${
                clientData?.first_name.split("")[0]
              }${clientData?.last_name.split("")[0]}`}</span>
            </div>
          )}
          <div className={`text-4xl text-blue-600 font-semibold mt-16 mb-1`}>
            {clientData?.username}
          </div>
          <div className={`text-sm text-gray-500 font-semibold mb-5`}>
            {`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
              Date.parse(clientData?.created_at)
            )}`}
          </div>
          <ClientForm modify={modify} clientData={clientData} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-stretch">
          <div className="flex flex-center items-center mb-5 gap-y-2">
            <div className="w-full bg-white shadow-xl mb-5 p-6 rounded-lg flex flex-col items-center h-full">
              <div className="text-3xl text-blue-600 font-semibold mb-5 w-full">
                Liste des biens
              </div>
              {propertiesData?.length == 0 ? (
                <div className="h-56 w-full flex justify-center items-center text-purple-600">
                  {`${clientData?.username} n'a toujours pas créé de propriété`}
                </div>
              ) : (
                propertiesData.map((property) => (
                  <div
                    className="flex items-center justify-between max-w-md w-full bg-blue-600 shadow-xl mb-5 p-4 rounded-lg"
                    key={property?.id}
                  >
                    <div className="h-16 w-16 bg-white text-blue-400 rounded-full flex justify-center items-center shadow">
                      <BsFillHouseDoorFill size={24} />
                    </div>
                    <div>
                      <div className=" items-center text-2xl text-white">
                        {property?.property_name}
                      </div>
                      <div className=" items-center text-sm text-white">
                        {new Intl.DateTimeFormat("fr-FR").format(
                          Date.parse(property?.created_at)
                        )}
                      </div>
                      <div className=" items-center text-sm text-white">
                        {property?.city}
                      </div>
                    </div>
                    <Link
                      className="bg-white text-blue-600 text-base font-semibold rounded-2xl p-2 shadow"
                      href={`/dashboard/properties/${property?.id}`}
                    >
                      Gérer
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex flex-center items-center mb-5 gap-y-2">
            <div className="w-full bg-white shadow-xl mb-5 p-6 rounded-lg flex flex-col items-center h-full">
              <div className="text-3xl text-purple-600 font-semibold mb-5 w-full">
                Historique des interactions
              </div>
              {interactionsData?.length == 0 ? (
                <div className="h-56 w-full flex justify-center items-center text-blue-600">
                  {`${clientData?.username} n'a pas encore interagi avec la plateforme`}
                </div>
              ) : (
                interactionsData &&
                interactionsData.map((interaction) => (
                  <ol
                    class="relative border-l border-gray-200 dark:border-gray-700"
                    key={interaction?.id}
                  >
                    <li class="mb-10 ml-6">
                      <span class="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white"></span>
                      <h3 class="flex items-center mb-1 text-lg font-semibold text-blue-950">
                        {`${interaction?.type}  ${
                          interaction?.properties
                            ? " | " + interaction?.properties?.property_name
                            : ""
                        }`}
                      </h3>
                      <time class="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                        {`Fait le : ${
                          interaction?.created_at.split("T")[0]
                        } à ${
                          interaction?.created_at.split("T")[1].split(".")[0]
                        } `}
                      </time>
                      <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                        {interaction?.text}
                      </p>
                    </li>
                  </ol>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
