// Imports
import MapCard from "@/components/ui/MapCard";
import { BsFillTelephoneFill, BsFillPencilFill } from "react-icons/bs";
import { BsShop, BsFillBuildingFill, BsPeopleFill } from "react-icons/bs";
import { MdCleaningServices } from "react-icons/md";
import { BiSolidHome } from "react-icons/bi";
import { AiFillMail } from "react-icons/ai";
import { FaExchangeAlt } from "react-icons/fa";
import { createClient } from "@/lib/supabase-server";
import PropertyForm from "@/components/forms/PropertyForm";
import ContactCard from "@/components/ui/ContactsCard";
import ClientCard from "@/components/ui/ClientCard";
import PropertyAssets from "@/components/ui/PropertyAssets";

//Global Functions

const getPropertyData = async (id) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("properties")
		.select("*, users!inner(*), assets(*, asset_types(*))")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(
			`Error while fetching property Data : ${JSON.stringify(error)}`
		);
	}

	return data;
};

const getContactsData = async (id) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("properties")
		.select("*, contacts(*)")
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(
			`Error while fetching contact Data for the property : ${JSON.stringify(
				error
			)}`
		);
	}

	console.log("Contact Data is ", data);
	return data.contacts;
};

export default async function PropertyPage({ params, searchParams }) {
	const modify = searchParams?.modify || false;
	const propertyData = await getPropertyData(params?.id);
	const contactsData = await getContactsData(params?.id);
	return (
		<div className="w-full flex items-start gap-x-4">
			<div className="w-1/4 flex flex-col items-center pt-12">
				<ClientCard client={propertyData?.users} />
				<ContactCard contacts={contactsData} />
			</div>

			<div className="w-full">
				<div className={`flex justify-between`}>
					<div className="flex justify-end items-center h-16 mb-5 gap-x-2">
						<a
							className="flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-purple-600 hover:shadow-lg cursor-pointer"
							href={`/dashboard/transactions/?property_id=${propertyData?.id}`}
						>
							<FaExchangeAlt size={14} className="text-white mr-2" />
							Commandes
						</a>
					</div>
					<div>
						<a
							className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
							href={`/dashboard/properties/${params?.id}?modify=true`}
						>
							<BsFillPencilFill size={14} className="text-white mr-2" />
							Modifier
						</a>
					</div>
				</div>
				<MapCard
					styles="min-w-full"
					center={{
						lat: parseFloat(propertyData.location_lat),
						lng: parseFloat(propertyData.location_long),
					}}
					markers={[
						{
							position: {
								lat: parseFloat(propertyData?.location_lat),
								lng: parseFloat(propertyData?.location_long),
							},
						},
					]}
					draggable={modify}
				/>
				<div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit my-5">
					<div
						className={`bg-blue-600 text-white rounded-full p-2 w-28 h-28 flex items-center justify-center -m-14 z-10 border-8 border-blue-50`}
					>
						<span className="text-3xl font-bold">
							{(propertyData?.property_type == "maison" && (
								<BiSolidHome size={48} />
							)) ||
								(propertyData?.property_type == "bureau" && (
									<BsFillBuildingFill size={48} />
								)) ||
								(propertyData?.property_type == "magasin" && (
									<BsShop size={48} />
								)) ||
								(propertyData?.property_type == "syndique" && (
									<BsPeopleFill size={48} />
								))}
						</span>
					</div>
					<div className={`text-4xl text-blue-600 font-semibold mt-16 mb-1`}>
						{propertyData?.property_name}
					</div>
					<div className={`text-sm text-gray-500 font-semibold mb-1`}>
						{`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
							Date.parse(propertyData?.created_at)
						)}`}
					</div>
					<div className={`text-sm text-purple-600 font-semibold mb-5`}>
						{propertyData?.city}
					</div>
					<PropertyForm modify={modify} propertyData={propertyData} />
				</div>
				<PropertyAssets assets={propertyData?.assets} />
			</div>
		</div>
	);
}
