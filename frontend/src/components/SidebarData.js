import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as Fa6Icons from "react-icons/fa6";
import * as TbIcons from "react-icons/tb";
import * as CiIcons from "react-icons/ci";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Expenses",
    path: "/expenses",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "Incomes",
    path: "/incomes",
    icon: <Fa6Icons.FaMoneyBillTransfer />,
    cName: "nav-text",
  },
  {
    title: "Budget",
    path: "/budget",
    icon: <TbIcons.TbMoneybag />,
    cName: "nav-text",
  },
  {
    title: "Cashflow",
    path: "/cashflow",
    icon: <TbIcons.TbZoomMoney />,
    cName: "nav-text",
  },
  {
    title: "Logout",
    path: "/logout",
    icon: <CiIcons.CiLogout />,
    cName: "nav-text",
  },
];