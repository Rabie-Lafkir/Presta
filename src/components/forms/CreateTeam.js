/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { createTeam } from "@/actions/teamActions";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";

const CreateTeam = () => {
	const supabase = createClient();
	const [name, setName] = useState("");
	const [zone, setZone] = useState();
	const [zoneList, setZoneList] = useState([]);
	const [size, setSize] = useState(0);

	const getZones = async () => {
		const { data, error } = await supabase.from("zones").select();
		if (error) {
			console.log("Error while getting zones: ", JSON.stringify(error));
		}
		setZoneList(data?.map((el) => ({ value: el?.id, label: el?.name })));
	};

	const updateZone = async (query) => {
		setZone(query.value);

		console.log("got zone : ", query.value);
	};

	useEffect(() => {
		getZones();
		console.log("Getting zones");
	}, []);

	return (
		<form className="w-full" action={createTeam}>
			<div className="w-full flex flex-col items-start mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Nom de l'équipe
				</label>
				<input
					type="text"
					name="name"
					placeholder="Entrez le nom de l'équipe "
					className={
						"input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
					}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>

			<div className="w-full flex flex-col items-start mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Taille de l'equipe
				</label>
				<input
					type="number"
					name="size"
					placeholder="200"
					className={
						"input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
					}
					onChange={(e) => setSize(e.target.value)}
				/>
			</div>
			<div className="w-full flex flex-col items-start mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Choissisez une Zone
				</label>
				<Select
					options={zoneList}
					onChange={updateZone}
					name="zone_id"
					placeholder="Veuillez choisir une zone ..."
					unstyled={true}
					classNames={{
						control: (state) =>
							"select w-full input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400",
						option: (state) => "text-blue-600 px-5 py-2 bg-white",
						menu: (state) => "shadow",
						noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
						container: (state) => "w-full",
					}}
				/>
			</div>

			<div className="w-full flex flex-col items-center justify-center mb-5">
				<button
					className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:shadow-none"
					disabled={size == 0 || name == ""}
				>
					Créer l'équipe
				</button>
			</div>
		</form>
	);
};

export default CreateTeam;
