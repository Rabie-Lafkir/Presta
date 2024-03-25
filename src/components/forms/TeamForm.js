/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect } from "react";
import { updateTeamForm } from "@/actions/teamActions";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";

const TeamForm = ({ modify = false, teamData }) => {
	const supabase = createClient();
	const [status, setStatus] = useState(teamData?.active);
	const [zone, setZone] = useState();
	const [defaultZone, setDefaultZone] = useState();
	const [zoneList, setZoneList] = useState([]);

	const getZones = async () => {
		const { data, error } = await supabase.from("zones").select();
		if (error) {
			console.log("Error while getting zones: ", JSON.stringify(error));
		}
		setZoneList(data?.map((el) => ({ value: el?.id, label: el?.name })));

		console.log("Zone id : ", teamData?.zone_id);

		console.log(
			"Default zone : ",
			data
				?.map((el) => ({ value: el?.id, label: el?.name }))
				?.filter((el) => el?.value == teamData?.zone_id)?.[0]
		);
		setDefaultZone(
			data
				?.map((el) => ({ value: el?.id, label: el?.name }))
				?.filter((el) => el?.value == teamData?.zone_id) || true
		);
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
		<form className="w-full h-fit" action={updateTeamForm}>
			<div className="w-full grid grid-cols-1 p-10 justify-items-center gap-x-4">
				<input
					type="number"
					name="team_id"
					defaultValue={teamData?.id}
					disabled={!modify}
					className="hidden"
				/>
				<div className="w-full flex flex-col items-start col-span-2 mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Status de l'équipe
					</label>
					<select
						className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
						name="active"
						disabled={!modify}
						defaultValue={teamData?.active}
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value={true}>Active</option>
						<option value={false}>Inactif</option>
					</select>
				</div>

				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Nom de l'équipe
					</label>
					<input
						type="text"
						name="name"
						placeholder="Nom de l'équipe"
						defaultValue={teamData?.name}
						className={
							"input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
						}
						disabled={!modify}
					/>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Taille de l'équipe
					</label>
					<input
						type="number"
						name="size"
						placeholder="Taille de l'équipe"
						defaultValue={teamData?.size}
						className={
							"input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
						}
						disabled={!modify}
					/>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Choissisez une Zone
					</label>
					{defaultZone && (
						<Select
							options={zoneList}
							onChange={updateZone}
							isDisabled={!modify}
							name="zone_id"
							defaultValue={defaultZone}
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
					)}
				</div>
			</div>
			{modify && (
				<div className="w-full flex flex-col items-center justify-center mb-5">
					<button
						className="flex items-center bg-emerald-500 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer"
						type="submit"
					>
						Sauvegarder
					</button>
				</div>
			)}
		</form>
	);
};

export default TeamForm;
