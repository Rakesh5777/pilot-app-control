import api from "@/axios/api";
import type { ChecklistFormData } from "@/pages/Checklist/AddChecklist";

export const getChecklists = async (
  customerId?: string
): Promise<ChecklistFormData[]> => {
  const url = customerId
    ? `/checklists?customerId=${customerId}`
    : "/checklists";
  const res = await api.get(url);
  return res.data;
};

export const addChecklist = async (
  checklist: ChecklistFormData
): Promise<ChecklistFormData> => {
  const res = await api.post("/checklists", checklist);
  return res.data;
};

export const getChecklistById = async (
  id: string
): Promise<ChecklistFormData> => {
  const res = await api.get(`/checklists/${id}`);
  return res.data;
};

export const updateChecklistById = async (
  id: string,
  checklist: ChecklistFormData
): Promise<ChecklistFormData> => {
  const res = await api.put(`/checklists/${id}`, checklist);
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
