/* eslint-disable react/no-unescaped-entities */
import { createClient } from "@/lib/supabase-server";
import {
	BsFillPencilFill,
	BsBackspaceFill,
	BsFillHouseDoorFill,
	BsPeopleFill,
	BsFillGearFill,
} from "react-icons/bs";
import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCards";
import ClientCard from "@/components/ui/ClientCard";
import DeliveryForm from "@/components/forms/DeliveryForm";
import Drawer from "@/components/ui/Drawer";
import DeliveryUsersForm from "@/components/forms/DeliveryUsersForm";
import DeliveryOptionsForm from "@/components/forms/DeliveryOptionsForm";
import DeliveryChecklist from "@/components/ui/DeliveryChecklist";

const getDeliveryData = async (id) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("deliveries")
		.select(
			"*, properties(*, users(*)), orders(*, services(*)), deliveries_users(*, users(*)), options(*)"
		)
		.eq("id", id)
		.single();

	if (error) {
		console.log("Error while fetching delivery : ", JSON.stringify(error));
	}

	console.log("Delivery Data is ", JSON.stringify(data));
	return data;
};
const getCheckListData = async (service_id, delivery_id) => {
	console.log("Got service id", service_id);
	if (!service_id) {
		return;
	}
	const supabase = createClient();
	const { data, error } = await supabase
		.from("checklists")
		.select("*, checklist_questions(*, checklist_answers(*, users(username)))")
		.eq("service_id", service_id)
		.eq("checklist_questions.checklist_answers.delivery_id", delivery_id)
		.eq("active", true)
		.limit(1)
		.maybeSingle();

	if (error) {
		console.log("Error while fetching checklists : ", JSON.stringify(error));
	}

	console.log("Checklist Data is ", JSON.stringify(data));
	return data;
};

