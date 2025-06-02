import api from "@/axios/api";
import type { AFRDataType, AFRData } from "@/pages/AFRData/AddAFRData";

export const getAFRData = async (): Promise<AFRData[]> => {
  const res = await api.get("/afrdata");
  return res.data;
};

export const addAFRData = async (
  contact: AFRDataType
): Promise<AFRData> => {
  const res = await api.post("/afrdata", contact);
  return res.data;
};