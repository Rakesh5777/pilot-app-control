import AppLayout from "./components/Layout/AppLayout";
import AddCustomerForm from "./pages/Customers/AddCustomers";
import Customers from "./pages/Customers/Customers";
import AddContact from "./pages/Contacts/AddContact";
import Contacts from "./pages/Contacts/Contacts";
import AddChecklist from "./pages/Checklist/AddChecklist";
import ChecklistPage from "./pages/Checklist/Checklist";

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Customers /> },
      {
        path: "customers",
        children: [
          { index: true, element: <Customers /> },
          { path: "add", element: <AddCustomerForm /> },
          // Route for adding contact after customer
          { path: "add/contact", element: <AddContact /> },
          // Route for adding checklist after contact in customer creation flow
          { path: "add/checklist", element: <AddChecklist /> },
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
    ],
  },
];