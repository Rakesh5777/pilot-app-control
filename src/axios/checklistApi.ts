import api from "@/axios/api";
import type {
  ChecklistFormData,
  Checklist,
} from "@/pages/Checklist/AddChecklist";

export const getChecklists = async (
  customerId?: string
): Promise<Checklist[]> => {
  const url = customerId
    ? `/checklists?customerId=${customerId}`
    : "/checklists";
  const res = await api.get(url);
  return res.data;
};

export const addChecklist = async (
  checklist: ChecklistFormData
): Promise<Checklist> => {
  const res = await api.post("/checklists", checklist);
  return res.data;
};

export const getChecklistQuestions = async () => {
  const res = await api.get("/checklistQuestions");
  return res.data;
};

export const addChecklistQuestion = async (question: {
  id: string;
  question: string;
}) => {
  const res = await api.post("/checklistQuestions", question);
  return res.data;
};
