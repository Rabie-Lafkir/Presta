"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

const supabase = createClient();

export const createOrder = async (formData) => {
  "use server";

  console.log("Got following servers order data", formData);

  let { data, error } = await supabase
    .from("orders")
    .upsert({
      billing_date: new Date(formData.get("billing_date")),
      status: formData.get("status"),
      user_id: formData.get("user_id"),
      service_id : formData.get("service_id"),
      value: parseFloat(formData.get("value")),
      frequency: parseFloat(formData.get("frequency")),
      property_id: formData.get("property_id"),
      is_offline: true,
    })
    .select();

  if (error) {
    console.log("Error while creating order : ", JSON.stringify(error));
  }

  redirect(`/dashboard/transactions`);
};
