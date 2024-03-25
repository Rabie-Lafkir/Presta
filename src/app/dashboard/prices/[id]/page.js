import { BsFillPencilFill } from "react-icons/bs";
import { createClient } from "@/lib/supabase-server";
import ServicePrices from "@/components/ui/ServicePrices";
import ServiceCard from "@/components/ui/ServiceCards";
import Datacard from "@/components/ui/DataCard";
import { formatProper } from "@/lib/utils";
import PriceForm from "@/components/forms/PriceForm";
import PriceListCard from "@/components/ui/PriceListCard";

const getPriceData = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("prices")
    .select("*, services(*), options(*, services(*))")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Error while fetching price Data : ${JSON.stringify(error)}`
    );
  }

  console.log("got following price data :", JSON.stringify(data));
  return data;
};

export default async function PricePage({ params, searchParams }) {
  const price = await getPriceData(params?.id);
  const modify = searchParams?.modify || false;
  return (
    <div className="w-full flex items-start gap-x-4">
      <div className="w-1/4 flex flex-col items-center pt-12">
        <ServiceCard
          service={
            price?.service_id ? price?.services : price?.options?.services
          }
        />
        <Datacard
          title={"Paliers de prix configurés"}
          data={price?.price_list?.length}
        />
      </div>
      <div className="w-full flex flex-col gap-y-6">
        <div className="flex justify-end items-center h-16 mb-5 gap-x-2">
          <a
            className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
            href={`/dashboard/prices/${price.id}?modify=true`}
          >
            <BsFillPencilFill size={14} className="text-white mr-2" />
            Modifier
          </a>
        </div>
        <div
          className="h-72 rounded-lg shadow bg-cover bg-center w-full mb-5"
          style={{
            backgroundImage: `url(${
              price?.service_id
                ? price?.services?.service_img
                : price?.options?.services?.service_img
            })`,
          }}
        ></div>
        <div className="w-full rounded-lg bg-white shadow-lg flex flex-col items-center px-6 py-8 gap-y-2">
          <div className="text-3xl text-blue-600 font-semibold">
            {formatProper(price?.name)}
          </div>
          <div
            className={`badge ${
              price?.service_id ? "bg-purple-400" : "bg-emerald-400"
            } border-0 text-white`}
          >
            {price?.service_id ? "Service " : "Option"}
          </div>
          <div className="text-sm text-blue-600 font-semibold">
            {`Base de facturation : ${
              price?.is_fixed
                ? "Fixe"
                : `Variable basé sur ${
                    price?.service_id
                      ? price?.services?.criterion
                      : price?.options?.services?.criterion
                  }`
            }`}
          </div>
          <div className="text-sm text-gray-500 font-semibold">
            {`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
              Date.parse(price?.created_at)
            )}`}
          </div>
          <PriceForm
            priceData={price}
            modify={modify}
            is_service={price?.service_Id ? true : false}
          />
        </div>
        <PriceListCard
          price_list={price?.price_list}
          modify={modify}
          price_id={price?.id}
        />
      </div>
    </div>
  );
}
