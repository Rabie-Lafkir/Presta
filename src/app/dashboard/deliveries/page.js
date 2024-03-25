import { DeliveryFilter } from "@/components/forms/DeliveryFilter";
import { createClient } from "@/lib/supabase-server";
import CalendarView from "@/components/ui/CalendarView";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);
import CreateDelivery from "@/components/forms/CreateDelivery";
import Drawer from "@/components/ui/Drawer";
import { BsCircleFill } from "react-icons/bs";
import { formatProper } from "@/lib/utils";
import Link from "next/link";

const statusMatch = {
	planned: "Planifiée",
	done: "Effectuée",
	delayed: "Reportée",
	canceled: "Annulée",
	started: "En cours",
};

const getCalColor = (status, startTime) => {
	if (status == "started") {
		return "#fbbf24";
	}
	if (status == "done") {
		return "#059669";
	}
	if (status == "canceled") {
		return "#4b5563";
	}
	if (dayjs(startTime)?.diff(dayjs(new Date()), "minute") >= 15) {
		return "#d97706";
	}
	if (dayjs(new Date())?.diff(dayjs(startTime), "minute") >= 1) {
		return "#dc2626";
	}
};

const getDeliveries = async (params) => {
	const supabase = createClient();

	console.log(
		"Time stamp is : ",
		dayjs(new Date()).startOf("day").toISOString()
	);

	let query = supabase
		.from("deliveries")
		.select(
			"* , properties!inner(* , users!inner(*)), orders!inner(*, services(*))"
		);

	if (params?.date) {
		console.log(
			"Start :",
			dayjs
				.tz(parseInt(params?.date), "Africa/Casablanca")
				.startOf("day")
				.toISOString(),
			dayjs(parseInt(params?.date)).startOf("day").toISOString()
		);
		console.log(
			"Applying :",
			dayjs
				.tz(parseInt(params?.date), "Africa/Casablanca")
				.endOf("day")
				.toISOString()
		);
		query = query.gte(
			"start_time",
			dayjs
				.tz(parseInt(params?.date), "Africa/Casablanca")
				.startOf("day")
				.toISOString()
		);
		query = query.lte(
			"end_time",
			dayjs
				.tz(parseInt(params?.date), "Africa/Casablanca")
				.endOf("day")
				.toISOString()
		);
	} else if (params?.calendar || params?.order_id || params?.userString) {
		query = query = query.gte(
			"start_time",
			dayjs(new Date()).subtract(30, "day").toISOString()
		);
		query = query.lte(
			"end_time",
			dayjs(new Date()).add(30, "day").toISOString()
		);
	} else {
		query = query.gte(
			"start_time",
			dayjs(new Date()).startOf("day").toISOString()
		);
		query = query.lte(
			"end_time",
			dayjs(new Date()).add(3, "hour").toISOString()
		);
	}
	if (params?.city) {
		query.eq("properties.city", params?.city);
	}
	if (params?.userString) {
		query.eq("properties.users.id", params?.userString);
	}
	if (params?.order_id) {
		query.eq("orders.id", params?.order_id);
	}
	if (params?.status) {
		query.eq("status", params?.status);
	}

	if (params?.order_id) {
		console.log("Filtering by order : ", params?.order_id);
		query = query.eq("orders.id", params?.order_id);
	}

	query = query.order("start_time", { ascending: true });
	const { data, error } = await query;

	// console.log("Got following deliveries : ", JSON.stringify(data));

	if (error) {
		throw new Error(
			`There was an error while fetching deliveries ${JSON.stringify(error)}`
		);
	}

	let parsedData = data.map((el) => ({
		id: el.id,
		start: new Date(el.start_time),
		end: new Date(el.end_time),
		title: `${statusMatch[el.status]} - ${el?.properties?.users?.username}  - ${
			el?.properties?.property_name
		}  - ${el?.properties?.city}`,
		backgroundColor: getCalColor(el?.status, el?.start_time),
		borderColor: getCalColor(el?.status, el?.start_time),
		url: `/dashboard/deliveries/${el.id}`,
	}));

	if (params?.calendar) {
		return parsedData;
	}
	return data;
};

