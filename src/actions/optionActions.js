"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const supabase = createClient();
export const createOption = async (formData) => {
  "use server";

  const prices = [];
  const minPrices = formData.getAll("min_price");
  const maxPrices = formData.getAll("max_price");
  const levelPrices = formData.getAll("price");

  for (let i = 0; i < minPrices.length; i++) {
    let tempPriceObj = {};
    tempPriceObj["min"] = minPrices[i];
    console.log("Got following min price", minPrices[i]);
    tempPriceObj["max"] = maxPrices[i];
    tempPriceObj["price"] = levelPrices[i];
    console.log(tempPriceObj);
    prices.push(JSON.stringify(tempPriceObj));
    console.log("Got the following form data :", prices);
  }

  const { data, error } = await supabase
    .from("options")
    .upsert({
      service_id: formData.get("service_id"),
      name: formData.get("name"),
      active: true,
    })
    .select();

  if (error) {
    console.log("Error while creating option :", optionError);
    throw new Error(`Error while creating option : ${optionError}`);
  }

  console.log("Created following option :", data);

  const createdPrice = await supabase.from("prices").insert({
    is_fixed: formData.get("is_fixed"),
    option_id: data[0]?.id,
    name: formData.get("price_name"),
    default_price: formData.get("default_price"),
    price_list: prices,
  });

  if (createdPrice?.error) {
    console.log("Error while creating price :", createdPrice?.error);
    throw new Error(`Error while creating option : ${createdPrice?.error}`);
  }

  redirect(`/dashboard/services/${formData.get("service_id")}`);
};

export const updateOption = async (formData) => {
  "use server";

  const { error } = await supabase
    .from("options")
    .update({
      name: formData.get("name"),
      description: formData.get("description"),
      active: formData.get("active"),
    })
    .eq("id", formData.get("id"));

  if (error) {
    throw new Error(
      `Got an error when updating service : ${JSON.stringify(error)}`
    );
  }

  redirect(`/dashboard/options/${formData.get("id")}`);
};
