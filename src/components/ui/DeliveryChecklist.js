"use client";
import ChecklistQuestion from "./ChecklistQuestion";
export default function DeliveryChecklist({ checklist, delivery_id }) {
  return (
    <div className="w-full flex flex-col gap-y-6">
      {checklist?.checklist_questions?.map((question, i) => (
        <ChecklistQuestion
          question={question}
          key={i}
          delivery_id={delivery_id}
        />
      ))}
    </div>
  );
}
