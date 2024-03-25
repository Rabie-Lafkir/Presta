import { createClient } from "@/lib/supabase-server";
import Datacard from "@/components/ui/DataCard";
import {
  BsFillTelephoneFill,
  BsFillPencilFill,
  BsBackspaceFill,
  BsFillHouseDoorFill,
} from "react-icons/bs";
import { FaMoneyBill, FaMap, FaList } from "react-icons/fa";
import ServiceForm from "@/components/forms/ServiceForm";
import ServiceOptions from "@/components/ui/ServiceOptions";
import ServicePrices from "@/components/ui/ServicePrices";
import Link from "next/link";

const getServiceData = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*, options(*), prices(*), orders(count), zones(*), asset_types(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Error while fetching service Data : ${JSON.stringify(error)}`
    );
  }

  console.log("got following service data :", data);
  return data;
};

export default async function ServicePage({ params, searchParams }) {
  const serviceData = await getServiceData(params?.id);
  const zones = serviceData?.zones?.map((el) => el.id);
  const modify = searchParams?.modify || false;
  return (
    <div className="w-full flex items-start gap-x-4">
      <div className="w-1/4 flex flex-col items-center">
        <Datacard
          title={"Nombre de commandes"}
          data={serviceData?.orders[0]?.count}
          url={`/dashboard/transactions?service_id=${serviceData?.id}`}
          cta={"Voir"}
          showCta={true}
        />
        <Datacard
          title={"Nombre de zones"}
          data={serviceData?.zones.length}
          url={"/dashboard/zones"}
          cta={"Gérer"}
          showCta={true}
        />
        <Datacard
          title={"Nombre d'options"}
          data={serviceData?.options?.length}
        />
        <Datacard
          title={"Tarifs configurés"}
          data={serviceData?.prices?.length}
        />
      </div>
      <div className="w-full flex flex-col gap-y-6">
        <div className={`flex justify-between`}>
          <div className="flex justify-end items-center h-16 mb-5 gap-x-2">
            <Link
              className="flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-purple-600 hover:shadow-lg cursor-pointer"
              href={`/dashboard/transactions?service_id=${serviceData?.id}`}
            >
              <FaMoneyBill size={14} className="text-white mr-2" />
              Commandes
            </Link>
            <Link
              className="flex items-center bg-blue-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-blue-600 hover:shadow-lg cursor-pointer"
              href={`/dashboard/zones/?service=${serviceData?.id}`}
            >
              <FaMap size={14} className="text-white mr-2" />
              Zones
            </Link>
            <Link
              className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
              href={`/dashboard/checklists/?service=${serviceData?.id}`}
            >
              <FaList size={14} className="text-white mr-2" />
              Checklists
            </Link>
          </div>
          <div>
            <Link
              className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
              href={`/dashboard/services/${params?.id}?modify=true`}
            >
              <BsFillPencilFill size={14} className="text-white mr-2" />
              Modifier
            </Link>
          </div>
        </div>
        <div
          className="h-72 rounded-lg shadow bg-cover bg-center w-full mb-5"
          style={{ backgroundImage: `url(${serviceData?.service_img})` }}
        ></div>
        <div className="w-full rounded-lg bg-white shadow-lg flex flex-col items-center p-6 gap-y-2">
          <span
            className={`badge ${
              serviceData.is_subscription ? "bg-blue-200" : "bg-purple-400"
            } border-0 text-white`}
          >
            {serviceData.is_subscription ? "Abonnement " : "Ponctuel"}
          </span>
          <div className="text-3xl text-blue-600 font-semibold">
            {serviceData?.name}
          </div>
          <div className="text-sm text-gray-500 font-semibold">
            {`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
              Date.parse(serviceData?.created_at)
            )}`}
          </div>
          <ServiceForm modify={modify} serviceData={serviceData} />
        </div>
        <ServiceOptions
          serviceId={serviceData?.id}
          options={serviceData?.options}
        />
        <ServicePrices
          serviceId={serviceData?.id}
          prices={serviceData?.prices}
        />
      </div>
    </div>
  );
}
