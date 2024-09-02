import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter as Router,
} from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import AdminPage from "./pages/AdminPage";

const router = Router([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "*",
    element: <></>,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </StrictMode>
);
