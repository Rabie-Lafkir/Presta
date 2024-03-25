"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const supabase = createClient();

export const updateClient = async (formData) => {
  "use server";

  const { error } = await supabase
    .from("users")
    .update({
      active: formData.get("active"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      username: `${formData.get("first_name")} ${formData.get("last_name")}`,
      email: formData.get("email"),
      phone: formData.get("phone"),
      city: formData.get("city"),
    })
    .eq("id", formData.get("id"));

  if (error) {
    throw new Error("Got an error when updating client");
  }

  redirect(`/dashboard/clients/${formData.get("id")}`);
};

export const createNewClient = async (formData) => {
  "use server";

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email"),

    password: formData.get("password"),
    options: {
      data: {
        active: formData.get("active"),
        role: "client",
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        username: `${formData.get("first_name")} ${formData.get("last_name")}`,
        phone: formData.get("phone"),
        profile_picture_url: formData.get("img_url"),
      },
    },
  });

  console.log("New id is :", data);

  if (error) {
    throw new Error(
      `Got an error when updating user: ${JSON.stringify(error)}`
    );
  }

  redirect(`/dashboard/clients/`);
};

export const searchClient = async (formData) => {
  "use server";

  redirect(`/dashboard/clients/?keyword=${formData.get("search")}`);
};
