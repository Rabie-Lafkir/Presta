"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const supabase = createClient();

export const updateZone = async (formData) => {
  "use server";

  console.log("Server points");
  const rawLat = formData.getAll("point_lat");
  const rawLong = formData.getAll("point_long");
  const points = [];
  for (let i = 0; i < rawLat.length; i++) {
    let tempPriceObj = {};
    tempPriceObj["lat"] = parseFloat(rawLat[i]);
    tempPriceObj["long"] = parseFloat(rawLong[i]);
    console.log(tempPriceObj);
    points.push(tempPriceObj);
  }

  const { error } = await supabase
    .from("zones")
    .update({
      name: formData.get("name"),
      city: formData.get("city"),
      region: formData.get("region"),
      type: formData.get("type"),
      points: points,
      updated_at: new Date(),
    })
    .eq("id", formData.get("id"));

  if (error) {
    throw new Error(
      `Got an error when updating zone : ${JSON.stringify(error)}`
    );
  }

  redirect(`/dashboard/zones/${formData.get("id")}`);
};

export const createZone = async (formData) => {
  "use server";

  console.log("Server points");
  const rawLat = formData.getAll("point_lat");
  const rawLong = formData.getAll("point_long");
  const points = [];
  for (let i = 0; i < rawLat.length; i++) {
    let tempPriceObj = {};
    tempPriceObj["lat"] = parseFloat(rawLat[i]);
    tempPriceObj["long"] = parseFloat(rawLong[i]);
    console.log(tempPriceObj);
    points.push(tempPriceObj);
  }

  const { error } = await supabase.from("zones").insert({
    name: formData.get("name"),
    city: formData.get("city"),
    type: formData.get("type"),
    region: formData.get("region"),
    points: points,
    updated_at: new Date(),
  });

  if (error) {
    throw new Error(
      `Got an error when updating zone : ${JSON.stringify(error)}`
    );
  }

  redirect(`/dashboard/zones/`);
};
