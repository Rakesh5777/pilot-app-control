import api from "@/axios/api";
import type { FormData } from "@/pages/Customers/AddCustomers";

export const getCustomers = async () => {
  const res = await api.get("/customers");
  return res.data;
};

export const addCustomer = async (customer: FormData) => {
  const res = await api.post("/customers", customer);
  return res.data;
};
