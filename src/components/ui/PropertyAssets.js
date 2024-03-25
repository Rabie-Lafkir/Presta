/* eslint-disable react/no-unescaped-entities */
"use client";

// imports
import { createClient } from "@/lib/supabase-client";
import { BsPlus } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import { useState } from "react";
import { updatePriceList } from "@/actions/priceActions";
import AssetForm from "@/components/forms/AssetForm";

//Setting up supabase
const supabase = createClient();

const PropertyAssets = ({ assets = [], property_id }) => {
  return (
    <div className="w-full flex flex-col gap-y-2 bg-white rounded-lg shadow-lg p-10">
      <div className="w-full font-semibold text-2xl text-emerald-600 mb-5">
        Gérer les actifs
      </div>
      {assets?.length == 0 && (
        <div className="w-full font-semibold text-purple-500 text-center">
          Ce bien n'a toujours aucun actif
        </div>
      )}
      {assets?.length > 0 &&
        assets.map((asset, i) => <AssetForm asset={asset} key={i} />)}
    </div>
  );
};

export default PropertyAssets;
