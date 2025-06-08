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

export const updateCustomer = async (id: string, customer: FormData) => {
  const res = await api.put(`/customers/${id}`, customer);
  return res.data;
};

export const getCustomerById = async (id: string) => {
  const res = await api.get(`/customers/${id}`);
  return res.data;
};
