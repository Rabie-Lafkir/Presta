"use client";
import { useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { useRouter, useSearchParams } from "next/navigation";

export const SearchClients = ({ defaultValue }) => {
  const searchRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initalValue = searchParams.get("keyword");

  console.log("Got search init value : ", initalValue);

  return (
    <div className="w-fit flex items-center gap-x-2">
      <div className="form-control w-fit">
        <div className="input-group">
          <input
            type="text"
            name="search"
            placeholder="Recherche par nom, prénom, téléphone ou email ..."
            className="input bg-white border-blue-700 text-blue-700"
            defaultValue={defaultValue}
            ref={searchRef}
            onKeyUp={(e) => {
              (e.key === "Enter" || e.keyCode === 13) &&
                searchRef?.current?.value != "" &&
                router.replace(
                  `/dashboard/clients/?keyword=${searchRef?.current?.value
                    .toString()
                    .replaceAll("+", "")}`
                );
            }}
          />
          <button
            className="btn btn-square bg-blue-700"
            onClick={() =>
              searchRef?.current?.value != "" &&
              router.replace(
                `/dashboard/clients/?keyword=${searchRef?.current?.value}`
              )
            }
          >
            <FiSearch size={18} color="white" />
          </button>
        </div>
      </div>
      {initalValue && (
        <button
          className="btn btn-square bg-amber-400 hover:bg-amber-600 text-white"
          onClick={() => {
            searchRef.current.value = "";
            defaultValue = "";
            router.replace(`/dashboard/clients/`);
          }}
        >
          <GrClose size={18} color="white" />
        </button>
      )}
    </div>
  );
};