export default async function Deliveries({ searchParams }) {
	const deliveries = await getDeliveries(searchParams);

	const colorCode = (status, startTime) => {
		if (status == "done") {
			return "text-green-300";
		}
		if (status == "started") {
			return "text-amber-600";
		}
		if (status == "canceled") {
			return "text-gray-300";
		}
		if (dayjs(new Date()).diff(dayjs(startTime), "hour") > 3) {
			return "text-red-300";
		}
		if (dayjs(new Date()).diff(dayjs(startTime), "minute") > 1) {
			return "text-red-300 animate-pulse";
		}
		if (dayjs(startTime).diff(dayjs(new Date()), "minute") <= 15) {
			return "text-amber-300 animate-pulse";
		}
		return "text-blue-300";
	};
	return (
		<div className="w-full">
			{searchParams?.create && (
				<Drawer title={"Créer une affecation"}>
					<CreateDelivery />
				</Drawer>
			)}
			<div className="w-full flex items-start gap-x-4">
				<div className="w-1/4 flex flex-col items-center">
					<DeliveryFilter />
				</div>
				<div className="w-full">
					<div className="w-full flex items-center justify-between">
						{searchParams?.order_id && (
							<div className="text-sm text-amber-600 w-full font-semibold">
								{`Commande : ${searchParams?.order_id?.split("-")?.[0]}`}
							</div>
						)}
						<div className="w-full mb-5 flex justify-end gap-x-4">
							{searchParams?.calendar ? (
								<Link
									className="px-6 py-4 bg-amber-600 rounded shadow-lg  text-white font-semibold"
									href="/dashboard/deliveries"
								>
									Table
								</Link>
							) : (
								<Link
									className="px-6 py-4 bg-amber-600 rounded shadow-lg  text-white font-semibold"
									href="/dashboard/deliveries/?calendar=true"
								>
									Calendrier
								</Link>
							)}

							<Link
								className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
								href="/dashboard/transactions"
							>
								Voir les commandes
							</Link>
							<a
								className="px-6 py-4 bg-purple-600 rounded shadow-lg  text-white font-semibold"
								href={"/dashboard/deliveries/?create=true"}
							>
								Nouvelle affectation
							</a>
						</div>
					</div>

					{searchParams?.calendar ? (
						<CalendarView events={deliveries} />
					) : (
						<div className="w-full py-4 rounded bg-white shadow">
							{deliveries?.length == 0 && (
								<div className="my-4 py-8 flex items-center justify-center text-purple-600 bg-white rounded">
									Aucune affectation ne correspond aux filtres sélectionnés
								</div>
							)}
							{deliveries?.length > 0 && (
								<table className="table">
									<thead>
										<tr className="border-t-0">
											<th></th>
											<th></th>
											<th className="text-blue-600 font-semibold">
												Nom du bien
											</th>
											<th className="text-blue-600 font-semibold">
												Nom du client
											</th>
											<th className="text-blue-600 font-semibold">
												Planifiée pour
											</th>
											<th className="text-blue-600 font-semibold">Statut</th>
											<th className="text-blue-600 font-semibold">Ville</th>
											<th className="text-blue-600 font-semibold">Actions</th>
										</tr>
									</thead>
									<tbody>
										{deliveries.map((delivery) => (
											<tr
												className="border-t-2 border-b-0 border-t-blue-200"
												key={delivery?.id}
											>
												<th
													className={`w-12 ${colorCode(
														delivery?.status,
														delivery?.start_time
													)}`}
												>
													<BsCircleFill />
												</th>

												<td className="text-blue-950 font-semibold">
													{delivery?.id}
												</td>
												<td className="text-blue-950 font-semibold">
													{delivery?.properties?.property_name &&
														formatProper(delivery?.properties?.property_name)}
												</td>
												<td className="text-blue-950 font-semibold">
													{delivery?.properties?.users?.username &&
														formatProper(delivery?.properties?.users?.username)}
												</td>
												<td className="text-blue-950 font-semibold">
													{dayjs(delivery?.start_time)
														.tz("Africa/Casablanca")
														.format("DD/MM/YYYY HH:mm")}
												</td>
												<td className="text-blue-950 font-semibold overflow-ellipsis overflow-hidden">
													{delivery?.status && statusMatch[delivery?.status]}
												</td>
												<td className="text-blue-950 font-semibold">
													{delivery?.properties?.city}
												</td>
												<td className="flex items-center gap-x-2">
													<Link
														className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
														href={`/dashboard/deliveries/${delivery?.id}`}
													>
														Modifier
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
