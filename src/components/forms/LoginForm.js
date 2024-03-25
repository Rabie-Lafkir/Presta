"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/SupabaseAuthProvider";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { signInWithEmail, user } = useAuth();

  const router = useRouter();

  //Main Login  Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("started login");

    if (email == "" || password == "") {
      console.log("Please Fill the entire form");
      return null;
    }

    try {
      const error = await signInWithEmail(email, password);
      if (error) {
        setError(error);
        console.log(error);
      } else {
        console.log("Logged in !");
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("Somehting Wrong happened during login :", error);
    }
  };

  //check if there is a user

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  return (
    <div className="card w-96 bg-white shadow-xl">
      <div className="card-body flex flex-col items-center">
        <h2 className="card-title text-blue-600 text-center">Login</h2>
        <p className="text-center">
          Remplissez le formulaire pour accéder au tableau de bord Presta
          Freedom
        </p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-800">Email</span>
            </label>
            <input
              type="text"
              placeholder="Votre Adresse Email"
              autoComplete="off"
              className="input border-blue-100 w-full bg-slate-100"
              name="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text text-gray-800">Mot de passe</span>
            </label>
            <input
              type="password"
              placeholder="Votre Mot de Passe"
              autoComplete="off"
              className="input border-blue-100 w-full bg-slate-100"
              name="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="card-actions justify-center w-full mt-5">
            <button
              className="btn bg-blue-600 text-white font-bold border-0 shadow w-full"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
