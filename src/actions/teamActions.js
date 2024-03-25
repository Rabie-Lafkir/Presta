"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const supabase = createClient();

export const createTeam = async (formData) => {
	"use server";

	const members = formData.getAll("member");

	console.log("Got following servers members", members);

	let { data, error } = await supabase
		.from("teams")
		.upsert({
			name: formData.get("name"),
			active: true,
			size: formData.get("size"),
			zone_id: formData.get("zone_id"),
		})
		.select();

	if (error) {
		console.log("Error while creating team :", error);
		throw new Error(`Error while creating team : ${error}`);
	}

	console.log("Added following team : ", data);

	redirect(`/dashboard/teams`);
};

export const updateTeam = async (formData) => {
	"use server";

	const members = formData.getAll("member");
	const team_id = formData.get("team_id");

	let { data, error } = await supabase
		.from("teams")
		.upsert({
			name: formData.get("name"),
			active: true,
			size: formData.get("size"),
			zone_id: formData.get("zone_id"),
		})
		.select();

	console.log("Got following servers members", members);
	console.log("Got following team ID :", team_id);

	const membersRequest = [];

	members.map((member) =>
		membersRequest.push({ user: member, team: team_id, role: "normal" })
	);

	const membersData = await supabase
		.from("teams_members")
		.upsert(membersRequest, {
			onConflict: "team,user",
			ignoreDuplicates: false,
		});

	if (membersData.error) {
		console.log(
			"Error while adding members to  team :",
			JSON.stringify(membersData.error)
		);
		throw new Error(
			`Error while adding members to  team : ${JSON.stringify(
				membersData.error
			)}`
		);
	}

	redirect(`/dashboard/teams/${team_id}`);
};

export const updateTeamForm = async (formData) => {
	"use server";

	const members = formData.getAll("member");
	const team_id = formData.get("team_id");

	let { data, error } = await supabase
		.from("teams")
		.update({
			name: formData.get("name"),
			active: formData.get("active"),
			size: formData.get("size"),
			zone_id: formData.get("zone_id"),
		})
		.eq("id", team_id);

	console.log("Got following servers members", members);
	console.log("Got following team ID :", team_id);

	const membersRequest = [];

	members.map((member) =>
		membersRequest.push({ user: member, team: team_id, role: "normal" })
	);

	const membersData = await supabase
		.from("teams_members")
		.upsert(membersRequest, {
			onConflict: "team,user",
			ignoreDuplicates: false,
		});

	if (membersData.error) {
		console.log(
			"Error while adding members to  team :",
			JSON.stringify(membersData.error)
		);
		throw new Error(
			`Error while adding members to  team : ${JSON.stringify(
				membersData.error
			)}`
		);
	}

	redirect(`/dashboard/teams/${team_id}`);
};
