"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const supabase = createClient();

export const createPrice = async (formData) => {
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

  const req = {
    is_fixed: formData.get("is_fixed"),
    name: formData.get("price_name"),
    default_price: formData.get("default_price"),
    price_list: prices,
  };

  if (formData.get("service_id")) {
    req.service_id = formData.get("service_id");
  }
  if (formData.get("option_id")) {
    req.option_id = formData.get("option_id");
  }

  const { error } = await supabase.from("prices").insert(req);

  if (error) {
    console.log("Error while creating price :", JSON.stringify(error));
    throw new Error(`Error while creating option : ${JSON.stringify(error)}`);
  }

  if (formData.get("service_id")) {
    redirect(`/dashboard/services/${formData.get("service_id")}`);
  }
  if (formData.get("option_id")) {
    redirect(`/dashboard/options/${formData.get("option_id")}`);
  }
};

export const updatePrice = async (formData) => {
  "use server";

  const { error } = await supabase
    .from("prices")
    .update({
      name: formData.get("name"),
      is_fixed: formData.get("is_fixed"),
      is_monthly: formData.get("is_monthly"),
      default_price: formData.get("default_price"),
      active: formData.get("active"),
    })
    .eq("id", formData.get("id"));

  if (error) {
    throw new Error(
      `Got an error when updating price : ${JSON.stringify(error)}`
    );
  }

  redirect(`/dashboard/prices/${formData.get("id")}`);
};

export const updatePriceList = async (formData) => {
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

  const { error } = await supabase
    .from("prices")
    .update({
      price_list: prices,
    })
    .eq("id", formData.get("price_id"));

  if (error) {
    console.log("Error while creating price :", error);
    throw new Error(`Error while creating option : ${error}`);
  }

  redirect(`/dashboard/prices/${formData.get("price_id")}`);
};
