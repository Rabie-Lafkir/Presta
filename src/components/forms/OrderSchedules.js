"use client";
import dayjs from "dayjs";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

const weekDays = {
  monday: "Lundi",
  tuesday: "Mardi",
  wednesday: " Mercredi",
  thursday: "Jeudi",
  friday: "Vendredi",
  saturday: "Samedi",
};

const OrderSchedules = ({ schedules, duration }) => {
  const router = useRouter();
  const [nuSchedules, setNuSchedules] = useState(schedules);
  const [loading, setLoading] = useState(false);
  const service_duration = duration ?? 45;
  const timeOpts = Array.from({
    length: (11 * 60) / (service_duration + 15),
  }).map((time, i) =>
    dayjs(new Date())
      .hour(8)
      .minute(0)
      .add(i * (duration + 15), "minute")
      .format("HH:mm")
  );

  const setSchedules = async () => {
    setLoading(true);
    const parsedSchedules = nuSchedules?.map((schedule) => ({
      ...schedule,
      active: true,
    }));
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("order_schedules")
      .delete()
      .eq("order_id", schedules?.[0]?.order_id);

    if (deleteError) {
      console.log(
        `Error while deleting orders : ${JSON.stringify(deleteError)}`
      );
      throw new Error(
        `Error while deleting orders : ${JSON.stringify(deleteError)}`
      );
    }
    const { error } = await supabase
      .from("order_schedules")
      .insert(parsedSchedules);

    if (error) {
      console.log(`Error while creating orders : ${JSON.stringify(error)}`);
      throw new Error(`Error while creating orders : ${JSON.stringify(error)}`);
    }
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="w-full">
      {schedules && schedules?.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-fit my-5 p-8">
          <div className="text-lg text-amber-600 font-semibold mb-5">
            Planning à confirmer
          </div>
          {schedules?.map((schedule, i) => (
            <div
              className="w-full grid grid-cols-2 items-center gap-x-2 max-w-sm mb-4"
              key={i}
            >
              <div className="text-blue-950 font-semibold">
                {weekDays?.[schedule?.day]}
              </div>
              <select
                className="select w-full max-w-xs  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
                defaultValue={schedules
                  ?.filter((el) => el?.day == schedule?.day)?.[0]
                  ?.time?.replace(":00", "", 1)}
                onChange={(e) => {
                  setNuSchedules([
                    ...nuSchedules?.filter((el) => el?.day != schedule?.day),
                    { ...schedule, time: `${e?.target?.value}:00` },
                  ]);
                  console.log("Changed to : ", [
                    ...nuSchedules?.filter((el) => el?.day != schedule?.day),
                    { ...schedule, time: `${e?.target?.value}:00` },
                  ]);
                }}
              >
                {timeOpts?.map((time, i) => (
                  <option value={time} key={i}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <div className="w-full flex items-center gap-x-2 max-w-sm mb-4">
            <button
              className="py-2 px-4 rounded font-semibold bg-amber-400 shadow hover:bg-amber-600 hover:shadow-lg text-white flex items-center"
              onClick={() => setSchedules()}
            >
              {loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Confirmer"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSchedules;
