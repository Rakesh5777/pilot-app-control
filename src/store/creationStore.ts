import { create } from 'zustand';
import type { FormData as CustomerFormData } from '@/pages/Customers/AddCustomers';
import type { ContactFormData } from '@/pages/Contacts/AddContact';
import type { ChecklistFormData } from "@/pages/Checklist/AddChecklist";

interface CreationState {
  customerData: Partial<CustomerFormData> | null;
  contactDataList: ContactFormData[];
  checklistData: Partial<ChecklistFormData> | null; // Added checklistData
  setCustomerData: (data: Partial<CustomerFormData>) => void;
  addContactData: (data: ContactFormData) => void;
  updateContactData: (index: number, data: ContactFormData) => void;
  removeContactData: (index: number) => void;
  resetContactDataList: () => void;
  setChecklistData: (data: Partial<ChecklistFormData>) => void; // Added setChecklistData
  resetChecklistData: () => void; // Added resetChecklistData
  resetStore: () => void;
}

export const useCreationStore = create<CreationState>((set) => ({
  customerData: null,
  contactDataList: [],
  checklistData: null, // Initialized checklistData
  setCustomerData: (data) => set({ customerData: data }),
  addContactData: (data) =>
    set((state) => ({ contactDataList: [...state.contactDataList, data] })),
  updateContactData: (index, data) =>
    set((state) => ({
      contactDataList: state.contactDataList.map((contact, i) =>
        i === index ? data : contact
      ),
    })),
  removeContactData: (index) =>
    set((state) => ({
      contactDataList: state.contactDataList.filter((_, i) => i !== index),
    })),
  resetContactDataList: () => set({ contactDataList: [] }),
  setChecklistData: (data) => set({ checklistData: data }), // Implemented setChecklistData
  resetChecklistData: () => set({ checklistData: null }), // Implemented resetChecklistData
  resetStore: () =>
    set({ customerData: null, contactDataList: [], checklistData: null }), // Added checklistData to resetStore
}));