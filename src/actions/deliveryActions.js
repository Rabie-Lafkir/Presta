"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

const supabase = createClient();

export const updateDeliveryMembers = async (formData) => {
	"use server";

	const members = formData.getAll("member");
	const removed = formData.getAll("removed");
	const team_id = formData.get("delivery_id");

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

	redirect(`/dashboard/teams`);
};

export const updateDelivery = async (formData) => {
	"use server";

	console.log("Got following start_time", formData.get("start_time"));

	const { error } = await supabase
		.from("deliveries")
		.update({
			status: formData.get("status"),
			start_time: new Date(formData.get("start_time")),
			end_time: new Date(formData.get("end_time")),
			reason: formData.get("reason"),
		})
		.eq("id", formData.get("id"));

	if (error) {
		console.log("Got an error when updating client", JSON.stringify(error));
		throw new Error("Got an error when updating client");
	}

	redirect(`/dashboard/deliveries/${formData.get("id")}`);
};

export const createDelivery = async (formData) => {
	"use server";

	console.log("Got following servers delivery data", formData);

	let { data, error } = await supabase
		.from("deliveries")
		.upsert({
			start_time: new Date(formData.get("start_time")),
			end_time: new Date(formData.get("end_time")),
			status: formData.get("status"),
			order_id: formData.get("order_id"),
			property_id: formData.get("property_id"),
			duration: dayjs(formData.get("end_time")).diff(
				dayjs(formData.get("start_time")),
				"minute"
			),
		})
		.select();

	if (error) {
		console.log("Error while creating delivery : ", JSON.stringify(error));
	}

	console.log("Got client data :", data);

	redirect(`/dashboard/deliveries`);
};
