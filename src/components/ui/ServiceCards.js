import { BsFillTelephoneFill, BsFillPencilFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";

export default function ServiceCard({ service }) {
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col items-center w-full h-fit mb-5">
      {service?.service_img ? (
        <div className={`avatar -m-12`}>
          <div
            className={`w-24 rounded-full ${
              service?.active
                ? "border-4 border-green-400"
                : "border-4 border-amber-400"
            }`}
          >
            <img src={service?.service_img} />
          </div>
        </div>
      ) : (
        <div
          className={`bg-blue-600 text-white rounded-full p-2 w-24 h-24 flex items-center justify-center -m-12 ${
            service?.active
              ? "border-4 border-green-400"
              : "border-4 border-amber-400"
          }`}
        >
          <span className="text-3xl font-bold">{`${service?.name.split("")[0]}${
            service?.name("")[1]
          }`}</span>
        </div>
      )}

      <div
        className={`text-2xl text-blue-600 font-semibold mt-16 mb-1 text-center`}
      >
        {service?.name}
      </div>
      <span
        className={`badge ${
          service?.is_subscription ? "bg-blue-200" : "bg-purple-400"
        } border-0 text-white mb-2`}
      >
        {service?.is_subscription ? "Abonnement " : "Ponctuel"}
      </span>
      <div className={`text-sm text-gray-500 font-semibold mb-5`}>
        {`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
          Date.parse(service?.created_at)
        )}`}
      </div>
      <div className="w-full flex flex-col items-center mb-5 gap-y-2">
        <a
          className="w-7/12 flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
          href={`/dashboard/services/${service?.id}`}
        >
          <BsFillPencilFill size={14} className="text-white mr-2" />
          Gérer
        </a>
      </div>
    </div>
  );
}
