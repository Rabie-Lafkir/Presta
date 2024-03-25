/* eslint-disable react/no-unescaped-entities */
import { createClient } from "@/lib/supabase-server";
import { ChecklistFilter } from "@/components/forms/ChecklistFilter";
import Drawer from "@/components/ui/Drawer";
import CreateChecklist from "@/components/forms/CreateChecklist";
import Link from "next/link";
import { BsCircleFill } from "react-icons/bs";
import { formatProper } from "@/lib/utils";

const getChecklists = async (params) => {
  const supabase = createClient();


  let query = supabase
  .from("checklists")
  .select(
    "*, services!inner(*), checklist_questions(*, checklist_answers(*))"
  )
  .order("created_at", { ascending: false });

  if(params?.service){
    query = query.eq(
      "services.id",
      params?.service
    )
  }
  const { data, error } = await query

  console.log("Got following checklists : ", JSON.stringify(data));

  if (error) {
    throw new Error(
      `There was an error while fetching checklists : ${JSON.stringify(error)}`
    );
  }

  return data;
};

export default async function Checklists({ searchParams }) {
  const checklists = await getChecklists(searchParams);
  return (
    <div className="w-full flex items-start gap-x-4">
      {searchParams?.create && (
        <Drawer title={"Créer une checklist"}>
          <CreateChecklist />
        </Drawer>
      )}
      <div className="w-1/4 flex flex-col items-center">
        <ChecklistFilter />
      </div>
      <div className="w-full">
        <div className="w-full mb-5 flex justify-end">
          <a
            className="px-6 py-4 bg-blue-600 rounded shadow-lg  text-white font-semibold"
            href="/dashboard/checklists?create=true"
          >
            Créer une Checklist
          </a>
        </div>
        {checklists.length == 0 || !checklists ? (
          <div className="w-full h-36 flex items-center justify-center text-purple-600 font-semibold bg-white rounded-lg shadow-lg">
            Presta Freedom n'a pas encore créé de checklist pour le service choisis
          </div>
        ) : (
          <div className="w-full bg-white rounded-lg shadow-lg h-fit p-4">
            <table className="table w-full">
              <thead>
                <tr className="border-t-0">
                  <th></th>
                  <th className="text-blue-600 font-semibold">
                    Nom de la Checklist
                  </th>
                  <th className="text-blue-600 font-semibold">
                    Nom du service
                  </th>
                  <th className="text-blue-600 font-semibold">
                    Nombre de questions
                  </th>
                  <th className="text-blue-600 font-semibold">
                    Nombre de réponses
                  </th>
                  <th className="text-blue-600 font-semibold">Crée le</th>
                  <th className="text-blue-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {checklists.map((checklist) => (
                  <tr
                    className="border-t-2 border-b-0 border-t-blue-200"
                    key={checklist?.id}
                  >
                    <td
                      className={`w-12 ${
                        checklist?.active ? "text-green-300" : "text-yellow-300"
                      }`}
                    >
                      <BsCircleFill />
                    </td>
                    <td className="text-blue-950 font-semibold">
                      {checklist?.name && formatProper(checklist?.name)}
                    </td>
                    <td className="text-blue-950 font-semibold">
                      {checklist?.services?.name &&
                        formatProper(checklist?.services?.name)}
                    </td>
                    <td className="text-blue-950 font-semibold">
                      {checklist?.checklist_questions?.length}
                    </td>
                    <td className="text-blue-950 font-semibold text-center">
                      {checklist?.checklist_questions
                        ?.map((el) => el?.checklist_answers?.length ?? 0)
                        ?.reduce((a, b) => a + b, 0)}
                    </td>
                    <td className="text-blue-950 font-semibold">
                      {new Intl.DateTimeFormat("fr-FR").format(
                        Date.parse(checklist?.created_at)
                      )}
                    </td>
                    <td className="flex items-center gap-x-2">
                      <Link
                        className="bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg"
                        href={`/dashboard/checklists/${checklist?.id}`}
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
