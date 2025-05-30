import api from "./api";
import type { ChecklistFormData, Checklist } from "../pages/Checklist/AddChecklist"; // Adjust path as necessary

const DB_TABLE_NAME = "checklists";

// Function to get all checklists
export const getChecklists = async (): Promise<Checklist[]> => {
  try {
    const response = await api.get(`/${DB_TABLE_NAME}`);
    // Attempt to join customer name if not directly available
    // This is a placeholder, actual implementation depends on your customer data source
    const checklistsWithCustomerNames = await Promise.all(response.data.map(async (checklist: Checklist) => {
      if (!checklist.customerName && checklist.customerId) {
        try {
          const customerResponse = await api.get(`/customers?customerCode=${checklist.customerId}`);
          // Assuming the customer endpoint returns an array and we take the first match
          const customer = customerResponse.data.find((c:any) => c.customerCode === checklist.customerId);
          return { ...checklist, customerName: customer ? customer.airlineName : "N/A" };
        } catch (customerError) {
          console.error(`Failed to fetch customer details for ${checklist.customerId}`, customerError);
          return { ...checklist, customerName: "Error fetching name" };
        }
      }
      return checklist;
    }));
    return checklistsWithCustomerNames;
  } catch (error) {
    console.error("Error fetching checklists:", error);
    throw error;
  }
};

// Function to add a new checklist
export const addChecklist = async (checklistData: ChecklistFormData): Promise<Checklist> => {
  try {
    const response = await api.post(`/${DB_TABLE_NAME}`, checklistData);
    return response.data;
  } catch (error) {
    console.error("Error adding checklist:", error);
    throw error;
  }
};

// Function to get a single checklist by ID (Optional)
export const getChecklistById = async (id: string): Promise<Checklist> => {
  try {
    const response = await api.get(`/${DB_TABLE_NAME}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching checklist with id ${id}:`, error);
    throw error;
  }
};

// Function to update a checklist (Optional)
export const updateChecklist = async (id: string, checklistData: Partial<ChecklistFormData>): Promise<Checklist> => {
  try {
    const response = await api.patch(`/${DB_TABLE_NAME}/${id}`, checklistData);
    return response.data;
  } catch (error) {
    console.error(`Error updating checklist with id ${id}:`, error);
    throw error;
  }
};

// Function to delete a checklist (Optional)
export const deleteChecklist = async (id: string): Promise<void> => {
  try {
    await api.delete(`/${DB_TABLE_NAME}/${id}`);
  } catch (error) {
    console.error(`Error deleting checklist with id ${id}:`, error);
    throw error;
  }
};
