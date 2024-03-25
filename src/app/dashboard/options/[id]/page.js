import { BsFillPencilFill } from "react-icons/bs";
import { createClient } from "@/lib/supabase-server";
import OptionForm from "@/components/forms/OptionForm";
import ServicePrices from "@/components/ui/ServicePrices";
import ServiceCard from "@/components/ui/ServiceCards";
import Datacard from "@/components/ui/DataCard";

const getOptionData = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("options")
    .select("*, services(*), prices(*)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Error while fetching option Data : ${JSON.stringify(error)}`
    );
  }

  console.log("got following option data :", JSON.stringify(data));
  return data;
};

export default async function OptionPage({ params, searchParams }) {
  const option = await getOptionData(params?.id);
  const modify = searchParams?.modify || false;
  return (
    <div className="w-full flex items-start gap-x-4">
      <div className="w-1/4 flex flex-col items-center pt-12">
        <ServiceCard service={option?.services} />
        <Datacard title={"Tarifs configurés"} data={option?.prices?.length} />
      </div>
      <div className="w-full flex flex-col gap-y-6">
        <div className="flex justify-end items-center h-16 mb-5 gap-x-2">
          <a
            className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
            href={`/dashboard/options/${option.id}?modify=true`}
          >
            <BsFillPencilFill size={14} className="text-white mr-2" />
            Modifier
          </a>
        </div>
        <div
          className="h-72 rounded-lg shadow bg-cover bg-center w-full mb-5"
          style={{ backgroundImage: `url(${option?.services?.service_img})` }}
        ></div>
        <div className="w-full rounded-lg bg-white shadow-lg flex flex-col items-center px-6 py-8 gap-y-2">
          <div className="text-3xl text-blue-600 font-semibold">
            {option?.name}
          </div>
          <div className="text-sm text-gray-500 font-semibold">
            {`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
              Date.parse(option?.created_at)
            )}`}
          </div>
          <OptionForm optionData={option} modify={modify} />
        </div>
        <ServicePrices optionId={option.id} prices={option.prices} />
      </div>
    </div>
  );
}
