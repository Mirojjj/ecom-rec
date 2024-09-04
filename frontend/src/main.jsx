import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import {
//   RouterProvider,
//   createBrowserRouter,
//   Route,
//   createRoutesFromElements,
// } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/AdminDashboardPage";

// Create the router using createBrowserRouter
// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       <Route path="/" element={<App />} />
//       <Route path="/admin" element={<AdminPage />}>
//         <Route path="dashboard" element={<DashboardPage />} />
//       </Route>
//       <Route path="*" element={<></>} />
//     </>
//   )
// );

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </StrictMode>
);
