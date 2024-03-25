"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

const supabase = createClient();
export const updateChecklist = async (formData) => {
  "use server";

  console.log("Got id : ", formData.get("id"))

  const { error } = await supabase
    .from("checklists")
    .update({
      active: formData.get("active"),
    })
    .eq("id", formData.get("id"));

  if (error) {
    console.log("Got an error when updating checklist", JSON.stringify(error));
    throw new Error(`Got an error when updating checklist ${JSON.stringify(error)}`);
  }

  console.log("Updated Checklist !");
  redirect(`/dashboard/checklists/${formData.get("id")}`);
};

export const createChecklist = async (formData) => {
  "use server";

  console.log("Got data : ", formData.get("name"), formData.get("service"));
  const { data, error } = await supabase
    .from("checklists")
    .insert({
      active: true,
      name: formData.get("name"),
      service_id: formData.get("service"),
    })
    .select();

  if (error) {
    console.log("Got an error when creating checklist", JSON.stringify(error));
    throw new Error("Got an error when creating checklist");
  }

  console.log("Created Checklist !");
  redirect(`/dashboard/checklists/${data?.[0]?.id}`);
};
