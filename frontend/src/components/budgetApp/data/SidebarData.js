import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as Fa6Icons from "react-icons/fa6";
import * as TbIcons from "react-icons/tb";

export const SidebarData = [
  {
    title: "Home",
    path: "/app",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-item",
  },
  {
    title: "Expenses",
    path: "/app/expenses",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-item",
  },
  {
    title: "Incomes",
    path: "/app/incomes",
    icon: <Fa6Icons.FaMoneyBillTransfer />,
    cName: "nav-item",
  },
  {
    title: "Budget",
    path: "/app/budget",
    icon: <TbIcons.TbMoneybag />,
    cName: "nav-item",
  },
  {
    title: "Cashflow",
    path: "/app/cashflow",
    icon: <TbIcons.TbZoomMoney />,
    cName: "nav-item",
  },
];