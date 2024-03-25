// Imports
import { BsFillTelephoneFill, BsFillPencilFill } from "react-icons/bs";
import { BsShop, BsFillBuildingFill, BsPeopleFill } from "react-icons/bs";
import { MdCleaningServices } from "react-icons/md";
import { BiSolidHome } from "react-icons/bi";
import { AiFillMail } from "react-icons/ai";
import { FaExchangeAlt } from "react-icons/fa";
import { createClient } from "@/lib/supabase-server";
import TeamForm from "@/components/forms/TeamForm";
import Datacard from "@/components/ui/DataCard";
import TeamMembers from "@/components/ui/TeamMembers";
import { getAbbv } from "@/lib/utils";

const getTeamData = async (id) => {
	const supabase = createClient();
	const { data, error } = await supabase
		.from("teams")
		.select(
			"*, zones(id, properties(count)), teams_members(*, users(*)), orders(*, properties(*))"
		)
		.eq("id", id)
		.single();

	if (error) {
		throw new Error(
			`Error while fetching contact Data for the team : ${JSON.stringify(
				error
			)}`
		);
	}

	console.log("Team Data is ", JSON.stringify(data));
	return data;
};

export default async function TeamPage({ params, searchParams }) {
	const modify = searchParams?.modify || false;
	const teamData = await getTeamData(params?.id);
	return (
		<div className="w-full flex items-start gap-x-4">
			<div className="w-1/4 flex flex-col items-center pt-12">
				<Datacard
					title={"Bien"}
					data={teamData?.zones?.properties?.[0]?.count}
					showCta={true}
					cta={"Voir"}
					url="/dashboard/properties"
				/>
				<Datacard
					title={"Commandes"}
					data={teamData.orders?.length}
					showCta={true}
					cta={"Voir"}
					url="/dashboard/orders"
				/>
			</div>

			<div className="w-full">
				<div className={`flex justify-between`}>
					<div className="flex justify-end items-center h-16 mb-5 gap-x-2">
						<a
							className="flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-purple-600 hover:shadow-lg cursor-pointer"
							href={`mailto:`}
						>
							<FaExchangeAlt size={14} className="text-white mr-2" />
							Transactions
						</a>
						<a
							className="flex items-center bg-blue-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-blue-600 hover:shadow-lg cursor-pointer"
							href={`tel:`}
						>
							<MdCleaningServices size={14} className="text-white mr-2" />
							Services
						</a>
					</div>
					<div>
						<a
							className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
							href={`/dashboard/teams/${params?.id}?modify=true`}
						>
							<BsFillPencilFill size={14} className="text-white mr-2" />
							Modifier
						</a>
					</div>
				</div>
				<div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit my-5">
					<div
						className={`bg-blue-600 text-white rounded-full p-2 w-28 h-28 flex items-center justify-center -m-14 z-10 border-8 border-blue-50`}
					>
						<span className="text-3xl font-bold">
							{`${getAbbv(teamData?.name)}`}
						</span>
					</div>
					<div className={`text-4xl text-blue-600 font-semibold mt-16 mb-1`}>
						{teamData?.name}
					</div>
					<div className={`text-sm text-gray-500 font-semibold mb-1`}>
						{`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
							Date.parse(teamData?.created_at)
						)}`}
					</div>
					<div className={`text-sm text-purple-600 font-semibold mb-5`}>
						{teamData?.city}
					</div>
					<TeamForm modify={modify} teamData={teamData} />
				</div>
				<TeamMembers membres={teamData?.teams_members} team_id={teamData?.id} />
			</div>
		</div>
	);
}
