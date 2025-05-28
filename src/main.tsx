import { ThemeProvider } from "next-themes";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import { ChakraProvider } from "@chakra-ui/react";
import system from "@/theme";
import { Toaster } from "./components/ui/toaster";

const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider value={system}>
      <ThemeProvider forcedTheme="light" attribute="class" enableSystem={false}>
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);
