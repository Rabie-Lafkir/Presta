/* eslint-disable react/no-unescaped-entities */
import Datacard from "@/components/ui/DataCard";
import { createClient } from "@/lib/supabase-server";
import {
	BsCircleFill,
	BsShop,
	BsFillBuildingFill,
	BsPeopleFill,
} from "react-icons/bs";

import Link from "next/link";
import { formatProper } from "@/lib/utils";
import { ZoneFilter } from "@/components/forms/ZonesFilter";

const zoneColors = {
	normal: "purple",
	macro: "emerald",
	micro: "blue",
	nano: "amber",
	pico: "fushia",
};

const getZonesData = async (params) => {
	const supabase = createClient();

	console.log("Got following zone type filter :", params);

	let query = supabase
		.from("zones")
		.select(
			`*, services${params?.service ? "!inner" : ""}(*), properties(count)`
		);

	if (params?.type) {
		query = query.eq("type", params?.type);
	}

	if (params?.city) {
		query = query.eq("city", params?.city);
	}

	if (params?.zone) {
		query = query.eq("name", params?.zone);
	}

	if (params?.service) {
		query = query.eq("services.id", params?.service);
	}

	query = query.order("updated_at", { ascending: false });

	const { data, error } = await query;

	if (error) {
		throw new Error(
			`Error while fetching zone Data : ${JSON.stringify(error)}`
		);
	}

	console.log("got following zones data :", JSON.stringify(data));
	return data;
};
export default async function zones({ searchParams, query }) {
	const zones = await getZonesData(searchParams);
	console.log("Got params : ", query);
	return (
		<div className="w-full flex items-start gap-x-4">
			<div className="w-1/4 flex flex-col items-center">
				<ZoneFilter />
				<Datacard
					title={"Nombre de zones"}
					data={zones?.length}
					showCta={false}
				/>
			</div>
			<div className="w-full flex flex-col gap-y-6">
				<div className="w-full mb-5 flex justify-end">
					<Link
						className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
						href="/dashboard/new_zone"
					>
						Créer une zone
					</Link>
				</div>
				<div className="p-4 bg-white h-fit rounded-lg shadow-lg w-full">
					<div className="overflow-x-auto divide-gray-50">
						{zones.length > 0 ? (
							<table className="table">
								<thead>
									<tr className="border-t-0">
										<th className="text-blue-600 font-semibold">
											Type de zone
										</th>
										<th className="text-blue-600 font-semibold">
											Nom de la zone
										</th>
										<th className="text-blue-600 font-semibold">
											Nombre de biens
										</th>
										<th className="text-blue-600 font-semibold">
											Nombre de service
										</th>
										<th className="text-blue-600 font-semibold">Ville</th>
										<th className="text-blue-600 font-semibold">
											Mise à jour le
										</th>
										<th className="text-blue-600 font-semibold">Actions</th>
									</tr>
								</thead>
								<tbody>
									{zones.map((zone) => (
										<tr
											className="border-t-2 border-b-0 border-t-blue-200"
											key={zone?.id}
										>
											<td className="text-blue-950 font-semibold">
												<div
													className={`badge px-2 py-2 bg-${
														zoneColors[zone?.type]
													}-400 text-white text-xs w-xs border-0`}
												>
													{zone?.type == "normal"
														? " Globale"
														: formatProper(zone?.type)}
												</div>
											</td>
											<td className="text-blue-950 font-semibold">
												{formatProper(zone?.name)}
											</td>
											<td className="text-blue-950 font-semibold text-center">
												{zone?.properties?.[0]?.count}
											</td>

											<td className="text-blue-950 font-semibold text-center">
												{zone?.services?.length}
											</td>
											<td className="text-blue-950 font-semibold">
												{formatProper(zone?.city)}
											</td>
											<td className="text-blue-950 font-semibold">
												{new Intl.DateTimeFormat("fr-FR").format(
													Date.parse(zone?.updated_at)
												)}
											</td>
											<td className="flex items-center gap-x-2">
												<Link
													className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
													href={`/dashboard/zones/${zone?.id}`}
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
								<div>Aucune zone ne correspond aux filtres sélectionnés</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
