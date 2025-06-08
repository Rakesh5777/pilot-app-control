import AppLayout from "./components/Layout/AppLayout";
import AddCustomerForm from "./pages/Customers/AddCustomers";
import Customers from "./pages/Customers/Customers";
import AddContact from "./pages/Contacts/AddContact";
import Contacts from "./pages/Contacts/Contacts";
import AddChecklist from "./pages/Checklist/AddChecklist";
import ChecklistPage from "./pages/Checklist/Checklist";
import AddAFRData from "./pages/AFRData/AddAFRData";
import AFRData from "./pages/AFRData/AFRData";
import { Navigate } from "react-router-dom";

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/customers" replace /> },
      { index: true, element: <Customers /> },
      {
        path: "customers",
        children: [
          { index: true, element: <Customers /> },
          { path: "add", element: <AddCustomerForm /> },
          { path: "edit/:id", element: <AddCustomerForm mode="edit" /> },
          { path: "add/contact", element: <AddContact /> },
          { path: "add/checklist", element: <AddChecklist /> },
          { path: "add/afrdata", element: <AddAFRData /> },
        ],
      },
      {
        path: "contacts", // New Route for Contacts
        children: [
          { index: true, element: <Contacts /> },
          { path: "add", element: <AddContact /> },
        ],
      },
      {
        path: "checklist", // New Route for Checklist
        children: [
          { index: true, element: <ChecklistPage /> },
          { path: "add", element: <AddChecklist /> },
        ],
      },
      {
        path: "afrdata", // New Route for AFR Data
        children: [
          { index: true, element: <AFRData /> },
          { path: "add", element: <AddAFRData /> },
        ],
      },
    ],
  },
];