import AppLayout from "./components/Layout/AppLayout";
import AddCustomerForm from "./pages/Customers/AddCustomers";
import Customers from "./pages/Customers/Customers";
import AddContact from "./pages/Contacts/AddContact";
import Contacts from "./pages/Contacts/Contacts";

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
        ],
      },
      {
        path: "contacts", // New Route for Contacts
        children: [
          { index: true, element: <Contacts /> },
          { path: "add", element: <AddContact /> },
        ],
      },
    ],
  },
];