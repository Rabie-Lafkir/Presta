/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef, useEffect } from "react";
import { createOrder } from "@/actions/orderActions";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";

import DatePicker, { setDefaultLocale } from "react-datepicker";
setDefaultLocale("fr");

import "@/lib/styles/datepicker.css";

const CreateOrder = () => {
	const supabase = createClient();
	const [startTime, setStartTime] = useState(new Date());
	const [service, setService] = useState();
	const [serviceList, setServiceList] = useState([]);

	const [user, setUser] = useState();
	const [userList, setUserList] = useState([]);

	const [property, setProperty] = useState();
	const [propertyList, setPropertyList] = useState([]);
	const [hasOrders, setHasOrders] = useState(false);

	const userRef = useRef();
	const serviceRef = useRef();
	const valueRef = useRef();

	const updateService = async (query) => {
		console.log("user ref ", userRef.current.value);
		setService(query.value);

		console.log("got service : ", service);
	};

	const getUsers = async () => {
		const filteredUsers = await supabase
			.from("users")
			.select("*")
			.in("role", ["client", "super_admin"]);

		setUserList(
			filteredUsers?.data
				? filteredUsers?.data.map((el) => ({
						value: el.id,
						label: el.username,
				  }))
				: []
		);

		console.log("Found following users : ", userList);
		return filteredUsers;
	};

	const updateUser = async (query) => {
		setUser(query.value);
		setProperty();

		console.log("Query is  : ", query);
		console.log("User value is  : ", user);

		const filteredProperties = await supabase
			.from("properties")
			.select("*")
			.eq("owner", query.value);

		console.log("Found raw properties : ", filteredProperties);

		setPropertyList(
			filteredProperties?.data?.map((el) => ({
				value: el?.id,
				label: el.property_name,
			}))
		);

		console.log("Found properties : ", propertyList);
		return user;
	};

	const getServices = async (query) => {
		const filteredServices = await supabase.from("services").select("*");

		console.log(`Found following services for query :`, filteredServices);
		setServiceList(
			filteredServices?.data
				? filteredServices?.data.map((el) => ({ value: el.id, label: el.name }))
				: []
		);
		return filteredServices;
	};

	const updateProperty = async (query) => {
		setHasOrders(false);
		setProperty(query.value);

		const { data, error } = await supabase
			.from("orders")
			.select("id")
			.eq("user_id", user)
			.eq("service_id", service)
			.eq("property_id", query.value);

		if (error) {
			console.log("Error while getting user orders", JSON.stringify(error));
		}

		if (data?.length > 0) {
			setHasOrders(true);
		}
		console.log("Property orders : ", data);

		console.log("Query is  : ", query);
		console.log("Property value is  : ", user);
	};

	useEffect(() => {
		getUsers();
		getServices();
	}, []);

	return (
		<form className="w-full" action={createOrder}>
			<div className="w-full flex flex-col items-start col-span-2 mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Status de la commande
				</label>
				<select
					className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
					name="status"
					defaultValue={"started"}
				>
					<option value={"planned"}>Planifiée</option>
					<option value={"started"}>En cours</option>
					<option value={"pending"}>En attente</option>
					<option value={"finished"}>Terminée</option>
					<option value={"canceled"}>Annulée</option>
				</select>
			</div>
			<div className="w-full flex flex-col items-start col-span-2 mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Fréquence de la commande
				</label>
				<select
					className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
					name="frequency"
					defaultValue={1}
				>
					<option value={1}>Une fois par semaine</option>
					<option value={2}>2 fois par semaine</option>
					<option value={3}>3 fois par semaine</option>
					<option value={4}>4 fois par semaine</option>
					<option value={5}>5 fois par semaine</option>
					<option value={6}>6 fois par semaine</option>
					<option value={0.5}>Une semaine sur deux</option>
					<option value={0.25}>1 fois par mois</option>
				</select>
			</div>
			<div className="w-full flex flex-col items-start col-span-2 mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Valeure de la commande
				</label>
				<input
					className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
					name="value"
					type="number"
					step="0.01"
					defaultValue={0}
					min={0}
				/>
			</div>
			<div className="w-full flex flex-col items-start mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Date de début
				</label>
				<input
					name="billing_date"
					className="hidden"
					defaultValue={new Date()}
				/>
				<DatePicker
					selected={startTime}
					onChange={(date) => setStartTime(date)}
					dateFormat="dd/MM/yyyy"
					className="input w-full bg-white min-w-md max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-4"
				/>
			</div>

			<label className="text-sm font-semibold text-blue-600 mb-2">
				Choissisez un service
			</label>
			<Select
				onChange={updateService}
				options={serviceList}
				name="service_id"
				ref={serviceRef}
				placeholder="Veuillez choisir un service ..."
				unstyled={true}
				classNames={{
					control: (state) =>
						"select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
					option: (state) => "text-blue-600 px-5 py-2 bg-white",
					menu: (state) => "shadow",
					noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
				}}
			/>

			<label className="text-sm font-semibold text-blue-600 mb-2">
				Choissisez un utilisateur
			</label>
			<Select
				onChange={updateUser}
				options={userList}
				ref={userRef}
				name="user_id"
				placeholder="Veuillez choisir un utilisateur ..."
				unstyled={true}
				classNames={{
					control: (state) =>
						"select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
					option: (state) => "text-blue-600 px-5 py-2 bg-white",
					menu: (state) => "shadow",
					noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
				}}
			/>
			<input name="service" ref={serviceRef} className="hidden" />
			<label className="text-sm font-semibold text-blue-600 mb-2">
				Choissisez un bien
			</label>
			<Select
				onChange={updateProperty}
				options={propertyList}
				name="property_id"
				placeholder={
					!user
						? "Veuillez choisir un utilisateur avant ..."
						: "Veuillez choisir un bien ..."
				}
				isDisabled={!user}
				unstyled={true}
				classNames={{
					control: (state) =>
						"select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-5",
					option: (state) => "text-blue-600 px-5 py-2 bg-white",
					menu: (state) => "shadow",
					noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
				}}
			/>
			{hasOrders && (
				<div className="text-sm my-2text-amber-500">
					Ce client a déjà une commande en cours sur ce bien pour ce service.
				</div>
			)}
			<div className="w-full flex flex-col items-center justify-center my-5">
				<button
					className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:shadow-none"
					disabled={
						!user ||
						!property ||
						!service ||
						hasOrders ||
						valueRef?.current?.value == 0
					}
				>
					Créer la commande
				</button>
			</div>
		</form>
	);
};

export default CreateOrder;
