import AppLayout from "./components/Layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "customers", element: <Dashboard /> },
    ],
  },
];
