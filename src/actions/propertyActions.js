"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const supabase = createClient();
export const updateProperty = async (formData) => {
  "use server";

  const { error } = await supabase
    .from("properties")
    .update({
      active: formData.get("active"),
      property_type: formData.get("property_type"),
      property_category: formData.get("property_category"),
      number: formData.get("number"),
      street: formData.get("street"),
      neighborhood: formData.get("neighborhood"),
      city: formData.get("city"),
      region: formData.get("region"),
      directions: formData.get("directions"),
    })
    .eq("id", formData.get("id"));

  if (error) {
    throw new Error("Got an error when updating property");
  }

  redirect(`/dashboard/properties/${formData.get("id")}`);
};

export const createProperty = async (formData) => {
  "use server";

  console.log("Got following property data : ", formData);

  const { data, error } = await supabase
    .from("properties")
    .insert({
      active: formData.get("active"),
      property_type: formData.get("property_type"),
      property_name: formData.get("property_name"),
      property_category: formData.get("property_category"),
      number: formData.get("number"),
      street: formData.get("street"),
      neighborhood: formData.get("neighborhood"),
      location_lat: formData.get("location_lat"),
      location_long: formData.get("location_long"),
      location: `POINT(${formData.get("location_long")} ${formData.get(
        "location_lat"
      )})`,
      city: formData.get("city"),
      region: formData.get("region"),
      owner: formData.get("owner"),
      directions: formData.get("directions"),
    })
    .select("*");

  console.log("Created property : ", data);
  if (error) {
    console.log("Got an error when creating property :", JSON.stringify(error));
    throw new Error(
      `Got an error when creating property ${JSON.stringify(error)}`
    );
  }

  redirect(`/dashboard/properties/`);
};
