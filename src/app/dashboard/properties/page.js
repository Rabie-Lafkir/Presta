import { PropertyFilter } from "@/components/forms/PropertyFilter";
import { createClient } from "@/lib/supabase-server";
import {
	BsCircleFill,
	BsShop,
	BsFillBuildingFill,
	BsPeopleFill,
} from "react-icons/bs";
import { BiSolidHome } from "react-icons/bi";
import Link from "next/link";
import { formatProper } from "@/lib/utils";

const getPropeties = async (params) => {
	const supabase = createClient();

	let query = supabase
		.from("properties")
		.select(
			`*, users!inner(id, username, first_name, last_name, profile_picture_url), zones${
				params?.zone ? "!inner" : ""
			}(*)`
		);

	if (params?.city) {
		query = query.eq("city", params?.city);
	}

	if (params?.region) {
		query = query.eq("region", params?.region);
	}
	if (params?.userString) {
		query = query.eq("users.id", params?.userString);
	}

	if (params?.zone) {
		query = query.eq("zones.id", params?.zone);
	}

	query = query.order("created_at", { ascending: false });
	const { data, error } = await query;

	if (error) {
		console.log("Error while fetching Properties ", error);
		throw new Error("Error while fetching Properties", JSON.stringify(error));
	}
	return data;
};

export default async function Properties({ searchParams }) {
	console.log("Got current params : ", searchParams);
	const properties = await getPropeties(searchParams);

	return (
		<div className="w-full flex items-start gap-x-4">
			<div className="w-1/4 flex flex-col items-center">
				<PropertyFilter />
			</div>
			<div className="w-full">
				<div className="w-full mb-5 flex justify-end">
					<Link
						className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
						href="/dashboard/new_property"
					>
						Créer un bien
					</Link>
				</div>
				<div className="p-4 bg-white h-fit rounded-lg shadow-lg w-full">
					<div className="overflow-x-auto divide-gray-50">
						{properties.length > 0 ? (
							<table className="table">
								<thead>
									<tr className="border-t-0">
										<th></th>
										<th></th>
										<th className="text-blue-600 font-semibold">Nom du bien</th>
										<th className="text-blue-600 font-semibold">
											Nom du client
										</th>
										<th className="text-blue-600 font-semibold">
											Type de bien
										</th>
										<th className="text-blue-600 font-semibold">
											Catégorie du bien
										</th>
										<th className="text-blue-600 font-semibold">Ville</th>
										<th className="text-blue-600 font-semibold">Actions</th>
									</tr>
								</thead>
								<tbody>
									{properties.map((property) => (
										<tr
											className="border-t-2 border-b-0 border-t-blue-200"
											key={property?.id}
										>
											<th
												className={`w-12 ${
													property?.active
														? "text-green-300"
														: "text-yellow-300"
												}`}
											>
												<BsCircleFill />
											</th>
											<th className="w-12 flex items-center">
												{
													<div className="bg-blue-600 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center">
														<span className="text-sm font-bold">
															{(property?.property_type == "maison" && (
																<BiSolidHome size={14} />
															)) ||
																(property?.property_type == "bureau" && (
																	<BsFillBuildingFill size={14} />
																)) ||
																(property?.property_type == "magasin" && (
																	<BsShop size={14} />
																)) ||
																(property?.property_type == "syndique" && (
																	<BsPeopleFill size={14} />
																))}
														</span>
													</div>
												}
											</th>
											<td className="text-blue-950 font-semibold">
												{property?.property_name}
											</td>
											<td className="text-blue-950 font-semibold">
												{property?.users?.username}
											</td>
											<td className="text-blue-950 font-semibold overflow-ellipsis overflow-hidden">
												{formatProper(property?.property_type)}
											</td>

											<td className="text-blue-950 font-semibold">
												{formatProper(property?.property_category)}
											</td>
											<td className="text-blue-950 font-semibold">
												{property?.city}
											</td>
											<td className="flex items-center gap-x-2">
												<Link
													className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
													href={`/dashboard/properties/${property?.id}`}
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
								<div>Aucun bien ne correspond aux filtres sélectionnés</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
