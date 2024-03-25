/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from "react";
import { updateClient } from "@/actions/clientActions";

const ClientForm = ({ modify = false, clientData }) => {
  const [modifying, setModifying] = useState(modify);
  const [id, setId] = useState(clientData?.id);
  const [email, setEmail] = useState(clientData?.email);
  const [phone, setPhone] = useState(clientData?.phone);
  const [city, setCity] = useState(clientData?.city);
  const [status, setStatus] = useState(clientData?.active);

  return (
    <form className="w-full h-fit" action={updateClient}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 p-10 justify-items-center gap-x-4">
        <input
          type="text"
          name="id"
          placeholder="John@doe.com"
          defaultValue={clientData?.id}
          disabled={!modify}
          className="hidden"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="w-full flex flex-col items-start col-span-2 mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Status de l'utilisateur
          </label>
          <select
            className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
            name="active"
            disabled={!modify}
            defaultValue={clientData?.active}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactif</option>
          </select>
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Prénom
          </label>
          <input
            type="text"
            name="first_name"
            placeholder="John"
            defaultValue={clientData?.first_name}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Nom
          </label>
          <input
            type="text"
            name="last_name"
            placeholder="Doe"
            defaultValue={clientData?.last_name}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Adresse Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="John@doe.com"
            defaultValue={clientData?.email}
            className={
              "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            }
            disabled={!modify}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Numéro de téléphone
          </label>
          <input
            type="phone"
            name="phone"
            placeholder="06 XX XX XX XX"
            defaultValue={clientData?.phone}
            className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            disabled={!modify}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="w-full flex flex-col items-start mb-5">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Ville
          </label>
          <input
            type="Text"
            name="city"
            placeholder="E.g. Casablanca"
            defaultValue={clientData?.city}
            className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
            disabled={!modify}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
      </div>
      {modify && (
        <div className="w-full flex flex-col items-center justify-center mb-5">
          <button
            className="flex items-center bg-emerald-500 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer"
            disabled={
              email == "" || phone == "" || status == null || city == ""
            }
          >
            Sauvegarder
          </button>
        </div>
      )}
    </form>
  );
};

export default ClientForm;
