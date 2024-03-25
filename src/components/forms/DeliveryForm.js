/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef } from "react";
import { updateDelivery } from "@/actions/deliveryActions";
import DatePicker, { setDefaultLocale } from "react-datepicker";
setDefaultLocale("fr");

import "@/lib/styles/datepicker.css";

const DeliveryForm = ({ modify = false, deliveryData }) => {
	const [startTime, setStartTime] = useState(
		new Date(deliveryData?.start_time)
	);
	const [endTime, setEndTime] = useState(new Date(deliveryData?.end_time));
	const startRef = useRef();
	const endRef = useRef();
	const [status, setStatus] = useState(deliveryData?.active);

	const updateTime = (time, type) => {
		if (type == "start") {
			setStartTime(time);
			console.log("time is : ", time);
			startRef.current.value = time;
			return time;
		}
		if (type == "end") {
			setEndTime(time);
			endRef.current.value = time;
			return time;
		}
	};

	return (
		<form className="w-full h-fit" action={updateDelivery}>
			<div className="w-full grid grid-cols-1 md:grid-cols-2 p-10 justify-items-center gap-x-4">
				<input
					type="text"
					name="id"
					defaultValue={deliveryData?.id}
					disabled={!modify}
					className="hidden"
				/>
				<div className="w-full flex flex-col items-start col-span-2 mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Status de l'affectation
					</label>
					<select
						className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
						name="status"
						disabled={!modify}
						defaultValue={deliveryData?.status}
						onChange={(e) => setStatus(e.target.value)}
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
						defaultValue={startTime}
					/>
					<DatePicker
						selected={startTime}
						onChange={(date) => updateTime(date, "start")}
						dateFormat="HH:mm:ss dd/MM/yyyy"
						disabled={!modify}
						showTimeSelect
						timeIntervals={30}
						className="input w-full bg-white min-w-md max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-4"
					/>
				</div>
				<div className="w-full flex flex-col items-start mb-5">
					<label className="text-sm font-semibold text-blue-600 mb-2">
						Heure de fin
					</label>
					<input
						name="end_time"
						ref={endRef}
						className="hidden"
						defaultValue={endTime}
					/>
					<DatePicker
						selected={endTime}
						onChange={(date) => updateTime(date, "end")}
						dateFormat="HH:mm:ss dd/MM/yyyy"
						className="input w-full bg-white min-w-md max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 mb-4"
						disabled={!modify}
						showTimeSelect
						timeIntervals={30}
					/>
				</div>
				{deliveryData?.status == "canceled" && (
					<div className="w-full flex flex-col items-start col-span-2 mb-5">
						<label className="text-sm font-semibold text-blue-600 mb-2">
							Motif d'annulation
						</label>
						<textarea
							className="textarea w-full   text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
							name="reason"
							disabled={!modify}
							defaultValue={deliveryData?.reason}
							onChange={(e) => setStatus(e.target.value)}
						></textarea>
					</div>
				)}
			</div>
			{modify && (
				<div className="w-full flex flex-col items-center justify-center mb-5">
					<button
						className="flex items-center bg-emerald-500 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer"
						disabled={startTime >= endTime}
					>
						Sauvegarder
					</button>
				</div>
			)}
		</form>
	);
};

export default DeliveryForm;
