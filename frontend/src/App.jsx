import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Icons
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'remixicon/fonts/remixicon.css'
// import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
// import components
import Login from "./components/login/Login"
import AppLayout from "./components/budgetApp/AppLayout";
import Home from "./components/budgetApp/routes/Home/Home";
import Expenses from "./components/budgetApp/routes/Expenses/Expenses";
import Incomes from "./components/budgetApp/routes/Incomes/Incomes";
import Budget from "./components/budgetApp/routes/Budget/Budget";
import Cashflow from "./components/budgetApp/routes/Wallets/Wallets";

// import stylesheet
import "./App.css"

function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/app/*" element={<AppLayout />} />
      </Routes>
      
      <Routes>
         <Route path='/app' element = {<Home />}/>
         <Route path='/app/expenses' element = {<Expenses />}/>
         <Route path='/app/incomes' element = {<Incomes />}/>
         <Route path='/app/budget' element = {<Budget />}/>
         <Route path='/app/cashflow' element = {<Cashflow />}/>
      </Routes>
      
    </BrowserRouter>
  );
}

export default App;