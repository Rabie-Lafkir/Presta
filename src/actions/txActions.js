"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import dayjs from "dayjs";

const supabase = createClient();
export const updateTx = async (formData) => {
  "use server";

  console.log("Got form data : ", formData);

  const { error } = await supabase
    .from("transactions")
    .update({
      success: formData.get("success"),
      comment: formData.get("comment"),
      updated_value: formData.get("updated_value"),
    })
    .eq("id", formData.get("tx_id"));

  if (error) {
    console.log("Got an error when updating tx", JSON.stringify(error));
    throw new Error("Got an error when updating tx");
  }

  console.log("Updated Tx !");
  revalidatePath(`/dashboard/transactions/${formData.get("order_id")}`);
  redirect(`/dashboard/transactions/${formData.get("order_id")}`);
};
