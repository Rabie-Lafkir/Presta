/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef, useEffect } from "react";
import { createDelivery } from "@/actions/deliveryActions";
import { createClient } from "@/lib/supabase-client";
import Select from "react-select";

import DatePicker, { setDefaultLocale } from "react-datepicker";
setDefaultLocale("fr");

import "@/lib/styles/datepicker.css";

const CreateDelivery = () => {
	const supabase = createClient();
	const [startTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [service, setService] = useState();
	const [serviceList, setServiceList] = useState([]);

	const [user, setUser] = useState();
	const [userList, setUserList] = useState([]);

	const [property, setProperty] = useState();
	const [propertyList, setPropertyList] = useState([]);

	const [order, setOrder] = useState();
	const [orderList, setOrderList] = useState([]);

	const startRef = useRef();
	const endRef = useRef();
	const serviceRef = useRef();

	const updateService = async (query) => {
		setService(query.value);

		console.log("got service : ", service);
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
	const updateOrder = async (query) => {
		setOrder(query.value);
	};

	const updateProperty = async (query) => {
		setProperty(query.value);
		console.log("Query is  : ", query);
		console.log("Property value is  : ", user);
		const filteredOrders = await supabase
			.from("orders")
			.select("*")
			.eq("user_id", user)
			.eq("property_id", query.value)
			.in("status", ["planned", "started"]);

		console.log("Found raw orders : ", filteredOrders);

		setOrderList(
			filteredOrders?.data?.map((el) => ({
				value: el?.id,
				label: el.id?.split("-")?.[0],
			}))
		);
	};

	const updateTime = (time, type) => {
		if (type == "start") {
			setStartTime(time);
			startRef.current.value = time;
			return time;
		}
		if (type == "end") {
			setEndTime(time);
			endRef.current.value = time;
			return time;
		}
	};

	useEffect(() => {
		getUsers();
		getServices();
	}, []);

	return (
		<form className="w-full" action={createDelivery}>
			<div className="w-full flex flex-col items-start col-span-2 mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Status de l'affectation
				</label>
				<select
					className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
					name="status"
					defaultValue={"planned"}
				>
					<option value={"planned"}>Planifiée</option>
					<option value={"done"}>Effectuée</option>
					<option value={"delayed"}>Reportée</option>
					<option value={"canceled"}>Annulée</option>
				</select>
			</div>
			<div className="w-full flex flex-col items-start mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Heure de début
				</label>
				<input
					name="start_time"
					ref={startRef}
					className="hidden"
					defaultValue={new Date()}
				/>
				<DatePicker
					selected={startTime}
					onChange={(date) => updateTime(date, "start")}
					dateFormat="dd/MM/yyyy"
					showTimeInput
					className="input w-full bg-white min-w-md max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-4"
				/>
			</div>
			<div className="w-full flex flex-col items-start mb-5">
				<label className="text-sm font-semibold text-blue-600 mb-2">
					Heure de fin
				</label>
				<input name="end_time" ref={endRef} className="hidden" />
				<DatePicker
					selected={endTime}
					onChange={(date) => updateTime(date, "end")}
					defaultValue={new Date()}
					dateFormat="dd/MM/yyyy"
					className="input w-full bg-white min-w-md max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-4"
					showTimeInput
				/>
			</div>

			<label className="text-sm font-semibold text-blue-600 mb-2">
				Choissisez un service
			</label>
			<Select
				onChange={updateService}
				options={serviceList}
				name="service"
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
			<label className="text-sm font-semibold text-blue-600 mb-2">
				Choissisez une commande
			</label>
			<Select
				onChange={updateOrder}
				options={orderList}
				name="order_id"
				placeholder={
					!property
						? "Veuillez choisir un bien avant ..."
						: "Veuillez choisir une commande ..."
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
			<input
				className="hidden"
				value={orderList?.filter((el) => el?.id == order)?.[0]?.team_id}
				name="team_id"
			/>
			<div className="w-full flex flex-col items-center justify-center my-5">
				<button
					className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:bg-emerald-300 disabled:shadow-none"
					disabled={startTime >= endTime || !user || !order || !property}
				>
					Créer l'affectation
				</button>
			</div>
		</form>
	);
};

export default CreateDelivery;
