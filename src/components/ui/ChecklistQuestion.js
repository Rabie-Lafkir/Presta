/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { useAuth } from "../providers/SupabaseAuthProvider";
import { useRouter } from "next/navigation";

export default function ChecklistQuestion({ question, delivery_id }) {
  console.log("question?.answers : ", question);
  const [opened, setOpened] = useState();
  const router = useRouter();
  const [newAnswer, setNewAnswer] = useState();
  console.log("Asnwer is ", newAnswer);

  const { user } = useAuth();

  console.log("Got user : ", user);

  const supabase = createClient();

  const addAnswer = async (type, id) => {
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("id", delivery_id)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.log(
        "Error while fetching delivery in answer : ",
        JSON.stringify(error)
      );
      throw new Error(
        `Error while fetching delivery in answer : ${JSON.stringify(error)}`
      );
    }

    const req = {
      question_id: id,
      property_id: data?.property_id,
      user_id: user?.id,
      delivery_id: data?.id,
    };

    if (type == "bool") {
      req.bool = newAnswer;
    }
    if (type == "rating") {
      req.rating = newAnswer;
    }
    if (type == "number" || type == "text") {
      req.text = newAnswer;
    }

    const { error: answerError } = await supabase
      .from("checklist_answers")
      .insert(req);

    if (answerError) {
      console.log(
        "Error while creating new answer: ",
        JSON.stringify(answerError)
      );
      throw new Error(
        `Error while creating new answer : ${JSON.stringify(answerError)}`
      );
    }

    console.log("Req is : ", req);

    console.log("Delivery data in answer is : ", JSON.stringify(data));
    router?.refresh();
  };
  return (
    <div className="collapse bg-white">
      <input
        type="radio"
        name="my-accordion-1"
        onChange={() => setOpened(!opened)}
      />
      <div className="collapse-title text-xl font-medium text-blue-600 bg-blue-100">
        {question?.text}
      </div>
      <div className="collapse-content py-2">
        {question?.checklist_answers?.length == 0 && (
          <div className="w-full flex items-center justify-center py-4 text-blue-600">
            Cette question n'a toujours pas de réponse
          </div>
        )}
        {question?.checklist_answers?.length > 0 &&
          question?.checklist_answers?.map((answer, i) => (
            <div
              className="w-full flex items-center justify-start gap-x-4 my-4"
              key={i}
            >
              <div className="w-fit flex items-center gap-x-2">
                <div className="text-sm text-gray-500">Utilisateur</div>
                <div className="text-base text-blue-600 font-semibold">
                  {answer?.users?.username}
                </div>
              </div>
              <div className="w-fit flex items-center gap-x-2">
                <div className="text-sm text-gray-500">Réponse</div>
                {question?.type == "bool" && (
                  <div className="text-base text-blue-600 font-semibold">
                    {answer?.bool ? "Oui" : "Non"}
                  </div>
                )}
                {question?.type == "rating" && (
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
                {(question?.type == "number" || question?.type == "text") && (
                  <div className="rating rating-sm">
                    <div className="text-base text-blue-600 font-semibold">
                      {answer?.text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

        <div className="w-full flex flex-col gap-y-2 my-4 py-4 border-t border-blue-950 border-dotted">
          <div className="text-blue-600 font-semibold mb-5">
            Ajoutez une response
          </div>

          <div className="w-full flex flex-col gap-y-2">
            <div className="text-amber-600 font-semibold">{question?.text}</div>
            {question?.type == "bool" && (
              <div className="flex items-center gap-x-2 my-2">
                <div className="text-sm text-gray-500">Non</div>
                <input
                  type="checkbox"
                  className="toggle"
                  checked={newAnswer || false}
                  onChange={() => console.log("Checked")}
                  onClick={(e) => {
                    setNewAnswer(e?.target?.checked);
                    console.log(e?.target?.checked);
                  }}
                />
                <div className="text-sm text-gray-500">Oui</div>
              </div>
            )}
            {question?.type == "rating" && (
              <div className="rating rating-sm my-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <input
                    type="radio"
                    name={`rating-${i}`}
                    className="mask mask-star-2 bg-orange-400"
                    key={i}
                    checked={parseInt(i) == parseInt(newAnswer - 1)}
                    onChange={() => console.log("Checked")}
                    onClick={() => {
                      setNewAnswer(i + 1);
                      console.log(i + 1);
                    }}
                  />
                ))}
              </div>
            )}
            {(question?.type == "number" || question?.type == "text") && (
              <div className="flex items-center gap-x-2 my-2">
                <input
                  type="text"
                  className="input input-bordered input-primary w-full text-blue-950 bg-white disabled:bg-white disabled:placeholder-gray-500 disabled:text-gray-500 disabled:border-blue-400 max-w-md"
                  onChange={(e) => {
                    setNewAnswer(e?.target?.value);
                    console.log(e?.target?.value);
                  }}
                />
              </div>
            )}
            <button
              className="py-2 px-4 bg-blue-600 text-white font-semibold rounded shadow shadow/blue-600/25 disabled:bg-blue-300 disabled:cursor-not-allowed max-w-xs"
              disabled={!newAnswer}
              onClick={() => addAnswer(question?.type, question?.id)}
            >
              Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
