import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as Fa6Icons from "react-icons/fa6";
import * as TbIcons from "react-icons/tb";

/** @typedef {{ title: string, path: string, icon: React.ReactNode, cName?: string }} NavItem */
/** @typedef {{ title: string, icon: React.ReactNode, cName?: string, children: NavItem[] }} NavGroup */

export const SidebarNavItems = [
   {
      title: "Home",
      path: "/app",
      icon: <AiIcons.AiFillHome />,
      cName: "nav-item",
   },
   {
      title: "Wallets",
      path: "/app/cashflow",
      icon: <TbIcons.TbZoomMoney />,
      cName: "nav-item",
   },
   {
      title: "Budget",
      path: "/app/budget",
      icon: <TbIcons.TbMoneybag />,
      cName: "nav-item",
   },
   {
      title: "Incomes",
      path: "/app/incomes",
      icon: <Fa6Icons.FaMoneyBillTransfer />,
      cName: "nav-item",
   },
   {
      title: "Expenses",
      path: "/app/expenses",
      icon: <IoIcons.IoIosPaper />,
      cName: "nav-item",
   },
   {
      title: "Previous Years",
      path: "/app/previous-years",
      icon: <AiIcons.AiOutlineLineChart />,
      cName: "nav-item",
   },
   {
      title: "Portafoglio",
      path: "/app/stocks",
      icon: <TbIcons.TbChartLine />,
      cName: "nav-item",
   },
];

/** Per PageTitle breadcrumb (titolo pagina → voce menu) */
export const SidebarData = [
   ...SidebarNavItems,
   { title: "Impostazioni", icon: <AiIcons.AiOutlineSetting /> },
   { title: "Impostazioni account", icon: <AiIcons.AiOutlineSetting /> },
   { title: "Il mio profilo", icon: <AiIcons.AiOutlineUser /> },
   { title: "Guida e FAQ", icon: <AiIcons.AiOutlineQuestionCircle /> },
   { title: "Portafoglio investimenti", icon: <TbIcons.TbChartLine /> },
];

export const SettingsNavGroup = {
   title: "Settings",
   icon: <AiIcons.AiOutlineSetting />,
   cName: "nav-item",
   children: [
      {
         title: "Tema",
         path: "/app/settings#settings-theme",
         icon: <TbIcons.TbMoon />,
      },
      {
         title: "Categories",
         path: "/app/settings#settings-categories",
         icon: <AiIcons.AiOutlineTags />,
      },
      {
         title: "Account",
         path: "/app/settings#settings-account",
         icon: <AiIcons.AiOutlineUser />,
      },
   ],
};
