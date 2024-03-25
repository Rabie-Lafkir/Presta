"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase-client";

const supabase = createClient();

const AssetForm = ({ asset }) => {
  const [checked, setChecked] = useState(asset?.active);
  const valueRef = useRef();
  const updateStatus = async () => {
    const { error } = await supabase
      .from("assets")
      .update({
        active: !checked,
      })
      .eq("id", asset?.id);
    setChecked(!checked);

    if (error) {
      console.log("Error while updating asset status : ", JSON.stringify(erro));
    }
  };

  const updateValue = async () => {
    const { error } = await supabase
      .from("assets")
      .update({
        value: valueRef?.current.value,
      })
      .eq("id", asset?.id);
    if (error) {
      console.log("Error while updating asset status : ", JSON.stringify(erro));
    }
  };

  return (
    <div className="w-full grid grid-cols-3 gap-2 items-center">
      <div className="text-blue-950 font-semibold">
        {asset?.asset_types.name}
      </div>
      <div className="w-full flex items-center gap-2">
        <input
          name="value"
          defaultValue={asset?.value}
          ref={valueRef}
          className="input max-w-xs text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
          onChange={() => updateValue()}
        />
        <div className="text-sm font-semibold text-blue-500">
          {asset?.asset_types.unit}
        </div>
      </div>
      <div className="flex items-center gap-4 w-full">
        <div className="text-blue-500 font-semibold w-fit">Actif ?</div>
        <input
          type="checkbox"
          className="toggle toggle-md toggle-primary [--tglbg:white] "
          checked={checked}
          onChange={() => updateStatus()}
        />
      </div>
    </div>
  );
};

export default AssetForm;
