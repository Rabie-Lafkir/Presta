/* eslint-disable react/no-unescaped-entities */
import Datacard from "@/components/ui/DataCard";
import { createClient } from "@/lib/supabase-server";
import { BsCircleFill } from "react-icons/bs";

import Link from "next/link";
import { formatProper } from "@/lib/utils";
import Drawer from "@/components/ui/Drawer";
import { SearchTxs } from "@/components/search/SearchTxs";
import CreateOrder from "@/components/forms/CreateOrder";

const statusStyle = {
	planned: { color: "blue-600", text: "Planifiée" },
	started: { color: "emerald-500", text: "En cours" },
	finished: { color: "blue-950", text: "Terminée" },
	canceled: { color: "red-300", text: "Annulée" },
	pending: { color: "amber-500", text: "En attente" },
};

const getOrderData = async (params) => {
	const supabase = createClient();

	// console.log("Got params : ", params?.service_id);

	let query = supabase
		.from("orders")
		.select(
			"*, services!inner(*), properties!inner(*), users!inner(*), transactions(count)"
		);

	if (params?.service_id) {
		query = query.eq("services.id", parseInt(params?.service_id));
	}
	if (params?.property_id) {
		query = query.eq("property_id", parseInt(params?.property_id));
	}
	if (params?.keyword) {
		query = query.ilike("users.username", `%${params?.keyword}%`);
	}

	query = query.order("created_at", { ascending: false });

	const { data, error } = await query;

	if (error) {
		throw new Error(
			`Error while fetching order Data : ${JSON.stringify(error)}`
		);
	}

	// console.log("got following order data :", JSON.stringify(data));
	return data;
};
export default async function Transactions({ params, searchParams }) {
	const orders = await getOrderData(searchParams);
	const keyword = searchParams?.keyword;
	const create = searchParams?.create;
	return (
		<div className="w-full">
			{create && (
				<Drawer title="Créer une nouvelle commande">
					<CreateOrder />
				</Drawer>
			)}
			<div className="w-full flex items-start gap-x-4">
				<div className="w-1/4 flex flex-col items-center">
					<Datacard
						title={"Nombre de commandes"}
						data={orders?.length}
						showCta={false}
					/>
					<Datacard
						title={"Commandes en cours"}
						data={orders?.filter((order) => order?.status == "started").length}
						showCta={false}
					/>
					<Datacard
						title={"Nombre de transactions"}
						data={orders
							?.map((order) => order?.transactions?.[0]?.count)
							.reduce((a, b) => a + b, 0)}
						showCta={false}
					/>
				</div>
				<div className="w-full flex flex-col gap-6">
					<div
						className={`w-full flex items-center ${
							searchParams?.property_id || searchParams?.service_id
								? "justify-between"
								: "justify-end"
						} mb-5 `}
					>
						{(searchParams?.property_id || searchParams?.service_id) && (
							<Link
								className="text-white font-semibold py-2 px-4 rounded bg-amber-400 shadow hover:bg-amber-600 hover:shadow-lg"
								href={"/dashboard/transactions"}
							>
								Réinitialiser
							</Link>
						)}

						<SearchTxs defaultValue={searchParams?.keyword} />
						<a
							className="px-6 py-4 ml-4 bg-purple-600 rounded shadow-lg  text-white font-semibold"
							href={"/dashboard/transactions/?create=true"}
						>
							Nouvelle commande
						</a>
					</div>
					<div className="p-4 bg-white h-fit rounded-lg shadow-lg w-full">
						<div className="overflow-x-auto divide-gray-50">
							{orders.length > 0 ? (
								<table className="table">
									<thead>
										<tr className="border-t-0">
											<th></th>
											<th className="text-blue-600 font-semibold">Id</th>
											<th className="text-blue-600 font-semibold">Client</th>
											<th className="text-blue-600 font-semibold">Bien</th>
											<th className="text-blue-600 font-semibold">Service</th>
											<th className="text-blue-600 font-semibold">Statut </th>
											<th className="text-blue-600 font-semibold">Valeur</th>
											<th className="text-blue-600 font-semibold">Créée le </th>
											<th className="text-blue-600 font-semibold">Actions</th>
										</tr>
									</thead>
									<tbody>
										{orders.map((order) => (
											<tr
												className="border-t-2 border-b-0 border-t-blue-200"
												key={order?.id}
											>
												<th
													className={`w-12 text-${
														statusStyle?.[order?.status]?.color
													}`}
												>
													<BsCircleFill />
												</th>
												<td className="text-blue-950 font-semibold">
													{order?.id?.split("-")?.[0]}
												</td>
												<td className="text-blue-950 font-semibold">
													{formatProper(order?.users?.username)}
												</td>
												<td className="text-blue-950 font-semibold">
													{formatProper(order?.properties?.property_name)}
												</td>
												<td className="text-blue-950 font-semibold">
													{formatProper(order?.services?.name)}
												</td>
												<td
													className={`text-${
														statusStyle?.[order?.status]?.color
													} font-semibold`}
												>
													{statusStyle?.[order?.status]?.text}
												</td>
												<td className="text-blue-950 font-semibold text-center">
													{`${order?.value} Dhs`}
												</td>
												<td className="text-blue-950 font-semibold">
													{
														new Date(order?.created_at)
															.toLocaleDateString("fr-FR")
															.split("T")[0]
													}
												</td>
												<td className="flex items-center gap-x-2">
													<Link
														className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
														href={`/dashboard/transactions/${order?.id}`}
														disabled={order?.transactions?.[0]?.count == 0}
													>
														Modifier
													</Link>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							) : (
								<div className="w-full flex items-center justify-center text-purple-600 h-56">
									<div>
										Aucune commande ne correspond aux filtres sélectionnés
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
