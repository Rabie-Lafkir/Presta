/* eslint-disable react/no-unescaped-entities */
"use client";

// imports
import { createClient } from "@/lib/supabase-client";
import { BsPlus } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import SearchDropdown from "./SearchDropdown";
import Drawer from "../ui/Drawer";
import AddMember from "../forms/AddMember";

//Setting up supabase
const supabase = createClient();

export default function TeamMembers({ membres, team_id }) {
	//Managing state
	const [create, setCreate] = useState(false);
	const [user, setUser] = useState("");
	const [userList, setUserList] = useState([]);

	return (
		<div>
			{create && (
				<Drawer title={"Ajoutez un membre a l'equipe"}>
					<AddMember team_id={team_id} />
				</Drawer>
			)}
			<div className="w-full bg-white rounded-lg shadow-lg p-6">
				<div className="w-full flex items-center justify-between mb-5">
					<div className="font-semibold text-2xl text-emerald-600">
						Gérer les membres
					</div>
					<button
						className="flex items-center bg-emerald-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer"
						onClick={() => setCreate(true)}
					>
						<BsPlus size={24} className="text-white mr-2" />
						Ajouter un membre
					</button>
				</div>
				<input
					type="text"
					name="team_id"
					value={team_id}
					className={"input hidden"}
					readOnly={true}
				/>
				{!membres ? (
					<div className="w-full h-44 flex justify-center items-center text-emerald-600">
						Cette équipe n'a pas de membres
					</div>
				) : (
					membres.map((membre) => (
						<div
							key={membre?.id}
							className="w-full p-2 flex items-center justify-between shadow-lg rounded-lg py-4 px-8 my-4"
						>
							<div className="font-base text-gray-500">
								Nom :
								<span className="font-semibold text-blue-600">
									{membre?.users?.username}
								</span>
							</div>
							<div className="font-base text-gray-500">
								Role :
								<span className="font-semibold text-blue-600">
									{membre?.role}
								</span>
							</div>
							<div className="font-base text-gray-500">
								Ajouté le :
								<span className="font-semibold text-blue-600">
									{membre?.created_at.split("T")[0]}
								</span>
							</div>
							<a
								className="px-4 py-2 rounded-full bg-amber-400 font-semibold text-white shadow hover:bg-amber-600 hover:shadow-xl"
								href={`/dashboard/users/${membre.user}`}
							>
								Gérer
							</a>
						</div>
					))
				)}
			</div>
		</div>
	);
}
