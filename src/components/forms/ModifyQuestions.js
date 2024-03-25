/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useRef } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { createClient } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import Select from "react-select";

const ModifyQuestions = ({ checklist_id, checklistQuestions }) => {
  const supabase = createClient();
  const [text, setText] = useState();
  const [order, setOrder] = useState();
  const [type, setType] = useState();
  const textRef = useRef();
  const [questions, setQuestions] = useState([...checklistQuestions]);
  const [removed, setRemoved] = useState([]);
  const router = useRouter();

  const typeMatch = {
    bool: "Oui/Non",
    number: "Chiffre",
    rating: "Évaluation",
    text: "Texte",
  };

  const updateChecklistOptions = async () => {
    console.log("Got following questions", questions);
    console.log("Got following Checklist ID :", checklist_id);

    const questionsRequest = [];
    const removedRequest = [];

    removed.map((question, i) =>
      removedRequest.push({
        text: question?.text,
        order: question?.order,
        type: question?.type,
        checklist: checklist_id,
        active: true,
      })
    );
    questions.map((question, i) =>
      questionsRequest.push({
        text: question?.text,
        type: question?.type,
        order: question?.order,
        checklist: checklist_id,
        active: true,
      })
    );

    console.log("Removed requests", removedRequest);
    console.log("Added requests:", questionsRequest);

    console.log("About to start update !", questionsRequest, removedRequest);
    const { error: removeError } = await supabase
      .from("checklist_questions")
      .delete()
      .eq("checklist", checklist_id);

    if (removeError) {
      console.log(
        "Error while removing questions from delivery :",
        JSON.stringify(removeError)
      );
      throw new Error(
        `Error while removing questions from delivery  : ${JSON.stringify(
          removeError
        )}`
      );
    }

    const { error: AddError } = await supabase
      .from("checklist_questions")
      .insert(questionsRequest, {
        onConflict: "checklist_id,option_id",
        ignoreDuplicates: false,
      });

    if (AddError) {
      console.log(
        "Error while adding question to  checklist :",
        JSON.stringify(AddError)
      );
      throw new Error(
        `Error while adding question to  checklist : ${JSON.stringify(
          AddError
        )}`
      );
    }

    console.log("Update is done");

    router.push(`/dashboard/checklists/${checklist_id}`);
  };

  console.log("Checklist id is : ", checklist_id);

  return (
    <div className="w-full">
      <div className="w-full flex items-center gap-2 my-5">
        <input
          name="checklist_id"
          value={checklist_id}
          className="hidden"
          readOnly
        />

        <div className="w-full flex flex-col gap-y-2 py-5 border-b border-blue-600">
          <div className="w-full flex flex-col items-start col-span-2 mb-5">
            <label className="text-sm font-semibold text-blue-600 mb-2">
              Rentez une question
            </label>
            <input
              type="text"
              placeholder="Rentez une question"
              autoComplete="off"
              className="input border-blue-100 w-full bg-white text-blue-600"
              name="text"
              ref={textRef}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
          </div>
          <div className="w-full flex flex-col items-start col-span-2 mb-5">
            <label className="text-sm font-semibold text-blue-600 mb-2">
              Choisissez le type de la réponse
            </label>
            <select
              className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
              name="type"
              onChange={(e) => setType(e.target.value)}
            >
              <option value={"text"}>Texte</option>
              <option value={"bool"}>Oui/Non</option>
              <option value={"number"}>Chiffre</option>
              <option value={"rating"}>Évaluation</option>
            </select>
          </div>
          <div className="w-full flex flex-col items-start col-span-2 mb-5">
            <label className="text-sm font-semibold text-blue-600 mb-2">
              Choisissez l'ordre de la question
            </label>
            <select
              className="select w-full max-w-md  text-blue-950 border-blue-600 bg-white disabled:bg-white disabled:placeholder-blue-600 disabled:text-blue-600 disabled:border-blue-400"
              name="order"
              onChange={(e) => setOrder(e.target.value)}
            >
              {questions?.map((_, i) => (
                <option value={i + 1} key={i}>
                  {i + 1}
                </option>
              ))}
              <option value={questions?.length + 1}>
                {questions?.length + 1}
              </option>
            </select>
          </div>
          <button
            className="flex items-center justify-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:shadow-none"
            onClick={() => {
              console.log("About to add", questions);
              setQuestions([
                ...questions,
                { type, text, id: questions?.length + 1, order },
              ]);
              setText("");
              textRef.current.value = "";
            }}
          >
            Ajouter
          </button>
        </div>
      </div>

      {questions.length < 1 ? (
        <div className="w-full h-12 text-purple-600 flex items-center justify-center text-center mb-5">
          Vous n'avez toujours pas ajouté de questions
        </div>
      ) : (
        questions.map((question, i) => (
          <div key={i} className="w-full flex flex-col mb-2">
            <input
              name="text"
              value={question?.text}
              className="hidden"
              readOnly
            />
            <div className="flex items-center mb-5 p-4 justify-between border borde-blue-600 rounded-lg shadow">
              <div className="w-full flex flex-col gap-y-2">
                <div className="w-full flex items-center gap-x-4">
                  <div className="text-blue-600 font-semibold">
                    {question?.text}
                  </div>
                  <div className="badge bg-amber-500 text-white font-semibold">
                    {question?.order}
                  </div>
                </div>
                <div className="text-gray-300 text-sm font-semibold grow">
                  {typeMatch?.[question?.type]}
                </div>
              </div>
              <AiFillMinusCircle
                size={32}
                className="text-amber-400 hover:text-amber-600 drop-shadow"
                onClick={() => {
                  setRemoved([
                    ...removed,
                    questions.filter((el) => question?.id == question?.id)[0],
                  ]);
                  setQuestions(
                    questions.filter((el) => el?.id != question?.id)
                  );
                  console.log("Got following questions : ", questions);
                }}
              />
            </div>
          </div>
        ))
      )}

      {removed.map((question, i) => (
        <input
          name="removed"
          value={question?.text}
          className="hidden"
          key={i}
          readOnly
        />
      ))}
      <div className="w-full flex flex-col items-center justify-center mb-5">
        <button
          className="flex items-center bg-emerald-500 rounded shadow px-8 py-4 text-white font-semibold hover:bg-emerald-600 hover:shadow-lg cursor-pointer disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:shadow-none"
          disabled={questions?.length == 0}
          onClick={() => updateChecklistOptions()}
        >
          Mettre à jour les questions
        </button>
      </div>
    </div>
  );
};

export default ModifyQuestions;
