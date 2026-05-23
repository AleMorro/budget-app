// import react utilities
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
import PreviousYears from "./components/budgetApp/routes/PreviousYears/PreviousYears";
import CategorySettings from "./components/budgetApp/routes/CategorySettings/CategorySettings";
import StockWatch from "./components/budgetApp/routes/StockWatch/StockWatch";
import SettingsHub from "./components/budgetApp/routes/Settings/SettingsHub";
import MyProfile from "./components/budgetApp/routes/Profile/MyProfile";
import AccountSettings from "./components/budgetApp/routes/Profile/AccountSettings";
import HelpPage from "./components/budgetApp/routes/Help/HelpPage";
import RequireAuth from "./components/budgetApp/RequireAuth";

// import stylesheet
import "./App.css"
import "./styles/darkTheme.css"

function App() {

   // setting the various router for the application
   return (
      <BrowserRouter>

         <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/app/*" element={<AppLayout />} />
         </Routes>
         
         <Routes>
            <Route path='/app' element = {<RequireAuth><Home /></RequireAuth>}/>
            <Route path='/app/expenses' element = {<RequireAuth><Expenses /></RequireAuth>}/>
            <Route path='/app/incomes' element = {<RequireAuth><Incomes /></RequireAuth>}/>
            <Route path='/app/category-settings' element = {<RequireAuth><CategorySettings /></RequireAuth>}/>
            <Route path='/app/settings' element = {<RequireAuth><SettingsHub /></RequireAuth>}/>
            <Route path='/app/settings/account' element = {<RequireAuth><AccountSettings /></RequireAuth>}/>
            <Route path='/app/profile' element = {<RequireAuth><MyProfile /></RequireAuth>}/>
            <Route path='/app/help' element = {<RequireAuth><HelpPage /></RequireAuth>}/>
            <Route path='/app/budget' element = {<RequireAuth><Budget /></RequireAuth>}/>
            <Route path='/app/cashflow' element = {<RequireAuth><Cashflow /></RequireAuth>}/>
            <Route path='/app/previous-years' element = {<RequireAuth><PreviousYears /></RequireAuth>}/>
            <Route path='/app/stocks' element = {<RequireAuth><StockWatch /></RequireAuth>}/>
         </Routes>
         
      </BrowserRouter>
   );
}

export default App;