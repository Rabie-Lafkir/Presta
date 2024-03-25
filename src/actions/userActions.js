"use server";

import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const supabase = createClient();

export const updateUser = async (formData) => {
  "use server";

  const { error } = await supabase
    .from("users")
    .update({
      active: formData.get("active"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      city: formData.get("city"),
      role: formData.get("role"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      profile_picture_url: formData.get("img_url"),
    })
    .eq("id", formData.get("id"));

  if (error) {
    throw new Error("Got an error when updating user");
  }

  redirect(`/dashboard/users/${formData.get("id")}`);
};

export const createUser = async (formData) => {
  "use server";

  const { data, error } = await supabase.auth.signUp({
    email: formData.get("email"),

    password: formData.get("password"),
    options: {
      data: {
        active: formData.get("active"),
        role: formData.get("role"),
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

  redirect(`/dashboard/users/`);
};
