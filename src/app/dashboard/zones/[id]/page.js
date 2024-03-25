// Imports
import MapCard from "@/components/ui/MapCard";
import { BsFillPencilFill } from "react-icons/bs";
import { BsFillBuildingFill } from "react-icons/bs";
import { MdCleaningServices } from "react-icons/md";
import { createClient } from "@/lib/supabase-server";
import Datacard from "@/components/ui/DataCard";
import { formatProper } from "@/lib/utils";
import ZoneForm from "@/components/forms/ZoneForm";

const zoneColors = {
  normal: "purple",
  macro: "emerald",
  micro: "blue",
  nano: "amber",
  pico: "fushia",
};
//Global Functions

const getzoneData = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("zones")
    .select("*, services(count), properties(count)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Error while fetching zone Data : ${JSON.stringify(error)}`
    );
  }
  console.log("Got zone data :", JSON.stringify(data));
  return data;
};

export default async function zonePage({ params, searchParams }) {
  const modify = searchParams?.modify || false;
  const zoneData = await getzoneData(params?.id);
  return (
    <div className="w-full flex items-start gap-x-4">
      <div className="w-1/4 flex flex-col items-center pt-12">
        <Datacard
          title={"Nombre de biens"}
          data={zoneData?.properties?.[0]?.count}
          cta={"Gérer"}
          url={`/dashboard/properties?zone=${zoneData?.id}`}
          showCta={true}
        />
        <Datacard
          title={"Nombre de services"}
          data={zoneData?.services?.[0]?.count}
          cta={"Gérer"}
          url={`/dashboard/services?zone=${zoneData?.name}`}
          showCta={true}
        />
      </div>

      <div className="w-full">
        <div className={`flex justify-between`}>
          <div className="flex justify-end items-center h-16 mb-5 gap-x-2">
            <a
              className="flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-purple-600 hover:shadow-lg cursor-pointer"
              href={`/dashboard/properties?zone=${zoneData.name}`}
            >
              <BsFillBuildingFill size={14} className="text-white mr-2" />
              Bien
            </a>
            <a
              className="flex items-center bg-blue-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-blue-600 hover:shadow-lg cursor-pointer"
              href={`/dashboard/services?zone=${zoneData.name}`}
            >
              <MdCleaningServices size={14} className="text-white mr-2" />
              Services
            </a>
          </div>
          <div>
            <a
              className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
              href={`/dashboard/zones/${params?.id}?modify=true`}
            >
              <BsFillPencilFill size={14} className="text-white mr-2" />
              Modifier
            </a>
          </div>
        </div>
        <MapCard
          styles="min-w-full"
          zoom={15}
          center={
            zoneData?.points.map((el) => ({
              lat: parseFloat(el.lat),
              lng: parseFloat(el.long),
            }))[0]
          }
          markers={zoneData?.points.map((el) => ({
            position: {
              lat: parseFloat(el.lat),
              lng: parseFloat(el.long),
            },
          }))}
          modify={modify}
          draggable={modify}
        />
        <div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit my-5 py-8 gap-y-2">
          <div className={`text-4xl text-blue-600 font-semibold mb-1`}>
            {zoneData?.name}
          </div>
          <div
            className={`badge px-2 py-2 bg-${
              zoneColors[zoneData?.type]
            }-400 text-white text-xs w-xs border-0`}
          >
            {formatProper(zoneData?.type)}
          </div>
          <div className={`text-sm text-gray-500 font-semibold`}>
            {`Mise à jour le ${new Intl.DateTimeFormat("fr-FR").format(
              Date.parse(zoneData?.updated_at)
            )}`}
          </div>
          <div className={`text-sm text-purple-600 font-semibold mb-5`}>
            {zoneData?.city}
          </div>
          <ZoneForm zoneData={zoneData} modify={modify} />
        </div>
      </div>
    </div>
  );
}
