/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useRef } from "react";
import { createUser } from "@/actions/userActions";
import { v4 as uuid } from "uuid";
import { createClient } from "@/lib/supabase-client";

const CreateUser = () => {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState();
  const [phone, setPhone] = useState();
  const [passError, setPassError] = useState();
  const imgUrl = useRef(null);

  const uploadImg = async (event) => {
    try {
      let imgUuid = uuid();
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        console.log("You must select an image to upload.");
        throw new Error("You must select an image to upload.");
      }
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${imgUuid}-${Math.random()}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from("users")
        .upload(filePath, file);

      if (uploadError) {
        console.log("Got an upload error", uploadError);
        throw uploadError;
      }

      console.log("New img url is :", filePath);
      await getUploadeImgUrl(filePath);
    } catch (error) {
      alert("Error uploading user Img!");
      console.log("Upload error : ", JSON.stringify(error));
    } finally {
      setUploading(false);
    }
  };

  const getUploadeImgUrl = async (filePath) => {
    console.log("Getting url for ", filePath);
    const { data, error } = await supabase.storage
      .from("users")
      .getPublicUrl(filePath);

    if (error) {
      console.log("Error getting img url : ", error);
      throw new Error(error);
    }
    imgUrl.current.value = data.publicUrl;
    setFileName(data.publicUrl);

    console.log("Got following URL : ", data.publicUrl);
  };

  return (
    <form className="w-full" action={createUser}>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Status de l'utilisateur
        </label>
        <select
          className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
          name="active"
          defaultValue={true}
        >
          <option value={true}>Active</option>
          <option value={false}>Inactif</option>
        </select>
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Role de l'utilisateur
        </label>
        <select
          className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
          name="role"
          defaultValue={"admin"}
        >
          <option value={"super_admin"}>Super Admin</option>
          <option value={"admin"}>Admin</option>
          <option value={"manager"}>Superviseur</option>
          <option value={"employee"}>Collabrateur</option>
        </select>
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Prénom
        </label>
        <input
          type="text"
          name="first_name"
          placeholder="Prénom"
          className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
        />
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">Nom</label>
        <input
          type="text"
          name="last_name"
          placeholder="Nom"
          className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
        />
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Adresse Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="John@doe.com"
          className={
            "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          }
        />
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Numéro de téléphone
        </label>
        <input
          type="phone"
          name="phone"
          placeholder="06 XX XX XX XX"
          onChange={(e) =>  setPhone(e?.target?.value)}
          className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
        />
        {phone && phone?.length != 10 && (
          <div className="w-full my-2 text-amber-600 font-semibold text-sm">
            Veuillez saisir un numéro de téléphone valide (10 caractères).
          </div>
          )}

      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Ville
        </label>
        <input
          type="Text"
          name="city"
          placeholder="E.g. Casablanca"
          className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
        />
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Mot de passe
        </label>
        <input
          type="Text"
          name="password"
          placeholder="........"
          className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          onChange={(e) =>
            e?.target?.value?.length < 6
              ? setPassError(
                  "Veuillez renter un mot passLa longueur du mot de passe doit être de 6 caractères ou plus"
                )
              : setPassError(false)
          }
        />
        {passError && (
          <div className="w-full my-2 text-amber-600 font-semibold text-sm">
            {passError}
          </div>
        )}
      </div>
      <div className="divider  border-blue-950 min-w-full col-span-2"></div>
      <div className="form-control w-full col-span-2 place-content-center max-w-xl">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Image de l'utilisateur
        </label>
        {!uploading ? (
          <input
            type="file"
            name="user_img"
            className="file-input file-input-primary file-input-bordered w-full bg-white "
            onChange={uploadImg}
          />
        ) : (
          <span className="loading loading-spinner loading-lg"></span>
        )}

        {imgUrl?.current?.value && imgUrl?.current?.value != "" && (
          <div
            className={`w-full rounded-lg h-56 my-5`}
            style={{
              backgroundImage: `url(${imgUrl.current.value})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        )}

        <input
          type="text"
          ref={imgUrl}
          name="img_url"
          className="w-full bg-white hidden"
          onChange={() => console.log(imgUrl.current.value)}
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center my-5">
        <button className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer" disabled={passError || phone?.length != 10}>
          Créer l'utilisateur
        </button>
      </div>
    </form>
  );
};

export default CreateUser;
