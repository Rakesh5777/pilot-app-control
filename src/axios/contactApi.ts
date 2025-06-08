import api from "@/axios/api";
import type { ContactFormData, Contact } from "@/pages/Contacts/AddContact";

export const getContacts = async (customerId?: string): Promise<Contact[]> => {
  const url = customerId ? `/contacts?customerId=${customerId}` : "/contacts";
  const res = await api.get(url);
  return res.data;
};

export const addContact = async (
  contact: ContactFormData
): Promise<Contact> => {
  const res = await api.post("/contacts", contact);
  return res.data;
};

export const getContactById = async (id: string): Promise<Contact> => {
  const res = await api.get(`/contacts/${id}`);
  return res.data;
};

export const updateContact = async (
  id: string,
  contact: ContactFormData
): Promise<Contact> => {
  const res = await api.put(`/contacts/${id}`, contact);
  return res.data;
};