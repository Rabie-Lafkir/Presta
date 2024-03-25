"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const supabase = createClient();
export const updateService = async (formData) => {
  "use server";

  const { error } = await supabase
    .from("services")
    .update({
      active: formData.get("active"),
      name: formData.get("name"),
      is_subscription: formData.get("is_subscription"),
      is_free: formData.get("is_free"),
      asset_type: formData.get("asset_type"),
      duration: parseInt(formData.get("duration")),
      min_price: formData.get("min_price"),
      max_price: formData.get("max_price"),
      description: formData.get("description"),
    })
    .eq("id", formData.get("id"));

  if (error) {
    throw new Error(
      `Got an error when updating service : ${JSON.stringify(error)}`
    );
  }

  redirect(`/dashboard/services/${formData.get("id")}`);
};

export const createService = async (formData) => {
  "use server";

  const { error } = await supabase.from("services").insert({
    active: true,
    is_subscription: formData.get("is_subscription"),
    is_free: formData.get("is_free"),
    duration: parseInt(formData.get("duration")),
    min_price: formData.get("min_price"),
    max_price: formData.get("max_price"),
    name: formData.get("name"),
    description: formData.get("description"),
    check_active: formData.get("check_active"),
    service_img: formData.get("service_img_url"),
    asset_type: formData.get("asset_type"),
  });

  if (error) {
    console.log(
      "`Got an error when updating service : ${JSON.stringify(error)}`"
    );
    throw new Error(
      `Got an error when updating service : ${JSON.stringify(error)}`
    );
  }

  redirect(`/dashboard/services/`);
};
