/**
import TestingUser from './components/TestingUser';
import TestRBoot from './components/TestRBoot'
import Orb from './components/Orb';
import Sidebar from './components/Sidebar';
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';



function App() {

   return(
      <>
         <Orb/>
         
      </>
      
   )
   
}
*/

import React from "react";
import { createRoot } from "react-dom/client";
import {
   createBrowserRouter,
   RouterProvider,
   Router,
   Link,
   Outlet,
} from 'react-router-dom';
import Products from "./routes/Products"
import Home from "./routes/Home"
import Reports from "./routes/Reports"
import Sidebar from "./components/Sidebar";

const AppLayout = () => (
   <>
   <Sidebar/>
   <Outlet />
   </>
)

const router = createBrowserRouter([
   {
      element: <AppLayout />,
      children: [
         {
            path: "/",
            element: <Home />
         },
         {
            path: "products",
            element: <Products />
         },
         {
            path: "reports",
            element: <Reports />
         },
      ],
   },
]);

export default function App() {
   return(
      <RouterProvider router={router} fallbackElement={<p>Initial load...</p>}/>
   )
}