import AppLayout from "./components/Layout/AppLayout";
import AddCustomer from "./pages/Customers/AddCustomers";
import Customers from "./pages/Customers/Customers";

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
          { path: "add", element: <AddCustomer /> },
        ],
      },
    ],
  },
];
