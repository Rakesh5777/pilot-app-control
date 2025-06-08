import api from "@/axios/api";
import type { AFRDataType, AFRData } from "@/pages/AFRData/AddAFRData";

export const getAFRData = async (): Promise<AFRData[]> => {
  const res = await api.get("/afrdata");
  return res.data;
};

export const addAFRData = async (afrData: AFRDataType): Promise<AFRData> => {
  const res = await api.post("/afrdata", afrData);
  return res.data;
};

export const getAFRDataById = async (id: string): Promise<AFRData> => {
  const res = await api.get(`/afrdata/${id}`);
  return res.data;
};

export const updateAFRData = async (
  id: string,
  afrData: AFRDataType
): Promise<AFRData> => {
  const res = await api.put(`/afrdata/${id}`, afrData);
  return res.data;
};