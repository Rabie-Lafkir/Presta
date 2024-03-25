import { BsFillTelephoneFill, BsFillPencilFill } from "react-icons/bs";
import { AiFillMail } from "react-icons/ai";

export default function ClientCard({ client }) {
  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col items-center w-full h-fit mb-5">
      {client?.profile_picture_url ? (
        <div className={`avatar -m-12`}>
          <div
            className={`w-24 rounded-full ${
              client?.active
                ? "border-4 border-green-400"
                : "border-4 border-amber-400"
            }`}
          >
            <img src={client?.profile_picture_url} />
          </div>
        </div>
      ) : (
        <div
          className={`bg-blue-600 text-white rounded-full p-2 w-24 h-24 flex items-center justify-center -m-12 ${
            client?.active
              ? "border-4 border-green-400"
              : "border-4 border-amber-400"
          }`}
        >
          <span className="text-3xl font-bold">{`${
            client?.first_name.split("")[0]
          }${client?.last_name.split("")[0]}`}</span>
        </div>
      )}

      <div className={`text-2xl text-blue-600 font-semibold mt-16 mb-1`}>
        {client?.username}
      </div>
      <div className={`text-sm text-gray-500 font-semibold mb-5`}>
        {`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
          Date.parse(client?.created_at)
        )}`}
      </div>
      <div className="w-full flex flex-col items-center mb-5 gap-y-2">
        <a
          className="w-7/12 flex items-center bg-blue-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-blue-600 hover:shadow-lg cursor-pointer"
          href={`tel:${client?.phone}`}
        >
          <BsFillTelephoneFill size={14} className="text-white mr-2" />
          Appeler
        </a>
        <a
          className="w-7/12 flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-purple-600 hover:shadow-lg cursor-pointer"
          href={`mailto:${client?.email}`}
        >
          <AiFillMail size={14} className="text-white mr-2" />
          Email
        </a>
        <a
          className="w-7/12 flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
          href={`/dashboard/clients/${client?.id}`}
        >
          <BsFillPencilFill size={14} className="text-white mr-2" />
          Gérer
        </a>
      </div>
    </div>
  );
}
