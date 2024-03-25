/* eslint-disable react/no-unescaped-entities */
import { createClient } from "@/lib/supabase-server";
import { ServiceFilter } from "@/components/forms/ServicesFilter";
import Drawer from "@/components/ui/Drawer";
import CreateService from "@/components/forms/CreateService";
import Link from "next/link";
const getServices = async (params) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*, zones!inner(*)")
    .filter(
      "is_subscription",
      `${params?.type ? "eq" : "gte"}`,
      params?.type || (true, false)
    )
    .filter(
      "active",
      `${params?.status ? "eq" : "gte"}`,
      params?.status || (true, false)
    )
    .filter("zones.city", `${params?.city ? "eq" : "gte"}`, params?.city || "")
    .filter(
      "zones.region",
      `${params?.region ? "eq" : "gte"}`,
      params?.region || ""
    )
    .filter(
      "zones.name",
      `${params?.region ? "contains" : "gte"}`,
      params?.zone || ""
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `There was an error while fetching services : ${JSON.stringify(error)}`
    );
  }

  console.log("got following services :", data);
  return data;
};

export default async function Services({ searchParams }) {
  const services = await getServices(searchParams);
  const truncateText = (content, length) => {
    if (content.length <= length) {
      return content;
    } else {
      return content.substring(0, length) + "...";
    }
  };

  return (
    <div className="w-full flex flex-col  gap-x-4">
      {searchParams?.create && (
        <Drawer title={"Créer un service"}>
          <CreateService />
        </Drawer>
      )}
      <div className="w-full mb-5 flex lg:flex-row flex-col justify-between">
      <h2 class="text-4xl font-extrabold text-blue-800">Services</h2>
        <a
          className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
          href="/dashboard/services?create=true"
        >
          Créer un service
        </a>
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-4">
        <div className="lg:w-1/4 w-full flex flex-col items-center">
          <ServiceFilter />
        </div>
        <div className="w-full">
          {services.length == 0 ? (
            <div className="w-full h-36 flex items-center justify-center text-purple-600 font-semibold bg-white rounded-lg shadow-lg">
              Presta Freedom n'a pas encore créé de services
            </div>
          ) : (
            <div className="w-full bg-white rounded-lg shadow-lg h-fit p-4 grid grid-cols-1 md:grid-cols-3 md:gap--2 lg:gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="max-w-sm bg-white border border-gray-200 rounded-lg shadow"
                >
                  <div
                    className="h-32 rounded-t-lg w-full"
                    style={{
                      backgroundImage: `url(${service.service_img})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="p-5">
                    <div
                      className={`mb-2 w-fit text-xs font-medium me-2 px-2.5 py-0.5 rounded ${
                        service.is_subscription
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      } border-0 `}
                    >
                      {service.is_subscription ? "Abonnement " : "Ponctuel"}
                    </div>

                    <h5 className="h-14 mb-2 text-2xl font-bold tracking-tight text-gray-900">
                      {service.name}
                    </h5>

                    <p className="mb-3 font-normal text-gray-700 h-14">
                      {truncateText(service?.description, 40)}
                    </p>
                    <Link
                      href={`/dashboard/services/${service.id}`}
                      class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                      Modifier
                      <svg
                        className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
