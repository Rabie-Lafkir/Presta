"use client";

import { useState, useRef, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { createClient } from "@/lib/supabase-client";
import { createService } from "@/actions/serviceActions";
import Select from "react-select";

const supabase = createClient();
//Img upload

const CreateService = () => {
  const [pCount, setPCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState();
  const [assetList, setAssetList] = useState();
  const imgUrl = useRef(null);

  const uploadImg = async (event) => {
    try {
      let imgUuid = uuid();
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }
      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${imgUuid}-${Math.random()}.${fileExt}`;

      let { error: uploadError } = await supabase.storage
        .from("services")
        .upload(filePath, file);

      if (uploadError) {
        console.log("Got an upload error");
        throw uploadError;
      }

      console.log("New img url is :", filePath);
      await getUploadeImgUrl(filePath);
    } catch (error) {
      alert("Error uploading service Img!");
      console.log("Upload error : ", JSON.stringify(error));
    } finally {
      setUploading(false);
    }
  };

  const getUploadeImgUrl = async (filePath) => {
    console.log("Getting url for ", filePath);
    const { data, error } = await supabase.storage
      .from("services")
      .getPublicUrl(filePath);

    if (error) {
      console.log("Error getting img url : ", error);
      throw new Error(error);
    }
    imgUrl.current.value = data.publicUrl;
    setFileName(data.publicUrl);

    console.log("Got following URL : ", data.publicUrl);
  };

  const getAssets = async () => {
    const { data, error } = await supabase.from("asset_types").select("*");

    if (error) {
      console.log("Error while fetching asset type", JSON.stringify(error));
      throw new Error(
        `Error while fetching asset type : ${JSON.stringify(error)}`
      );
    }

    setAssetList(
      data
        ? data.map((el) => ({
            value: el.id,
            label: el.name,
          }))
        : []
    );

    console.log("Found following users : ", assetList);
    return data;
  };

  useEffect(() => {
    getAssets();
  }, []);

  return (
    <form className="w-full" action={createService}>
      <div className="w-full flex flex-col items-start col-span-2 mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Type de service
        </label>
        <select
          className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400 mb-5"
          name="is_subscription"
        >
          <option value={true}>Abonnement</option>
          <option value={false}>Ponctuel</option>
        </select>
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Service gratuit ?
        </label>
        <select
          className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
          name="is_free"
        >
          <option value={false}>Non</option>
          <option value={true}>Oui</option>
        </select>
      </div>
      <div className="w-full flex flex-col items-start col-span-2 mb-5">
        <div className="form-control w-full ">
          <label className="text-sm font-semibold text-blue-600 mb-2">
            Image du service
          </label>
          {!uploading ? (
            <input
              type="file"
              name="service_img"
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
            name="service_img_url"
            className="w-full bg-white hidden"
            onChange={() => console.log(imgUrl.current.value)}
          />
        </div>
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Nom du service
        </label>
        <input
          type="text"
          name="name"
          placeholder="Entrez le nom de service"
          className={
            "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          }
        />
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Description du service
        </label>
        <textarea
          type="text"
          name="description"
          placeholder="Quelques lignes pour décrire le service"
          className={
            "textarea textarea-bordered textarea-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          }
        />
      </div>
      <label className="text-sm font-semibold text-blue-600 mb-5">
        Critère de facturation
      </label>
      <Select
      
        
        placeholder="Choisissez un Critère"
      
        classNames={{
          control: (state) =>
            "select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2 my-5",
          option: (state) => "text-blue-600 px-5 py-2 bg-white",
          menu: (state) => "shadow",
          noOptionsMessage: (state) => "text-blue-600 px-5 py-2 bg-white",
          placeholder: (state) => "line-clamp-1",
          container: (state) => "w-full",
        }}
      />

      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Durée moyenne (en minutes)
        </label>
        <input
          type="number"
          name="duration"
          placeholder="45"
          className={
            "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          }
        />
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Prix minimum(en Dirhams)
        </label>
        <input
          type="number"
          name="min_price"
          placeholder="0"
          className={
            "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          }
        />
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Prix maximum(en Dirhams)
        </label>
        <input
          type="number"
          name="max_price"
          placeholder="0"
          className={
            "input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400"
          }
        />
      </div>
      <div className="w-full flex flex-col items-start mb-5">
        <label className="text-sm font-semibold text-blue-600 mb-2">
          Nécessite un abonnement
        </label>
        <select
          className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
          name="check_active"
        >
          <option value={false}>Oui</option>
          <option value={true}>Non</option>
        </select>
      </div>

      <div className="w-full flex flex-col items-center justify-center mb-5">
        <button className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer">
          Créer le service
        </button>
      </div>
    </form>
  );
};

export default CreateService;
