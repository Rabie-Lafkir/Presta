/* eslint-disable @next/next/no-img-element */
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
import Drawer from "@/components/ui/Drawer";
import CreateUser from "@/components/forms/CreateUser";

const getUsersData = async () => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("users")
		.select("* , teams(count)")
		.neq("role", "client")
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(
			`Error while fetching user Data : ${JSON.stringify(error)}`
		);
	}

	// console.log("got following users data :", data);
	return data;
};

export default async function Users({ searchParams }) {
	const create = searchParams?.create || false;
	const users = await getUsersData();
	return (
		<div>
			{create && (
				<Drawer title={"Créer un utilisateur"}>
					<CreateUser />
				</Drawer>
			)}
			<div className="w-full flex items-start gap-x-4">
				<div className="w-1/4 flex flex-col items-center">
					<Datacard
						title={"Nombre d'utilisateurs"}
						data={users?.length}
						showCta={false}
					/>
				</div>
				<div className="w-full flex flex-col gap-y-6">
					<div className="w-full mb-5 flex justify-end">
						<Link
							className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
							href="/dashboard/users?create=true"
						>
							Créer un utilisateur
						</Link>
					</div>
					<div className="p-4 bg-white h-fit rounded-lg shadow-lg w-full">
						<div className="overflow-x-auto divide-gray-50">
							{users.length > 0 ? (
								<table className="table">
									<thead>
										<tr className="border-t-0">
											<th></th>
											<th></th>
											<th className="text-blue-600 font-semibold">Prénom</th>
											<th className="text-blue-600 font-semibold">Nom</th>
											<th className="text-blue-600 font-semibold">
												Permissions
											</th>
											<th className="text-blue-600 font-semibold">Créée le </th>
											<th className="text-blue-600 font-semibold">Actions</th>
										</tr>
									</thead>
									<tbody>
										{users.map((user) => (
											<tr
												className="border-t-2 border-b-0 border-t-blue-200"
												key={user?.id}
											>
												<th
													className={`w-12 ${
														user?.teams?.[0]?.count > 0 && user?.active
															? "text-green-300"
															: user?.teams?.[0]?.count == 0 && user?.active
															? "text-yellow-300"
															: "text-red-500"
													}`}
												>
													<BsCircleFill />
												</th>
												<th className="w-4">
													{user?.profile_picture_url ? (
														<div className="avatar ">
															<div className="w-8 h-8 rounded-full">
																<img
																	src={user?.profile_picture_url}
																	alt={user?.username}
																/>
															</div>
														</div>
													) : (
														<div className="bg-blue-600 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center">
															<span className="text-sm font-bold">{`${
																user?.first_name.split("")[0]
															}${user?.last_name.split("")[0]}`}</span>
														</div>
													)}
												</th>
												<td className="text-blue-950 font-semibold">
													{formatProper(user?.first_name)}
												</td>
												<td className="text-blue-950 font-semibold">
													{formatProper(user?.last_name)}
												</td>

												<td className="border-0 font-semibold badge bg-purple-400 text-white">
													{user?.role == "super_admin"
														? "Super Admin"
														: user?.role == "employee"
														? "Collabrateur"
														: user?.role == "manager"
														? "Superviseur"
														: formatProper(user?.role)}
												</td>
												<td className="text-blue-950 font-semibold ">
													{
														new Date(user?.created_at)
															.toLocaleDateString("fr-FR")
															.split("T")[0]
													}
												</td>
												<td className="flex items-center gap-x-2">
													<Link
														className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
														href={`/dashboard/users/${user?.id}`}
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
									<div>Aucun user ne correspond aux filtres sélectionnés</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
