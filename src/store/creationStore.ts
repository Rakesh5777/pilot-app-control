import { create } from 'zustand';
import type { FormData as CustomerFormData } from '@/pages/Customers/AddCustomers';
import type { ContactFormData } from '@/pages/Contacts/AddContact';

interface CreationState {
  customerData: Partial<CustomerFormData> | null;
  contactDataList: ContactFormData[];
  setCustomerData: (data: Partial<CustomerFormData>) => void;
  addContactData: (data: ContactFormData) => void;
  updateContactData: (index: number, data: ContactFormData) => void;
  removeContactData: (index: number) => void;
  resetContactDataList: () => void;
  resetStore: () => void;
}

export const useCreationStore = create<CreationState>((set) => ({
  customerData: null,
  contactDataList: [],
  setCustomerData: (data) => set({ customerData: data }),
  addContactData: (data) => set((state) => ({ contactDataList: [...state.contactDataList, data] })),
  updateContactData: (index, data) => set((state) => ({
    contactDataList: state.contactDataList.map((contact, i) => i === index ? data : contact),
  })),
  removeContactData: (index) => set((state) => ({
    contactDataList: state.contactDataList.filter((_, i) => i !== index),
  })),
  resetContactDataList: () => set({ contactDataList: [] }),
  resetStore: () => set({ customerData: null, contactDataList: [] }),
}));