export default async function DeliveryPage({ params, searchParams }) {
	const deliveryData = await getDeliveryData(params?.id);
	const checklistData = await getCheckListData(
		deliveryData?.orders?.services?.id,
		params?.id
	);

	const modify = searchParams?.modify || false;
	const createUser = searchParams?.createUser || false;
	const createOpt = searchParams?.createOpt || false;
	return (
		<div>
			{createUser && (
				<Drawer title={"Gestion des affectations"}>
					<DeliveryUsersForm
						delivery_id={deliveryData?.id}
						team={deliveryData?.deliveries_users.map((el) => ({
							name: el.users?.username,
							id: el.users?.id,
						}))}
					/>
				</Drawer>
			)}
			{createOpt && (
				<Drawer title={"Gestion des affectations"}>
					<DeliveryOptionsForm
						delivery_id={deliveryData?.id}
						deliveryOptions={deliveryData?.options.map((el) => ({
							name: el.options?.name,
							id: el.options?.id,
						}))}
					/>
				</Drawer>
			)}
			<div className="w-full flex items-start gap-x-4">
				<div className="w-1/4 flex flex-col items-center pt-16 gap-y-12">
					<ClientCard client={deliveryData?.properties?.users} />
					{deliveryData?.orders?.services && (
						<ServiceCard service={deliveryData?.orders?.services} />
					)}
				</div>
				<div className="w-full h-full">
					{!modify && (
						<div className={`flex justify-between`}>
							<div className="flex justify-end items-center h-16 mb-5 gap-x-2">
								<a
									className="flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-purple-600 hover:shadow-lg cursor-pointer"
									href={`/dashboard/deliveries/${deliveryData?.id}?createUser=true`}
								>
									<BsPeopleFill size={14} className="text-white mr-2" />
									Gérer l'équipe
								</a>
								<a
									className="flex items-center bg-blue-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-blue-600 hover:shadow-lg cursor-pointer"
									href={`/dashboard/deliveries/${deliveryData?.id}?createOpt=true`}
								>
									<BsFillGearFill size={14} className="text-white mr-2" />
									Gérer les options
								</a>
							</div>
							<div>
								<a
									className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
									href={`/dashboard/deliveries/${deliveryData?.id}?modify=true`}
								>
									<BsFillPencilFill size={14} className="text-white mr-2" />
									Modifier
								</a>
							</div>
						</div>
					)}
					{modify && (
						<div className="flex justify-end items-center h-16 mb-5 gap-x-2">
							<div>
								<a
									className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
									href={`/dashboard/deliveries/${deliveryData?.id}`}
								>
									<BsBackspaceFill size={14} className="text-white mr-2" />
									Annuler
								</a>
							</div>
						</div>
					)}
					<div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit mb-5">
						<div
							className={`bg-blue-600 text-white rounded-full p-2 w-28 h-28 flex items-center justify-center -m-14 ${
								deliveryData?.status == "done"
									? "border-4 border-green-400"
									: deliveryData?.status == "planned"
									? "border-4 border-amber-400"
									: deliveryData?.status == "canceled"
									? "border-4 border-red-400"
									: "border-4 border-amber-700"
							}`}
						>
							<span className="text-3xl font-bold">{deliveryData?.id}</span>
						</div>
						<div className={`text-4xl text-blue-600 font-semibold mt-16 mb-1`}>
							{`Affectation ${deliveryData?.id}`}
						</div>
						<div className={"text-xl text-purple-400 font-semibold mb-1"}>
							{deliveryData?.properties?.users?.username}
						</div>
						<div className={"text-sm text-gray-500 font-semibold mb-5"}>
							{`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
								Date.parse(deliveryData?.created_at)
							)}`}
						</div>
						<DeliveryForm deliveryData={deliveryData} modify={modify} />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-stretch">
						<div className="flex flex-center items-center mb-5 gap-y-2">
							<div className="w-full bg-white shadow-xl mb-5 p-6 rounded-lg flex flex-col items-center h-full">
								<div className="text-3xl text-blue-600 font-semibold mb-5 w-full">
									Membres de l'équipe
								</div>
								{deliveryData?.deliveries_users?.length == 0 ? (
									<div className="h-56 w-full flex justify-center items-center text-purple-600">
										{`Affecation N# ${deliveryData?.id} n'a été attribuée à aucun utilisateur`}
									</div>
								) : (
									deliveryData?.deliveries_users
										.filter((member) => member?.active)
										.map((member) => (
											<div
												className="flex items-center justify-between max-w-md w-full bg-blue-600 shadow-xl mb-5 p-4 rounded-lg"
												key={member?.id}
											>
												<div className="h-16 w-16 bg-white text-blue-400 rounded-full flex justify-center items-center shadow">
													<BsFillHouseDoorFill size={24} />
												</div>
												<div>
													<div className=" items-center text-2xl text-white">
														{member?.users?.username}
													</div>
													<div className=" items-center text-sm text-white">
														{new Intl.DateTimeFormat("fr-FR").format(
															Date.parse(member?.created_at)
														)}
													</div>
													<div className=" items-center text-sm text-white">
														{member?.role}
													</div>
												</div>
												<Link
													className="bg-white text-blue-600 text-base font-semibold rounded-2xl p-2 shadow"
													href={`/dashboard/users/${member?.user_id}`}
												>
													Gérer
												</Link>
											</div>
										))
								)}
							</div>
						</div>
						<div className="flex flex-center items-center mb-5 gap-y-2">
							<div className="w-full bg-white shadow-xl mb-5 p-6 rounded-lg flex flex-col items-center h-full">
								<div className="text-3xl text-blue-600 font-semibold mb-5 w-full">
									Options liées à cette livraison
								</div>
								{deliveryData?.options?.length == 0 ? (
									<div className="h-56 w-full flex justify-center items-center text-purple-600">
										{`Affecation N# ${deliveryData?.id} n'est liée à aucune option`}
									</div>
								) : (
									deliveryData?.options.map((option) => (
										<div
											className="flex items-center justify-between max-w-md w-full bg-blue-600 shadow-xl mb-5 p-4 rounded-lg gap-x-2"
											key={option?.id}
										>
											<div className="w-fit px-4 flex items-center justify-center h-full">
												<div className="h-16 w-16 bg-white text-blue-400 rounded-full flex justify-center items-center shadow">
													<BsFillHouseDoorFill size={24} />
												</div>
											</div>
											<div className="w-fit flex flex-col items-center">
												<div className=" items-center text-2xl text-white line-clamp-1">
													{option?.name}
												</div>
												<div className=" items-center text-sm text-white">
													{new Intl.DateTimeFormat("fr-FR").format(
														Date.parse(option?.created_at)
													)}
												</div>
											</div>
											<Link
												className="bg-white text-blue-600 text-base font-semibold rounded-2xl p-2 shadow"
												href={`/dashboard/users/${option?.id}`}
											>
												Gérer
											</Link>
										</div>
									))
								)}
							</div>
						</div>
					</div>
					<div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit mb-5 p-6 ">
						<div className="text-3xl text-blue-600 font-semibold mb-5 w-full">
							Responses de la checklists
						</div>
						{(checklistData?.checklist_questions?.length == 0 ||
							!checklistData) && (
							<div className="h-56 w-full flex justify-center items-center text-purple-600">
								{`Affecation N# ${deliveryData?.id} n'a pas de checklists`}
							</div>
						)}
						{checklistData?.checklist_questions?.length > 0 && (
							<DeliveryChecklist
								checklist={checklistData}
								delivery_id={deliveryData?.id}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
