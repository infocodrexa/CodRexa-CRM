import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaStickyNote,
  FaTasks,
  FaUserTie,
  FaClipboardList,
  FaPlus,
  FaList,
  FaInfoCircle,
} from "react-icons/fa";

import { ROLES } from "../constants/roles";

const propertyChildren = [
  { to: "/dashboard/properties/add", label: "Add Property", icon: <FaPlus /> },
  {
    to: "/dashboard/properties/list",
    label: "Property List",
    icon: <FaList />,
  },
  {
    to: "/dashboard/properties/detail",
    label: "Property Detail",
    icon: <FaInfoCircle />,
  },
];

export const menuConfig = {
  [ROLES.DEVELOPER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/users", label: "User Management", icon: <FaUsers /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/notes", label: "Notes", icon: <FaStickyNote /> },
    { to: "/dashboard/tasks", label: "Dev Tools", icon: <FaTasks /> },
  ],

  [ROLES.ADMIN]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/users", label: "User Management", icon: <FaUsers /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/notes", label: "Notes", icon: <FaStickyNote /> },
  ],

  [ROLES.MANAGER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/team", label: "Team Users", icon: <FaUsers /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/reports", label: "Reports", icon: <FaClipboardList /> },
  ],

  [ROLES.TEAM_LEADER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/team", label: "Executives", icon: <FaUsers /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/tasks", label: "Team Tasks", icon: <FaTasks /> },
  ],

  [ROLES.EXECUTIVE]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/notes", label: "Notes", icon: <FaStickyNote /> },
  ],

  [ROLES.TELEMARKETER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/leads", label: "Leads", icon: <FaUsers /> },
    { to: "/dashboard/calls", label: "Call Logs", icon: <FaClipboardList /> },
  ],

  [ROLES.BDM]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/deals", label: "Business Deals", icon: <FaTasks /> },
  ],

  [ROLES.OFFICE_BOY]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/tasks", label: "Daily Tasks", icon: <FaTasks /> },
  ],

  [ROLES.SALES_EXECUTIVE]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/leads", label: "Leads", icon: <FaUsers /> },
  ],

  [ROLES.BDO]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/projects", label: "Projects", icon: <FaBuilding /> },
  ],

  [ROLES.PROJECT_INCHARGE]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    {
      to: "/dashboard/projects",
      label: "Manage Projects",
      icon: <FaBuilding />,
    },
  ],

  [ROLES.PROJECT_MANAGER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    {
      to: "/dashboard/projects",
      label: "Project Reports",
      icon: <FaClipboardList />,
    },
  ],

  [ROLES.BDE]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/leads", label: "Leads", icon: <FaUsers /> },
  ],

  [ROLES.HR_MANAGER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    { label: "Properties", icon: <FaBuilding />, children: propertyChildren },
    { to: "/dashboard/employees", label: "Employees", icon: <FaUserTie /> },
    {
      to: "/dashboard/reports",
      label: "HR Reports",
      icon: <FaClipboardList />,
    },
  ],

  [ROLES.USER]: [
    { to: "/dashboard", label: "Home", icon: <FaHome /> },
    {
      label: "My Properties",
      icon: <FaBuilding />,
      children: propertyChildren,
    },
    { to: "/dashboard/notes", label: "My Notes", icon: <FaStickyNote /> },
  ],
};
