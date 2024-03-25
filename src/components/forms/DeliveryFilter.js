"use client";

import { useState, useEffect, useRef } from "react";
import cities from "../../lib/helpers/moroccanCities.json";
import SearchDropdown from "../ui/SearchDropdown";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import Select from "react-select";

import DatePicker, {
	setDefaultLocale,
	getDefaultLocale,
} from "react-datepicker";
setDefaultLocale("fr");

import "@/lib/styles/datepicker.css";
import { resetDate } from "@/lib/utils";

export const DeliveryFilter = () => {
	// Setting up dynamic routing

	const statusMatch = {
		planned: "Planifiée",
		done: "Effectuée",
		delayed: "Reportée",
		canceled: "Annulée",
		started: "En-cours",
	};

	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	//Handle Dynamic Params

	const currentParams = new URLSearchParams(Array.from(searchParams.entries()));
	console.log("Search params are : ", currentParams);

	const addFilters = () => {
		currDate && currentParams.set("date", resetDate(currDate).getTime());
		userCity && currentParams.set("city", userCity);
		team && currentParams.set("team", team);
		status && currentParams.set("status", status);
		userString && currentParams.set("userString", userString);
		console.log(`rEDIRECTING TO : ${pathname}?${currentParams.toString()}`);
		router.push(`${pathname}?${currentParams.toString()}`);
	};

	//Configuring Supabase
	const supabase = createClient();
	const [currDate, setCurrDate] = useState();
	const [userString, setUserString] = useState();
	const [team, setTeam] = useState();
	const [teamList, setTeamList] = useState([]);
	const [userCity, setUserCity] = useState();
	const [clients, setClients] = useState([]);
	const [status, setStatus] = useState();
	const clientRef = useRef();
	const teamRef = useRef();

	const getUsers = async () => {
		const filteredUsers = await supabase
			.from("users")
			.select("*")
			.eq("role", "client");

		setClients(
			filteredUsers?.data
				? filteredUsers?.data.map((el) => ({
						value: el.id,
						label: el.username,
				  }))
				: []
		);

		console.log("Found following users : ", clients);
		return filteredUsers;
	};

	const getTeams = async () => {
		const filteredTeams = await supabase
			.from("teams")
			.select("*")
			.eq("active", true);

		setTeamList(
			filteredTeams?.data
				? filteredTeams?.data.map((el) => ({
						value: el.id,
						label: el.name,
				  }))
				: []
		);

		console.log("Found following filteredTeams : ", teamList);
		return filteredTeams;
	};

	const updateUserString = async (query) => {
		if (!query?.value) {
			return;
		}
		console.log("Got this from child", query);
		setUserString(query.value);
		return query;
	};

	const updateTeam = async (query) => {
		if (!query?.value) {
			return;
		}
		console.log("Got this from child", query);
		setTeam(query.value);
		return query;
	};
	const updateUserCity = (city) => {
		setUserCity(city);
	};

	const clearSelection = () => {
		setCurrDate();
		setUserCity();
		setUserString();
		setTeam();
		clientRef.current.clearValue();
		teamRef.current.clearValue();
		router.push(pathname);
	};

	useEffect(() => {
		getUsers();
		getTeams();
	}, []);

	return (
		<div className="w-full px-4 py-8 rounded-lg bg-white shadow-lg flex flex-col items-center">
			<div className="text-amber-500 text-2xl font-semibold w-full mb-5 text-left">
				Filtrez les Affectations
			</div>
			<label className="text-sm font-semibold text-blue-600 mb-2 w-full">
				Choissisez une date
			</label>
			<DatePicker
				selected={currDate}
				placeholderText="Veuillez choisir une date"
				onSelect={(date) => {
					console.log("Date changed to : ", date);
					setCurrDate(date);
				}}
				dateFormat="dd/MM/yyyy"
				className="input w-full bg-white min-w-md max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-4"
			/>
			<div className="w-full flex flex-col items-start col-span-2">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Filtrer par équipe
				</label>
				<Select
					onChange={updateTeam}
					valueK
					options={teamList}
					ref={teamRef}
					name="client_id"
					placeholder="Veuillez choisir une équipe ..."
					unstyled={true}
					classNames={{
						control: (state) =>
							"select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
						option: (state) => "text-blue-600 px-5 py-2 bg-white",
						menu: (state) => "shadow",
						noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
						container: (state) => "w-full",
					}}
				/>
			</div>
			<div className="w-full flex flex-col items-start col-span-2">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Filtrer par client
				</label>
				<Select
					onChange={updateUserString}
					options={clients}
					ref={clientRef}
					name="client_id"
					placeholder="Veuillez choisir un client ..."
					unstyled={true}
					classNames={{
						control: (state) =>
							"select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
						option: (state) => "text-blue-600 px-5 py-2 bg-white",
						menu: (state) => "shadow",
						noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
						container: (state) => "w-full",
					}}
				/>
			</div>
			<SearchDropdown
				values={cities.map((city) => city.ville)}
				label={"Filtrer par ville"}
				placeholder={"Veuillez choisir une ville ..."}
				defaultValues={["Casablanca", "Rabat", "Marrakech"]}
				defaultInputValue={currentParams.get("city")}
				inputFn={updateUserCity}
			/>
			<label className="text-sm font-semibold text-blue-600 mb-2 w-full">
				Choissisez un statut
			</label>
			<select
				className="select w-full max-w-md  placeholder-gray-500 text-blue-600 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400 mb-5"
				onChange={(e) => setStatus(e?.target?.value)}
			>
				<option value={""}>Veuillez choisir une status</option>
				{Object.keys(statusMatch).map((key) => (
					<option key={key} value={key}>
						{statusMatch[key]}
					</option>
				))}
			</select>

			<div className="w-full flex items-center justify-between gap-x-2">
				<button
					className="bg-emerald-400 rounded px-4 py-2 font-semibold text-white shadow hover:shadow-lg hover:bg-emerald-600"
					onClick={addFilters}
				>
					Appliquer
				</button>
				<button
					className="bg-amber-400 rounded px-4 py-2 font-semibold text-white shadow hover:shadow-lg hover:bg-amber-600 flex items-center"
					onClick={clearSelection}
				>
					Réinitialiser
				</button>
			</div>
		</div>
	);
};
