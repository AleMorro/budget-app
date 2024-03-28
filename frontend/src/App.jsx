import React from "react";
import { createRoot } from "react-dom/client";
import {
   createBrowserRouter,
   RouterProvider,
   Router,
   Link,
   Outlet,
} from 'react-router-dom';

import Home from "./routes/Home";
import Expenses from "./routes/Expenses";
import Incomes from "./routes/Incomes";
import Budget from "./routes/Budget";
import Cashflow from "./routes/Cashflow";

import Header from "./components/Header";

// import Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css'

// import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";

const AppLayout = () => (
   <>
      <Header />
      <Sidebar />
      <Outlet />
   </>
)

// Creates a routes to provide different element in the same page
const router = createBrowserRouter([
   {
      element: <AppLayout />,
      children: [
         {
            path: "/",
            element: <Main />
         },
         {
            path: "expenses",
            element: <Expenses />
         },
         {
            path: "incomes",
            element: <Incomes />
         },
         {
            path: "budget",
            element: <Budget />
         },
         {
            path: "cashflow",
            element: <Cashflow />
         },
      ],
   },
]);

// Export App function to router in index.js
export default function App() {
   return(
      <RouterProvider router={router} />
   )
}