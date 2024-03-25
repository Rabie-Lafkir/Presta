"use client";

import { useState, useRef, useEffect } from "react";
export default function SearchDropdown({
  placeholder = "Veuillez choisir une valeur ...",
  label,
  name,
  values,
  defaultValues,
  defaultInputValue,
  disableInput = false,
  inputFn = () => {},
}) {
  const mainInput = useRef();
  const [searchValue, setSearchValue] = useState(defaultInputValue || "");
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    mainInput.current.value = defaultInputValue || "";
    setShowOptions(false);
  }, [defaultInputValue]);

  const updateValue = ({ value, hide }) => {
    setSearchValue(value);
    mainInput.current.value = value;
    setShowOptions(!hide);
    inputFn(value);
  };
  return (
    <div className="w-full flex flex-col items-start col-span-2 mb-5 relative">
      <label className="text-sm font-semibold text-blue-600 mb-2">
        {label}
      </label>
      <input
        className="select w-full bg-white max-w-md disabled:bg-white disabled:border-blue-600 disabled:text-blue-950 text-blue-950 border-blue-600 placeholder:text-gray-500 peer focus:border-2"
        name={name ?? "active"}
        placeholder={placeholder}
        defaultValue={defaultInputValue}
        onChange={(e) => updateValue({ value: e.target.value, hide: false })}
        onClick={() => setShowOptions(!showOptions)}
        ref={mainInput}
        disabled={disableInput}
        autoComplete="off"
      ></input>
      {showOptions == true && (
        <div
          className={`shadow rounded-b-lg w-full divide-y divide-blue-100 max-w-md`}
        >
          {searchValue == ""
            ? defaultValues &&
              defaultValues.splice(0, 5).map((value) => (
                <div
                  className="z-10 w-full py-2 px-4 text-blue-950 h-fit cursor-pointer  hover:bg-blue-600 hover:text-white"
                  key={value}
                  value={value}
                  onClick={(e) =>
                    updateValue({
                      value: e.target.getAttribute("value"),
                      hide: true,
                    })
                  }
                >
                  {value}
                </div>
              ))
            : values
                .filter((el) =>
                  el?.toLowerCase()?.includes(searchValue.toLocaleLowerCase())
                )
                .splice(0, 5)
                .map((value) => (
                  <div
                    className="w-full py-2 px-4 text-blue-950 h-fit max-w-md"
                    key={value}
                    value={value}
                    onClick={(e) =>
                      updateValue({
                        value: e.target.getAttribute("value"),
                        hide: true,
                      })
                    }
                  >
                    {value}
                  </div>
                ))}
        </div>
      )}
    </div>
  );
}
