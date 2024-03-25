/* eslint-disable react/no-unescaped-entities */
import { createClient } from "@/lib/supabase-server";
import {
  BsFillPencilFill,
  BsBackspaceFill,
  BsFillGearFill,
} from "react-icons/bs";
import { MdChecklist } from "react-icons/md";
import Link from "next/link";
import ServiceCard from "@/components/ui/ServiceCards";

import ChecklistForm from "@/components/forms/ChecklistForm";
import { QuestionstFilter } from "@/components/forms/QuestionsFilter";
import { formatProper } from "@/lib/utils";
import Drawer from "@/components/ui/Drawer";
import ModifyQuestions from "@/components/forms/ModifyQuestions";

const getchecklistData = async (id) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("checklists")
    .select(
      "*, services(*), checklist_questions(*, checklist_answers(*, properties(*) , users(*)))"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.log("Error while fetching checklist : ", JSON.stringify(error));
  }

  // console.log("Checklist Data is ", JSON.stringify(data));
  return data;
};

export default async function ChecklistPage({ params, searchParams }) {
  const checklistData = await getchecklistData(params?.id);

  console.log("Got checklist data : ", checklistData);

  const answers = [];
  if (checklistData?.checklist_questions?.length > 0) {
    checklistData.checklist_questions.map((question) =>
      question?.checklist_answers.map((el) =>
        answers.push({
          questionId: question?.id,
          type: question?.type,
          question: question?.text,
          bool: el.bool,
          rating: el.rating,
          text: el?.text,
          file_url: el?.file_url,
          created_at: el?.created_at,
          service: el?.services?.name,
          user: el?.users?.username,
          property: el?.properties?.property_name,
        })
      )
    );
  }

  console.log("Answers are : ", answers);

  const modify = searchParams?.modify || false;
  const editQ = searchParams?.editQ || false;
  return (
    <div>
      {editQ && (
        <Drawer title={"Gestion des affectations"}>
          <ModifyQuestions
            checklist_id={checklistData?.id}
            checklistQuestions={checklistData?.checklist_questions.map(
              (el) => ({
                text: el.text,
                type: el.type,
                id: el.id,
                order: el.order,
              })
            )}
          />
        </Drawer>
      )}
      <div className="w-full flex items-start gap-x-4">
        <div className="w-1/4 flex flex-col items-center pt-16 gap-y-12">
          {checklistData?.services && (
            <ServiceCard service={checklistData?.services} />
          )}
          <QuestionstFilter
            questions={checklistData?.checklist_questions.map((question) => ({
              label: question?.text,
              value: question?.id,
            }))}
          />
        </div>
        <div className="w-full h-full">
          {!modify && (
            <div className={`flex justify-between`}>
              <div className="flex justify-end items-center h-16 mb-5 gap-x-2">
                <a
                  className="flex items-center bg-blue-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-blue-600 hover:shadow-lg cursor-pointer"
                  href={`/dashboard/services/${checklistData?.services?.id}`}
                >
                  <BsFillGearFill size={14} className="text-white mr-2" />
                  Gérer le service
                </a>
                <a
                  className="flex items-center bg-purple-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-pruple-600 hover:shadow-lg cursor-pointer"
                  href={`/dashboard/checklists/${checklistData?.id}?editQ=true`}
                >
                  <MdChecklist size={14} className="text-white mr-2" />
                  Gérer les questions
                </a>
              </div>
              <div>
                <a
                  className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
                  href={`/dashboard/checklists/${checklistData?.id}?modify=true`}
                >
                  <BsFillPencilFill size={14} className="text-white mr-2" />
                  Modifier
                </a>
              </div>
            </div>
          )}
          {modify && (
            <div className="flex justify-end items-center h-16 mb-5 gap-x-2">
              <div>
                <a
                  className="flex items-center bg-amber-400 rounded shadow px-4 py-2 text-white font-semibold hover:bg-amber-600 hover:shadow-lg cursor-pointer"
                  href={`/dashboard/deliveries/${checklistData?.id}`}
                >
                  <BsBackspaceFill size={14} className="text-white mr-2" />
                  Annuler
                </a>
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg shadow-lg flex flex-col items-center h-fit mb-5">
            <div
              className={`bg-blue-600 text-white rounded-full p-2 w-28 h-28 flex items-center justify-center -m-14 ${
                checklistData?.status == "done"
                  ? "border-4 border-green-400"
                  : checklistData?.status == "planned"
                  ? "border-4 border-amber-400"
                  : checklistData?.status == "canceled"
                  ? "border-4 border-red-400"
                  : "border-4 border-amber-700"
              }`}
            >
              <span className="text-3xl font-bold">{checklistData?.id}</span>
            </div>
            <div className={`text-4xl text-blue-600 font-semibold mt-16 mb-1`}>
              {`${checklistData?.name}`}
            </div>
            <div className={`text-xl text-purple-400 font-semibold mb-1`}>
              {checklistData?.services?.name}
            </div>
            <div className={`text-sm text-gray-500 font-semibold mb-5`}>
              {`Créé le ${new Intl.DateTimeFormat("fr-FR").format(
                Date.parse(checklistData?.created_at)
              )}`}
            </div>
            <ChecklistForm ChecklistData={checklistData} modify={modify} />
          </div>
          {answers.length == 0 || !answers ? (
            <div className="w-full h-36 flex items-center justify-center text-purple-600 font-semibold bg-white rounded-lg shadow-lg">
              Cette checklist n'a toujours pas de réponses
            </div>
          ) : (
            <div className="w-full bg-white rounded-lg shadow-lg h-fit p-4">
              <table className="table w-full">
                <thead>
                  <tr className="border-t-0">
                    <th className="text-blue-600 font-semibold">Question</th>
                    <th className="text-blue-600 font-semibold">Réponse</th>
                    <th className="text-blue-600 font-semibold">Bien</th>
                    <th className="text-blue-600 font-semibold">utilisateur</th>
                    <th className="text-blue-600 font-semibold">Crée le</th>
                  </tr>
                </thead>
                <tbody>
                  {answers.map((answer) => (
                    <tr
                      className="border-t-2 border-b-0 border-t-blue-200"
                      key={answer?.id}
                    >
                      <td className="text-blue-950 font-semibold">
                        {answer?.question && formatProper(answer?.question)}
                      </td>
                      <td className="text-blue-950 font-semibold">
                        {answer?.type == "bool" && (
                          <div className="text-base text-blue-600 font-semibold">
                            {answer?.bool ? "Oui" : "Non"}
                          </div>
                        )}
                        {answer?.type == "rating" && (
                          <div className="rating rating-sm">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <input
                                type="radio"
                                name="rating-6"
                                className="mask mask-star-2 bg-orange-400"
                                key={i}
                                checked={answer?.rating == i + 1}
                                readOnly
                              />
                            ))}
                          </div>
                        )}
                        {(answer?.type == "number" ||
                          answer?.type == "text") && (
                          <div className="rating rating-sm">
                            <div className="text-base text-blue-600 font-semibold">
                              {answer?.text}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="text-blue-950 font-semibold">
                        {answer?.property}
                      </td>
                      <td className="text-blue-950 font-semibold">
                        {answer?.user}
                      </td>
                      <td className="text-blue-950 font-semibold">
                        {new Intl.DateTimeFormat("fr-FR").format(
                          Date.parse(answer?.created_at)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
